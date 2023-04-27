cf_application =      Dev::Template::Docker::Application.new('cloudformation', exclude: [:pull, :push])
cf_node_application = Dev::Template::Docker::Node::Application.new(
  'cloudformation',
  local_path: "#{DEV_COMMANDS_ROOT_DIR}/packages/cloudformation",
  container_path: '/var/task',
  exclude: [:lint, :test]
)
# TODO: Add cloudformation template linting? Does it work when we have s/r templates? Do we need to compile them first and then lint?

namespace :cloudformation do
  namespace :npm do
    npm_commands = %w(build clean create delete release release:force update)
    npm_commands.each do |name|
      desc "#{name.capitalize} all cloudformation files based off the templates"
      task name => %w(init_docker up_no_deps) do
        command = cf_node_application.node.base_command
        command << 'run' << name
        Dev::Docker::Compose.new(services: cf_node_application.name).exec(*command)
      end
    end
  end
end
