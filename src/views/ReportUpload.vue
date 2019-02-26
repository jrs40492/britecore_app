<template>
  <div id="report-upload-wrapper" class="grid grid-cell span-12-xs">
    <ActionBar :actions="actions"></ActionBar>
    <div id="file-upload-wrapper" class="card grid-cell span-12-xs span-6-md">
      <div class="card-header">Instructions:</div>
      <div class="card-body">
        <p>
          Click the button below to upload a CSV file. The file must contain headers in the first row in order
          to function properly.
        </p>
      </div>
      <div class="card-footer">
        <div class="file-input">
          <input type="file" title="Upload Report (CSV)" @change="checkFile($event)">
        </div>
      </div>
    </div>

    <div id="column-options-wrapper" class="card grid-cell span-12-xs span-6-md">
      <div class="card-header">Report Settings</div>
      <div class="card-body">
        <h3 class="header">General</h3>
        <form
          @submit.prevent="processReportSettings"
          id="column-options-form"
          v-if="columns.length > 0"
        >
          <div class="text-input">
            <label for="reportTitle">Report Title *</label>
            <input type="text" name="reportTitle" id="reportTitle" placeholder="Title">
          </div>
          <div class="checkbox-input">
            <label for="canEdit">Data Editable?</label>
            <input type="checkbox" name="canEdit" id="canEdit" data-type="bool" checked>
          </div>
          <div class="checkbox-input">
            <label for="canDelete">Data Deletable?</label>
            <input type="checkbox" name="canDelete" id="canDelete" data-type="bool">
          </div>
          <ColumnOption
            v-for="(column, index) in columns"
            :key="index"
            :field="column"
            :data="{}"
            :index="index"
          ></ColumnOption>
          <button type="submit" value="Upload">Upload</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/firestore';
import papa from 'papaparse';
import ColumnOption from '@/components/ColumnOption.vue';
import ActionBar from '@/components/ActionBar.vue';

export default Vue.extend({
  name: 'reportUpload',
  components: {
    ColumnOption,
    ActionBar,
  },
  data() {
    return {
      columns: [],
      fileResults: {},
      actions: [
        {
          type: 'back',
          align: 'left',
        },
      ],
    };
  },
  methods: {
    checkFile(event) {
      const file = event.target.files[0];

      papa.parse(file, {
        delimiter: ',',
        header: true,
        dynamicTyping: true,
        complete: (results) => {
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
        },
      });
    },
    processReportSettings(event) {
      const { elements } = event.target;
      const fileData = this.fileResults.data;

      // Get the report title out of the elements
      const reportTitle = elements.namedItem('reportTitle').value;

      // Get report settings
      const canEdit = elements.namedItem('canEdit').checked;
      const canDelete = elements.namedItem('canDelete').checked;

      if (!reportTitle) {
        return;
      }

      Promise.all([...elements].map(this.processColumnSetting))
        .then((columnSettings) => {
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

          const finalColumns = [];
          promises
            .then((columns) => {
              console.log(columns);
              for (const key in columns) {
                const settings = columns[key];
                settings.id = key;
                settings.name = key;
                finalColumns.push(settings);
              }
            })
            .then(() => {
              const reportInfo = {
                name: reportTitle,
                options: {
                  canEdit,
                  canDelete,
                },
                records: fileData,
                columns: finalColumns,
              };

              this.$store.dispatch('reports/create', reportInfo);
            });
        })
        .catch((err) => {
          // TODO: Properly handle errors
          console.log(err);
        });
    },
    processColumnSetting(element) {
      return new Promise((resolve) => {
        // Get the field/column name to group settings based on column
        const field = element.getAttribute('data-field');

        // Skip any fields that don't have data-field
        if (!field) {
          resolve();
          return;
        }

        // Get type to convert values (Bools)
        const type = element.getAttribute('data-type');

        let value;

        switch (type) {
          case 'bool':
            value = element.checked;
            break;
          default:
            ({ value } = element);
            break;
        }

        const settings = {
          field,
          type: element.name,
          value,
        };

        resolve(settings);
      });
    },
  },
});
</script>

<style lang="scss">
@import "@/styles/_variables.scss";

.header {
  text-align: center;
  color: $primary-color;
}
</style>
