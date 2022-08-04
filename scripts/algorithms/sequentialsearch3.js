import * as M from '../factory/helpers.js'
import { deepFreeze, formatted } from '../helpers.js'
import { initialList } from '../init.js'

const searchList = deepFreeze(initialList)

export const sequentialSearch3 = (
  search,
  selector,
  MIN_SEARCH_LENGTH,
  list = searchList,
  searchResults = []
) => {
  const first = list[0]
  const next = list.slice(1)

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
      searchResults
    )
  } else if (selector === 'appliance') {
    if (list.length === 0) return searchResults

    if (formatted(first[selector]).includes(search))
      searchResults = [...searchResults, first]

    return sequentialSearch3(
      search,
      selector,
      MIN_SEARCH_LENGTH,
      next,
      searchResults
    )
  } else if (selector === 'ustensils') {
    if (list.length === 0) return searchResults

    M.forEach(ustensile => {
      if (formatted(ustensile).includes(search))
        searchResults = [...searchResults, first]
    })(first[selector])

    return sequentialSearch3(
      search,
      selector,
      MIN_SEARCH_LENGTH,
      next,
      searchResults
    )
  } else if (selector === 'ingredients') {
    if (list.length === 0) return searchResults

    M.forEach(ingredient => {
      if (formatted(ingredient.ingredient).includes(search))
        searchResults = [...searchResults, first]
    })(first[selector])

    return sequentialSearch3(
      search,
      selector,
      MIN_SEARCH_LENGTH,
      next,
      searchResults
    )
  }

  return searchResults
}
