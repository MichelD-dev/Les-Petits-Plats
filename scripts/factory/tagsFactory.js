import { selectTag } from '../components/tagsList.js'
import { on } from '../helpers.js'
import { app } from '../index.js'
import { capitalize, pipe } from '../utils/utils.js'
import { tagsView } from '../views/tagsView.js'
import { addAttributes, addClass, append, element, text } from './helpers.js'

export const tagsFactory = tagsList => selector => {
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
    })

    // Actualisation de la liste de recettes d'après les tags selectionnés
    app(tagSelect)

    // ------------------------------------------------------------------------- //

    return tagElement
  }

  // Création des tags
  const tags = tagsList.map(createTag)

  // Affichage des tags
  tagsView(tags)(selector)
}
