<template>
  <div class="data-table-page grid grid-cell span-12-xs">
    <div class="card grid-cell span-12-xs span-3-lg">
      <div class="card-header">Filters</div>
      <div class="card-body">
        <div class="filter" v-for="column in displayColumns" :key="column.id">
          <div v-if="column.type === 'currency' || column.type === 'number'">
            <div class="number-input">
              <label :for="column.id + 'Min'">Min {{ column.name }}:</label>
              <input
                type="number"
                placeholder="0"
                :id="column.id + 'Min'"
                :v-model="column.id"
                @input="
                  applyFilter('number', $event.target.value, column.id, 'min')
                "
              />
            </div>
            <div class="number-input">
              <label :for="column.id + 'Max'">Max {{ column.name }}:</label>
              <input
                type="number"
                placeholder="1000"
                :id="column.id + 'Max'"
                :v-model="column.id"
                @input="
                  applyFilter('number', $event.target.value, column.id, 'max')
                "
              />
            </div>
          </div>
          <div v-else-if="column.type === 'date'">
            <div class="date-input">
              <label :for="column.id + 'StartDate'"
                >Start {{ column.name }}:</label
              >
              <input
                type="date"
                :id="column.id + 'StartDate'"
                name="Start Date"
                @input="
                  applyFilter('date', $event.target.value, column.id, 'start')
                "
                :v-model="column.id"
              />
            </div>
            <div class="date-input">
              <label :for="column.id + 'EndDate'">End {{ column.name }}:</label>
              <input
                type="date"
                :id="column.id + 'EndDate'"
                name="End Date"
                @input="
                  applyFilter('date', $event.target.value, column.id, 'end')
                "
                :v-model="column.id"
              />
            </div>
          </div>
          <div v-else>
            <div class="text-input">
              <label :for="column.id + 'Filter'">{{ column.name }}</label>
              <input
                type="text"
                :id="column.id + 'Filter'"
                :placeholder="column.name"
                @input="applyFilter('text', $event.target.value, column.id)"
                :v-model="column.id"
              />
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
              v-for="column in displayColumns"
              :key="column.id"
              @click="sort(column)"
              class="sortable"
            >
              {{ column.name }}
              <template v-if="currentSort === column.name">
                <i class="material-icons" v-if="column.sortDirection === 'asc'"
                  >arrow_drop_up</i
                >
                <i class="material-icons" v-else>arrow_drop_down</i>
              </template>
            </th>
            <th v-if="settings.options.canEdit">Edit</th>
            <th v-if="settings.options.canDelete">Delete</th>
          </tr>
        </thead>
        <tbody v-if="displayRecords.length > 0">
          <tr v-for="(record, index) in displayRecords" :key="index">
            <template v-for="column in displayColumns">
              <td v-if="column.type === 'date'" :key="column.id">
                {{ formatDate(record[column.id]) }}
              </td>
              <td v-else-if="column.type === 'link'" :key="column.id">
                <router-link :to="record.uniqueId" append>
                  {{ record[column.id] }}
                </router-link>
              </td>
              <td
                v-else-if="column.type === 'currency'"
                :class="record[column.id] < 0 ? 'negative' : ''"
                class="number"
                :key="column.id"
              >
                {{ formatCurrency(record[column.id]) }}
              </td>
              <td v-else :key="column.id">{{ record[column.id] }}</td>
            </template>
            <td v-if="settings.options.canEdit" class="icon-cell">
              <router-link :to="record.uniqueId + '/edit'" append>
                <i class="material-icons">edit</i>
              </router-link>
            </td>
            <td v-if="settings.options.canDelete" class="icon-cell">
              <i class="material-icons delete">delete</i>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td :colspan="columns.length">There are no records to display!</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination" v-if="pagination.totalPages > 1">
        <div
          :class="pagination.currentPage === 1 ? 'active' : ''"
          @click="updatePagination(1)"
        >
          1
        </div>
        <div v-if="pagination.startEllipsis" class="ellipsis start">...</div>
        <div
          v-for="page in pagination.range"
          :key="page"
          :class="pagination.currentPage === page ? 'active' : ''"
          @click="updatePagination(page)"
        >
          {{ page }}
        </div>
        <div v-if="pagination.endEllipsis" class="ellipsis end">...</div>
        <div
          :class="
            pagination.currentPage === pagination.totalPages ? 'active' : ''
          "
          @click="updatePagination(pagination.totalPages)"
        >
          {{ pagination.totalPages }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import Vue from 'vue';

export default Vue.extend({
  name: 'DataTable',
  props: ['columns', 'records', 'settings'],
  data() {
    return {
      activeFilters: {},
      filteredRecords: [],
      currentSort: '',
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
  computed: {
    allRecords() {
      // TODO: Must be a better way to watch these fields
      return (this.filteredRecords = this.records);
    },
    displayColumns() {
      return _.filter(this.columns, 'visible');
    },
    displayRecords() {
      // TODO: Must be a better way to watch these fields
      this.allRecords;

      return this.updatePagination();
    }
  },
  methods: {
    updatePagination(page) {
      if (page) {
        this.pagination.currentPage = page;
      }

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

      // Build the range for the middle paging numbers
      this.pagination.range = _.range(start, end);

      return this.getData();
    },
    applyFilter(type, value, id, version = '') {
      // Generate unique ID to track active filters
      const uniqueId = `${id}${type}${version}`;

      // Check if the filter already exists
      if (_.find(this.activeFilters, (x, index) => index === uniqueId)) {
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

      // Reset filtered records back to entire list
      this.filteredRecords = this.records;

      const filterKeys = Object.keys(this.activeFilters);

      // If all filters have been removed
      if (filterKeys.length === 0) {
        return;
      }

      // Loop through all active filters to get data set
      filterKeys.forEach(key => {
        const filter = this.activeFilters[key];
        switch (filter.type) {
          case 'date':
            this.dateFilter(filter.value, filter.columnId, filter.version);
            break;
          case 'text':
            this.textFilter(filter.value, filter.columnId);
            break;
          case 'number':
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
        if (type === 'start') {
          return new Date(x[columnId]).setHours(0, 0, 0, 0) >= filterDate;
        }
        return new Date(x[columnId]).setHours(0, 0, 0, 0) <= filterDate;
      });
    },
    textFilter(value, columnId) {
      this.filteredRecords = this.filteredRecords.filter(x =>
        new RegExp(value, 'i').test(x[columnId])
      );
    },
    numberFilter(value, columnId, type) {
      const numValue = parseFloat(value);

      this.filteredRecords = this.filteredRecords.filter(x => {
        if (type === 'min') {
          return x[columnId] >= numValue;
        }
        return x[columnId] <= numValue;
      });
    },
    sort(column) {
      column.sortDirection = column.sortDirection === 'asc' ? 'desc' : 'asc';
      this.currentSort = column.id;

      this.filteredRecords = _.orderBy(
        this.filteredRecords,
        e => e[column.id],
        column.sortDirection
      );
    },
    getData() {
      const start = (this.pagination.currentPage - 1) * this.pagination.limit;
      const end =
        (this.pagination.currentPage - 1) * this.pagination.limit +
        this.pagination.limit;

      return this.filteredRecords.slice(start, end || -1);
    }
  }
});
</script>

<style lang="scss">
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
