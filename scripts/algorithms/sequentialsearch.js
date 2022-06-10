import { recipes } from '../data/recipes.js'
import { sortedList } from '../index.js'
import { printError } from '../utils/utils.js'

const isFound = search => ({
  in: obj => obj.text.toLowerCase().includes(search.toLowerCase()),
})

export const sequentialSearch = search => {
  const searchResults = []

  for (let i = 0; i < sortedList.length; i++) {
    const obj = sortedList[i]

    if (isFound(search).in(obj))
      searchResults.push(recipes.find(recipe => recipe.id === obj.id))
  }

  searchResults.length === 0 && printError('Aucune recette ne correspond à votre critère...Vous pouvez chercher "tarte aux pommes", "poisson", etc.')

  return [...new Set(searchResults)]
}
