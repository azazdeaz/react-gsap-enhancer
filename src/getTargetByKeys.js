import select from './select'

export default function getTargetByKeys(fullItemTree, fullKeyPath) {
  const ret = []

  function walk(item, keyPath) {
    if (!item) {
      return
    }

    if (keyPath.length === 0) {
      if (isMounted(item)) {
        ret.push(item.node)
      }
      return
    }

    const key = keyPath[0]
    const restKeyPath = keyPath.slice(1)

    if (key === select.ROOT) {
      fullItemTree.forEach(childItem => {
        walk(childItem, restKeyPath)
      })
    }
    else if (key === select.CHILDREN) {
      item.children.forEach(childItem => {
        walk(childItem, restKeyPath)
      })
    }
    else {
      walk(item.children.get(key), restKeyPath)
    }
  }

  walk({children: fullItemTree}, fullKeyPath)

  return ret
}

function isMounted(item) {
  return !!item.node
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
