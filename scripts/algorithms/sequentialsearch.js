import * as M from '../factory/helpers.js'
import { recipes } from '../data/recipes.js'
import { deepFreeze, formatted } from '../helpers.js'
import { initialList } from '../init.js'

const recipesList = deepFreeze(recipes)

export const sequentialSearch = (search, selector, MIN_SEARCH_LENGTH,) => {
  let searchResults = []

  if (M.getElement('.search__form_searchbar').value.length >= MIN_SEARCH_LENGTH || !selector) {
    for (let i = 0; i < initialList.length; i++) {
      if (initialList[i].text.includes(search))
        searchResults.push(initialList[i])
    }
  } else if (selector === 'ingredients') {
    for (let i = 0; i < recipesList.length; i++) {
      for (let j = 0; j < recipesList[i].ingredients.length; j++) {
        if (
          formatted(recipesList[i].ingredients[j].ingredient).includes(
            formatted(search)
          )
        )
          searchResults.push(recipesList[i])
      }
    }
  } else if (selector === 'appliance') {
    for (let i = 0; i < recipesList.length; i++) {
      if (formatted(recipesList[i].appliance).includes(formatted(search)))
        searchResults.push(recipesList[i])
    }
  } else if (selector === 'ustensils') {
    for (let i = 0; i < recipesList.length; i++) {
      for (let j = 0; j < recipesList[i].ustensils.length; j++) {
        if (formatted(recipesList[i].ustensils[j]).includes(formatted(search)))
          searchResults.push(recipesList[i])
      }
    }
  }

  return searchResults
}
