import * as M from '../factory/helpers.js'

let snackbarTimeOut = setTimeout(() => {
  M.addClasses('fade-out')(M.getElement('#snackbar'))
  M.removeClasses('fade-in')(M.getElement('#snackbar'))
}, 3000)

export const printSnackbar = selection => {
  const snackBar = M.getElement('#snackbar')

  if (!selection) return []

  snackBar.textContent = ''

  M.append(
    M.text(
      `Votre recherche a retourné ${selection.length} recette${
        selection.length === 1 ? '' : 's'
      }`,
    ),
  )(snackBar)

  M.addClasses('fade-in')(snackBar)
  M.removeClasses('fade-out')(snackBar)

  clearTimeout(snackbarTimeOut)

  snackbarTimeOut = setTimeout(() => {
    M.addClasses('fade-out')(snackBar)
    M.removeClasses('fade-in')(snackBar)
  }, 3000)

  return selection
}
