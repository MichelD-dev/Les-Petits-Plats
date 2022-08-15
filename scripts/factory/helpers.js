const getElement = identifier => document.querySelector(identifier)

const getElements = identifier => [...document.querySelectorAll(identifier)]

const element = tag => document.createElement(tag)

const text = content => document.createTextNode(content)

const filter = predicate => array => array.filter(predicate)

const find = val => array => array.find(val)

const forEach = fn => array => array.forEach(fn)

const map = fn => array => array.map(fn)

const insert = icon => location => element => (
  element.insertAdjacentHTML(location, icon), element
)

// Définition d'attributs en une ligne d'un élément du DOM
const addAttributes = attributes => element => (
  forEach(([key, value]) => element.setAttribute(key, value))(
    Object.entries(attributes)
  ),
  element
)

const addClasses =
  (...classNames) =>
  element => (element.classList.add(...classNames), element)

const removeClasses =
  (...classNames) =>
  element => (element.classList.remove(...classNames), element)

const append = node => element => (element.appendChild(node), element)

const appendChildren = children => element => (
  forEach(child => element.append(child))(children), element
)

const tap = f => x => (f(x), x)

const trace = label =>
  tap(console.log.bind(console, `%c${label}:`, 'color: cyan'))

export {
  map,
  filter,
  forEach,
  find,
  getElement,
  getElements,
  element,
  text,
  insert,
  addAttributes,
  addClasses,
  removeClasses,
  append,
  appendChildren,
  trace,
}
