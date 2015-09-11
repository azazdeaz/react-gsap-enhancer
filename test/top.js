function importTest(name, path) {
  describe(name, function () {
    require(path)
  })
}

describe('react-gsap-enhancer', function () {
  require('./target/test.js')
  require('./attachRefs/test.js')
  require('./animation/test.js')
  require('./gsap-enhancer/test.js')
  require('./utils/test.js')
})
