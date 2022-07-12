import {
  addClass,
  getElement,
  getElements,
  removeClass,
} from '../factory/helpers.js'
import { tagsFactory } from '../factory/tagsFactory.js'
import { formatted, on } from '../helpers.js'
import { getTags } from './tagsList.js'

/**
 * Changements d'apparence du selecteur sur events
 */
const selectorChange = selector => {
  /**
   * Ouverture du selecteur
   */
  // On ferme les selecteurs potentiellement ouverts
  getElements('.select').forEach(removeClass('open'))
  // Puis on ouvre le selecteur cliqué
  addClass('open')(getElement(`#${selector.id}`))
}

export const openSelector = allTags => selector => {
  selector.onclick = () => {
    const category = selector.parentElement.id
    const categorySelector = getElement(`#${`select_${category}`}`)

    // On vérifie si un des selecteurs a acquis le focus sur son input
    const selectorInput = getElements('.select__input').find(
      selectInput => document.activeElement === selectInput
    )

    // On ne permet la fermeture des tags que sur la flêche, pas le selectorInput
    if (categorySelector.classList.contains('open') && !selectorInput)
      return removeClass('open')(categorySelector)

    // Routage en fonction du selecteur cliqué
    const id = {
      // FIXME reduire en allTags.map(fns(arg1, arg2))
      ingredients: () => {
        // Ouverture du selecteur
        selectorChange(getElement('#select_ingredients'))
        // On crée les tags correspondants au selecteur cliqué

        return tagsFactory(allTags[0])('ingredients')
      },
      appareils: () => {
        // Ouverture du selecteur
        selectorChange(getElement('#select_appareils'))
        // On crée les tags correspondants au selecteur cliqué
        return tagsFactory(allTags[1])('appliance')
      },
      ustensiles: () => {
        // Ouverture du selecteur
        selectorChange(getElement('#select_ustensiles'))
        // On crée les tags correspondants au selecteur cliqué
        return tagsFactory(allTags[2])('ustensils')
      },
    }
    id[category]?.() ?? 'Selecteur non reconnu'
  }
}

export const onSelect = allTags => {
  // Ouverture/fermeture des selecteurs par la flêche
  getElements('.arrow-container').forEach(openSelector(allTags))

  // Ouverture des selecteurs par l'input
  getElements('.select__input').forEach(selector => {
    on('pointerdown')(selector)(() => openSelector(allTags)(selector))
    on('input')(selector)(() => filteredByTagsInput(allTags)(selector))
  })
}

/**
 * On ferme le selecteur lorsque l'utilisateur clique quelque part dans la fenêtre
 */
on('pointerdown')(window)(e => {
  if (e.target.classList.contains('tag__close')) return

  getElements('.select').forEach(select => {
    if (!select.contains(e.target)) removeClass('open')(select)
  })
})

//On actualise la liste de tags après selection d'un tag
export const updateTagsList = selector => selection => {
  const filteredTags = getTags(null, selection)
  tagsFactory(filteredTags)(selector)

  return selection
}

const filteredByTagsInput = allTags => selector => {
  const tagInput = tag => tag.includes(formatted(selector.value))

  // On recrée les tags restants après filtrage
  if (selector.parentElement.id === 'ingredients') {
    const filteredTags = allTags[0].filter(tagInput)
    tagsFactory(filteredTags)(selector.parentElement.id)
  }

  if (selector.parentElement.id === 'appareils') {
    const filteredTags = allTags[1].filter(tagInput)
    tagsFactory(filteredTags)('appliance')
  }

  if (selector.parentElement.id === 'ustensiles') {
    const filteredTags = allTags[2].filter(tagInput)
    tagsFactory(filteredTags)('ustensils')
  }
}
