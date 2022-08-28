import * as M from '../factory/helpers.js'
import {formatted} from '../helpers.js'
import {initialList} from '../init.js'

export const sequentialSearch4 = (search, selector, MIN_SEARCH_LENGTH) => {
  // Recherche sur le champ de recherche principal, si le mot entré fait au moins 3 lettres et qu'aucun tag n'a été selectionné
  if (
    M.getElement('.search__form_searchbar').value.length >= MIN_SEARCH_LENGTH ||
    !selector
  ) {
    const generator = function* (recipes) {
      for (const recipe of recipes) {
        if (recipe.text.includes(search)) yield recipe
      }
    }

    return [...generator(initialList)]
  }

  // Recherche à partir d'un tag Ingredients
  else if (selector === 'ingredients') {
    const generator2 = function* (recipe) {
      for (const ingredient of recipe.ingredients) {
        if (formatted(ingredient.ingredient).includes(formatted(search))) {
          yield recipe
          return
        }
      }
      // const foundRecipe = recipe.ingredients.find(ingredient => formatted(ingredient.ingredient).includes(formatted(search)))
      // if (foundRecipe) {
      //   yield recipe
      //  }
    }
    const generator = function* (recipes) {
      for (const recipe of recipes) {
        yield* generator2(recipe)
      }
    }
    return [...generator(initialList)]
  }

  // Recherche à partir d'un tag Appareils
  else if (selector === 'appliance') {
    const generator = function* (recipes) {
      for (const recipe of recipes) {
        if (formatted(recipe.appliance).includes(formatted(search)))
          yield recipe
      }
    }

    return [...generator(initialList)]
  }

  // Recherche à partir d'un tag Ustensiles
  else if (selector === 'ustensils') {
    const generator2 = function* (recipe) {
      for (const ustensile of recipe.ustensils) {
        if (formatted(ustensile).includes(formatted(search))) {
          yield recipe
          return
        }
      }
    }
    const generator = function* (recipes) {
      for (const recipe of recipes) {
        yield* generator2(recipe)
      }
    }
    return [...generator(initialList)]
  }
}
