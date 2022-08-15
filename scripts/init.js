import { recipes } from './data/recipes.js'
import { map } from './factory/helpers.js'
import * as M from './helpers.js'

// Création d'une copie immutable du fichier de recettes initial, avec ajout d'un attribut text à chaque recette concatenant nom, ingredients et description
const initialList = map(recipe => {
  const { name, description, ingredients: ingrs } = recipe

  const ingredients = map(obj => obj.ingredient)(ingrs).join(' ')

  return M.deepFreeze({
    text: `${M.formatted(name)} ${M.formatted(ingredients)} ${M.formatted(description)}`,
    ...recipe,
  })
})(recipes)
console.log(initialList);
// Création des listes de tags correspondants au fichier initial de recettes
const setTagsList =
  recipes =>
  (...categories) => {
    const tagsLists = map(category =>
      recipes.reduce((arr, recipe) => {
        const choice = {
          ingredients: map(ingredient => M.formatted(ingredient.ingredient))(
            recipe.ingredients
          ),
          appareils: M.formatted(recipe.appliance),
          ustensiles: map(ustensile => M.formatted(ustensile))(
            recipe.ustensils
          ),
        }

        return [...arr, choice[category]]
      }, [])
    )(categories)
    return {
      ingredients: [...new Set(tagsLists[0].flat())],
      appareils: [...new Set(tagsLists[1])],
      ustensiles: [...new Set(tagsLists[2].flat())],
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

// Création des listes initiales de tags à partir du fichier de recettes
const { ingredients, appareils, ustensiles } = setTagsList(recipes)(
  'ingredients',
  'appareils',
  'ustensiles'
)

// Tri par ordre alphabétique des listes initiales de tags, gel de celles-ci, et export
const ingredientsList = Object.freeze(quickSort(ingredients))
const appareilsList = Object.freeze(quickSort(appareils))
const ustensilesList = Object.freeze(quickSort(ustensiles))

export { initialList, ingredientsList, appareilsList, ustensilesList }
