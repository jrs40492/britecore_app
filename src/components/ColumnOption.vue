<template>
  <div id="column-option">
    <div class="select-input">
      <label :for="field + 'Select'">{{ field }}</label>
      <select name="type" :id="field + 'Select'" :data-field="field">
        <option value="text">String</option>
        <option value="date">Date</option>
        <option value="number">Number</option>
        <option value="currency">Currency</option>
      </select>
    </div>
    <div class="checkbox-input">
      <label :for="field + 'Checkbox'">Visible?</label>
      <input type="checkbox" name="visible" :id="field + 'Checkbox'" :data-field="field">
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ColumnOption",
  props: {
    field: String
  }
});
</script>

<style lang="sass">

</style>

