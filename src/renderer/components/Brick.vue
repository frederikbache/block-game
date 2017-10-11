<template>
  <div ref="brick" class="brick" :class="brickClass">
  </div>
</template>

<script>
export default {
  props: ['type'],
  data () {
    return {
      destroyed: false,
      hits: 0,
      bounds: {}
    }
  },
  created () {
    if (this.type === 0) this.destroyed = true
  },
  mounted () {
    window.addEventListener('resize', () => {
      this.calculateBounds()
    })
    this.calculateBounds()
    this.$emit('created', this)
  },
  computed: {
    brickClass () {
      let classes = {
        'brick--hit': this.hits > 0,
        'brick--destroyed': this.destroyed
      }
      classes['brick--' + this.type] = true
      return classes
    }
  },
  methods: {
    calculateBounds () {
      this.bounds = {
        x: this.$refs.brick.offsetLeft,
        y: this.$refs.brick.offsetTop,
        w: this.$el.offsetWidth,
        h: this.$el.offsetHeight
      }
    },
    handleHit () {
      this.hits++
      if (this.type === 2) {
        if (this.hits > 1) this.destroy()
      } else {
        this.destroy()
      }
      let points = 0
      switch (this.type) {
        case 1: points = 25; break
        case 2: points = 50; break
      }
      this.$store.commit('addPoints', points)
    },
    destroy () {
      this.destroyed = true
      if (Math.random() < 0.1) this.$emit('powerup', this.bounds)
    },
    collidesWith (ball) {
      // We can't collide with broken bricks
      if (this.destroyed) return false
      let inXBounds = ball.x + ball.size >= this.bounds.x && ball.x <= this.bounds.x + this.bounds.w
      let inYBounds = ball.y + ball.size >= this.bounds.y && ball.y <= this.bounds.y + this.bounds.h
      if (inXBounds && inYBounds) {
        this.handleHit()
        let nearX = Math.min(Math.abs(ball.x + ball.size - this.bounds.x), Math.abs(ball.x - this.bounds.x - this.bounds.w))
        let nearY = Math.min(Math.abs(ball.y + ball.size - this.bounds.y), Math.abs(ball.y - this.bounds.y - this.bounds.h))
        let newAngle = nearX < nearY ? Math.PI - ball.angle : 2 * Math.PI - ball.angle
        return {
          target: 'brick',
          destroyed: this.destroyed,
          newAngle: newAngle
        }
      }
    }
  }
}
</script>

<style>
.brick {
  vertical-align: bottom;
  display: inline-block;
  width: 80px;
  height: 40px;
  margin: 0;
  transition: all .3s ease-out;
    /* Rectangle 2 Copy 5: */
  background: #67D28A;
  box-shadow: inset -3px -3px 0 0 rgba(0,0,0,0.30), inset 3px 3px 0 0 rgba(255,255,255,0.60);
}

.brick--2 {
  background: #D26771;
}

.brick--2.brick--hit {
  background: #67D28A;
}

.brick--destroyed {
  opacity: 0
}
</style>
