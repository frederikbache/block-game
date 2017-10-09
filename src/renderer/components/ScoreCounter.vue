<template>
  <div class="score-counter">{{score}}</div>
</template>

<script>
export default {
  computed: {
    score () {
      return this.$store.getters.score
    }
  }
}
</script>

<style>
.score-counter {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #fff;
}
</style>
