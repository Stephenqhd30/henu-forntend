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
    icon: 'crown',
    routes: [
      { name: '报名登记表审核', path: '/review', icon: "PicLeftOutlined", component: './Review/ReviewList' },
      {
        name: '审核日志',
        access: 'canAdmin',
        path: '/review/log',
        icon: 'PicCenterOutlined',
        component: './Review/ReviewLogList',
      },
    ],
  },
  {
    name: '人员信息管理',
    path: 'admin',
    icon: 'UserOutlined',
    routes: [
      {
        name: '管理员管理',
        access: 'canAdmin',
        path: '/admin/admin',
        icon: 'UsergroupAddOutlined',
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
    name: '高校信息管理',
    path: 'school',
    icon: 'FundProjectionScreenOutlined',
    routes: [
      {
        name: '高校信息管理',
        path: '/school',
        icon: 'ScheduleOutlined',
        component: './School/SchoolList',
      },
      {
        name: '高校类型信息管理',
        path: '/school/type',
        icon: 'FontSizeOutlined',
        component: './School/SchoolTypeList',
      },
    ],
  },
  {
    name: '岗位信息管理',
    path: 'job',
    icon: 'FontColorsOutlined',
    routes: [
      {
        name: '岗位信息管理',
        path: 'job',
        icon: 'UnderlineOutlined',
        component: './Job/JobList',
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
