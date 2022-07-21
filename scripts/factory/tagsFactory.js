import { selectTag } from '../components/tagsList.js'
import { on } from '../helpers.js'
import { app } from '../index.js'
import { capitalize, getSelector, pipe } from '../utils/utils.js'
import { tagsView } from '../views/tagsView.js'
import {
  addAttributes,
  addClass,
  append,
  element,
  getElement,
  getElements,
  map,
  text,
  trace,
} from './helpers.js'

export const tagsFactory = tagsList => selector => {
  const selectedTags = [...getElements('.tag')].map(tag =>
    tag.textContent.toLowerCase()
  )

  let newTagsList = tagsList.filter(tag => !selectedTags.includes(tag))

  if (newTagsList.length === 0) {
    getElement(`.tags__error_${selector}`).textContent =
      "Il n'y a pas de tag associé à votre recherche"}

  const createTag = tag => {
    const tagElement = pipe(
      addClass(`custom-option`, `custom-option_${selector}`),
      addAttributes({
        tabIndex: 0,
        'data-value': `${selector}`,
      }),
      append(text(capitalize(tag)))
    )(element('li'))

    // -------------------------- Selection de tags ---------------------------- //

    // Selection d'un tag
    const tagSelect = on('pointerdown')(tagElement)

    tagSelect(() => {
      selectTag(selector, tag)
      getElement(`.select__input_${getSelector(selector)}`).value = ''
    })

    // Actualisation des listes de recettes et de tags d'après les tags selectionnés
    app(tagSelect)

    // ------------------------------------------------------------------------- //

    return tagElement
  }

  // Création des tags
  const createTags = map(createTag)
  const tags = createTags(newTagsList)

  // Affichage des tags
  tagsView(tags)(selector)
}
