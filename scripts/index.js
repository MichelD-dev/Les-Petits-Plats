import { selectorChange, sortBy } from '../scripts/components/selector.js'

import { getFromSearch } from './components/searchBar.js'
import { printSnackbar, stopSnackbarTimeOut } from './components/snackbar.js'
// import { sortList } from './components/sortList.js'
import recipeCardFactory from './factory/recipeFactory.js'
import { sortList } from './algorithms/quickSort.js'
import DOM from './utils/domElements.js'
import { addReactionTo, removeReactionTo } from './utils/eventListener.js'
import {
  cardsSectionReset,
  // getSelectionOf,
  setAttributesFor,
  capitalize,
  tagsSectionReset,
  printError,
} from './utils/utils.js'
import { getTags } from './components/tagsList.js'

/**
 * On crée une liste ordonnée de mots clés à partir de la liste de recettes
 */
export const sortedList = sortList()
console.log(sortedList)

/**
 * On met le focus dans l'input de recherche à l'ouverture de la page
 */
DOM.searchInput.focus()

export const getRecipes = e => {
  /**
   * On ne retourne un résultat qu'à partir de trois caractères tapés par l'utilisateur
   * On supprime le message d'erreur quand l'utilisateur revient sur sa frappe
   * On réinitialise l'affichage des cards recettes
   */
  if (e.target.value.length < 3) {
    DOM.disabled.forEach(selectorCache => selectorCache.classList.remove('hidden'))
    cardsSectionReset()
    printError('')
    return
  }

  /**
   * On réinitialise l'affichage des cards recettes
   */
  cardsSectionReset()

  stopSnackbarTimeOut()

  DOM.disabled.forEach(selectorCache => selectorCache.classList.add('hidden'))

  /**
   * Snackbar signalant le nombre de recettes retournées
   */ //TODO actualisation

  /**
   * On récupère un tableau de selections de recettes d'après les critères de recherche
   */
  const sortedSelections = getFromSearch(e.target.value)
  if (!sortedSelections) return

  printSnackbar(sortedSelections)

  /**
   * On récupère les cards DOM correspondantes
   */
  sortedSelections.forEach(recipe => {
    const recipeCard = recipeCardFactory(recipe)

    /**
     * On affiche la selection
     */
    DOM.cardsSection.appendChild(recipeCard)
  })

  // tagsSectionReset()

  const printTagsList = e => {
    if (DOM.searchInput.value.length < 3) return

    const id = {
      ingredients: () => {
        getTags(sortedSelections, 'ingredients')
        selectorChange(DOM.ingredientsSelector)
      },
      appareils: () => {
        getTags(sortedSelections, 'appliance')
        selectorChange(DOM.appareilsSelector)
      },
      ustensiles: () => {
        getTags(sortedSelections, 'ustensils')
        selectorChange(DOM.ustensilesSelector)
      },
    }

    return id[e.target.parentElement.id]?.() ?? "Ce selecteur n'existe pas"
  }

  /**
   * On ouvre le selecteur
   */
  ;[...document.querySelectorAll('.select__trigger')].forEach(selector => {
    addReactionTo('pointerdown').on(selector).withFunction(printTagsList)
  })

  // getTags(sortedSelections, "appliance")
  // getTags(sortedSelections, "ustensils")
  console.log(sortedSelections)
}

// ------------------------------------------------------------------------- //
// ----------------------------EVENT LISTENERS----------------------------- //
// ------------------------------------------------------------------------- //

/**
 * On écoute les frappes clavier
 */
// DOM.searchInput.addEventListener('keyup', printRecipes)
addReactionTo('input').on(DOM.searchInput).withFunction(getRecipes)
