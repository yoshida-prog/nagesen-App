import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import db from '../main'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    email: '',
    password: '',
    balance: ''
  },
  getters: {
    getUsername: state => state.username,
    getEmail: state => state.email,
    getPassword: state => state.password,
    getBalance: state => state.balance
  },
  mutations: {
    rootingDashboard(state, { username, userId }) {
      state.username = username
      router.push({ name: 'Dashboard', params: { userId: userId } })
    },
    loginError(state, error) {
      alert(error)
    },
    setUserData(state, userData) {
      state.username = userData.name
      state.balance = userData.balance
    },
    updateUsername(state, value) {
      state.username = value
    },
    updateEmail(state, value) {
      state.email = value
    },
    updatePassword(state, value) {
      state.password = value
    },
    logOut(state){
      state.username = '',
      state.email = '',
      state.password = '',
      state.balance = ''
      firebase.auth().signOut()
      router.push({ name: 'Signin' })
    }
  },
  actions: {
    signUp({ commit }, { username, email, password }) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(function(user) {
          db.collection('users').doc(user.user.uid).set({
            name: username,
            balance: 1000
          }).then(() => {
            commit('rootingDashboard', { username: username, userId: user.user.uid })
          }).catch((error) => {
            console.error('Error adding document: ', error)
          })
        })
        .catch(error => commit('loginError', error.message))
    },
    signIn({ commit }, {email, password}) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(function(user){
          db.collection('users').doc(user.user.uid).get()
            .then((doc) => {
              commit('rootingDashboard', { username: doc.data().name, userId: doc.id })
            })
            .catch(error => {
              console.log('Error adding document: ', error)
            })
        })
        .catch(error => commit('loginError', error.message))
    },
    getUserDB({ commit }, userid){
      db.collection('users').doc(userid).get()
        .then((doc) => {
          commit('setUserData', doc.data())
        })
        .catch(error => {
          console.log('Error adding document: ', error)
        })
    }
  },
  modules: {}
})
