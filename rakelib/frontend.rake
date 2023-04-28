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

    namespace :dev do
      desc 'Open browser windows to ports 3000-3003 (local dev)'
      task gui: %w[init_docker up_no_deps] do
        Launchy.open("http://127.0.0.1:3000")
        sleep 0.5
        Launchy.open("http://127.0.0.1:3001")
        sleep 0.5
        Launchy.open("http://127.0.0.1:3002")
        sleep 0.5
        Launchy.open("http://127.0.0.1:3003")
      end
    end
  end
end
