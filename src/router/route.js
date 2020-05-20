import NetworkRoutes from './network_route'
import MyRoutes from './my_route'
import SetupRoutes from './setup_route'

export default [
  {
    path: '/',
    redirect:'/home'
  },
  {
    path: '/home',
    component: () => import('@/App.vue'),
    children: [
      {
        path: '',
        component: ()=> import('@/views/home/index.vue')
      },
      ...NetworkRoutes,
      ...MyRoutes,
      ...SetupRoutes
    ]
  },
  {
    path: '/my-test',
    component: ()=>import('@/views/my/instructTest/index.vue')
  }
]


