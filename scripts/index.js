import { sortBy } from '../scripts/components/selector.js'

import { search } from './components/searchBar.js'
import recipeFactory from './factory/recipeFactory.js'
import DOM from './utils/domElements.js'
import { addReactionTo } from './utils/eventListener.js'
import {
  cardsSectionReset,
  getSelectionOf,
  orderAlphabetically,
  setAttributesFor,
} from './utils/utils.js'

/**
 * On met le focus dans l'input de recherche à l'ouverture de la page
 */
DOM.searchInput.focus()

export const getRecipes = e => {
  /**
   * On réinitialise l'affichage des cards recettes
   */
  cardsSectionReset()

  /**
   * On ne retourne un résultat qu'à partir de trois caractères tapés par l'utilisateur
   */
  if (e.target.value.length < 3) return

  /**
   * On récupère un tableau de selections de recettes d'après les critères de recherche
   */
  const recipes = search(e.target.value)

  /**
   * On ajoute éventuellement cette selection  aux résultats précédents et on en récupère le tableau résultant
   */
  const userInputResult = getSelectionOf(recipes)()
  /**
   * On supprime les doublons de la selection
   */
  console.log([...new Set(userInputResult)])
  const sortedSelections = orderAlphabetically([...new Set(userInputResult)])

  console.log(sortedSelections)
  /**
   * On récupère les cards DOM correspondantes
   */
  sortedSelections.forEach(recipe => {
    const recipeCard = recipeFactory(recipe).getRecipeCardDOM()

    /**
     * On affiche la selection
     */
    DOM.cardsSection.appendChild(recipeCard)

    console.log(recipe.ingredients)

    recipe.ingredients.forEach(_ => {
      const ingredient = document.createElement('li')
      ingredient.classList.add('custom-option')
      setAttributesFor(ingredient)({
        tabIndex: 0,
        'data-value': 'ingredients',
      })
      ingredient.textContent = _.ingredient

      DOM.ingredients.appendChild(ingredient)
    })

    /**
     * Snackbar signalant le nombre de recettes retournées
     */
    DOM.snackbar.classList.remove('hidden')
    DOM.snackbar.classList.add('snackbar')
    DOM.snackbar.textContent = `Votre recherche a retourné ${sortedSelections.length} recettes`
  })
}

// ------------------------------------------------------------------------- //
// ----------------------------EVENT LISTENERS----------------------------- //
// ------------------------------------------------------------------------- //

/**
 * On écoute les frappes clavier
 */
// DOM.searchInput.addEventListener('keyup', printRecipes)
addReactionTo('input').on(DOM.searchInput).withFunction(getRecipes)
