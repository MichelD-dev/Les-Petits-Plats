import DOM from './domElements.js'

/**
 * Fonction de réinitialisation de la grille d'images
 */
export const cardsSectionReset = () => {
  while (DOM.cardsSection.firstChild) {
    DOM.cardsSection.removeChild(DOM.cardsSection.lastChild)
  }
}

/**
 * Fonction de réinitialisation de la liste de tags
 */
export const tagsSectionReset = () => {
  while (DOM.ingredients.firstChild) {
    DOM.ingredients.removeChild(DOM.ingredients.lastChild)
  }
}

/**
 * Définition d'attributs en une ligne d'un élément du DOM
 */
export const setAttributesFor = el => attrs =>
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value))

/**
 * Création d'un tableau d'éléments selectionnés
 */
// export const getSelectionOf = items => {
//   const selectedItems = []

//   return () => [...selectedItems, ...items]
// }

/**
 * Tri alphabétique d'une liste
 */
export const sortAlphabetically = data =>
  data.sort((a, b) => a.name.localeCompare(b.name))

  /**
 * Fonction capitalize
 */
export const capitalize = str => {
  if (typeof str === 'string') {
    return str.replace(/^\w/, c => c.toUpperCase())
  } else {
    return ''
  }
}
