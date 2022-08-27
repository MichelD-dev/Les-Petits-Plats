import * as M from '../factory/helpers.js'
import {clearTagsSection, getSelector} from '../utils/utils.js'

// Fonction d'affichage de la liste de tags
export const tagsView = tags => selector => {
  // Réinitialisation de la liste de tags
  clearTagsSection(selector)

  // Récuperation des catégories ingredients, appareils et ustensiles à partir de ingredients, appliance, ustensils
  const category = getSelector(selector)

  // Récuperation de la liste par catégorie
  const tagsList = M.getElement(`#${category}-list`)

  // Affectation de chaque tag à la liste correspondant à sa catégorie
  const appendTag = tag => M.append(tag)(tagsList)

  // On execute cette affectation pour tous les tags
  M.forEach(appendTag)(tags)
}
