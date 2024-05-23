import { Col, Row } from "framework7-react";
import React from "react";
import Skeleton from "react-loading-skeleton";

export default class SkeletonCardScheduling extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <React.Fragment>
        {Array(2)
          .fill()
          .map((item, index) => (
            <div className="item" key={index}>
              <div className="item-date">
                <Skeleton width={150} />
              </div>
              <div className="item-lst">
                {Array(2)
                  .fill()
                  .map((item, index) => (
                    <div className="item-lst__box" key={index}>
                      <div className="time-book">
                        <Skeleton width={50} />
                        <div className="time">
                          <Skeleton width={40} />
                        </div>
                      </div>
                      <div className="time-wrap">
                        <div className="service-book">
                          <div className="service-book__info">
                            <div className="title">
                              <Skeleton width={200} />
                            </div>
                          </div>
                          <div className="service-book__img">
                            <Skeleton circle={true} height={35} width={35} />
                          </div>
                        </div>
                        <div className="service-time">
                          <Row>
                            <Col width="50">
                              <div className="service-time__item">
                                <div>
                                  <Skeleton width={120} />
                                </div>
                                <div>
                                  <Skeleton width={80} />
                                </div>
                              </div>
                            </Col>
                            <Col width="50">
                              <div className="service-time__item">
                                <div>
                                  <Skeleton width={90} />
                                </div>
                                <div>
                                  <Skeleton width={50} />
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                        <div className="stock">
                          <Skeleton width={120} />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </React.Fragment>
    );
  }
}
