import { Col } from "framework7-react";
import React from "react";
import Skeleton from "react-loading-skeleton";
export default class SkeletonStock extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        {Array(2)
          .fill()
          .map((item, index) => {
            return (
              <Col width="50" key={index}>
                <div className="location">
                  <div className="location-item">
                    <Skeleton height={45} />
                  </div>
                </div>
              </Col>
            );
          })}
      </React.Fragment>
    );
  }
}