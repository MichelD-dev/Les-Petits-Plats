import { pipe } from '../utils/utils.js'
import {
  addClass,
  append,
  appendChildren,
  element,
  insert,
  tap,
  text,
} from './helpers.js'

const recipeCardFactory = recipe => {
  /**
   * Création des éléments médias du DOM
   */
  const image = addClass('recipe-card__image')(element('div'))

  const name = pipe(
    addClass('recipe-card__left__title'),
    append(text(recipe.name))
  )(element('h2'))

  const ingredients = addClass('recipe-card__left__title')(element('h2'))

  recipe.ingredients.forEach(item => {
    const quantity = `${item.quantity || item.quantite ? ':' : ''}  ${
      item.quantity || item.quantite || ''
    } ${item.unit || item.unite || ''}`

    const ingredient = append(text(quantity))(element('li'))

    const ingredientName = append(text(`${item.ingredient}`))(element('span'))

    ingredient.insertAdjacentElement('afterbegin', ingredientName)
    append(ingredient)(ingredients)
  })
  
 

  const cookingTime = pipe(
    addClass('recipe-card__right__duration'),
    // tap(console.log), //FIXME
    append(text(`${recipe.time} min`)),
    insert(`<i class="fa-regular fa-clock"></i> `)('afterbegin')
  )(element('h2'))

  const description = pipe(
    addClass('recipe-card__right__description'),
    append(text(recipe.description))
  )(element('p'))

  const textLeft = pipe(
    addClass('recipe-card__left'),
    appendChildren([name, ingredients])
  )(element('div'))

  const textRight = pipe(
    addClass('recipe-card__right'),
    appendChildren([cookingTime, description])
  )(element('div'))

  const texts = pipe(
    addClass('recipe-card__recipe'),
    appendChildren([textLeft, textRight])
  )(element('div'))

  const article = pipe(
    addClass('recipe-card'),
    appendChildren([image, texts])
  )(element('article'))

  return article
}

export default recipeCardFactory
