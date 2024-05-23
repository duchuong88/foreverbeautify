import React from "react";
import SkeletonCardScheduling from "./SkeletonCardScheduling";
import PageNoData from "../../../components/PageNoData";
import moment from "moment";
import "moment/locale/vi";
import { Col, Row } from "framework7-react";
moment.locale("vi");

export default class CardSchedulingComponent extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { listBooking, loading, onDelete, f7 } = this.props;
    return (
      <div className="chedule-manage__lst">
        {loading && <SkeletonCardScheduling />}
        {!loading && (
          <>
            {listBooking && listBooking.length > 0 ? (
              listBooking.map((item, index) => (
                <div className="item" key={index}>
                  <div className="item-date">
                    Day {moment(item.dayFull).format("LL")}
                  </div>
                  <div className="item-lst">
                    {item.items &&
                      item.items.map((subitem, subIndex) => (
                        <div className="item-lst__box" key={subIndex}>
                          <div className="time-wrap">
                            <div className="service-book">
                              <div className="service-book__info">
                                <div className="title">
                                  {subitem.RootTitles || "No service"}
                                </div>
                              </div>
                            </div>
                            <div className="service-time">
                              <Row>
                                <Col width="33">
                                  <div className="service-time__item">
                                    <div>Set date</div>
                                    <div>
                                      {moment(subitem.BookDate).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </div>
                                  </div>
                                </Col>
                                <Col width="33">
                                  <div className="service-time__item">
                                    <div>Time</div>
                                    <div>
                                      {moment(subitem.BookDate).format("HH:mm")}
                                    </div>
                                  </div>
                                </Col>
                                <Col width="33">
                                  <div className="service-time__item">
                                    <div>Doing at</div>
                                    <div>
                                      {subitem.AtHome
                                        ? "Home"
                                        : subitem.Stock.Title}
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                            <div className="stock">
                              <div>
                                <button
                                  onClick={() =>
                                    f7.navigate(`/schedule/${subitem.ID}`)
                                  }
                                  className="btn-close btn-edit"
                                >
                                  Change schedule
                                </button>
                                <button
                                  onClick={() => onDelete(subitem)}
                                  className="btn-close"
                                >
                                  Cancel schedule
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <PageNoData text="You don't have any service schedules yet ?" />
            )}
          </>
        )}
      </div>
    );
  }
}
