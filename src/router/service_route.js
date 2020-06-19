export default [
  {
    path: 'service',
    component: () => import('@/components/layout/content.vue'),
    children: [
      {
        path: '',
        redirect: 'list'
      },
      {
        path: 'list',
        meta:{
          name: '应用接口',
          parentPath: '/home/service',
        },
        component:()=>import('@/views/service/list.vue')
      },
      {
        path: 'add',
        meta: {
          parentName: '应用接口',
          name: '新增应用',
          parentPath: '/home/service'
        },
        component:()=>import('@/views/service/edit.vue')
      },
      {
        path: 'modify',
        meta: {
          parentName: '应用接口',
          name: '修改应用',
          parentPath: '/home/service'
        },
        component:()=>import('@/views/service/modify.vue')
      },
      {
        path:'manage',
        meta: {
          name:'应用接口管理',
          parentPath: '/home/service'
        },
        component:() => import('@/views/service/manage.vue')
      },
      {
        path: 'notebook',
        meta: {
          name:'开发者手册',
          parentPath: '/home/service',
        },
        component:()=> import('@/views/service/notebook.vue')
      }
    ]
  }
]
