f_application =      Dev::Template::Docker::Application.new('frontend', exclude: [:pull, :push])
f_node_application = Dev::Template::Docker::Node::Application.new(
  'frontend',
  local_path: "#{DEV_COMMANDS_ROOT_DIR}/packages/frontend",
  container_path: '/var/task',
  exclude: [:lint, :test]
)

namespace :frontend do
  namespace :npm do
    npm_commands = %w(build cache clean deploy dev fetch release release:force webpack webpack:watch)
    npm_commands.each do |name|
      desc "#{name.capitalize} all cloudformation files based off the templates"
      task name => %w(init_docker up_no_deps ensure_aws_credentials) do
        Dev::Aws::Credentials.new.export!
        # TODO: Make these variables accessible (For all of these)
        command = f_node_application.instance_variable_get(:@node).base_command
        command << 'run' << name
        Dev::Docker::Compose.new(services: f_node_application.instance_variable_get(:@name)).exec(*command)
      end
    end
  end
end
