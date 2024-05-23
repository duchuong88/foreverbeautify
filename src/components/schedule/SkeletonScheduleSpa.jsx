import { Col } from "framework7-react";
import React from "react";
import Skeleton from "react-loading-skeleton";
export default class SkeletonScheduleSpa extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        {Array(8)
          .fill()
          .map((item, index) => {
            return (
              <div className={`item`} key={index}>
                <div className="item-title">
                  <Skeleton count={1} />
                </div>
                <div className="item-desc">
                  <Skeleton width={15} /> buổi liệu trình
                </div>
                <i className="las la-check-circle"></i>
              </div>
            );
          })}
      </React.Fragment>
    );
  }
}
