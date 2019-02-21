<template>
  <div id="column-option">
    <h3>{{ field }}</h3>
    <div class="text-input">
      <label :for="field + 'Name'">Name:</label>
      <input type="text" :for="field + 'Name'" data-type="text" :value="field">
    </div>
    <div class="select-input">
      <label :for="field + 'Type'">Data Type:</label>
      <select name="type" :id="field + 'Type'" :data-field="field" data-type="text">
        <option value="text">String</option>
        <option value="date">Date</option>
        <option value="number">Number</option>
        <option value="currency">Currency</option>
      </select>
    </div>
    <div class="text-input">
      <label :for="field + 'Order'">Order:</label>
      <input type="number" :for="field + 'Order'" data-type="number" :value="index+1">
    </div>
    <div class="checkbox-input">
      <label :for="field + 'Visible'">Visible?</label>
      <input
        type="checkbox"
        name="visible"
        :id="field + 'Visible'"
        :data-field="field"
        data-type="bool"
        checked
      >
    </div>
    <div class="checkbox-input">
      <label :for="field + 'Visible'">Filterable?</label>
      <input
        type="checkbox"
        name="filter"
        :id="field + 'Filter'"
        :data-field="field"
        data-type="bool"
        checked
      >
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "ColumnOption",
  props: ["field", "index"]
});
</script>

<style lang="sass">
@import "@/styles/global.scss";

</style>

