# frozen_string_literal: true

Dev::Template::Docker::Application.new('cloudformation', exclude: %i[pull push])
cf_node_application = Dev::Template::Docker::Node::Application.new(
  'cloudformation',
  local_path: "#{DEV_COMMANDS_ROOT_DIR}/packages/cloudformation",
  container_path: '/var/task',
  exclude: %i[lint test]
)

namespace :cloudformation do
  namespace :npm do
    npm_commands = %w[build clean create delete release release:force update]
    npm_commands.each do |name|
      desc "Run the #{name} npm command inside of the cloudformation container"
      task name => %w[init_docker up_no_deps] do
        command = cf_node_application.node.base_command
        command << 'run' << name
        Dev::Docker::Compose.new(services: cf_node_application.name).exec(*command)
      end
    end
  end
end
