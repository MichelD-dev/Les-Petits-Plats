import { append, getElement } from '../factory/helpers.js'
import { clearTagsSection } from '../utils/utils.js'

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

  // ------------------------ Helpers ---------------------------------------- //

  const tagsCategory = tag =>
    tag.classList.contains(`custom-option_${selector}`)
  const appendTag = tag => append(tag)(choice[selector])

  // ------------------------------------------------------------------------- //

  tags.filter(tagsCategory).forEach(appendTag)

  // if (tagsList.length === 0)
  //   return (getElement('.tags__error').textContent =
  //     "Il n'y a pas de tag associé à votre recherche")
}
