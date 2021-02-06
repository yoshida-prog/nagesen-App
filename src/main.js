import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'
import { firebaseConfig } from './firebase/config'

Vue.config.productionTip = false

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()
export default db

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
