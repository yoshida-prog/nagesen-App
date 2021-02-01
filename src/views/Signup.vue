<template>
  <div class="signup">
    <h2>新規登録</h2>
    <input type="text" placeholder="Username" v-model="updateUsername">
    <input type="text" placeholder="Email" v-model="updateEmail">
    <input type="password" placeholder="Password" v-model="updatePassword">
    <button @click="signUp">登録する</button>
  </div>
</template>

<script>
import firebase from 'firebase'
import { username, Email, password } from '../store/index.js'
import { mapGetters } from 'vuex'

export default {
  name: 'Signup',
  data () {
    return {
      username,
      Email,
      password
    }
  },
  methods: {
    signUp() {
      firebase
      .auth()
      .createUserWithEmailAndPassword(this.getEmail, this.getPassword)
        .then(user => {
          alert('Create account: ', user.email)
        })
        .catch(error => {
          alert(error.message)
        })
    }
  },
  computed: {
    ...mapGetters([
      'getUsername',
      'getEmail',
      'getPassword'
    ]),
    updateUsername: {
      get(){
        return this.getUsername
      },
      set(value){
        this.$store.commit('updateUsername', value)
      }
    },
    updateEmail: {
      get(){
        return this.getEmail
      },
      set(value){
        this.$store.commit('updateEmail', value)
      }
    },
    updatePassword: {
      get(){
        return this.getPassword
      },
      set(value){
        this.$store.commit('updatePassword', value)
      }
    }
  }
}
</script>

<style scoped>
input{
  display: flex;
  flex-direction: column;
  justify-content: center;
  font: 16px/24px sans-serif;
  width: 230px;
  padding: 10px 0;
  margin: 10px auto;
  border: none;
  border-bottom: 1.5px solid #1b2538;
}
input:focus{
  border-bottom: 1.5px solid #da3c41;
  outline: none;
  transition: .5s;
}
button{
  color: #FFF;
  background-color: #1da1f3;
  border-radius: 20px;
  display: inline-block;
  margin: 10px auto;
  height: 40px;
  width: 120px;
  font-size: 16px;
  border: none;
}
button:active{
  background-color: #36c;
}
button:focus{
  outline: 0px;
}
</style>
