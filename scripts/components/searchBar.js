import { recipes as recipesList } from '../data/recipes.js'

const isFound = search => ({
  in: list => list.toLowerCase().includes(search.toLowerCase()),
})

const getFromSearch = search => {
  const searchResults = []

  for (let i = 0; i < recipesList.length; i++) {
    let recipes = recipesList[i]

    if (isFound(search).in(recipes.name)) searchResults.push(recipes)

    if (isFound(search).in(recipes.description)) searchResults.push(recipes)

    for (let j = 0; j < recipes.ingredients.length; j++) {
      if (isFound(search).in(recipes.ingredients[j].ingredient))
        searchResults.push(recipes)
    }
  }

  return searchResults
}

export { getFromSearch }
