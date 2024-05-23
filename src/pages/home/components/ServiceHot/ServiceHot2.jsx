import { useState, useEffect } from "react";
import { Link } from "framework7-react";
import React, { Fragment } from "react";
import NewsDataService from "../../../../service/news.service";
import Slider from "react-slick";
import { SERVER_APP } from "../../../../constants/config";

import { getStockIDStorage, getUser } from "../../../../constants/user";

import BookDataService from "../../../../service/book.service";
import { toast } from "react-toastify";
import { PopupConfirm } from "../PopupConfirm";

export default class ServiceHot2 extends React.Component {
  constructor() {
    super();
    this.state = {
      width: window.innerWidth,
      isLoading: true,
      arrService: [],
      show: false,
      initialValues: null,
      btnLoading: false,
    };
  }
  componentDidMount() {
    this.getServiceHot();
  }
  handStyle = () => {
    const _width = this.state.width - 90;
    return Object.assign({
      width: _width,
    });
  };

  getServiceHot = () => {
    NewsDataService.getBannerName(this.props.id)
      .then((response) => {
        const arrService = response.data.data;
        this.setState({
          arrService: arrService,
          isLoading: false,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  handleUrl = (item) => {
    const userCurent = getUser();
    if (item.Link && item.Link.includes("/schedule/")) {
      const url = `${item.Link}&note=${encodeURIComponent(item.Title)}`;
      this.props.f7router.navigate(userCurent ? url : "/login/");
    } else if (item.Link && item.Link.includes("/pupup-contact/")) {
      this.setState({
        show: true,
        initialValues: item,
      });
    } else {
      this.props.f7router.navigate(item.Link);
    }
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

  getColor = (index, arr) => {
    if (window.GlobalConfig?.APP?.ColorRandom && arr) {
      const { ColorRandom } = window.GlobalConfig?.APP;
      let newColorRandom = [];
      if (arr.length > ColorRandom.length) {
        const addCount = Math.floor(arr.length / ColorRandom.length);
        const surplus = arr.length % ColorRandom.length;
        for (let i = 1; i <= addCount; i++) {
          newColorRandom = [...newColorRandom, ...ColorRandom];
        }

        if (surplus > 0) {
          newColorRandom = [
            ...newColorRandom,
            ...ColorRandom.slice(0, surplus),
          ];
        }
      } else {
        newColorRandom = [...ColorRandom];
      }
      return newColorRandom[index];
    }
    return "#007bff";
  };

  render() {
    const { arrService, isLoading, initialValues, show, btnLoading } =
      this.state;
    const settingsNews = {
      className: "slider variable-width",
      dots: false,
      arrows: false,
      infinite: true,
      slidesToShow: 1,
      centerPadding: "20px",
      variableWidth: true,
      autoplay: true,
      autoplaySpeed: 7000,
      centerMode: true,
    };
    return (
      <Fragment>
        {arrService && arrService.length > 0 && (
          <div className="home-page__news mb-0 pt-8px bg-transparent">
            <div className="page-news__list">
              <div className="page-news__list-ul">
                <Slider {...settingsNews}>
                  {arrService &&
                    arrService.slice(0, 6).map((item, index) => (
                      <Link
                        className="service-hot2"
                        key={index}
                        style={this.handStyle()}
                        onClick={() => this.handleUrl(item)}
                      >
                        <div
                          className="bg"
                          style={{
                            background: this.getColor(index, arrService),
                          }}
                        ></div>
                        <div
                          className="image"
                          style={{
                            backgroundImage: `url("${SERVER_APP}/Upload/image/${item.FileName}")`,
                          }}
                        />
                        <div className="text">
                          <div>
                            <h4>{item.Title}</h4>
                            <div
                              className="text-desc"
                              dangerouslySetInnerHTML={{ __html: item.Desc }}
                            ></div>
                          </div>
                          <div className="btns">
                            <div className="btn-more">Tham gia</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                </Slider>
              </div>
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
      </Fragment>
    );
  }
}
