import React from "react";
import {
  Link,
  ListInput,
  ListItem,
  Navbar,
  Page,
  Sheet,
  Toolbar,
} from "framework7-react";
import ToolBarBottom from "../../components/ToolBarBottom";
import PageNoData from "../../components/PageNoData";
import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");
export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      List: []
    };
  }

  componentDidMount() {
    this.setState({
      List: [1]
    })
  }

  render() {
    return (
      <Page name="pos">
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link>
                <i className="las la-bars font-size-xl"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">Pos</span>
            </div>
            <div className="page-navbar__filter">
              {/* <NotificationIcon /> */}
              <Link>
                <i className="las la-filter font-size-xl"></i>
              </Link>
            </div>
          </div>
        </Navbar>
        <div className="page-render">
          Bán hàng
          {/* <PageNoData text="Đang cập nhập ..." /> */}
        </div>

        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
