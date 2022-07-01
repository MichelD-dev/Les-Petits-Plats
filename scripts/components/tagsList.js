import { getRecipesFromSearch } from './searchBar.js'
import {
  appareilsList,
  ingredientsList,
  ustensilesList,
} from '../algorithms/quickSort.js'
import { on } from '../helpers.js'
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

export const getTags = (searchInput = '') => {
  const { recipesSelection } = getRecipesFromSearch(searchInput)
  const searchedRecipesIds = recipesSelection.map(recipe => recipe.id)

  const categories = {
    ingredients: ingredientsList,
    appareils: appareilsList,
    ustensiles: ustensilesList,
  }

  let allTags = []

  for (const category in categories) {
    let tags = []
    let tagsIdsList = []
    for (const value of categories[category]) {
      // Les tags sont filtrés en fonction du terme entré par l'utilisateur dans le selecteur de recherche
      if (searchInput) {
        tagsIdsList = [
          ...new Set([
            ...tagsIdsList,
            ...value.ids.filter(id => searchedRecipesIds.indexOf(id) !== -1),
          ]),
        ]
        tagsIdsList.forEach(id =>
          categories[category].forEach(tag => {
            if (tag.ids.includes(id) && !tags.includes(tag.text)) {
              tags.push(tag.text)
            }
          })
        )
        tags.sort((a, b) => a.localeCompare(b))
      } else {
        // Liste de tags originelle
        tags = [...tags, value.text]
      }
    }
    // Listes de tags originelles
    allTags = [...allTags, tags]
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
