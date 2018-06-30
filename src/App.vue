<template>
  <main class="game">
    <h1 class="game__headline">Game</h1>
    <section class="game__body">
      <div class="game__time-left">
        {{winNumParsed ? 'Next game in' : 'The game will start in'}} {{timeLeft}} seconds
      </div>
      <div class="game__desk">
        <ul v-if="colors" class="game__cells">
          <li
            v-for="(index, key) in colors"
            :key="key"
            class="game__cell"
            :class="[
              'game__cell_color-' + index,
              (winNumParsed && winNumParsed === key + 1) ? 'game__cell_winner' : ''
            ]"
          >{{key + 1}}</li>
        </ul>
      </div>
      <div v-if="winNumParsed" class="game__win-num">
        Winner:
        <span class="game__win-num-cell">{{winNumParsed}}</span>
      </div>
    </section>
  </main>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      colors: null,
      timeLeft: null,
      winNumHash: null,
      winNum: null,
      tickInterval: null
    }
  },

  created() {
    const socket = new WebSocket("ws://rocket.pelidev.com/ws/game")

    this.getCurrentGame()
      .then(res => {
        this.colors = res.Colors
        this.timeLeft = res.TimeLeft
      })

    socket.onmessage = e => {

      if (e.data) {
        const eventName = JSON.parse(e.data).Event

        clearInterval(this.tickInterval)

        if (eventName === 'winNumberHash') {
          this.getCurrentGame(false)
        } else if (eventName === 'winNumber') {
          this.getCurrentGame(true)
        }
      }
    }
  },

  destroyed() {
    clearInterval(this.tickInterval)
  },

  methods: {

    getCurrentGame(isGameFinished) {
      return fetch('http://rocket.pelidev.com/api/game/current')
        .then(res => res.json())
        .then(res => {
          this.colors = res.Colors
          this.timeLeft = isGameFinished ? res.TimeLeftNext : res.TimeLeft
          this.winNum = res.WinNum
          this.startTick()
        })
    },

    startTick() {
      this.tickInterval = setInterval(() => {
        if (this.timeLeft) {
          this.timeLeft -= 1
        }
      }, 1000)
    },

  },

  computed: {
    winNumParsed() {
      return this.winNum ? Math.floor(this.winNum) : false
    }
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  height: 100%;
  min-height: 100vh;
}
.game {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
  height: 100%;
  min-height: 100vh;
  background: #1d2029;
  padding: 0 20px;

  &__headline {
    margin: 0;
    padding: 20px 0;
  }

  &__time-left {
    padding-bottom: 20px;
  }

  &__desk {
    margin-bottom: 20px;
  }

  &__cells {
    margin: 0;
    padding: 0 50px;
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(6, 50px);
    list-style: none;
  }

  &__cell {
    border: 1px solid #ffffff;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    transform: scale(1);
    transition: transform .3s;
    &_color {
      &-1 {
        background: #0ca311;
      }
      &-2 {
        background: #c80303;
      }
      &-3 {
        background: #000000;
      }
      &-4 {
        background: #caca03;
      }
    }

    &_winner {
      transform: scale(1.6);
      z-index: 10;
    }
  }

  &__win-num {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__win-num-cell {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    border: 2px solid #ffffff;
    width: 40px;
    height: 40px;
    margin: 0 20px;
  }
}
</style>
