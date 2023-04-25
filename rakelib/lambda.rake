l_application =      Dev::Template::Docker::Application.new('lambda', exclude: [:pull, :push])
l_node_application = Dev::Template::Docker::Node::Application.new(
  'lambda',
  local_path: "#{DEV_COMMANDS_ROOT_DIR}/packages/lambda",
  container_path: '/var/task'
)

namespace :lambda do
  namespace :joe do
    # TODO: Should we call the 'npm run' versions or just move the commands here?

    npm_commands = %w(build clean delete-test-payments delete-payments-by-transaction-ids deploy release release:force seed setting test test:coverage test:dev webpack)
    npm_commands.each do |name|
      desc "Run the #{name} npm command inside of the lambda container"
      task name => [:init_docker, :up_no_deps] do
        command = l_node_application.instance_variable_get(:@node).base_command
        command << 'run' << name
        Dev::Docker::Compose.new(services: l_node_application.instance_variable_get(:@name)).exec(*command)
      end
    end
  end
end
