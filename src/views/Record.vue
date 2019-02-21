<template>
  <div id="record">
    Test
    {{ record }}
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "Record",
  props: {
    record: Object
  },
  mounted() {}
});
</script>

<style lang="scss">
@import "@/styles/global.scss";
</style>
