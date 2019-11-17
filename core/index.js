var bob = require('@twilson63/bob')
var todos = require('./todos')
var dal = require('./dal')

module.exports = gateway => {
  if (!gateway) {
    gateway = dal  
  }
  return bob([todos], { gateway })
}
