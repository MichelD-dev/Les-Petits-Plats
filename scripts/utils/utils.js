import DOM from './domElements.js'

/**
 * Fonction de réinitialisation de la grille d'images
 */
export const clearCardsSection = () => {
  while (DOM.cardsSection.firstChild) {
    DOM.cardsSection.removeChild(DOM.cardsSection.lastChild)
  }
}

/**
 * Fonction de réinitialisation de la liste de tags
 */
export const clearTagsSection = selector => {
  const select = //FIXME rendre générique
    selector === 'appliance'
      ? 'appareils'
      : selector === 'ustensils'
      ? 'ustensiles'
      : 'ingredients'

  while (DOM[select].firstChild) {
    DOM[select].removeChild(DOM[select].lastChild)
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

  return str.replace(/^\w/, c => c.toUpperCase())
}

export const printErrorMessage = message =>
  (DOM.errorMessage.textContent = message)

export const pipe =
  (...fns) =>
  x =>
    fns.reduce((y, f) => f(y), x)

// a simple memoize function that takes in a function
// and returns a memoized function
export const memoize = fn => {
  let cache = {}
  return (...args) => {
    let n = args[0]
    // just taking one argument here
    if (n in cache) {
      console.log(n + ': Fetching from cache')
      return cache[n]
    } else {
      console.log(n + ': Calculating result')
      let result = fn(n)
      cache[n] = result
      return result
    }
  }
}
