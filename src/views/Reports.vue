<template>
  <div id="reports">
    <div class="reports-nav">
      <router-link to="upload" class="icon-link" append>
        <i class="material-icons">cloud_upload</i>
        Upload
      </router-link>
    </div>
    <DataTable v-bind:data="data"></DataTable>
  </div>
</template>

<script>
import Vue from "vue";
import DataTable from "@/components/DataTable.vue";

export default Vue.extend({
  name: "Reports",
  components: {
    DataTable
  },
  mounted() {
    this.getReports();
  },
  data() {
    return {
      data: {
        uniqueColumn: "id",
        records: [],
        columns: [
          {
            id: "id",
            data: {
              id: "id",
              name: "ID",
              visible: false
            }
          },
          {
            id: "name",
            data: {
              id: "name",
              name: "Report",
              type: "link",
              visible: true
            }
          },
          {
            id: "createdOn",
            data: {
              id: "createdOn",
              name: "Created",
              type: "date",
              visible: true
            }
          }
        ],
        options: {
          canEdit: true,
          canDelete: true
        }
      }
    };
  },
  methods: {
    getReports() {
      this.$store.state.db
        .collection("reports")
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

<style lang="scss">
@import "@/styles/global.scss";

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
