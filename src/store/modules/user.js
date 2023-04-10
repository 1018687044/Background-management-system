import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { asyncRoutes, resetRouter, constantRoutes, anyRoutes } from '@/router'
import router from '@/router'
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    // 服务器返回菜单信息【根据不同的角色：返回标记信息，数组里面的元素是字符串】
    routes: [],
    // 角色信息
    roles: [],
    // 按钮权限信息
    buttons: [],
    // 对比之后【项目中已有的异步路由，与服务器返回的标记信息进行对比最终需要展示的路由】
    resultAsyncRoutes: [],
    // 用户最终需要展示的全部路由
    resultAllRputes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.routes = userInfo.routes
    state.buttons = userInfo.buttons
    state.roles = userInfo.roles
  },
  // 最终计算出的异步路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    state.resultAsyncRoutes = asyncRoutes
    state.resultAllRputes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes)
    router.addRoutes(state.resultAllRputes)
  }
}

const computedAsyncRoutes = (asyncRoutes, routes) => {
  return asyncRoutes.filter((item) => {
    if (routes.indexOf(item.name) !== -1) {
      // 递归
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}
const actions = {
  // 这里在处理登录业务
  async login({ commit }, userInfo) {
    // 结构出用户名和密码
    const { username, password } = userInfo
    const result = await login({ username: username.trim(), password: password })
    // eslint-disable-next-line eqeqeq
    if (result.code == 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const { data } = response
          if (!data) {
            return reject('Verification failed, please Login again.')
          }
          commit('SET_USERINFO', data)
          commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken() // must remove  token  first
          resetRouter()
          commit('RESET_STATE')
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
