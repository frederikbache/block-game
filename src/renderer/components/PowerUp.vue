<template>
  <div :class="classes" :style="style"></div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      size: 40,
      hit: 0
    }
  },
  computed: {
    style () {
      return {
        top: this.data.y + 'px',
        left: this.data.x + 'px'
      }
    },
    classes () {
      let classes = {
        'power-up': true
      }
      classes['power-up--' + this.data.type] = true
      return classes
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
  background: #679DD2;
  width: 40px;
  height: 40px;
  box-shadow: inset -3px -3px 0 0 rgba(0,0,0,0.30), inset 3px 3px 0 0 rgba(255,255,255,0.60);
  border-radius: 3px;
  background-repeat: no-repeat;
  background-position: center;
}

.power-up--leadball {
  background-image: url('/static/powerup/leadball.svg')
}

.power-up--splitball {
  background-image: url('/static/powerup/splitball.svg')
}

.power-up--life {
  background-image: url('/static/powerup/life.svg')
}

.power-up--fastball {
  background-color: #DFA546;
  background-image: url('/static/powerup/fastball.svg')
}

.power-up--slowball {
  background-image: url('/static/powerup/slowball.svg')
}
</style>
