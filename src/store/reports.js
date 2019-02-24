import lodash from 'lodash';
import firebase from 'firebase/app';
import 'firebase/firestore';

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
  async create({
    _,
    rootState,
  }, {
    name,
    settings,
    columns,
    records,
  }) {
    rootState.db.collection('reports').add({
      name,
      createdOn: firebase.firestore.Timestamp.now(),
      settings,
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
    settings,
    columns,
  }) {
    const docRef = rootState.db.collection('reports').doc(reportId);
    docRef.update({
      name,
      updatedOn: firebase.firestore.Timestamp.now(),
      settings,
    });

    const columnsRef = docRef.collection('columns');
    columns.forEach((column) => {
      columnsRef.doc(column.dbKey).update(column);
    });
  },
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
