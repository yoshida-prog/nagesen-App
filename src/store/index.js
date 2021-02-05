import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    email: '',
    password: ''
  },
  getters: {
    getUsername: state => state.username,
    getEmail: state => state.email,
    getPassword: state => state.password
  },
  mutations: {
    createAccountAlert(state, email) {
      alert('createAccount: ' + email)
    },
    loginAlart() {
      alert('Success!')
    },
    loginError(state, error) {
      alert(error)
    },
    updateUsername(state, value) {
      state.username = value
    },
    updateEmail(state, value) {
      state.email = value
    },
    updatePassword(state, value) {
      state.password = value
    }
  },
  actions: {
    signUp({commit}, {email, password}) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => commit('createAccountAlert', user.user.email))
        .catch(error => commit('loginError', error.message))
    },
    signIn({commit}, {email, password}) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => commit('loginAlart'))
        .catch(error => commit('loginError', error.message))
    }
  },
  modules: {}
})
