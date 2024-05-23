import React from "react";
import {
  Page,
  Link,
  Navbar,
  Toolbar,
  Tabs,
  Tab,
  Subnavbar,
} from "framework7-react";
import { getUser, getPassword } from "../../constants/user";
import UserService from "../../service/user.service";
import ToolBarBottom from "../../components/ToolBarBottom";
import ItemCardService from "../../components/ItemCardService";
import NotificationIcon from "../../components/NotificationIcon";
import SelectStock from "../../components/SelectStock";
import PageNoData from "../../components/PageNoData";
import SkeletonCardService from "./CardService/SkeletonCardService";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpenStock: false,
      countSv: 0, // Số lương thẻ
      cardSv: [], // Thẻ dịch vụ
      insuranceSV: [], // Thẻ bảo hành
      excessiveSv: [], // Thẻ hết hạn,
      showPreloader: false,
      loading: false,
    };
  }

  componentDidMount() {
    const infoUser = getUser();
    const infoUsername = infoUser.MobilePhone;
    const infoMemberID = infoUser.ID;
    const infoPassword = getPassword();

    this.getTagService(infoUsername, infoPassword, infoMemberID);
  }

  getTagService = (username, password, memberid) => {
    this.setState({
      loading: true,
    });
    UserService.getListTagService(memberid, 1)
      .then(({ data }) => {
        this.setState({
          countSv: data.length || 0,
          cardSv: data ? data.filter((item) => item.TabIndex === 0) : [],
          insuranceSV: data ? data.filter((item) => item.TabIndex === 1) : [],
          excessiveSv: data ? data.filter((item) => item.TabIndex === 2) : [],
          loading: false,
        });
      })
      .catch((e) => console.log(e));
  };

  openStock = () => {
    this.setState({
      isOpenStock: !this.state.isOpenStock,
    });
  };

  loadRefresh(done) {
    const infoUser = getUser();
    const infoUsername = infoUser.MobilePhone;
    const infoMemberID = infoUser.ID;
    const infoPassword = getPassword();
    setTimeout(() => {
      this.getTagService(infoUsername, infoPassword, infoMemberID);
      this.setState({
        showPreloader: true,
      });
      done();
    }, 600);
  }

  render() {
    const { isOpenStock, countSv, cardSv, insuranceSV, excessiveSv, loading } =
      this.state;
    return (
      <Page
        name="tagservice"
        ptr
        infiniteDistance={50}
        infinitePreloader={this.state.showPreloader}
        onPtrRefresh={this.loadRefresh.bind(this)}
      >
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.openStock()}>
                <i className="las la-map-marked-alt"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">Service card ({countSv})</span>
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
          <Subnavbar className="cardservice-tab-head">
            <div className="cardservice-title">
              <Link noLinkClass tabLink="#cardSv" tabLinkActive>
                Service card
              </Link>
              <Link noLinkClass tabLink="#insuranceSV">
                Insurance card
              </Link>
              <Link noLinkClass tabLink="#excessiveSv">
                Expired
              </Link>
            </div>
          </Subnavbar>
        </Navbar>
        <div className="page-render p-0">
          <Tabs>
            <Tab id="cardSv" tabActive>
              <div className="cardservice-item">
                {loading &&
                  Array(2)
                    .fill()
                    .map((item, index) => <SkeletonCardService key={index} />)}
                {!loading && (
                  <React.Fragment>
                    {cardSv && cardSv.length > 0 ? (
                      cardSv.map((item, index) => (
                        <ItemCardService key={index} item={item} />
                      ))
                    ) : (
                      <PageNoData />
                    )}
                  </React.Fragment>
                )}
              </div>
            </Tab>
            <Tab id="insuranceSV">
              <div className="cardservice-item">
                {loading &&
                  Array(2)
                    .fill()
                    .map((item, index) => <SkeletonCardService key={index} />)}
                {!loading && (
                  <React.Fragment>
                    {insuranceSV && insuranceSV.length > 0 ? (
                      insuranceSV.map((item, index) => (
                        <ItemCardService key={index} item={item} />
                      ))
                    ) : (
                      <PageNoData data="No warranty card" />
                    )}
                  </React.Fragment>
                )}
              </div>
            </Tab>
            <Tab id="excessiveSv">
              <div className="cardservice-item">
                {loading &&
                  Array(2)
                    .fill()
                    .map((item, index) => <SkeletonCardService key={index} />)}
                {!loading && (
                  <React.Fragment>
                    {excessiveSv && excessiveSv.length > 0 ? (
                      excessiveSv.map((item, index) => (
                        <ItemCardService key={index} item={item} />
                      ))
                    ) : (
                      <PageNoData data="No expired cards" />
                    )}
                  </React.Fragment>
                )}
              </div>
            </Tab>
          </Tabs>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
        <SelectStock isOpenStock={isOpenStock} />
      </Page>
    );
  }
}
