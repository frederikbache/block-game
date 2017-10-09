const state = {
  dimensions: {w: 0, h: 0}
}

const getters = {
  gameboardDimensions (state) {
    return state.dimensions
  }
}

const mutations = {
  setGameboardDimensions (state, dimensions) {
    state.dimensions = dimensions
  }
}

export default {
  state,
  getters,
  mutations
}
