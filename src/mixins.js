import Vue from 'vue';
import moment from 'moment';

Vue.mixin({
  methods: {
    formatCurrency(number) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      });

      return formatter.format(number);
    },
    formatDate: (date) => {
      if (!date) {
        return null;
      }

      if (typeof date === 'string') {
        return moment(date).format('YYYY-MM-DDTHH:mm');
      }

      return date.toDate().toLocaleString();
    },
  },
});
