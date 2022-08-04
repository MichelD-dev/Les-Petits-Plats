import * as M from './factory/helpers.js'
import { clearCardsSection, pipe, printErrorMessage } from './utils/utils.js'

// Fonction permettant de rendre immutable un objet ET AUSSI les objets/arrays qu'il contient
export const deepFreeze = obj => {
  // Retrieve the property names defined on obj
  var propNames = Object.getOwnPropertyNames(obj)

  // Freeze properties before freezing self
  M.forEach(name => {
    const prop = obj[name]
    // Freeze prop if it is an object
    if (typeof prop === 'object' && prop !== null) deepFreeze(prop)
  })(propNames)

  // Freeze self (no-op if already frozen)
  return Object.freeze(obj)
}

const lowerCased = str => {
  return (
    str
      .toLowerCase()
      // On reduit les espaces de plus d'un caractère
      .replace(/\s+/g, ' ')
      .trim()
  )
}

const normalized = str => {
  return (
    str
      // On enlève les accents et les caractères spéciaux
      .normalize('NFD')
      .replace(/([\u0300-\u036f]|[^0-9a-zA-Zà'%\s])/g, '')
  )
}

const formatted = str => normalized(lowerCased(str))

// Fonction de suppression du message d'erreur
const deleteErrorMessage = selection => {
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

// intersection Observer
const observer = new IntersectionObserver(
  entries =>
    M.forEach((entry, i = 1) => {
      setTimeout(() => {
        entry.target.classList.toggle('fadein', entry.isIntersecting)
      }, 150 * i)
      i++
      if (entry.isIntersecting) observer.unobserve(entry.target)
    })(entries),
  {
    threshold: 0.5,
  }
)

export { lowerCased, normalized, formatted, clearPage, on, observer }
