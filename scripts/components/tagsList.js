import { recipes } from '../data/recipes.js'
import { sortedList } from '../index.js'
import DOM from '../utils/domElements.js'
import { addReactionTo, removeReactionTo } from '../utils/eventListener.js'
import {
  capitalize,
  setAttributesFor,
  clearTagsSection,
} from '../utils/utils.js'
import { selectorChange } from './selector.js'

export const getTags = (itemsList = recipes, selector) => {
  console.log('jjj')
  //On crée un tableau de tags
  const selectorList = []

  const formated = str => str.toLowerCase().replace(/&(.)[^;]+;/)

  const alreadyInTheList = selectedTag =>
    [...document.querySelectorAll('.tag')].some(
      elem => formated(selectedTag) === formated(elem.textContent)
    )

  itemsList.forEach(item => {
    // Si le selecteur est la cha^ne de caractères "appareils"
    if (typeof item[selector] === 'string') {
      // Si l'appareil est déjà affiché dans la liste, on ne fait rien
      if (alreadyInTheList(item[selector])) return

      // Sinon on le pushe dans le tableau selectorList
      return selectorList.push(item[selector].toLowerCase())
    }
    // Si le selecteur est le tableau "ingredients" ou le tableau "ustensiles"
    if (Array.isArray(item[selector])) {
      item[selector].forEach(el => {
        if (typeof el === 'object') {
          if (alreadyInTheList(el[selector.slice(0, -1)])) return
          // Si l'ingredient est déjà affiché dans la liste, on ne fait rien
          console.log(el[selector.slice(0, -1)] === 'Ail')
          // Sinon on le pushe dans le tableau selectorList
          // slice(0, -1) est pour avoir ingredient au singulier
          return selectorList.push(el[selector.slice(0, -1)].toLowerCase())
        }
        if (alreadyInTheList(el)) return
        // Si l'ustensile est déjà affiché dans la liste, on ne fait rien

        // Sinon on le pushe dans le tableau selectorList
        selectorList.push(el.toLowerCase())
      })
    }
  })

  // On affiche les tags
  printTagsList(selectorList, selector)

  // Les tags sont filtrés en fonction du terme entré par l'utilisateur
  addReactionTo('input')
    .on(DOM.selectorInput)
    .withFunction(e => filterTags(e, itemsList, selector))

  return selectorList
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
  const filteredTags = getTags(itemsList, selector).filter(tag => {
    if (tag.indexOf(e.target.value) !== -1) return tag
  })

  clearTagsSection(selector)

  printTagsList(filteredTags, selector)
}

export const showTagsList = sortedSelection => e => {
  console.log('showTagsList ', sortedSelection)
  const id = {
    ingredients: () => {
      selectorChange(DOM.ingredientsSelector)
      return getTags(sortedSelection, 'ingredients')
    },
    appareils: () => {
      selectorChange(DOM.appareilsSelector)
      return getTags(sortedSelection, 'appliance')
    },
    ustensiles: () => {
      selectorChange(DOM.ustensilesSelector)
      return getTags(sortedSelection, 'ustensils')
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
