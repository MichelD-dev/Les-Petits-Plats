import * as M from '../factory/helpers.js'

export const memoize = fn => {
  const cache = new Map()
  return (...args) => {
    const strX = JSON.stringify(args)
    if (cache.has(strX)) {
      // console.log('Fetching from cache: ', `"${args.at(0)}"`)
    }
    if (!cache.has(strX)) {
      // console.log('Calculating result: ', `"${args.at(0)}"`)
      cache.set(strX, fn(...args))
    }
    return cache.get(strX)
  }
}

/**
 * Fonction de réinitialisation de la grille d'images
 */
export const clearCardsSection = selection => {
  const recipesCards = M.getElement('.recipes')
  const { firstChild, lastChild } = recipesCards

  if (!firstChild) return selection

  recipesCards.removeChild(lastChild)
  clearCardsSection(selection)

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
  const tagsList = M.getElement(`#${getSelector(selector)}-list`)
  const { firstChild, lastChild } = tagsList

  if (!firstChild) return

  tagsList.removeChild(lastChild)
  clearTagsSection(selector)
}

/**
 * Fonction capitalize
 */
export const capitalize = str => {
  if (typeof str !== 'string') return ''

  return str.toLowerCase().replace(/^\w/, str => str.toUpperCase())
}

export const printErrorMessage = (message = '', id = 'error') => {
  M.getElement(`.${id}`).textContent = message
}

export const pipe =
  (...fns) =>
  x =>
    fns.reduce((y, fn) => fn(y), x)

export const flip = fn => b => a => fn(a)(b)
