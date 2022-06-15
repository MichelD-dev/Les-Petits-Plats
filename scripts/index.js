import DOM from './utils/domElements.js'
import { getIngredientsTagsFromSearch, getRecipesFromSearch } from './components/searchBar.js'
import { printSnackbar, stopSnackbarTimeOut } from './components/snackbar.js'
import recipeCardFactory from './factory/recipeFactory.js'
import { addReactionTo } from './utils/eventListener.js'
import { clearCardsSection, printErrorMessage, pipe } from './utils/utils.js'
import { recipes } from './data/recipes.js'
import { init } from './utils/init.js'
import { select } from './utils/init.js'

// ---------------------------------------------------------------------------- //
// ------------------------------- UTILITAIRES -------------------------------- //
// ---------------------------------------------------------------------------- //

// Fonction de suppression du message d'erreur
const deleteErrorMessage = printErrorMessage

// Fonction de reset de la page
const clearPage = pipe(clearCardsSection, deleteErrorMessage)

// Fonction renvoyant le nombre de recettes trouvées
const getRecipesQuantity = selection => ({
  selection,
  recipesQuantity: selection.length,
})

// Fonction de récupération des cards DOM correspondantes aux recettes selectionnées
const getRecipesCards = selection => selection.map(recipeCardFactory)

// Fonction d'affichage de la selection de cartes de recettes
const printRecipesCards = recipeCards =>
  recipeCards.forEach(recipeCard => DOM.cardsSection.appendChild(recipeCard))

init()

// ---------------------------------------------------------------------------- //
// -------------------- FONCTION DE RECHERCHE DE RECETTES --------------------- //
// ---------------------------------------------------------------------------- //

const getRecipes = (e = null) => {
  /**
   On ne retourne un résultat qu'à partir de trois caractères tapés par l'utilisateur
   On supprime le message d'erreur quand l'utilisateur revient sur sa frappe
   On réinitialise l'affichage des cards recettes
  */
  if (e?.target.value.length < 3) return clearPage()

  if (!e || e.target.value.length < 3) return createTagsListWith(recipes)

  // On réinitialise l'affichage des cards recettes
  clearPage()

  stopSnackbarTimeOut() //FIXME fonctionne?

  // On récupère un tableau de selections de recettes d'après les critères de recherche
  const recipesSelection = getRecipesFromSearch(e.target.value)
  const ingredientsTags = getIngredientsTagsFromSearch(e.target.value)
console.log(ingredientsTags);
  /**
   On affiche les cartes résultant de la recherche, via une composition des fonctions listées plus haut:
   1. On récupère le nombre de recettes trouvées
   2. On affiche une snackbar avec le nombre de recettes trouvées
   3. On récupère les cards DOM correspondantes
   4. On affiche la selection
   */
  pipe(
    getRecipesQuantity,
    printSnackbar,
    getRecipesCards,
    printRecipesCards
  )(recipesSelection)

  // On réinitialise la liste de tags
  // clearTagsSection()

  select(recipesSelection)

  return recipesSelection
}

export { getRecipes }

// ------------------------------------------------------------------------- //
// ----------------------------EVENT LISTENERS----------------------------- //
// ------------------------------------------------------------------------- //

// On écoute les frappes clavier
addReactionTo('input').on(DOM.searchInput).withFunction(getRecipes)
