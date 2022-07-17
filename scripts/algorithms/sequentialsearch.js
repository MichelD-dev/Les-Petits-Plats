import { recipes } from '../data/recipes.js'
import { searchList } from './quickSort.js'

export const sequentialSearch = search => {
  // On initialise un tableau de résultats vide
  const searchResults = []

  // On boucle dans la liste d'objets triés
  for (let i = 0; i < searchList.length; i++) {
    const currentObj = searchList[i]
    // On vérifie si le mot recherché existe dans l'objet de l'itération en cours
    if (currentObj.text.toLowerCase().includes(search.toLowerCase())) {
      // Si c'est le cas, on recherche la recette correspondante via l'id contenu dans l'objet, et on inclut cette recette dans le tableau de résultats
      for (let j = 0; j < recipes.length; j++) {
        if (
          recipes[j].id === currentObj.id &&
          !searchResults.includes(recipes[j])
        ) {
          searchResults.push(recipes[j])
        }
      }
    }
  }

  return searchResults
}
