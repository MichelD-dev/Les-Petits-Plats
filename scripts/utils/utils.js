import DOM from "./domElements.js"

/**
 * Fonction de réinitialisation de la grille d'images
 */
 export const cardsSectionReset = () => {
    while (DOM.cardsSection.firstChild) {
      DOM.cardsSection.removeChild(DOM.cardsSection.lastChild)
    }
  }