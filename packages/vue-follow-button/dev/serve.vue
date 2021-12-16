<script lang="ts">
import { defineComponent } from 'vue';
import VueFollowButton from '@/vue-follow-button.vue';

export default defineComponent({
  name: 'ServeDev',
  components: {
    VueFollowButton
  }
});
</script>

<template>
  <div id="app">
    <vue-follow-button />
  </div>
</template>
