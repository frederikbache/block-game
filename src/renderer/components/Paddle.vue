<template>
  <div class="paddle" :style="{left: x + '%', width: width + 'px'}"></div>
</template>

<script>
export default {
  data () {
    return {
      x: 50,
      speed: 2,
      width: 100,
      input: {
        left: false,
        rigth: false
      },
      bounds: {}
    }
  },
  created () {
    document.addEventListener('keydown', e => {
      if (e.keyCode === 37) this.input.left = true
      if (e.keyCode === 39) this.input.right = true
    })
    document.addEventListener('keyup', e => {
      if (e.keyCode === 37) this.input.left = false
      if (e.keyCode === 39) this.input.right = false
    })
  },
  computed: {
    gameboardWidth () {
      return this.$store.getters.gameboardDimensions.w
    },
    balls () {
      return this.$store.getters.allBalls
    },
    powerUps () {
      return this.$store.getters.allPowerUps
    }
  },
  watch: {
    balls: {
      handler (balls) {
        for (let i in balls) {
          let collision = this.collidesWith(balls[i])
          if (collision) {
            this.$store.dispatch('handleCollision', collision)
          }
        }
      },
      deep: true
    },
    powerUps: {
      handler (powerUps) {
        for (let i in powerUps) {
          let collision = this.powerUpCollision(powerUps[i])
          if (collision) {
            this.$store.dispatch('powerUpCaught', powerUps[i])
          }
        }
      },
      deep: true
    }
  },
  mounted () {
    window.addEventListener('resize', () => {
      this.calculateBounds()
    })
    this.calculateBounds()
    this.$emit('created', this)
  },
  methods: {
    move () {
      // Paddle movement
      if (this.input.left) {
        this.x -= this.speed
      } else if (this.input.right) {
        this.x += this.speed
      }
      if (this.x < 0) {
        this.x = 0
      } else if (this.x / 100 * this.gameboardWidth + this.width > this.gameboardWidth) {
        this.x = (this.gameboardWidth - this.width) / this.gameboardWidth * 100
      }
      this.calculateBounds()
    },
    powerUpCollision (p) {
      if (!p) return
      if (p.y + p.size > this.bounds.y && p.y <= this.bounds.y + this.bounds.h && p.x > this.bounds.x && p.x < this.bounds.x + this.bounds.w) {
        return true
      }
    },
    collidesWith (ball) {
      if (ball.y + ball.size > this.bounds.y && ball.y + ball.size <= this.bounds.y + ball.speed && ball.x > this.bounds.x && ball.x < this.bounds.x + this.bounds.w) {
        let newAngle = Math.PI * 0.80 * (1 - (ball.x - this.bounds.x) / this.bounds.w) + Math.PI * 0.1
        return {
          dx: 0,
          dy: 0,
          ball: ball,
          newAngle: newAngle
        }
      }
    },
    calculateBounds () {
      this.bounds = {
        x: this.$el.offsetLeft,
        y: this.$el.offsetTop,
        w: this.$el.offsetWidth,
        h: this.$el.offsetHeight
      }
    },
    reset () {
      this.x = ((this.gameboardWidth - this.width) / 2) / this.gameboardWidth * 100
    }
  }
}
</script>

<style>
.paddle {
  box-sizing: border-box;
  position: absolute;
  bottom: 10px;
  height: 16px;
  border-radius: 8px;
  /* Rectangle: */
  background: #B1C1D4;
  box-shadow: inset 0 -2px 0 0 rgba(0,0,0,0.50), inset 0 2px 0 0 rgba(255,255,255,0.50);
}
</style>
