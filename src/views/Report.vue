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
    this.$store.dispatch(
      "reports/getReportColumns",
      this.$route.params.reportId
    );
    this.$store.dispatch(
      "reports/getReportRecords",
      this.$route.params.reportId
    );
  },
  computed: {
    columns() {
      return this.$store.state.reports.report.columns;
    },
    records() {
      return this.$store.state.reports.report.records;
    },
    options() {
      return this.$store.state.reports.report.options;
    }
  },
  data() {
    return {
      actions: [
        {
          type: "back",
          align: "left"
        },
        {
          type: "link",
          link: "edit",
          append: true,
          align: "right",
          text: "Edit",
          icon: "edit"
        }
      ]
    };
  }
});
</script>
