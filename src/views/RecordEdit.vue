<template>
  <div id="report-edit" class="grid-cell span-12-xs">
    <ActionBar :actions="actions"></ActionBar>
    <div class="card">
      <div class="card-header">Record Settings</div>
      <div class="card-body">
        <div v-for="(column, index) in columns" :key="index">
          <div class="text-input">
            <label :for="index">{{ column.data.name }}</label>
            <input v-if="column.data.type === 'string'" type="text" v-model="data[column.data.id]">
            <input
              v-else-if="column.data.type === 'date'"
              type="datetime-local"
              :value="formatDate(data[column.data.id])"
            >
            <input
              v-else-if="column.data.type === 'currency' || column.data.type === 'number'"
              type="number"
              v-model.number="data[column.data.id]"
            >
          </div>
        </div>
      </div>
      <div class="card-footer">
        <input type="submit" value="Save" class="button" @click="save">
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import firebase from "firebase";
import ActionBar from "@/components/ActionBar.vue";

export default Vue.extend({
  name: "recordEdit",
  components: {
    ActionBar
  },
  data() {
    return {
      columns: [],
      data: [],
      actions: [
        {
          type: "back",
          align: "left"
        }
      ]
    };
  },
  created() {
    this.getColumns();
    this.getData();
  },
  methods: {
    getReportSettings() {
      this.$store.state.db
        .collection("reports")
        .doc(this.$route.params.reportId)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.columns.push({
              id: doc.id,
              data: doc.data()
            });
          });
        });
    },
    getColumns() {
      this.$store.state.db
        .collection("reports")
        .doc(this.$route.params.reportId)
        .collection("columns")
        .orderBy("order", "asc")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.columns.push({
              id: doc.id,
              data: doc.data()
            });
          });
        });
    },
    getData() {
      this.$store.state.db
        .collection("reports")
        .doc(this.$route.params.reportId)
        .collection("records")
        .doc(this.$route.params.recordId)
        .get()
        .then(doc => {
          if (doc.exists) {
            this.data = doc.data();
          } else {
            // TODO: Properly handle error
            console.log("Document doesn't exist");
          }
        });
    },
    save() {
      this.$store.state.db
        .collection("reports")
        .doc(this.$route.params.reportId)
        .collection("records")
        .doc(this.$route.params.recordId)
        .set(this.data, { merge: true })
        .then(this.$router.go(-1));
    }
  }
});
</script>
