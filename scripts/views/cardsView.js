import * as M from '../factory/helpers.js'
import recipeCardFactory from '../factory/recipeFactory.js'
import { clearPage } from '../helpers.js'
import { memoize, pipe } from '../utils/utils.js'

// Création d'un tableau de cards DOM correspondantes aux recettes selectionnées
// On évite de recréer des cartes déjà créées
const createRecipesCards = M.map(memoize(recipeCardFactory))

// Récuperation du container d'affichage
const cardsSection = M.getElement('.recipes')

// Affectation de la card au container d'affichage
const appendCard = card => M.append(card)(cardsSection)

// On execute cette affectation pour toutes les cards après avoir réinitialisé la page
const printCards = pipe(clearPage, M.forEach(appendCard))

//Composition des fonctions définies précédemment
export const createCardsView = pipe(createRecipesCards, printCards)
