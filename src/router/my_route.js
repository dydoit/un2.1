export default [
  { // 我的指令
    path: 'my-instruction',
    component: () =>import('@/components/layout/content.vue'),
    meta: {
      MENU_ID: '1003'
    },
    children: [
      {
        path: '',
        redirect: 'list'
      },
      {
        path: 'list',
        name: 'InstructList',
        meta: {
          name: '我的指令',
          parentPath: '/home/my-instruction',
          MENU_ID: '100301'
        },
        component:() =>import('../views/my/instruct/instruct-list.vue')
      },
      {
        path: 'instruct-manage',
        component: () =>import('../views/my/instruct/instruct-manage.vue'),
        meta: {
          parentName: '我的指令',
          parentPath: '/home/my-instruction',
          name: '指令编辑',
          MENU_ID: '10030101'
        }
      },
      {
        path: 'detail',
        component:() => import('../views/my/instruct/instruct-detail.vue'),
        meta: {
          parentName: '我的指令',
          parentPath: '/home/my-instruction',
          name: '指令详情',
          MENU_ID: '10030103'
        }
      }
    ]
  },
  {// 我的指令模板
    path: 'my-instruction-temp',
    component: () =>import('@/components/layout/content.vue'),
    children: [
      {
        path: '',
        redirect: 'list'
      },
      {
        path: 'list',
        component:() => import('../views/my/instructTemp/instruct-template.vue'),
        meta: {
          name: '我的指令模板',
          parentPath: '/home/my-instruction-temp',
          MENU_ID: '100302'
        }
      },
      {
        path: 'temp-manage',
        component: () => import('../views/my/instructTemp/instruct-temp-edit.vue'),
        meta: {
          name: '指令模板编辑',
          parentName: '我的指令模板',
          parentPath: '/home/my-instruction-temp',
          MENU_ID: "10030201"
        }
      },
      {
        path: 'temp-details',
        component: () =>import('../views/my/instructTemp/instruct-temp-details.vue'),
        meta: {
          parentName: '我的指令模板',
          parentPath: '/home/my-instruction-temp',
          name: '指令模板详情',
          MENU_ID: "10030201"
        }
      },
      {
        path: 'parsing',
        component: () => import('../views/my/instructTemp/instruct-temp-parsing.vue'),
        meta: {
          name: '指令解析',
          parentName: '我的指令模板',
          parentPath: '/home/my-instruction-temp'
        }
      }
    ]
  },
  { // 我的任务
    path:'my-task',
    component: () =>import('@/components/layout/content.vue'),
    children: [
      {
        path: '',
        redirect: 'list'
      },
      {
        path: 'list',
        component:() => import('../views/my/task/task-list.vue'),
        meta: {
          name: '我的任务',
          parentPath: '/home/my-task'
        }
      },
      {
        path: 'manage',
        component: () => import('../views/my/task/task-add.vue'),
        meta: {
          parentName: '我的任务',
          parentPath: '/home/my-task',
          name: '任务管理'
        }
      },
      {
        path: 'add-step',
        component: () => import('../views/my/task/task-add-step.vue'),
        meta: {
          parentName: '我的任务',
          parentPath: '/home/my-task',
          name: '任务管理'
        }
      },
      {
        path: 'taskLog/:id',
        name: 'taskLog',
        meta: {
          parentName: '我的任务',
          parentPath: '/home/my-task',
          name: '任务日志'
        },
        component: () => import('@/views/my/task/taskLog.vue')
      }
    ]
  },
  {// 我的任务模板
    path:'my-task-temp',
    component:() =>import('@/components/layout/content.vue'),
    children: [
      {
        path: '',
        redirect: 'list'
      },
      {
        path: 'list',
        component:() =>import('../views/my/taskTemp/task-temp.vue'),
        meta: {
          name: '我的任务模板',
          parentPath: '/home/my-task-temp'
        }
      },
      {
        path: 'temp-manage',
        component:() => import('../views/my/taskTemp/task-temp-add.vue'),
        meta: {
          name: '模板管理',
          parentPath: '/home/my-task-temp',
          parentName: '我的任务模板'
        }
      },
      {
        path: 'temp-drag',
        component: () => import('../views/my/taskTemp/task-temp-drag.vue'),
        meta: {
          name: '模板管理',
          parentPath: '/home/my-task-temp',
          parentName: '我的任务模板'
        }
      }
    ]
  },
   {// 我的数据处理脚本
    path:'my-data-script',
    component:() =>import('@/components/layout/content.vue'),
    children: [
      {
        path: '',
        redirect: 'list'
      },
      {
        path: 'list',
        component:() =>import('../views/my/dataScript/list.vue'),
        meta: {
          name: '我的数据处理脚本',
          parentPath: '/home/my-data-script'
        }
      },
      {
        path: 'add',
        component: () => import('../views/my/dataScript/add.vue'),
        meta: {
          name: '新增脚本',
          parentPath: '/home/my-data-script',
          parentName: '我的处理脚本'
        }
      },
      {
        path: 'detail',
        component: () => import('../views/my/dataScript/detail.vue'),
        meta: {
          name: '脚本详情',
          parentName: '我的处理脚本',
          parentPath: '/home/my-data-script'
        }
      }
    ]
  }
]
