<template>
  <div id="app">
    <life-counter></life-counter>
    <score-counter></score-counter>
    <power-up  v-for="powerUp in powerUps" :key="powerUp.id" :data="powerUp"></power-up>
    <div class="bricks">
        <brick :data="brick" :key="brick.id" v-for="brick in storeBricks"></brick>
    </div>
    <ball v-for="ball in balls" :key="ball.id" :data="ball"></ball>
    <paddle ref="paddle"></paddle>
  </div>
</template>

<script>
import Ball from './components/Ball'
import Brick from './components/Brick'
import Paddle from './components/Paddle'
import LifeCounter from './components/LifeCounter'
import ScoreCounter from './components/ScoreCounter'
import PowerUp from './components/PowerUp'

export default {
  name: 'block-game',
  components: {
    Ball,
    Brick,
    Paddle,
    LifeCounter,
    ScoreCounter,
    PowerUp
  },
  data () {
    return {
      dead: false,
      ticker: null,
      // TODO Do levels
      brickLayout: [
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
      ],
      bricks: [],
      powerUpRefs: []
    }
  },
  computed: {
    balls () {
      return this.$store.getters.allBalls
    },
    powerUps () {
      return this.$store.getters.allPowerUps
    },
    storeBricks () {
      return this.$store.getters.allBricks
    },
    gameboardDimensions () {
      return this.$store.getters.gameboardDimensions
    },
    livesLeft () {
      return this.$store.getters.livesLeft
    },
    bricksLeft () {
      return this.$store.getters.bricksLeft
    }
  },
  watch: {
    bricksLeft (val) {
      if (val === 0) {
        this.stopTicker()
        setTimeout(() => {
          this.$store.dispatch('loadNextLevel')
          setTimeout(() => {
            this.startTicker()
          }, 2000)
        }, 1000)
      }
    }
  },
  mounted () {
    window.addEventListener('resize', () => {
      this.updateDimensions()
    })
    this.updateDimensions()
    this.startGame()
  },
  methods: {
    updateDimensions () {
      this.$store.commit('setGameboardDimensions', {
        w: document.getElementById('app').offsetWidth,
        h: document.getElementById('app').offsetHeight
      })
    },
    looseBall (ball) {
      this.$store.commit('removeBall', ball.id)
      this.$nextTick(() => {
        console.log(this.balls)
        if (this.balls.length === 0) {
          this.looseLife()
        }
      })
    },
    looseLife () {
      console.log('Lost life')
      this.dead = true
      // this.stopTicker()
      if (this.livesLeft === 0) {
        this.stopTicker()
        // TODO Show game over screen
      } else {
        this.$store.commit('looseLife')
        setTimeout(() => {
          this.stopTicker()
          this.$store.dispatch('createBall')
        }, 1000)
        setTimeout(() => {
          this.startTicker()
        }, 2000)
      }
    },
    startGame () {
      this.$store.dispatch('startNewGame')
      this.startTicker()
      /* setInterval(() => {
        this.$store.dispatch('splitBall')
      }, 10000) */
    },
    startTicker () {
      this.dead = false
      this.ticker = setInterval(() => {
        this.move()
      }, 20)
    },
    stopTicker () {
      clearInterval(this.ticker)
    },
    move () {
      this.$store.commit('moveBalls')
      this.$store.commit('movePowerUps')
      // this.$refs.ball.move()
      this.$refs.paddle.move()
      if (!this.dead) this.checkCollision()
    },
    checkCollision () {
      for (let i in this.balls) {
        let ball = this.balls[i]
        if (!ball) continue
        if (ball.y < 0) {
          this.$store.dispatch('handleCollision', {
            dx: 0,
            dy: 0,
            newAngle: 2 * Math.PI - ball.angle,
            ball: ball
          })
        } else if (ball.y > this.gameboardDimensions.h) {
          this.looseBall(ball)
        }
        // Left / right
        if (ball.x + ball.size > this.gameboardDimensions.w || ball.x < 0) {
          this.$store.dispatch('handleCollision', {
            dx: 0,
            dy: 0,
            newAngle: Math.PI - ball.angle,
            ball: ball
          })
        }
      }

      for (let i in this.powerUps) {
        let p = this.powerUps[i]
        if (!p) continue
        if (p.y - p.size > this.gameboardDimensions.h) {
          this.$store.commit('removePowerUp', p.id)
          console.log('Lost power up')
        }
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Press Start 2P';
  height: 100%;
  background: #463654;
}
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
.ball {
  background: #000;
  width: 20px;
  height: 20px;
  position: absolute;
  border-radius: 50%;
}
.bricks {
  padding-top: 50px;
  text-align: center;
}
  /* CSS */
</style>
