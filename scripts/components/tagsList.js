import DOM from '../utils/domElements.js'
import { addReactionTo } from '../utils/eventListener.js'
import {
  capitalize,
  setAttributesFor,
  tagsSectionReset,
} from '../utils/utils.js'

export const getTags = (itemsList, selector, selectorList = []) => {
  if (!selectorList.length === 0) {
    printTags(selectorList, selector)
    return selectorList
  }

  itemsList.forEach(_ => {
    if (typeof _[selector] === 'string') {
      return selectorList.push(_[selector].toLowerCase())
    }

    if (Array.isArray(_[selector])) {
      _[selector].forEach(_ => {
        if (typeof _ === 'object') {
          return selectorList.push(_[selector.slice(0, -1)].toLowerCase())
        }

        selectorList.push(_.toLowerCase())
      })
    }
  })

  printTags(selectorList, selector)

  addReactionTo('input')
    .on(DOM.selectorInput)
    .withFunction(e => filterTags(e, itemsList, selector))

  return selectorList
}

const filterTags = (e, itemsList, selector) => {
  const filteredTags = getTags(itemsList, selector).filter(tag => {
    if (tag.indexOf(e.target.value) !== -1) return tag
  })

  tagsSectionReset(selector)

  printTags(filteredTags, selector)
}

const printTags = (selectorList, selector) => {
  const tagsList = [...new Set(selectorList)].sort((a, b) => a.localeCompare(b))

  tagsSectionReset(selector)

  tagsList.forEach(tag => {
    const item = document.createElement('li')
    item.classList.add(`custom-option`, `custom-option_${selector}`)
    setAttributesFor(item)({
      tabIndex: 0,
      'data-value': `${selector}`,
    })

    item.textContent = capitalize(tag)

    const choice = {
      ingredients: () => DOM.ingredients.appendChild(item),
      appliance: () => DOM.appareils.appendChild(item),
      ustensils: () => DOM.ustensiles.appendChild(item),
    }
    choice[selector]?.() ?? 'Selecteur non reconnu'
  })
}
