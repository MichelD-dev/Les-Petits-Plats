import * as M from '../factory/helpers.js'
import {recipes} from '../data/recipes.js'
import {deepFreeze, formatted} from '../helpers.js'
import {initialList} from '../init.js'

const recipesList = deepFreeze(recipes)

export const sequentialSearch2 = (search, selector, MIN_SEARCH_LENGTH) => {
  // Recherche sur le champ de recherche principal, si le mot entré fait au moins 3 lettres et qu'aucun tag n'a été selectionné
  if (
    M.getElement('.search__form_searchbar').value.length >= MIN_SEARCH_LENGTH ||
    !selector
  ) {
    return initialList.filter(recipe => recipe.text.includes(search))
  }

  // Recherche à partir d'un tag Ingredients
  else if (selector === 'ingredients') {
    return recipesList.filter(recipe =>
      recipe.ingredients.some(ingredient => {
        if (formatted(ingredient.ingredient).includes(formatted(search)))
          return recipe
      }),
    )
  }

  // Recherche à partir d'un tag Appareils
  else if (selector === 'appliance') {
    return recipesList.filter(recipe =>
      formatted(recipe.appliance).includes(formatted(search)),
    )
  }

  // Recherche à partir d'un tag Ustensiles
  else if (selector === 'ustensils') {
    return recipesList.filter(recipe =>
      recipe.ustensils.some(ustensil => {
        if (formatted(ustensil).includes(formatted(search))) return recipe
      }),
    )
  }
}
