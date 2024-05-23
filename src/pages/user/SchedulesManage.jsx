import React from "react";
import {
  Page,
  Link,
  Navbar,
  Toolbar,
  Row,
  Col,
  Subnavbar,
  Tabs,
  Tab,
} from "framework7-react";
import NotificationIcon from "../../components/NotificationIcon";
import ToolBarBottom from "../../components/ToolBarBottom";
import BookDataService from "../../service/book.service";

import CardSchedulingComponent from "./SchedulesManage/CardSchedulingComponent";
import { getUser } from "../../constants/user";
import { groupbyDDHHMM2 } from "../../constants/format";
import { toast } from "react-toastify";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      isRefresh: false,
      tabCurrent: "bookcard",
      listBooking: [],
      loading: false,
    };
  }

  getListBooks = () => {
    const userInfo = getUser();
    if (!userInfo) return false;
    this.setState({
      loading: true,
    });
    BookDataService.getListBook(userInfo.ID)
      .then(({ data }) => {
        this.setState({
          listBooking: groupbyDDHHMM2(data.data),
          loading: false,
        });
      })
      .catch((er) => console.log(er));
  };

  componentDidMount() {
    this.getListBooks();
  }

  onDelete = (item) => {
    const dataSubmit = {
      deletes: [
        {
          ID: item.ID,
        },
      ],
    };
    const _this = this;
    _this.$f7.dialog.confirm("You are sure you want to cancel the appointment ?", () => {
      _this.$f7.preloader.show();
      BookDataService.bookDelete(dataSubmit)
        .then((response) => {
          _this.$f7.preloader.hide();
          toast.success("Cancellation successful !", {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 3000,
          });
          this.getListBooks();
        })
        .catch((er) => console.log(er));
    });
  };

  async loadRefresh(done) {
    await this.getListBooks();
    done();
  }

  render() {
    const { loading, listBooking } = this.state;
    return (
      <Page
        name="schedule-manage"
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
              <span className="title">Manage scheduling</span>
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
        </Navbar>
        <div className="page-wrapper">
          <div className="chedule-manage">
            <CardSchedulingComponent
              listBooking={listBooking}
              loading={loading}
              onDelete={this.onDelete}
              f7={this.$f7router}
            />
          </div>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
