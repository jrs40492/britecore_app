<template>
  <div id="reports">
    <div class="reports-nav">
      <router-link to="upload" class="icon-link" append>
        <i class="material-icons">cloud_upload</i>
        Upload
      </router-link>
    </div>
    <DataTable :data="data"></DataTable>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DataTable from "@/components/DataTable.vue";

export default Vue.extend({
  name: "Reports",
  components: {
    DataTable
  },
  data() {
    return {
      data: {
        uniqueColumn: "ID",
        records: [
          {
            ID: "1",
            name: "Test Report",
            uploadDate: new Date().toLocaleString()
          }
        ],
        columns: [
          {
            id: "ID",
            title: "ID",
            visible: false
          },
          {
            id: "name",
            title: "Report"
          },
          {
            id: "uploadDate",
            title: "Uploaded"
          }
        ],
        options: {
          canEdit: true,
          canDelete: true
        }
      }
    };
  }
});
</script>

<style lang="scss">
a.icon-link {
  align-self: center;
  padding: 10px;
  color: white;
  background-color: rgb(14, 14, 250);
  border-radius: 5px;
}
</style>
