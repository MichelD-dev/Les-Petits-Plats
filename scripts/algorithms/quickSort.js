import { recipes } from '../data/recipes.js'
import { deepFreeze, formatted } from '../helpers.js'

const list = (recipes, ...categories) => {
  const listing = categories.map(category =>
    recipes.reduce((arr, obj1) => {
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
  )

  return {
    //FIXME supprimer les doublons
    names: listing[0],
    descriptions: listing[1],
    ingredients: [...new Set(listing[2].flat())],
    appareils: [...new Set(listing[3])],
    ustensiles: [...new Set(listing[4].flat())],
    init: recipes.reduce((arr, obj1) => {
      const splitted = str =>
        formatted(str) //FIXME parenthèses nécessaires ailleurs
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
          .reduce((arr, obj2) => [...arr, splitted(obj2.ingredient)], [])
          .map(element => element),
      ].flat(2)
    }, []),
  }
}

/* ---------------------------------------------------------------------- */
/* ---------------------------------------------------------------------- */
/* ---------------------------------------------------------------------- */

const defaultCompare = (a, b) => new Intl.Collator('fr').compare(a, b)

const quickSort = (unsortedArray, compare = defaultCompare) => {
  // On crée une copie du tableau reçu
  const sortedArray = [...unsortedArray]

  // On vérifie si il s'agit du tri initial ou d'un tri d'éléments de recettes
  const initialArray = typeof sortedArray[0] === 'object'

  // On trie récursivement les sous-tableaux
  const recursiveSort = (left, right) => {
    // Si ce sous-tableau est vide, il est trié
    if (right - left < 1) return

    const pivotValue = sortedArray[right]

    let splitIndex = left

    for (let i = left; i < right; i++) {
      const sort = initialArray
        ? compare(sortedArray[i].text, pivotValue.text)
        : compare(sortedArray[i], pivotValue)
        
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
export const listAll = list(
  deepFreeze(recipes),
  'name',
  'description',
  'ingredients',
  'appareils',
  'ustensiles'
)

export const searchList = quickSort(listAll.init).filter(
  (obj, index, self) =>
    index ===
    self.findIndex(item => item.text === obj.text && item.id === obj.id)
)
export const ingredientsList = quickSort(listAll.ingredients)
export const appareilsList = quickSort(listAll.appareils)
export const ustensilesList = quickSort(listAll.ustensiles)

console.log(searchList)
