function importTest(name, path) {
  describe(name, function () {
    require(path)
  })
}

describe('react-gsap-enhancer', function () {
  importTest('select', './select/test.js')
})
