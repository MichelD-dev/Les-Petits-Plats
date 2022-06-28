import { addClass, getElement, removeClass } from '../factory/helpers.js'
import { pipe } from '../utils/utils.js'

const snackbarTimeOut = () => setTimeout(removeSnackBar, 3000)

const stopSnackbarTimeOut = () => clearTimeout(snackbarTimeOut)

const printSnackbar = selection => {
  pipe(
    removeClass('hidden')(getElement('#snackbar')),
    addClass('snackbar')(getElement('#snackbar')),
    append(
      text(
        `Votre recherche a retourné ${selection.length} recette${
          selection.length === 1 ? '' : 's'
        }`
      )
    )
  )(selection)

  snackbarTimeOut()

  return selection
}

const removeSnackBar = () => {
  //FIXME usage?
  addClass('hidden')(getElement('#snackbar'))
  removeClass('snackbar')(getElement('#snackbar'))
}

export { printSnackbar, stopSnackbarTimeOut }
