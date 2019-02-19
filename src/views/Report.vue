<template>
  <div id="report-wrapper">
    <DataTable :data="data"></DataTable>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DataTable from "@/components/DataTable.vue";
import payments from "@/payments.ts";

export default Vue.extend({
  name: "report",
  components: {
    DataTable
  },
  data() {
    return {
      data: {
        records: payments,
        columns: [
          {
            id: "ID",
            title: "ID",
            visible: false
          },
          {
            id: "Name",
            title: "Name",
            canFilter: true
          },
          {
            id: "Description",
            title: "Description",
            canFilter: true
          },
          {
            id: "Date",
            title: "Date",
            type: "date",
            canFilter: true
          },
          {
            id: "Amount",
            title: "Amount",
            type: "currency",
            canFilter: true
          }
        ],
        uniqueColumn: "ID",
        options: {
          canEdit: true,
          canDelete: true
        }
      }
    };
  }
});
</script>
