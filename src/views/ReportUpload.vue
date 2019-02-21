<template>
  <div id="report-upload-wrapper">
    <div id="file-upload-wrapper">
      <h3>Instructions:</h3>
      <p>
        Click the button below to upload a CSV file. The file must contain the headers in the first row in order
        to function properly.
      </p>
      <div class="file-input">
        <label for="report-upload">Upload report (CSV)</label>
        <input
          id="report-upload"
          type="file"
          title="Upload Report (CSV)"
          @change="checkFile($event)"
        >
      </div>
    </div>

    <div id="column-options-wrapper">
      <h3>Report Settings</h3>
      <form
        @submit.prevent="processReportSettings"
        id="column-options-form"
        v-if="columns.length > 0"
      >
        <div class="text-input">
          <label for="reportTitle">Report Title</label>
          <input type="text" name="reportTitle" id="reportTitle">
        </div>
        <div class="text-input">
          <label for="uniqueColumn">Unique Column:</label>
          <select name="uniqueColumn" id="uniqueColumn">
            <option
              v-for="(column, colIndex) in columns"
              :key="colIndex"
              :value="column"
            >{{ column }}</option>
          </select>
        </div>
        <div class="checkbox-input">
          <label :for="field + 'Editable'">Data Editable?</label>
          <input
            type="checkbox"
            name="editable"
            :id="field + 'Editable'"
            data-field="canEdit"
            data-type="bool"
            checked
          >
        </div>
        <div class="checkbox-input">
          <label :for="field + 'Editable'">Data Deletable?</label>
          <input
            type="checkbox"
            name="deletable"
            :id="field + 'Deletable'"
            data-field="canDelete"
            data-type="bool"
          >
        </div>
        <ColumnOption
          v-for="(column, index) in columns"
          :key="index"
          :field="column"
          :index="index"
        ></ColumnOption>
        <input type="submit" value="Upload">
      </form>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import uuidv4 from "uuid/v4";
import Vue from "vue";
import firebase from "firebase";
import papa from "papaparse";
import ColumnOption from "@/components/ColumnOption.vue";

export default Vue.extend({
  name: "reportupload",
  components: {
    ColumnOption
  },
  data() {
    return {
      columns: [],
      fileResults: {},
      batchedSettings: []
    };
  },
  methods: {
    checkFile(event) {
      const file = event.target.files[0];

      papa.parse(file, {
        delimiter: ",",
        header: true,
        complete: (results, file) => {
          if (results.errors.length > 0) {
            // TODO: Implement error logging and display to user
            return;
          }

          // Get column headers to display report settings
          if (results.meta.fields.length > 0) {
            this.columns = results.meta.fields;
          }

          // Set results to be accessible in other methods
          this.fileResults = results;
        }
      });
    },
    processReportSettings(event) {
      const elements = event.target.elements;
      const fileData = this.fileResults.data;

      // Get the report title out of the elements
      const reportTitle = elements.namedItem("reportTitle").value;
      const uniqueColumn = elements.namedItem("uniqueColumn").value;

      if (!reportTitle) {
        return;
      }

      const db = this.$store.state.db;
      const reportsRef = db.collection("reports").doc();
      const batch = db.batch();

      const reportInfo = {
        id: uuidv4(),
        name: reportTitle,
        createdOn: firebase.firestore.Timestamp.now(),
        settings: {
          uniqueColumn
        }
      };

      batch.set(reportsRef, reportInfo);

      fileData.forEach(record => {
        let recordRef = reportsRef.collection("records").doc();
        batch.set(recordRef, record);
      });

      Promise.all([...elements].map(this.processColumnSetting))
        .then(columnSettings => {
          const promises = new Promise((resolve, reject) => {
            const columns = [];
            const count = columnSettings.length;

            columnSettings.forEach((setting, index) => {
              if (setting) {
                if (!columns[setting.field]) {
                  columns[setting.field] = {};
                }

                columns[setting.field][setting.type] = setting.value;
              }

              if (index === count - 1) resolve(columns);
            });
          });

          promises
            .then(columns => {
              for (const key in columns) {
                const settings = columns[key];
                settings.id = key;
                settings.name = key;
                let columnRef = reportsRef.collection("columns").doc();
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
        const field = element.getAttribute("data-field");

        // Skip any fields that don't have data-field
        if (!field) {
          resolve();
          return;
        }

        const settings = {
          field,
          type: element.name,
          value: element.value
        };

        resolve(settings);
      });
    },
    processSetting(setting) {}
  }
});
</script>

<style lang="scss">
@import "@/styles/global.scss";

#report-upload-wrapper {
  display: flex;
  flex-wrap: wrap;

  #file-upload-wrapper,
  #column-options-wrapper {
    flex: 0 1 50%;
    padding: 25px;
  }
}
</style>
