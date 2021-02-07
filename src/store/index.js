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
    balance: '',
    usersData: [],
    isName: '',
    isBalance: '',
    popupFlg: false
  },
  getters: {
    getUsername: state => state.username,
    getEmail: state => state.email,
    getPassword: state => state.password,
    getBalance: state => state.balance,
    getUsersData: state => state.usersData,
    getIsName: state => state.isName,
    getIsBalance: state => state.isBalance,
    getIsPopupFlg: state => state.popupFlg
  },
  mutations: {
    rootingDashboard() {
      router.push({ name: 'Dashboard' })
    },
    loginError(state, error) {
      alert(error)
    },
    setUserData(state, userData) {
      state.username = userData.name
      state.balance = userData.balance
    },
    setAllUserDB(state, usersDB){
      state.usersData.push({
        name: usersDB.name,
        balance: usersDB.balance
      })
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
    logOut(state) {
      state.username = ''
      state.email = ''
      state.password = ''
      state.balance = ''
      state.usersData = []
      router.push({ name: 'Signin' })
      firebase.auth().signOut()
    },
    checkBalance(state) {
      state.isName = event.currentTarget.getAttribute('data-name')
      state.isBalance = event.currentTarget.getAttribute('data-balance')
      state.popupFlg = true
    },
    closePopup(state) {
      state.popupFlg = false
    }
  },
  actions: {
    signUp({ commit }, { username, email, password }) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(function(user) {
          const userInfo = firebase.auth().currentUser
          userInfo.updateProfile({
            displayName: username
          })
          db.collection('users').doc().set({
            name: username,
            balance: 1000,
            uid: user.user.uid
          }).then(() => {
            commit('rootingDashboard')
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
        .then(function(){
          commit('rootingDashboard')
        })
        .catch(error => commit('loginError', error.message))
    },
    getUserDB({ commit }) {
      const uid = firebase.auth().currentUser.uid
      db.collection('users').where('uid', '==', uid).get()
        .then((docs) => {
          docs.forEach((doc) => {
            commit('setUserData', doc.data())
          })
        })
        .catch(error => {
          console.log('Error adding document: ', error)
        })
    },
    getAllUserDB({ commit }) {
      db.collection('users').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          commit('setAllUserDB', doc.data())
        })
      })
    }
  },
  modules: {}
})
