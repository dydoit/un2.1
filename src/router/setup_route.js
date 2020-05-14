export default[
    {
        path: '/dicList',
        component: () => import('../views/setup/dict/dictList.vue')
    },
    {
        path:'/dictEdit',
        component:() => import('../views/setup/dict/dictEdit.vue')
    },
    {// 角色管理
        path: '/role-set',
        component: () =>import('@/components/layout/content.vue'),
        children: [
            {
                path: '',
                redirect: 'list'
            },
            {
                path: 'list',
                component:() => import('../views/setup/role/roleList.vue'),
                meta: {
                    name: '角色列表',
                    parentPath: '/role-set',
                }
            },
            {
                path: 'role-edit',
                component: () =>import('../views/setup/role/roleEdit.vue'),
                meta: {
                    parentName: '角色列表',
                    parentPath: '/role-set',
                    name: '角色编辑',
                }
            }
        ]
    },
    {// 角色管理
        path: '/member-set',
        component: () =>import('@/components/layout/content.vue'),
        children: [
            {
                path: '',
                redirect: 'list'
            },
            {
                path: 'list',
                component:() => import('../views/setup/member/memberList.vue'),
                meta: {
                    name: '用户列表',
                    parentPath: '/member-set',
                }
            },
            {
                path: 'member-edit',
                component: () =>import('../views/setup/member/memberEdit.vue'),
                meta: {
                    parentName: '用户列表',
                    parentPath: '/member-set',
                    name: '用户编辑',
                }
            }
        ]
    },
    {// 日志管理
        path: '/log-set',
        component: () =>import('@/components/layout/content.vue'),
        children: [
            {
                path: '',
                redirect: 'list'
            },
            {
                path: 'list',
                component:() => import('../views/setup/log/logList.vue'),
                meta: {
                    name: '日志列表',
                    parentPath: '/log-set',
                }
            },
        ]
    },
    {// 字典项管理
        path: '/dict-set',
        component: () =>import('@/components/layout/content.vue'),
        children: [
            {
                path: '',
                redirect: 'list'
            },
            {
                path: 'list',
                component:() => import('../views/setup/dict/dictList.vue'),
                meta: {
                    name: '字典项列表',
                    parentPath: '/dict-set',
                }
            },
            {
                path: 'dict-edit',
                component: () =>import('../views/setup/dict/dictEdit.vue'),
                meta: {
                    parentName: '字典项列表',
                    parentPath: '/dict-set',
                    name: '字典项编辑',
                }
            }
        ]
    },
]
