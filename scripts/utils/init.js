import { initiateIngredientsTagsList, initiateSortedList } from '../algorithms/quickSort.js'
import { showTagsList } from '../components/tagsList.js'
import { recipes } from '../data/recipes.js'
import DOM from './domElements.js'

// On crée une liste ordonnée de mots clés à partir de la liste de recettes
export const sortedList = initiateSortedList()
export const ingredientsList = initiateIngredientsTagsList()

export const select = selection => {
  ;[...document.querySelectorAll('.select__trigger')].forEach(
    selector => (selector.onclick = showTagsList(selection))
  )
}

export const init = () => {
  // On met le focus dans l'input de recherche à l'ouverture de la page
  DOM.searchInput.focus()
  select(recipes)
}
