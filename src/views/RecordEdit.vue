<template></template>

<script>
import Vue from "vue";
import firebase from "firebase";

export default Vue.extend({
  name: "recordEdit",
  components: {
    ColumnOption
  },
  data() {
    return {
      info: [],
      columns: []
    };
  },
  created() {
    this.getInfo();
    this.getColumns();
  },
  methods: {}
});
</script>
