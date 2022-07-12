import { recipes } from './data/recipes.js'
import { searchList } from './algorithms/quickSort.js'
import { filterRecipes } from './components/recipesFilter.js'
import { onSelect, updateTagsList } from './components/selector.js'
import { getTags } from './components/tagsList.js'
import { getElement, getElements, trace } from './factory/helpers.js'
import {
  clearErrorMessage,
  clearPage,
  deepFreeze,
  formatted,
  on,
  printSnackbar,
  searchByKeyword,
} from './helpers.js'
import { pipe, printErrorMessage } from './utils/utils.js'
import { cardsView } from './views/cardsView.js'
import { getRecipesFromSearch } from './components/searchBar.js'
import { tagsFactory } from './factory/tagsFactory.js'

// console.log(initialState);
// On récupère une liste initiale immutable de tags
const initialTags = deepFreeze(getTags())
// console.log(initialTags)
// On place le focus sur le champ de recherche à l'initialisation
//FIXME les passer en arguments
getElement('.search__form_searchbar').focus()

// On initialise un tableau de tags selectionnés
let selectedTags = []

export const app = userEvent => {
  // On place l'event reçu dans un HOF Stop() pour pouvoir retirer l'eventListener après l'actualisation de la recherche
  const stop = userEvent(() => {
    const MIN_SEARCH_LENGTH = 3

    // On récupère la frappe de l'utilisateur
    const searchInput = getElement('.search__form_searchbar').value
    // const tagSelect = getElement('.tag')?.children[0].textContent
    // const tagInput = getElement('.select__input').value

    // En dessous de trois caractères, on réinitialise la page (en cas de recherche effectuée précédemment)
    if (searchInput && searchInput.length < MIN_SEARCH_LENGTH) {
      // On réactualise la liste de tags
      onSelect(initialTags)
      // On réinitialise la page
      clearPage()
      return
    }

    // On récupère les tags selectionnés
    const tags = getElements('.tag')

    // Et on les place dans le tableau créé plus haut
    selectedTags =
      tags.length !== 0 ? tags.map(tag => tag.textContent.toLowerCase()) : []

    app(userEvent)

    const recipesSelection = getRecipesFromSearch(formatted(searchInput))

    // Récupération des tags associés à la recherche utilisateur
    const updateRecipesSelection = tags => selection => {
      const newSelection = []

      // console.log(tags);
      // console.log(selection);

      selection.forEach(recipe => {
        const ingredients = recipe.ingredients.map(ingredient =>
          ingredient.ingredient.toLowerCase()
        )
        const appareils = recipe.appliance.toLowerCase()
        const ustensiles = recipe.ustensils.map(ustensile =>
          ustensile.toLowerCase()
        )

        const recipesTags = [...ingredients, appareils, ...ustensiles]

        if (
          tags.every(tag => recipesTags.includes(tag)) &&
          !newSelection.includes(recipe)
        ) {
          newSelection.push(recipe)
        }
      })

      if (!newSelection.length || !tags) return selection

      onSelect(getTags(searchInput, newSelection))

      return newSelection
    }

    const selector = getElement('.select').children[0].id

    /**
     On affiche les cartes résultant de la recherche, via une composition de fonctions listées dans le fichier helpers.js:
     1. On récupère le nombre de recettes trouvées
   2. On affiche une snackbar avec le nombre de recettes trouvées
   3. On affiche la selection de recettes
   */
    const createUI = pipe(
      clearErrorMessage,
      updateRecipesSelection(selectedTags),
      updateTagsList(selector),
      // printSnackbar,
      clearPage,
      cardsView
    )

    createUI(recipesSelection)

    // On retire l'eventListener
    stop()
  })
}

// EventListener sur la barre de recherche
const userSearch = on('input')(getElement('.search__form_searchbar'))

// EventListener onclick sur la liste de tags
// let tagSelect
// if (getElement('.select').classList.contains('open')) {
const tagSelect = on('pointerdown')(getElement('.tag'))
// }

// EventListener onInput sur un selecteur de tags
const tagInput = on('keyup')(getElement('.select__input'))

// Action à l'ouverture d'un selecteur
onSelect(initialTags)

// Action de l'utilisateur
let userEvent = userSearch || tagSelect || tagInput
// console.log(userEvent)

app(userEvent)
