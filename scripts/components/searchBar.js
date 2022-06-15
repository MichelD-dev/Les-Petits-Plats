import { binarySearch } from '../algorithms/binarySearch.js'
import { sequentialSearch } from '../algorithms/sequentialsearch.js'
import { memoize } from '../utils/utils.js'

const getRecipesFromSearch = memoize(sequentialSearch)
const getIngredientsTagsFromSearch = memoize(sequentialSearch)
// const getRecipesFromSearch = memoize(binarySearch)

export { getRecipesFromSearch, getIngredientsTagsFromSearch }
