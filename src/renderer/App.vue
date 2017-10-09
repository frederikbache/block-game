<template>
  <div id="app">
    <life-counter></life-counter>
    <score-counter></score-counter>
    <div class="bricks">
      <div v-for="row in brickLayout">
        <brick @created="brickCreated" :type="brick" v-for="brick in row"></brick>
      </div>
    </div>
    <ball ref="ball"></ball>
    <paddle ref="paddle"></paddle>
  </div>
</template>

<script>
import Ball from './components/Ball'
import Brick from './components/Brick'
import Paddle from './components/Paddle'
import LifeCounter from './components/LifeCounter'
import ScoreCounter from './components/ScoreCounter'

export default {
  name: 'block-game',
  components: {
    Ball,
    Brick,
    Paddle,
    LifeCounter,
    ScoreCounter
  },
  data () {
    return {
      dead: false,
      lives: 2,
      ticker: null,
      brickLayout: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
      ],
      bricks: []
    }
  },
  computed: {
    gameboardDimensions () {
      return this.$store.getters.gameboardDimensions
    },
    livesLeft () {
      return this.$store.getters.livesLeft
    },
    bricksLeft () {
      let bricksLeft = 0
      for (let i in this.bricks) {
        if (!this.bricks[i].destroyed) bricksLeft++
      }
      return bricksLeft
    }
  },
  watch: {
    bricksLeft (val) {
      console.log('Bricks left: ', val)
      if (val === 0) {
        this.stopTicker()
      }
    }
  },
  mounted () {
    window.addEventListener('resize', () => {
      this.updateDimensions()
    })
    this.updateDimensions()
    this.startTicker()
  },
  methods: {
    updateDimensions () {
      this.$store.commit('setGameboardDimensions', {
        w: document.getElementById('app').offsetWidth,
        h: document.getElementById('app').offsetHeight
      })
    },
    brickCreated (brick) {
      this.bricks.push(brick)
    },
    looseLife () {
      this.dead = true
      // this.stopTicker()
      if (this.livesLeft === 0) {
        console.log('game over')
        this.stopTicker()
      } else {
        this.$store.commit('looseLife')
        setTimeout(() => {
          this.stopTicker()
          this.reset()
        }, 1000)
        setTimeout(() => {
          this.startTicker()
        }, 2000)
      }
    },
    reset () {
      this.$refs.ball.reset()
      this.$refs.paddle.reset()
    },
    startTicker () {
      this.dead = false
      this.reset()
      this.ticker = setInterval(() => {
        this.move()
      }, 20)
    },
    stopTicker () {
      clearInterval(this.ticker)
    },
    move () {
      this.$refs.ball.move()
      this.$refs.paddle.move()
      if (!this.dead) this.checkCollision()
    },
    checkCollision () {
      let ball = this.$refs.ball

      let paddleCollision = this.$refs.paddle.collidesWith(ball)
      if (paddleCollision) {
        ball.handleCollision(paddleCollision)
        return
      }

      for (let i in this.bricks) {
        let brickCollision = this.bricks[i].collidesWith(ball)
        if (brickCollision) {
          ball.handleCollision(brickCollision)
          return
        }
      }

      if (ball.y < 0) {
        ball.angle = 2 * Math.PI - ball.angle
      } else if (ball.y + ball.size > this.gameboardDimensions.h) {
        this.looseLife()
      }
      // Side edges
      if (ball.x + ball.size > this.gameboardDimensions.w || ball.x < 0) {
        ball.angle = Math.PI - ball.angle
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
