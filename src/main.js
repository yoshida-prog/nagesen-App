import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'

Vue.config.productionTip = false

var firebaseConfig = {
  apiKey: "AIzaSyCE3K9OYfqMC_VqwemutPb9P4144hcSXAM",
  authDomain: "vue-practice4.firebaseapp.com",
  projectId: "vue-practice4",
  storageBucket: "vue-practice4.appspot.com",
  messagingSenderId: "260978625580",
  appId: "1:260978625580:web:77219dceff3a2c7bac9589"
};
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
