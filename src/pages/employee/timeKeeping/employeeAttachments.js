import React from "react";
import {
  Col,
  f7,
  Link,
  Navbar,
  Page,
  Subnavbar,
  Row,
  Sheet,
  Toolbar,
  PhotoBrowser,
} from "framework7-react";
import NotificationIcon from "../../../components/NotificationIcon";
import StaffService from "../../../service/staff.service";
import { SERVER_APP } from "../../../constants/config";
import ToolBarBottom from "../../../components/ToolBarBottom";
import PageNoData from "../../../components/PageNoData";
import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

export default class employeeAttachments extends React.Component {
  constructor() {
    super();
    this.state = {
      ListAttachments: [],
      loading: false,
    };
  }
  componentDidMount() {
    this.getAttachments();
  }

  getAttachments = (callback) => {
    this.setState({ loading: true });
    this.$f7.dialog.preloader("Đang tải ...")
    const { id } = this.$f7route.params;
    StaffService.getAttachments({ MemberID: id })
      .then(({ data }) => {
        this.setState({
          loading: false,
          ListAttachments:
            data?.data?.Attachments?.map((x) => ({
              ...x,
              url: SERVER_APP + "/upload/image/" + x.Src,
              caption:
                moment(x.CreateDate).format("HH:mm DD-MM-YYYY") +
                " - " +
                x.ServiceTitle,
            })) || [],
        });
        this.$f7.dialog.close()
        callback && callback();
      })
      .catch((err) => console.log(err));
  };

  async loadRefresh(done) {
    this.getAttachments(() => done());
  }

  render() {
    const { ListAttachments, loading } = this.state;
    return (
      <Page
        name="employee-attachments"
        ptr
        onPtrRefresh={this.loadRefresh.bind(this)}
      >
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.$f7router.back()}>
                <i className="las la-angle-left"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">Hình ảnh</span>
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
        </Navbar>
        <div className="px-15px pb-15px">
          {ListAttachments && ListAttachments.length > 0 ? (
            <>
              <Row>
                {ListAttachments &&
                  ListAttachments.map((item, index) => (
                    <Col className="mt-15px" width="50" key={index}>
                      <div
                        className="bg-white"
                        onClick={() => this.standalone.open(index)}
                      >
                        <div>
                          <img
                            src={SERVER_APP + "/upload/image/" + item.Src}
                            alt={item.ServiceTitle}
                          />
                        </div>
                        <div className="text-center py-10px">
                          {moment(item.CreateDate).format("HH:mm DD-MM-YYYY")}
                        </div>
                      </div>
                    </Col>
                  ))}
              </Row>
            </>
          ) : (
            <PageNoData text="Không có dữ liệu" />
          )}
          <PhotoBrowser
            photos={ListAttachments}
            ref={(el) => {
              this.standalone = el;
            }}
          />
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
