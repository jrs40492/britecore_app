import lodash from 'lodash';
import firebase from 'firebase/app';
import 'firebase/firestore';

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
  SET_SETTINGS(
    _, {
      settings,
    },
  ) {
    state.settings = {
      uniqueId: settings.id,
      ...settings.data(),
    };
  },
  SET_COLUMN(
    _, {
      column,
    },
  ) {
    if (!lodash.find(state.columns, {
      uniqueId: column.id,
    })) {
      state.columns.push({
        uniqueId: column.id,
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
      uniqueId: record.id,
    })) {
      state.records.push({
        uniqueId: record.id,
        ...record.data(),
      });
    }
  },

};

const actions = {
  async getSettings({
    commit,
    rootState,
  }, reportId) {
    await rootState.db
      .collection('reports')
      .doc(reportId)
      .get()
      .then((settings) => {
        commit('SET_SETTINGS', {
          settings,
        });
      });
  },
  async getColumns({
    commit,
    rootState,
  }, reportId) {
    state.columns = [];
    await rootState.db
      .collection('reports')
      .doc(reportId)
      .collection('columns')
      .orderBy('order', 'asc')
      .get()
      .then((columns) => {
        columns.forEach(column => commit('SET_COLUMN', {
          column,
        }));
      });
  },
  async getRecords({
    commit,
    rootState,
  }, reportId) {
    state.records = [];
    await rootState.db
      .collection('reports')
      .doc(reportId)
      .collection('records')
      .get()
      .then((records) => {
        records.forEach(record => commit('SET_RECORD', {
          record,
        }));
      });
  },
  async create({
    _,
    rootState,
  }, {
    name,
    options,
    columns,
    records,
  }) {
    rootState.db.collection('reports').add({
      name,
      createdOn: firebase.firestore.Timestamp.now(),
      options,
    }).then((docRef) => {
      const columnsRef = docRef.collection('columns');
      const recordsRef = docRef.collection('records');
      columns.forEach((column) => {
        columnsRef.doc().set(column);
      });
      records.forEach((record) => {
        recordsRef.doc().set(record);
      });
    });
  },
  async update({
    _,
    rootState,
  }, {
    name,
    reportId,
    options,
    columns,
  }) {
    const docRef = rootState.db.collection('reports').doc(reportId);
    docRef.update({
      name,
      updatedOn: firebase.firestore.Timestamp.now(),
      options,
    });

    const columnsRef = docRef.collection('columns');
    columns.forEach((column) => {
      columnsRef.doc(column.dbKey).update(column);
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
