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
    transfer: '',
    usersData: [],
    sendBoxIndex: null,
    isName: '',
    isBalance: '',
    isUid: '',
    checkBalancePopupFlg: false,
    sendMoneypopupFlg: false
  },
  getters: {
    getUsername: state => state.username,
    getEmail: state => state.email,
    getPassword: state => state.password,
    getBalance: state => state.balance,
    getTransfer: state => state.transfer,
    getUsersData: state => state.usersData,
    getSendBoxIndex: state => state.sendBoxIndex,
    getIsName: state => state.isName,
    getIsBalance: state => state.isBalance,
    getIsCheckBalancePopupFlg: state => state.checkBalancePopupFlg,
    getIsSendMoneyPopupFlg: state => state.sendMoneypopupFlg
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
        balance: usersDB.balance,
        uid: usersDB.uid
      })
    },
    resetSendForm(state) {
      state.transfer = null
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
    updateMyBalance(state, getTransfer) {
      state.balance = state.balance - getTransfer
    },
    updateDestinationBalance(state, getTransfer) {
      state.usersData[state.sendBoxIndex].balance += Number(getTransfer)
    },
    logOut(state) {
      state.username = ''
      state.email = ''
      state.password = ''
      state.balance = ''
      state.usersData = []
      firebase.auth().signOut()
      router.push({ name: 'Signin' })
    },
    checkBalance(state) {
      state.isName = event.currentTarget.getAttribute('data-name')
      state.isBalance = event.currentTarget.getAttribute('data-balance')
      state.checkBalancePopupFlg = true
    },
    sendMoney(state) {
      state.isUid = event.currentTarget.getAttribute('data-uid')
      state.isBalance = event.currentTarget.getAttribute('data-balance')
      state.sendBoxIndex = event.currentTarget.getAttribute('data-index')
      state.sendMoneypopupFlg = true
    },
    closePopup(state) {
      state.checkBalancePopupFlg = false,
      state.sendMoneypopupFlg = false
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
    },
    updateUserBalance({ state, commit }, getTransfer) {
      //const isMyUid = firebase.auth().currentUser.uid
      var isUidRef = db.collection('users').where('uid', '==', state.isUid)
      //var isMyUidRef = db.collection('users').where('uid', '==', isMyUid)
      db.runTransaction((transaction) => {
        console.log(transaction)
        // return transaction.get(isUidRef).then((docs) => {
        return isUidRef.get().then((docs) => {
          docs.forEach((doc) => {
            db.collection('users').doc(doc.id).update({
              balance: Number(state.isBalance) + Number(getTransfer)
            })
          })
          commit('updateDestinationBalance', getTransfer)
        }).catch(error => {
          console.log(error)
        })
        // return isMyUidRef.get().then((docs) => {
        //   docs.forEach((doc) => {
        //     db.collection('users').doc(doc.id).update({
        //       balance: Number(state.balance) - Number(getTransfer)
        //     })
        //   })
        //   commit('updateMyBalance', getTransfer)
        // }).catch(function(error) {
        //   console.log(error)
        // })
      }).then(() => {
        console.log('ok')
      }).catch((error) => {
        console.log(error)
      })
    }
  },
  modules: {}
})
