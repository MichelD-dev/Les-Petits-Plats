import { recipes } from '../data/recipes.js'

const list = recipes.reduce((arr, obj1) => {
  const splitted = str =>
    str
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=-_`~()]/g, '') //FIXME problème avec " ( " (700)
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
}, [])

/* ---------------------------------------------------------------------- */
/* ---------------------------------------------------------------------- */
/* ---------------------------------------------------------------------- */

const defaultCompare = (a, b) => a.localeCompare(b) || 0

const quickSort = (unsortedArray, compare = defaultCompare) => {
  // On crée un tableau final d'éléments triés
  const sortedArray = [...unsortedArray]

  // On trie récursivement les sous-tableaux
  const recursiveSort = (left, right) => {
    // Si ce sous-tableau est vide, il est trié
    if (right - left < 1) {
      return
    }

    const pivotValue = sortedArray[right]
    let splitIndex = left

    for (let i = left; i < right; i++) {
      const sort = compare(sortedArray[i].text, pivotValue.text)

      // l'élément est inférieur au pivot
      if (sort === -1) {
        // Si l'élément juste à droite du split index n'est pas celui-ci, on les échange
        if (splitIndex !== i) {
          const temp = sortedArray[splitIndex]
          sortedArray[splitIndex] = sortedArray[i]
          sortedArray[i] = temp
        }

        // On déplace le split index d'un rang vers le droite
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

export const sortList = () => quickSort(list)
// export const sortList = () => console.log(list)
