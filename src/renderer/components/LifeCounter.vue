<template>
  <div class="life-counter">{{livesLeft}}</div>
</template>

<script>
export default {
  computed: {
    livesLeft () {
      return this.$store.getters.livesLeft
    }
  }
}
</script>

<style>
.life-counter {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #fff;
}
</style>
