var assert = require('chai').assert
var createTarget = require('../../src/createTarget')

function createFakeTree(rootDesign) {
  function create(design) {
    if (!design) {
      return new Map()
    }
    const kvArray = Object.keys(design).map(key => {
      const {node, children, ...props} = design[key]

      return [key, Object.freeze({
        node,
        children: create(children),
        component: {props}
      })]
    })
    return new Map(kvArray)
  }
  return create(rootDesign)
}

const rootNode = {}
const fooNode = {}
const barNode = {}
const quxNode = {}
const bazNode = {}
const tree1 = createFakeTree({
  root: {
    node: rootNode,
    red: 'dark',
    children: {
      foo: {
        purple: true,
        node: fooNode,
        children: {
          bar: {
            purple: true,
            red: 'dark',
            node: barNode,
          }
        }
      },
      qux: {
        red: 'light',
        node: quxNode,
      },
      baz: {
        purple: true,
        red: 'dark',
        node: bazNode,
      }
    }
  }
})

function targetsEqual(a, b) {
  assert.strictEqual(a.length, b.length)
  a.forEach(aItem => {
    assert.include(b, aItem)
  })
}


describe('target', () => {
  it('can be created', () => {
    assert(createTarget(new Map()))
  })

  it('is an array', () => {
    assert.isArray(createTarget(new Map()))
  })
})

function testBasics(name) {
  it('is existing', () => {
    const target = createTarget(new Map())
    assert.isFunction(target[name])
  })

  it('is chainable', () => {
    const target = createTarget(new Map())
    assert.isFunction(target[name]()[name])
  })
}

describe('find', () => {
  testBasics('find')

  it('selects properly with no options', () => {
    const target = createTarget(tree1)
    const result = target.find()
    targetsEqual(result, [rootNode])
  })

  it('selects properly by key', () => {
    const target = createTarget(tree1)
    const result = target.find({key: 'foo'})
    targetsEqual(result, [fooNode])
  })

  it('selects the first match', () => {
    const target = createTarget(tree1)
    const result = target.find({key: 'foo'})
    targetsEqual(result, [fooNode])
  })

  it('selects properly by multiple props', () => {
    const target = createTarget(tree1)
    const result = target.find({purple: true})
    targetsEqual(result, [fooNode])
  })

  it('selects properly by string (key) selector', () => {
    const target = createTarget(tree1)
    const result = target.find('bar')
    targetsEqual(result, [barNode])
  })

  it('only select the first match', () => {
    const target = createTarget(tree1)
    const result = target.find({purple: true})
    targetsEqual(result, [fooNode])
  })
})

describe('findAll', () => {
  testBasics('findAll')

  it('selects properly with no options', () => {
    const target = createTarget(tree1)
    const result = target.findAll()
    targetsEqual(result, [rootNode, fooNode, barNode, quxNode, bazNode])
  })

  it('selects properly by key', () => {
    const target = createTarget(tree1)
    const result = target.findAll({key: 'qux'})
    targetsEqual(result, [quxNode])
  })

  it('selects properly by multiple props', () => {
    const target = createTarget(tree1)
    const result = target.findAll({purple: true, red: 'dark'})
    targetsEqual(result, [barNode, bazNode])
  })

  it('selects properly by string (key) selector', () => {
    const target = createTarget(tree1)
    const result = target.findAll('baz')
    targetsEqual(result, [bazNode])
  })

  it('selects all the matches', () => {
    const target = createTarget(tree1)
    const result = target.findAll({purple: true})
    targetsEqual(result, [fooNode, barNode, bazNode])
  })
})

