import { recipes } from '../data/recipes.js'
import { searchList } from './quickSort.js'

// -------------------------------------------------------------------------- ///

const isFound = search => ({
  in: obj => obj.text.toLowerCase().includes(search.toLowerCase()),
})

const findInRecipes = obj => recipes.find(recipe => recipe.id === obj.id)

// ------------------------------------------------------------------------- //

export const sequentialSearch = search => {
  // On initialise un tableau de résultats vide
  const searchResults = []

  // On boucle dans la liste d'objets triés
  for (let i = 0; i < searchList.length; i++) {
    const currentObj = searchList[i]

    // On vérifie si le mot recherché existe dans l'objet de l'itération en cours
    if (isFound(search).in(currentObj))
      // Si c'est le cas, on recherche la recette correspondante via l'id contenu dans l'objet, et on inclut cette recette dans le tableau de résultats
      searchResults.push(findInRecipes(currentObj))
  }

  return [...new Set(searchResults)]
}
