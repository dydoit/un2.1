export default [
  {
    path:'network',
    component:() =>import('@/components/layout/content.vue'),
    children: [
      {
        path: '',
        redirect: 'list'
      },
      {
        path: 'list',
        component: () => import('@/views/network/networkList.vue'),
        meta: {
          name:'网元列表',
          parentPath: '/home/network'
        }
      },
      {
        path:'networkDetail',
        component:() => import('@/views/network/networkDetail.vue'),
        meta: {
          name: '网元详情',
          parentPath: '/home/network',
          parentName: '网元管理',
        }
      },
      {
        path:'networkChildDetail',
        component:() => import('@/views/network/networkChildDetail.vue'),
        meta: {
          name: '网元详情',
          parentPath: '/home/network',
          parentName: '网元管理',
        }
      },
      {
        path: 'networkAdd',
        component: () => import('@/views/network/networkAdd.vue'),
        meta: {
          name: '网元编辑',
          parentPath: '/home/network',
          parentName: '网元管理',
        }
      },
      {
        path: 'networkError',
        component: () => import('@/views/network/networkError.vue'),
        meta: {
          name: '网元报错',
          parentPath: '/home/network',
          parentName: '网元管理',
        }
      }
    ]
  },
]


