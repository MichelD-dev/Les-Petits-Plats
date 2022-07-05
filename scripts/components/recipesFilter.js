let ids = []

export const filterRecipes =
  (recipesIds = []) =>
  (recipesIds2 = []) => {
    let recipesArray = []

    const add = arr => (recipesArray = [...recipesArray, arr])

    // Je n'insère que des arrays non-vides dans l'array global
    if (recipesIds.length) add(recipesIds)
    if (recipesIds2.length) add(recipesIds2)

    // Fonction permettant de merger les arrays contenus dans l'array global en évitant les doublons
    ids =
      recipesArray.length &&
      recipesArray.shift().reduce((res, v) => {
        if (
          res.indexOf(v) === -1 &&
          recipesArray.every(a => a.indexOf(v) !== -1)
        )
          res.push(v)
        return res
      }, [])

    return ids
  }
