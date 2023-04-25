$stdout.sync = true

require 'rubygems'
require 'bundler/setup'
require 'firespring_dev_commands'

# Configure AWS accounts and create tasks
Dev::Aws::Account::configure do |c|
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

#Dev::EndOfLife.config do |c|
#  c.product_versions = [
#    Dev::EndOfLife::ProductVersion.new('debian', '11', 'base OS version running in the container we use for test/package'),
#    Dev::EndOfLife::ProductVersion.new('docker-engine', '20.10', 'the docker version running in the container we use for test/package'),
#    Dev::EndOfLife::ProductVersion.new('ruby', '2.7', 'needed because limbxml2 is not available on Windows - this will eventually be fixed by WSL2'),
#    Dev::EndOfLife::ProductVersion.new('ruby', '3.1', 'the version of ruby running in the container we use for test/package')
#  ]
#end
#Dev::Template::Eol.new

Dev::Template::Docker::Default.new(exclude: [:push, :pull])
