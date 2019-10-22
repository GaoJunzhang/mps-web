import { constantRouterMap } from '@/config/router.config'
import store from '@/store'
// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        const accessedRouters = filterAsyncRouter(store.getters.menus)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

function filterAsyncRouter (routes) {
  return routes.filter((route) => {
    const component = route.component
    if (component) {
      switch (route.component) {
        case 'BasicLayout':
          route.component = BasicLayout
          break
        case 'RouteView':
          route.component = RouteView
          break
        default:
          route.component = view(component)
      }
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children)
      }
      return true
    }
  })
}

function view (path) {
  return function (resolve) {
    import(`@/views/${path}.vue`).then(mod => {
      resolve(mod)
    })
  }
}

export default permission
