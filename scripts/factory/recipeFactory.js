const recipeFactory = recipe => {
  function getRecipeCardDOM() {
    /**
     * Création des éléments médias du DOM
     */
    const article = document.createElement('article')
    article.classList.add('recipe-card')

    const image = document.createElement('div')
    image.classList.add('recipe-card__image')

    const text = document.createElement('div')
    text.classList.add('recipe-card__recipe')

    const textLeft = document.createElement('div')
    textLeft.classList.add('recipe-card__recipe-left')

    const name = document.createElement('h2')
    name.classList.add('recipe-card__recipe-left__title')
    name.textContent = recipe.name

    const ingredients = document.createElement('ul')
    recipe.ingredients.forEach(item => {
      const ingredient = document.createElement('li')
      const ingredientName = document.createElement('span')
      
      ingredientName.textContent = `${item.ingredient}`
      ingredient.textContent = `${item.quantity || item.quantite ? ':' : ''}  ${
        item.quantity || item.quantite || ''
      } ${item.unit ?? ''}`

      ingredient.insertAdjacentElement('afterbegin', ingredientName)
      ingredients.appendChild(ingredient)
    })

    const textRight = document.createElement('div')
    textRight.classList.add('recipe-card__recipe-right')

    const cookingTime = document.createElement('h2')
    cookingTime.classList.add('recipe-card__recipe-right__duration')
    cookingTime.textContent = `${recipe.time} min`

    const description = document.createElement('p')
    description.classList.add('recipe-card__recipe-right__description')
    description.textContent = recipe.description

    article.appendChild(image)
    article.appendChild(text)

    text.appendChild(textLeft)
    text.appendChild(textRight)

    textLeft.appendChild(name)
    textLeft.appendChild(ingredients)

    textRight.appendChild(cookingTime)
    textRight.appendChild(description)

    // cookingTime.insertAdjacentElement(
    //   'afterbegin',
    //  `<i class="fa-regular fa-clock"></i>`
    // )

    return article
  }
  return { getRecipeCardDOM }
}

export default recipeFactory
