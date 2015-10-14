var chai = require('chai')
var assert = chai.assert
var spies = require('chai-spies')
chai.use(spies)
chai.should()

var Animation = require('../../src/Animation')

function createMockGSAPAnimation() {
  var mock = {}
  mock.time = chai.spy((v) => v === undefined ? 0 : mock)
  mock.pause = chai.spy(() => mock)
  mock.paused = chai.spy(() => false)
  mock.invalidate = chai.spy(() => mock)
  mock.restart = chai.spy(() => mock)
  mock.kill = chai.spy(() => mock)
  mock.play = chai.spy(() => mock)
  return mock
}

describe('Animation', () => {
  it('is a function', () => {
    assert.isFunction(Animation)
  })

  it('is instantiable', () => {
    assert.isObject(new Animation())
  })

  describe('on attach', () => {
    const _options = {}
    const _target = {}
    const animationSource = chai.spy(({target, options}) => {
      it('pass target to the animationSource function', () => {
        assert.strictEqual(_target, target)
      })
      it('pass options to the animationSource function', () => {
        assert.strictEqual(_options, options)
      })
      return createMockGSAPAnimation()
    })
    const animation = new Animation(animationSource, _options, _target)
    animation.attach()
    it('calls the animation source', () => {
      animationSource.should.have.been.called.once()
    })
  })

  it('implements GSAP Animation methods', () => {
    const animation = new Animation()
    assert.isFunction(animation.play)
  })

  it('throws on calling invalid GSAP Animation methods', () => {
    const animation = new Animation(createMockGSAPAnimation)
    animation.attach()
    assert.throws(() => animation.yoyo())
  })

  it('keeps GSAP Animation methods chainable', () => {
    const animation = new Animation(createMockGSAPAnimation)
    animation.attach()
    assert.strictEqual(animation.play(), animation)
  })

  it('returns value for non chainable GSAP Animation methods', () => {
    const animation = new Animation(createMockGSAPAnimation)
    animation.attach()
    assert.isBoolean(animation.paused())
  })

  it('delays GSAP command calls until attach gets called', () => {
    const play = chai.spy()
    const animation = new Animation(() => ({play}))
    animation.play()
    play.should.have.been.called.exactly(0)
    animation.attach()
    play.should.have.been.called.once()
  })

  it('doesn\'t recall animationSource on repeaced attach', () => {
    const animationSource = chai.spy(() => createMockGSAPAnimation())
    const animation = new Animation(animationSource)
    animation.attach()
    animation.attach()
    animationSource.should.have.been.called.once()
  })

  describe('replace animation source', () => {
    it('properly before attach', () => {
      const animationSource1 = chai.spy(() => createMockGSAPAnimation())
      const animationSource2 = chai.spy(() => createMockGSAPAnimation())
      const animation = new Animation(animationSource1)
      animation.replaceAnimationSource(animationSource2)
      animation.attach()
      animationSource1.should.have.been.called.exactly(0)
      animationSource2.should.have.been.called.once()
    })

    it('properly after attach', () => {
      const animationSource1 = chai.spy(() => createMockGSAPAnimation())
      const animationSource2 = chai.spy(() => createMockGSAPAnimation())
      const animation = new Animation(animationSource1, null, null, () => {})
      animation.attach()
      animation.replaceAnimationSource(animationSource2)
      animation.attach()
      animationSource1.should.have.been.called.once()
      animationSource2.should.have.been.called.once()
    })

    it('calls onNeedReattachAllAninmations', () => {
      const animationSource1 = () => createMockGSAPAnimation()
      const animationSource2 = () => createMockGSAPAnimation()
      const onNeedReattachAllAninmations = chai.spy()
      const animation = new Animation(animationSource1, null, null, onNeedReattachAllAninmations)
      animation.attach()
      animation.replaceAnimationSource(animationSource2)
      onNeedReattachAllAninmations.should.have.been.called.once()
    })
  })
})
