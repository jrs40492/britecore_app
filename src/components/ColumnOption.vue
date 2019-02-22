<template>
  <div class="column-options">
    <h3 class="field-name">{{ field }}</h3>
    <div class="text-input">
      <label :for="field + 'Name'">Name:</label>
      <input
        type="text"
        :for="field + 'Name'"
        data-type="text"
        :data-field="field"
        :value="data.name || field"
        name="name"
        :data-db-key="dbKey"
      >
    </div>
    <div class="select-input">
      <label :for="field + 'Type'">Data Type:</label>
      <select
        name="type"
        :id="field + 'Type'"
        :data-field="field"
        data-type="text"
        :data-db-key="dbKey"
      >
        <option
          v-for="(option, index) in typeOptions"
          :key="index"
          :value="option.value"
          :selected="data.type === option.value"
        >{{ option.title }}</option>
      </select>
    </div>
    <div class="text-input">
      <label :for="field + 'Order'">Order:</label>
      <input
        type="number"
        :for="field + 'Order'"
        data-type="number"
        :data-field="field"
        :value="data.order || index+1"
        name="order"
        :data-db-key="dbKey"
      >
    </div>
    <div class="checkbox-input">
      <label :for="field + 'Visible'">Show Column?</label>
      <input
        type="checkbox"
        name="visible"
        :id="field + 'Visible'"
        :data-field="field"
        data-type="bool"
        :checked="data.visible || true ? true : false"
        :data-db-key="dbKey"
      >
    </div>
    <div class="checkbox-input">
      <label :for="field + 'Visible'">Filterable?</label>
      <input
        type="checkbox"
        name="canFilter"
        :id="field + 'Filter'"
        :data-field="field"
        data-type="bool"
        :checked="data.canFilter || true ? true : false"
        :data-db-key="dbKey"
      >
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "ColumnOption",
  props: { field: String, index: Number, data: Object, dbKey: String },
  data() {
    return {
      typeOptions: [
        { value: "string", title: "String" },
        {
          value: "date",
          title: "Date"
        },
        {
          value: "number",
          title: "Number"
        },
        {
          value: "currency",
          title: "Currency"
        }
      ]
    };
  }
});
</script>

<style lang="scss">
@import "@/styles/global.scss";

.column-options {
  padding: 10px 0;
  border-top: 1px solid $border;

  .field-name {
    text-align: center;
  }

  .text-input,
  .date-input,
  .number-input,
  .checkbox-input,
  .select-input {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>

