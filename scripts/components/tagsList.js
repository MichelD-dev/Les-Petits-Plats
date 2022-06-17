import DOM from '../utils/domElements.js'
import { addReactionTo } from '../utils/eventListener.js'
import {
  capitalize,
  setAttributesFor,
  clearTagsSection,
  memoize,
} from '../utils/utils.js'
import { selectorChange } from './selector.js'
import {
  appareilsList,
  descriptionsList,
  ingredientsList,
  // listAll,
  namesList,
  searchList,
  ustensilesList,
} from '../algorithms/quickSort.js'
import { clearPage, getRecipes, printCards } from '../index.js'
import { sequentialSearch } from '../algorithms/sequentialsearch.js'
import { getRecipesFromSearch } from './searchBar.js'

export const getTags = (selector, selectorList, selection, userInput = '') => {
  // On affiche les tags correspondants au selecteur cliqué
  printTagsList(selector, selectorList, selection, userInput)

  return ingredientsList
}

// Fonction d'affichage de la liste de tags
const printTagsList = (
  selector,
  selectorList,
  selection = '',
  userInput = DOM.searchInput.value
) => {
  // Réinitialisation de la liste de tags
  clearTagsSection(selector)

  const createTags = tagsList => {
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

    if (selection.length === 0 && tagsList.length === 0)
      return (DOM.tagError.textContent =
        "Il n'y a pas de tag associé à votre recherche")
  }

  const { recipesSelection } = getRecipesFromSearch(userInput)
  const searchedRecipesIds = recipesSelection.map(recipe => recipe.id)
  // console.log(selector)
  // console.log(selectorList)
  // console.log(selection)
  // console.log(userInput)
  let tagsList = []
  for (const value of selectorList) {
    let tagsIdsList = []

    // Les tags sont filtrés en fonction du terme entré par l'utilisateur dans le selecteur de recherche
    if (userInput) {
      tagsIdsList = [
        ...new Set([
          ...tagsIdsList,
          ...value.ids.filter(id => searchedRecipesIds.indexOf(id) !== -1),
        ]),
      ]

      tagsIdsList.forEach(id =>
        selectorList.forEach(tag => {
          if (tag.ids.includes(id) && !tagsList.includes(tag.text)) {
            tagsList.push(tag.text)
          }
        })
      )
      tagsList.sort((a, b) => a.localeCompare(b))
    } else {
      // Liste de tags originelle
      tagsList.push(value.text)
    }
  }
  createTags(tagsList)

  // Fonction de filtrage des tags en fonction des inputs
  const filterTags = (selectorInput, tagsList) => {
    tagsList = tagsList.filter(tag => tag.includes(selectorInput))

    clearTagsSection()
    DOM.tagError.textContent = ''
    createTags(tagsList)
  }

  // Les tags sont filtrés en fonction du terme entré par l'utilisateur dans l'input selecteur
  addReactionTo('input')
    .on(DOM.selectorInput)
    .withFunction(() => {
      filterTags(DOM.selectorInput.value, tagsList, selector)
    })

  let selectedTags = JSON.parse(sessionStorage.getItem('selectedTags')) ?? []

  // Selection d'un tag dans la liste
  const selectTag = selectedTag => {
    // getRecipes(selectedTag, selector)

    // On crée un tableau des tags selectionnés et on le stocke dans le sessionStorage
    if (selectedTags.includes(selectedTag)) return
    selectedTags = [...selectedTags, selectedTag]
    sessionStorage.setItem('selectedTags', JSON.stringify(selectedTags))

    // On affiche le tag choisi
    const tag = tagsList.find(item => item === selectedTag)

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

    printRecipes(selectedTags)
  }

  // Suppression du tag
  const closeTag = tagElement => {
    tagElement.remove()
    let selectedTags = JSON.parse(sessionStorage.getItem('selectedTags')) || []
    selectedTags = selectedTags.filter(
      tag => tag !== tagElement.textContent.toLowerCase()
    )

    sessionStorage.setItem('selectedTags', JSON.stringify(selectedTags))

    //On réinitialise la section de cards
    clearPage()
    // On affiche la selection de cards correspondante aux tags restants

    printRecipes(selectedTags)
  }
}

const printRecipes = selectedTags => {
  const { recipesSelection } = getRecipesFromSearch(DOM.searchInput.value)

  let recipes = []

  if (selectedTags)
    selectedTags.forEach(tag => {
      const results = searchList.filter(elem =>
        elem.text.includes(tag.toLowerCase())
      )

      results.forEach(result =>
        result.ids.forEach(id => {
          recipesSelection.forEach(recipe => {
            if (recipe.id === id) recipes.push(recipe)
            return recipes
          })
        })
      )
    })

  // On initialise l'affichage des cards recettes
  clearPage()

  printCards(recipes.length !== 0 ? recipes : recipesSelection)
}

// Routage en fonction du selecteur cliqué
export const showTagsList = (selector, selection, userInput = '') => {
  const id = {
    ingredients: () => {
      selectorChange(DOM.ingredientsSelector)
      return getTags('ingredients', ingredientsList, selection, userInput)
    },
    appareils: () => {
      selectorChange(DOM.appareilsSelector)
      return getTags('appliance', appareilsList, selection, userInput)
    },
    ustensiles: () => {
      selectorChange(DOM.ustensilesSelector)
      return getTags('ustensils', ustensilesList, selection, userInput)
    },
  }

  const getSelectedTags = id[selector]?.()

  return getSelectedTags
}
