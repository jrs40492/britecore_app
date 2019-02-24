import lodash from 'lodash';

const state = {
  records: [],
  columns: [],
  options: {
    canEdit: true,
    canDelete: false,
  },
};

const getters = {};

const mutations = {
  SET_COLUMN(
    _, {
      column,
    },
  ) {
    if (!lodash.find(state.columns, {
      id: column.id,
    })) {
      state.columns.push({
        id: column.id,
        ...column.data(),
      });
    }
  },
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
  async getColumns({
    commit,
    rootState,
  }, reportId) {
    const columnsRef = rootState.db.collection('reports').doc(reportId).collection(
      'columns',
    )
      .orderBy('order', 'asc');
    const columns = await columnsRef.get();
    columns.forEach(column => commit('SET_COLUMN', {
      column,
    }));
  },
  async getRecords({
    commit,
    rootState,
  }, reportId) {
    const recordsRef = rootState.db.collection('reports').doc(reportId).collection(
      'records',
    );
    const records = await recordsRef.get();
    records.forEach(record => commit('SET_RECORD', {
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
