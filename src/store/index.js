import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase/app';
import 'firebase/firestore';
import reports from './reports';

const config = {
  apiKey: `${process.env.VUE_APP_FIRESTORE_API_KEY}`,
  authDomain: `${process.env.VUE_APP_FIRESTORE_DOMAIN}.firebaseapp.com`,
  databaseURL: `https://${process.env.VUE_APP_FIRESTORE_DOMAIN}.firebaseio.com`,
  projectId: `${process.env.VUE_APP_FIRESTORE_DOMAIN}`,
  storageBucket: `${process.env.VUE_APP_FIRESTORE_DOMAIN}.appspot.com`,
  messagingSenderId: `${process.env.VUE_APP_FIRESTORE_SENDER_ID}`,
};
firebase.initializeApp(config);

Vue.use(Vuex);

const state = {
  db: firebase.firestore(),
};

export default new Vuex.Store({
  state,
  modules: {
    reports,
  },
});
