// import { sortBy } from "../scripts/components/selector.js";

import { search } from './components/searchBar.js'
import recipeFactory from './factory/recipeFactory.js'
import DOM from './utils/domElements.js'
import { addReactionTo } from './utils/eventListener.js'
import { cardsSectionReset } from './utils/utils.js'

/**
 * On met le focus dans l'input de recherche à l'ouverture de la page
 */
DOM.searchInput.focus()

const printRecipes = e => {
  let selectedRecipes = []

  if (e.target.value.length < 3) {
    cardsSectionReset()
    console.log(`0 recettes trouvées`);
    
    return
  }

  /**
   * On récupère un tableau de selections de recettes d'après les critères de recherche
   */
  const selections = search(e.target.value)

  /**
   * On ajoute éventuellement cette séléction  aux résultats précédents
   */
  selectedRecipes = [...selectedRecipes, ...selections]

  /**
   * On réinitialise l'affichage des cards recettes
   */
  cardsSectionReset()

  /**
   * On supprime les doublons de la selection
   */
  ;[...new Set([...selectedRecipes])].forEach(recipe => {
    const article = recipeFactory(recipe).getRecipeCardDOM()

console.log(`${[...new Set([...selectedRecipes])].length} recettes trouvées`);

    /**
     * On affiche la selection
     */
    DOM.cardsSection.appendChild(article)
  })
}

/**
 * On écoute les frappes clavier
 */
// DOM.searchInput.addEventListener('keyup', printRecipes)
addReactionTo('keyup').on(DOM.searchInput).withFunction(printRecipes)
