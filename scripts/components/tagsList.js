import { recipes } from '../data/recipes.js'
import { sortedList } from '../utils/init.js'
import DOM from '../utils/domElements.js'
import { addReactionTo, removeReactionTo } from '../utils/eventListener.js'
import {
  capitalize,
  setAttributesFor,
  clearTagsSection,
} from '../utils/utils.js'
import { selectorChange } from './selector.js'
import { listAll } from '../algorithms/quickSort.js'

export const getTags = selector => {
  // On affiche les tags
  printTagsList(listAll[selector], selector)

  // Les tags sont filtrés en fonction du terme entré par l'utilisateur
  addReactionTo('input')
    .on(DOM.selectorInput)
    .withFunction(e => filterTags(e, listAll[selector], selector))

  return listAll.ingredients
}

// Fonction d'affichage de la liste de tags
const printTagsList = (selectorList, selector) => {
  const tagsList = [...new Set(selectorList)].sort((a, b) => a.localeCompare(b))

  const closeTag = tagElement => (tagElement.style.display = 'none')

  clearTagsSection(selector)

  const showTag = selectedTag => {
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
    tagClose.innerHTML = `<i class="fa-regular fa-circle-xmark fa-xl"></i>`

    addReactionTo('pointerdown')
      .on(tagClose)
      .withFunction(() => closeTag(tagElement))

    tagElement.appendChild(tagText)
    tagElement.appendChild(tagClose)

    DOM.tagsSection.appendChild(tagElement)
  }

  //TODO 'Il n\'y a pas de tag associé à votre recherche'
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
      .withFunction(() => showTag(tag))
  })
}

// Fonction de filtrage des tags
const filterTags = (e, itemsList, selector) => {
  const filteredTags = getTags(selector).filter(tag => {
    if (tag.indexOf(e.target.value) !== -1) return tag
  })

  clearTagsSection(selector)

  printTagsList(filteredTags, selector)
}

export const showTagsList = sortedSelection => e => {
  // console.log('showTagsList ', sortedSelection)
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

// On ouvre le selecteur
// export const initTagsList = recipesSelection => {
//   console.log('pop')
//   const showSelectionTagsList = showTagsList(recipesSelection)

//   ;[...document.querySelectorAll('.select__trigger')].forEach(selector => {
//     addReactionTo('pointerdown')
//       .on(selector)
//       .withFunction(howTagsList(recipesSelection))
//   })
// }
