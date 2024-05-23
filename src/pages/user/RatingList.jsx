import React from "react";
import { Page, Link, Toolbar, Navbar } from "framework7-react";
import PageNoData from "../../components/PageNoData";
import ToolBarBottom from "../../components/ToolBarBottom";
import StarComponent from "../../components/StarComponent";
import UserService from "../../service/user.service";
import Avatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { getDateFacebook, checkAvt2 } from "../../constants/format";
import { getUser } from "../../constants/user";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import moment from 'moment';
import 'moment/locale/vi';
moment.locale('vi');

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      arrReview: [],
      memberid: 0,
      arrCheckRv: [],
      showPreloader: false,
    };
  }
  componentDidMount() {
    this.getReviews();
  }

  getReviews = () => {
    const member = getUser();
    if (!member) return false;
    const memberid = member.ID;
    UserService.getReviews(memberid)
      .then((response) => {
        const arrReview = response.data.data;
        this.setState({
          arrReview: arrReview,
          memberid: memberid,
          isLoading: false,
        });
      })
      .catch((er) => console.log(er));
  };

  handleCheck = (ID) => {
    return this.state.arrCheckRv.some((item) => ID === item.ID);
  };

  onClickStar = (star, id) => {
    const ID = id;
    const Rate = star;
    const { arrCheckRv } = this.state;
    const itemNew = {
      ID: ID,
      Rate: Rate,
      RateNote: "",
    };
    if (!this.handleCheck(id)) {
      this.setState({
        arrCheckRv: [...arrCheckRv, itemNew],
      });
    } else {
      const newarrCheckRv = arrCheckRv.map((item) => {
        if (item.ID === ID) {
          const updatedItem = {
            ...item,
            Rate: Rate,
            RateNote: "",
          };
          return updatedItem;
        }
        return item;
      });
      this.setState({
        arrCheckRv: newarrCheckRv,
      });
    }
  };

  submitReviews = () => {
    const { arrCheckRv } = this.state;
    const member = getUser();
    if (!member) return false;
    const memberid = member.ID;

    if (arrCheckRv.length === 0) {
      toast.error("Please select the service to review !", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
    } else {
      var bodyFormData = new FormData();
      bodyFormData.append("rates", JSON.stringify(arrCheckRv));

      UserService.postReviews(memberid, bodyFormData)
        .then((response) => {
          const data = response.data;
          if (data) {
            this.setState({
              arrCheckRv: [],
            });
            toast.success("Evaluate the service successfully !", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 1500,
            });
            this.$f7router.navigate(this.$f7router.currentRoute.url, {
              ignoreCache: true,
              reloadCurrent: true,
            });
          }
        })
        .catch((er) => console.log(er));
    }
  };

  loadRefresh(done) {
    setTimeout(() => {
      this.$f7.views.main.router.navigate(this.$f7.views.main.router.url, {
        reloadCurrent: true,
      });
      this.setState({
        showPreloader: true,
      });
      done();
    }, 600);
  }

  render() {
    const { arrReview, isLoading } = this.state;
    return (
      <Page
        name="rating-list"
        ptr
        infiniteDistance={50}
        infinitePreloader={this.state.showPreloader}
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
              <span className="title">Service reviews</span>
            </div>
            {arrReview && arrReview.length > 0 ? (
              <div className="page-navbar__noti">
                <Link onClick={() => this.submitReviews()}>
                  <i className="las la-check"></i>
                </Link>
              </div>
            ) : (
              ""
            )}
          </div>
        </Navbar>
        <div className="page-rating">
          <div className="page-rating__list">
            {arrReview && arrReview.length > 0 ? (
              arrReview.map((item, index) => (
                <div className="page-rating__list-item" key={index}>
                  <div className="rating-header">
                    <div className="rating-header__title">
                      {index + 1}. {item.prod.Title}
                    </div>
                    <div className="rating-header__user">
                      <AvatarGroup max={2}>
                        {item.staff.map((user, i) => (
                          <Avatar
                            className="avatar-img"
                            key={i}
                            alt={user.FullName}
                            src={checkAvt2(user.Avatar)}
                          />
                        ))}
                      </AvatarGroup>
                    </div>
                  </div>
                  <div className="rating-content">
                    <div className="name">
                      {item.staff.map((user, i) => (
                        <span key={i}>{user.FullName}</span>
                      ))}
                    </div>
                    <div className="time">
                      Completed at {moment(item.os.BookDate).format("HH:mm DD/MM/YYYY")}
                    </div>
                    <div className="rating">
                      <StarComponent
                        ID={item.os.ID}
                        onClickStar={(star, id) => this.onClickStar(star, id)}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : isLoading ? (
              <>
                <div className="page-rating__list-item">
                  <div className="rating-header">
                    <div className="rating-header__title">
                      <Skeleton height={20} />
                    </div>
                    <div className="rating-header__user">
                      <Skeleton circle={true} height={30} width={30} />
                    </div>
                  </div>
                  <div className="rating-content">
                    <Skeleton height={165} />
                  </div>
                </div>
                <div className="page-rating__list-item">
                  <div className="rating-header">
                    <div className="rating-header__title">
                      <Skeleton height={20} />
                    </div>
                    <div className="rating-header__user">
                      <Skeleton circle={true} height={30} width={30} />
                    </div>
                  </div>
                  <div className="rating-content">
                    <Skeleton height={165} />
                  </div>
                </div>
                <div className="page-rating__list-item">
                  <div className="rating-header">
                    <div className="rating-header__title">
                      <Skeleton height={20} />
                    </div>
                    <div className="rating-header__user">
                      <Skeleton circle={true} height={30} width={30} />
                    </div>
                  </div>
                  <div className="rating-content">
                    <Skeleton height={165} />
                  </div>
                </div>
              </>
            ) : (
              <PageNoData text="There are no unrated services !" />
            )}
          </div>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
