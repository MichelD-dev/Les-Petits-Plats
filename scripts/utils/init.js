import { searchList } from '../algorithms/quickSort.js'
import { showTagsList } from '../components/tagsList.js'
import DOM from './domElements.js'
import { addReactionTo } from './eventListener.js'

// Ouverture/fermeture des selecteurs
export const select = (selection = '') => {
  ;[...document.querySelectorAll('.arrow-container')].forEach(
    arrow =>
      (arrow.onclick = () => {
        const selector = arrow.parentElement.id

        // if (
        //   document
        //     .getElementById(`select_${selector}`)
        //     .classList.contains('open')
        // ) {
        //   return document
        //     .getElementById(`select_${selector}`)
        //     .classList.remove('open')
        // }

        // Affichage des tags
        return showTagsList(selector, selection, DOM.searchInput.value)
      })
  )

  // Affichage des tags lorsqu'on clique dans le selecteur input
  ;[...document.querySelectorAll('.select__input')].forEach(
    selector =>
      (selector.onclick = () => {
        return showTagsList(selector.parentElement.id, selection, DOM.searchInput.value)
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
