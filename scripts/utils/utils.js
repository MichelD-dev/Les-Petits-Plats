import { getElement } from '../factory/helpers.js'

/**
 * Fonction de réinitialisation de la grille d'images
 */
export const clearCardsSection = selection => {
  while (getElement('.recipes').firstChild) {
    getElement('.recipes').removeChild(getElement('.recipes').lastChild)
  } //TODO recursion
  return selection
}

/**
 * Traduction: appliance => appareils, ustensils => ustensiles
 */
export const getSelector = selector => {
  const select =
    selector === 'appliance'
      ? 'appareils'
      : selector === 'ustensils'
      ? 'ustensiles'
      : 'ingredients'
  return select
}

/**
 * Fonction de réinitialisation de la liste de tags
 */
export const clearTagsSection = selector => {
  const tagsList = getElement(`#${getSelector(selector)}-list`)
// TODO recursion
  while (tagsList.firstChild) {
    tagsList.removeChild(tagsList.lastChild)
  }
}

/**
 * Définition d'attributs en une ligne d'un élément du DOM
 */
export const setAttributesFor = el => attrs =>
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value))

/**
 * Fonction capitalize
 */
export const capitalize = str => {
  if (typeof str !== 'string') return ''

  return str.replace(/^\w/, str => str.toUpperCase())
}

export const printErrorMessage = (message = '') => {
  getElement('.error').textContent = message
}

export const pipe =
  (...fns) =>
  x =>
    fns.reduce((y, fn) => fn(y), x)

export const flip = fn => b => a => fn(a)(b)

// a simple memoize function that takes in a function
// and returns a memoized function
export const memoize = fn => {
  const cache = new Map();
  return (...args) => {
    const strX = JSON.stringify(args);
    if (!cache.has(strX)) {
      cache.set(strX, fn(...args));
    }
    return cache.get(strX);
  };


  // let cache = {}
  // return (...args) => {
  //   let n = args[0]
  //   // just taking one argument here
  //   if (n in cache) {
  //     // console.log(n + ': Fetching from cache')
  //     return cache[n]
  //   } else {
  //     // console.log(n + ': Calculating result')
  //     let result = fn(n)
  //     cache[n] = result
  //     return result
  //   }
  // }
}
