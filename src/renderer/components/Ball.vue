<template>
  <div class="ball" :style="{left: x + 'px', top: y + 'px'}"></div>
</template>

<script>
export default {
  data () {
    return {
      x: 0,
      y: 0,
      size: 20,
      angle: 7 / 4 * Math.PI,
      speed: 8
    }
  },
  computed: {
    gameboardDimensions () {
      return this.$store.getters.gameboardDimensions
    }
  },
  mounted () {
    this.reset()
  },
  methods: {
    move () {
      // Increase speed
      // this.speed += 0.001
      // Ball movement
      let dx = Math.cos(this.angle) * this.speed
      let dy = Math.sin(this.angle) * this.speed
      this.x += dx
      this.y += -dy
    },
    handleCollision (collision) {
      // if (collision.target === 'brick') return
      this.angle = collision.newAngle
    },
    reset () {
      this.angle = Math.PI / 2
      this.x = (this.gameboardDimensions.w - this.size) / 2
      this.y = 400
    }
  }
}
</script>

<style>
.ball {
  background: #D8D8D8;
  box-shadow: 0 1px 1px 0 rgba(0,0,0,0.50), inset -1px -2px 2px 0 rgba(0,0,0,0.30), inset 2px 2px 2px 0 rgba(255,255,255,0.82);
}
</style>
