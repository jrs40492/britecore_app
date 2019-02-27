import {
  createLocalVue,
  mount,
} from '@vue/test-utils';
import mixins from '@/mixins';
import DataTable from '@/components/DataTable.vue';

const columns = [{
    id: 'id',
    name: 'ID',
    visible: false,
  },
  {
    id: 'name',
    name: 'Report',
    type: 'link',
    visible: true,
    canFilter: true,
  },
  {
    id: 'createdOn',
    name: 'Created',
    type: 'date',
    visible: true,
    canFilter: true,
  },
];

const records = [{
  id: '1',
  name: 'Test',
  createdOn: new Date(),
}];

const settings = {
  options: {
    canEdit: false,
    canDelete: false,
  }
};

const localVue = createLocalVue();
localVue.mixin(mixins);

describe('DataTable', () => {
  it('contains 1 row', () => {
    const wrapper = mount(DataTable, {
      localVue,
      propsData: {
        columns,
        records,
        settings,
      },
      stubs: ['router-link']
    });
    expect(wrapper.findAll("tbody > tr").length).toBe(1);
  });
});
