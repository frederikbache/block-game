<template>
  <div class="power-up" :style="style"></div>
</template>

<script>
export default {
  props: ['bounds'],
  data () {
    return {
      x: 0,
      y: 0,
      angle: 0,
      size: 40,
      hit: 0
    }
  },
  created () {
    this.x = this.bounds.x
    this.y = this.bounds.y
    this.$emit('created', this)
  },
  computed: {
    style () {
      return {
        top: this.y + 'px',
        left: this.x + 'px'
      }
    }
  },
  methods: {
    move () {
      this.y += 5
    },
    handleHit (collision) {
      this.hit = true
      this.$emit('hit')
      console.log('The power up was hit')
    }
  }
}
</script>

<style>
.power-up {
  position: absolute;
  background: blue;
  width: 30px;
  height: 30px;
}
</style>
