import {
  initiateIngredientsTagsList,
  initiateSortedList,
} from '../algorithms/quickSort.js'
import { showTagsList } from '../components/tagsList.js'
import { recipes } from '../data/recipes.js'
import DOM from './domElements.js'
import { addReactionTo } from './eventListener.js'

// On crée une liste ordonnée de mots clés à partir de la liste de recettes
export const sortedList = initiateSortedList()
export const ingredientsList = initiateIngredientsTagsList()

export const select = () => {
  ;[...document.querySelectorAll('.arrow-container')].forEach(
    arrow =>
      (arrow.onclick = e => {
        if (
          document
            .getElementById(`select_${arrow.parentElement.id}`)
            .classList.contains('open')
        ) {
          return document
            .getElementById(`select_${arrow.parentElement.id}`)
            .classList.remove('open')
        }

        return showTagsList(e)
      })
  )
  ;[...document.querySelectorAll('.select__input')].forEach(
    selector =>
      (selector.onclick = e => {
        return showTagsList(e)
      })
  )
}

export const init = () => {
  // On met le focus dans l'input de recherche à l'ouverture de la page
  DOM.searchInput.focus()
  select(recipes)
}

/**
 * On ferme le selecteur lorsque l'utilisateur clique quelque part dans la fenêtre
 */
addReactionTo('pointerdown')
  .on(window)
  .withFunction(e => {
    if (e.target.classList.contains('tag__close')) return
    ;[...document.querySelectorAll('.select')].forEach(select => {
      if (!select.contains(e.target)) {
        select.classList.remove('open')
      }
    })
  })

// document.querySelector('.tag__close') && (document.querySelector('.tag__close').onclick = console.log('ok'))
