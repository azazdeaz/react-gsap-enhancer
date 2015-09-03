import assign from 'object-assign'

const selectorMethods = {
  first(selector) {
    const result = []

    this.forEach(item => {
      let match

      recurseChildren(item, childItem => {
        if (!match && testSelector(childItem, selector)) {
          match = childItem
        }
      })

      if (match) {
        result.push(match)
      }
    })
    return createSelect(result)
  },
  all(selector) {
    const result = []

    this.forEach(item => recurseChildren(item, childItem => {
      if (testSelector(childItem, selector)) {
        result.push(childItem)
      }
    }))
    return createSelect(result)
  },
  child(selector) {
    const result = []

    this.forEach(item => iterateChildren(item, childItem => {
      if (testSelector(childItem, selector)) {
        result.push(childItem)
      }
    }))
    return createSelect(result)
  }
}

function isMounted(item) {
  return !!item.node
}

function testSelector(childItem, selector) {
  if (typeof selector === 'string') {
    selector = {key: selector}
  }
  const {props} = childItem.component
  return Object.keys(selector).every(selectorKey => {
    return selector[selectorKey] === props[selectorKey]
  })
}

function iterateChildren(item, callback) {
  item.children.forEach(childItem => {
    if (isMounted(childItem)) {
      callback(childItem)
    }
  })
}

function recurseChildren(item, callback) {
  iterateChildren(item, childItem => {
    callback(childItem)
    recurseChildren(childItem, callback)
  })
}

export default function createSelect(baseSelection) {
  if (!(baseSelection instanceof Array)) {
    baseSelection = [baseSelection]
  }
  return assign(baseSelection.slice(), selectorMethods)
}

// function giveUpResolving(itemTree, keyPath) {
//   var error = `Can not resolve keyPath: "${keyPath}"` +
//               `The current item tree is looks like this:`
//
//   function printBranch(map, level = 0) {
//     map.forEach((item, key) => {
//       error += `\n${' |'.repeat(level)} ${key}`
//       printBranch(item.children, level + 1)
//     })
//   }
//
//   printBranch(itemTree)
//   throw Error(error)
// }
