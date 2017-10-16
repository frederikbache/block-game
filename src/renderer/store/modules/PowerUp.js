import Vue from 'vue'

const state = {
  powerUps: [],
  index: 0,
  types: ['life', 'splitball', 'leadball', 'slowball', 'fastball']
}

const getters = {
  allPowerUps (state) {
    return state.powerUps
  }
}

const mutations = {
  addPowerUp (state, powerUp) {
    powerUp.id = state.index++
    state.powerUps.push(powerUp)
  },
  removePowerUp (state, powerUpId) {
    state.powerUps = state.powerUps.filter(p => p.id !== powerUpId)
  },
  movePowerUps (state) {
    for (let i in state.powerUps) {
      Vue.set(state.powerUps[i], 'y', state.powerUps[i].y + 4)
    }
  }
}

const actions = {
  spawnPowerUp ({state, commit}, source) {
    let type = state.types[Math.floor(Math.random() * state.types.length)]
    let powerUp = {
      x: source.x + (source.w - 40) / 2,
      y: source.y + (source.h - 40) / 2,
      size: 40,
      type: type
    }
    commit('addPowerUp', powerUp)
  },
  powerUpCaught ({dispatch, commit}, powerUp) {
    switch (powerUp.type) {
      case 'life':
        commit('addLife')
        break
      case 'splitball':
        dispatch('splitBall')
        break
      case 'leadball':
        dispatch('activateLeadBall')
        break
      case 'slowball':
        dispatch('activateSlowBall')
        break
      case 'fastball':
        dispatch('activateFastBall')
        break
    }
    console.log('Caught power up', powerUp.type)
    commit('removePowerUp', powerUp.id)
    commit('addPoints', 100)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
