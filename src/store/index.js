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
    signUp({ email, password }) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => {
          alert('Create account: ' + user.user.email)
        })
        .catch(error => {
          alert(error.message)
        })
    },
    signIn({ email, password }) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          alert('Success!')
        })
        .catch(error => {
          alert(error.message)
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
    }
  },
  actions: {
    signUp(context, { email, password }) {
      context.commit('signUp', { email, password })
    },
    signIn(context, { email, password }) {
      context.commit('signIn', { email, password })
    }
  },
  modules: {}
})
