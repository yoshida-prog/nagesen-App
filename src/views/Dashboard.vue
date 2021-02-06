<template>
<div class="dashboard">
  <div class="logOut">
    <button @click="logOut">ログアウト</button>
  </div>
  <div class="userInfo">
    <span>ようこそ{{ getUsername }}さん</span>
    <span>残高: {{ getBalance }}</span>
  </div>
  <h2>ユーザー一覧</h2>

</div>
</template>

<script>
import { username, email, password, balance } from '../store/index.js'
import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      username,
      email,
      password,
      balance
    }
  },
  methods: {
    ...mapMutations([
      'logOut'
    ])
  },
  created(){
    const path = this.$route.path.split('/')
    const userid = path[2]
    this.$store.dispatch('getUserDB', userid)
  },
  computed: {
    ...mapGetters([
      'getUsername',
      'getBalance'
    ])
  }
}


</script>

<style scoped>

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

.userInfo {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.logOut {
  float: right;
  margin: 0 8% 40px 0;
}

</style>
