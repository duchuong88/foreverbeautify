import React from "react";
import { Button, Link } from "framework7-react";
import Skeleton from "react-loading-skeleton";

export default class SkeletonListService extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {}

  render() {
    return (
      <div className="page-shop__service-list">
        {Array(2)
          .fill()
          .map((item, index) => {
            return (
              <div className="page-shop__service-item" key={index}>
                <div className="page-shop__service-item service-about">
                  <div className="service-about__img">
                    <Skeleton height={300} />
                  </div>
                  <div className="service-about__content">
                    <div className="service-about__content-text">
                      <Skeleton duration={2} />
                    </div>
                    <Button className="show-more">
                      Chi tiết <i className="las la-angle-right"></i>
                    </Button>
                  </div>
                  <div className="service-about__list">
                    <ul>
                      <li>
                        <Link>
                          <div className="title">
                            <Skeleton width={90} />
                          </div>
                          <div className="price">
                            <span className="price-to">
                              <Skeleton width={30} />
                            </span>
                            <span className="price-sale">
                              <Skeleton width={30} />
                            </span>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link>
                          <div className="title">
                            <Skeleton width={90} />
                          </div>
                          <div className="price">
                            <span className="price-to">
                              <Skeleton width={30} />
                            </span>
                            <span className="price-sale">
                              <Skeleton width={30} />
                            </span>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link>
                          <div className="title">
                            <Skeleton width={90} />
                          </div>
                          <div className="price">
                            <span className="price-to">
                              <Skeleton width={30} />
                            </span>
                            <span className="price-sale">
                              <Skeleton width={30} />
                            </span>
                          </div>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    );
  }
}
