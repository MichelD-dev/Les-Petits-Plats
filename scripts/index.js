// import { sortBy } from "../scripts/components/selector.js";
import { recipes } from './data/recipes.js'
import recipeFactory from './factory/recipeFactory.js'

let searchInput = document.querySelector('.search__form_searchbar')

// addReactionTo('change').on(search).withFunction(() => console.log(search.value))

const search = () => {
  if (searchInput.value.length < 3) return

  let results = []

  for (let i = 0; i < recipes.length; i++) {
    if (
      recipes[i].name.toLowerCase().includes(searchInput.value.toLowerCase())
    ) {
      const result = [
        ...recipes[i].name
          .toLowerCase()
          .matchAll(new RegExp(searchInput.value, 'gi')),
      ]
      for (const match of result) {
        results.push(match.input)
      }
      // searchInput.value = result

      for (let j = 0; j < recipes[i].ingredients.length; j++) {
        if (
          recipes[i].ingredients[j].ingredient
            .toLowerCase()
            .includes(searchInput.value.toLowerCase())
        ) {
          const result = [
            ...recipes[i].ingredients[j].ingredient
              .toLowerCase()
              .matchAll(new RegExp(searchInput.value, 'gi')),
          ]
          for (const match of result) {
            results.push(match.input)
          }
          // searchInput.value = result
        }
      }
    }

    if (
      recipes[i].description
        .toLowerCase()
        .includes(searchInput.value.toLowerCase())
    ) {
      const result = [
        ...recipes[i].description
          .toLowerCase()
          .matchAll(new RegExp(searchInput.value, 'gi')),
      ]
      for (const match of result) {
        results.push(match.input)
      }
      // searchInput.value = result
    }
  }

  console.log(results)
}

searchInput.addEventListener('keyup', search)

recipes.forEach(recipe => {
  const article = recipeFactory(recipe).getRecipeCardDOM();

  document.querySelector('.recipes').appendChild(article)
})
