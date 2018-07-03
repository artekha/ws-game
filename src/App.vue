<template>
  <main class="game">
    <h1 class="game__headline">Game</h1>
    <section class="game__body">
      <counter></counter>
      <wheel></wheel>
    </section>
  </main>
</template>

<script>
import Wheel from "./components/Wheel";
import Counter from "./components/Counter";

import { mapActions } from "vuex";

export default {
  name: "app",
  components: { Wheel, Counter },

  created() {
    const socket = new WebSocket("ws://rocket.pelidev.com/ws/game");

    this.getGame();

    socket.onmessage = e => {
      if (e.data) {
        const eventName = JSON.parse(e.data).Event;

        this.clearTick();

        if (eventName === "winNumberHash") {
          this.getGame();
        } else if (eventName === "winNumber") {
          this.getGame();
        }
      }
    };
  },

  destroyed() {
    this.clearTick();
  },

  methods: {
    ...mapActions(["getGame", "clearTick"])
  }
};
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  height: 100%;
  min-height: 100vh;
}
.game {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
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
    transition: transform 0.3s;
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
}
</style>
