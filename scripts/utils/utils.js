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
 * Définition d'attributs en une ligne d'un élément du DOM
 */
export const setAttributesFor = el => attrs =>
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value))

/**
 * Création d'un tableau d'éléments selectionnés
 */
export const getSelectionOf = items => {
  const selectedItems = []

  return () => [...selectedItems, ...items]
}

/**
 * Tri alphabétique d'une liste
 */
export const orderAlphabetically = data =>
  data.sort((a, b) => a.name.localeCompare(b.name))
