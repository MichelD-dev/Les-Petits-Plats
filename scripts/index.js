import { searchList } from './algorithms/quickSort.js'
import { filterRecipes } from './components/recipesFilter.js'
import { getRecipesFromSearch } from './components/searchBar.js'
import { onSelect } from './components/selector.js'
import { getTags} from './components/tagsList.js'
import { getElement, getElements } from './factory/helpers.js'
import {
  clearPage,
  filteredByTagsSelect,
  on,
  printSnackbar,
  searchByKeyword,
} from './helpers.js'
import { pipe } from './utils/utils.js'
import { cardsView } from './views/cardsView.js'

// On récupère un tableau de selections de recettes initial, qui sera notre state initial
const { recipesSelection } = getRecipesFromSearch()
const initialState = Object.freeze(recipesSelection)

// On récupère une liste initiale de tags
const initialTags = Object.freeze(getTags())

// On place le focus sur le champ de recherche à l'initialisation
getElement('.search__form_searchbar').focus()

// On initialise un tableau de tags selectionnés
let selectedTags = []

export const app = (userEvent = () => {}) => {
  // On place l'event reçu dans un HOF Stop() pour pouvoir retirer l'eventListener après l'actualisation de la recherche
  const stop = userEvent(() => {
    // On récupère la frappe de l'utilisateur
    const searchInput = getElement('.search__form_searchbar').value

    // On récupère les tags selectionnés
    const tags = getElements('.tag')

    // Et on les place dans le tableau créé plus haut
    selectedTags =
      tags.length === 0
        ? []
        : [...selectedTags, tags[tags.length - 1].textContent.toLowerCase()]

    // En dessous de trois caractères, on réinitialise la page (en cas de recherche effectuée précédemment)
    if (searchInput && searchInput.length < 3) {
      // On réactualise la liste de tags
      onSelect(initialTags)
      // On réinitialise la page
      clearPage()
      return
    }

    const recipesIds = searchByKeyword(searchList)(searchInput)
    // console.log(searchInput, recipesIds)
    const recipesIds2 = filteredByTagsSelect(searchList)(selectedTags)
    // console.log(selectedTags, recipesIds2)

    const ids = filterRecipes(recipesIds)(recipesIds2)

    // On initialise un nouveau state
    let newState = []

    ids.forEach(id => {
      // Pour chacun de ces ids, on récupère la recette correspondante et la place dans le nouveau state
      let recipe = initialState.find(el => el.id === id)
      newState = [...newState, recipe]

      return newState
    })

    // Récupération des tags associés à la recherche utilisateur
    const allTags = searchInput ? getTags(searchInput) : initialTags
    onSelect(allTags)
    // let userEvent = userSearch || tagSelect || tagInput
    app(userEvent)

    /**
   On affiche les cartes résultant de la recherche, via une composition de fonctions listées dans le fichier helpers.js:
   1. On récupère le nombre de recettes trouvées
   2. On affiche une snackbar avec le nombre de recettes trouvées
   3. On affiche la selection de recettes
   */
    pipe(printSnackbar, clearPage, cardsView)(newState)

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

onSelect(initialTags)
// Initialisation de l'application avec le state initial
let userEvent = userSearch || tagSelect || tagInput

userEvent && app(userEvent)
