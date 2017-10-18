import Vue from 'vue'

const state = {
  points: []
}

const getters = {
  points (state) {
    return state.points
  }
}

const mutations = {
  addPoint (state, {x, y, newAngle}) {
    if (state.points.length) {
      Vue.set(state.points, state.points.length - 1, {
        x: x,
        y: y
      })
    } else {
      state.points.push({
        x: x,
        y: y
      })
    }
    state.points.push({
      x: x,
      y: y
    })
    if (state.points.length > 20) {
      state.points.splice(0, 2)
    }
  },
  movePoint (state, {x, y}) {
    Vue.set(state.points, state.points.length - 1, {
      x: x,
      y: y
    })
  }
}

export default {
  state,
  getters,
  mutations
}
