import Vue from 'vue'

const state = {
  balls: [],
  ballIndex: 0
}

const getters = {
  allBalls (state) {
    return state.balls
  }
}

const mutations = {
  removeBall (state, ballId) {
    state.balls = state.balls.filter(ball => ball.id !== ballId)
  },
  clearBalls (state) {
    state.balls = []
  },
  addBall (state, ball) {
    ball.id = ++state.ballIndex
    state.balls.push(ball)
  },
  moveBalls (state) {
    for (let i in state.balls) {
      let ball = state.balls[i]
      let dx = Math.cos(ball.angle) * ball.speed
      let dy = Math.sin(ball.angle) * ball.speed
      Vue.set(state.balls[i], 'x', ball.x + dx)
      Vue.set(state.balls[i], 'y', ball.y - dy)
    }
  },
  updateBallAngle (state, {ball, collision}) {
    for (let i in state.balls) {
      if (state.balls[i].id === ball.id) {
        Vue.set(state.balls[i], 'x', ball.x + collision.dx)
        Vue.set(state.balls[i], 'y', ball.y + collision.dy)
        Vue.set(state.balls[i], 'angle', collision.newAngle)
      }
    }
  },
  leadBallsOn (state) {
    for (let i in state.balls) {
      Vue.set(state.balls[i], 'powerMode', true)
    }
  },
  leadBallsOff (state) {
    for (let i in state.balls) {
      Vue.set(state.balls[i], 'powerMode', false)
    }
  },
  slowBallsOn (state) {
    for (let i in state.balls) {
      Vue.set(state.balls[i], 'speed', 4)
    }
  },
  slowBallsOff (state) {
    for (let i in state.balls) {
      Vue.set(state.balls[i], 'speed', 8)
    }
  },
  fastBallsOn (state) {
    for (let i in state.balls) {
      Vue.set(state.balls[i], 'speed', 12)
    }
  },
  fastBallsOff (state) {
    for (let i in state.balls) {
      Vue.set(state.balls[i], 'speed', 8)
    }
  }
}

const actions = {
  activateLeadBall ({commit}) {
    commit('leadBallsOn')
    window.setTimeout(() => {
      commit('leadBallsOff')
    }, 10000)
  },
  activateSlowBall ({commit}) {
    commit('slowBallsOn')
    window.setTimeout(() => {
      commit('slowBallsOff')
    }, 10000)
  },
  activateFastBall ({commit}) {
    commit('fastBallsOn')
    window.setTimeout(() => {
      commit('fastBallsOff')
    }, 10000)
  },
  createBall ({commit, getters}) {
    let ball = {
      x: (getters.gameboardDimensions.w - 20) / 2,
      y: 360,
      size: 20,
      angle: Math.PI / 2,
      speed: 8,
      powerMode: false
    }
    commit('addBall', ball)
  },
  splitBall ({commit, getters}) {
    let balls = getters.allBalls
    if (balls.length > 0) {
      let ball = balls[0]
      let newBall = {
        x: ball.x,
        y: ball.y,
        size: ball.size,
        angle: Math.PI - ball.angle,
        speed: ball.speed,
        powerMode: ball.powerMode
      }
      commit('addBall', newBall)
    }
  },
  handleCollision ({commit}, collision) {
    let ball = collision.ball
    if (collision.target === 'brick' && ball.powerMode && collision.destroyed) return
    commit('updateBallAngle', {ball, collision})
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
