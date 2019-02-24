<template>
  <div id="report-wrapper" class="grid grid-cell span-12-xs">
    <ActionBar :actions="actions"></ActionBar>
    <DataTable :columns="columns" :records="records" :options="options"></DataTable>
  </div>
</template>

<script>
import Vue from "vue";
import DataTable from "@/components/DataTable.vue";
import ActionBar from "@/components/ActionBar.vue";

export default Vue.extend({
  name: "report",
  components: {
    DataTable,
    ActionBar
  },
  created() {
    this.$store.dispatch("records/getColumns", this.$route.params.reportId);
    this.$store.dispatch("records/getRecords", this.$route.params.reportId);
  },
  computed: {
    columns() {
      return this.$store.state.records.columns;
    },
    records() {
      return this.$store.state.records.records;
    },
    options() {
      return this.$store.state.records.options;
    }
  },
  data() {
    return {
      actions: [
        {
          type: "back",
          align: "left"
        }
      ]
    };
  }
});
</script>
