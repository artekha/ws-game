<template>
  <div class="timer">
    {{
      winNumParsed
      ? 'Next game in'
      : 'The game will start in'
    }} {{timeLeft}} seconds
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Wheel",
  computed: {
    ...mapGetters(["timeLeft", "winNumParsed"])
  }
};
</script>

<style scoped>
.time-left {
  padding-bottom: 20px;
}
</style>

