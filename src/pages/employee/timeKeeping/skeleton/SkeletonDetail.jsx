import { Col, Row } from "framework7-react";
import React from "react";
import Skeleton from "react-loading-skeleton";

export default class SkeletonDetail extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <React.Fragment>
        <ul>
          <li>
            <span className="w-100">Dịch vụ</span>
            <span className="w-100">
              <Skeleton height={18} count={2} />
            </span>
          </li>
          <li>
            <span>Khách hàng</span>
            <span>
              <Skeleton width={80} height={18} />
            </span>
          </li>
          <li>
            <span>Địa chỉ</span>
            <span>
              <Skeleton width={90} height={18} />
            </span>
          </li>
          <li>
            <span>Công nợ</span>
            <span>
              <Skeleton width={60} height={18} />
            </span>
          </li>

          <li>
            <span className="w-100">Ghi chú</span>
            <span className="w-100">
              <Skeleton count={1} />
            </span>
          </li>
          <li>
            <span>Số điện thoại</span>
            <span>
              <Skeleton width={80} height={18} />
            </span>
          </li>
          <li>
            <span>Thời gian</span>
            <span>
              <Skeleton width={60} height={18} />
            </span>
          </li>
          <li>
            <span>Số phút</span>
            <span>
              <Skeleton width={30} height={18} /> p /Ca
            </span>
          </li>
          <li>
            <span>Điểm</span>
            <span>
              <Skeleton count={1} height={18} />
            </span>
          </li>
          <li>
            <span className="w-100">Nhân viên thực hiện</span>
            <span className="w-100">
              <Skeleton width={90} height={18} />
            </span>
          </li>
          <li>
            <span className="w-100">Phụ phí</span>
            <span className="w-100">
              <Skeleton count={1} height={18} />
            </span>
          </li>
        </ul>
      </React.Fragment>
    );
  }
}
