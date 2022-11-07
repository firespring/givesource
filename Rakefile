$stdout.sync = true

require 'rubygems'
require 'bundler/setup'
require 'dev_commands'

# Configure AWS accounts and create tasks
Dev::Aws::Account::configure do |c|
  c.root = Dev::Aws::Account::Info.new('FDP Root', '020401666882')
  c.children = [
    Dev::Aws::Account::Info.new('Givesource Prod', '016226103026'),
    Dev::Aws::Account::Info.new('Givesource Dev', '948629139753')
  ]
end
Dev::Template::Aws.new
