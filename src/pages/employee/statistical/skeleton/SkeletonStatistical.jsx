import React from "react";
import Skeleton from "react-loading-skeleton";

export default class SkeletonStatistical extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <React.Fragment>
        <div className="page-render p-0">
          <div className="employee-statistical">
            <div className="employee-statistical__item">
              <div className="title">Chưa trả lương</div>
              <div className="tfooter">
                <div className="tr">
                  <div className="td">Dự kiến</div>
                  <div className="td">
                    <Skeleton height={20} width={70} />
                  </div>
                </div>
              </div>
            </div>
            <div className="employee-statistical__item">
              <div className="title">Lương cơ bản</div>
              <div className="head">
                <div className="tr">
                  <div className="td w-1">STT</div>
                  <div className="td w-2">Hạng mục</div>
                  <div className="td w-3">Giá trị</div>
                </div>
              </div>
              <div className="tbody">
                <div className="tr">
                  <div className="td w-1">1</div>
                  <div className="td w-2">Lương cơ bản</div>
                  <div className="td w-3">
                    <Skeleton height={20} width={70} />
                  </div>
                </div>
                <div className="tr">
                  <div className="td w-1">2</div>
                  <div className="td w-2">Ngày công yêu cầu</div>
                  <div className="td w-3">
                    <Skeleton height={20} width={70} />
                  </div>
                </div>
                <div className="tr">
                  <div className="td w-1">3</div>
                  <div className="td w-2">Phụ cấp</div>
                  <div className="td w-3">
                    <Skeleton height={20} width={70} />
                  </div>
                </div>
              </div>
            </div>
            <div className="employee-statistical__item">
              <div className="title">Trừ tiền</div>
              <div className="head">
                <div className="tr">
                  <div className="td w-1">STT</div>
                  <div className="td w-2">Hạng mục</div>
                  <div className="td w-3">Giá trị</div>
                </div>
              </div>
              <div className="tbody">
                <div className="tr">
                  <div className="td w-1">1</div>
                  <div className="td w-2">Ngày nghỉ</div>
                  <div className="td w-3">
                    <Skeleton height={20} width={70} />
                  </div>
                </div>
                <div className="tr">
                  <div className="td w-1">2</div>
                  <div className="td w-2">Phạt</div>
                  <div className="td w-3">
                    <Skeleton height={20} width={70} />
                  </div>
                </div>
              </div>
              <div className="tfooter">
                <div className="tr">
                  <div className="td">Tổng phạt</div>
                  <div className="td">
                    <Skeleton height={20} width={70} />
                  </div>
                </div>
              </div>
            </div>
            <div className="employee-statistical__item">
              <div className="title">Lương dịch vụ</div>
              <div className="head">
                <div className="tr">
                  <div className="td w-1">STT</div>
                  <div className="td w-2">Hạng mục</div>
                  <div className="td w-3">Giá trị</div>
                </div>
              </div>
              <div className="tbody">
                {Array(5)
                  .fill()
                  .map((item, index) => (
                    <div className="tr" key={index}>
                      <div className="td w-1">{index + 1}</div>
                      <div className="td w-2">
                        <Skeleton count={2} height={20} />
                      </div>
                      <div className="td w-3">
                        <Skeleton height={20} width={70} />
                      </div>
                    </div>
                  ))}
              </div>
              <div className="tfooter">
                <div className="tr">
                  <div className="td">Tổng </div>
                  <div className="td">
                    <Skeleton height={20} width={70} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
