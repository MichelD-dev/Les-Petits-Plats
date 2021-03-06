import { recipes } from '../data/recipes.js'

const list = (recipes, ...categories) => {
  let listing = categories.map(category => {
    return recipes.reduce((arr, obj1) => {
      const formatted = str =>
        str
          .toLowerCase()
          .replace(/[.,/#!$%^&*;:{}=-_`~]/g, '')
          .replace(/\s+/g, ' ')
          .replace(/^\w/, c => c.toUpperCase())
          .trim()

      const choice = {
        name: formatted(obj1.name),
        description: formatted(obj1.description),
        ingredients: obj1.ingredients.map(ingredient =>
          formatted(ingredient.ingredient)
        ),
        appareils: formatted(obj1.appliance),
        ustensiles: obj1.ustensils.map(ustensile => formatted(ustensile)),
      }

      return [...arr, choice[category]]
    }, [])
  })

  return {
    names: listing[0],
    descriptions: listing[1],
    ingredients: [...new Set(listing[2].flat())],
    appareils: [...new Set(listing[3])],
    ustensiles: [...new Set(listing[4].flat())],
    init: recipes.reduce((arr, obj1) => {
      const splitted = str =>
        str
          .toLowerCase()
          .replace(/[.,/#!$%^&*;:{}=-_`~()]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .split(' ')
          .map(element => {
            if (!element) return
            return { text: element, id: obj1.id }
          })

      return [
        ...arr,
        splitted(obj1.name),
        splitted(obj1.description),

        obj1.ingredients
          .reduce((arr, obj2) => {
            return [...arr, splitted(obj2.ingredient)]
          }, [])
          .map(element => element),
      ].flat(2)
    }, []),
  }
}

/* ---------------------------------------------------------------------- */
/* ---------------------------------------------------------------------- */
/* ---------------------------------------------------------------------- */

const defaultCompare = (a, b) => a.localeCompare(b)

const quickSort = (unsortedArray, compare = defaultCompare) => {
  // On cr??e une copie du tableau re??u
  const sortedArray = [...unsortedArray]

  // On v??rifie si il s'agit du tri initial ou d'un tri d'??l??ments de recettes
  const initialArray = typeof sortedArray[0] === 'object'

  // On trie r??cursivement les sous-tableaux
  const recursiveSort = (left, right) => {
    // Si ce sous-tableau est vide, il est tri??
    if (right - left < 1) return

    const pivotValue = sortedArray[right]

    let splitIndex = left

    for (let i = left; i < right; i++) {
      const sort = initialArray
        ? compare(sortedArray[i].text, pivotValue.text)
        : compare(sortedArray[i], pivotValue)
      // l'??l??ment est inf??rieur au pivot
      if (sort === -1) {
        // Si l'??l??ment juste ?? droite du split index n'est pas celui-ci, on les ??change
        if (splitIndex !== i) {
          const temp = sortedArray[splitIndex]
          sortedArray[splitIndex] = sortedArray[i]
          sortedArray[i] = temp
        }
        // On d??place le split index d'un rang vers la droite
        // augmentant la taille du sous-tableau d'??l??ments inf??rieurs d'un rang
        splitIndex++
      }
      // On laisse les ??l??ments ??gaux ou plus grands que le pivot ?? leur place
    }
    // On d??place le pivot ?? l'endroit de la s??paration entre les sous-tableaux
    sortedArray[right] = sortedArray[splitIndex]
    sortedArray[splitIndex] = pivotValue
    // On trie r??cursivement les deux sous-tableaux
    recursiveSort(left, splitIndex - 1)
    recursiveSort(splitIndex + 1, right)
  }
  // On trie le tableau complet
  recursiveSort(0, unsortedArray.length - 1)
  return sortedArray
}

/* ---------------------------------------------------------------------- */

export const listAll = list(
  recipes,
  'name',
  'description',
  'ingredients',
  'appareils',
  'ustensiles'
)

export const initiateSortedList = () => quickSort(listAll.init)
export const initiateIngredientsTagsList = () => quickSort(listAll.ingredients)
// export const initiateIngredientsTagsList = () => {}


