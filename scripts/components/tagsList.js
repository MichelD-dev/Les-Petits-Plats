import { recipes } from '../data/recipes.js'
import { getRecipesFromSearch } from './searchBar.js'
import {
  appareilsList,
  ingredientsList,
  ustensilesList,
} from '../algorithms/quickSort.js'
import { deepFreeze, on } from '../helpers.js'
import {
  addClass,
  append,
  element,
  getElement,
  getElements,
  tap,
  text,
} from '../factory/helpers.js'
import { capitalize, flip, pipe } from '../utils/utils.js'
import { app } from '../index.js'

export const getTags = (
  searchInput = null,
  recipesSelection = deepFreeze(recipes)
) => {
  // const recipesSelection =
  // searchInput
  //   ? getRecipesFromSearch(searchInput)
  //   :
  //   recipes
  // console.log(recipesSelection)
  // const searchedRecipesIds = recipesSelection.map(recipe => recipe.id)
  // console.log(appareilsList)

  // console.log(ingredientsList)
  const categories = {
    ingredients: ingredientsList,
    appareils: appareilsList,
    ustensiles: ustensilesList,
  }

  let ingredientsTags = []
  let ustensilesTags = []
  let appareilsTags = []
  let allTags = []

  for (const category in categories) {
    let tagsIdsList = []
    let result = []
    const cat =
      category === 'appareils'
        ? 'appliance'
        : category === 'ustensiles'
        ? 'ustensils'
        : 'ingredients'
    categories[category].forEach(tag => {
      // Les tags sont filtrés en fonction du terme entré par l'utilisateur dans le selecteur de recherche
          {
        if (searchInput) {
          recipesSelection.forEach(recipe => {
            recipe.ingredients.forEach(ingr => {
              if (result.includes(ingr.ingredient.toLowerCase())) return
              result.push(ingr.ingredient.toLowerCase())
              console.log(ingredientsTags)
              ingredientsTags = result.sort((a, b) => a.localeCompare(b))
            })
          })
        } else {
          // Liste de tags originelle
          categories[category] = [...categories[category], tag]
        }
      }
    })
    // Listes de tags originelles
    allTags = [...allTags, categories[category]]
  }

  return allTags
}

// ------------------------------------------------------

export const selectTag = (category, selectedTag) => {
  const isAlreadySelected = tag =>
    tag.children[0].textContent.toLowerCase() === selectedTag

  // On évite de selectionner deux fois le même tag
  if (getElements('.tag').find(isAlreadySelected)) return

  // Création du tag
  const tagText = pipe(
    capitalize,
    text,
    flip(append)(element('span'))
  )(selectedTag)

  const tagClose = addClass('tag__close')(element('span'))
  tagClose.innerHTML = `<i class="fa-regular fa-circle-xmark fa-xl tag__close"></i>`

  pipe(
    addClass('tag', `tag_${category}`),
    // tap(console.log), //FIXME
    append(tagText),
    append(tagClose),
    flip(append)(getElement('.tags'))
  )(element('div'))

  // Suppression du tag
  const removeTag = on('pointerdown')(tagClose)
  removeTag(() => tagClose.parentElement.remove())

  // On rafraîchit la liste de cartes recettes à la suppression d'un tag
  app(removeTag) //FIXME

  return selectedTag
}
