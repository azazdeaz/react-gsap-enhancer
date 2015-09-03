var assert = require('chai').assert
var createSelect = require('../../src/createSelect')

function createFakeTree(structure) {

}

const tree1 = {
  children: [
    {
      component: {props: {key: 'key'}}
      children: [
        {component: {props: {key: 'key'}}}
      ]
    }
  ]
}


describe('implements api', () => {
  it('can create selector', () => {
    assert.isArray(createSelect(new Map()))
  })

  it('has the selector methods', () => {
    const selector = createSelect(new Map())
    assert.isFunction(selector.first)
    assert.isFunction(selector.all)
    assert.isFunction(selector.child)
    assert.isFunction(selector.children)
    assert.isFunction(selector.selectCommands)
  })
})

describe('first', () => {
  it('can create selector', () => {
    const select = createSelect(createSelect(tree1))
    const result = select.first()
    assert.strictEqual(result[0], tree1.children[0].component)
  })

  it('has the selector methods', () => {
    const selector = createSelect(new Map())
    assert.isFunction(selector.first)
    assert.isFunction(selector.all)
    assert.isFunction(selector.child)
    assert.isFunction(selector.children)
    assert.isFunction(selector.selectCommands)
  })
})
