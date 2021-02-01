import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    Email: '',
    password: ''
  },
  getters: {
    getUsername: state => state.username,
    getEmail: state => state.Email,
    getPassword: state => state.password
  },
  mutations: {
    updateUsername(state, value){
      state.username = value
    },
    updateEmail(state, value){
      state.Email = value
    },
    updatePassword(state, value){
      state.password = value
    }
  },
  actions: {
  },
  modules: {
  }
})
