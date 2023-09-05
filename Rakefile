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

ci_cloudformations = []
branch = ENV['BRANCH'] || Dev::Git.new.branch_name(dir: "#{ROOT_DIR}")
ci_cloudformations << Dev::Aws::Cloudformation.new(
    "DevelopmentPipeline-givesource-#{branch.split('/')[-1].split('GD-')[-1]}",
    "#{ROOT_DIR}/ops/aws/cloudformation/ci/branch.yml",
    parameters: Dev::Aws::Cloudformation::Parameters.new(
      BranchName: branch
    ),
    capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM']
  )
Dev::Template::Aws::Ci.new(ci_cloudformations)

# Configure docker required versions and create tasks
Dev::Docker.configure do |c|
  c.min_version = '23.0.0'
end

Dev::Docker::Compose.configure do |c|
  c.max_version = '3.0.0'
end
Dev::Template::Docker::Default.new(exclude: %i[push pull])

# Configure git required version and create tasks
Dev::Git.configure do |c|
  c.min_version = '2.27.0'
end
Dev::Template::Git.new

# Configure software versions used and create tasks
Dev::EndOfLife.config do |c|
  c.product_versions = [
    Dev::EndOfLife::ProductVersion.new('nodejs', '14', 'the version of node running in the lambdas'),
    Dev::EndOfLife::ProductVersion.new('nodejs', '18', 'the version of node running in the local dev environment')
  ]
end
Dev::Template::Eol.new

# Create default tasks for the app
Dev::Template::Docker::Application.new(APP_IDENTIFIER)
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
     Dev::Docker::Compose.new(services: 'app').exec(*command)
  end

  desc 'Run the tests for Givesource'
  task lint: %i[init_docker up_no_deps] do
      command = Dev::Node.new(container_path: '/usr/src/app').base_command
      command << 'run' << 'lint'
     Dev::Docker::Compose.new(services: 'app').exec(*command)
  end

  namespace :test do
    desc 'Run the tests with coverage for Givesource'
    task coverage: %i[init_docker up_no_deps] do
         command = Dev::Node.new(container_path: '/usr/src/app/packages/lambda').base_command
         command << 'run' << 'test:coverage'
        Dev::Docker::Compose.new(services: 'app').exec(*command)
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

# Add some custom pre/post tasks
task _pre_up_hooks: %w[init_docker ensure_aws_credentials] do
  Dev::Aws::Credentials.new.export!
end

# Add a task to open our docuemtnation in a browser
desc 'Open a browser showing the givesource documentation'
task :docs do
  Launchy.open('https://github.com/firespring/givesource-ops/wiki')
end
