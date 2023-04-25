cf_application =      Dev::Template::Docker::Application.new('cloudformation', exclude: [:pull, :push])
cf_node_application = Dev::Template::Docker::Node::Application.new(
  'cloudformation',
  local_path: "#{DEV_COMMANDS_ROOT_DIR}/packages/cloudformation",
  container_path: '/var/task',
  exclude: [:lint, :test]
)
# TODO: Is Node correct here? (I think it is)
# TODO: Add cloudformation template linting? Does it work when we have s/r templates? Do we need to compile them first and then lint?

namespace :cloudformation do
  namespace :template do
    # TODO: Should we call the 'npm run' versions or just move the commands here?

    npm_commands = %w(build clean create delete release release:force update)
    npm_commands.each do |name|
      desc "#{name.capitalize} all cloudformation files based off the templates"
      task name => [:init_docker, :up_no_deps] do
        LOG.debug("#{name.capitalize} cloudformation templates")
        # TODO: Make these variables accessible (For all of these)
        command = cf_node_application.instance_variable_get(:@node).base_command
        command << 'run' << name
        Dev::Docker::Compose.new(services: cf_node_application.instance_variable_get(:@name)).exec(*command)
      end
    end
  end
end
