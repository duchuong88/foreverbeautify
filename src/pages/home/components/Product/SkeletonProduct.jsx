import { Col, Link, Row } from "framework7-react";
import React from "react";
import Skeleton from "react-loading-skeleton";

export default class SkeletonProduct extends React.Component {
    constructor() {
        super();
        this.state = {
            
        };
    }
    render() {
        return (
          <Row>
            {Array(4)
              .fill()
              .map((item, index) => (
                <Col width="50" key={index}>
                  <Link className="page-shop__list-item">
                    <div className="page-shop__list-img">
                      <Skeleton height={150} />
                    </div>
                    <div className="page-shop__list-text">
                      <h3>
                        <Skeleton count={1} />
                      </h3>
                      <div className="page-shop__list-price sale">
                        <span className="price">
                          <Skeleton width={50} />
                        </span>
                        <span className="price-sale">
                          <Skeleton width={50} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Col>
              ))}
          </Row>
        );
    }
}