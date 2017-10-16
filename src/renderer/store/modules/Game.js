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
  addLife (state) {
    state.livesLeft++
  },
  looseLife (state) {
    state.livesLeft--
  },
  addPoints (state, points) {
    state.score += points
  },
  setLivesLeft (state, lives) {
    state.livesLeft = lives
  },
  setPoints (state, points) {
    state.points = points
  }
}

const actions = {
  startNewGame ({dispatch, commit}) {
    // Reset lives and points
    commit('setLivesLeft', 2)
    commit('setPoints', 0)
    dispatch('generateBricks')
    // Create a ball
    dispatch('createBall')
  },
  loadNextLevel ({commit, dispatch}) {
    commit('clearBalls')
    dispatch('createBall')
    dispatch('generateBricks')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
