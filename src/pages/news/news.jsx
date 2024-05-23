import React, { Suspense } from "react";
import { SERVER_APP } from "./../../constants/config";
import { Page, Link, Toolbar } from "framework7-react";
import ReactHtmlParser from "react-html-parser";
import NewsDataService from "../../service/news.service";
import UserService from "../../service/user.service";
import Slider from "react-slick";
// const ModalReviews = React.lazy(() => import('../../components/ModalReviews'));
// const SelectStock = React.lazy(() => import('../../components/SelectStock'));
// const CartComponent = React.lazy(() =>
//   import("../../components/CartComponent")
// );
import ModalReviews from "../../components/ModalReviews";
import SelectStock from "../../components/SelectStock";
import CartComponent from "../../components/CartComponent";
import ToolBarBottom from "../../components/ToolBarBottom";
import Skeleton from "react-loading-skeleton";
import {
  getUser,
  setStockIDStorage,
  getStockIDStorage,
  setStockNameStorage,
} from "../../constants/user";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      arrNews: [],
      arrBanner: [],
      isOpenStock: false,
    };
  }

  getDateVietnamese = () => {
    var d = new Date();
    var day = d.getDay();
    var date = d.getDate();
    var month = d.getMonth();
    var days = new Array(
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    );
    var months = new Array(
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12"
    );
    return (
      <div className="page-news__header-date">
        <div className="date">
          {days[day]}, {date} tháng {months[month]}
        </div>
        <h3>Today</h3>
      </div>
    );
  };

  handStyle = () => {
    const _width = this.state.width - 100;
    return Object.assign({
      width: _width,
    });
  };

  componentDidMount() {
    const userInfo = getUser();
    this.setState({
      userInfo: userInfo,
    });
    this.$f7ready((f7) => {
      this.setState({ width: window.innerWidth });
      this.getBanner();
      this.getNewsAll();
    });
  }

  getBanner = () => {
    NewsDataService.getBannerName("APP.BANNER")
      .then((response) => {
        const arrBanner = response.data.data;
        this.setState({
          arrBanner: arrBanner,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  getNewsAll = () => {
    NewsDataService.getAll()
      .then((response) => {
        const arrNews = response.data.news;
        this.setState({
          arrNews: arrNews,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  onPageBeforeIn = () => {
    const getStock = getStockIDStorage();
    UserService.getStock()
      .then((response) => {
        const arrStock = response.data.data.all;
        const countStock = arrStock.length;
        const CurrentStockID = response.data.data.CurrentStockID;
        if (countStock === 2) {
          const StockID = arrStock.slice(-1)[0].ID;
          const TitleStockID = arrStock.slice(-1)[0].Title;
          setStockIDStorage(StockID);
          setStockNameStorage(TitleStockID);
        }
        setTimeout(() => {
          if (CurrentStockID === 0 && !getStock && countStock > 2) {
            this.setState({
              isOpenStock: true,
            });
          }
        }, 500);
      })
      .catch((e) => console.log(e));
  };

  render() {
    const { userInfo, arrBanner, arrNews, isOpenStock } = this.state;
    var settingsBanner = {
      dots: true,
      arrows: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      speed: 2000,
      autoplaySpeed: 4000,
    };
    const settingsNews = {
      className: "slider variable-width",
      dots: false,
      arrows: false,
      infinite: true,
      slidesToShow: 1,
      centerPadding: "20px",
      variableWidth: true,
    };
    return (
      <Page noNavbar name="news" onPageBeforeIn={() => this.onPageBeforeIn()}>
        <div className="page-wrapper">
          <div className="page-render">
            <div className="page-news__header">
              {this.getDateVietnamese()}
              <div className="page-news__header-user">
                {userInfo !== null ? (
                  <Link noLinkClass href="/profile/">
                    <i className="las la-user-circle"></i>
                  </Link>
                ) : (
                  <Link noLinkClass href="/login/">
                    <i className="las la-user-circle"></i>
                  </Link>
                )}
              </div>
            </div>
            {arrNews.length === 0 || arrNews === undefined ? (
              <div className="page-news__dear">
                <Skeleton height={500} />
                <div className="page-news__dear-text">
                  <Skeleton count={2} />
                </div>
              </div>
            ) : (
              arrNews.map((item, index) => {
                if (index >= 1) return null;
                return (
                  <div className="page-news__dear" key={item.ID}>
                    <div className="page-news__dear-img">
                      <a href={"/news/detail/" + item.ID + "/"}>
                        <img
                          src={SERVER_APP + item.Thumbnail_web}
                          alt={item.Title}
                        />
                      </a>
                    </div>
                    <div className="page-news__dear-text">
                      <a href={"/news/detail/" + item.ID + "/"}>
                        <h4>{item.Title}</h4>
                        <div className="desc">{ReactHtmlParser(item.Desc)}</div>
                      </a>
                    </div>
                  </div>
                );
              })
            )}

            <div className="page-news__slide">
              <Slider {...settingsBanner}>
                {arrBanner &&
                  arrBanner.map((item, index) => {
                    if (index >= 3) return null;
                    return (
                      <div className="page-news__slide-item" key={item.ID}>
                        <img
                          src={SERVER_APP + "/Upload/image/" + item.FileName}
                          alt={item.Title}
                        />
                      </div>
                    );
                  })}
              </Slider>
            </div>
            <div className="page-news__list">
              <div className="page-news__list-head">
                <h5>News</h5>
                <div className="all">
                  <Link href="/news-list/">
                    See all <i className="las la-angle-right"></i>
                  </Link>
                </div>
              </div>
              <div className="page-news__list-ul">
                <Slider {...settingsNews}>
                  {arrNews &&
                    arrNews.map((item, index) => {
                      if (index < 1 && index < 4) return null;
                      return (
                        <div
                          className="page-news__list-item"
                          key={item.ID}
                          style={this.handStyle()}
                        >
                          <div className="images">
                            <a href={"/news/detail/" + item.ID + "/"}>
                              <img
                                src={SERVER_APP + item.Thumbnail_web}
                                alt={item.Title}
                              />
                            </a>
                          </div>
                          <div className="text">
                            <a href={"/news/detail/" + item.ID + "/"}>
                              <h6>{item.Title}</h6>
                              <div className="desc">
                                {ReactHtmlParser(item.Desc)}
                              </div>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                </Slider>
              </div>
            </div>
          </div>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
        <SelectStock isOpenStock={isOpenStock} />
        <ModalReviews />
        <CartComponent />
      </Page>
    );
  }
}
