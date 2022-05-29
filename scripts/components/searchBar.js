import { recipes } from '../data/recipes.js'

// addReactionTo('change').on(search).withFunction(() => console.log(search.value))

export const search = search => {
  let results = []

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
