import findIndex from 'lodash/array/findIndex'

export default class FakeNode {
  constructor({attributes = {}, type = 'div'}) {
    this.type = type
    this.attributes = []
    Object.keys(attributes).forEach(name => {
      this.setAttribute(name, attributes[name])
    })
  }

  setAttribute(name, value) {
    this.removeAttribute(name)
    this.attributes.push({name, value})
  }

  removeAttribute(name) {
    const index = findIndex(this.attributes, {name})
    if (index !== -1) {
      this.attributes.splice(index, 1)
    }
  }
}
