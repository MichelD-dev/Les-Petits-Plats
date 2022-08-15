import * as M from '../factory/helpers.js'
import { tagsFactory } from '../factory/tagsFactory.js'
import { formatted, on } from '../helpers.js'
import { capitalize, getSelector } from '../utils/utils.js'
import { getTags } from './tagsList.js'

/**
 * Changements d'apparence du selecteur à l'ouverture
 */
const selectorChange = selector => {
  // On ferme les selecteurs potentiellement ouverts
  M.forEach(M.removeClasses('open'))(M.getElements('.select'))
  // Puis on ouvre le selecteur cliqué
  M.addClasses('open')(M.getElement(`#${selector.id}`))
}

export const openSelector = allTags => selector => {
  selector.onclick = () => {
    const category = getSelector(selector.parentElement.id)
    const categorySelector = M.getElement(`#${`select_${category}`}`)

    // On vérifie si un des selecteurs a acquis le focus sur son input
    const selectorInput = M.find(
      selectInput => document.activeElement === selectInput
    )(M.getElements('.select__input'))

    // On ne permet la fermeture des tags que sur la flêche, pas le selectorInput
    if (categorySelector.classList.contains('open') && !selectorInput) {
      // On rétablit le texte du placeholder à la fermeture du selecteur
      selector.previousElementSibling.placeholder = capitalize(
        getSelector(selector.parentElement.id)
      )
      M.removeClasses('select__input_dimmed')(selector.previousElementSibling)

      return M.removeClasses('open')(categorySelector)
    }

    // Ouverture du selecteur
    selectorChange(M.getElement(`#select_${category}`))

    // On crée les tags correspondants au selecteur cliqué
    tagsFactory(allTags[`${category}Tags`])(selector.parentElement.id)
  }
}

export const onSelect = allTags => {
  // Ouverture/fermeture des selecteurs par la flêche
  M.forEach(selector => {
    // On remplace le texte du placeholder à l'ouverture du selecteur
    on('pointerdown')(selector)(() => {
      selector.previousElementSibling.placeholder = 'Rechercher'
      M.addClasses('select__input_dimmed')(selector.previousElementSibling)
      openSelector(allTags)(selector)
    })
  })(M.getElements('.arrow-container'))

  // Ouverture des selecteurs par l'input
  M.forEach(selector => {
    on('pointerdown')(selector)(() => openSelector(allTags)(selector))
    on('input')(selector)(() => filteredByTagsInput(allTags)(selector))
  })(M.getElements('.select__input'))
}

/**
 * On ferme le selecteur lorsque l'utilisateur clique quelque part dans la fenêtre
 */
on('pointerdown')(window)(e => {
  M.forEach(select => {
    if (!select.contains(e.target)) {
      // On rétablit le texte du placeholder à la fermeture du selecteur
      const tagInput = select.firstElementChild.firstElementChild

      tagInput.placeholder = capitalize(getSelector(tagInput.parentElement.id))
      M.removeClasses('select__input_dimmed')(tagInput)

      M.removeClasses('open')(select)
    }
  })(M.getElements('.select'))
})

//On actualise la liste de tags après selection d'un tag
export const createTagsLists = selection => {
  const { ingredientsTags, appareilsTags, ustensilesTags } = getTags(selection)

  const tagsCategory = {
    ingredients: ingredientsTags,
    appliance: appareilsTags,
    ustensils: ustensilesTags,
  }

  const createTags = selector => tagsFactory(tagsCategory[selector])(selector)
  M.map(createTags)(Object.keys(tagsCategory))

  return selection
}

const filteredByTagsInput = allTags => selector => {
  const { ingredientsTags, appareilsTags, ustensilesTags } = allTags

  const tagsCategory = {
    ingredients: ingredientsTags,
    appliance: appareilsTags,
    ustensils: ustensilesTags,
  }

  const select = selector.parentElement.id

  // On filtre les tags dans chaque catégorie
  const tagInput = tag => formatted(tag).includes(formatted(selector.value))
  const filteredTags = M.filter(tagInput)(tagsCategory[select])

  // On recrée les tags restants après filtrage
  tagsFactory(filteredTags)(select)
}
