import { append, getElement } from '../factory/helpers.js'
import recipeCardFactory from '../factory/recipeFactory.js'
import { clearPage } from '../helpers.js'
import { pipe } from '../utils/utils.js'

// ------------------------ Helpers ---------------------------------------- //

const appendCard = card => append(card)(getElement('.recipes'))

const appendCards = selection =>
  selection
    // Récupération des cards DOM correspondantes aux recettes selectionnées
    .map(recipeCardFactory)
    // Affichage de la selection de cartes de recettes
    .forEach(appendCard)

// ------------------------------------------------------------------------- //

export const cardsView = selection => pipe(clearPage, appendCards)(selection)

// TODO intersection Observer?
