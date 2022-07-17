const getElement = identifier => document.querySelector(identifier)
const getElements = identifier => [...document.querySelectorAll(identifier)]

const element = tag => document.createElement(tag)

const text = content => document.createTextNode(content)

const filter = category => array => array.filter(category)

const forEach = fn => array => array.forEach(fn)

const map = fn => array => array.map(fn)

const insert = icon => location => element => (
  element.insertAdjacentHTML(location, icon), element
)

const addAttributes = attributes => element => (
  Object.entries(attributes).forEach(([key, value]) =>
    element.setAttribute(key, value)
  ),
  element
)

const addClass =
  (...classNames) =>
  element => (element.classList.add(...classNames), element)

const removeClass =
  (...classNames) =>
  element => (element.classList.remove(...classNames), element)

const append = node => element => (element.appendChild(node), element)

const appendChildren = children => element => (
  forEach(child => element.append(child))(children), element
)

const tap = f => x => (f(x), x)

export const trace = label => tap(console.log.bind(console, label + ':'))

export {
  map,
  filter,
  forEach,
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
