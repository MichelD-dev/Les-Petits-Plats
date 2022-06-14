import DOM from '../utils/domElements.js'

const snackbarTimeOut = () => setTimeout(removeSnackBar, 3000)

const stopSnackbarTimeOut = () => clearTimeout(snackbarTimeOut)

const printSnackbar = ({selection, recipesQuantity}) => {
  DOM.snackbar.classList.remove('hidden')
  DOM.snackbar.classList.add('snackbar')
  DOM.snackbar.textContent = `Votre recherche a retourné ${recipesQuantity} recette${
    recipesQuantity === 1 ? '' : 's'
  }`

  snackbarTimeOut()

  return selection
}

const removeSnackBar = () => {//FIXME usage?
  DOM.snackbar.classList.add('hidden')
  DOM.snackbar.classList.remove('snackbar')
}

export { printSnackbar, stopSnackbarTimeOut }
