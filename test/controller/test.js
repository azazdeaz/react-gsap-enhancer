var chai = require('chai')
var assert = chai.assert
var spies = require('chai-spies')
chai.use(spies)
chai.should()

var Controller = require('../../src/Controller')

function wrapWarn() {
  const ori = console.warn
  const spy = chai.spy()
  console.warn = spy
  return [spy, () => console.warn = ori]
}

function createMockGSAPAnimation() {
  var mock = {}
  var paused = false
  mock.time = chai.spy((v) => v === undefined ? 0 : mock)
  mock.pause = chai.spy(() => {
    paused = true
    return mock
  })
  mock.delay = chai.spy(() => 0)
  mock.paused = chai.spy(() => paused)
  mock.invalidate = chai.spy(() => mock)
  mock.restart = chai.spy(() => mock)
  mock.kill = chai.spy(() => mock)
  mock.play = chai.spy(() => mock)
  return mock
}

describe('Controller', () => {
  it('is a function', () => {
    assert.isFunction(Controller)
  })

  it('is instantiable', () => {
    assert.isObject(new Controller())
  })

  describe('- attach and detach', () => {
    const _options = {}
    const _target = {}
    const remove = chai.spy()
    const mockGSAPAnimation = createMockGSAPAnimation()
    const animationSource = chai.spy(({target, options}) => {
      it('pass target to the animationSource function', () => {
        assert.strictEqual(_target, target)
      })
      it('pass options to the animationSource function', () => {
        assert.strictEqual(_options, options)
      })
      return mockGSAPAnimation
    })
    const controller = new Controller(
      animationSource,
      _options,
      _target,
      null,
      remove)

    controller.attach()
    controller.kill()
    it('calls the controller source', () => {
      animationSource.should.have.been.called.once()
    })

    describe('on controller.kill()', () => {
      describe('calls the kill method of the GSAP Animation', () => {
        mockGSAPAnimation.kill.should.have.been.called.once()
      })
      describe('calls the passed remove function', () => {
        remove.should.have.been.called.once()
      })
    })

    it('throws for invalid animationSource', () => {
      assert.throws(() => new Controller(() => {}).attach())
    })
  })

  it('implements GSAP Controller methods', () => {
    const controller = new Controller()
    assert.isFunction(controller.play)
  })

  it('throws on calling invalid controller methods', () => {
    const controller = new Controller(createMockGSAPAnimation)
    controller.attach()
    assert.throws(() => controller.yoyo())
  })

  it('throws on calling controller method that isnt supported by the animation source', () => {
    const controller = new Controller(createMockGSAPAnimation)
    controller.attach()
    assert.throws(() => controller.seek(1))
  })

  it('warns on calling only getter controller methods with arguments', () => {
    const [warn, redoWarn] = wrapWarn()
    const controller = new Controller(createMockGSAPAnimation)
    controller.attach()
    controller.delay(6)
    warn.should.have.been.called.once()
    redoWarn()
  })

  it('keeps GSAP Controller methods chainable', () => {
    const controller = new Controller(createMockGSAPAnimation)
    controller.attach()
    assert.strictEqual(controller.play(), controller)
  })

  it('returns value for non chainable GSAP Controller methods', () => {
    const controller = new Controller(createMockGSAPAnimation)
    controller.attach()
    assert.isBoolean(controller.paused())
  })

  it('delays GSAP command calls until attach gets called', () => {
    const play = chai.spy()
    const controller = new Controller(() => ({play}))
    controller.play()
    play.should.have.been.called.exactly(0)
    controller.attach()
    play.should.have.been.called.once()
  })

  it('doesn\'t recall animationSource on repeaced attach', () => {
    const animationSource = chai.spy(() => createMockGSAPAnimation())
    const controller = new Controller(animationSource)
    controller.attach()
    controller.attach()
    animationSource.should.have.been.called.once()
  })

  it('calls pause for paused GSAP Animations on reattach', () => {
    const gsapAnimation = createMockGSAPAnimation()
    const animationSource = chai.spy(() => gsapAnimation)
    const controller = new Controller(animationSource)
    controller.attach()
    controller.pause()
    gsapAnimation.pause.should.have.been.called.once()
    controller.attach()
    gsapAnimation.pause.should.have.been.called.twice()
  })

  describe('replace animation source', () => {
    it('properly before attach', () => {
      const animationSource1 = chai.spy(() => createMockGSAPAnimation())
      const animationSource2 = chai.spy(() => createMockGSAPAnimation())
      const controller = new Controller(animationSource1)
      controller.replaceAnimationSource(animationSource2)
      controller.attach()
      animationSource1.should.have.been.called.exactly(0)
      animationSource2.should.have.been.called.once()
    })

    it('properly after attach', () => {
      const animationSource1 = chai.spy(() => createMockGSAPAnimation())
      const animationSource2 = chai.spy(() => createMockGSAPAnimation())
      const controller = new Controller(animationSource1, null, null, () => {})
      controller.attach()
      controller.replaceAnimationSource(animationSource2)
      controller.attach()
      animationSource1.should.have.been.called.once()
      animationSource2.should.have.been.called.once()
    })

    it('calls onNeedReattachAllAninmations', () => {
      const animationSource1 = () => createMockGSAPAnimation()
      const animationSource2 = () => createMockGSAPAnimation()
      const onNeedReattachAllAninmations = chai.spy()
      const controller = new Controller(animationSource1, null, null, onNeedReattachAllAninmations)
      controller.attach()
      controller.replaceAnimationSource(animationSource2)
      onNeedReattachAllAninmations.should.have.been.called.once()
    })
  })
})
