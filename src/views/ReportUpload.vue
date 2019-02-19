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
        <ColumnOption v-for="(column, colIndex) in columns" :key="colIndex" :field="column"></ColumnOption>
        <input type="submit" value="Upload">
      </form>
    </div>
  </div>
</template>

<script lang="ts">
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
      columns: [] as string[],
      fileResults: {} as papa.ParseResult,
      batchedSettings: [] as any
    };
  },
  methods: {
    checkFile(event: any) {
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
    processReportSettings(event: any) {
      const elements = event.target.elements;
      const fileData = this.fileResults.data;

      // Get the report title out of the elements
      const reportTitle = elements.namedItem("reportTitle").value;

      if (!reportTitle) {
        return;
      }

      const db = this.$store.state.db;
      const reportsRef = db.collection("reports").doc(reportTitle);
      const batch = db.batch();

      fileData.forEach(record => {
        let recordRef = reportsRef.collection("records").doc();
        batch.set(recordRef, record);
      });

      Promise.all([...elements].map(this.processColumnSetting))
        .then(results => {
          //batch.commit();
        })
        .then((results: any) => {
          console.log(2, results);
          for (let result of results) {
            // results.forEach((result: any, index: number) => {
            console.log(3, result);
            // let columnRef = reportsRef.collection("records").doc(key);
          }
        })
        .catch(err => {
          // TODO: Properly handle errors
          console.log(err);
        });
    },
    processColumnSetting(element: any) {
      return new Promise((resolve, reject) => {
        const field = element.getAttribute("data-field");

        // Skip any fields that don't have data-field
        if (!field) {
          resolve();
          return;
        }

        const settings = {
          field,
          name: element.name,
          value: element.value
        };

        resolve(settings);
      });
    }
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
