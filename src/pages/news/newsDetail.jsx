import React from "react";
import { SERVER_APP } from "./../../constants/config";
import Skeleton from "react-loading-skeleton";
import ReactHtmlParser from "react-html-parser";
import NewsDataService from "../../service/news.service";
import { Page, Link, Navbar, Toolbar } from "framework7-react";
import ToolBarBottom from "../../components/ToolBarBottom";
import NotificationIcon from "../../components/NotificationIcon";
import Dom7 from "dom7";
import { OPEN_LINK } from "../../constants/prom21";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      arrayItem: [],
      isLoading: true,
      showPreloader: false,
    };
  }

  fixedContentDomain = (content) => {
    if (!content) return "";
    return content.replace(/src=\"\//g, 'src="' + SERVER_APP + "/");
  };

  componentDidMount() {
    const paramsID = this.$f7route.params.postId;
    NewsDataService.getDetailNew(paramsID)
      .then((response) => {
        this.setState({
          arrayItem: response.data.data[0],
          isLoading: false,
        });
      })
      .catch((er) => console.log(er));
  }

  loadRefresh(done) {
    setTimeout(() => {
      this.$f7.views.main.router.navigate(this.$f7.views.main.router.url, {
        reloadCurrent: true,
      });
      this.setState({
        showPreloader: true,
      });
      done();
    }, 1000);
  }

  render() {
    const { arrayItem, isLoading } = this.state;
    return (
      <Page
        name="news-list-detail"
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
              {arrayItem ? (
                <span className="title">{arrayItem.Title}</span>
              ) : (
                <span className="title">Loading ...</span>
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
                  <img src={SERVER_APP + arrayItem.Thumbnail_web} />
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
                    {ReactHtmlParser(
                      this.fixedContentDomain(arrayItem.Content),
                      {
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
                      }
                    )}
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
