import {
  append,
  filter,
  forEach,
  getElement,
  trace,
} from '../factory/helpers.js'
import { clearTagsSection, pipe } from '../utils/utils.js'

// Fonction d'affichage de la liste de tags
export const tagsView = tags => selector => {
  // Réinitialisation de la liste de tags
  clearTagsSection(selector)

  // Alternative à if/else ou switch
  const choice = {
    ingredients: getElement('#ingredients-list'),
    appliance: getElement('#appareils-list'),
    ustensils: getElement('#ustensiles-list'),
  }

  // On définit à quelle catégorie appartient chaque tag via sa classe
  const tagsCategory = tag =>
    tag.classList.contains(`custom-option_${selector}`)

  // On filtre les tags par catégorie
  const filterByCategories = filter(tagsCategory)

  // Affectation de chaque tag à la liste correspondant à sa catégorie
  const appendTag = tag => append(tag)(choice[selector])

  // On execute cette affectation pour tous les tags
  const appendToCategoryLists = forEach(appendTag)

  // ------------------------------------------------------------------------- //

  //Composition des fonctions définies précédemment
  const createTagsLists = pipe(
    // trace('init'),
    filterByCategories,
    appendToCategoryLists
  )

  // On crée les listes de tags
  createTagsLists(tags)

  // tags.filter(tagsCategory).forEach(appendTag)

  // if (tagsList.length === 0)
  //   return (getElement('.tags__error').textContent =
  //     "Il n'y a pas de tag associé à votre recherche")
}
