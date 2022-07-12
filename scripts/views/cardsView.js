import { append, forEach, getElement, map, trace } from '../factory/helpers.js'
import recipeCardFactory from '../factory/recipeFactory.js'
import { clearPage } from '../helpers.js'
import { pipe } from '../utils/utils.js'

// Création d'un tableau de cards DOM correspondantes aux recettes selectionnées
const createRecipesCards = map(recipeCardFactory)

// Affectation de la card au container d'affichage
const cardsSection = getElement('.recipes')
const appendCard = card => append(card)(cardsSection)

// On execute cette affectation pour toutes les cards
const printCards = forEach(appendCard)

// ------------------------------------------------------------------------- //

//Composition des fonctions définies précédemment
export const cardsView = pipe(
//   trace('cardsView'),
  clearPage,
  createRecipesCards,
  printCards
)

// TODO intersection Observer?
