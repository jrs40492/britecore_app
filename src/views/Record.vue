<template>
  <div id="record">
    Test
    {{ record }}
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Record",
  props: {
    record: Object
  },
  mounted() {
    console.log(1, this.record);
  }
});
</script>

<style lang="scss">
@import "@/styles/global.scss";

</style>
