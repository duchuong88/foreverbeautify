import React, { Suspense } from "react";
import bgHeaderTop from "../../assets/images/bg-header-home.png";
import { Page, Link, Toolbar, f7, Sheet, Button } from "framework7-react";
import UserService from "../../service/user.service";
import IconSearch from "../../assets/images/icon-search.png";
import { toast } from "react-toastify";
import { FaRegUser, FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";
// const ModalReviews = React.lazy(() => import("../../components/ModalReviews"));
// const SelectStock = React.lazy(() => import("../../components/SelectStock"));
import ModalReviews from "../../components/ModalReviews";
import SelectStock from "../../components/SelectStock";
import CartToolBar from "../../components/CartToolBar";
import ToolBarBottom from "../../components/ToolBarBottom";
import NotificationIcon from "../../components/NotificationIcon";
import {
  getUser,
  setStockIDStorage,
  getStockIDStorage,
  setStockNameStorage,
  getStockNameStorage,
  removeStockNameStorage,
  setUserLoginStorage,
  setUserStorage,
  getUserLoginStorage,
} from "../../constants/user";
import ListService from "./components/Service/ListService";
import SlideList from "../home/components/BannerSlide/SlideList";
import SlideListCenter from "./components/BannerSlide/SlideListCenter";
import ListImage from "../home/components/Customer/ListImage";
// const ListImage = React.lazy(() =>
//   import("../home/components/Customer/ListImage")
// );
import NewsList from "../home/components/news/NewsList";
// const NewsList = React.lazy(() => import("../home/components/news/NewsList"));
// const QuickAction = React.lazy(() => import("../../components/quickAction"));
import QuickAction from "../../components/quickAction";
// const ProductList = React.lazy(() =>
//   import("../home/components/Product/ProductList")
// );
import ProductList from "../home/components/Product/ProductList";
import ModalChangePWD from "../../components/ModalChangePWD";
import ServiceHot2 from "./components/ServiceHot/ServiceHot2";
import ServiceHot from "./components/ServiceHot/ServiceHot";
import Reviews from "./components/Reviews/Reviews";
import PopupImages from "./components/PopupImages";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      arrNews: [],
      isOpenStock: false,
      width: window.innerWidth,
      showPreloader: false,
      isReload: 0,
      opened: false,
    };
  }

  componentDidMount() {
    const stockName = getStockNameStorage();
    const userCurent = getUser();
    if (userCurent && userCurent.RequirePwd && userCurent.acc_type === "M") {
      this.setState({
        opened: true,
      });
    }
    this.setState({
      stockName: stockName,
    });
  }
  onPageBeforeIn = () => {
    const getStock = getStockIDStorage();

    UserService.getStock()
      .then((response) => {
        let indexStock = 0;
        const arrStock = response.data.data.all;

        const countStock = arrStock.length;
        const CurrentStockID = response.data.data.CurrentStockID;
        if (getStock) {
          indexStock = arrStock.findIndex(
            (item) => item.ID === parseInt(getStock)
          );
        }
        const indexCurrentStock = arrStock.findIndex(
          (item) => item.ID === parseInt(CurrentStockID)
        );

        if (countStock === 2) {
          const StockID = arrStock.slice(-1)[0].ID;
          const TitleStockID = arrStock.slice(-1)[0].Title;
          setStockIDStorage(StockID);
          setStockNameStorage(TitleStockID);
          this.setState({
            isReload: this.state.isReload + 1,
            stockName: TitleStockID,
          });
        }
        setTimeout(() => {
          if (indexCurrentStock <= 0 && indexStock <= 0 && countStock > 2) {
            removeStockNameStorage();
            this.setState({
              isOpenStock: true,
              stockName: null,
            });
          }
        }, 500);
      })
      .catch((e) => console.log(e));
  };

  handleStock = () => {
    this.setState({
      isOpenStock: !this.state.isOpenStock,
    });
  };

  nameStock = (name) => {
    this.setState({
      stockName: name,
    });
  };

  searchPage = () => {
    this.$f7router.navigate("/search/");
  };

  onChangePWD = (values) => {
    const self = this;
    const userCurent = getUser();
    self.$f7.preloader.show();
    //const crpwd = getUserLoginStorage().password || "1234";
    var bodyData = new FormData();
    bodyData.append("pwd", values.password); // New Password
    bodyData.append("repwd", values.re_password); // Nhập lại mật khẩu mới
    //bodyData.append("crpwd", crpwd); // Mật khẩu hiện tai
    bodyData.append("remove_repwd", true);

    UserService.updatePassword(bodyData)
      .then(({data}) => {
        setTimeout(() => {
          self.$f7.preloader.hide();
          if (data.error) {
            toast.error(data.error, {
              position: toast.POSITION.TOP_LEFT,
              autoClose: 2000,
            });
          } else {
            toast.success("New password updated successfully !", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 1000,
            });
            setUserLoginStorage(null, values.password);
            this.setState({
              opened: false,
            });
            setUserStorage(data?.data?.token, {
              ...userCurent,
              token: data?.data?.token,
              RequirePwd: false,
            });
          }
        }, 300);
      })
      .catch((err) => console.log(err));
  };

  loadRefresh(done) {
    setTimeout(() => {
      this.$f7.views.main.router.navigate(this.$f7.views.main.router.url, {
        reloadCurrent: true,
      });
      this.setState({
        showPreloader: true,
      });
      done();
    }, 1000);
  }

  render() {
    const { isOpenStock, stockName, isReload, opened } = this.state;
    return (
      <Page
        noNavbar
        name="home"
        onPageBeforeIn={() => this.onPageBeforeIn()}
        ptr
        infiniteDistance={50}
        infinitePreloader={this.state.showPreloader}
        onPtrRefresh={this.loadRefresh.bind(this)}
      >
        <Sheet
          opened={opened}
          style={{ height: "auto", "--f7-sheet-bg-color": "#fff" }}
          backdrop
          closeByBackdropClick={false}
        >
          <ModalChangePWD onChangePWD={this.onChangePWD} />
        </Sheet>
        <div className="page-wrapper">
          <div className="page-render p-0">
            <div className="home-page">
              <div className="home-page__header">
                <div
                  className="top"
                  style={{
                    background: `url(${bgHeaderTop}) center bottom/cover no-repeat white`,
                  }}
                >
                  <div className="top-content">
                    <div
                      className="location"
                      onClick={() => this.handleStock()}
                    >
                      <FaMapMarkerAlt />
                      <div className="location-name">
                        {stockName && stockName ? stockName : "Are you in where ?"}
                      </div>
                      <div className="down">
                        <FaChevronDown />
                      </div>
                    </div>
                    <div className="menu">
                      <CartToolBar />
                      <NotificationIcon />
                    </div>
                  </div>
                </div>
                <div className="body">
                  <div className="body-search">
                    <button type="button">
                      <img src={IconSearch} />
                    </button>
                    <input
                      type="text"
                      placeholder="What are you looking for today ?"
                      onFocus={this.searchPage}
                    ></input>
                  </div>
                  <SlideList
                    OpenStock={this.handleStock}
                    f7router={this.$f7router}
                    f7={this.$f7}
                    BannerName="APP.BANNER"
                    autoplaySpeed={3000}
                  />
                  <ListService
                    className={`mt-15px ${getUser() ? "" : "mb-10px"}`}
                    id="42"
                    OpenStock={this.handleStock}
                  />
                  {getUser() && (
                    <ListService
                      OpenStock={this.handleStock}
                      f7router={this.$f7router}
                      f7={this.$f7}
                      className="my-10px"
                      id="45"
                    />
                  )}
                </div>
              </div>
              <ServiceHot2
                id="APP.SALE"
                f7router={this.$f7router}
                f7={this.$f7}
                OpenStock={this.handleStock}
              />
              <ServiceHot f7router={this.$f7router} />
              <SlideList
                className={`banner-main bg-white ${
                  window.GlobalConfig.APP.Home?.SliderFull
                    ? "mb-8px"
                    : "px-15px pt-15px"
                } `}
                BannerName="APP.MAIN"
                autoplaySpeed={4000}
                OpenStock={this.handleStock}
                f7router={this.$f7router}
                f7={this.$f7}
              />
              {window.GlobalConfig.APP.Home?.SliderFull ? (
                <SlideList
                  className="banner-main bg-white"
                  BannerName="APP.MAINSALE"
                  autoplaySpeed={4500}
                  OpenStock={this.handleStock}
                  f7router={this.$f7router}
                  f7={this.$f7}
                />
              ) : (
                <SlideListCenter
                  className="mb-8px px-15px pb-15px pt-12px"
                  BannerName="APP.MAINSALE"
                  autoplaySpeed={4500}
                  OpenStock={this.handleStock}
                  f7router={this.$f7router}
                  f7={this.$f7}
                />
              )}
              <SlideList
                containerClass="pl-15px pr-15px slider-hot"
                BannerName="APP.SALE"
                OpenStock={this.handleStock}
                f7router={this.$f7router}
                f7={this.$f7}
              />
              <ProductList />
              <Reviews />
              <ListImage />
              <NewsList />
            </div>
          </div>
        </div>
        
        <PopupImages f7={this.$f7}/>
        
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>

        <SelectStock
          isOpenStock={isOpenStock}
          nameStock={(name) => this.nameStock(name)}
          isReload={isReload}
        />
        <ModalReviews />
        <QuickAction />
      </Page>
    );
  }
}
