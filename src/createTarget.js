function find(selection, selector) {
  const result = []

  selection.forEach(item => {
    let match

    recurseChildren(item, (childItem, key) => {
      if (!match && testSelector(key, childItem, selector)) {
        match = childItem
      }
    })

    if (match) {
      result.push(match)
    }
  })

  return convertToTarget(result)
}

function findAll(selection, selector) {
  const result = []

  selection.forEach(item => recurseChildren(item, (childItem, key) => {
    if (testSelector(key, childItem, selector)) {
      result.push(childItem)
    }
  }))
  return convertToTarget(result)
}

function findInChildren(selection, selector) {
  const result = []

  selection.forEach(item => {
    let match
    iterateChildren(item, (childItem, key) => {
      if (!match && testSelector(key, childItem, selector)) {
        match = childItem
      }
    })

    if (match) {
      result.push(match)
    }
  })

  return convertToTarget(result)
}

function findAllInChildren(selection, selector) {
  const result = []

  selection.forEach(item => iterateChildren(item, (childItem, key) => {
    if (testSelector(key, childItem, selector)) {
      result.push(childItem)
    }
  }))
  return convertToTarget(result)
}

function findWithCommands(target, commands) {
  commands.forEach(command => {
    if (!target[command.type]) {
      throw Error(`[react-gsap-enhancer] unknown command type "${target[command.type]}"`)
    }
    target = target[command.type](command.selector)
  })
  return target
}

function isMounted(item) {
  return !!item.node
}

function testSelector(key, childItem, selector = {}) {
  if (typeof selector === 'string') {
    selector = {key: selector}
  }
  const props = {...childItem.props, key}
  return Object.keys(selector).every(selectorKey => {
    return selector[selectorKey] === props[selectorKey]
  })
}

function iterateChildren(item, callback) {
  item.children.forEach((childItem, key) => {
    if (isMounted(childItem)) {
      callback(childItem, key)
    }
  })
}

function recurseChildren(item, callback) {
  iterateChildren(item, (childItem, key) => {
    callback(childItem, key)
    recurseChildren(childItem, callback)
  })
}

export default function convertToTarget(selection) {
  const target = selection.map(item => item.node).filter(node => !!node)

  target.find = selector => find(selection, selector)
  target.findAll = selector => findAll(selection, selector)
  target.findInChildren = selector => findInChildren(selection, selector)
  target.findAllInChildren = selector => findAllInChildren(selection, selector)
  target.findWithCommands = commands => findWithCommands(target, commands)

  return target
}

export default function createTarget(itemTree) {
  const target = convertToTarget([{children: itemTree}])
  //call find so target will refer to the first node which should be the root
  return target.find()
}
