import { recipes } from '../data/recipes.js'

export const getFromSearch = search => {
  const results = []

  for (let i = 0; i < recipes.length; i++) {
    if (recipes[i].name.toLowerCase().includes(search.toLowerCase())) {
      results.push(recipes[i])

      for (let j = 0; j < recipes[i].ingredients.length; j++) {
        if (
          recipes[i].ingredients[j].ingredient
            .toLowerCase()
            .includes(search.toLowerCase())
        ) {
          results.push(recipes[i])
        }
      }
    }

    if (recipes[i].description.toLowerCase().includes(search.toLowerCase())) {
      results.push(recipes[i])
    }
  }

  return results
}
