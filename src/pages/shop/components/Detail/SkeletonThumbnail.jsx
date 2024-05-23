import React from "react";
import Skeleton from "react-loading-skeleton";

export default class SkeletonThumbnail extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <div className="page-shop__detail-img">
        <Skeleton height={300} />
        <div className="count">
          <Skeleton width={50} count={1} />
        </div>
      </div>
    );
  }
}
