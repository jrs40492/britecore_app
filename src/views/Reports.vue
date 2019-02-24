<template>
  <div id="reports" class="grid grid-cell span-12-xs">
    <ActionBar :actions="actions"></ActionBar>
    <DataTable :columns="columns" :records="records" :options="options"></DataTable>
  </div>
</template>

<script>
import Vue from "vue";
import DataTable from "@/components/DataTable.vue";
import ActionBar from "@/components/ActionBar.vue";

export default Vue.extend({
  name: "Reports",
  components: {
    DataTable,
    ActionBar
  },
  created() {
    this.$store.dispatch("reports/getAll");
  },
  computed: {
    records() {
      return this.$store.state.reports.records;
    },
    options() {
      return this.$store.state.reports.options;
    }
  },
  data() {
    return {
      columns: this.$store.state.reports.columns,
      actions: [
        {
          type: "link",
          link: "upload",
          append: true,
          icon: "cloud_upload",
          text: "Upload",
          align: "right"
        }
      ]
    };
  }
});
</script>

<style lang="scss">
@import "@/styles/_variables.scss";

a.icon-link {
  align-self: center;
  padding: 10px;
  color: white;
  background-color: $primary-color;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
}
</style>
