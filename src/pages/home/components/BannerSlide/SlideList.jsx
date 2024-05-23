import React from "react";
import { Link } from "framework7-react";
import NewsDataService from "../../../../service/news.service";
import Slider from "react-slick";
import { SERVER_APP } from "../../../../constants/config";
import Skeleton from "react-loading-skeleton";
import { validURL } from "../../../../constants/helpers";
import { PopupConfirm } from "../PopupConfirm";
import BookDataService from "../../../../service/book.service";
import { toast } from "react-toastify";
import { getStockIDStorage, getUser } from "../../../../constants/user";
import { OPEN_LINK } from "../../../../constants/prom21";

export default class SlideList extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      show: false,
      initialValues: null,
      btnLoading: false,
    };
  }

  componentDidMount() {
    this.getBanner();
  }

  getBanner = () => {
    NewsDataService.getBannerName(this.props.BannerName)
      .then((response) => {
        const arrBanner = response.data.data;
        this.setState({
          arrBanner: arrBanner,
          isLoading: false,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  onHide = () => {
    this.setState({
      show: false,
      initialValues: null,
    });
  };

  onSubmit = (values) => {
    let StockID = getStockIDStorage();
    if (!StockID) {
      this.props.OpenStock();
    } else {
      this.setState({
        btnLoading: true,
      });
      var p = {
        contact: {
          Fullname: values.Fullname,
          Phone1: values.Phone,
          Address: "",
          Email: "",
          Content: values.Content,
        },
      };
      BookDataService.bookContact(p)
        .then(({ data }) => {
          toast.success("Đăng ký chương trình ưu đãi thành công !", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
          this.setState({
            btnLoading: false,
            show: false,
            initialValues: null,
          });
        })
        .catch((error) => console.log(error));
    }
  };

  handleUrl = (item) => {
    const userCurent = getUser();
    if (validURL(item.Link)) {
      OPEN_LINK(item.Link);
    } else if (item.Link && item.Link.includes("/schedule/")) {
      const url = `${item.Link}&note=${encodeURIComponent(item.Title)}`;
      this.$f7.views.main.router.navigate(userCurent ? url : "/login/");
    } else if (item.Link && item.Link.includes("/pupup-contact/")) {
      this.setState({
        show: true,
        initialValues: item,
      });
    } else {
      this.$f7.views.main.router.navigate(item.Link);
    }
  };

  render() {
    const { arrBanner, isLoading, initialValues, btnLoading, show } =
      this.state;
    var settingsBanner = {
      dots: true,
      arrows: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: this.props.autoplaySpeed,
    };
    if (arrBanner && arrBanner.length === 0) {
      return "";
    }
    return (
      <React.Fragment>
        {!isLoading && (
          <React.Fragment>
            {arrBanner && arrBanner.length > 0 && (
              <div className={this.props.containerClass}>
                <div className={`body-slide ${this.props.className}`}>
                  <Slider {...settingsBanner}>
                    {arrBanner &&
                      arrBanner.map((item, index) => {
                        if (index >= 5) return null;
                        return (
                          <Link
                            noLinkClass
                            onClick={() => this.handleUrl(item)}
                            className={`body-slide__item d-block ${
                              !window.GlobalConfig.APP.Home?.SliderFull &&
                              "rounded"
                            } overflow-hidden ${
                              validURL(item.Link) ? "external" : ""
                            }`}
                            key={item.ID}
                          >
                            <img
                              src={
                                SERVER_APP + "/Upload/image/" + item.FileName
                              }
                              alt={item.Title}
                            />
                          </Link>
                        );
                      })}
                  </Slider>
                </div>
              </div>
            )}
          </React.Fragment>
        )}
        {isLoading && (
          <div className={this.props.containerClass}>
            <div className={`body-slide ${this.props.className}`}>
              {isLoading && <Skeleton height={150} />}
            </div>
          </div>
        )}
        <PopupConfirm
          initialValue={initialValues}
          show={show}
          onHide={() => this.onHide()}
          onSubmit={(values) => this.onSubmit(values)}
          btnLoading={btnLoading}
        />
      </React.Fragment>
    );
  }
}
