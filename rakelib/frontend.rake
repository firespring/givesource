# frozen_string_literal: true

Dev::Template::Docker::Application.new('frontend', exclude: %i[pull push])
f_node_application = Dev::Template::Docker::Node::Application.new(
  'frontend',
  local_path: "#{DEV_COMMANDS_ROOT_DIR}/packages/frontend",
  container_path: '/var/task',
  exclude: %i[test]
)

namespace :frontend do
  namespace :npm do
    npm_commands = %w[build cache clean deploy dev fetch release release:force webpack webpack:watch]
    npm_commands.each do |name|
      desc "Run the #{name} npm command inside of the frontend container"
      task name => %w[init_docker up_no_deps] do
        command = f_node_application.node.base_command
        command << 'run' << name
        Dev::Docker::Compose.new(services: f_node_application.name).exec(*command)
      end
    end
  end
end
