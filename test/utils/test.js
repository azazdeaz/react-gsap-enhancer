import FakeNode from './FakeNode'
import {
  walkItemTree,
  reattachAll,
  restoreRenderedStyles,
  saveRenderedStyles
} from '../../src/utils'
var chai = require('chai')
var spies = require('chai-spies')
var assert = chai.assert
chai.use(spies)
chai.should()

console.log(process.env.NODE_ENV)

describe('walkItemTree', () => {
  it('works nested item tree', () => {
    const barItem = {node: {}}
    const bazItem = {node: {}}
    const fooItem = {node: {}, children: new Map([
      ['bar', barItem],
      ['baz', bazItem]
    ])}
    const itemTree = new Map([[0, fooItem]])
    const callback = chai.spy()
    walkItemTree(itemTree, callback)
    callback.should.have.been.called.with(fooItem)
    callback.should.have.been.called.with(barItem)
    callback.should.have.been.called.with(bazItem)
  })
})

describe('saveRenderedStyles & restoreRenderedStyles', () => {
  const fooNode = new FakeNode({
    attributes: {
      foo: 'red',
      bar: 'blue',
    }
  })
  const fooItem = {node: fooNode}
  const itemTree = new Map([['qux', fooItem]])

  it('save all attributes', () => {
    saveRenderedStyles(itemTree)
    const qux = itemTree.get('qux')
    assert.isObject(qux.savedAttributes)
    const names = Object.keys(qux.savedAttributes)
    assert.lengthOf(names, 2)
    assert.include(names, 'foo')
    assert.include(names, 'bar')
  })


  it('restore all attributes and remove extras', () => {
    fooNode.setAttribute('foo', 'black')
    fooNode.setAttribute('tux', 'yellow')

    assert.lengthOf(fooNode.attributes, 3)

    restoreRenderedStyles(itemTree)

    const names = fooNode.attributes.map(attr => attr.name)
    const values = fooNode.attributes.map(attr => attr.value)
    assert.lengthOf(names, 2)
    assert.include(names, 'foo')
    assert.include(names, 'bar')
    assert.strictEqual(values[names.indexOf('foo')], 'red')
    assert.strictEqual(values[names.indexOf('bar')], 'blue')
  })
})
describe('attachAll & reattachAll', () => {
  const fooNode = new FakeNode({
    attributes: {
      foo: 'red',
      bar: 'blue',
    }
  })
  const fooItem = {node: fooNode}
  const itemTree = new Map([['qux', fooItem]])

  it('calls animation.attach', () => {
    const animation = {
      attach: chai.spy()
    }
    reattachAll(itemTree, [animation])
    animation.attach.should.have.been.called.once()
  })
})
