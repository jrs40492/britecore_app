<template>
  <div class="data-table-page">
    <div class="filters">
      <h2>Filters</h2>
      <div
        class="filter"
        v-for="(column, colIndex) in data.columns.filter(x => x.canFilter)"
        :key="colIndex"
      >
        <div v-if="column.type === 'currency' || column.type === 'number'">
          <div class="number-input">
            <label :for="column.id + 'Min'">Min {{ column.title }}:</label>
            <input
              type="number"
              :id="column.id + 'Min'"
              :v-model="column.id"
              @input="numberFilter($event.target.value, column.id, 'min', true)"
            >
          </div>
          <div class="number-input">
            <label :for="column.id + 'Max'">Max {{ column.title }}:</label>
            <input
              type="number"
              :id="column.id + 'Max'"
              :v-model="column.id"
              @input="numberFilter($event.target.value, column.id, 'max', true)"
            >
          </div>
        </div>
        <div v-else-if="column.type === 'date'">
          <div class="date-input">
            <label :for="column.id + 'StartDate'">Start {{ column.title }}:</label>
            <input
              type="date"
              :id="column.id + 'StartDate'"
              name="Start Date"
              @input="dateFilter($event.target.value, column.id, 'start', true)"
              :v-model="column.id"
            >
          </div>
          <div class="date-input">
            <label :for="column.id + 'EndDate'">End {{ column.title }}:</label>
            <input
              type="date"
              :id="column.id + 'EndDate'"
              name="End Date"
              @input="dateFilter($event.target.value, column.id, 'end', true)"
              :v-model="column.id"
            >
          </div>
        </div>
        <div v-else>
          <input
            type="text"
            :placeholder="'Filter by ' + column.title"
            @input="textFilter($event.target.value, column.id, true)"
            :v-model="column.id"
          >
        </div>
      </div>
    </div>
    <div class="data-table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th
              v-for="(column, colIndex) in data.columns.filter(x => x.visible !== false)"
              :key="colIndex"
              @click="sort(column)"
            >{{ column.title }}</th>
            <th v-if="data.options.canEdit">Edit</th>
            <th v-if="data.options.canDelete">Delete</th>
          </tr>
        </thead>
        <tbody v-if="records">
          <tr v-for="row in records" :key="row[data.uniqueColumn]">
            <td
              v-for="(column, colIndex) in data.columns.filter(x => x.visible !== false)"
              :key="colIndex"
            >
              <span v-if="column.type === 'date'">{{ new Date(row[column.id]).toLocaleString() }}</span>
              <span
                v-else-if="column.type === 'currency'"
                :class="row[column.id] < 0 ? 'negative' : ''"
              >{{ formatCurrency(row[column.id]) }}</span>
              <span v-else>{{ row[column.id] }}</span>
            </td>
            <td v-if="data.options.canEdit && data.uniqueColumn" class="icon-cell">
              <router-link :to="row[data.uniqueColumn]" append :record="row">
                <i class="material-icons">edit</i>
              </router-link>
            </td>
            <td v-if="data.options.canDelete" class="icon-cell">
              <i class="material-icons delete">delete</i>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr :colspan="data.columns.length">There are no records to display!</tr>
        </tbody>
      </table>
      <div class="pagination" v-if="pagination.totalPages !== 1">
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

<script lang="ts">
import _ from "lodash";
import Vue from "vue";

export default Vue.extend({
  name: "DataTable",
  props: {
    data: Object
  },
  data() {
    return {
      allRecords: [],
      filteredRecords: [],
      records: [],
      activeFilters: {} as any,
      pagination: {
        limit: 10,
        currentPage: 1,
        totalPages: 0,
        start: 2,
        end: 0,
        startEllipsis: false,
        endEllipsis: false,
        range: _.range(1, 1)
      }
    };
  },
  mounted() {
    if (this.data && this.data.records) {
      this.allRecords = this.filteredRecords = this.data.records;

      this.updatePagination();
    }
  },
  methods: {
    updatePagination() {
      this.pagination.startEllipsis = false;
      this.pagination.endEllipsis = false;

      this.pagination.limit = 10;
      this.pagination.totalPages = Math.ceil(
        this.filteredRecords.length / this.pagination.limit
      );
      this.pagination.end = this.pagination.totalPages;

      if (this.pagination.currentPage - 2 > 2) {
        this.pagination.start = this.pagination.currentPage - 2;
        this.pagination.startEllipsis = true;
      }

      if (this.pagination.currentPage + 2 < this.pagination.totalPages) {
        this.pagination.end = this.pagination.currentPage + 3;
      }

      if (this.pagination.end !== this.pagination.totalPages) {
        this.pagination.endEllipsis = true;
      }

      this.pagination.range = _.range(
        this.pagination.start,
        this.pagination.end
      );

      this.getData();
    },
    navigate(page: number) {
      this.pagination.currentPage = page;
      this.updatePagination();
    },
    upsertFilter(id: any, type: string, params: any) {
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
    clearFilter() {},
    dateFilter(value: string, columnId: string, type: string, isNew: boolean) {
      if (isNew) {
        // Only upsert filter if it came from user input, not a method
        this.upsertFilter(columnId + type, "date", { value, columnId, type });
        return;
      }

      const filterDate = new Date(value).setHours(0, 0, 0, 0);
      this.filteredRecords = this.filteredRecords.filter((x: any) => {
        if (type === "start") {
          return new Date(x[columnId]).setHours(0, 0, 0, 0) >= filterDate;
        } else {
          return new Date(x[columnId]).setHours(0, 0, 0, 0) <= filterDate;
        }
      });
      this.navigate(1);
    },
    textFilter(value: any, columnId: string, isNew: boolean) {
      if (isNew) {
        // Only upsert filter if it came from user input, not a method
        this.upsertFilter(columnId, "text", { value, columnId });
        return;
      }

      this.filteredRecords = this.filteredRecords.filter((x: any) =>
        new RegExp(value, "i").test(x[columnId])
      );
      this.navigate(1);
    },
    numberFilter(
      value: string,
      columnId: string,
      type: string,
      isNew: boolean
    ) {
      if (isNew) {
        // Only upsert filter if it came from user input, not a method
        this.upsertFilter(columnId + type, "number", { value, columnId, type });
        return;
      }

      const numValue = parseFloat(value);

      this.filteredRecords = this.filteredRecords.filter((x: any) => {
        if (type === "min") {
          return x[columnId] >= numValue;
        } else {
          return x[columnId] <= numValue;
        }
      });
      this.navigate(1);
    },
    sort(column: any) {
      column.sort_direction = column.sort_direction === "asc" ? "desc" : "asc";
      this.filteredRecords = _.orderBy(
        this.filteredRecords,
        column.id,
        column.sort_direction
      );
      this.getData();
    },
    changePage() {},
    getData() {
      const start = (this.pagination.currentPage - 1) * this.pagination.limit;
      const end =
        (this.pagination.currentPage - 1) * this.pagination.limit +
        this.pagination.limit;
      this.records = this.filteredRecords.slice(start, end || -1);
    },
    formatCurrency(number: number) {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
      });

      return formatter.format(number);
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
