import React from "react";
import { Link } from "framework7-react";
import Slider from "react-slick";
import ReactHtmlParser from "react-html-parser";
import SkeletonNews from "../news/SkeletonNews";
import NewsDataService from "../../../../service/news.service";
import { SERVER_APP } from "../../../../constants/config";

export default class NewsList extends React.Component {
  constructor() {
    super();
    this.state = {
      width: window.innerWidth,
      isLoading: true,
      NewTitle: null,
    };
  }
  componentDidMount() {
    this.getNewsAll();
    this.getInfoCate();
  }
  handStyle = () => {
    const _width = this.state.width - 120;
    return Object.assign({
      width: _width,
    });
  };

  getNewsAll = () => {
    NewsDataService.getNewsIdCate("835")
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
  };

  getInfoCate = () => {
    NewsDataService.getInfoCate("835")
      .then(({ data }) => {
        this.setState({ NewTitle: data.data });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    const { arrNews, isLoading, NewTitle } = this.state;
    const settingsNews = {
      className: "slider variable-width",
      dots: false,
      arrows: false,
      infinite: true,
      slidesToShow: 1,
      centerPadding: "20px",
      variableWidth: true,
    };
    return (
      <div className="home-page__news">
        <div className="page-news__list">
          <div className="page-news__list-head">
            <h5>
              <Link href={`/news-list/${NewTitle && NewTitle.length > 0 && NewTitle[0].ID}`}>
                {NewTitle && NewTitle.length > 0 && NewTitle[0].Title}{" "}
                <i className="las la-angle-right"></i>
              </Link>
            </h5>
          </div>
          <div className="page-news__list-ul">
            {!isLoading && (
              <Slider {...settingsNews}>
                {arrNews &&
                  arrNews.map((item, index) => {
                    if (index > 6) return null;
                    return (
                      <Link
                        href={"/news/detail/" + item.id + "/"}
                        className="page-news__list-item"
                        key={item.id}
                        style={this.handStyle()}
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
              </Slider>
            )}
            {isLoading && <SkeletonNews />}
          </div>
        </div>
      </div>
    );
  }
}
