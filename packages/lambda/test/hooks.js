const sinon = require('sinon')

const Request = require('../src/aws/request')
const SecretsManager = require('../src/aws/secretsManager')
const Ssm = require('../src/aws/ssm')

exports.mochaHooks = {
  beforeEach () {
    // needed for retrieving models - a db object is needed for sequalize
    // the db connection doesn't need to be function, but we don't want to try to get real creds and fail
    sinon.stub(SecretsManager.prototype, 'getSecretValue').resolves({ SecretString: '{}' })
    sinon.stub(Ssm.prototype, 'getParameter').resolves({ Parameter: { Value: '' } })

    // Stub API access to be allowed
    sinon.stub(Request.prototype, 'validate').resolves(true)
  },
  afterEach () {
    // restore all stubs
    sinon.restore()
  }
}
