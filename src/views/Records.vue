<template>
  <div id="report-wrapper" class="grid grid-cell span-12-xs">
    <ActionBar :actions="actions"></ActionBar>
    <DataTable :data="data"></DataTable>
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
  data() {
    return {
      data: {
        records: [],
        columns: [],
        options: {
          canEdit: true,
          canDelete: true
        }
      },
      actions: [
        {
          type: "back",
          align: "left"
        }
      ]
    };
  },
  mounted() {
    this.getColumns();
    this.getRecords();
  },
  methods: {
    getColumns() {
      this.$store.state.db
        .collection("reports")
        .doc(this.$route.params.reportId)
        .collection("columns")
        .orderBy("order", "asc")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.data.columns.push({
              id: doc.id,
              data: doc.data()
            });
          });
        });
    },
    getRecords() {
      this.$store.state.db
        .collection("reports")
        .doc(this.$route.params.reportId)
        .collection("records")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.data.records.push({
              id: doc.id,
              data: doc.data()
            });
          });
        });
    }
  }
});
</script>
