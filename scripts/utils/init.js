import {
  initiateSortedList,
} from '../algorithms/quickSort.js'
import { showTagsList } from '../components/tagsList.js'
import DOM from './domElements.js'
import { addReactionTo } from './eventListener.js'

// On crée une liste ordonnée de mots clés à partir de la liste de recettes
export const sortedList = initiateSortedList()
console.log(sortedList);

export const select = () => {
  // Ouverture/fermeture des selecteurs
  ;[...document.querySelectorAll('.arrow-container')].forEach(
    arrow =>
      (arrow.onclick = () => {
        if (
          document
            .getElementById(`select_${arrow.parentElement.id}`)
            .classList.contains('open')
        ) {
          return document
            .getElementById(`select_${arrow.parentElement.id}`)
            .classList.remove('open')
        }

        // Affichage des tags
        return showTagsList(arrow.parentElement.id)
      })
  )

  // Affichage des tags lorsqu'on clique dans le selecteur input
  ;[...document.querySelectorAll('.select__input')].forEach(
    selector =>
      (selector.onclick = () => {
        return showTagsList(selector.parentElement.id)
      })
  )
}

export const init = () => {
  // On met le focus dans l'input de recherche à l'ouverture de la page
  DOM.searchInput.focus()
  select()
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
