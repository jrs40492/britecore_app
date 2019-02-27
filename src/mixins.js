import moment from 'moment';

export default {
  methods: {
    formatCurrency(number) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      });

      return formatter.format(number);
    },
    formatDate(date, forInput) {
      if (!date) {
        return date;
      }

      let format = 'MM/DD/YYYY, HH:mm:ss A';

      if (forInput) {
        format = 'YYYY-MM-DDTHH:mm:ss';
      }

      let newDate = moment(newDate);

      if (typeof date !== 'string') {
        newDate = moment.unix(date.seconds);
      }

      return newDate.format(format);
    }
  }
}
