<template>
  <div class="circle-progress">
    <svg class="circle-progress-svg" viewBox="22 22 44 44">
      <circle
        class="circle-progress-circle"
        cx="44"
        cy="44"
        r="19.5"
      ></circle>
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Loading', 
});
</script>

<style scoped>
  @keyframes progress-loading {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes circle-loading {
    0% {
      stroke-dasharray: 1px, 200px;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 100px, 200px;
      stroke-dashoffset: -15px;
    }
    100% {
      stroke-dasharray: 100px, 200px;
      stroke-dashoffset: -125px;
    }
  }

  .circle-progress {
    width: 20px;
    height: 20px;
    display: inline-block;
    color: #000;
    -webkit-animation: progress-loading 1.4s linear infinite;
    animation: progress-loading 1.4s linear infinite;
    box-sizing: border-box;
  }

  .circle-progress-svg {
    display: block;
    box-sizing: border-box;
    color: #fff;
  }

  .circle-progress-circle {
    fill: none;
    stroke-width: 5px;
    stroke: currentColor;
    stroke-dasharray: 80px, 200px;
    stroke-dashoffset: 0;
    -webkit-animation: circle-loading 1.4s ease-in-out infinite;
    animation: circle-loading 1.4s ease-in-out infinite;
  }
</style>
