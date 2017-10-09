const state = {
  livesLeft: 2,
  score: 0
}

const getters = {
  livesLeft (state) {
    return state.livesLeft
  },
  score (state) {
    return state.score
  }
}

const mutations = {
  looseLife (state) {
    state.livesLeft--
  },
  addPoints (state, points) {
    state.score += points
  }
}

export default {
  state,
  getters,
  mutations
}
