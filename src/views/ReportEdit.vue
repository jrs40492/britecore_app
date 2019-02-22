<template>
  <div id="report-upload-wrapper">
    <div id="column-options-wrapper">
      <h3>Report Settings</h3>
      <form
        @submit.prevent="processReportSettings"
        id="column-options-form"
        v-if="columns.length > 0"
      >
        <div class="text-input">
          <label for="reportTitle">Report Title</label>
          <input type="text" name="reportTitle" id="reportTitle" :value="info.name">
        </div>
        <div class="checkbox-input">
          <label for="canEdit">Data Editable?</label>
          <input
            type="checkbox"
            name="canEdit"
            id="canEdit"
            data-type="bool"
            :checked="info.settings.canEdit"
          >
        </div>
        <div class="checkbox-input">
          <label for="canDelete">Data Deletable?</label>
          <input
            type="checkbox"
            name="canDelete"
            id="canDelete"
            data-type="bool"
            :checked="info.settings.canDelete"
          >
        </div>
        <ColumnOption
          v-for="(column, index) in columns"
          :key="index"
          :field="column.data.id"
          :data="column.data"
          :dbKey="column.id"
          :index="index"
        ></ColumnOption>
        <input type="submit" value="Save">
      </form>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import Vue from "vue";
import firebase from "firebase";
import ColumnOption from "@/components/ColumnOption.vue";

export default Vue.extend({
  name: "reportEdit",
  components: {
    ColumnOption
  },
  data() {
    return {
      info: [],
      columns: []
    };
  },
  created() {
    this.getInfo();
    this.getColumns();
  },
  methods: {
    processReportSettings(event) {
      const elements = event.target.elements;

      // Get the report title out of the elements
      const reportTitle = elements.namedItem("reportTitle").value;
      const canEdit =
        elements.namedItem("canEdit").value === "on" ? true : false;
      const canDelete =
        elements.namedItem("canDelete").value === "on" ? true : false;

      if (!reportTitle) {
        return;
      }

      const db = this.$store.state.db;
      const reportsRef = db
        .collection("reports")
        .doc(this.$route.params.reportId);
      const batch = db.batch();

      const reportInfo = {
        name: reportTitle,
        updatedOn: firebase.firestore.Timestamp.now(),
        settings: {
          canEdit,
          canDelete
        }
      };

      batch.set(reportsRef, reportInfo, { merge: true });

      Promise.all([...elements].map(this.processColumnSetting))
        .then(columnSettings => {
          const promises = new Promise((resolve, reject) => {
            const columns = [];

            columnSettings.forEach((setting, index) => {
              if (setting) {
                if (!columns[setting.field]) {
                  columns[setting.field] = {};
                }

                columns[setting.field][setting.type] = setting.value;
                columns[setting.field].dbKey = setting.dbKey;
              }

              resolve(columns);
            });
          });

          promises
            .then(columns => {
              for (const key in columns) {
                const settings = columns[key];
                settings.id = key;
                settings.name = key;
                console.log(settings);
                let columnRef = reportsRef
                  .collection("columns")
                  .doc(settings.dbKey);
                batch.set(columnRef, settings);
              }
              return;
            })
            .then(() => {
              batch.commit();
            });
        })
        .catch(err => {
          // TODO: Properly handle errors
          console.log(err);
        });
    },
    processColumnSetting(element) {
      return new Promise((resolve, reject) => {
        // Get the field/column name to group settings based on column
        const field = element.getAttribute("data-field");

        // Skip any fields that don't have data-field
        if (!field) {
          resolve();
          return;
        }

        // Get type to convert values (Bools)
        const type = element.getAttribute("data-type");
        const dbKey = element.getAttribute("data-db-key");

        let value;

        switch (type) {
          case "bool":
            value = element.checked;
            break;
          default:
            value = element.value;
            break;
        }

        const settings = {
          dbKey,
          field,
          type: element.name,
          value
        };

        resolve(settings);
      });
    },
    getInfo(callback) {
      this.$store.state.db
        .collection("reports")
        .doc(this.$route.params.reportId)
        .get()
        .then(doc => {
          if (doc.exists) {
            this.info = doc.data();
          } else {
            // TODO: Properly handle error
            console.log("Document doesn't exist");
          }
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
    }
  }
});
</script>

<style lang="scss">
@import "@/styles/global.scss";
</style>
