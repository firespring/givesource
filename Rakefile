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

# Configure AWS accounts and create tasks
Dev::Aws::Account::configure do |c|
  c.root = Dev::Aws::Account::Info.new(ENV['ORG_ACCOUNT_NAME'], ENV['ORG_ACCOUNT_ID'])
  c.children = []
  c.children << Dev::Aws::Account::Info.new(ENV['PRD_ACCOUNT_NAME'], ENV['PRD_ACCOUNT_ID']) unless ENV['PRD_ACCOUNT_ID'].to_s.blank?
  c.children << Dev::Aws::Account::Info.new(ENV['DEV_ACCOUNT_NAME'], ENV['DEV_ACCOUNT_ID']) unless ENV['DEV_ACCOUNT_ID'].to_s.blank?
end
Dev::Template::Aws.new

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
Dev::Template::Docker::Application.new(APP_IDENTIFIER, exclude: %i[pull push])
namespace APP_IDENTIFIER do
  desc 'Start up a dev server for our frontend assets'
  task dev: %i[init_docker up_no_deps] do
    command = Dev::Node.new(container_path: '/usr/src/app/packages/frontend').base_command
    command << 'run' << 'dev'
    Dev::Docker::Compose.new(services: APP_IDENTIFIER).exec(*command)
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
