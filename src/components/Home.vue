<template>
  <div class="grid grid-cell span-12-xs">
    <h1 class="grid-cell span-12-xs">{{ msg }}</h1>
    <div class="card grid-cell span-12-xs span-4-md">
      <div class="card-header">Description</div>
      <div class="card-body">
        <p>
          This website was created in order to showcase my ability to build a
          data table from scratch for a job application. The following user
          stories and requirements had to be met in order to fulfill the
          challenge:
        </p>
        <div class="card-body-header">User Stories:</div>
        <ul>
          <li>
            As a payment supervisor, I would like to be able to view recent
            payments logged in the system, so that I can understand all the
            transactions that have been made.
          </li>
          <li>
            As a payment supervisor, I would like to be able to edit the
            descriptions of recent payments easily, so that others can clearly
            understand why a payment was made.
          </li>
        </ul>
        <div class="card-body-header">Requirements:</div>
        <ul>
          <li>Use Vue.js.</li>
          <li>Include tests for the data table component.</li>
          <li>Implement Vuex with a backend persistence store of my choice.</li>
          <li>
            Data Table must be an original creation and not from a 3rd party.
          </li>
          <li>Demonstration of UI/UX polish and skill.</li>
        </ul>
        <p>
          As this was my first time using Vue.js, I decided against using any
          third party Vue.js components or libraries. I wanted to learn as much
          about basic Vue as I could and not complicate it with some potentially
          unnecessary or overly complicated add-ons.
        </p>
      </div>
    </div>
    <div class="card grid-cell span-12-xs span-4-md">
      <div class="card-header">Additional Features</div>
      <div class="card-body">
        <p>
          On top of the user stories and requirements listed, I decided to add
          the following features to make my data table as dynamic as possible.
        </p>
        <ul>
          <li>
            Ability to upload any CSV and have it display as a data table. (CSV
            must contain a header row).
          </li>
          <li>
            Dynamic columns with the option to change the column name, order,
            data type, visibility, and filtering.
          </li>
          <li>
            Full report and record edit screens that allow you to edit any
            field, not just the description.
          </li>
          <li>
            Ability to combine all filters to see only the records that are
            important to you.
          </li>
        </ul>
      </div>
    </div>
    <div class="card grid-cell span-12-xs span-4-md">
      <div class="card-header">Ideas</div>
      <div class="card-body">
        Here are a few other ideas that I want to implement on the site and data
        table component. I may come back to this project and add them at a later
        time.
        <ul>
          <li>Ability to delete/bulk delete reports and records.</li>
          <li>
            User authentication and roles (The main reason why the ability to
            delete wasn't added).
          </li>
          <li>
            More data types such as e-mail, phone number, and address with the
            appropriate actions for each.
          </li>
          <li>
            A worker service to process the CSV file. Currently it's done on the
            main thread and could become blocking.
          </li>
          <li>
            UI/UX enhancements such as more color, animations, loaders, and make
            it fully responsive.
          </li>
          <li>User accessibility.</li>
          <li>
            Ability to instantly show/hide columns and allow them to be
            rearranged via drag and drop.
          </li>
          <li>Drag and drop funtionality for the file upload.</li>
          <li>Accept more file types such as JSON and XML.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'HelloWorld',
  props: {
    msg: String
  }
});
</script>

<style lang="scss">
h1 {
  text-align: center;
}
</style>
