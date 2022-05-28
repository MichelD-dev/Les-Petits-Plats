import recipes from '../data/recipes.js'
let search = document.querySelector('.search__form_searchbar')

// addReactionTo('change').on(search).withFunction(() => console.log(search.value))

search.addEventListener('keydown', (e) => console.log(e.key))