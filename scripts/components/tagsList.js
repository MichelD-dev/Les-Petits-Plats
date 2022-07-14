import { recipes } from '../data/recipes.js'
import {
  appareilsList,
  ingredientsList,
  ustensilesList,
} from '../algorithms/quickSort.js'
import { deepFreeze, formatted, on } from '../helpers.js'
import {
  addClass,
  append,
  element,
  getElement,
  getElements,
  removeClass,
  text,
} from '../factory/helpers.js'
import { capitalize, flip, getSelector, pipe } from '../utils/utils.js'
import { app } from '../index.js'

export const getTags = (
  searchInput = null,
  recipesSelection = deepFreeze(recipes)
) => {
  let ingredientsTags = []
  let ustensilesTags = []
  let appareilsTags = []
  let allTags = []

  // Les tags sont filtrés en fonction du terme entré par l'utilisateur dans le selecteur de recherche
  {
    if (searchInput) {
      recipesSelection.forEach(recipe => {
        recipe.ingredients.forEach(ingr => {
          if (
            ingredientsList.includes(ingr.ingredient.toLowerCase()) &&
            !ingredientsTags.includes(ingr.ingredient.toLowerCase())
          ) {
            ingredientsTags.push(ingr.ingredient.toLowerCase())
          }
          ingredientsTags.sort((a, b) => a.localeCompare(b))
          // Liste de tags originelle
          if (!ingredientsTags.length) return ingredientsList

          return ingredientsTags
        })

        recipe.ustensils.forEach(ustensile => {
          if (
            ustensilesList.includes(ustensile.toLowerCase()) &&
            !ustensilesTags.includes(ustensile.toLowerCase())
          ) {
            ustensilesTags.push(ustensile.toLowerCase())
          }
          ustensilesTags.sort((a, b) => a.localeCompare(b))
          // Liste de tags originelle
          if (!ustensilesTags.length) return ustensilesList

          return ustensilesTags
        })

        if (
          appareilsList.includes(recipe.appliance.toLowerCase()) &&
          !appareilsTags.includes(recipe.appliance.toLowerCase())
        ) {
          appareilsTags.push(recipe.appliance.toLowerCase())
        }
        appareilsTags.sort((a, b) => a.localeCompare(b))
        // Liste de tags originelle
        if (!appareilsTags.length) return appareilsList

        return appareilsTags
      })
      allTags = [...allTags, ingredientsTags, appareilsTags, ustensilesTags]

      return allTags
    }
    return [ingredientsList, appareilsList, ustensilesList]
  }
}

// ------------------------------------------------------

export const selectTag = (category, selectedTag) => {
  // On évite de selectionner deux fois le même tag
  const isAlreadySelected = tag =>
    tag.children[0].textContent.toLowerCase() === selectedTag

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
    append(tagText),
    append(tagClose),
    flip(append)(getElement('.tags'))
  )(element('div'))

  // // Suppression du tag
  const removeTag = on('pointerdown')(tagClose)
  removeTag(() => {
    tagClose.parentElement.remove()

    // On ferme le selecteur adéquat
    const selector = getElement(`#select_${getSelector(category)}`)
    removeClass('open')(selector)
  })

  // // On rafraîchit la liste de cartes recettes à la suppression d'un tag
  app(removeTag)

  return selectedTag
}
