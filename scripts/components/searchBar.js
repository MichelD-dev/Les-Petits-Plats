import { binarySearch } from '../algorithms/binarySearch.js'
import { sequentialSearch } from '../algorithms/sequentialsearch.js'
import { sequentialSearch2 } from '../algorithms/sequentialsearch2.js'
import { memoize } from '../utils/utils.js'

// Boucles for
const getRecipesFromSearch = memoize(sequentialSearch)

// boucle for ...of + méthode find
// const getRecipesFromSearch = memoize(sequentialSearch2)

// Recherche binaire
// const getRecipesFromSearch = memoize(binarySearch)

export { getRecipesFromSearch }
// 