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
  name: 'Payments',
  createdOn: new Date('01/01/2018'),
}, {
  id: '2',
  name: 'Refunds',
  createdOn: new Date('01/01/2018'),
}, {
  id: '3',
  name: 'Clients',
  createdOn: new Date('01/01/2019'),
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
  it('contains 3 rows', () => {
    const wrapper = mount(DataTable, {
      localVue,
      propsData: {
        columns,
        records,
        settings,
      },
      stubs: ['router-link']
    });
    expect(wrapper.findAll("tbody > tr").length).toBe(3);
  });

  it('contains 1 row after name filter', () => {
    const wrapper = mount(DataTable, {
      localVue,
      propsData: {
        columns,
        records,
        settings,
      },
      stubs: ['router-link']
    });
    wrapper.find("#nameFilter").setValue("Ref");
    expect(wrapper.findAll("tbody > tr").length).toBe(1);
  });

  it('contains 2 rows after date filter', () => {
    const wrapper = mount(DataTable, {
      localVue,
      propsData: {
        columns,
        records,
        settings,
      },
      stubs: ['router-link']
    });
    wrapper.find("#createdOnEndDate").setValue("2018-02-15");
    expect(wrapper.findAll("tbody > tr").length).toBe(2);
  });
});
