import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import Skeleton from "react-loading-skeleton";

export default class SkeletonPayInfo extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <div className="page-pay__list">
        {Array(2)
          .fill()
          .map((item, index) => {
            return (
              <div className="page-pay__list-item" key={index}>
                <div className="image">
                  <Skeleton height={90} />
                </div>
                <div className="info">
                  <h3>
                    <Skeleton count={1} />
                  </h3>
                  <div className="info-price hasSale">
                    <p className="price-s">
                      <Skeleton width={40} />
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    );
  }
}
