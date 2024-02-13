const sinon = require('sinon')

const Request = require('../src/aws/request')
const SecretsManager = require('../src/aws/secretsManager')
const Ssm = require('../src/aws/ssm')

exports.mochaHooks = {
  // beforeAll () {},
  beforeEach () {
    sinon.stub(SecretsManager.prototype, 'getSecretValue').resolves({ SecretString: '{}' })
    sinon.stub(Ssm.prototype, 'getParameter').resolves({ Parameter: { Value: '' } })

    sinon.stub(Request.prototype, 'validate').resolves(true)
  },
  afterEach () {
    sinon.restore()
  }
  // afterAll: function () {}
}
