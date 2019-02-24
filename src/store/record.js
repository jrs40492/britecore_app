const state = {
  record: [],
};

const getters = {};

const mutations = {
  SET_RECORD(
    _, {
      record,
    },
  ) {
    state.record = {
      uniqueId: record.id,
      ...record.data(),
    };
  },

};

const actions = {
  async getRecord({
    commit,
    rootState,
  }, {
    reportId,
    recordId,
  }) {
    await rootState.db
      .collection('reports')
      .doc(reportId)
      .collection('records')
      .doc(recordId)
      .get()
      .then((record) => {
        commit('SET_RECORD', {
          record,
        });
      });
  },
  async update({
    _,
    rootState,
  }, {
    reportId,
    recordId,
    record,
  }) {
    rootState.db
      .collection('reports')
      .doc(reportId)
      .collection('records')
      .doc(recordId)
      .update(record);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
