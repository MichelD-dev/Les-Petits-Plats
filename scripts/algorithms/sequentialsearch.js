import { recipes } from '../data/recipes.js'
import { sortedList } from '../index.js'
import { printErrorMessage } from '../utils/utils.js'

// -------------------------------------------------------------------------- ///
// -------------------------------------------------------------------------- ///

const isFound = search => ({
  in: obj => obj.text.toLowerCase().includes(search.toLowerCase()),
})

const findInRecipes = obj => recipes.find(recipe => recipe.id === obj.id)

// ------------------------------------------------------------------------- //
// ------------------------------------------------------------------------- //

export const sequentialSearch = search => {
  // On initialise un tableau de résultats vide
  const searchResults = []

  // On boucle dans la liste d'objets triés
  for (let i = 0; i < sortedList.length; i++) {
    const currentObj = sortedList[i]

    // On vérifie si le mot recherché existe dans l'objet de l'itération en cours
    if (isFound(search).in(currentObj))
      // Si c'est le cas, on recherche la recette correspondante via l'id contenu dans l'objet, et on inclut cette recette dans le tableau de résultats
      searchResults.push(findInRecipes(currentObj))
  }

  searchResults.length === 0 &&
    printErrorMessage(
      'Aucune recette ne correspond à votre critère...Vous pouvez chercher "tarte aux pommes", "poisson", etc.'
    )

  return [...new Set(searchResults)]
}