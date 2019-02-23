<template>
  <div id="reports" class="grid grid-cell span-12-xs">
    <ActionBar :actions="actions"></ActionBar>
    <DataTable v-bind:data="data"></DataTable>
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
  mounted() {
    this.getReports();
  },
  data() {
    return {
      data: {
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
              visible: true,
              canFilter: true
            }
          },
          {
            id: "createdOn",
            data: {
              id: "createdOn",
              name: "Created",
              type: "date",
              visible: true,
              canFilter: true
            }
          }
        ],
        options: {
          canEdit: true,
          canDelete: true
        }
      },
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
