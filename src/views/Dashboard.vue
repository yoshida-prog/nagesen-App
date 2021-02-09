<template>
<div class="dashboard">
  <div class="logOut">
    <button class="logOutBtn" @click="logOut">ログアウト</button>
  </div>
  <div class="userInfo">
    <span>ようこそ{{ getUsername }}さん</span>
    <span>残高: {{ getBalance }}</span>
  </div>
  <h2>ユーザー一覧</h2>
  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~残高確認画面モーダル~~~~~~~~~~~~~~~~~~~~~~~~~ -->
  <transition>
    <div class="modal" v-if="getIsCheckBalancePopupFlg">
      <div class="modalContainer">
        <div class="modalTextContainer">
          <h3 class="modalUserName">{{ getIsName }}さんの残高</h3>
          <p class="modalBalance">{{ getIsBalance }}</p>
        </div>
        <div class="modalBtnContainer">
          <button class="modalBtn" @click="closePopup">閉じる</button>
        </div>
      </div>
    </div>
  </transition>
  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~送金画面モーダル~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
  <transition>
    <div class="modal" v-if="getIsSendMoneyPopupFlg">
      <div class="modalContainer">
        <div class="modalTextContainer">
          <div class="modalText">
            <span class="modalBalance">あなたの残高: {{ getBalance }}</span><br>
            <span>送る金額</span>
            <input type="text" v-model="$store.state.transfer">
          </div>
        </div>
        <div class="modalBtnContainer">
          <button class="modalBtn modalSendBtn" @click="send(getTransfer)">送る</button>
          <button class="modalBtn" @click="closePopup">閉じる</button>
        </div>
      </div>
    </div>
  </transition>
  <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
  <table>
    <thead>
      <tr class="headContainer">
        <th class="leftHead">ユーザー名</th>
        <th class="rightHead">残高を見る</th>
        <th class="rightHead">送る</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(userDB, index) in getUsersData" :key="index">
        <td class="leftHead">{{ userDB.name }}</td>
        <td class="rightHead"><button class="dashBoardBtn" :data-balance="userDB.balance" :data-name="userDB.name" @click="checkBalance()" v-if="checkMyDB(userDB)">残高を見る</button></td>
        <td class="rightHead"><button class="dashBoardBtn" :data-uid="userDB.uid" :data-balance="userDB.balance" :data-index="index" @click="sendMoney" v-if="checkMyDB(userDB)">送る</button></td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
import { username, email, password, balance, transfer, usersData, sendBoxIndex, isName, isBalance, isUid, checkBalancePopupFlg, sendMoneypopupFlg } from '../store/index.js'
import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'
import firebase from 'firebase'

export default {
  name: 'Dashboard',
  data() {
    return {
      username,
      email,
      password,
      balance,
      transfer,
      usersData,
      sendBoxIndex,
      isName,
      isBalance,
      isUid,
      checkBalancePopupFlg,
      sendMoneypopupFlg
    }
  },
  methods: {
    ...mapMutations([
      'logOut',
      'checkBalance',
      'sendMoney',
      'closePopup'
    ]),
    send(getTransfer) {
      if(getTransfer.match(/^([1-9]\d*|0)$/)) {
        this.$store.dispatch('updateUserBalance', getTransfer)
      } else {
        alert('0以上の整数で入力してください')
      }
        this.$store.commit('resetSendForm')
    },
    checkMyDB(userDB) {
      if(userDB.name === this.getUsername) {
        return false
      } else {
        return true
      }
    }
  },
  created() {
    let authFlg = true //onAuthStateChangedが2度実行されることを防ぐためフラグを建てる
    firebase.auth().onAuthStateChanged((user) => {
      if(authFlg) {
        authFlg = false //一度実行されればfalseになるので2度実行されることはない
        if(user) {
          this.$store.dispatch('getUserDB')
          this.$store.dispatch('getAllUserDB')
        }
      }
    })
  },
  computed: {
    ...mapGetters([
      'getUsername',
      'getBalance',
      'getUsersData',
      'getSendBoxIndex',
      'getIsName',
      'getIsBalance',
      'getTransfer',
      'getIsCheckBalancePopupFlg',
      'getIsSendMoneyPopupFlg'
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
  border: none;
}

button:hover {
  background-color: #5fb1f1;
}

button:focus {
  outline: 0px;
}

.logOutBtn {
  margin: 10px auto;
  height: 40px;
  width: 120px;
  font-size: 16px;
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

table {
  margin: 0 auto;
  width: 90%;
}

.leftHead {
  width: 200px;
  height: 30px;
  float: left;
  text-align: center;
}

.rightHead {
  width: 120px;
  height: 30px;
}

.dashBoardBtn {
  height: 30px;
  width: 100px;
  font-size: 16px;
}

.v-enter {
  opacity: 0;
}

.v-enter-active {
  transition: opacity 300ms ease-out;
}

.v-leave-to {
  opacity: 0;
}

.v-leave-active {
  transition: opacity 300ms ease-out;
}

.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 30;
  background: rgba(0, 0, 0, 0.5);
}

.modalContainer {
  background: #fafafa;
  width: 200px;
  height: 180px;
  border-radius: 4px;
  position: relative;
}

.modalTextContainer {
  position: absolute;
  width: 100%;
  height: 60%;
}

.modalText {
  margin-top: 1em;
}

.modalBtnContainer {
  display: flex;
  justify-content: space-evenly;
  position: relative;
  top: 108px;
  width: 100%;
  height: 40%;
  border-radius: 0 0 4px 4px;
  border-top: 2px solid rgba(0,0,0,0.2);
  background: #8888;
}

.modalBtn {
  position: relative;
  top: 25%;
  height: 30px;
  width: 80px;
  background-color: #e74c3c;
}

.modalBtn:hover {
  background-color: #ff5341;
}

.modalSendBtn {
  background-color: #1da1f3;
}

.modalSendBtn:hover {
  background-color: #5fb1f1;
}

</style>
