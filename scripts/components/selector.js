import { getRecipes } from '../index.js'
import DOM from '../utils/domElements.js'
import { addReactionTo } from '../utils/eventListener.js'
import { search } from './searchBar.js'

/**
 * Tri de l'ordre d'affichage des images selon choix utilisateur
 */
export const sortBy = medias => {
  //   return sortingChoice => {
  //     const choices = {
  //       //   Titre: () => medias.sort((a, b) => a.title.localeCompare(b.title)),
  //       //   Popularité: () => medias.sort((a, b) => b.likes - a.likes),
  //       //   Date: () => medias.sort((a, b) => a.date - b.date),
  //     }
  //     return choices[sortingChoice]?.() ?? 'Critère de choix non reconnu'
  //   }
}

// --------------------------------------------------------------------------- //
// ------------------------------------UTILS---------------------------------- //
// --------------------------------------------------------------------------- //

/**
 * Changements d'apparence du selecteur sur events
 */
const selectorChange = selector => {
  //   console.log(selector)
  /**
   * Déclaration d'un tableau des selections non choisies
   */
  let notSelectedsOptionsArray = []

  /**
   * Ouverture du selecteur
   */
  if (!document.querySelector('.select').classList.contains('open')) {
    document.querySelector('.select').classList.add('open')
    document
      .querySelector('.custom-options')
      .setAttribute('aria-expanded', true)

    /**
     * Mise en tableau des selections non choisies
     */ //TODO
    //  e.target.parentElement.dataset.selector
    notSelectedsOptionsArray = [
      ...selector.getElementsByClassName('custom-option'),
    ].filter(el => !el.classList.contains('selected'))

    /**
     * Border-radius placé dynamiquement en bas de la dernière selection non choisie
     */
    notSelectedsOptionsArray[notSelectedsOptionsArray.length - 1].classList.add(
      'custom-option_last'
    )

    document.querySelector('.selected').focus()
  } else {
    /**
     * Fermeture du selecteur
     */
    document.querySelector('.select').classList.remove('open')
    document
      .querySelector('.custom-options')
      .setAttribute('aria-expanded', false)

    /**
     * On retire le bottom border-radius des selections avant de positionner une nouvelle selection en dernière position
     */
    ;[...document.getElementsByClassName('custom-option')].forEach(option =>
      option.classList.remove('custom-option_last')
    )
  }
}

/**
 * Affichage de l'option selectionnée
 */
const selectDisplaySorting = option => {
  for (const hidden of document.querySelectorAll(
    '.custom-option.hidden, .select__trigger'
  )) {
    hidden.classList.remove('hidden')
    document
      .querySelector('.select__trigger')
      .classList.add('no-btm-border-radius')
  }
  if (!option.classList.contains('selected')) {
    option.parentNode
      .querySelector('.custom-option.selected')
      .removeAttribute('aria-selected')
    option.parentNode
      .querySelector('.custom-option.selected')
      .classList.remove('selected')

    option.classList.add('selected')
    option.setAttribute('aria-selected', true)
    option.classList.add('hidden')
    setTimeout(() => {
      document
        .querySelector('.select__trigger')
        .classList.remove('no-btm-border-radius')
    }, 200)

    option
      .closest('.select')
      .querySelector('.select__trigger span').textContent = option.textContent
    document
      .querySelector('.select__trigger')
      .setAttribute('aria-activedescendant', `${option.textContent}`)
  }
}

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

  if (index >= focusables.length) {
    index = 0
  }
  if (index < 0) {
    index = focusables.length - 1
  }

  let option = focusables[index]
  option.focus()

  return focusables
}

// --------------------------------------------------------------------------- //
// -------------------------------EVENT LISTENERS----------------------------- //
// --------------------------------------------------------------------------- //
//TODO

/**
 * On ouvre le selecteur
 */
;[...document.querySelectorAll('.select-wrapper')].forEach(selector => {
  addReactionTo('pointerdown')
    .on(selector)
    .withFunction(e => {
      if (DOM.searchInput.value.length < 3) return

      const id = {
        ingredients: () => selectorChange(DOM.ingredientsSelector),
        appareils: () => selectorChange(DOM.appareilsSelector),
        ustensiles: () => selectorChange(DOM.ustensilesSelector),
      }

      return id[e.target.parentElement.id]?.() ?? "Ce selecteur n'existe pas"
    })
})

/**
 * On ouvre le selecteur avec le clavier
 */
addReactionTo('keydown')
  .on('.select-wrapper')
  .withFunction(e => {
    if (e.key === 'Enter') {
      selectorChange(DOM.ingredientsSelector)
      document.querySelector('.select__trigger').focus()
    }
  })

/**
 * Navigation au clavier dans le selecteur
 */
addReactionTo('keydown')
  .on(DOM.selector)
  .withFunction(e => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      document.querySelector('.select.open')?.classList.remove('open')
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

/**
 * On ferme le selecteur lorsque l'utilisateur clique quelque part dans la fenêtre
 */
addReactionTo('pointerdown')
  .on(window)
  .withFunction(e => {
    const select = document.querySelector('.select')
    if (!select.contains(e.target)) {
      select.classList.remove('open')
    }
  })
