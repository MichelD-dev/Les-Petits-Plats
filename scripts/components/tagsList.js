import { recipes } from '../data/recipes.js'
import DOM from '../utils/domElements.js'
import { addReactionTo, removeReactionTo } from '../utils/eventListener.js'
import {
  capitalize,
  setAttributesFor,
  clearTagsSection,
} from '../utils/utils.js'
import { selectorChange } from './selector.js'

export const getTags = (itemsList = recipes, selector) => {console.log('jjj');
  //On crée un tableau de tags
  const selectorList = []

  // if (!selectorList.length === 0) {
  //   printTags(selectorList, selector)

  //   return selectorList
  // }

  itemsList.forEach(item => {
    // Si le selecteur est la string "appareils"
    if (typeof item[selector] === 'string')
      // On pushe les appareils dans le tableau selectorList
      return selectorList.push(item[selector].toLowerCase())

    // Si le selecteur est le tableau "ingredients" ou le tableau "ustensiles"
    if (Array.isArray(item[selector])) {
      item[selector].forEach(el => {
        // On pushe les ingredients dans le tableau selectorList
        // slice(0, -1) est pour avoir ingredient au singulier
        if (typeof el === 'object')
          return selectorList.push(el[selector.slice(0, -1)].toLowerCase())

        // On pushe les ustensiles dans le tableau selectorList
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

const printTagsList = (selectorList, selector) => {
  const tagsList = [...new Set(selectorList)].sort((a, b) => a.localeCompare(b))

  clearTagsSection(selector)
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

export const showTagsList = sortedSelection => e => {console.log('showTagsList ', sortedSelection);
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
