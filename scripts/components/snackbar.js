import DOM from '../utils/domElements.js'

const snackbarTimeOut = () => {
  setTimeout(() => {
    removeSnackBar()
  }, 3000)
}

const stopSnackbarTimeOut = () => {
  clearTimeout(snackbarTimeOut)
}

const printSnackbar = sortedSelections => {
  DOM.snackbar.classList.remove('hidden')
  DOM.snackbar.classList.add('snackbar')
  DOM.snackbar.textContent = `Votre recherche a retourné ${sortedSelections.length} recettes`
  snackbarTimeOut()
}

const removeSnackBar = () => {
  DOM.snackbar.classList.add('hidden')
  DOM.snackbar.classList.remove('snackbar')
}

export { printSnackbar, stopSnackbarTimeOut }
