import { recipes as recipesList } from '../data/recipes.js'
import { sortedList } from '../index.js'
import { printError } from '../utils/utils.js'

const defaultCompare = (a, b) => {
  if (b.includes(a)) return 0
  return a > b ? 1 : a < b ? -1 : 0
}

export const binarySearch = (
  search,
  array = sortedList,
  compare = defaultCompare,
  left = 0,
  right = array.length - 1
) => {
  const searchFrom = middle => {
    let tab = []

    const searchLeft = mid => {
      if (array[mid - 1].text.includes(search)) {
        tab = [
          ...tab,
          ...recipesList.filter(recipe => recipe.id === array[mid - 1].id),
        ]
        searchLeft(mid - 1)
      }
      return tab
    }

    const searchRight = mid => {
      if (array[mid + 1].text.includes(search)) {
        tab = [
          ...tab,
          ...recipesList.filter(recipe => recipe.id === array[mid + 1].id),
        ]
        searchRight(mid + 1)
      }
      return tab
    }

    const foundRecipe = recipesList.filter(
      recipe => recipe.id === array[middle].id
    )

    return [...foundRecipe, ...searchLeft(middle), ...searchRight(middle)]
  }

  if (left > right) {console.log('ok');
    printError('Aucune recette ne correspond à votre critère...Vous pouvez chercher "tarte aux pommes", "poisson", etc.')
    return
  }

  printError('')

  const middle = Math.floor((left + right) / 2)
  const comparison = compare(search, array[middle].text)

  console.log(array[middle])
  if (comparison === 0) return [...new Set(searchFrom(middle))]

  const newRange = comparison === -1 ? [left, middle - 1] : [middle + 1, right]

  return binarySearch(search, array, compare, ...newRange)
}
