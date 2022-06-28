const getElement = identifier => document.querySelector(identifier)
const getElements = identifier => [...document.querySelectorAll(identifier)]

const element = tag => document.createElement(tag)

const text = content => document.createTextNode(content)

const insert = icon => location => element => {
  element.insertAdjacentHTML(location, icon)
  return element
}

const addAttributes = attributes => element => {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
  return element
}

const addClass =
  (...classNames) =>
  element => {
    element.classList.add(...classNames)
    return element
  }

const removeClass =
  (...classNames) =>
  element => {
    element.classList.remove(...classNames)
    return element
  }

const append = node => element => {
  element.appendChild(node)
  return element
}

const appendChildren = children => element => {
  children.forEach(child => element.append(child))
  return element
}

export {
  getElement,
  getElements,
  element,
  text,
  insert,
  addAttributes,
  addClass,
  removeClass,
  append,
  appendChildren,
}
