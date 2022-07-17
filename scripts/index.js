import { onSelect, updateTagsList } from './components/selector.js'
import { getTags } from './components/tagsList.js'
import { getElement, getElements, map, trace } from './factory/helpers.js'
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

// On récupère une liste initiale immutable de tags
const initialTags = deepFreeze(getTags())

// On place le focus sur le champ de recherche à l'initialisation
//FIXME les passer en arguments
getElement('.search__form_searchbar').focus()

// On initialise un tableau de tags selectionnés
// let selectedTags = []

export const app = (userEvent, selectedTags = []) => {
  // On place l'event reçu dans un HOF Stop() pour pouvoir retirer l'eventListener après chaque frappe
  const stop = userEvent(() => {
    const MIN_SEARCH_LENGTH = 3

    // On récupère la frappe de l'utilisateur
    const searchInput = getElement('.search__form_searchbar').value
    const tagSelect = getElement('.tag')?.children[0].textContent

    // En dessous de trois caractères, on réinitialise la page (en cas de recherche effectuée précédemment)
    if (
      (!searchInput || searchInput.length < MIN_SEARCH_LENGTH) &&
      !tagSelect
    ) {
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

    const formatInput = input => {
      return formatted(input)
        .split(' ')
        .filter(str => (str.length >= 2 ? str : ''))
    } //FIXME Filter est censé renvoyer un booléen...

    const getRecipesByKeywords = arr =>
      arr
        .map(str => getRecipesFromSearch(formatted(str)))
        .filter(arr => arr !== undefined && arr.length !== 0)

    // On extrait le 1er tableau de recettes [[], [], []] => [][[], []] et on récupère ceux de ses objets qui se retrouvent dans le reste des tableaux
    const mergeRecipesResults = recipes => {
      if (!recipes.length) return recipes
      return recipes
        .shift()
        .filter(v => recipes.every(a => a.indexOf(v) !== -1))
    }
    // Récupération des tags associés à la recherche utilisateur

    const updateResult = tags => selection => {
      const newSelection = []
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

    const selector = getElement('.open')?.children[0].id

    /**
     On affiche les cartes résultant de la recherche, via une composition de fonctions listées dans le fichier helpers.js:
     1. On récupère le nombre de recettes trouvées
     2. On affiche une snackbar avec le nombre de recettes trouvées
   3. On affiche la selection de recettes
   */
    const createUI = pipe(
      // trace('result1'),
      formatInput,
      // trace('result2'),
      getRecipesByKeywords,
      // trace('result3'),
      mergeRecipesResults,
      // trace('result4'),
      clearErrorMessage,
      // trace('result5'),
      updateResult(selectedTags),
      // trace('result6'),
      updateTagsList(selector),
      // trace('result7'),
      clearPage,
      // trace('result8'),
      printSnackbar,
      // trace('result9'),
      cardsView
    )
    // FIXME jus de citron input: 9 results vs tag 4: inputs...
    createUI(searchInput.length > 2 ? searchInput : tagSelect)

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
// const tagInput = on('keyup')(getElement('.select__input'))

// Action à l'ouverture d'un selecteur
onSelect(initialTags)

// Action de l'utilisateur
let userEvent = userSearch || tagSelect

app(userEvent)
