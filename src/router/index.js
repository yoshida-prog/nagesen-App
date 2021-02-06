import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'
import Signin from '../views/Signin.vue'
import Signup from '../views/Signup.vue'
import Dashboard from '../views/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Signin',
    component: Signin
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/dashboard/:userId',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// toは次にナビゲーションされるルート、fromはナビゲーション元、nextはフックを解決するための関数
// 例えばnext({ name: 'Signin' })とすると引数のパスにリダイレクトする
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // currentUserで現在ログインしているユーザーを取得する
    // これがtrueであればそのままページ遷移する
    if (firebase.auth().currentUser) {
      next()
      return
    }
    // 現在ログインしているユーザーを取得するときonAuthStateChangedでオブザーバーを設定する
    // これはAuthオブジェクトが中間状態でないことを確認できる
    // つまり中間状態であればリダイレクトすれば良い
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        next()
      } else {
        next({ name: 'Signin' })
      }
      return
    })
  }
  next()
})

export default router
