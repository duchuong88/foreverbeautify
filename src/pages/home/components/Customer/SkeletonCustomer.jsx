import React from "react";
import Skeleton from "react-loading-skeleton";
import Slider from "react-slick";

export default class SkeletonCustomer extends React.Component {
  constructor() {
    super();
    this.state = {
      width: window.innerWidth,
    };
  }

  handStyleAfter = () => {
    const _width = this.state.width / 5 - 12;
    return Object.assign({
      width: _width,
    });
  };

  render() {
    const settingsPhoto = {
      className: "slider variable-width",
      dots: false,
      arrows: false,
      infinite: true,
      slidesToShow: 1,
      centerPadding: "20px",
      variableWidth: true,
    };

    return (
      <React.Fragment>
        <div className="box">
          <Skeleton height={216} />
        </div>
        <div className="note">
          <span>After</span>
          <span>Before</span>
        </div>
        <div className="list-client">
          <Slider {...settingsPhoto}>
            {Array(8)
              .fill()
              .map((item, index) => {
                return (
                  <div
                    className="list-client__item"
                    key={index}
                    style={this.handStyleAfter()}
                  >
                    <div className="image">
                      <Skeleton height={72} />
                    </div>
                  </div>
                );
              })}
          </Slider>
        </div>
      </React.Fragment>
    );
  }
}
