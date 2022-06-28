import { recipes } from '../data/recipes.js'

// A l'initialisation, on crée à partir de la liste de recettes initiale 5 listes séparées pour les noms, les descriptions, les ingrédients, les appareils et les ustensiles
const list = (recipes, ...categories) => {
  let listing = categories.map(category => {
    return recipes.reduce((arr, obj1) => {
      const formatted = str =>
        str
          .toLowerCase()
          .replace(/[.,#!$^&*;:(){}=-_`~]/g, '')
          .replace(/\s+/g, ' ')
          .trim()

      // Alternative à un if/else ou un switch
      // ((pour category = name) => on retourne l'objet { text: formatted(obj1.name), id: obj1.id }
      const choice = {
        name: () => ({ text: formatted(obj1.name), id: obj1.id }),
        description: () => ({ text: formatted(obj1.description), id: obj1.id }),
        ingredients: () =>
          obj1.ingredients.map(ingredient => ({
            text: formatted(ingredient.ingredient),
            id: obj1.id,
          })),
        appareils: () => ({ text: formatted(obj1.appliance), id: obj1.id }),
        ustensiles: () =>
          obj1.ustensils.map(ustensile => ({
            text: formatted(ustensile),
            id: obj1.id,
          })),
      }
      // ingredients et ustensiles étant des arrays, on "aplatit" les arrays (résultats du reduce) qui les contiennent avec flat()

      // console.log([...arr, choice[category]?.()])
      return [...arr, choice[category]?.()].flat()
    }, [])
  })

  return {
    names: listing[0],
    descriptions: listing[1],
    ingredients: listing[2],
    appareils: listing[3],
    ustensiles: listing[4],
  }
}

/* ---------------------------------------------------------------------- */
/* ---------------------------------------------------------------------- */
/* ---------------------------------------------------------------------- */

const defaultCompare = (a, b) => a.localeCompare(b)

//On trie alphabétiquement le tableau d'objets issu de la fonction list
const quickSort = (unsortedArray, compareByAlphabet = defaultCompare) => {
  // console.log(unsortedArray)
  // On crée une copie du tableau reçu
  const sortedArray = [...unsortedArray]

  // On vérifie si il s'agit du tableau de recettes initial ou d'un tableau d'éléments de recettes
  const initialArray = typeof sortedArray[0] === 'object'

  // On trie récursivement les sous-tableaux
  const recursiveSort = (left, right) => {
    // console.log(left, right);
    // Si ce sous-tableau est vide, il est trié
    if (right - left < 1) return

    const pivotValue = sortedArray[right]

    let splitIndex = left

    for (let i = left; i < right; i++) {
      // console.log(sortedArray[i].text, pivotValue.text);
      const sort = initialArray
        ? compareByAlphabet(sortedArray[i].text, pivotValue.text)
        : compareByAlphabet(sortedArray[i], pivotValue)
      // l'élément est inférieur au pivot
      if (sort === -1) {
        // Si l'élément juste à droite du split index n'est pas celui-ci, on les échange
        if (splitIndex !== i) {
          const temp = sortedArray[splitIndex]
          sortedArray[splitIndex] = sortedArray[i]
          sortedArray[i] = temp
        }
        // On déplace le split index d'un rang vers la droite
        // augmentant la taille du sous-tableau d'éléments inférieurs d'un rang
        splitIndex++
      }
      // On laisse les éléments égaux ou plus grands que le pivot à leur place
    }
    // On déplace le pivot à l'endroit de la séparation entre les sous-tableaux
    sortedArray[right] = sortedArray[splitIndex]
    sortedArray[splitIndex] = pivotValue
    // On trie récursivement les deux sous-tableaux
    recursiveSort(left, splitIndex - 1)
    recursiveSort(splitIndex + 1, right)
  }
  // On trie le tableau complet
  recursiveSort(0, unsortedArray.length - 1)
  return sortedArray
}

/* ---------------------------------------------------------------------- */

const listAll = list(
  recipes,
  'name',
  'description',
  'ingredients',
  'appareils',
  'ustensiles'
)

// export const initiateSortedList = () => quickSort(listAll.init)
const initiateNamesList = () => quickSort(listAll.names)
const initiateIngredientsList = () => quickSort(listAll.ingredients)
const initiateDescriptionsList = () => quickSort(listAll.descriptions)
const initiateUstensilesList = () => quickSort(listAll.ustensiles)
const initiateAppareilsList = () => quickSort(listAll.appareils)
const initiateSearchList = () =>
  quickSort([
    ...listAll.names,
    ...listAll.ingredients,
    ...listAll.descriptions,
    ...listAll.ustensiles,
    ...listAll.appareils,
  ])

// On regroupe les ids correspondant au même text => [{text: 'ail, ids=[30, 26, 29]}]
function groupBy(array, property) {
  return array.reduce((acc, current) => {
    const object_property = current[property]

    let foundElement = acc.find(x => x.text === object_property)

    if (foundElement) {
      foundElement.ids = [...foundElement.ids, current.id]
    } else {
      foundElement = {
        text: object_property,
        ids: [current.id],
      }
    }
    let result = [...acc, foundElement]

    return [...new Set(result)]
  }, [])
}

export const namesList = groupBy(initiateNamesList(), 'text')
export const ingredientsList = groupBy(initiateIngredientsList(), 'text')
export const descriptionsList = groupBy(initiateDescriptionsList(), 'text')
export const ustensilesList = groupBy(initiateUstensilesList(), 'text')
export const appareilsList = groupBy(initiateAppareilsList(), 'text')
export const searchList = groupBy(initiateSearchList(), 'text')
// console.log(initiateSearchList())
console.log(searchList)

