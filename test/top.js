function importTest(name, path) {
  describe(name, function () {
    require(path)
  })
}

describe('react-gsap-enhancer', function () {
  importTest('target', './target/test.js')
  importTest('attachRefs', './attachRefs/test.js')
  importTest('target', './animation/test.js')
  importTest('gsap-enhancer', './gsap-enhancer/test.js')
})
