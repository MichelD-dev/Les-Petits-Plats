// QuerySelector ONLY

// Syntaxe :  addReactionTo('evt').on(window || 'class/id/attribut...').withFunction(fonction)

const event = actionChoice => evt => {
  const on = elem => {
    const withFunction = (action, ...params) => {
      if (actionChoice === 'add')
        typeof elem === 'string'
          ? document
              .querySelector(elem)
              .addEventListener(evt, action, ...params)
          : elem.addEventListener(evt, action, ...params)

      if (actionChoice === 'remove')
        typeof elem === 'string'
          ? document.querySelector(elem).removeEventListener(evt, action)
          : elem.removeEventListener(evt, action)
    }
    return { withFunction }
  }
  return { on }
}

export const addReactionTo = event('add')
export const removeReactionTo = event('remove')
