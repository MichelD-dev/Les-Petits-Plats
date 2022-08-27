import * as M from '../factory/helpers.js'
import {deepFreeze, formatted} from '../helpers.js'
import {initialList} from '../init.js'

const searchList = deepFreeze(initialList)

export const sequentialSearch3 = (
  search,
  selector,
  MIN_SEARCH_LENGTH,
  list = searchList,
  searchResults = [],
) => {
  const first = list[0]
  const next = list.slice(1)

  // Recherche sur le champ de recherche principal, si le mot entré fait au moins 3 lettres et qu'aucun tag n'a été selectionné
  if (
    M.getElement('.search__form_searchbar').value.length >= MIN_SEARCH_LENGTH ||
    !selector
  ) {
    if (list.length === 0) return searchResults

    if (first.text.includes(search)) searchResults = [...searchResults, first]

    return sequentialSearch3(
      search,
      selector,
      MIN_SEARCH_LENGTH,
      next,
      searchResults,
    )
  }

  // Recherche à partir d'un tag Ingredients
  else if (selector === 'ingredients') {
    if (list.length === 0) return searchResults

    const foundRecipe = M.find(ingredient =>
      formatted(ingredient.ingredient).includes(search),
    )(first[selector])

    searchResults = foundRecipe ? [...searchResults, first] : searchResults

    return sequentialSearch3(
      search,
      selector,
      MIN_SEARCH_LENGTH,
      next,
      searchResults,
    )
  }

  // Recherche à partir d'un tag Appareils
  else if (selector === 'appliance') {
    if (list.length === 0) return searchResults

    if (formatted(first[selector]).includes(search))
      searchResults = [...searchResults, first]

    return sequentialSearch3(
      search,
      selector,
      MIN_SEARCH_LENGTH,
      next,
      searchResults,
    )
  }

  // Recherche à partir d'un tag Ustensiles
  else if (selector === 'ustensils') {
    if (list.length === 0) return searchResults

    const foundRecipe = M.find(ustensile =>
      formatted(ustensile).includes(search),
    )(first[selector])

    searchResults = foundRecipe ? [...searchResults, first] : searchResults

    return sequentialSearch3(
      search,
      selector,
      MIN_SEARCH_LENGTH,
      next,
      searchResults,
    )
  }

  return searchResults
}
