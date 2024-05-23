import { Link, Page, Preloader, Toolbar } from "framework7-react";
import React from "react";
import ToolBarBottom from "../../components/ToolBarBottom";
import { GrClock, GrClose } from "react-icons/gr";
import {
  getKeySearch,
  getStockIDStorage,
  getViewed,
  removeKeySearch,
  removeViewed,
  setKeySearch,
} from "../../constants/user";
import { checkImageProduct } from "../../constants/format";
import ShopDataService from "../../service/shop.service";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      isSearch: false,
      isLoading: false,
      showPreloader: false,
    };
  }

  componentDidMount() {
    this.nameInput.focus();
    const getVieweds = getViewed();
    const getKeySearchs = getKeySearch();
    this.setState({
      getVieweds,
      getKeySearchs,
    });
  }

  componentWillMount() {
    this.delayedCallback = _.debounce(function (event) {
      const value = event.target.value;
      if (value.length > 0) {
        this.setState({
          isSearch: true,
          isLoading: true,
        });
        this.getkeySeach(value);
      } else {
        this.setState({
          isSearch: false,
        });
      }
    }, 1000);
  }

  getkeySeach = (key) => {
    const stockid = getStockIDStorage() || 0;
    const data = {
      key: key,
      count: 8,
      stockid: stockid,
    };
    ShopDataService.searchProd(data)
      .then(async (response) => {
        const result = response.data.data.lst;
        await setKeySearch(key);
        this.setState({
          arrSearch: result,
          isLoading: false,
          getVieweds: getViewed(),
          getKeySearchs: getKeySearch(),
        });
      })
      .catch((error) => console.log(error));
  };

  onChangeSearch = (event) => {
    this.setState({
      valueSearch: event.target.value,
    });
    event.persist();
    this.delayedCallback(event);
  };

  removeViewted = async (item) => {
    await removeViewed(item);
    this.setState({
      getVieweds: getViewed(),
    });
  };

  removeHistory = async (item) => {
    await removeKeySearch(item);
    this.setState({
      getKeySearchs: getKeySearch(),
    });
  };

  seachKeyHistory = async (item) => {
    this.setState({
      isSearch: true,
      isLoading: true,
      valueSearch: item,
    });
    await this.getkeySeach(item);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.setState({
      isLoading: false,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { valueSearch } = this.state;
    if (!valueSearch) return;
    this.setState({
      isSearch: true,
      isLoading: true,
    });
    await this.getkeySeach(valueSearch);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.setState({
      isLoading: false,
    });
  };

  async loadRefresh(done) {
    const { valueSearch } = this.state;
    this.setState({
      showPreloader: true,
    });
    if (valueSearch) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await this.getkeySeach(valueSearch);
      this.setState({
        showPreloader: false,
      });
      done();
    } else {
      setTimeout(() => {
        this.setState({
          showPreloader: false,
        });
        done();
      }, 800);
    }
  }

  render() {
    const {
      isSearch,
      arrSearch,
      isLoading,
      getVieweds,
      getKeySearchs,
      valueSearch,
      showPreloader,
    } = this.state;
    return (
      <Page
        noNavbar
        name="search"
        ptr
        //infiniteDistance={50}
        onPtrRefresh={this.loadRefresh.bind(this)}
      >
        <div className={`page-search ${showPreloader && "show-preloader"}`}>
          <div className="page-search__header">
            <Link onClick={() => this.$f7router.back()}>
              <i className="las la-angle-left"></i>
            </Link>
            <div className="form-search">
              <form onSubmit={this.handleSubmit}>
                <input
                  type="search"
                  placeholder="You want to find ?"
                  ref={(input) => {
                    this.nameInput = input;
                  }}
                  value={valueSearch || ""}
                  onChange={this.onChangeSearch}
                />
              </form>
            </div>
          </div>
          {isLoading && <div className="line-loading"></div>}

          <div
            className="text-align-center preloader-custom"
            style={{ padding: "20px 0 10px 0" }}
          >
            <Preloader size={28} />
          </div>

          {!isSearch && (
            <div className="page-search__content">
              <div className="history">
                <div className="history-title">Recent searches</div>
                {!getKeySearchs || getKeySearchs.length === 0 ? (
                  <div className="no-history">You haven't searched for anything recently.</div>
                ) : (
                  ""
                )}
                <ul>
                  {getKeySearchs &&
                    getKeySearchs.map((item, key) => (
                      <li key={key}>
                        <Link
                          noLinkClass
                          onClick={() => this.seachKeyHistory(item)}
                        >
                          <GrClock />
                          <span>{item}</span>
                        </Link>
                        <div
                          className="closes"
                          onClick={() => this.removeHistory(item)}
                        >
                          <GrClose />
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
              {getVieweds && (
                <div className="viewed">
                  <ul>
                    {getVieweds.map((item, index) => {
                      if (index > 5) return false;
                      return (
                        <li key={index}>
                          <Link noLinkClass href={`/shop/detail/${item.ID}`}>
                            <div className="image">
                              <img
                                src={checkImageProduct(item.Thumbnail)}
                                alt={item.title}
                              />
                            </div>
                            <div className="title">{item.Title}</div>
                          </Link>
                          <div
                            className="closes"
                            onClick={() => this.removeViewted(item)}
                          >
                            <GrClose />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}

          {isSearch && (
            <>
              <div className="page-search__content">
                {arrSearch && arrSearch.length === 0 ? (
                  <div className="s-empty">Not found.</div>
                ) : (
                  <div className="search-list">
                    <ul>
                      {arrSearch &&
                        arrSearch.map((item, index) => (
                          <li key={index}>
                            <Link
                              href={`/shop/detail/${item.source.ID}`}
                              noLinkClass
                            >
                              <div className="image">
                                <img
                                  src={checkImageProduct(item.source.Thumbnail)}
                                  alt={item.source.Title}
                                />
                              </div>
                              <div className="text">{item.source.Title}</div>
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
