import DOM from './utils/domElements.js'
import { getRecipesFromSearch } from './components/searchBar.js'
import { printSnackbar, stopSnackbarTimeOut } from './components/snackbar.js'
import recipeCardFactory from './factory/recipeFactory.js'
import { addReactionTo } from './utils/eventListener.js'
import { clearCardsSection, printErrorMessage, pipe } from './utils/utils.js'
import { recipes } from './data/recipes.js'
import { init } from './utils/init.js'

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

const formatted = str => {
  return (
    str
      .toLowerCase()
      // On enlève les accents et les caractères spéciaux
      .normalize('NFD')
      .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
      // On reduit les espaces de plus d'un caractère
      .replace(/\s+/g, ' ')
      .trim()
  )
}

const updateSelectionWithTags = (recipesSelection, tag) => {
  const newSelection = []

  recipesSelection.forEach(recipe => {
    if (formatted(recipe.name).includes(formatted(tag)))
      newSelection.push(recipe)
    if (formatted(recipe.description).includes(formatted(tag)))
      newSelection.push(recipe)
    recipe.ingredients.forEach(ingredient => {
      if (formatted(ingredient.ingredient).includes(formatted(tag)))
        newSelection.push(recipe)
    })
  })

  clearPage()
  printCards(newSelection)
}

init()

// ---------------------------------------------------------------------------- //
// -------------------- FONCTION DE RECHERCHE DE RECETTES --------------------- //
// ---------------------------------------------------------------------------- //

const getRecipes = (tag = null, selector = '') => {
  /**
   On ne retourne un résultat qu'à partir de trois caractères tapés par l'utilisateur
   On réinitialise l'affichage des cards recettes lorsqu'on redescend en dessous de 3 caractères
   */
  if (DOM.searchInput.value.length < 3) return clearPage()

  // On recrée une liste complète de tags lorsqu'on redescend en dessous de 3 caractères
  if (!DOM.searchInput.value || DOM.searchInput.value.length < 3)
    return createTagsListWith(recipes)

  // On initialise l'affichage des cards recettes
  clearPage()

  stopSnackbarTimeOut() //FIXME fonctionne?

  // On récupère un tableau de selections de recettes d'après les critères de recherche
  const recipesSelection = getRecipesFromSearch(DOM.searchInput.value)

  if (typeof tag === 'string')
    return updateSelectionWithTags(recipesSelection, tag)

  printCards(recipesSelection)

  return recipesSelection
}

/**
   On affiche les cartes résultant de la recherche, via une composition des fonctions listées plus haut:
   1. On récupère le nombre de recettes trouvées
   2. On affiche une snackbar avec le nombre de recettes trouvées
   3. On récupère les cards DOM correspondantes
   4. On affiche la selection
   */
const printCards = pipe(
  getRecipesQuantity,
  printSnackbar,
  getRecipesCards,
  printRecipesCards
)

export { getRecipes }

// On écoute les frappes clavier
addReactionTo('input').on(DOM.searchInput).withFunction(getRecipes)
