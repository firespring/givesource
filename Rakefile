# frozen_string_literal: true
$stdout.sync = true

require 'rubygems'
require 'bundler/setup'
require 'firespring_dev_commands'
require 'launchy'

# The identifier used for the app's rake commands
APP_IDENTIFIER = 'app'

# Load .env file
Dotenv.load

#Create some top level constants
ROOT_DIR = File.realpath(File.dirname(__FILE__))

# Configure AWS accounts and create tasks
Dev::Aws::Account::configure do |c|
  c.root = Dev::Aws::Account::Info.new(ENV['ORG_ACCOUNT_NAME'], ENV['ORG_ACCOUNT_ID'])
  c.children = []
  c.children << Dev::Aws::Account::Info.new(ENV['PRD_ACCOUNT_NAME'], ENV['PRD_ACCOUNT_ID']) unless ENV['PRD_ACCOUNT_ID'].to_s.blank?
  c.children << Dev::Aws::Account::Info.new(ENV['DEV_ACCOUNT_NAME'], ENV['DEV_ACCOUNT_ID']) unless ENV['DEV_ACCOUNT_ID'].to_s.blank?
  c.ecr_registry_ids = ['300448126090']
  c.login_to_account_ecr_registry = true
end
Dev::Template::Aws.new

# Configure the tasks for the ci pipelines
ci_cloudformations = []
branch = ENV['BRANCH'] || Dev::Git.new.branch_name(dir: "#{ROOT_DIR}")
branch = branch.split(/\s/)[-1] if branch.include?('detached')
ci_cloudformations << Dev::Aws::Cloudformation.new(
  "DevelopmentPipeline-givesource-#{branch.split('/')[-1].split('GD-')[-1]}",
  "#{ROOT_DIR}/ops/aws/cloudformation/ci/branch.yml",
  parameters: Dev::Aws::Cloudformation::Parameters.new(
    BranchName: branch
  ),
  capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM']
)
Dev::Template::Aws::Ci.new(ci_cloudformations)

# Set the docker tag based off the current branch name
ENV['GIVESOURCE_TAG'] = branch.split('/')[-1]

# Configure docker required versions
Dev::Docker.configure do |c|
  c.min_version = '23.0.0'
end

# Configure docker compose required versions
Dev::Docker::Compose.configure do |c|
  c.max_version = '3.0.0'
end

# Create default docker tasks
Dev::Template::Docker::Default.new(exclude: %i[push pull])

# Configure to work with docker desktop
Dev::Docker::Desktop.new.configure

# Configure git required version and create tasks
Dev::Git.configure do |c|
  c.min_version = '2.27.0'
end
Dev::Template::Git.new

# Configure software versions used and create tasks
Dev::EndOfLife.config do |c|
  c.product_versions = [
    Dev::EndOfLife::ProductVersion.new('debian', '12', 'the OS version in the local dev environment'),
    Dev::EndOfLife::ProductVersion.new('nodejs', '18', 'the version of node running in the local dev environment')
  ]
end
Dev::Template::Eol.new

# Create default tasks for the app
Dev::Template::Docker::Application.new(APP_IDENTIFIER)
Dev::Template::Docker::Node::Application.new('app', exclude: [:test, :lint, :audit])
namespace APP_IDENTIFIER do
  desc 'Start up a dev server for our frontend assets'
  task dev: %i[init_docker up_no_deps] do
    command = Dev::Node.new(container_path: '/usr/src/app/packages/frontend').base_command
    command << 'run' << 'dev'
    Dev::Docker::Compose.new(services: APP_IDENTIFIER).exec(*command)
  end

  desc 'Run the tests for Givesource'
  task test: %i[init_docker up_no_deps] do
    command = Dev::Node.new(container_path: '/usr/src/app').base_command
    command << 'run' << 'test'
    Dev::Docker::Compose.new(services: APP_IDENTIFIER).exec(*command)
  end

  desc 'Run the linter for Givesource'
  task lint: %i[init_docker up_no_deps] do
    command = Dev::Node.new(container_path: '/usr/src/app').base_command
    command << 'run' << 'lint'
    Dev::Docker::Compose.new(services: APP_IDENTIFIER).exec(*command)
  end

  namespace :lint do
    desc 'Run the linter for Givesource and fix everything that is auto-fixable'
    task fix: %i[init_docker up_no_deps] do
      command = Dev::Node.new(container_path: '/usr/src/app').base_command
      command << 'run' << 'lint:fix'
      Dev::Docker::Compose.new(services: APP_IDENTIFIER).exec(*command)
    end
  end

  desc 'Run an audit for Givesource packages'
  task audit: %i[init_docker up_no_deps] do
    ENV['IGNORELIST'] ||= Dev::Aws::Parameter.new.get_value('/Firespring/CiCd/Ignorelist/node')
    puts
    puts "The IGNORELIST is set to [ #{ENV.fetch('IGNORELIST', nil)} ]"
    puts

    %w(/usr/src/app /usr/src/app/packages/cloudformation /usr/src/app/packages/frontend /usr/src/app/packages/lambda).each do |container_path|
      node = Dev::Node.new(container_path: container_path)
      compose = Dev::Docker::Compose.new(services: APP_IDENTIFIER, capture: true)
      audit_data = compose.exec(*node.audit_command)
      Dev::Node::Audit.new(audit_data).to_report.check
    end
  end

  namespace :test do
    desc 'Run the tests with coverage for Givesource'
    task coverage: %i[init_docker up_no_deps] do
      command = Dev::Node.new(container_path: '/usr/src/app/packages/lambda').base_command
      command << 'run' << 'test:coverage'
      Dev::Docker::Compose.new(services: APP_IDENTIFIER).exec(*command)
    end
  end

  namespace :dev do
    desc 'Open browser windows to ports 3000-3003 (local dev)'
    task gui: %w[init_docker up_no_deps] do
      Launchy.open("http://localhost:3000")
      sleep 0.5
      Launchy.open("http://localhost:3001")
      sleep 0.5
      Launchy.open("http://localhost:3002")
      sleep 0.5
      Launchy.open("http://localhost:3003")
    end
  end
end

#Dev::Template::Application::Config.new('cicd', '/Firespring/CiCd')
#/global/database
#/recaptcha/secure

# Add some custom pre/post tasks
task _pre_up_hooks: %w[init_docker ensure_aws_credentials] do
  Dev::Aws::Credentials.new.export!
end

# Add a task to open our docuemtnation in a browser
desc 'Open a browser showing the givesource documentation'
task :docs do
  branch_name = Dev::Git.new.branch_name
  url = "https://github.com/firespring/givesource/blob/#{branch_name}/documentation/table-of-contents.md"
  puts "Opening #{url} in a browser window..."
  Launchy.open(url)
end

namespace :eol do
  task :node do
    alt_dir_node_eol(File.join(ROOT_DIR, 'packages/cloudformation'))
    alt_dir_node_eol(File.join(ROOT_DIR, 'packages/frontend'))
    alt_dir_node_eol(File.join(ROOT_DIR, 'packages/lambda'))
  end
end

def alt_dir_node_eol(local_path)
  node = Dev::Node.new(local_path:)
  eol = Dev::EndOfLife::Node.new(node)
  node_products = eol.default_products

  puts
  puts "Node product versions (in #{eol.lockfile})".light_yellow
  Dev::EndOfLife.new(product_versions: node_products).status
end
