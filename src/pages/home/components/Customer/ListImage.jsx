import React from "react";
import NewsDataService from "../../../../service/news.service";
import Slider from "react-slick";
import { SERVER_APP } from "../../../../constants/config";
import BeforeAfterSlider from "react-before-after-slider";
import SkeletonCustomer from "../Customer/SkeletonCustomer";
import { FaCheck } from "react-icons/fa";

export default class ListImage extends React.Component {
  constructor() {
    super();
    this.state = {
      width: window.innerWidth,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getBeforeAfter();
  }

  getBeforeAfter = () => {
    NewsDataService.getBannerName("APP.AFTERBEFORE")
      .then((response) => {
        const arrPhotoCustomer = response.data.data;
        this.setState({
          arrPhotoCustomer: arrPhotoCustomer && arrPhotoCustomer.length > 0 && arrPhotoCustomer.filter(item => item.IsPublic > 0),
          PhotoCustomerActive: arrPhotoCustomer && arrPhotoCustomer.length > 0 && arrPhotoCustomer[0],
          isActivePhoto: arrPhotoCustomer && arrPhotoCustomer.length > 0 && arrPhotoCustomer[0].ID,
          isLoading: false,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  handStyleAfter = () => {
    const _width = this.state.width / 5 - 12;
    return Object.assign({
      width: _width,
    });
  };

  handStyleWidth = () => {
    const _width = this.state.width - 30;
    return _width;
  };

  handlePhotoCustomer = (item) => {
    this.setState({
      isLoadPhoto: false,
      PhotoCustomerActive: item,
      isActivePhoto: item.ID,
    });
    setTimeout(() => {
      this.setState({
        isLoadPhoto: true,
      });
    }, 100);
  };

  render() {
    const { arrPhotoCustomer, PhotoCustomerActive, isActivePhoto, isLoading } =
      this.state;

    const settingsPhoto = {
      className: "slider variable-width",
      dots: false,
      arrows: false,
      infinite: arrPhotoCustomer && arrPhotoCustomer.length > 6 ? true : false,
      slidesToShow: 1,
      centerPadding: "20px",
      variableWidth: true,
      slidesToScroll: 5,
    };
    
    if (arrPhotoCustomer && arrPhotoCustomer.length > 0) {
      return (
        <div className="home-page__client">
          <div className="title">Ảnh khách hàng</div>
          {!isLoading && (
            <React.Fragment>
              <div className="box">
                <BeforeAfterSlider
                  before={`${SERVER_APP}/Upload/image/${PhotoCustomerActive && PhotoCustomerActive.FileName2
                    }`}
                  after={`${SERVER_APP}/Upload/image/${PhotoCustomerActive && PhotoCustomerActive.FileName
                    }`}
                  className="box-beforeafter"
                  width={this.handStyleWidth()}
                  height={230}
                />
              </div>
              <div className="note">
                <span>After</span>
                <span>Before</span>
              </div>
              <div className="list-client">
                <Slider {...settingsPhoto}>
                  {arrPhotoCustomer &&
                    arrPhotoCustomer.map((item, index) => {
                      if (index > 10) return false;
                      return (
                        <div
                          className={`list-client__item ${isActivePhoto === item.ID ? "active" : ""
                            }`}
                          key={item.ID}
                          style={this.handStyleAfter()}
                          onClick={() => this.handlePhotoCustomer(item)}
                        >
                          <div className="image">
                            <img
                              className="animate__animated"
                              src={`${SERVER_APP}/Upload/image/${item.FileName2}`}
                              alt=""
                            />
                            <FaCheck />
                          </div>
                        </div>
                      );
                    })}
                </Slider>
              </div>
            </React.Fragment>
          )}
          {isLoading && <SkeletonCustomer />}
        </div>
      );
    }
    return "";
  }
}
