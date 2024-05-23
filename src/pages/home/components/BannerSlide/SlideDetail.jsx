import { Link, Navbar, Page, Toolbar } from "framework7-react";
import React from "react";
import NotificationIcon from "../../../../components/NotificationIcon";
import ToolBarBottom from "../../../../components/ToolBarBottom";
import Skeleton from "react-loading-skeleton";
import AdvDataService from "../../../../service/adv.service";
import { SERVER_APP } from "../../../../constants/config";
import ReactHtmlParser from "react-html-parser";
import { OPEN_LINK } from "../../../../constants/prom21";
export default class SlideList extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
    };
  }
  componentDidMount() {
    const paramsID = this.$f7route.params.id;
    AdvDataService.getDetailAdv(paramsID)
      .then((response) => {
        this.setState({
          arrayItem: response.data.data[0],
          isLoading: false,
        });
      })
      .catch((err) => console.log(error));
  }
  fixedContentDomain = (content) => {
    if (!content) return "";
    return content.replace(/src=\"\//g, 'src="' + SERVER_APP + "/");
  };

  render() {
    const { arrayItem, isLoading } = this.state;
    return (
      <Page name="adv-detail">
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.$f7router.back()}>
                <i className="las la-angle-left"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              {arrayItem ? (
                <span className="title">{arrayItem.Title}</span>
              ) : (
                <span className="title">Loadding ...</span>
              )}
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
        </Navbar>
        {!isLoading && arrayItem ? (
          <div className="page-render p-0 no-bg">
            <div className="page-news">
              <div className="page-news__detail">
                <div className="page-news__detail-img">
                  <img
                    className="w-100"
                    src={`${SERVER_APP}/upload/image/${arrayItem.FileName}`}
                  />
                </div>
                <div className="page-news__detail-content">
                  <div className="page-news__detail-shadow">
                    {ReactHtmlParser(this.fixedContentDomain(arrayItem.Desc), {
                      transform: (node) => {
                        if (
                          node.type === "tag" &&
                          node.attribs.class === "external"
                        ) {
                          return (
                            <Link
                              class="external"
                              onClick={() => OPEN_LINK(node.attribs.href)}
                            >
                              {node.children[0].data}
                            </Link>
                          );
                        }
                      },
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="page-render p-0 no-bg">
            <div className="page-news">
              <div className="page-news__detail">
                <div className="page-news__detail-img">
                  <Skeleton height={180} />
                </div>
                <div className="page-news__detail-content">
                  <div className="page-news__detail-shadow">
                    <Skeleton count={14} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
