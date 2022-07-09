import { recipes } from './data/recipes.js'
import { searchList } from './algorithms/quickSort.js'
import { filterRecipes } from './components/recipesFilter.js'
import { onSelect } from './components/selector.js'
import { getTags } from './components/tagsList.js'
import { getElement, getElements } from './factory/helpers.js'
import {
  clearErrorMessage,
  clearPage,
  deepFreeze,
  filteredByTagsSelect,
  on,
  printSnackbar,
  searchByKeyword,
} from './helpers.js'
import { pipe, printErrorMessage } from './utils/utils.js'
import { cardsView } from './views/cardsView.js'
import { getRecipesFromSearch } from './components/searchBar.js'

// console.log(initialState);
// On récupère une liste initiale immutable de tags
const initialTags = deepFreeze(getTags())
// console.log(initialTags);
// On place le focus sur le champ de recherche à l'initialisation
//FIXME les passer en arguments
getElement('.search__form_searchbar').focus()

let selectedTags = []

export const app = userEvent => {
  // On initialise un tableau de tags selectionnés

  // On place l'event reçu dans un HOF Stop() pour pouvoir retirer l'eventListener après l'actualisation de la recherche
  const stop = userEvent(() => {
    const MIN_SEARCH_LENGTH = 3

    // On récupère la frappe de l'utilisateur
    const searchInput = getElement('.search__form_searchbar').value

    // On récupère les tags selectionnés
    const tags = getElements('.tag')
    // console.log(tags[tags.length - 1].textContent);
    // Et on les place dans le tableau créé plus haut

    selectedTags =
      tags.length === 0
        ? []
        : [...selectedTags, tags[tags.length - 1].textContent.toLowerCase()]

    // En dessous de trois caractères, on réinitialise la page (en cas de recherche effectuée précédemment)
    if (searchInput && searchInput.length < MIN_SEARCH_LENGTH) {
      // On réactualise la liste de tags
      onSelect(initialTags)
      // On réinitialise la page
      clearPage()
      return
    }

    // const recipesIds = searchByKeyword(searchList)(searchInput)
    // console.log(searchInput, recipesIds)
    // const recipesIds2 = filteredByTagsSelect(searchList)(selectedTags)
    // console.log(selectedTags, recipesIds2)

    // const ids = filterRecipes(recipesIds)(recipesIds2)

    // On initialise un nouveau state
    let newState = []

    // ids &&
    //   ids.forEach(id => {
    //     // Pour chacun de ces ids, on récupère la recette correspondante et la place dans le nouveau state
    //     let recipe = initialState.find(el => el.id === id)
    //     newState = [...newState, recipe]

    //     return newState
    //   })

    // Récupération des tags associés à la recherche utilisateur
    const allTags = newState.length
      ? getTags(searchInput, newState)
      : initialTags
    onSelect(allTags)

    // let userEvent = userSearch || tagSelect || tagInput
    app(userEvent)

    // if (selectedTags) {
    //   newState.filter(recipe => recipe.ingredients.forEach(obj => obj.ingredient.includes() )
    //     )
    // }
    // let arr1 = []
    //   arr1 = [...arr1,
    //       ...new Set(
    //         newState
    //           .map(recipe => recipe.ingredients.map(obj => obj.ingredient.toLowerCase()).flat(2))
    //           .flat(2)
    //       ),
    //     ]
    //     console.log(arr1)

    //     const arr2 = selectedTags
    // console.log(arr2);

    // const arrays = [arr1, arr2]
    //     const result = arrays.shift().filter(function (v) {
    //       return arrays.every(function (a) {
    //         return a.indexOf(v) !== -1
    //       })
    //     })
    // console.log(result);

    /**
   On affiche les cartes résultant de la recherche, via une composition de fonctions listées dans le fichier helpers.js:
   1. On récupère le nombre de recettes trouvées
   2. On affiche une snackbar avec le nombre de recettes trouvées
   3. On affiche la selection de recettes
   */
    const createCardsView = pipe(
      getRecipesFromSearch,
      printSnackbar,
      clearPage,
      clearErrorMessage,
      cardsView
    )

    createCardsView(searchInput)

    // On retire l'eventListener
    stop()
  })
}

// EventListener sur la barre de recherche
const userSearch = on('input')(getElement('.search__form_searchbar'))

// EventListener onclick sur la liste de tags
let tagSelect
if (getElement('.select').classList.contains('open')) {
  tagSelect = on('pointerdown')(getElement('.tag'))
}

// EventListener onInput sur un selecteur de tags
const tagInput = on('input')(getElement('.select__input'))

// Action à l'ouverture d'un selecteur
onSelect(initialTags)

// Action de l'utilisateur
let userEvent = userSearch || tagSelect || tagInput

app(userEvent)
