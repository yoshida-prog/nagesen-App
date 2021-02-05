<template>
<div class="signin">
  <h2>ログイン</h2>
  <input type="text" placeholder="email" v-model="updateEmail">
  <input type="password" placeholder="Password" v-model="updatePassword">
  <button @click="signIn({email: getEmail, password: getPassword})">ログイン</button>
  <div>
    <router-link to="/signup" class="link"><span>アカウント作成はこちら</span></router-link>
  </div>
</div>
</template>

<script>
import { email, password } from '../store/index.js'
import { mapGetters }  from 'vuex'
import { mapActions } from 'vuex'

export default {
  name: 'Signin',
  data() {
    return {
      email,
      password
    }
  },
  methods: {
    ...mapActions([
      'signIn'
    ])
  },
  computed: {
    ...mapGetters([
      'getEmail',
      'getPassword'
    ]),
    updateEmail: {
      get() {
        return this.getEmail
      },
      set(value) {
        this.$store.commit('updateEmail', value)
      }
    },
    updatePassword: {
      get() {
        return this.getPassword
      },
      set(value) {
        this.$store.commit('updatePassword', value)
      }
    }
  }
}


</script>

<style scoped>
input {
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

input:focus {
  border-bottom: 1.5px solid #da3c41;
  outline: none;
  transition: .5s;
}

button {
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

button:active {
  background-color: #36c;
}

button:focus {
  outline: 0px;
}

.link {
  color: #1da1f3;
  text-decoration: none;
}
</style>
