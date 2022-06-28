import {
  addClass,
  getElement,
  getElements,
  removeClass,
} from '../factory/helpers.js'
import { tagsFactory } from '../factory/tagsFactory.js'
import { formatted, on } from '../helpers.js'
import { tagsView } from '../views/tagsView.js'

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
      ingredients: () => {
        // Ouverture du selecteur
        selectorChange(getElement('#select_ingredients'))
        // On affiche les tags correspondants au selecteur cliqué
        return tagsFactory(allTags[0])('ingredients')
      },
      appareils: () => {
        // Ouverture du selecteur
        selectorChange(getElement('#select_appareils'))
        // On affiche les tags correspondants au selecteur cliqué
        return tagsFactory(allTags[1])('appliance')
      },
      ustensiles: () => {
        // Ouverture du selecteur
        selectorChange(getElement('#select_ustensiles'))
        // On affiche les tags correspondants au selecteur cliqué
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
    on('input')(selector)(() => filteredByTagsInput(allTags.flat())(selector))
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

const filteredByTagsInput = allTags => selector => {
  const filteredTags = allTags.filter(tag =>
    tag.includes(formatted(selector.value))
  )

  tagsFactory(filteredTags)(selector.parentElement.id)
  // list
  //   .filter(item => item.text.includes(formatted(tagInput)))
  //   .forEach(
  //     foundItem =>
  //       (recipesIds3 = [...new Set([...recipesIds3, foundItem.ids].flat())])
  //   )
  // return recipesIds3
}
