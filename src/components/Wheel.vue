<template>
  <div class="game__wheel">
    <canvas
      id="canvas-wheel"
      width="500"
      height="500"
    ></canvas>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Wheel",

  data() {
    return {
      startAngle: -0.2,
      arc: null,
      spinTimeout: null,
      spinArcStart: 10,
      spinTime: 0,
      spinTimeTotal: 0,
      ctx: null,
    };
  },

  computed: {
    ...mapGetters(["colors", "winNumParsed"])
  },

  methods: {
    getColor(index) {
      let result = null;
      switch (index) {
        case "1":
          result = "#0ca311";
          break;

        case "2":
          result = "#c80303";
          break;

        case "3":
          result = "#000000";
          break;

        case "4":
          result = "#caca03";
          break;
      }
      return result;
    },

    drawWheel() {
      if (!this.colors) return;
      const canvas = document.getElementById("canvas-wheel");
      this.ctx = canvas.getContext("2d");
      if (canvas.getContext) {
        var outsideRadius = 200;
        var textRadius = 185;
        var insideRadius = 180;

        this.ctx.clearRect(0, 0, 500, 500);

        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;

        this.ctx.font = "bold 12px Helvetica, Arial";

        this.colors.forEach((item) => {
          let angle = this.startAngle + item.index * this.arc;

          this.ctx.fillStyle = this.getColor(item.color);
          this.ctx.beginPath();
          this.ctx.strokeStyle = '#ffffff'
          this.ctx.arc(250, 250, outsideRadius, angle, angle + this.arc, false);
          this.ctx.arc(250, 250, insideRadius, angle + this.arc, angle, true);
          this.ctx.fill();
          this.ctx.stroke()

          this.ctx.save();
          this.ctx.shadowOffsetX = -1;
          this.ctx.shadowOffsetY = -1;
          this.ctx.shadowBlur = 0;
          this.ctx.fillStyle = "#ffffff";
          this.ctx.translate(
            250 + Math.cos(angle + this.arc / 2) * textRadius,
            250 + Math.sin(angle + this.arc / 2) * textRadius
          );
          this.ctx.rotate(angle + this.arc / 2 + Math.PI / 2);
          const text = item.index;
          this.ctx.fillText(text, -this.ctx.measureText(text).width / 2, 0);
          this.ctx.restore();
        });

        //Arrow
        // this.ctx.fillStyle = "white";
        // this.ctx.beginPath();
        // this.ctx.lineTo(460, 250);
        // this.ctx.lineTo(455, 250 - 5);
        // this.ctx.lineTo(460, 250 - 10);
        // this.ctx.fill();
      }
    },

    spin() {
      this.startAngle = -0.2;
      this.spinAngleStart = 18;
      this.spinTime = 0;
      this.spinTimeTotal = 4000;
      this.rotateWheel();
    },

    rotateWheel() {
      this.spinTime += 30;
      if (this.spinTime >= this.spinTimeTotal) {
        this.stopRotateWheel();
        const colorIndex = this.colors[
          this.colors.length - (this.winNumParsed || 20)
        ].color;
        const generatedColor = this.getColor(colorIndex);
        this.drawCurrentCell(generatedColor);
        return;
      }
      let spinAngle =
        this.spinAngleStart -
        this.easeOut(this.spinTime, 0, this.spinAngleStart, this.spinTimeTotal);
      this.startAngle += spinAngle * Math.PI / 180;
      this.drawWheel();
      this.drawCurrentCell();
      this.spinTimeout = setTimeout(() => this.rotateWheel(), 30);
    },

    drawCurrentCell(color) {
      let colLen = this.colors.length;
      let degrees = this.startAngle * 180 / Math.PI + 8;
      let arcd = this.arc * 180 / Math.PI;
      let index = Math.floor((360 - degrees % 360) / arcd);
      this.ctx.save();
      this.ctx.font = "bold 30px Helvetica, Arial";
      let text;
      text = this.colors[colLen - index - 1].index;
      text = Math.abs(text - this.winNumParsed - 20);
      this.ctx.fillStyle = color || "#444";
      this.ctx.fillRect(250 - 25, 250 - 25, 50, 50);
      this.ctx.fillStyle = "white";
      this.ctx.fillText(
        text,
        250 - this.ctx.measureText(text).width / 2,
        250 + 10
      );
      this.ctx.restore();
    },

    stopRotateWheel() {
      clearTimeout(this.spinTimeout);
    },

    easeOut(t, b, c, d) {
      const ts = (t /= d) * t;
      const tc = ts * t;
      return b + c * (tc + -3 * ts + 3 * t);
    }
  },

  watch: {
    colors(updated) {
      if (updated) {
        const colLen = this.colors.length;
        this.arc = Math.PI / (colLen / 2);
        this.drawWheel();
      }
    },
    winNumParsed(updated) {
      if (updated) {
        this.spin();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
