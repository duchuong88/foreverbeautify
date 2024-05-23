import React from "react";
import {
  Page,
  Link,
  Toolbar,
  Navbar,
  Fab,
  Button,
  ActionsGroup,
  ActionsButton,
  Actions,
  ActionsLabel,
} from "framework7-react";
import ToolBarBottom from "../../components/ToolBarBottom";
import UserService from "../../service/user.service";
import { getUser } from "../../constants/user";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";

import moment from "moment";
import "moment/locale/vi";
import { REMOVE_BADGE, SET_BADGE } from "../../constants/prom21";
import { iOS } from "../../constants/helpers";
import { SERVER_APP } from "../../constants/config";
moment.locale("vi");

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      arrNoti: [],
      allChecked: false,
      isCheckAll: false,
      itemActions: null,
    };
  }
  componentDidMount() {
    //SET_BADGE();
    this.getNotification();
  }

  getNotification = (refresh = false) => {
    const infoUser = getUser();

    if (!infoUser) {
      _this.$f7.views.main.router.navigate("/");
      return false;
    }

    this.setState({
      isLoading: true,
    });

    UserService.getNotification(
      infoUser.acc_type,
      infoUser.acc_id,
      0,
      200,
      refresh
    )
      .then((response) => {
        const data = response.data.data;
        const dataNew = [];
        data.map((item) => {
          const itemNew = {
            ...item,
            isChecked: false,
          };
          dataNew.push(itemNew);
        });
        this.setState({
          arrNoti: dataNew,
          isLoading: false,
        });
        !iOS() && SET_BADGE();
      })
      .catch((er) => console.log(er));
  };
  iconNoti = () => {
    return (
      <svg
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="prefix__feather prefix__feather-bell"
      >
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    );
  };

  handleCheckAll = () => {
    this.setState((prevState) => {
      let { arrNoti, allChecked, isActive, isCheckAll } = prevState;
      isActive = "";
      if (arrNoti.length > 0) {
        isCheckAll = !isCheckAll;
      }
      if (isCheckAll === true) {
        arrNoti = arrNoti.map((item) => ({
          ...item,
          isChecked: true,
        }));
      } else {
        arrNoti = arrNoti.map((item) => ({
          ...item,
          isChecked: false,
        }));
      }

      return { arrNoti, allChecked, isActive, isCheckAll };
    });
  };

  handleChangeInput = (e) => {
    let itemID = e.target.name;
    let checked = e.target.checked;
    this.setState((prevState) => {
      let { arrNoti, allChecked, isCheckAll } = prevState;
      if (itemID === "checkAll") {
        allChecked = checked;
        arrNoti = arrNoti.map((item) => ({ ...item, isChecked: checked }));
      } else {
        arrNoti = arrNoti.map((item) =>
          item.ID === parseInt(itemID) ? { ...item, isChecked: checked } : item
        );
        allChecked = arrNoti.every((item) => item.isChecked);
      }
      if (isCheckAll === true) {
        const arrNotiLeng = arrNoti.filter((x) => x.isChecked === true).length;
        arrNotiLeng === 0 ? (isCheckAll = false) : isCheckAll;
      }
      return { arrNoti, allChecked, isCheckAll };
    });
  };

  handleDetail = (item) => {
    this.$f7router.navigate(`/notification/${item.ID}/?remove=true`);
  };

  handleReaded = (item) => {
    if (item.IsReaded) return false;
    const id = item.ID;
    const data = new FormData();
    data.append("ids", id);
    UserService.readedNotification(data)
      .then((response) => {
        if (response.data) {
          this.setState({
            isCheckAll: false,
          });
          this.getNotification();
        }
      })
      .catch((er) => console.log(er));
  };

  handleDelete = (id, all) => {
    const data = new FormData();
    data.append("ids", id);
    UserService.deleteNotification(data)
      .then((response) => {
        if (response.data) {
          toast.success(" Deleted successfully !", {
            position: toast.POSITION.TOP_LEFT,
            autoClose: 3000,
          });
          this.setState({
            isCheckAll: false,
            //itemActions: null
          });
          all && iOS() && REMOVE_BADGE();
          this.getNotification();
        }
      })
      .catch((er) => console.log(er));
  };

  handleDeleteAll = () => {
    const { arrNoti } = this.state;
    const arrNotiDelete = [];
    arrNoti
      .filter((x) => x.isChecked === true)
      .map((x) => {
        arrNotiDelete.push(x.ID);
      });
    const listItemDelete = arrNotiDelete.join(",");
    this.handleDelete(listItemDelete, true);
  };

  async loadRefresh(done) {
    this.getNotification(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    done();
  }

  render() {
    const { arrNoti, isActive, isCheckAll, itemActions, isLoading } =
      this.state;
    return (
      <Page ptr onPtrRefresh={this.loadRefresh.bind(this)}>
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link
                onClick={() => {
                  if (
                    this.$f7router.history[
                      this.$f7router.history.length - 2
                    ]?.indexOf("/notification/") > -1
                  ) {
                    this.$f7router.navigate(`/`);
                  } else {
                    this.$f7router.back({
                      url: this.$f7router.history[
                        this.$f7router.history.length - 1
                      ],
                      force: true,
                      ignoreCache: true,
                    });
                  }
                }}
              >
                <i className="las la-angle-left"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">Notification</span>
            </div>

            <div className="page-navbar__noti" onClick={this.handleCheckAll}>
              <Link>
                {isCheckAll === false ? (
                  <i className="las la-check-double"></i>
                ) : (
                  <span className="text-close-noti">Cancel</span>
                )}
              </Link>
            </div>
          </div>
        </Navbar>
        <div className="page-render no-bg p-0">
          <div className="page-noti">
            {isLoading ? (
              <ul className="page-noti__list">
                {Array(5)
                  .fill()
                  .map((item, index) => (
                    <li key={index}>
                      <div className="action">
                        <div className="icon">
                          <div className="icon-box">{this.iconNoti()}</div>
                        </div>
                        <div className="text">
                          <h4>
                            <Skeleton count={1} />
                          </h4>
                          <div className="text-desc">
                            {<Skeleton count={2} />}
                          </div>
                          <div className="text-time">
                            <Skeleton count={1} style={{ width: 80 }} />
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            ) : (
              <React.Fragment>
                {arrNoti && arrNoti.length === 0 && (
                  <div className="no-notification">
                    <img
                      src={`${SERVER_APP}/app2021/images/no-notification.png`}
                    />
                  </div>
                )}
                <ul className="page-noti__list">
                  {arrNoti &&
                    arrNoti.map((item, index) => (
                      <li
                        className={
                          (isActive === item.ID ? "active " : "") +
                          (item.isChecked === true ? "activeFull " : "") +
                          (item.IsReaded === true ? "readed" : "")
                        }
                        key={index}
                      >
                        <div className="action">
                          <div className="icon">
                            <div className="icon-box">{this.iconNoti()}</div>
                          </div>
                          <div className="text">
                            <h4>{item.Title}</h4>
                            <div className="text-desc">{item.Body}</div>
                            {/* <div className="text-time">
                              {moment(item.CreateDate).fromNow()}{" "}
                              {item.IsReaded === true ? (
                                <span>- Đã xem</span>
                              ) : (
                                ""
                              )}
                            </div> */}
                          </div>
                          <Button
                            onClick={() => this.setState({ itemActions: item })}
                            className="action-open"
                          ></Button>
                        </div>
                        <div className="input">
                          <input
                            key={item.ID}
                            type="checkbox"
                            name={item.ID}
                            value={item.ID}
                            checked={item.isChecked}
                            onChange={this.handleChangeInput}
                          />
                          <i className="las la-check"></i>
                        </div>
                      </li>
                    ))}
                </ul>
              </React.Fragment>
            )}
          </div>
        </div>

        <Actions
          className="actions-custom"
          opened={itemActions ? true : false}
          onActionsClosed={() => this.setState({ itemActions: null })}
        >
          <ActionsGroup>
            <ActionsLabel>{itemActions && itemActions.Title}</ActionsLabel>
            <ActionsButton onClick={() => this.handleDetail(itemActions)}>
              See details
            </ActionsButton>
            <ActionsButton
              color="red"
              onClick={() => this.handleDelete(itemActions?.ID)}
            >
              Delete notification
            </ActionsButton>
          </ActionsGroup>
          {/* <ActionsGroup>
              <ActionsButton color="red">Close</ActionsButton>
          </ActionsGroup> */}
        </Actions>

        {isCheckAll === true ? (
          <Fab
            className="btn-notification-deleteall"
            position="left-bottom"
            slot="fixed"
            color="red"
            onClick={() => this.handleDeleteAll()}
          >
            <i className="las la-trash"></i>
          </Fab>
        ) : (
          ""
        )}

        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
