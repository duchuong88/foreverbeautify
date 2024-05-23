import HomeIndex from "../pages/home/homeIndex";
import SlideDetail from "../pages/home/components/BannerSlide/SlideDetail";

//import NewsPage from '../pages/news/news.jsx';
import NewsListPage from "../pages/news/newsList.jsx";
import NewsDetailPage from "../pages/news/newsDetail";

import RulesListPage from "../pages/rules/rulesList.jsx";

import ShopPage from "../pages/shop/shop";
//import ShopCatePage from '../pages/shop/shopCate';
import ShopListProductPage from "../pages/shop/shopListProduct";
import ShopListServicePage from "../pages/shop/shopListService";
import ShopDetailPage from "../pages/shop/shopDetail";
import ShopPayPage from "../pages/shop/shopPay";
import ShopPayInfoPage from "../pages/shop/ShopPayInfo";
import ShopPaySuccessPage from "../pages/shop/shopPaySuccess";

import MapsPage from "../pages/maps/maps";

import LoginPage from "../pages/user/login";
import LoginOTPPage from "../pages/user/loginOTP";
import RegistrationPage from "../pages/user/registration";
import ForgotPage from "../pages/user/forgot";
import ForgotChangePage from "../pages/user/forgot-change";
import NotificationPage from "../pages/user/Notification";
import NotificationDetailPage from "../pages/user/NotificationDetail";
import ProfilePage from "../pages/user/profile";
import DetailProfilePage from "../pages/user/DetailProfile";
import CardServicePage from "../pages/user/cardService"; //Thẻ dịch vụ
import SchedulePage from "../pages/user/Schedule"; //Đặt lịch
import ScheduleManagePage from "../pages/user/SchedulesManage"; // Quản lí đặt lịch
import VoucherPage from "../pages/user/Voucher"; // Mã giảm giá
import WalletPage from "../pages/user/Wallet"; // Ví điện tử
import DiaryPage from "../pages/user/Diary"; // Nhật ký
import RatingListPage from "../pages/user/RatingList";
import BarCodePage from "../pages/user/userBarcode";
import OrderPage from "../pages/user/userOrder";
import EditEmailPage from "../pages/user/editEmail";
import EditPasswordPage from "../pages/user/editPassword";

//Employee - Nhân viên

import EmployeeServicePage from "../pages/employee/timeKeeping/employeeService";
import EmployeeServiceDetailPage from "../pages/employee/timeKeeping/employeeServiceDetail";
import EmployeeServiceDiaryPage from "../pages/employee/timeKeeping/employeeServiceDiary";
import EmployeeServiceSchedulePage from "../pages/employee/timeKeeping/employeeServiceSchedule";
import EmployeeServiceHistoryPage from "../pages/employee/timeKeeping/employeeServiceHistory";
import EmployeeStatisticalPage from "../pages/employee/statistical/employeeStatistical";
import employeeListImagesPage from "../pages/employee/timeKeeping/employeeListImages";
import employeeAttachments from "../pages/employee/timeKeeping/employeeAttachments";
import ReportKGPage from "../pages/report-kg/ReportKG";
// Thống kê
import ReportPage from "../pages/report/index";

import WheelSpinPage from "../pages/user/WheelSpin.jsx";

// Pos bán hàng
import PosPage from "../pages/pos/Pos";

import SearchPage from "../pages/search/index";
import NotFoundPage from "../pages/404.jsx";
import { getUser } from "../constants/user";
import ServiceOriginal from "../pages/shop/ServiceOriginal";

function checkAuth(to, from, resolve, reject) {
  var router = this;
  if (getUser()) {
    resolve();
  } else {
    reject();
    router.navigate("/login/");
  }
}

const checkRouterHome = () => {
  const infoUser = getUser();

  const ACC_TYPE = infoUser && infoUser.acc_type;
  if (window?.GlobalConfig?.APP?.OnlyStaff && !infoUser) {
    return LoginPage;
  }
  if (ACC_TYPE === "M") {
    return HomeIndex;
  }

  if (ACC_TYPE === "U") {
    if (infoUser.ID === 1) {
      return ReportPage;
    } else {
      const groupRole = infoUser.GroupTitles;
      if (groupRole.includes("service")) {
        return EmployeeServicePage;
      } else if (groupRole.includes("director")) {
        return EmployeeStatisticalPage;
      } else {
        return EmployeeStatisticalPage;
      }
    }
  }
  return HomeIndex;
};

