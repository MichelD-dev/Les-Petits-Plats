import { recipes } from '../data/recipes.js'
import { printErrorMessage } from '../utils/utils.js'
import {
  appareilsList,
  ingredientsList,
  searchList,
  ustensilesList,
} from './quickSort.js'

// ------------------------------------------------------------------------- //
// ------------------------------------------------------------------------- //

export const sequentialSearch = (userInput = '', list = searchList) => {
  // On initialise un tableau de résultats vide
  const recipesSelection = []

  // On initialise un tableau de résultats vide
  let recipesIds = []
  // On boucle dans la liste d'objets triés
  for (const element of list) {
    if (element.text.includes(userInput)) {
      // On récupère un tableau des ids correspondantes à la recherche
      recipesIds = [...new Set([...recipesIds, ...element.ids])]
    }

    // On boucle dans ce tableau d'ids
    for (const id of recipesIds) {
      // On boucle dans la liste de recettes initiale
      for (const recipe of recipes) {
        // On récupère (une fois) les recettes correspondant aux ids retenues
        if (id === recipe.id && !recipesSelection.includes(recipe)) {
          // On récupère le tableau de recettes correspondant
          recipesSelection.push(recipe)
        }
      }

      // On initialise un tableau de résultats vide
      const ingredients = []
      // On boucle dans la liste totale d'ingredients
      for (const ingredient of ingredientsList) {
        // On boucle dans les tableaux d'ids de chaque ingrédient
        for (const ingredientId of ingredient.ids) {
          // On récupère (une fois) les ingredients correspondants aux ids retenues
          if (id === ingredientId && !ingredients.includes(ingredient.text)) {
            // On récupère le tableau d'ingredients correspondants
            ingredients.push(ingredient.text)
          }
        }
      }

      // On initialise un tableau de résultats vide
      const appareils = []
      // On boucle dans la liste totale d'appareils
      for (const appareil of appareilsList) {
        // On boucle dans les tableaux d'ids de chaque appareil
        for (const appareilId of appareil.ids) {
          // On récupère (une fois) les appareils correspondants aux ids retenues
          if (id === appareilId && !appareils.includes(appareil.text)) {
            // On récupère le tableau d'appareils correspondants
            appareils.push(appareil.text)
          }
        }
      }

      // On initialise un tableau de résultats vide
      let ustensiles = []
      // On boucle dans la liste totale d'ustensiles
      for (const ustensile of ustensilesList) {
        // On boucle dans les tableaux d'ids de chaque ustensile
        for (const ustensileId of ustensile.ids) {
          // On récupère (une fois) les ustensiles correspondants aux ids retenues
          if (id === ustensileId && !ustensiles.includes(ustensile.text)) {
            // On récupère le tableau d'ustensiles correspondants
            ustensiles.push(ustensile.text)
          }
        }
      }
    }
  }

  recipesSelection.length === 0 &&
    printErrorMessage(
      'Aucune recette ne correspond à votre critère... Vous pouvez chercher "tarte aux pommes", "poisson", etc.'
    )

  return { recipesSelection, ingredients, appareils, ustensiles }
}
