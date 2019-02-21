<template>
  <div id="report-wrapper">
    <DataTable :data="data"></DataTable>
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from "vue";
import DataTable from "@/components/DataTable.vue";

export default Vue.extend({
  name: "report",
  components: {
    DataTable
  },
  data() {
    return {
      data: {
        records: [],
        columns: [],
        uniqueColumn: "ID",
        options: {
          canEdit: true,
          canDelete: true
        }
      }
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
