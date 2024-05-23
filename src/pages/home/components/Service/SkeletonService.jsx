import React from "react";
import { Col, Link, Row } from "framework7-react";
import Skeleton from "react-loading-skeleton";

export default class SkeletonService extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <Row>
        {Array(3)
          .fill()
          .map((item, index) => {
            return (
              <Col width="25" key={index}>
                <Link noLinkClass>
                  <Skeleton width={60} height={60} />
                  <div className="text">
                    <Skeleton count={1} />
                  </div>
                </Link>
              </Col>
            );
          })}
      </Row>
    );
  }
}
