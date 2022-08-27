import * as M from '../factory/helpers.js'
import {formatted} from '../helpers.js'
import {initialList} from '../init.js'

export const sequentialSearch = (search, selector, MIN_SEARCH_LENGTH) => {
  let searchResults = []

  // Recherche sur le champ de recherche principal, si le mot entré fait au moins 3 lettres et qu'aucun tag n'a été selectionné
  if (
    M.getElement('.search__form_searchbar').value.length >= MIN_SEARCH_LENGTH ||
    !selector
  ) {
    for (let i = 0; i < initialList.length; i++) {
      if (initialList[i].text.includes(search))
        searchResults.push(initialList[i])
    }
  }

  // Recherche à partir d'un tag Ingredients
  else if (selector === 'ingredients') {
    for (let i = 0; i < initialList.length; i++) {
      for (let j = 0; j < initialList[i].ingredients.length; j++) {
        if (
          formatted(initialList[i].ingredients[j].ingredient).includes(
            formatted(search),
          )
        ) {
          searchResults.push(initialList[i])
          break
        }
      }
    }
  }

  // Recherche à partir d'un tag Appareils
  else if (selector === 'appliance') {
    for (let i = 0; i < initialList.length; i++) {
      if (formatted(initialList[i].appliance).includes(formatted(search))) {
        searchResults.push(initialList[i])
      }
    }
  }

  // Recherche à partir d'un tag Ustensiles
  else if (selector === 'ustensils') {
    for (let i = 0; i < initialList.length; i++) {
      for (let j = 0; j < initialList[i].ustensils.length; j++) {
        if (
          formatted(initialList[i].ustensils[j]).includes(formatted(search))
        ) {
          searchResults.push(initialList[i])
          break
        }
      }
    }
  }

  return searchResults
}
