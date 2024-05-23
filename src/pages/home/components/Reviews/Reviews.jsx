import React from "react";
import Slider from "react-slick";
import NewsDataService from "../../../../service/news.service";
import { SERVER_APP } from "../../../../constants/config";

export default class Reviews extends React.Component {
  constructor() {
    super();
    this.state = {
      width: window.innerWidth,
      isLoading: true,
      List: [],
    };
  }
  componentDidMount() {
    this.getBanner();
  }

  getBanner = () => {
    NewsDataService.getBannerName("WEB.REVIEW")
      .then(({ data }) => {
        this.setState({
          isLoading: false,
          List: data.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  handStyle = () => {
    const _width = this.state.width - 120;
    return Object.assign({
      width: _width,
    });
  };

  render() {
    const { List, isLoading } = this.state;
    const settingsNews = {
      className: "slider variable-width",
      dots: false,
      arrows: false,
      infinite: true,
      slidesToShow: 1,
      centerPadding: "20px",
      variableWidth: true,
    };
    if (!List || List.length === 0) return <></>;
    return (
      <div className="reviews mb-10px bg-white">
        <div className="page-news__list-head">
          <h5>
            {window.location.host === "www.spamamgao.com"
              ? "Tâm sự cùng mầm gạo"
              : "Ý kiến khách hàng"}
          </h5>
        </div>
        <div className="page-news__list-ul">
          {!isLoading && (
            <Slider {...settingsNews}>
              {List &&
                List.slice(0, 6).map((item, index) => (
                  <div
                    className="reviews-box"
                    style={this.handStyle()}
                    key={index}
                  >
                    <div className="p-15px">
                      <div className="reviews-info">
                        <div className="reviews-info__img">
                          <img
                            src={`${SERVER_APP}/upload/image/${item.FileName}`}
                            alt={item.Title}
                          />
                        </div>
                        <div className="reviews-info__box">
                          <div className="reviews-info__title">
                            {item.Title}
                          </div>
                          <div className="reviews-info__sub">{item.Link}</div>
                        </div>
                      </div>
                      <div
                        className="reviews-desc"
                        dangerouslySetInnerHTML={{ __html: item.Desc }}
                      ></div>
                    </div>
                  </div>
                ))}
            </Slider>
          )}
        </div>
      </div>
    );
  }
}
