import DOM from '../utils/domElements.js'
import { addReactionTo } from '../utils/eventListener.js'
import { showTagsList } from './tagsList.js'

// --------------------------------------------------------------------------- //
// ------------------------------------UTILS---------------------------------- //
// --------------------------------------------------------------------------- //

/**
 * Changements d'apparence du selecteur sur events
 */
export const selectorChange = selector => {
  /**
   * Ouverture du selecteur
   */
  if (!document.getElementById(selector.id).classList.contains('open')) {
    ;[...document.querySelectorAll('.select')].forEach(selector =>
      selector.classList.remove('open')
    )
    return document.getElementById(selector.id).classList.add('open')
  }
}

/**
 * Affichage de l'option selectionnée
 */
// const selectDisplaySorting = option => {
//   for (const hidden of document.querySelectorAll(
//     '.custom-option.hidden, .select__trigger'
//   )) {
//     hidden.classList.remove('hidden')
//     document
//       .querySelector('.select__trigger')
//       .classList.add('no-btm-border-radius')
//   }
//   if (!option.classList.contains('selected')) {
//     option.parentNode
//       .querySelector('.custom-option.selected')
//       .removeAttribute('aria-selected')
//     option.parentNode
//       .querySelector('.custom-option.selected')
//       .classList.remove('selected')

//     option.classList.add('selected')
//     option.setAttribute('aria-selected', true)
//     option.classList.add('hidden')
//     setTimeout(() => {
//       document
//         .querySelector('.select__trigger')
//         .classList.remove('no-btm-border-radius')
//     }, 200)

//     option
//       .closest('.select')
//       .querySelector('.select__trigger span').textContent = option.textContent
//     document
//       .querySelector('.select__trigger')
//       .setAttribute('aria-activedescendant', `${option.textContent}`)
//   }
// }

/**
 * GESTION DU FOCUS
 * Changement de focus au clavier et maintien du focus dans le selecteur
 */
const focusInSelector = e => {
  e.preventDefault()

  /**
   * On récupère les éléments qui acquerront le focus dans le selecteur
   */
  const focusableElements = '.select__trigger, .custom-option:not(.selected)'

  /**
   * On crée un tableau des éléments focusables
   */
  let focusables = [...DOM.selector.querySelectorAll(focusableElements)]

  let index = focusables.findIndex(
    elem => elem === DOM.selector.querySelector(':focus')
  )

  e.shiftKey === true ? index-- : index++

  const focusablesNbr = focusables.length

  if (index >= focusablesNbr) {
    index = 0
  }
  if (index < 0) {
    index = focusablesNbr - 1
  }

  let option = focusables[index]
  option.focus()

  return focusables
}

// --------------------------------------------------------------------------- //
// -------------------------------EVENT LISTENERS----------------------------- //
// --------------------------------------------------------------------------- //

/**
 * On ouvre le selecteur avec le clavier
 */
// addReactionTo('keydown')
//   .on('.select-wrapper')
//   .withFunction(e => {
//     if (e.key === 'Enter') {
//       selectorChange(DOM.ingredientsSelector)
//       document.querySelector('.select__trigger').focus()
//     }
//   })

/**
 * Navigation au clavier dans le selecteur
 */
addReactionTo('keydown')
  .on(DOM.selectorInput)
  .withFunction(e => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      document.querySelector('.select.open').classList.remove('open')
      document.querySelector('.select__trigger').focus()
    }
    if (e.key === 'Tab' && !!document.querySelector('.select.open')) {
      focusInSelector(e)
    }
  })

/**
 * Selection
 */
for (const option of document.getElementsByClassName('custom-option')) {
  addReactionTo('pointerdown')
    .on(option)
    .withFunction(() => {
      selectDisplaySorting(option)
    })
  addReactionTo('keydown')
    .on(option)
    .withFunction(e => {
      if (
        e.key === 'Enter' &&
        document.querySelector('.select.open') &&
        !document.activeElement.classList.contains('select__trigger')
      ) {
        selectDisplaySorting(option)
      }
    })
}

/**
 * Récupération des données selon la catégorie sélectionnée
 */
for (const selected of document.querySelectorAll('.custom-option')) {
  addReactionTo('pointerdown')
    .on(selected)
    .withFunction(() => {
      const sortingChoice = selected.textContent
      // getDatas(sortingChoice)
    })

  addReactionTo('keydown')
    .on(selected)
    .withFunction(e => {
      if (e.key === 'Enter') {
        const sortingChoice = selected.textContent
        // getDatas(sortingChoice)
      }
    })
}

