<template>
  <div class="data-table-page grid grid-cell span-12-xs">
    <div class="card grid-cell span-12-xs span-3-lg">
      <div class="card-header">Filters</div>
      <div class="card-body">
        <div
          class="filter"
          v-for="(column, colIndex) in data.columns.filter(x => x.data.canFilter && x.data.visible)"
          :key="colIndex"
        >
          <div v-if="column.data.type === 'currency' || column.data.type === 'number'">
            <div class="number-input">
              <label :for="column.data.id + 'Min'">Min {{ column.data.name }}:</label>
              <input
                type="number"
                placeholder="0"
                :id="column.data.id + 'Min'"
                :v-model="column.data.id"
                @input="applyFilter('number', $event.target.value, column.data.id, 'min')"
              >
            </div>
            <div class="number-input">
              <label :for="column.data.id + 'Max'">Max {{ column.data.name }}:</label>
              <input
                type="number"
                placeholder="1000"
                :id="column.data.id + 'Max'"
                :v-model="column.data.id"
                @input="applyFilter('number', $event.target.value, column.data.id, 'max')"
              >
            </div>
          </div>
          <div v-else-if="column.data.type === 'date'">
            <div class="date-input">
              <label :for="column.data.id + 'StartDate'">Start {{ column.data.name }}:</label>
              <input
                type="date"
                :id="column.data.id + 'StartDate'"
                name="Start Date"
                @input="applyFilter('date', $event.target.value, column.data.id, 'start')"
                :v-model="column.data.id"
              >
            </div>
            <div class="date-input">
              <label :for="column.data.id + 'EndDate'">End {{ column.data.name }}:</label>
              <input
                type="date"
                :id="column.data.id + 'EndDate'"
                name="End Date"
                @input="applyFilter('date', $event.target.value, column.data.id, 'end')"
                :v-model="column.data.id"
              >
            </div>
          </div>
          <div v-else>
            <div class="text-input">
              <label :for="column.data.id + 'Filter'">{{ column.data.name }}</label>
              <input
                type="text"
                :id="column.data.id + 'Filter'"
                :placeholder="column.data.name"
                @input="applyFilter('text', $event.target.value, column.data.id)"
                :v-model="column.data.id"
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="data-table-wrapper grid-cell span-12-xs span-9-lg">
      <table class="data-table">
        <thead>
          <tr>
            <th
              v-for="(column, colIndex) in data.columns.filter(x => x.data.visible)"
              :key="colIndex"
              @click="sort(column)"
              class="sortable"
            >
              {{ column.data.name }}
              <template v-if="currentSort === column.data.name">
                <i class="material-icons" v-if="column.data.sort_direction === 'asc'">arrow_drop_up</i>
                <i class="material-icons" v-else>arrow_drop_down</i>
              </template>
            </th>
            <th v-if="data.options.canEdit">Edit</th>
            <th v-if="data.options.canDelete">Delete</th>
          </tr>
        </thead>
        <tbody v-if="records">
          <tr v-for="record in records" :key="record.id">
            <template v-for="(column, colIndex) in data.columns.filter(x => x.data.visible)">
              <td
                v-if="column.data.type === 'date'"
                :key="colIndex"
              >{{ formatDate(record.data[column.data.id]) }}</td>
              <td v-else-if="column.data.type ==='link'" :key="colIndex">
                <router-link :to="record.id" append>{{ record.data[column.data.id] }}</router-link>
              </td>
              <td
                v-else-if="column.data.type === 'currency'"
                :class="record.data[column.data.id] < 0 ? 'negative' : ''"
                class="number"
                :key="colIndex"
              >{{ formatCurrency(record.data[column.data.id]) }}</td>
              <td v-else :key="colIndex">{{ record.data[column.data.id] }}</td>
            </template>
            <td v-if="data.options.canEdit" class="icon-cell">
              <router-link :to="record.id + '/edit'" append>
                <i class="material-icons">edit</i>
              </router-link>
            </td>
            <td v-if="data.options.canDelete" class="icon-cell">
              <i class="material-icons delete">delete</i>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr :colspan="records.length">There are no records to display!</tr>
        </tbody>
      </table>
      <div class="pagination" v-if="pagination.totalPages > 1">
        <div :class="pagination.currentPage === 1 ? 'active' : ''" @click="navigate(1)">1</div>
        <div v-if="pagination.startEllipsis" class="ellipsis start">...</div>
        <div
          v-for="page in pagination.range"
          :key="page"
          :class="pagination.currentPage === page ? 'active' : ''"
          @click="navigate(page)"
        >{{ page }}</div>
        <div v-if="pagination.endEllipsis" class="ellipsis end">...</div>
        <div
          :class="pagination.currentPage === pagination.totalPages ? 'active' : ''"
          @click="navigate(pagination.totalPages)"
        >{{ pagination.totalPages }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import Vue from "vue";

export default Vue.extend({
  name: "DataTable",
  props: ["data"],
  data() {
    return {
      allRecords: [],
      filteredRecords: [],
      records: [],
      activeFilters: {},
      currentSort: "",
      pagination: {
        limit: 10,
        currentPage: 1,
        totalPages: 0,
        startEllipsis: false,
        endEllipsis: false,
        range: _.range(1, 1)
      }
    };
  },
  mounted() {
    this.setData();
  },
  watch: {
    "data.records": function(val) {
      this.setData(val);
    }
  },
  methods: {
    setData(data) {
      if ((this.data && this.data.records) || data) {
        this.allRecords = this.filteredRecords = data || this.data.records;

        this.updatePagination();
      }
    },
    updatePagination() {
      this.pagination.startEllipsis = false;
      this.pagination.endEllipsis = false;

      this.pagination.limit = 10;
      this.pagination.totalPages = Math.ceil(
        this.filteredRecords.length / this.pagination.limit
      );

      let start = 2;
      let end = this.pagination.totalPages;

      if (this.pagination.currentPage - 2 > 2) {
        start = this.pagination.currentPage - 2;
        this.pagination.startEllipsis = true;
      }

      if (this.pagination.currentPage + 2 < this.pagination.totalPages) {
        end = this.pagination.currentPage + 3;
      }

      if (end !== this.pagination.totalPages) {
        this.pagination.endEllipsis = true;
      }

      this.pagination.range = _.range(start, end);

      this.getData();
    },
    navigate(page) {
      this.pagination.currentPage = page;
      this.updatePagination();
    },
    applyFilter(type, value, id, version = "") {
      // Generate unique ID to track active filters
      const uniqueId = `${id}${type}${version}`;

      // Check if the filter already exists
      if (
        _.find(this.activeFilters, function(x, index) {
          return index === uniqueId;
        })
      ) {
        if (!value) {
          // Value was cleared so remove filter
          _.unset(this.activeFilters, uniqueId);
        } else {
          // Update filter to have new value
          this.activeFilters[uniqueId].value = value;
        }
      } else {
        // Add new filter
        this.activeFilters[uniqueId] = {
          type,
          value,
          columnId: id,
          version
        };
      }

      console.log(this.activeFilters);

      // Reset filtered records back to entire list
      this.filteredRecords = this.allRecords;

      const filterKeys = Object.keys(this.activeFilters);

      // If all filters have been removed, reset page to 1
      if (filterKeys.length === 0) {
        this.navigate(1);
        return;
      }

      // Loop through all active filters to get data set
      filterKeys.forEach(key => {
        const filter = this.activeFilters[key];
        switch (filter.type) {
          case "date":
            this.dateFilter(filter.value, filter.columnId, filter.version);
            break;
          case "text":
            this.textFilter(filter.value, filter.columnId);
            break;
          case "number":
            this.numberFilter(filter.value, filter.columnId, filter.version);
            break;
          default:
            break;
        }
      });
    },
    dateFilter(value, columnId, type) {
      const filterDate = new Date(value).setHours(0, 0, 0, 0);
      this.filteredRecords = this.filteredRecords.filter(x => {
        if (type === "start") {
          return new Date(x.data[columnId]).setHours(0, 0, 0, 0) >= filterDate;
        } else {
          return new Date(x.data[columnId]).setHours(0, 0, 0, 0) <= filterDate;
        }
      });
      this.navigate(1);
    },
    textFilter(value, columnId) {
      this.filteredRecords = this.filteredRecords.filter(x =>
        new RegExp(value, "i").test(x.data[columnId])
      );
      this.navigate(1);
    },
    numberFilter(value, columnId, type) {
      const numValue = parseFloat(value);

      this.filteredRecords = this.filteredRecords.filter(x => {
        if (type === "min") {
          return x.data[columnId] >= numValue;
        } else {
          return x.data[columnId] <= numValue;
        }
      });
      this.navigate(1);
    },
    sort(column) {
      column.data.sort_direction =
        column.data.sort_direction === "asc" ? "desc" : "asc";
      this.currentSort = column.data.id;
      this.filteredRecords = _.orderBy(
        this.filteredRecords,
        function(e) {
          return e.data[column.data.id];
        },
        column.data.sort_direction
      );
      this.getData();
    },
    getData() {
      const start = (this.pagination.currentPage - 1) * this.pagination.limit;
      const end =
        (this.pagination.currentPage - 1) * this.pagination.limit +
        this.pagination.limit;
      this.records = this.filteredRecords.slice(start, end || -1);
    }
  }
});
</script>

<style lang="scss">
@import "@/styles/_variables.scss";

.data-table-page {
  .filters {
    h2 {
      text-align: center;
    }

    .filter {
      margin: 0 10px 0 0;
    }
  }

  .data-table-wrapper {
    .data-table,
    .pagination {
      width: 100%;
      width: 100%;
    }
  }
}
</style>
