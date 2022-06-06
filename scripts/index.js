import { sortBy } from '../scripts/components/selector.js'

import { getFromSearch } from './components/searchBar.js'
import { printSnackbar, stopSnackbarTimeOut } from './components/snackbar.js'
import recipeFactory from './factory/recipeFactory.js'
import DOM from './utils/domElements.js'
import { addReactionTo } from './utils/eventListener.js'
import {
  cardsSectionReset,
  // getSelectionOf,
  sortAlphabetically,
  setAttributesFor,
  capitalize,
  tagsSectionReset,
} from './utils/utils.js'

/**
 * On met le focus dans l'input de recherche à l'ouverture de la page
 */
DOM.searchInput.focus()

export const getRecipes = e => {
  /**
   * On ne retourne un résultat qu'à partir de trois caractères tapés par l'utilisateur
   */
  if (e.target.value.length < 3) return

  /**
   * On réinitialise l'affichage des cards recettes
   */
  cardsSectionReset()

  stopSnackbarTimeOut()

  /**
   * Snackbar signalant le nombre de recettes retournées
   */ //TODO actualisation

  /**
   * On récupère un tableau de selections de recettes d'après les critères de recherche
   */
  const recipes = getFromSearch(e.target.value)

  /**
   * On supprime les doublons de la selection et on la trie alphabétiquement
   */
  const sortedSelections = sortAlphabetically([...new Set(recipes)])

  printSnackbar(sortedSelections)

  /**
   * On récupère les cards DOM correspondantes
   */
  sortedSelections.forEach(recipe => {
    const recipeCard = recipeFactory(recipe).getRecipeCardDOM()

    /**
     * On affiche la selection
     */
    DOM.cardsSection.appendChild(recipeCard)
  })

  tagsSectionReset()

  const getTags = (ingredientsList = []) => {
    sortedSelections.forEach(_ =>
      _.ingredients.forEach(_ => {
        ingredientsList.push(_.ingredient.toLowerCase())
      })
    )
    printTags(ingredientsList)
    return ingredientsList
  }

  const printTags = ingredientsList => {
    const list = [...new Set(ingredientsList)].sort((a, b) =>
      a.localeCompare(b)
    )

    list.forEach(tag => {
      const ingredient = document.createElement('li')
      ingredient.classList.add('custom-option')
      setAttributesFor(ingredient)({
        tabIndex: 0,
        'data-value': 'ingredient',
      })

      ingredient.textContent = capitalize(tag)

      DOM.ingredients.appendChild(ingredient)
    })
  }

  const filterTags = e => {
    const filteredTags = getTags().filter(tag => {
      if (tag.indexOf(e.target.value) !== -1) return tag
    })

    tagsSectionReset()
    printTags(filteredTags)
  }

  addReactionTo('input').on(DOM.selectorInput).withFunction(filterTags)

  getTags()
}

// ------------------------------------------------------------------------- //
// ----------------------------EVENT LISTENERS----------------------------- //
// ------------------------------------------------------------------------- //

/**
 * On écoute les frappes clavier
 */
// DOM.searchInput.addEventListener('keyup', printRecipes)
addReactionTo('input').on(DOM.searchInput).withFunction(getRecipes)
