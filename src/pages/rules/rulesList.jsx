import React from "react";
import { SERVER_APP } from "../../constants/config";
import ReactHtmlParser from "react-html-parser";
import NewsDataService from "../../service/news.service";
import { Page, Link, Navbar, Toolbar } from "framework7-react";
import ToolBarBottom from "../../components/ToolBarBottom";
import NotificationIcon from "../../components/NotificationIcon";
import SkeletonNews from "../news/SkeletonNews";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      arrNews: [],
      isLoading: true,
      showPreloader: false,
      NewTitle: window?.GlobalConfig?.APP?.Staff?.RulesTitle,
    };
  }

  componentDidMount() {
    NewsDataService.getNewsNameCate(
      window?.GlobalConfig?.APP?.Staff?.RulesTitle
    )
      .then((response) => {
        const arrNews = response.data.data;
        this.setState({
          arrNews: arrNews,
          isLoading: false,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  loadRefresh(done) {
    NewsDataService.getNewsNameCate(
      window?.GlobalConfig?.APP?.Staff?.RulesTitle
    )
      .then((response) => {
        setTimeout(() => {
          const arrNews = response.data.data;
          this.setState({
            arrNews: arrNews,
            isLoading: false,
          });
          done();
        }, 300);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { isLoading, NewTitle, arrNews } = this.state;
    return (
      <Page
        name="news-list"
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
              <span className="title">{NewTitle}</span>
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
        </Navbar>
        <div className="page-wrapper">
          <div className="page-render">
            <div className="page-news__list page-news__all">
              {!isLoading && (
                <div className="page-news__list-ul">
                  {arrNews &&
                    arrNews.map((item, index) => {
                      return (
                        <Link
                          href={"/news/detail/" + item.id + "/"}
                          className="page-news__list-item"
                          key={item.id}
                        >
                          <div className="images">
                            <img
                              src={SERVER_APP + "/upload/image/" + item.source.Thumbnail}
                              alt={item.source.Title}
                            />
                          </div>
                          <div className="text">
                            <h6>{item.source.Title}</h6>
                            <div className="desc">
                              {ReactHtmlParser(item.source.Desc)}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              )}
              {isLoading && <SkeletonNews />}
            </div>
          </div>
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
