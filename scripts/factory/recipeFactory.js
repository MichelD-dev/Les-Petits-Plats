import * as M from './helpers.js'
import {pipe} from '../utils/utils.js'

const recipeCardFactory = recipe => {
  /**
   * Création des éléments médias du DOM
   */
  const image = M.addClasses('recipe-card__image')(M.element('div'))

  const name = pipe(
    M.addClasses('recipe-card__left__title'),
    M.append(M.text(recipe.name)),
  )(M.element('h2'))

  const ingredients = M.addClasses('recipe-card__left__ingredients')(
    M.element('ul'),
  )

  M.forEach(item => {
    const quantity = `${item.quantity || item.quantite ? ':' : ''}  ${
      item.quantity || item.quantite || ''
    } ${item.unit || item.unite || ''}`

    const ingredient = M.append(M.text(quantity))(M.element('li'))

    const ingredientName = M.append(M.text(`${item.ingredient}`))(
      M.element('span'),
    )

    ingredient.insertAdjacentElement('afterbegin', ingredientName)
    M.append(ingredient)(ingredients)
  })(recipe.ingredients)

  const cookingTime = pipe(
    M.addClasses('recipe-card__right__duration'),
    M.append(M.text(`${recipe.time} min`)),
    M.insert(`<i class="fa-regular fa-clock"></i> `)('afterbegin'),
  )(M.element('h2'))

  const description = pipe(
    M.addClasses('recipe-card__right__description'),
    M.append(M.text(recipe.description)),
  )(M.element('p'))

  const textLeft = pipe(
    M.addClasses('recipe-card__left'),
    M.appendChildren([name, ingredients]),
  )(M.element('div'))

  const textRight = pipe(
    M.addClasses('recipe-card__right'),
    M.appendChildren([cookingTime, description]),
  )(M.element('div'))

  const texts = pipe(
    M.addClasses('recipe-card__recipe'),
    M.appendChildren([textLeft, textRight]),
  )(M.element('div'))

  const article = pipe(
    M.addClasses('recipe-card'),
    M.appendChildren([image, texts]),
  )(M.element('article'))

  return article
}

export default recipeCardFactory
