// import {sequentialSearch} from '../algorithms/sequentialsearch.js'
import {sequentialSearch2} from '../algorithms/sequentialsearch2.js'
// import {sequentialSearch3} from '../algorithms/sequentialsearch3.js'
// import {sequentialSearch4} from '../algorithms/sequentialsearch4.js'
import {memoize} from '../utils/utils.js'

// Boucles for
// const getRecipesFromSearch = memoize(sequentialSearch)

// boucle forEach  + méthode filter
const getRecipesFromSearch = memoize(sequentialSearch2)

// Recherche recursive
// const getRecipesFromSearch = memoize(sequentialSearch3)

// function generator
// const getRecipesFromSearch = memoize(sequentialSearch4)

export {getRecipesFromSearch}
