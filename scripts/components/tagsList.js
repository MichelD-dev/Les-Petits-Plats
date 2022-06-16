import DOM from '../utils/domElements.js'
import { addReactionTo } from '../utils/eventListener.js'
import {
  capitalize,
  setAttributesFor,
  clearTagsSection,
  memoize,
} from '../utils/utils.js'
import { selectorChange } from './selector.js'
import { listAll } from '../algorithms/quickSort.js'
import { getRecipes } from '../index.js'

export const getTags = memoize(selector => {
  const selection =
    selector === 'appliance'
      ? 'appareils'
      : selector === 'ustensils'
      ? 'ustensiles'
      : 'ingredients'

  // On affiche les tags correspondants au selecteur cliqué
  printTagsList(listAll[selection], selector)

  // Les tags sont filtrés en fonction du terme entré par l'utilisateur dans l'input selecteur
  addReactionTo('input')
    .on(DOM.selectorInput)
    .withFunction(() => {
      filterTags(DOM.selectorInput.value, listAll[selection], selector)
    })

  // Les tags sont filtrés en fonction du terme entré par l'utilisateur dans le selecteur de recherche
  if (DOM.searchInput.value)
    filterTags(DOM.searchInput.value, listAll[selection], selector)

  return listAll[selection]
})

// Fonction d'affichage de la liste de tags
const printTagsList = (selectorList, selector) => {
  const tagsList = [...new Set(selectorList)].sort((a, b) => a.localeCompare(b))

  // Suppression du tag
  const closeTag = tagElement => (tagElement.style.display = 'none')

  // Réinitialisation de la liste de tags
  // clearTagsSection(selector)

  // Selection d'un tag dans la liste
  const selectTag = selectedTag => {

getRecipes(selectedTag, selector)

    // On affiche le tag choisi
    const tag = tagsList.find(item => item === selectedTag)

    // on évite d'afficher deux fois le même tag
    if (
      [...document.querySelectorAll('.tag')].some(
        elem => capitalize(selectedTag) === elem.textContent
      )
    ) {
      return
    }

    // Création du tag
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
      .withFunction(() => {
        selectTag(tag)
      })
  })
}

// Fonction de filtrage des tags en fonction des inputs
export const filterTags = (userInput, itemsList, selector) => {
  const filteredTags = itemsList.filter(tag => {
    if (tag.toLowerCase().includes(userInput.toLowerCase())) return tag
  })

  clearTagsSection(selector)

  if (filteredTags.length === 0)
    return (DOM.tagError.textContent =
      "Il n'y a pas de tag associé à votre recherche")

  DOM.tagError.textContent = ''
  printTagsList(filteredTags, selector)
}

// Routage en fonction du selecteur cliqué
export const showTagsList = selector => {
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

  const getSelectedTags = id[selector]?.()

  return getSelectedTags
}
