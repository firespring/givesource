# frozen_string_literal: true

$stdout.sync = true

require 'rubygems'
require 'bundler/setup'
require 'firespring_dev_commands'

# Configure AWS accounts and create tasks
Dev::Aws::Account.configure do |c|
  c.root = Dev::Aws::Account::Info.new('FDP Root', '020401666882')
  c.children = [
    Dev::Aws::Account::Info.new('Givesource Prod', '016226103026'),
    Dev::Aws::Account::Info.new('Givesource Dev', '948629139753')
  ]
end
Dev::Template::Aws.new

Dev::Docker.configure do |c|
  c.min_version = '20.10.3'
end

Dev::Docker::Compose.configure do |c|
  c.min_version = '1.28.5'
  c.max_version = '3.0.0'
end

Dev::Git.configure do |c|
  c.min_version = '2.27.0'
end
Dev::Template::Git.new

Dev::EndOfLife.config do |c|
  c.product_versions = [
    Dev::EndOfLife::ProductVersion.new('nodejs', '14', 'the version of node running in the lambdas and containers')
  ]
end
Dev::Template::Eol.new

Dev::Template::Docker::Default.new(exclude: %i[push pull])

# Add some custom pre/post tasks
task _pre_up_hooks: %w[init_docker ensure_aws_credentials] do
  Dev::Aws::Credentials.new.export!
end

namespace :npm do
  desc 'Run all audit commands'
  task audit: %w(cloudformation:npm:audit frontend:npm:audit lambda:npm:audit) do
    # Run audit subcommands
  end

  desc 'Run all clean commands'
  task clean: %w(cloudformation:npm:clean frontend:npm:clean lambda:npm:clean) do
    # Run clean subcommands
  end

  desc 'Run all build commands'
  task build: %w(cloudformation:npm:build frontend:npm:build lambda:npm:build) do
    # Run build subcommands
  end

  desc 'Run all deploy commands'
  task deploy: %w(cloudformation:npm:deploy frontend:npm:deploy lambda:npm:deploy) do
    # Run deploy subcommands
  end

  desc 'Run all install commands'
  task install: %w(cloudformation:node:install frontend:node:install lambda:node:install) do
    # Run install subcommands
  end

  desc 'Run all release commands'
  task release: %w(cloudformation:npm:release frontend:npm:release lambda:npm:release) do
    # Run release subcommands
  end

  namespace :release do
    desc 'Run all release:force commands'
    task force: %w(cloudformation:npm:release:force frontend:npm:release:force lambda:npm:release:force) do
      # Run release:force subcommands
    end
  end
end
