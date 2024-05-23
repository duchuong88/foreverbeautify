import React from "react";
import { Link } from "framework7-react";
import Skeleton from "react-loading-skeleton";
import Slider from "react-slick";

export default class SkeletonServiceHot extends React.Component {
  constructor() {
    super();
    this.state = {
      width: window.innerWidth,
      isLoading: true,
    };
  }
  componentDidMount() {}
  handStyle = () => {
    const _width = this.state.width - 120;
    return Object.assign({
      width: _width,
    });
  };

  render() {
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
      <div className="page-news__list-ul">
        <Slider {...settingsNews}>
          {Array(5)
            .fill()
            .map((item, index) => {
              return (
                <Link
                  className="page-news__list-item"
                  key={index}
                  style={this.handStyle()}
                >
                  <div className="images">
                    <Skeleton height={115} />
                  </div>
                  <div className="text">
                    <h6>
                      <Skeleton count={1} />
                    </h6>
                  </div>
                </Link>
              );
            })}
        </Slider>
      </div>
    );
  }
}
