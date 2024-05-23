import { Link } from "framework7-react";
import React from "react";
import Skeleton from "react-loading-skeleton";

export default class SkeletonItemCategory extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <ul>
        {Array(3)
          .fill()
          .map((item, index) => (
            <li key={index}>
              <Link noLinkClass>
                <div className="image">
                  <Skeleton height={200} />
                </div>
                <div className="text">
                  <h3>
                    <Skeleton width={100} count={1} />
                  </h3>
                  <div className="text-desc">
                    <Skeleton width={200} count={2} />
                  </div>
                </div>
              </Link>
            </li>
          ))}
      </ul>
    );
  }
}
