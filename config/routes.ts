export default [
  { path: '/', redirect: '/review' },
  {
    path: '/user',
    layout: false,
    redirect: '/user/login',
    routes: [{ name: '管理员登录', path: '/user/login', component: './User/Login' }],
  },
  {
    name: '审核页面',
    path: '/review',
    icon: 'crown',
    routes: [
      {
        name: '报名登记表审核',
        path: '/review',
        icon: 'PicLeftOutlined',
        component: './Review/ReviewList',
      },
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
        path: '/admin',
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
      {
        name: '高校与高校类型关联信息管理',
        path: '/school/school/type',
        icon: 'LinkedinOutlined',
        component: './School/SchoolSchoolTypeList',
      },
    ],
  },
  {
    name: '招聘信息管理',
    path: 'job',
    icon: 'AppstoreAddOutlined',
    routes: [
      {
        name: '岗位信息管理',
        path: '/job',
        icon: 'BarcodeOutlined',
        component: './Job/JobList',
      },
      {
        name: '干部类型管理',
        path: '/job/cadre/type',
        icon: 'BookOutlined',
        component: './Job/CadreTypeList',
      },
      {
        name: '截止时间管理',
        path: '/job/deadline',
        icon: 'CalendarOutlined',
        component: './Job/DeadlineList',
      },
    ],
  },
  {
    name: '报名登记信息管理',
    path: 'registration',
    icon: 'PieChartOutlined',
    routes: [
      {
        name: '报名登记信息管理',
        path: '/registration',
        icon: 'BarChartOutlined',
        component: './Registration/RegistrationList',
      },
      {
        name: '教育经历信息管理',
        path: '/registration/education',
        icon: 'AreaChartOutlined',
        component: './Registration/EducationList',
      },
      {
        name: '家庭关系信息管理',
        path: '/registration/family',
        icon: 'RadarChartOutlined',
        component: './Registration/FamilyList',
      },
    ],
  },
  {
    name: '文件信息管理',
    path: 'file',
    icon: 'FileProtectOutlined',
    routes: [
      {
        name: '文件上传日志管理',
        path: '/file/log',
        icon: 'FileSearchOutlined',
        component: './File/FileLogList',
      },
      {
        name: '文件上传类型管理',
        path: '/file/type',
        icon: 'FileUnknownOutlined',
        component: './File/FileTypeList',
      },
    ],
  },
  {
    name: '消息通知管理',
    path: 'message',
    icon: 'MessageOutlined',
    routes: [
      {
        name: '面试通知管理',
        path: '/message/notice',
        icon: 'NotificationOutlined',
        component: './Message/MessageNoticeList',
      },
      {
        name: '短信推送管理',
        path: '/message/push',
        icon: 'SendOutlined',
        component: './Message/MessagePushList',
      },
      {
        name: '系统消息管理',
        path: '/message/system',
        icon: 'SettingOutlined',
        component: './Message/SystemMessageList',
      },
    ],
  },
  {
    name: '操作日志信息管理',
    path: 'operation',
    icon: 'FontColorsOutlined',
    component: './Operation/OperationList',
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
