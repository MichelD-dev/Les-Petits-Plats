import * as M from './factory/helpers.js'
import { onSelect, createTagsLists } from './components/selector.js'
import { getTags } from './components/tagsList.js'
import { clearPage, formatted, observer, on } from './helpers.js'
import { pipe, printErrorMessage } from './utils/utils.js'
import { createCardsView } from './views/cardsView.js'
import { getRecipesFromSearch } from './components/searchBar.js'
import { printSnackbar } from './components/snackbar.js'

// On récupère une liste initiale immutable de tags
const initTags = getTags()

// On place le focus sur le champ de recherche à l'initialisation
M.getElement('.search__form_searchbar').focus()

export const app = (userEvent, initialTags = initTags) => {
  // On place l'event reçu dans un HOF Stop() pour pouvoir retirer l'eventListener après chaque frappe
  const stop = userEvent(() => {
    // Nombre de caractères minimal
    const MIN_SEARCH_LENGTH = 3

    // On récupère la frappe de l'utilisateur
    const searchInput = M.getElement('.search__form_searchbar').value

    // On crée un tableau des tags selectionnés
    const tags = M.getElements('.tag')
    const selectedTags = M.map(tag => tag.textContent.toLowerCase())(tags) ?? []

    // On récupère le texte du premier tag selectionné
    const tagSelect = tags[0]?.children[0].textContent

    // En dessous de trois caractères, on réinitialise la page (en cas de recherche effectuée précédemment)
    if (searchInput.length < MIN_SEARCH_LENGTH && !tagSelect) {
      // On réactualise la liste de tags
      onSelect(initialTags)

      // On réinitialise la page
      clearPage()
      return
    }

    // On récupère les recettes correspondantes à la requête de l'utilisateur
    const getRecipes = request => {
      const selector = tags[0]?.dataset.selector

      const recipes = getRecipesFromSearch(request, selector, MIN_SEARCH_LENGTH)

      //On affiche un message d'erreur si aucune recette n'est retournée par la requête
      printErrorMessage(
        recipes?.length === 0
          ? 'Aucune recette ne correspond à votre critère...Vous pouvez chercher "tarte aux pommes", "poisson", etc.'
          : ''
      )
      return recipes
    }

    // On filtre les tags pour ne garder que ceux associés au résultat
    const updateTags = recipes => {
      onSelect(getTags(recipes))

      return recipes
    }

    // On actualise la liste de recettes affichées en fonction des tags selectionnés
    const updateResult = selectedTags => selection => {
      let newSelection = []
      let recipesTags = []

      M.forEach(recipe => {
        const ingredientsTags = M.map(ingredient =>
          formatted(ingredient.ingredient)
        )(recipe.ingredients)
        const appareilsTags = formatted(recipe.appliance)
        const ustensilesTags = M.map(ustensile =>
          formatted(ustensile)
        )(recipe.ustensils)

        recipesTags = [...ingredientsTags, appareilsTags, ...ustensilesTags]

        if (
          selectedTags.every(tag => recipesTags.includes(tag)) &&
          !newSelection.includes(recipe)
        ) {
          newSelection = [...newSelection, recipe]
        }
      })(selection)

      if (newSelection.length === 0 || selectedTags.length === 0) return selection

      onSelect(getTags(newSelection))

      return newSelection
    }

    const updateRecipesWithSelectedTags = updateResult(selectedTags)

    /**
    On affiche les cartes résultant de la recherche, via une composition de fonctions
    1. On récupère le nombre de recettes trouvées
    2. On filtre les listes de tags en fonction des recettes trouvées
    3. On actualise la liste de recettes lors de la selection d'un ou plusieurs tags
    4. On créée les listes de tags après selection d'un ou plusieurs tagsList
    5. On affiche brièvement une snackbar indiquant le nombre de recttes trouvées
    6. On affiche les cartes correspondantes aux recettes trouvées.
   */
    const createUI = pipe(
      getRecipes,
      updateTags,
      updateRecipesWithSelectedTags,
      createTagsLists,
      printSnackbar,
      createCardsView
    )

    // La requète utilisateur sera un mot de plus de trois caractères ou un tag selectionné
    const request =
      searchInput.length >= MIN_SEARCH_LENGTH ? searchInput : tagSelect

    createUI(formatted(request))

    // On implémente un intersectionObserver pour ne rendre les cartes que lorsqu'elles sont dans le champ d'affichage
    const cards = M.getElements('.recipe-card')
    cards.length !== 0 && M.forEach(card => observer.observe(card))(cards)

    // On retire l'eventListener après l'appel à son callback
    stop()

    // On rappelle la fonction à chaque action de l'utilisateur
    app(userEvent)
  })
}

// EventListener sur la barre de recherche
const userSearch = on('input')(M.getElement('.search__form_searchbar'))

// EventListener sur la liste de tags
const tagSelect = on('pointerdown')(M.getElement('.tag'))

// Affichage des listes initiales de tags à l'ouverture d'un selecteur
onSelect(initTags)

// Action de l'utilisateur
let userEvent = userSearch || tagSelect

app(userEvent)
