<template>
  <div id="upload-report-wrapper">
    <div class="file-input">
      <label for="report-upload">Upload report (CSV)</label>
      <input
        id="report-upload"
        type="file"
        title="Upload Report (CSV)"
        @change="processFile($event)"
      >
    </div>
    <button @click="upload">Upload</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase";
import papa from "papaparse";

export default Vue.extend({
  name: "reportupload",
  data() {
    return {
      file: [],
      fileResults: {} as papa.ParseResult
    };
  },
  methods: {
    processFile(event: any) {
      const file = event.target.files[0];

      papa.parse(file, {
        delimiter: ",",
        header: true,
        // step: record => {
        //   console.log(record);
        // },
        complete: (results, file) => {
          if (results.errors) {
            // TODO: Implement error logging and display to user
            return;
          }

          this.fileResults = results;
        }
      });
    },
    upload() {
      const fileData = this.fileResults.data;

      const db = this.$store.state.db;
      const reportsRef = db.collection("reports").doc("test");

      fileData.forEach(record => {
        reportsRef.
      })
      console.log(3, this.fileResults);
    }
  }
});
</script>
