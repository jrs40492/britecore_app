<template>
  <div id="report-upload-wrapper" class="grid grid-cell span-12-xs">
    <ActionBar :actions="actions"></ActionBar>
    <div id="column-options-wrapper" class="card grid-cell span-12-xs">
      <div class="card-header">Report Settings</div>
      <div class="card-body">
        <form
          @submit.prevent="processReportSettings"
          id="column-options-form"
          v-if="columns.length > 0"
        >
        <h3 class="header">General</h3>
          <div class="text-input">
            <label for="reportTitle">Report Title</label>
            <input type="text" name="reportTitle" id="reportTitle" :value="settings.name">
          </div>
          <div class="checkbox-input">
            <label for="canEdit">Data Editable?</label>
            <input
              type="checkbox"
              name="canEdit"
              id="canEdit"
              data-type="bool"
              :checked="settings.options.canEdit"
            >
          </div>
          <div class="checkbox-input">
            <label for="canDelete">Data Deletable?</label>
            <input
              type="checkbox"
              name="canDelete"
              id="canDelete"
              data-type="bool"
              :checked="settings.options.canDelete"
            >
          </div>
          <ColumnOption
            v-for="(column, index) in columns"
            :key="index"
            :field="column.id"
            :data="column"
            :dbKey="column.uniqueId"
            :index="index"
          ></ColumnOption>
          <button type="submit" value="Save">Save</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import ColumnOption from '@/components/ColumnOption.vue';
import ActionBar from '@/components/ActionBar.vue';

export default Vue.extend({
  name: 'reportEdit',
  components: {
    ColumnOption,
    ActionBar,
  },
  data() {
    return {
      actions: [
        {
          type: 'back',
          align: 'left',
        },
      ],
    };
  },
  created() {
    this.$store.dispatch(
      'reports/getReportSettings',
      this.$route.params.reportId,
    );
    this.$store.dispatch(
      'reports/getReportColumns',
      this.$route.params.reportId,
    );
  },
  computed: {
    columns() {
      return this.$store.state.reports.report.columns;
    },
    settings() {
      return this.$store.state.reports.report.settings;
    },
  },
  methods: {
    processReportSettings(event) {
      const { elements } = event.target;

      // Get the report title out of the elements
      const reportTitle = elements.namedItem('reportTitle').value;
      const canEdit = elements.namedItem('canEdit').checked;
      const canDelete = elements.namedItem('canDelete').checked;

      if (!reportTitle) {
        return;
      }

      Promise.all([...elements].map(this.processColumnSetting))
        .then((columnSettings) => {
          const promises = new Promise((resolve) => {
            const columns = [];

            columnSettings.forEach((setting) => {
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
            .then((cols) => {
              const columns = [];
              const keys = Object.keys(cols);
              keys.forEach((key) => {
                const settings = cols[key];
                settings.id = key;
                settings.name = key;
                columns.push(settings);
              });
              return columns;
            })
            .then((columns) => {
              const reportInfo = {
                name: reportTitle,
                reportId: this.$route.params.reportId,
                options: {
                  canEdit,
                  canDelete,
                },
                columns,
              };

              this.$store
                .dispatch('reports/updateReport', reportInfo)
                .then(() => {
                  this.$router.go(-1);
                });
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
        const dbKey = element.getAttribute('data-db-key');

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
          dbKey,
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
