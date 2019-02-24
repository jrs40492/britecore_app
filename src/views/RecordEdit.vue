<template>
  <div id="report-edit" class="grid-cell span-12-xs">
    <ActionBar :actions="actions"></ActionBar>
    <div class="card">
      <div class="card-header">Record Settings</div>
      <div class="card-body">
        <div v-for="(column, index) in columns" :key="index">
          <div class="text-input">
            <label :for="index">{{ column.name }}</label>
            <input v-if="column.type === 'string'" type="text" v-model="record[column.id]">
            <input
              v-else-if="column.type === 'date'"
              type="datetime-local"
              :value="formatDate(record[column.id], true)"
            >
            <input
              v-else-if="column.type === 'currency' || column.type === 'number'"
              type="number"
              v-model.number="record[column.id]"
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
import ActionBar from "@/components/ActionBar.vue";

export default Vue.extend({
  name: "recordEdit",
  components: {
    ActionBar
  },
  data() {
    return {
      actions: [
        {
          type: "back",
          align: "left"
        }
      ]
    };
  },
  created() {
    this.$store.dispatch("report/getColumns", this.$route.params.reportId);
    this.$store.dispatch("record/getRecord", {
      reportId: this.$route.params.reportId,
      recordId: this.$route.params.recordId
    });
  },
  computed: {
    columns() {
      return this.$store.state.report.columns;
    },
    record() {
      return this.$store.state.record.record;
    }
  },
  methods: {
    save() {
      this.$store
        .dispatch("record/update", {
          reportId: this.$route.params.reportId,
          recordId: this.$route.params.recordId,
          record: this.record
        })
        .then(this.$router.go(-1));
    }
  }
});
</script>
