import { append, forEach, getElement, map } from '../factory/helpers.js'
import recipeCardFactory from '../factory/recipeFactory.js'
import { clearPage } from '../helpers.js'
import { pipe } from '../utils/utils.js'

// Création d'un tableau de cards DOM correspondantes aux recettes selectionnées
const createRecipesCards = map(recipeCardFactory)

// Affectation de la card au container d'affichage
const appendCard = card => append(card)(getElement('.recipes'))

// On execute cette affectation pour toutes les cards
const printCards = forEach(appendCard)

// ------------------------------------------------------------------------- //

//Composition des fonctions définies précédemment
export const cardsView = pipe(clearPage, createRecipesCards, printCards)

// TODO intersection Observer?
