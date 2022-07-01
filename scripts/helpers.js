import { stopSnackbarTimeOut } from './components/snackbar.js'
import { addClass } from './factory/helpers.js'
import { removeClass } from './factory/helpers.js'
import { append } from './factory/helpers.js'
import { text } from './factory/helpers.js'
import { getElement } from './factory/helpers.js'
import { clearCardsSection, pipe, printErrorMessage } from './utils/utils.js'

// Affichage de la snackbar
const printSnackbar = selection => {
  pipe(
    removeClass('hidden'),
    addClass('snackbar'),
    append(
      text(
        `Votre recherche a retourné ${selection.length} recette${
          selection.length === 1 ? '' : 's'
        }`
      )
    )
  )(getElement('#snackbar'))

  // fadeOut snackbar et arrêt de son timeOut après 3 secondes
  stopSnackbarTimeOut()

  return selection
}

const formatted = str => {
  return (
    str
      .toLowerCase()
      // On enlève les accents et les caractères spéciaux
      .normalize('NFD')
      .replace(/([\u0300-\u036f]|[^0-9a-zA-Z'\s])/g, '')
      // On reduit les espaces de plus d'un caractère
      .replace(/\s+/g, ' ')
      .trim()
  )
}

// Fonction de suppression du message d'erreur
const deleteErrorMessage = selection => {
  // FIXME
  printErrorMessage
  return selection
}

// Fonction de reset de la page
const clearPage = pipe(clearCardsSection, deleteErrorMessage)

// Simplification de l'eventListener
const on = evt => element => fn => {
  // console.log(element);
  element.addEventListener(evt, fn)
  // On retourne une fonction permettant de retirer l'eventListener après l'avoir utilisé, pour ne pas les cumuler
  return () => element.removeEventListener(evt, fn)
}
export { printSnackbar, formatted, clearPage, on }

// ----------------------------------------------------------------------------- //
// --------------------------------- FILTERS ----------------------------------- //
// ----------------------------------------------------------------------------- //

// A partir de la recherche utilisateur, on récupère les mots clés ou expressions correspondants dans la liste créée à l'initialisation
export const searchByKeyword = list => searchInput => {
  let recipesIds = []
  if (searchInput) {
    list
      .filter(item => item.text.includes(formatted(searchInput)))
      // puis on stocke les ids de recettes correspondants
      .forEach(
        foundItem =>
          (recipesIds = [...new Set([...recipesIds, foundItem.ids].flat())])
      )

    return recipesIds
  }
}
let foundItemIds = []
let recipesIds2 = []
// On filtre en fonction des tags selectionnés
export const filteredByTagsSelect = list => {
  return selectedTags => {
    if (selectedTags.length) {
      selectedTags.forEach(tag => {
        list
          .filter(item => item.text.includes(formatted(tag)))
          .forEach(foundItem => {
            foundItemIds = [...new Set([...foundItemIds, ...foundItem.ids])]
            console.log(foundItemIds)

            if (recipesIds2.length === 0) {
              recipesIds2 = foundItemIds
              // console.log(recipesIds2)
              return recipesIds2
            }

            // return recipesIds2
          })

        console.log(recipesIds2)
        console.log(foundItemIds)
        const arraysMerge = recipesIds2.filter(
          obj => foundItemIds.indexOf(obj) !== -1
        )
        console.log(arraysMerge)
        recipesIds2 = arraysMerge.length !== 0 ? arraysMerge : recipesIds2
        // console.log(recipesIds2)
      })
      return recipesIds2
    }
  }
}
