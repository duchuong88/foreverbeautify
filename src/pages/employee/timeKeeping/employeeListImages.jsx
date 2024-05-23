import React from "react";
import {
  Col,
  Link,
  ListInput,
  Navbar,
  Page,
  PhotoBrowser,
  Row,
  Sheet,
  Subnavbar,
} from "framework7-react";
import staffService from "../../../service/staff.service";

import moment from "moment";
import "moment/locale/vi";
import EmployeeImage from "./employeeImage";
import PageNoData from "../../../components/PageNoData";
import NotificationIcon from "../../../components/NotificationIcon";

moment.locale("vi");

export default class employeeListImages extends React.Component {
  constructor() {
    super();
    this.state = {
      sheetOpened: false,
      loading: false,
      ListImageUse: [],
      photos: [],
      DateFilter: [
        moment().startOf("month").toDate(),
        moment().endOf("month").toDate(),
      ],
    };
  }
  componentDidMount() {
    //this.getListImgUse();
  }

  getListImgUse = (filter, callback) => {
    const { id } = this.$f7route.params;
    if (!id || !filter || filter.length < 1) {
      this.setState({
        sheetOpened: false,
      });
      return;
    }
    this.setState({ loading: true });
    const obj = {
      mid: id,
      from: moment(filter[0]).format("DD/MM/YYYY"),
      to: moment(filter[1]).format("DD/MM/YYYY"),
    };
    staffService
      .getListImgUse(obj)
      .then(({ data }) => {
        const newList = [];
        if (data?.list) {
          for (let item of data?.list) {
            const index = newList.findIndex(
              (o) =>
                moment(o.BookDate).format("DD-MM-YYYY") ===
                moment(item.BookDate).format("DD-MM-YYYY")
            );
            if (index > -1) {
              newList[index].Items.push(item);
            } else {
              const newObj = {
                BookDate: item.BookDate,
                Items: [item],
              };
              newList.push(newObj);
            }
          }
        }
        this.setState({
          loading: false,
          ListImageUse: newList.sort(function (left, right) {
            return moment.utc(right.BookDate).diff(moment.utc(left.BookDate));
          }),
        });
        callback && callback();
      })
      .catch((error) => console.log(error));
  };

  openFilter = () => {
    this.setState({
      sheetOpened: true,
    });
  };

  closeSheet = () => {
    this.setState({
      sheetOpened: false,
    });
  };

  onCalendarChange = (date) => {
    if (!date || date.length < 1) {
      this.setState({
        sheetOpened: false,
      });
      return;
    }
    this.getListImgUse(date);
  };

  async loadRefresh(done) {
    this.getListImgUse(this.state.DateFilter, () => {
      done();
    });
  }

  render() {
    const { ListImageUse, DateFilter, loading } = this.state;
    return (
      <Page
        name="employee-list-images"
        onPtrRefresh={this.loadRefresh.bind(this)}
        ptr
        infiniteDistance={50}
      >
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.$f7router.back()}>
                <i className="las la-angle-left"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">Hình ảnh dịch vụ</span>
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
          <Subnavbar className="sub-nav-bar">
            <i className="las la-calendar icon-date"></i>
            <ListInput
              className="date-time-filter"
              label="Chọn ngày"
              type="datepicker"
              placeholder="Ngày bắt đầu - Ngày kết thúc"
              value={DateFilter}
              readonly
              calendarParams={{
                dateFormat: "dd/mm/yyyy",
                rangePicker: true,
                footer: true,
                toolbarCloseText: "Xác nhận",
                backdrop: true,
              }}
              clearButton
              onCalendarChange={this.onCalendarChange}
            />
          </Subnavbar>
        </Navbar>
        <div className="page-render employee-service-detail p-0">
          {loading && (
            <div className="h-235px">
              <div className="loader-chart">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          {!loading && (
            <>
              {ListImageUse && ListImageUse.length > 0 ? (
                <div className="employee-list-img">
                  {ListImageUse &&
                    ListImageUse.map((item, index) => (
                      <div className="img-item" key={index}>
                        <div className="img-item-date">
                          Ngày {moment(item.BookDate).format("DD-MM-YYYY")}
                        </div>
                        <div className="img-item-lst">
                          <Row className="jc--n">
                            {item.Items &&
                              item.Items.map((img, idx) => (
                                <Col width="50" key={idx}>
                                  <EmployeeImage img={img} />
                                </Col>
                              ))}
                          </Row>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <PageNoData text="Không có dữ liệu." />
              )}
            </>
          )}
        </div>
      </Page>
    );
  }
}