describe('findInChildren', () => {
  testBasics('findInChildren')
  const rootTarget = createTarget(tree1).find('root')

  it('selects properly with no options', () => {
    const result = rootTarget.findInChildren()
    targetsEqual(result, [fooNode])
  })

  it('selects properly by key', () => {
    const result = rootTarget.findInChildren({key: 'foo'})
    targetsEqual(result, [fooNode])
  })

  it('selects the first match', () => {
    const result = rootTarget.findInChildren({purple: true})
    targetsEqual(result, [fooNode])
  })

  it('selects properly by string (key) selector', () => {
    const result = rootTarget.findInChildren('baz')
    targetsEqual(result, [bazNode])
  })

  it('can\'t select items deeper in the structure', () => {
    const result = rootTarget.findInChildren('bar')
    targetsEqual(result, [])
  })

  it('selects properly by multiple props', () => {
    const result = rootTarget.findInChildren({purple: true, red: 'dark'})
    targetsEqual(result, [bazNode])
  })

  it('is only select the first match', () => {
    const result = rootTarget.findInChildren({purple: true})
    targetsEqual(result, [fooNode])
  })
})

describe('findAllInChildren', () => {
  testBasics('findAllInChildren')
  const rootTarget = createTarget(tree1).find('root')

  it('selects properly with no options', () => {
    const result = rootTarget.findAllInChildren()
    targetsEqual(result, [fooNode, quxNode, bazNode])
  })

  it('selects properly by key', () => {
    const result = rootTarget.findAllInChildren({key: 'foo'})
    targetsEqual(result, [fooNode])
  })

  it('selects properly by string (key) selector', () => {
    const result = rootTarget.findAllInChildren('qux')
    targetsEqual(result, [quxNode])
  })

  it('can\'t select items deeper in the structure', () => {
    const result = rootTarget.findInChildren('bar')
    targetsEqual(result, [])
  })

  it('selects properly by multiple props', () => {
    const result = rootTarget.findAllInChildren({purple: true, red: 'dark'})
    targetsEqual(result, [bazNode])
  })

  it('selects all the matches', () => {
    const result = rootTarget.findAllInChildren({purple: true})
    targetsEqual(result, [fooNode, bazNode])
  })
})


describe('findWithCommands', () => {
  it('is existing', () => {
    const target = createTarget(new Map())
    assert.isFunction(target.findWithCommands)
  })

  it('is chainable', () => {
    const target = createTarget(new Map())
    const commands = [{type: 'find', selector: {}}]
    assert.isFunction(target.findWithCommands(commands).findWithCommands)
  })

  it('applies find properly', () => {
    const target = createTarget(tree1)
    const result = target.findWithCommands([{
      type: 'find',
      selector: {key: 'qux'}
    }])
    targetsEqual(result, [quxNode])
  })

  it('applies findAll properly', () => {
    const target = createTarget(tree1)
    const result = target.findWithCommands([{
      type: 'findAll',
      selector: {purple: true}
    }])
    targetsEqual(result, [fooNode, barNode, bazNode])
  })

  it('applies findInChildren properly', () => {
    const target = createTarget(tree1)
    const result = target.findWithCommands([{
      type: 'findInChildren',
      selector: 'root'
    }])
    targetsEqual(result, [rootNode])
  })

  it('applies findAllInChildren properly', () => {
    const target = createTarget(tree1)
    const result = target.findWithCommands([
      {
        type: 'find',
        selector: 'root'
      },
      {
        type: 'findAllInChildren',
        selector: {purple: true}
      }
    ])
    targetsEqual(result, [bazNode, quxNode])
  })

  it('is chainable', () => {
    const target = createTarget(tree1)
    const result = target.findWithCommands([
      {
        type: 'find',
        selector: 'root'
      },
      {
        type: 'findAllInChildren',
        selector: {purple: true}
      },
      {
        type: 'find',
        selector: 'bar'
      }
    ])
    targetsEqual(result, [barNode])
  })
})


describe('spread', () => {
  it('works', () => {
    const tree = createFakeTree({
      root: {
        node: rootNode,
        red: 'dark',
        children: {
          foo: {
            purple: true,
            node: fooNode,
            children: {
              bar: {
                red: 'dark',
                node: barNode,
              }
            }
          },
          qux: {
            purple: true,
            node: quxNode,
            children: {
              baz: {
                red: 'dark',
                node: bazNode,
              }
            }
          }
        }
      }
    })
    const target = createTarget(tree)
      .findAll({purple: true})
      .findInChildren({red: 'dark'})
    targetsEqual(target, [bazNode, barNode])
  })
})
