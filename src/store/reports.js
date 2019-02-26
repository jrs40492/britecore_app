import lodash from 'lodash';
import firebase from 'firebase/app';
import 'firebase/firestore';

const data = {
  records: [],
  report: {
    records: [],
    columns: [],
    settings: {
      options: {
        canEdit: true,
        canDelete: false,
      },
    },
  },
};

const getters = {};

const mutations = {
  addReportsRecord(
    _, {
      record,
    },
  ) {
    if (!lodash.find(data.records, {
      uniqueId: record.id,
    })) {
      data.records.push({
        uniqueId: record.id,
        ...record.data(),
      });
    }
  },
  addReportSetting(
    _, {
      settings,
    },
  ) {
    data.report.settings = {
      uniqueId: settings.id,
      ...settings.data(),
    };
  },
  addReportColumn(
    _, {
      column,
    },
  ) {
    if (!lodash.find(data.columns, {
      uniqueId: column.id,
    })) {
      data.report.columns.push({
        uniqueId: column.id,
        ...column.data(),
      });
    }
  },
  addReportRecord(
    _, {
      record,
    },
  ) {
    if (!lodash.find(data.records, {
      uniqueId: record.id,
    })) {
      data.report.records.push({
        uniqueId: record.id,
        ...record.data(),
      });
    }
  },

};

const actions = {
  async getAll({
    commit,
    rootState,
  }) {
    data.records = [];
    const reportsRef = rootState.db.collection('reports');
    const reports = await reportsRef.get();
    reports.forEach(record => commit('addReportsRecord', {
      record,
    }));
  },
  async getReportSettings({
    commit,
    rootState,
  }, reportId) {
    await rootState.db
      .collection('reports')
      .doc(reportId)
      .get()
      .then((settings) => {
        commit('addReportSetting', {
          settings,
        });
      });
  },
  async getReportColumns({
    commit,
    rootState,
  }, reportId) {
    data.report.columns = [];
    await rootState.db
      .collection('reports')
      .doc(reportId)
      .collection('columns')
      .orderBy('order', 'asc')
      .get()
      .then((columns) => {
        columns.forEach(column => commit('addReportColumn', {
          column,
        }));
      });
  },
  async getReportRecords({
    commit,
    rootState,
  }, reportId) {
    data.report.records = [];
    await rootState.db
      .collection('reports')
      .doc(reportId)
      .collection('records')
      .get()
      .then((records) => {
        records.forEach(record => commit('addReportRecord', {
          record,
        }));
      });
  },
  async createReport({
    commit,
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
  async updateReport({
    commit,
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
  state: data,
  getters,
  mutations,
  actions,
};
