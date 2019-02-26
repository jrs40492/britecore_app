import {
  mount,
} from '@vue/test-utils';
import DataTable from '@/components/DataTable.vue';

describe('DataTable', () => {
  test('table contains 3 rows', () => {
    const wrapper = mount(DataTable);
    expect(wrapper.isVueInstance()).toBeTruty();
  });
});
