import { recipes } from '../data/recipes.js'
import { printErrorMessage } from '../utils/utils.js'
import {
  // appareilsList,
  // ingredientsList,
  searchList,
  // ustensilesList,
} from './quickSort.js'

// ------------------------------------------------------------------------- //

const isFound = search => ({
  in: obj => obj.text.toLowerCase().includes(search.toLowerCase()),
})

const findInRecipes = obj => recipes.find(recipe => recipe.id === obj.id)

// ------------------------------------------------------------------------- //

export const sequentialSearch = (userInput = '', list = searchList) => {
  // On initialise un tableau de résultats vide
  let recipesSelection = []

  // On initialise un tableau de résultats vide
  let recipesIds = []

  // On boucle dans la liste d'objets triés
  for (let i = 0; i < list.length; i++) {
    const currentObj = list[i]

    // On vérifie si le mot recherché existe dans l'objet de l'itération en cours
    if (isFound(userInput).in(currentObj))
      // Si c'est le cas, on recherche la recette correspondante via l'id contenu dans l'objet, et on inclut cette recette dans le tableau de résultats

      recipesSelection.push(findInRecipes(currentObj))
  }

  // On boucle dans la liste d'objets triés
  // for (const element of list) {
  //   if (element.text.includes(userInput)) {
  //     // On récupère un tableau des ids correspondantes à la recherche
  //     recipesIds = [...new Set([...recipesIds, ...element.ids])]
  //   }

  //   // On boucle dans ce tableau d'ids
  //   for (const id of recipesIds) {
  //     // On boucle dans la liste de recettes initiale
  //     for (const recipe of recipes) {
  //       // On récupère (une fois) les recettes correspondant aux ids retenues
  //       if (id === recipe.id && !recipesSelection.includes(recipe)) {
  //         // On remplit notre tableau de recettes avec le résultat
  //         recipesSelection.push(recipe)
  //       }
  //     }

  //     // ------------------------ Création des listes de tags -------------------------- //

  //     // On initialise un tableau de résultats vide
  //     const ingredients = []
  //     // On boucle dans la liste totale d'ingredients
  //     for (const ingredient of ingredientsList) {
  //       // On boucle dans les tableaux d'ids de chaque ingrédient
  //       for (const ingredientId of ingredient.ids) {
  //         // On récupère (une fois) les ingredients correspondants aux ids retenues
  //         if (id === ingredientId && !ingredients.includes(ingredient.text)) {
  //           // On remplit notre tableau d'ingredients avec le résultat
  //           ingredients.push(ingredient.text)
  //         }
  //       }
  //     }

  //     // On initialise un tableau de résultats vide
  //     const appareils = []
  //     // On boucle dans la liste totale d'appareils
  //     for (const appareil of appareilsList) {
  //       // On boucle dans les tableaux d'ids de chaque appareil
  //       for (const appareilId of appareil.ids) {
  //         // On récupère (une fois) les appareils correspondants aux ids retenues
  //         if (id === appareilId && !appareils.includes(appareil.text)) {
  //           // On remplit notre tableau d'appareils avec le résultat
  //           appareils.push(appareil.text)
  //         }
  //       }
  //     }

  //     // On initialise un tableau de résultats vide
  //     let ustensiles = []
  //     // On boucle dans la liste totale d'ustensiles
  //     for (const ustensile of ustensilesList) {
  //       // On boucle dans les tableaux d'ids de chaque ustensile
  //       for (const ustensileId of ustensile.ids) {
  //         // On récupère (une fois) les ustensiles correspondants aux ids retenues
  //         if (id === ustensileId && !ustensiles.includes(ustensile.text)) {
  //           // On remplit notre tableau d'ustensiles avec le résultat
  //           ustensiles.push(ustensile.text)
  //         }
  //       }
  //     }
  //   }
  // }

  recipesSelection.length === 0 &&
    printErrorMessage(
      'Aucune recette ne correspond à votre critère... Vous pouvez chercher "tarte aux pommes", "poisson", etc.'
    )

  recipesSelection = [...new Set(recipesSelection)]

  return { recipesSelection, ingredients, appareils, ustensiles }
}
