<template>
  <div class="ball" :class="{'ball--lead': data.powerMode}" :style="{left: data.x + 'px', top: data.y + 'px'}"></div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  computed: {
    gameboardDimensions () {
      return this.$store.getters.gameboardDimensions
    }
  },
  methods: {
    handleCollision (collision) {
      if (collision.target === 'brick' && this.powerMode && collision.destroyed) return
      this.angle = collision.newAngle
    },
    reset () {
      this.angle = Math.PI / 2
      this.x = (this.gameboardDimensions.w - this.size) / 2
      this.y = 400
      this.powerMode = false
    }
  }
}
</script>

<style>
.ball {
  background: #D8D8D8;
  box-shadow: 0 1px 1px 0 rgba(0,0,0,0.50), inset -1px -2px 2px 0 rgba(0,0,0,0.30), inset 2px 2px 2px 0 rgba(255,255,255,0.82);
}

.ball--lead {
  background: #888;
}
</style>
