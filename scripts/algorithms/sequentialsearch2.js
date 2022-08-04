import * as M from '../factory/helpers.js'
import { recipes } from '../data/recipes.js'
import { deepFreeze, formatted } from '../helpers.js'
import { initialList } from '../init.js'

const recipesList = deepFreeze(recipes)

export const sequentialSearch2 = (search, selector, MIN_SEARCH_LENGTH,) => {
  let searchResults = []

  if (M.getElement('.search__form_searchbar').value.length >= MIN_SEARCH_LENGTH || !selector) {
    return initialList.filter(recipe => {
      if (recipe.text.includes(formatted(search))) return recipe
    })
  } else if (selector === 'ingredients') {
    recipesList.filter(recipe =>
      M.forEach(ingredient => {
        if (formatted(ingredient.ingredient).includes(formatted(search)))
          searchResults = [...searchResults, recipe]
      })(recipe.ingredients)
    )
  } else if (selector === 'appliance') {
    return recipesList.filter(recipe =>
      formatted(recipe.appliance).includes(formatted(search))
    )
  } else if (selector === 'ustensils') {
    recipesList.filter(recipe =>
      M.forEach(ustensil => {
        if (formatted(ustensil).includes(formatted(search)))
          searchResults = [...searchResults, recipe]
      })(recipe.ustensils)
    )
  }

  return searchResults
}
