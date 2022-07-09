import { recipes } from '../data/recipes.js'
import { deepFreeze } from '../helpers.js'
import { searchList } from './quickSort.js'

const recipesList = deepFreeze(recipes)

const defaultCompare = (a, b) => {
  if (b.includes(a)) return 0
  return a > b ? 1 : a < b ? -1 : 0
}

export const binarySearch = (
  search,
  array = deepFreeze(searchList),
  compare = defaultCompare,
  left = 0,
  right = array.length - 1
) => {
  const searchFrom = middle => {
    let tab = []

    const searchLeftFrom = mid => {
      if (array[mid - 1].text.includes(search)) {
        tab = [
          ...tab,
          ...recipesList.filter(recipe => recipe.id === array[mid - 1].id),
        ]
        searchLeftFrom(mid - 1)
      }
      return tab
    }

    const searchRightFrom = mid => {
      if (array[mid + 1].text.includes(search)) {
        tab = [
          ...tab,
          ...recipesList.filter(recipe => recipe.id === array[mid + 1].id),
        ]
        searchRightFrom(mid + 1)
      }
      return tab
    }

    const foundRecipe = recipesList.filter(
      recipe => recipe.id === array[middle].id
    )

    return [
      ...foundRecipe,
      ...searchLeftFrom(middle),
      ...searchRightFrom(middle),
    ]
  }

  if (left > right) return

  const middle = Math.floor((left + right) / 2)
  const comparison = compare(search, array[middle].text)

  // console.log(array[middle])
  if (comparison === 0) return [...new Set(searchFrom(middle))]

  const newRange = comparison === -1 ? [left, middle - 1] : [middle + 1, right]

  return binarySearch(search, array, compare, ...newRange)
}
