Dev::Template::Docker::Application.new('cloudformation', exclude: [:pull, :push])
Dev::Template::Docker::Node::Application.new(
  'cloudformation',
  local_path: "#{DEV_COMMANDS_ROOT_DIR}/packages/cloudformation",
  container_path: '/var/task',
  exclude: [:lint, :test]
)
# TODO: Is Node correct here? (I think it is)
# TODO: Add cloudformation template linting? Does it work when we have s/r templates? Do we need to compile them first and then lint?

# TODO: What do we do with these?
#    "cloudformation:build": "cd packages/cloudformation && npm run build",
#    "cloudformation:clean": "cd packages/cloudformation && npm run clean",
#    "cloudformation:create": "cd packages/cloudformation && npm run create",
#    "cloudformation:delete": "cd packages/cloudformation && npm run delete",
#    "cloudformation:release": "cd packages/cloudformation && npm run release",
#    "cloudformation:release:force": "cd packages/cloudformation && npm run release:force",
#    "cloudformation:update": "cd packages/cloudformation && npm run update",