var routes = [
  {
    path: "/",
    asyncComponent: () => checkRouterHome(),
  },
  {
    path: "/bao-kg/",
    asyncComponent: () => ReportKGPage,
    beforeEnter: checkAuth,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/news/",
    asyncComponent: () => HomeIndex,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/adv/:id",
    asyncComponent: () => SlideDetail,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/news-list/",
    asyncComponent: () => NewsListPage,
  },
  {
    path: "/news-list/:id",
    asyncComponent: () => NewsListPage,
  },
  {
    path: "/news/detail/:postId/",
    asyncComponent: () => NewsDetailPage,
  },
  {
    path: "/rules-list/",
    asyncComponent: () => RulesListPage,
  },
  {
    path: "/shop/",
    asyncComponent: () => ShopPage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/pay/",
    component: ShopPayPage,
    beforeEnter: checkAuth,
  },
  {
    path: "/pay-info/",
    asyncComponent: () => ShopPayInfoPage,
  },
  {
    path: "/pay-success/:orderID",
    component: ShopPaySuccessPage,
  },
  {
    path: "/vong-quay/",
    component: WheelSpinPage,
    beforeEnter: checkAuth,
  },

  {
    path: "/shop/:cateId",
    async(routeTo, routeFrom, resolve, reject) {
      const cateID = routeTo.params.cateId;
      const cateidparams = routeTo.query.cateid;
      if (Number(cateID) === 795 || Number(cateidparams) === 795) {
        resolve({
          component: ShopListServicePage,
        });
      } else {
        resolve({
          component: ShopListProductPage,
        });
      }
    },
  },
  {
    path: "/shop/list/:parentId/:cateId",
    async(routeTo, routeFrom, resolve, reject) {
      const cateParentID = routeTo.params.parentId;
      if (cateParentID === "795") {
        resolve({
          component: ShopListServicePage,
        });
      } else {
        resolve({
          component: ShopListProductPage,
        });
      }
    },
    //component: ShopListPage,
  },
  {
    path: "/shop/selected/:id",
    asyncComponent: () => ServiceOriginal,
  },
  {
    path: "/shop/detail/:cateId",
    asyncComponent: () => ShopDetailPage,
  },
  {
    path: "/maps/",
    asyncComponent: () => MapsPage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/login/",
    asyncComponent: () => LoginPage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/login-otp/",
    asyncComponent: () => LoginOTPPage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/registration/",
    asyncComponent: () => RegistrationPage,
    options: {
      transition: "f7-cover-v",
    },
  },
  {
    path: "/forgot/",
    asyncComponent: () => ForgotPage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/forgot-change/",
    asyncComponent: () => ForgotChangePage,
    options: {
      transition: "f7-cover-v",
    },
  },
  {
    path: "/profile/",
    asyncComponent: () => ProfilePage,
    options: {
      transition: "f7-cover",
    },
    beforeEnter: checkAuth,
  },
  {
    path: "/detail-profile/",
    asyncComponent: () => DetailProfilePage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/edit-email/",
    asyncComponent: () => EditEmailPage,
  },
  {
    path: "/edit-password/",
    asyncComponent: () => EditPasswordPage,
  },
  {
    path: "/cardservice/", // Thẻ dịch vụ
    asyncComponent: () => CardServicePage,
    beforeEnter: checkAuth,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/schedule/", // Thẻ dịch vụ
    asyncComponent: () => SchedulePage,
    beforeEnter: checkAuth,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/schedule/:ID", // Thẻ dịch vụ
    asyncComponent: () => SchedulePage,
    beforeEnter: checkAuth,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/manage-schedules/", // Quản lý Thẻ dịch vụ
    asyncComponent: () => ScheduleManagePage,
    beforeEnter: checkAuth,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/barcode/", // Check In
    asyncComponent: () => BarCodePage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/order/", // Check In
    asyncComponent: () => OrderPage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/voucher/", // Mã giảm giá
    asyncComponent: () => VoucherPage,
  },
  {
    path: "/wallet/", // Ví điện tử
    asyncComponent: () => WalletPage,
  },
  {
    path: "/diary/", // Nhật ký
    asyncComponent: () => DiaryPage,
  },
  {
    path: "/rating/", // Nhật ký
    asyncComponent: () => RatingListPage,
  },
  {
    path: "/notification/", // Thông báo Noti
    asyncComponent: () => NotificationPage,
    beforeEnter: checkAuth,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/notification/:id", // Thông báo Noti
    asyncComponent: () => NotificationDetailPage,
    options: {
      transition: "f7-cover",
    },
    beforeEnter: checkAuth,
  },
  {
    path: "/employee/service/", // Nhân viên dịch vụ
    asyncComponent: () => EmployeeServicePage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/employee/service/:id/", // Nhân viên dịch vụ chi tiết
    asyncComponent: () => EmployeeServiceDetailPage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/employee/images/:id/", // Hình ảnh dịch vụ
    asyncComponent: () => employeeListImagesPage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/employee/attachments/:id/", // Hình ảnh
    asyncComponent: () => employeeAttachments,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/employee/diary/:id/", // Nhân viên nhật ký
    asyncComponent: () => EmployeeServiceDiaryPage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/employee/schedule/:orderItem/", // Nhân viên lịch trình
    asyncComponent: () => EmployeeServiceSchedulePage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/employee/history/:orderItem/:memberId", // Nhân viên lịch sử
    asyncComponent: () => EmployeeServiceHistoryPage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/employee/statistical/", // Thống kê
    asyncComponent: () => EmployeeStatisticalPage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/report/", // Báo cáo ngày
    asyncComponent: () => ReportPage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/report/date/", // Báo cáo ngày
    asyncComponent: () => ReportingDatePage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/report/customer/", // Khách hàng
    asyncComponent: () => ReportCustomerPage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/report/sell/", // Bán hàng
    asyncComponent: () => ReportSellPage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/report/services/", // Dịch vụ
    asyncComponent: () => ReportServicesPage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/report/cash-book/", // Sổ quỹ
    asyncComponent: () => ReportCashBookPage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/report/monthly/", // Thu chi
    asyncComponent: () => ReportMonthlyPage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/pos/", // Pos bán hàng
    asyncComponent: () => PosPage,
    options: {
      transition: "f7-cover",
    },
  },
  {
    path: "/search/",
    asyncComponent: () => SearchPage,
  },
  {
    path: "(.*)",
    component: NotFoundPage,
  },
];

export default routes;
