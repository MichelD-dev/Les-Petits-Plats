import { stopSnackbarTimeOut } from './components/snackbar.js'
import { addClass, trace } from './factory/helpers.js'
import { removeClass } from './factory/helpers.js'
import { append } from './factory/helpers.js'
import { text } from './factory/helpers.js'
import { getElement } from './factory/helpers.js'
import { clearCardsSection, pipe, printErrorMessage } from './utils/utils.js'

// Fonction permettant de rendre immutable un objet ET AUSSI les objets/arrays qu'il contient
export const deepFreeze = obj => {
  // Retrieve the property names defined on obj
  var propNames = Object.getOwnPropertyNames(obj)

  // Freeze properties before freezing self
  propNames.forEach(name => {
    const prop = obj[name]
    // Freeze prop if it is an object
    if (typeof prop == 'object' && prop !== null) deepFreeze(prop)
  })

  // Freeze self (no-op if already frozen)
  return Object.freeze(obj)
}

// Affichage de la snackbar
const printSnackbar = selection => {
  if (!selection) return []

  const createSnackBar = pipe(
    removeClass('hidden'),
    addClass('snackbar'),
    append(
      text(
        `Votre recherche a retourné ${selection.length} recette${
          selection.length === 1 ? '' : 's'
        }`
      )
    )
  )

  createSnackBar(getElement('#snackbar'))

  // fadeOut snackbar et arrêt de son timeOut après 3 secondes
  stopSnackbarTimeOut()

  return selection
}

export const clearErrorMessage = selection => {
  printErrorMessage(
    selection?.length === 0
      ? 'Aucune recette ne correspond à votre critère...Vous pouvez chercher "tarte aux pommes", "poisson", etc.'
      : ''
  )
  return selection
}

const formatted = str => {
  return (
    str
      .toLowerCase()
      // On enlève les accents et les caractères spéciaux
      .normalize('NFD')
      .replace(/([\u0300-\u036f]|[^0-9a-zA-Zà'%\s()])/g, '')
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
  element.addEventListener(evt, fn)
  // On retourne une fonction permettant de retirer l'eventListener après l'avoir utilisé, pour ne pas les cumuler
  return () => element.removeEventListener(evt, fn)
}
export { printSnackbar, formatted, clearPage, on }

// ----------------------------------------------------------------------------- //
// --------------------------------- FILTERS ----------------------------------- //
// ----------------------------------------------------------------------------- //

export const searchByKeyword = list => searchInput => {
  let recipesIds = []

  const isPositiveSearch = item => item.text.includes(formatted(searchInput))

  const getRecipesIds = foundItem =>
    (recipesIds = [...new Set([...recipesIds, foundItem.ids].flat())])

  if (searchInput) {
    list
      // A partir de la recherche utilisateur, on récupère les mots clés ou expressions correspondants dans la liste créée à l'initialisation
      .filter(isPositiveSearch)
      // puis on stocke les ids de recettes correspondants
      .forEach(getRecipesIds)

    return recipesIds
  }
}
