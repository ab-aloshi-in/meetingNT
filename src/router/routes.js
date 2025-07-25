import MainLayout from 'layouts/MainLayout.vue';
import ChatPage from 'pages/ChatPage.vue';
import ChannelPage from 'pages/ChannelPage.vue';
import IndexPage from 'src/pages/IndexPage.vue';
import MeetPage from 'pages/MeetPage.vue';
import ScheduleMeeting from 'pages/ScheduleMeeting.vue';
import CalendarPage from 'pages/CalendarPage.vue';
import LoginPage from 'src/pages/Public/LoginPage.vue';
import RegisterPage from 'src/pages/Public/RegisterPage.vue';
import DefaultPage from 'pages/DefaultPage.vue';
import CreateOrganization from 'pages/organisation/createOrganizationPage.vue';
import ForgotPasswordPage from 'src/pages/Public/ForgotPasswordPage.vue';
import ResetPasswordPage from 'src/pages/Public/ResetPasswordPage.vue';
import PublicLayout from 'src/layouts/PublicLayout.vue';
import InstituteList from 'src/pages/organisation/InstituteList.vue';
import CreateUser from 'src/pages/Users/CreateUser.vue';
import EditUser from 'src/pages/Users/EditUser.vue';
import UsersList from'src/pages/Users/UsersList.vue';



const routes = [
  // No layout for these pages
  

  // MainLayout with sidebar
  {
    path: '/', // base path for layout pages
    component: MainLayout,
    children: [
      { path: '/', component: IndexPage },
      { path: '/default', component: DefaultPage },
      { path: '/chat', component: ChatPage },
      { path: '/channel', component: ChannelPage },
      { path: '/meet', component: MeetPage },
      { path: '/schedule-meet', component: ScheduleMeeting },
      { path: '/calendar', component: CalendarPage },
      { path: '/create_organization', component: CreateOrganization },
      { path: '/institutions', component: InstituteList },
      { path: '/institutions/:uniqueName?/filterActive/:isFilterActive?/InstitutionType/:institutionType?/View/:displayView?/Sort/:Sortby?/Status/:status?/search/:searchQuery?/PageCount/:pageCount?/PageSize/:pageSize?', name: "institutions_details", component: InstituteList },
      { path: 'create_user',  component: CreateUser },
      { path: 'edit_user', name: 'editUserPage',  component: EditUser },
      { path: 'users_list', name: 'usersListPage',  component: UsersList },

    ]
  },

  // PublicLayout

  {
    path: '/', // base path for layout pages
    component: PublicLayout,
    children: [
      { path: '/login', component: LoginPage },
      { path: '/register', component: RegisterPage },
      { path: '/forgot_password', component: ForgotPasswordPage },
      { path: '/reset_password', component: ResetPasswordPage },  
    ]
  },

  // Catch-all
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
