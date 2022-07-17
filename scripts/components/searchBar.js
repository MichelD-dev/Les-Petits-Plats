import { binarySearch } from '../algorithms/binarySearch.js'
import { sequentialSearch } from '../algorithms/sequentialsearch.js'
import { sequentialSearch2 } from '../algorithms/sequentialsearch2.js'
import { memoize } from '../utils/utils.js'

const getRecipesFromSearch = memoize(sequentialSearch)
// const getRecipesFromSearch = memoize(sequentialSearch2)
// const getRecipesFromSearch = memoize(binarySearch)

export { getRecipesFromSearch }
// 