import * as M from './helpers.js'
import { selectTag } from '../components/tagsList.js'
import { on } from '../helpers.js'
import { app } from '../index.js'
import {
  capitalize,
  getSelector,
  pipe,
  printErrorMessage,
} from '../utils/utils.js'
import { tagsView } from '../views/tagsView.js'

export const tagsFactory = tagsList => selector => {
  const selectedTags = M.map(tag => tag.textContent.toLowerCase())([
    ...M.getElements('.tag'),
  ])

  const newTagsList = tagsList.filter(tag => !selectedTags.includes(tag))

  const createTag = tag => {
    const tagElement = pipe(
      M.addClasses(`custom-option`, `custom-option_${selector}`),
      M.append(M.text(capitalize(tag)))
    )(M.element('li'))

    // Selection d'un tag
    const tagSelect = on('pointerdown')(tagElement)
    tagSelect(() => {
      // On évite de selectionner deux fois le même tag
      const selectedTag = tagElement =>
        tagElement.children[0].textContent === tag

      const isAlreadySelected = M.find(selectedTag)(M.getElements('.tag'))

      if (isAlreadySelected)
        return printErrorMessage(
          'Vous avez déjà selectionné ce tag.',
          'error-tag'
        )
      printErrorMessage('', 'error-tag')

      // On crée le tag selectionné
      selectTag(selector, tag)

      // On efface le contenu de l'input tag
      M.getElement(`.select__input_${getSelector(selector)}`).value = ''
    })

    // Actualisation des listes de recettes et de tags d'après les tags selectionnés
    app(tagSelect)

    return tagElement
  }

  // Création des tags
  const tags = M.map(createTag)(newTagsList)

  // Affichage des tags
  tagsView(tags)(selector)
}
