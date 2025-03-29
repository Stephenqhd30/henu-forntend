export default [
  { path: '/' },
  {
    path: '/user',
    layout: false,
    routes: [{ name: '管理员登录', path: '/user/login', component: './User/Login' }],
  },
  {
    name: '审核页面',
    path: '/review',
    icon: 'UserOutlined',
    component: './Review',
  },
  {
    name: '管理页',
    path: 'admin',
    icon: 'crown',
    routes: [
      {
        name: '管理员管理',
        access: "canAdmin",
        path: '/admin/admin',
        icon: 'PicCenterOutlined',
        component: './Admin/AdminList',
      },
      {
        name: '用户管理',
        path: '/admin/user',
        icon: 'UserOutlined',
        component: './Admin/UserList',
      },
    ],
  },
  {
    name: 'exception',
    icon: 'warning',
    path: '/exception',
    layout: false,
    routes: [
      {
        path: '/exception',
        redirect: '/exception/403',
      },
      {
        name: '403',
        path: '/exception/403',
        component: './Exception/403',
      },
      {
        name: '404',
        path: '/exception/404',
        component: './Exception/404',
      },
      {
        name: '500',
        path: '/exception/500',
        component: './Exception/500',
      },
    ],
  },
  { path: '*', layout: false, component: './Exception/404' },
];
