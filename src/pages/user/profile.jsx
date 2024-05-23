import React from "react";
import bgImage from "../../assets/images/headerbottombgapp.png";
import imgWallet from "../../assets/images/wallet.svg";
import imgLocation from "../../assets/images/location.svg";
import imgOrder from "../../assets/images/order.svg";
import imgDiary from "../../assets/images/diary.svg";
import imgCoupon from "../../assets/images/coupon.svg";
import imgEvaluate from "../../assets/images/evaluate.svg";
import { checkAvt } from "../../constants/format";
import { getUser, getPassword, app_request } from "../../constants/user";
import { Page, Link, Toolbar, Row, Col, f7 } from "framework7-react";
import ToolBarBottom from "../../components/ToolBarBottom";
import UserService from "../../service/user.service";
import Skeleton from "react-loading-skeleton";
import {
  REMOVE_BADGE,
  SEND_TOKEN_FIREBASE,
  SET_BADGE,
} from "../../constants/prom21";
import { iOS } from "../../constants/helpers";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      memberInfo: {},
      isLoading: true,
      showPreloader: false,
    };
  }
  componentDidMount() {
    // const username = infoUser.MobilePhone
    //   ? infoUser.MobilePhone
    //   : infoUser.UserName;
    // const password = getPassword();
    UserService.getInfo()
      .then(({ data }) => {
        if (data.error) {
          this.$f7router.navigate("/login/");
        } else {
          this.setState({
            memberInfo: data,
            isLoading: false,
          });
        }
      })
      .catch((err) => console.log(err));
  }
  signOut = () => {
    const $$this = this;
    $$this.$f7.dialog.confirm(
      "You want to log out of your account ?",
      async () => {
        f7.dialog.preloader(`Log out ...`);
        SEND_TOKEN_FIREBASE().then(async (response) => {
          if (!response.error && response.Token) {
            const { ID, acc_type } = getUser();
            await UserService.authRemoveFirebase({
              Token: response.Token,
              ID: ID,
              Type: acc_type,
            });
          } else {
            app_request("unsubscribe", "");
          }
          iOS() && REMOVE_BADGE();
          await localStorage.clear();
          await new Promise((resolve) => setTimeout(resolve, 800));
          f7.dialog.close();
          $$this.$f7router.navigate("/", {
            reloadCurrent: true,
          });
        });
      }
    );
  };

  checkMember = (memberInfo) => {
    if (!memberInfo) return false;
    if (memberInfo.acc_type === "M") {
      return memberInfo.acc_group > 0
        ? memberInfo.MemberGroups[0].Title
        : "Thành viên";
    }
    if (memberInfo.ID === 1) {
      return "ADMIN";
    }
    if (memberInfo.acc_type === "U" && memberInfo.GroupTitles.length > 0) {
      return memberInfo.GroupTitles.join(", ");
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
    const { memberInfo, isLoading } = this.state;
    return (
      <Page
        name="profile-list"
        noNavbar
        ptr
        infiniteDistance={50}
        infinitePreloader={this.state.showPreloader}
        onPtrRefresh={this.loadRefresh.bind(this)}
      >
        <div className="profile-bg">
          <div className="page-login__back">
            <Link onClick={() => this.$f7router.back()}>
              <i className="las la-arrow-left"></i>
            </Link>
          </div>
          <div className="name">{memberInfo && memberInfo.FullName}</div>
          <div className="profile-bg__logout">
            <Link onClick={() => this.signOut()}>
              <i className="las la-sign-out-alt"></i>
            </Link>
          </div>
          <img src={bgImage} />
        </div>
        <div className="profile-info">
          <div
            className="profile-info__avatar"
            onClick={() =>
              this.$f7.views.main.router.navigate("/detail-profile/")
            }
          >
            {isLoading ? (
              <Skeleton circle={true} height={90} width={90} />
            ) : (
              <img src={checkAvt(memberInfo && memberInfo.Photo)} />
            )}

            {/* <Link noLinkClass href="/detail-profile/">
              <i className="las la-pen"></i>
            </Link> */}
          </div>
          {isLoading ? (
            <div className="profile-info__basic">
              <div className="name">
                <Skeleton width={100} count={1} />
              </div>
              <div className="group">
                <Skeleton width={120} count={1} />
              </div>
            </div>
          ) : (
            <div className="profile-info__basic">
              <div className="name">{memberInfo && memberInfo.FullName}</div>
              <div className="group">
                {this.checkMember(memberInfo && memberInfo)}
              </div>
            </div>
          )}

          <div className="profile-info__shortcuts">
            <div className="profile-info__shortcut">
              <Row>
                <Col width="50">
                  <div className="profile-info__shortcut-item">
                    <Link noLinkClass href="/detail-profile/">
                      Personal information
                    </Link>
                  </div>
                </Col>
                <Col width="50">
                  <div className="profile-info__shortcut-item">
                    <Link noLinkClass href="/barcode/">
                      Check In
                    </Link>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div className="profile-function">
          <Row>
            <Col width="33">
              <Link noLinkClass href="/wallet/">
                <div className="image">
                  <img src={imgWallet} />
                </div>
                <span>Wallets & Money Cards</span>
              </Link>
            </Col>
            <Col width="33">
              <Link noLinkClass href="/diary/">
                <div className="image">
                  <img src={imgDiary} />
                </div>
                <span>Diary</span>
              </Link>
            </Col>
            <Col width="33">
              <Link noLinkClass href="/order/">
                <div className="image">
                  <img src={imgOrder} />
                </div>
                <span>Order</span>
              </Link>
            </Col>
            <Col width="33">
              <Link noLinkClass href="/voucher/">
                <div className="image">
                  <img src={imgCoupon} />
                </div>
                <span>Discount code</span>
              </Link>
            </Col>
            {!window?.GlobalConfig?.APP?.isSell && (
              <Col width="33">
                <Link noLinkClass href="/rating/">
                  <div className="image">
                    <img src={imgEvaluate} />
                  </div>
                  <span>Evaluate</span>
                </Link>
              </Col>
            )}
            <Col width="33">
              <Link noLinkClass href="/maps/">
                <div className="image">
                  <img src={imgLocation} />
                </div>
                <span>Contact</span>
              </Link>
            </Col>
            {window?.GlobalConfig?.APP?.isSell && <Col width="33"></Col>}
          </Row>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
