<template>
  <div class="data-table-page">
    <div class="filters">
      <h2>Filters</h2>
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
              :id="column.data.id + 'Min'"
              :v-model="column.data.id"
              @input="numberFilter($event.target.value, column.data.id, 'min', true)"
            >
          </div>
          <div class="number-input">
            <label :for="column.data.id + 'Max'">Max {{ column.data.name }}:</label>
            <input
              type="number"
              :id="column.data.id + 'Max'"
              :v-model="column.data.id"
              @input="numberFilter($event.target.value, column.data.id, 'max', true)"
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
              @input="dateFilter($event.target.value, column.data.id, 'start', true)"
              :v-model="column.data.id"
            >
          </div>
          <div class="date-input">
            <label :for="column.data.id + 'EndDate'">End {{ column.data.name }}:</label>
            <input
              type="date"
              :id="column.data.id + 'EndDate'"
              name="End Date"
              @input="dateFilter($event.target.value, column.data.id, 'end', true)"
              :v-model="column.data.id"
            >
          </div>
        </div>
        <div v-else>
          <input
            type="text"
            :placeholder="'Filter by ' + column.data.name"
            @input="textFilter($event.target.value, column.data.id, true)"
            :v-model="column.data.id"
          >
        </div>
      </div>
    </div>
    <div class="data-table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th
              v-for="(column, colIndex) in data.columns.filter(x => x.data.visible)"
              :key="colIndex"
              @click="sort(column)"
            >{{ column.data.name }}</th>
            <th v-if="data.options.canEdit">Edit</th>
            <th v-if="data.options.canDelete">Delete</th>
          </tr>
        </thead>
        <tbody v-if="records">
          <tr v-for="record in records" :key="record.id">
            <td
              v-for="(column, colIndex) in data.columns.filter(x => x.data.visible)"
              :key="colIndex"
            >
              <span v-if="column.data.type === 'date'">{{ formatDate(record.data[column.data.id]) }}</span>
              <router-link
                :to="record.id"
                v-else-if="column.data.type ==='link'"
                append
              >{{ record.data[column.data.id] }}</router-link>
              <span
                v-else-if="column.data.type === 'currency'"
                :class="record.data[column.data.id] < 0 ? 'negative' : ''"
              >{{ formatCurrency(record.data[column.data.id]) }}</span>
              <span v-else>{{ record.data[column.data.id] }}</span>
            </td>
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
        <div v-if="pagination.startEllipsis" class="ellipsis">...</div>
        <div
          v-for="page in pagination.range"
          :key="page"
          :class="pagination.currentPage === page ? 'active' : ''"
          @click="navigate(page)"
        >{{ page }}</div>
        <div v-if="pagination.endEllipsis" class="ellipsis">...</div>
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
      let start = 2;
      let end = this.pagination.totalPages;

      this.pagination.startEllipsis = false;
      this.pagination.endEllipsis = false;

      this.pagination.limit = 10;
      this.pagination.totalPages = Math.ceil(
        this.filteredRecords.length / this.pagination.limit
      );

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
    upsertFilter(id, type, params) {
      // Check if the filter already exists
      if (_.find(this.activeFilters, { id })) {
        if (!params.value) {
          // Value was cleared so remove filter
          _.unset(this.activeFilters, id);
        } else {
          // Update filter to have new value
          this.activeFilters[id].params = params;
        }
      } else {
        // Add new filter
        this.activeFilters[id] = {
          id,
          type,
          params
        };
      }

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
            this.dateFilter(
              filter.params.value,
              filter.params.columnId,
              filter.params.type,
              false
            );
            break;
          case "text":
            this.textFilter(filter.params.value, filter.params.columnId, false);
            break;
          case "number":
            this.numberFilter(
              filter.params.value,
              filter.params.columnId,
              filter.params.type,
              false
            );
            break;
          default:
            break;
        }
      });
    },
    dateFilter(value, columnId, type, isNew) {
      if (isNew) {
        // Only upsert filter if it came from user input, not a method
        this.upsertFilter(columnId + type, "date", { value, columnId, type });
        return;
      }

      const filterDate = new Date(value).setHours(0, 0, 0, 0);
      this.filteredRecords = this.filteredRecords.filter(x => {
        if (type === "start") {
          return new Date(x[columnId]).setHours(0, 0, 0, 0) >= filterDate;
        } else {
          return new Date(x[columnId]).setHours(0, 0, 0, 0) <= filterDate;
        }
      });
      this.navigate(1);
    },
    textFilter(value, columnId, isNew) {
      if (isNew) {
        // Only upsert filter if it came from user input, not a method
        this.upsertFilter(columnId, "text", { value, columnId });
        return;
      }

      this.filteredRecords = this.filteredRecords.filter(x =>
        new RegExp(value, "i").test(x[columnId])
      );
      this.navigate(1);
    },
    numberFilter(value, columnId, type, isNew) {
      if (isNew) {
        // Only upsert filter if it came from user input, not a method
        this.upsertFilter(columnId + type, "number", { value, columnId, type });
        return;
      }

      const numValue = parseFloat(value);

      this.filteredRecords = this.filteredRecords.filter(x => {
        if (type === "min") {
          return x[columnId] >= numValue;
        } else {
          return x[columnId] <= numValue;
        }
      });
      this.navigate(1);
    },
    sort(column) {
      column.data.sort_direction =
        column.data.sort_direction === "asc" ? "desc" : "asc";
      this.filteredRecords = _.orderBy(
        this.filteredRecords,
        column.data.id,
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
@import "@/styles/global.scss";

.data-table-page {
  display: flex;
  flex-wrap: wrap;

  .filters {
    flex: 0 1 20%;

    h2 {
      text-align: center;
    }

    .filter {
      margin: 10px;
    }
  }

  .data-table-wrapper {
    flex: 1 0 80%;

    .negative {
      color: red;
    }

    .icon-cell {
      text-align: center;

      .delete {
        color: red;
      }
    }

    .data-table,
    .pagination {
      width: 100%;
      width: 100%;
    }
  }
}
</style>
