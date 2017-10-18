import Vue from 'vue'

function brickBallOverlap (dx, dy, r, w, h) {
  // The ball ball is to far in x or y to possibly intersect with the brick
  // NOTE: If the distance is equal (i.e. touching) we do not calculate it as an overlap
  if (dx >= w / 2 + r || dy >= h / 2 + r) {
    return false
  }
  // The center of the ball is either inside the brick bounds in x/y direction,
  // so we can be sure of an overlap
  if (dx <= w / 2 || dy <= h / 2 || Math.sqrt((dx - w / 2) ^ 2 + (dy - h / 2) ^ 2) < r) {
    let overlapX = w / 2 + r - dx
    let overlapY = h / 2 + r - dy
    if (overlapY <= overlapX) {
      return {x: 0, y: overlapY}
    } else {
      return {x: overlapX, y: 0}
    }
  }
}

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
  updateBallAngle2 (state, {i, a}) {
    Vue.set(state.balls[i], 'angle', a)
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
  UpdateBallPosition (state, {i, x, y}) {
    Vue.set(state.balls[i], 'x', x)
    Vue.set(state.balls[i], 'y', y)
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
  testCollision ({dispatch, getters}, {x, y, r, a}) {
    let bricks = getters.allBricks
    let centerX = x + r
    let centerY = y + r
    return new Promise((resolve, reject) => {
      for (let b in bricks) {
        let brick = bricks[b]
        if (brick.destroyed || brick.type === 0) continue
        let brickCenterX = brick.bounds.x + brick.bounds.w / 2
        let brickCenterY = brick.bounds.y + brick.bounds.h / 2
        let dx = Math.abs(brickCenterX - centerX)
        let dy = Math.abs(brickCenterY - centerY)
        // Check if there is an overlap between ball and brick
        let overlap = brickBallOverlap(dx, dy, r, brick.bounds.w, brick.bounds.h)
        if (overlap) {
          return dispatch('handleBrickHit', brick).then(destroyed => {
            resolve({
              dx: overlap.x,
              dy: overlap.y,
              a: overlap.x ? Math.PI - a : 2 * Math.PI - a,
              brickDestroyed: destroyed
            })
          })
        }
      }
      // Test the paddle
      let paddleBounds = getters.paddleBounds
      let paddleCenterX = paddleBounds.x + paddleBounds.w / 2
      let paddleCenterY = paddleBounds.y + paddleBounds.h / 2
      let dx = Math.abs(paddleCenterX - centerX)
      let dy = Math.abs(paddleCenterY - centerY)
      let overlap = brickBallOverlap(dx, dy, r, paddleBounds.w, paddleBounds.h)
      if (overlap) {
        let newAngle = Math.PI * 0.80 * (1 - (x - paddleBounds.x) / paddleBounds.w) + Math.PI * 0.1
        resolve({
          dx: overlap.x,
          dy: overlap.y,
          a: newAngle
        })
      }
      // Finally the edges
      let gameboardDimensions = getters.gameboardDimensions
      if (x < 0) {
        resolve({
          dx: -x,
          dy: 0,
          a: Math.PI - a
        })
      } else if (x + 2 * r > gameboardDimensions.w) {
        resolve({
          dx: x + 2 * r - gameboardDimensions.w,
          dy: 0,
          a: Math.PI - a
        })
      } else if (y < 0) {
        resolve({
          dx: 0,
          dy: -y,
          a: 2 * Math.PI - a
        })
      }
      resolve()
    })
  },
  moveBall ({dispatch, getters, state, commit}, {ballIndex, distance}) {
    return new Promise((resolve, reject) => {
      // Get the ball
      let ball = state.balls[ballIndex]
      // Move step wise to get a more precise collision detection
      let d = distance > 2 ? 2 : distance
      let x = ball.x
      let y = ball.y
      let a = ball.angle
      let r = ball.size / 2
      // Calculate new position
      let dx = d * Math.cos(a)
      let dy = d * Math.sin(a)
      let newX = x + dx
      let newY = y - dy
      dispatch('testCollision', {x: newX, y: newY, r, a}).then(collision => {
        // Ignore any collisions in power mode if they destroy the bricks
        if (collision && (!collision.brickDestroyed || !ball.powerMode)) {
          if (collision.dx) {
            collision.dy = Math.tan(a) * collision.dx
          } else {
            collision.dx = Math.tan(Math.PI / 2 - a) * collision.dy
          }
          newX -= Math.sign(dx) * collision.dx
          newY += Math.sign(dy) * collision.dy
          d -= Math.sqrt(collision.dx ^ 2 + collision.dy ^ 2)
          a = collision.a
          console.log('Updating angle', a)
          commit('updateBallAngle2', {i: ballIndex, a})
          commit('addPoint', {x: newX + r, y: newY + r, newAngle: true})
        }
        distance -= d
        console.log('Distance is now', distance)
        commit('UpdateBallPosition', {i: ballIndex, x: newX, y: newY})
        if (distance > 0) {
          return dispatch('moveBall', {ballIndex, distance}).then(({newX, newY}) => {
            resolve({newX, newY})
          })
        } else {
          console.log('Resolving')
          resolve({newX, newY})
        }
      })
    })
  },
  moveBalls ({dispatch, commit, getters}) {
    for (let i in getters.allBalls) {
      dispatch('moveBall', {ballIndex: i, distance: getters.allBalls[i].speed}).then(({newX, newY}) => {
        commit('movePoint', {x: newX + 10, y: newY + 10})
      })
    }
  },
  moveBalls2 ({dispatch, commit, getters}) {
    // Loop the balls
    for (let i in getters.allBalls) {
      let ball = getters.allBalls[i]
      // Save original position
      let x = ball.x
      let y = ball.y
      // Get the distance to move the ball
      let distance = ball.speed
      let angle = ball.angle
      let radius = ball.size / 2
      while (distance > 0) {
        // Calculate the number of steps to calculate collisions
        let steps = Math.ceil(distance / 2)
        for (let j = 0; j < steps; j++) {
          // Get the bricks
          let bricks = getters.allBricks
          // Calculate how much we need to move in this step
          let d = distance / steps
          let dx = d * Math.cos(angle)
          let dy = d * Math.sin(angle)
          let newX = x + dx
          let newY = y - dy
          // Calculate the center of the ball
          let centerX = newX + radius
          let centerY = newY + radius
          // console.log('moving ball', newX, newY)
          for (let b in bricks) {
            let brick = bricks[b]
            if (brick.destroyed || brick.type === 0) continue
            let brickCenterX = brick.bounds.x + brick.bounds.w / 2
            let brickCenterY = brick.bounds.y + brick.bounds.h / 2
            let distX = Math.abs(brickCenterX - centerX)
            let distY = Math.abs(brickCenterY - centerY)
            // Check if there is an overlap between ball and brick
            let overlap = brickBallOverlap(distX, distY, radius, brick.bounds.w, brick.bounds.h)
            if (overlap) {
              console.log('Overlap with brick', brick.id, brick.bounds, distX, distY)
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
              // If the brick is destroyed, and the ball is in power mode let i continue through
              if (destroyed && ball.powerMode) break
              // If not, move the ball to the moment just before impact and update the angle
              if (overlap.x) {
                overlap.y = Math.tan(angle) * overlap.x
                angle = Math.PI - angle
              } else {
                overlap.x = Math.tan(Math.PI / 2 - angle) * overlap.y
                angle = 2 * Math.PI - angle
              }
              dx -= Math.sign(dx) * overlap.x
              dy -= Math.sign(dy) * overlap.y
              // Update the distance to reflect, that we didn't move the full d
              d -= Math.sqrt(overlap.x ^ 2 + overlap.y ^ 2)
              // Commit the new angle
              commit('updateBallAngle2', {i, a: angle})
              commit('addPoint', {x: x + dx + radius, y: y - dy + radius, newAngle: true})
              break
            }
          }
          // Update x and y
          x += dx
          y -= dy
          // Commit the new ball position
          commit('movePoint', {x: x + radius, y: y + radius})
          commit('UpdateBallPosition', {i, x, y})
          distance -= d
        }
      }
    }
  },
  createBall ({commit, getters}) {
    let ball = {
      x: (getters.gameboardDimensions.w - 20) / 2,
      y: 360,
      size: 20,
      angle: Math.PI / (2 + (1 - Math.random())),
      speed: 8,
      powerMode: false
    }
    commit('addPoint', {x: ball.x + 10, y: ball.y + 10})
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
