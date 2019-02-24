import lodash from 'lodash';

const state = {
  records: [],
  columns: [{
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
  ],
  options: {
    canEdit: true,
    canDelete: false,
  },
};

const getters = {};

const mutations = {
  SET_RECORD(
    _, {
      record,
    },
  ) {
    if (!lodash.find(state.records, {
      id: record.id,
    })) {
      state.records.push({
        id: record.id,
        ...record.data(),
      });
    }
  },

};

const actions = {
  async get({
    commit,
    rootState,
  }) {
    const reportsRef = rootState.db.collection('reports');
    const reports = await reportsRef.get();
    reports.forEach(record => commit('SET_RECORD', {
      record,
    }));
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
