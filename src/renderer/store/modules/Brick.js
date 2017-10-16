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
          destroyed: false
        }
        state.bricks.push(brick)
      }
    }
    console.log('created bricks')
  },
  clearBricks (state) {
    state.bricks = []
  },
  destroyBrick (state, id) {
    for (let i in state.bricks) {
      if (state.bricks[i].id === id) {
        Vue.set(state.bricks[i], 'destroyed', true)
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
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
