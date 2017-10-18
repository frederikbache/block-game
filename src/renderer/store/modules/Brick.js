import Vue from 'vue'

const state = {
  bricks: [],
  counter: 0
}

const getters = {
  allBricks (state) {
    return state.bricks
  },
  bricksLeft (state) {
    let bricksLeft = 0
    for (let i in state.bricks) {
      if (!state.bricks[i].destroyed && state.bricks[i].type) bricksLeft++
    }
    console.log('bricks left', bricksLeft)
    return bricksLeft
  }
}

const mutations = {
  createBricks (state, level) {
    for (let r in level) {
      for (let c in level[r]) {
        let brick = {
          id: state.counter++,
          type: level[r][c],
          destroyed: level[r][c] === 0,
          hits: 0
        }
        state.bricks.push(brick)
      }
    }
    console.log('created bricks')
  },
  saveBrickBounds (state, {id, bounds}) {
    for (let i in state.bricks) {
      if (state.bricks[i].id === id) {
        Vue.set(state.bricks[i], 'bounds', bounds)
      }
    }
  },
  clearBricks (state) {
    state.bricks = []
  },
  destroyBrick (state, id) {
    for (let i in state.bricks) {
      if (state.bricks[i].id === id) {
        console.log('Destroying brick with id', id)
        Vue.set(state.bricks[i], 'destroyed', true)
      }
    }
  },
  updateBrickHits (state, {id, hits}) {
    for (let i in state.bricks) {
      if (state.bricks[i].id === id) {
        Vue.set(state.bricks[i], 'hits', hits)
      }
    }
  },
  setCurrentLevel (state, no) {
    state.currentLevel = no
  }
}

const actions = {
  generateBricks ({state, commit}, no) {
    commit('clearBricks')
    // Generate level
    let level = []
    for (let r = 0; r < 6; r++) {
      let row = []
      for (let c = 0; c < 5; c++) {
        row.push(Math.floor(Math.random() * 3))
      }
      level.push(row.concat(row.slice().reverse()))
    }
    commit('createBricks', level)
  },
  handleBrickHit ({commit, dispatch}, brick) {
    return new Promise((resolve, reject) => {
      // Handle the brick hit
      let hits = brick.hits + 1
      let destroyed = false
      if ((brick.type === 2 && hits > 1) || brick.type !== 2) {
        destroyed = true
        commit('destroyBrick', brick.id)
      }
      commit('updateBrickHits', {id: brick.id, hits: hits})
      let points = 0
      switch (brick.type) {
        case 1: points = 25; break
        case 2: points = 50; break
      }
      commit('addPoints', points)
      if (destroyed && Math.random() < 0.08) {
        dispatch('spawnPowerUp', brick.bounds)
      }

      resolve(destroyed)
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
