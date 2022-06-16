import { recipes } from '../data/recipes.js'
import { sortedList } from '../utils/init.js'
import DOM from '../utils/domElements.js'
import { addReactionTo, removeReactionTo } from '../utils/eventListener.js'
import {
  capitalize,
  setAttributesFor,
  clearTagsSection,
  memoize,
} from '../utils/utils.js'
import { selectorChange } from './selector.js'
import { listAll } from '../algorithms/quickSort.js'
import { getRecipesFromSearch } from './searchBar.js'

export const getTags = selector => {
  const selection =
    selector === 'appliance'
      ? 'appareils'
      : selector === 'ustensils'
      ? 'ustensiles'
      : 'ingredients'

  // On affiche les tags
  printTagsList(listAll[selection], selector)

  // Les tags sont filtrés en fonction du terme entré par l'utilisateur
  addReactionTo('input')
    .on(DOM.selectorInput)
    .withFunction(() => filterTags(listAll[selection], selector))

  return listAll[selection]
}

// Fonction d'affichage de la liste de tags
const printTagsList = (selectorList, selector) => {
  const tagsList = [...new Set(selectorList)].sort((a, b) => a.localeCompare(b))

  const closeTag = tagElement => (tagElement.style.display = 'none')

  clearTagsSection(selector)

  const selectTag = selectedTag => {
    //TODO repère selectTag
    const tag = tagsList.find(item => item === selectedTag)

    if (
      [...document.querySelectorAll('.tag')].some(
        elem => capitalize(selectedTag) === elem.textContent
      )
    ) {
      return
    }

    const tagElement = document.createElement('div')
    tagElement.classList.add('tag', `tag_${selector}`)
    
    const tagText = document.createElement('span')
    tagText.textContent = capitalize(tag)
    
    const tagClose = document.createElement('span')
    tagClose.classList.add('tag__close')
    tagClose.innerHTML = `<i class="fa-regular fa-circle-xmark fa-xl tag__close"></i>`

    addReactionTo('pointerdown')
      .on(tagClose)
      .withFunction(() => closeTag(tagElement))

    tagElement.appendChild(tagText)
    tagElement.appendChild(tagClose)

    DOM.tagsSection.appendChild(tagElement)

    // getRecipesFromSearch(selectedTag)//FIXME
  }

  tagsList.forEach(tag => {
    const item = document.createElement('li')
    item.classList.add(`custom-option`, `custom-option_${selector}`)
    setAttributesFor(item)({
      tabIndex: 0,
      'data-value': `${selector}`,
    })

    item.textContent = capitalize(tag)

    const choice = {
      ingredients: () => DOM.ingredients.appendChild(item),
      appliance: () => DOM.appareils.appendChild(item),
      ustensils: () => DOM.ustensiles.appendChild(item),
    }
    choice[selector]?.() ?? 'Selecteur non reconnu'

    addReactionTo('pointerdown')
      .on(item)
      .withFunction(() => selectTag(tag))
  })
}

// Fonction de filtrage des tags
const filterTags = (itemsList, selector) => {
  const filteredTags = itemsList.filter(tag => {
    const input = document.querySelector('.select__input_ingredients')

    if (tag.toLowerCase().includes(input.value.toLowerCase())) return tag
  })

  clearTagsSection(selector)

  if (filteredTags.length === 0)
    return (DOM.tagError.textContent =
      "Il n'y a pas de tag associé à votre recherche")

  DOM.tagError.textContent = ''
  printTagsList(filteredTags, selector)
}

export const showTagsList = e => {
  const id = {
    ingredients: () => {
      selectorChange(DOM.ingredientsSelector)
      return getTags('ingredients')
    },
    appareils: () => {
      selectorChange(DOM.appareilsSelector)
      return getTags('appliance')
    },
    ustensiles: () => {
      selectorChange(DOM.ustensilesSelector)
      return getTags('ustensils')
    },
  }

  const selector = e.target.parentElement.id

  const getSelectedTags = id[selector]?.()

  return getSelectedTags
}
