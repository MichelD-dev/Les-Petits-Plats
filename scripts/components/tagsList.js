import * as M from '../factory/helpers.js'
import { recipes } from '../data/recipes.js'
import { appareilsList, ingredientsList, ustensilesList } from '../init.js'
import { deepFreeze, formatted, lowerCased, on } from '../helpers.js'
import { capitalize, flip, getSelector, pipe } from '../utils/utils.js'
import { app } from '../index.js'

const recipesList = deepFreeze(recipes)

export const getTags = (recipesSelection = recipesList) => {
  const compareByAlphabet = (a, b) => a.localeCompare(b)

  // Les tags sont filtrés en fonction de la selection de recettes reçue en argument
  const setIngredientsTags = (
    recipesSelection,
    ingredientsTags = [],
    ...allTags
  ) => {
    M.forEach(recipe => {
      M.forEach(ingr => {
        if (
          ingredientsList.includes(formatted(ingr.ingredient)) &&
          !ingredientsTags.includes(capitalize(lowerCased(ingr.ingredient)))
        ) {
          ingredientsTags.push(capitalize(lowerCased(ingr.ingredient)))
        }
        ingredientsTags.sort(compareByAlphabet)
        // Liste de tags originelle
        if (ingredientsTags.length === 0) return ingredientsList
      })(recipe.ingredients)
    })(recipesSelection)
    return { recipesSelection, ...allTags, ingredientsTags }
  }

  const setUstensilesTags = ({
    recipesSelection,
    ustensilesTags = [],
    ...allTags
  }) => {
    M.forEach(recipe => {
      M.forEach(ustensile => {
        if (
          ustensilesList.includes(formatted(ustensile)) &&
          !ustensilesTags.includes(capitalize(lowerCased(ustensile)))
        ) {
          ustensilesTags.push(capitalize(lowerCased(ustensile)))
        }
        ustensilesTags.sort(compareByAlphabet)
        // Liste de tags originelle
        if (ustensilesTags.length === 0) return ustensilesList
      })(recipe.ustensils)
    })(recipesSelection)
    return { recipesSelection, ...allTags, ustensilesTags }
  }

  const setAppareilssTags = ({
    recipesSelection,
    appareilsTags = [],
    ...allTags
  }) => {
    M.forEach(recipe => {
      if (
        appareilsList.includes(formatted(recipe.appliance)) &&
        !appareilsTags.includes(capitalize(lowerCased(recipe.appliance)))
      ) {
        appareilsTags.push(capitalize(lowerCased(recipe.appliance)))
      }
      appareilsTags.sort(compareByAlphabet)
      // Liste de tags originelle
      if (appareilsTags.length === 0) return appareilsList
    })(recipesSelection)
    return { ...allTags, appareilsTags }
  }

  return pipe(
    setIngredientsTags,
    setUstensilesTags,
    setAppareilssTags
  )(recipesSelection)
}

// ------------------------------------------------------

export const selectTag = (category, selectedTag) => {
  // Création du tag
  const tagText = pipe(
    capitalize,
    M.text,
    flip(M.append)(M.element('span'))
  )(selectedTag)

  const tagClose = M.addClasses('tag__close')(M.element('span'))
  tagClose.innerHTML = `<i class="fa-regular fa-circle-xmark fa-xl tag__close"></i>`

  pipe(
    M.addClasses('tag', `tag_${category}`),
    M.addAttributes({ 'data-selector': category }),
    M.append(tagText),
    M.append(tagClose),
    flip(M.append)(M.getElement('.tags'))
  )(M.element('div'))

  // // Suppression du tag
  const removeTag = on('pointerdown')(tagClose)
  removeTag(() => {
    tagClose.parentElement.remove()

    // On ferme le selecteur adéquat
    const selector = M.getElement(`#select_${getSelector(category)}`)
    M.removeClasses('open')(selector)
  })

  // // On rafraîchit la liste de cartes recettes à la suppression d'un tag
  app(removeTag)

  return selectedTag
}
