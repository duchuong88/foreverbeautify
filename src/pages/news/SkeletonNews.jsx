import React from "react";
import { Link } from "framework7-react";
import Skeleton from "react-loading-skeleton";

export default class SkeletonNews extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {}

  render() {
      
    return (
      <div className="page-news__list-ul">
        {Array(3)
          .fill()
          .map((item, index) => {
            return (
              <Link className="page-news__list-item" key={index}>
                <div className="images">
                  <Skeleton height={150} />
                </div>
                <div className="text">
                  <h6>
                    <Skeleton count={1} />
                  </h6>
                  <div className="desc">
                    <Skeleton count={1} />
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    );
  }
}
