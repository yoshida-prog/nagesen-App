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
    //__________________________________________________________________________________________
    // asyncで非同期処理をする関数を定義
    // awaitはasync関数内でPromiseの結果が返されるまで待機する演算子
    // つまりawait functionは、そのPromiseの結果が返されるまで待機する
    // 今回の場合はupdateUserBalanceで2つの非同期処理を包括しているのでasync updateUserBalance()とすれば良い
    // そして、結果が返ってくるまで待機が必要な関数は、送金する側される側のbalanceの書き換えであるので
    // 2つのupdate関数にawaitをつける
    // 2つのupdateが完了するとトランザクションの結果が返される
    // 以上の流れで処理を終了する
    //__________________________________________________________________________________________
    // 非同期処理の宣言
    async updateUserBalance({ state, commit }, getTransfer) {
      const isMyUid = firebase.auth().currentUser.uid
      // 全ての非同期処理が完了すればOKなのでtry-catch構文を用いる
      try {
        // クエリではtransactionは使えないらしいのでconsole.logを使って送金する側される側のidの格納場所を探した
        const receiverDocs = await db.collection('users').where('uid', '==', state.isUid).get()
        // console.log(receiverDocs)でちまちま探したところdocs.idにあった
        const receiverId = receiverDocs.docs[0].id
        const senderDocs = await db.collection('users').where('uid', '==', isMyUid).get()
        const senderId = senderDocs.docs[0].id
        // ドキュメントをgetしたらトランザクションスタート
        await db.runTransaction(async transaction => {
          // transactionのオペレーションはget,set,update,deleteなどで構成される
          // 今回はupdateを使い、第一引数にドキュメント、第二引数に更新したいフィールドと値を渡す
          // 送金される側
          await transaction.update(db.collection('users').doc(receiverId), {
            balance: firebase.firestore.FieldValue.increment(Number(getTransfer))
          })
          commit('updateDestinationBalance', getTransfer)
          // 送金する側
          await transaction.update(db.collection('users').doc(senderId), {
            balance: firebase.firestore.FieldValue.increment(-Number(getTransfer))
          })
          commit('updateMyBalance', getTransfer)
        })
      } catch (error) {
        console.log(error)
      }
    }
  },
  modules: {}
})
