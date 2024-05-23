import React from "react";
import { SERVER_APP } from "./../../constants/config";
import { Page, Link, Toolbar, Navbar } from "framework7-react";
import ReactHtmlParser from "react-html-parser";
import ToolBarBottom from "../../components/ToolBarBottom";
import UserService from "../../service/user.service";
import Slider from "react-slick";
import NotificationIcon from "../../components/NotificationIcon";
import NewsDataService from "../../service/news.service";
import { iOS } from "../../constants/helpers";
import { OPEN_LINK } from "../../constants/prom21";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      arrMaps: [],
      arrMaps2: [],
      showPreloader: false,
    };
  }

  componentDidMount() {
    this.setState({ width: window.innerWidth });

    // UserService.getStock()
    //   .then((response) => {
    //     const { all } = response.data.data;
    //     const newAll = all.filter((item) => item.ID !== 778);
    //     this.setState({
    //       arrMaps: newAll,
    //       currentMap: newAll[0].Map,
    //       currentID: newAll[0].ID,
    //     });
    //   })
    //   .catch((e) => console.log(e));

    // NewsDataService.getBannerName("APP.COSO")
    //   .then(({ data }) => {
    //     if (data.data && data.data.length > 0) {
    //       this.setState({
    //         arrMaps2: data.data.map((x) => ({
    //           ...x,
    //           Map: x.Link,
    //         })),
    //       });
    //     }
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
    this.getMapsList();
  }

  getMapsList = async () => {
    let { data: arr1 } = await UserService.getStock();
    let { data: arr2 } = await NewsDataService.getBannerName("APP.COSO");
    let newArr1 = arr1?.data?.all
      ? arr1?.data?.all.filter((item) => item.ID !== 778)
      : [];
    let newArr2 = arr2?.data || [];
    let newMaps = [...newArr1];

    for (let x of newArr2) {
      newMaps.push({
        ...x,
        Map: x.Link,
        LinkSEO: x.FileName,
      });
    }

    this.setState({
      arrMaps: newMaps,
      currentMap: newMaps[0].Map,
      currentID: newMaps[0].ID,
    });
  };

  handStyle = () => {
    const { arrMaps } = this.state;
    const _width =
      arrMaps && arrMaps.length > 1 ? this.state.width - 80 : "100%";
    return Object.assign({
      width: _width,
    });
  };
  handleMaps = (item) => {
    this.setState({
      currentMap: item.Map,
      currentID: item.ID,
    });
  };

  openMaps = (item) => {
    OPEN_LINK(`https://www.google.com/maps/dir/?api=1&destination=${item?.Desc.split(" ").join("+")}`);
  };

  render() {
    const { arrMaps, arrMaps2, currentMap, currentID } = this.state;
    const settingsMaps = {
      className: "slider variable-width",
      dots: false,
      arrows: false,
      infinite: true,
      slidesToShow: 1,
      //centerPadding: "20px",
      variableWidth: true,
    };

    return (
      <Page name="maps">
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.$f7router.back()}>
                <i className="las la-angle-left"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span
                className="title"
                onClick={() =>
                  this.$f7.views.main.router.navigate(
                    this.$f7.views.main.router.url,
                    {
                      reloadCurrent: true,
                    }
                  )
                }
              >
                Base system
              </span>
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
        </Navbar>
        <div className="page-wrapper page-maps">
          {/* <div className="page-maps__back">
            <Link onClick={() => this.$f7router.back()}>
              <i className="las la-arrow-left"></i>
            </Link>
          </div> */}

          <div className="page-render page-maps__box p-0">
            {currentMap && (
              <iframe
                src={ReactHtmlParser(currentMap)}
                frameBorder={0}
                allowFullScreen
                aria-hidden="false"
                tabIndex={0}
                loading="lazy"
              />
            )}
          </div>
          <div className="page-maps__list">
            <Slider {...settingsMaps}>
              {arrMaps &&
                arrMaps.map((item, index) => (
                  <div
                    className={`page-maps__list-item ${
                      currentID === item.ID ? "active" : ""
                    }`}
                    key={index}
                    style={this.handStyle()}
                    onClick={() => this.handleMaps(item)}
                  >
                    <div className="page-maps__list-pd">
                      <div className="star">
                        <i className="las la-star"></i>
                        <i className="las la-star"></i>
                        <i className="las la-star"></i>
                        <i className="las la-star"></i>
                        <i className="las la-star"></i>
                        {iOS() ? (
                          <Link
                            external
                            href={`https://www.google.com/maps/dir/?api=1&destination=${item?.Desc.split(" ").join("+")}`}
                            noLinkClass
                          >
                            <i className="las la-location-arrow"></i>
                          </Link>
                        ) : (
                          <i
                            className="las la-location-arrow"
                            onClick={() => this.openMaps(item)}
                          ></i>
                        )}
                      </div>
                      <h3>{item.Title}</h3>
                      <ul>
                        <li className="address">
                          <i className="las la-map-marked-alt"></i>
                          <div className="min-h-40px">
                            {ReactHtmlParser(item.Desc)}
                          </div>
                        </li>
                        <li className="phone">
                          <i className="las la-phone-volume"></i>
                          {item.LinkSEO || "Not yet"}
                        </li>
                        <li className="time">
                          <span>Opening the door</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
              {arrMaps2 &&
                arrMaps2.map((item, index) => (
                  <div
                    className={`page-maps__list-item ${
                      currentID === item.ID ? "active" : ""
                    }`}
                    key={item.ID}
                    style={this.handStyle()}
                    onClick={() => this.handleMaps(item)}
                  >
                    <div className="page-maps__list-pd">
                      <div className="star">
                        <i className="las la-star"></i>
                        <i className="las la-star"></i>
                        <i className="las la-star"></i>
                        <i className="las la-star"></i>
                        <i className="las la-star"></i>
                        <i className="las la-location-arrow"></i>
                      </div>
                      <h3>{item.Title}</h3>
                      <ul>
                        <li className="address">
                          <i className="las la-map-marked-alt"></i>
                          <div className="min-h-40px">
                            {ReactHtmlParser(item.Desc)}
                          </div>
                        </li>
                        <li className="phone">
                          <i className="las la-phone-volume"></i>
                          {item.FileName || "Chưa có"}
                        </li>
                        <li className="time">
                          <span>Opening the door</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
            </Slider>
          </div>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
