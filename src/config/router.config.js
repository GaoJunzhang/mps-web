// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        hidden: true,
        component: () => import(/* webpackChunkName: "fail" */ '@/views/welcome/welcome')
      },
      {
        path: '/user',
        component: RouteView,
        redirect: '/user/userList',
        name: 'user',
        meta: { title: '用户管理', icon: 'user', keepAlive: false, permission: ['user'] },
        children: [
          {
            path: '/user/userList',
            name: 'UserList',
            component: () => import('@/views/user/UserList'),
            meta: { title: '用户列表', permission: ['userList'] }
          },
          {
            path: '/user/RoleList',
            name: 'RoleList',
            component: () => import('@/views/role/RoleList'),
            meta: { title: '角色列表', permission: ['roleList'], keepAlive: true }
          }
        ]
      },
      {
        path: '/task',
        component: RouteView,
        redirect: '/task/taskList',
        name: 'task',
        meta: { title: '任务管理', icon: 'project', keepAlive: false, permission: ['tasks'] },
        children: [
          {
            path: '/task/taskList',
            name: 'TaskList',
            component: () => import('@/views/task/TaskList'),
            meta: { title: '任务列表', permission: ['taskList'] }
          }
        ]
      },
      {
        path: '/auth',
        component: RouteView,
        redirect: '/auth/authList',
        name: 'auth',
        meta: { title: '系统管理', icon: 'setting', keepAlive: false, permission: ['auth'] },
        children: [
          {
            path: '/auth/authList',
            name: 'authList',
            component: () => import('@/views/auth/authList'),
            meta: { title: '菜单管理', permission: ['authList'] }
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    component: UserLayout,
    hidden: true,
    redirect: '/login',
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/RegisterResult')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/404')
  }

]
