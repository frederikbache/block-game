const state = {
  bounds: {}
}

const getters = {
  paddleBounds (state) {
    return state.bounds
  }
}

const mutations = {
  savePaddleBounds (state, bounds) {
    state.bounds = bounds
  }
}

const actions = {
}

export default {
  state,
  getters,
  mutations,
  actions
}
