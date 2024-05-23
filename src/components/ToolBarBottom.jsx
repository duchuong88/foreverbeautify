import React from "react";
import { Link } from "framework7-react";
import { getUser } from "../constants/user";
import iconBook from "../assets/images/bookicon.png";
import { checkRole } from "../constants/checkRole";
import PrivateNav from "../auth/PrivateNav";
import { CheckPrivateNav } from "../constants/checkRouterHome";

export default class ToolBarCustom extends React.Component {
  constructor() {
    super();
    this.state = {
      currentUrl: "",
      infoUser: getUser(),
    };
  }
  componentDidMount() {
    var $$ = this.Dom7;
    const TYPE = checkRole();
    if (TYPE && TYPE === "ADMIN") {
      $$(".js-toolbar-bottom").find("a").eq(1).addClass("js-active");
    }
  }

  componentDidUpdate(prevProps, prevState) {
    var href = this.$f7.views.main.router.url;
    var $$ = this.Dom7;
    const TYPE = checkRole();

    $$(".js-toolbar-link").removeClass("js-active");
    if (prevState.currentUrl !== href) {
      $$(".js-toolbar-link").each(function () {
        const _this = $$(this);
        const hrefLink = _this.attr("href");
        if (href === "/") {
          if (!TYPE || TYPE === "M") {
            $$(".js-toolbar-bottom").find("a").eq(0).addClass("js-active");
            $$(".page-current .js-toolbar-bottom")
              .find("a")
              .eq(0)
              .addClass("js-active");
          }
          if (TYPE === "STAFF") {
            $$(".js-toolbar-bottom").find("a").eq(0).addClass("js-active");
          }
          if (TYPE === "ADMIN") {
            $$(".js-toolbar-bottom").find("a").eq(1).addClass("js-active");
          }
        }
        if (
          hrefLink === href ||
          href
            .split("/")
            .filter((o) => o)
            .some((x) =>
              hrefLink
                .split("/")
                .filter((k) => k)
                .includes(x)
            )
        ) {
          _this.addClass("js-active");
        }
      });
    }
  }

  checkTotal = () => {
    const TYPE = checkRole();

    if (TYPE === "ADMIN") {
      return 3;
    }
    if (TYPE === "STAFF") {
      const arrType = [
        CheckPrivateNav(["service"]),
        [1],
        CheckPrivateNav(["director"]),
        [1],
      ];
      return arrType.filter((item) => item).length;
    }
    return 5;
  };

  menuToolbar = () => {
    const TYPE = checkRole();
    switch (TYPE) {
      case "STAFF":
        return (
          <React.Fragment>
            <PrivateNav
              className="page-toolbar-bottom__link js-toolbar-link"
              icon="las la-hand-holding-heart"
              text="Service"
              roles={["service"]}
              href="/"
            />
            <PrivateNav
              className="page-toolbar-bottom__link js-toolbar-link"
              icon="las la-piggy-bank"
              text="Statistical"
              roles={"all"}
              href="/employee/statistical/"
            />
            <PrivateNav
              className="page-toolbar-bottom__link js-toolbar-link"
              icon="las la-chart-bar"
              text="Report"
              roles={["director"]}
              href="/report/"
            />
            {window?.GlobalConfig?.APP?.Staff?.RulesTitle && (
              <Link
                noLinkClass
                href="/rules-list/"
                className={`page-toolbar-bottom__link js-toolbar-link ${TYPE}`}
              >
                <i className="las la-certificate"></i>
                <span>Rules</span>
              </Link>
            )}
            <PrivateNav
              className="page-toolbar-bottom__link js-toolbar-link"
              icon="las la-user-circle"
              text="Account"
              roles="all"
              href="/detail-profile/"
            />
          </React.Fragment>
        );
      case "ADMIN":
        return (
          <React.Fragment>
            <PrivateNav
              className="page-toolbar-bottom__link js-toolbar-link"
              icon="las la-piggy-bank"
              text="Statistical"
              roles={[]}
              href="/employee/statistical/"
            />
            <PrivateNav
              className="page-toolbar-bottom__link js-toolbar-link"
              icon="las la-chart-bar"
              text="Report"
              roles={[]}
              href="/report/"
            />
            {window?.GlobalConfig?.APP?.Staff?.RulesTitle && (
              <Link
                noLinkClass
                href="/rules-list/"
                className={`page-toolbar-bottom__link js-toolbar-link ${TYPE}`}
              >
                <i className="las la-certificate"></i>
                <span>Rules</span>
              </Link>
            )}
            <Link
              noLinkClass
              href="/detail-profile/"
              className={`page-toolbar-bottom__link js-toolbar-link ${TYPE}`}
            >
              <i className="las la-user-circle"></i>
              <span>Account</span>
            </Link>
          </React.Fragment>
        );
      case "M":
        return (
          <React.Fragment>
            <Link
              noLinkClass
              href="/news/"
              className="page-toolbar-bottom__link js-toolbar-link"
            >
              <i className="las la-newspaper"></i>
            </Link>
            {window?.GlobalConfig?.APP?.isSell ? (
              <>
                <Link
                  noLinkClass
                  href="/voucher/"
                  className="page-toolbar-bottom__link js-toolbar-link voucher"
                >
                  <svg
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 511.999 511.999"
                    xmlSpace="preserve"
                  >
                    <g>
                      <g>
                        <path d="M196.88,125.972c-6.527-6.527-17.113-6.529-23.641,0l-47.284,47.283c-6.529,6.527-6.529,17.113,0,23.641 c6.527,6.529,17.113,6.529,23.641,0l47.284-47.283C203.409,143.086,203.409,132.5,196.88,125.972z" />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path d="M492.398,326.925c12.63-12.63,19.586-29.422,19.586-47.284c0-17.861-6.955-34.653-19.586-47.283L279.625,19.585 C266.995,6.955,250.203,0,232.342,0s-34.653,6.955-47.283,19.585l-12.806,12.806C133.112,4.535,78.292,8.147,43.211,43.227 C7.459,78.978,4.917,133.846,32.365,172.28l-12.795,12.795c-26.072,26.072-26.072,68.493,0,94.565l212.774,212.774 c12.63,12.63,29.422,19.585,47.284,19.585s34.653-6.955,47.283-19.585l12.795-12.795c38.444,27.454,93.315,24.892,129.053-10.846 c35.738-35.738,38.302-90.609,10.846-129.053L492.398,326.925z M468.757,303.283l-23.641,23.641 c-6.524,6.523-6.529,17.113,0,23.641c26.132,26.132,26.137,68.43,0,94.566c-26.132,26.131-68.43,26.137-94.566,0 c-6.526-6.529-17.112-6.527-23.641,0l-23.642,23.641c-13.066,13.066-34.214,13.067-47.284,0L66.851,279.642l35.461-35.461 c6.529-6.529,6.529-17.113,0-23.641c-6.527-6.529-17.113-6.529-23.641,0l-35.461,35.461c-13.065-13.066-13.068-34.214,0-47.283 l23.642-23.641c6.524-6.523,6.529-17.114,0-23.641c-12.63-12.63-19.586-29.422-19.586-47.284 c0-36.955,29.908-66.868,66.868-66.868c17.861,0,34.653,6.957,47.284,19.586c6.527,6.529,17.113,6.527,23.641,0l23.642-23.641 c6.315-6.315,14.711-9.793,23.641-9.793c8.931,0,17.327,3.478,23.642,9.793l-35.462,35.462c-6.529,6.527-6.529,17.113,0,23.641 c6.527,6.529,17.112,6.529,23.641,0l35.461-35.464l189.131,189.132C481.825,269.069,481.824,290.215,468.757,303.283z" />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path d="M279.625,145.905c-9.232,0-16.717,7.485-16.717,16.717v234.039c0,9.232,7.485,16.717,16.717,16.717 c9.232,0,16.717-7.485,16.717-16.717V162.622C296.342,153.39,288.858,145.905,279.625,145.905z" />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path d="M179.323,229.491c-27.653,0-50.151,22.498-50.151,50.151c0,27.653,22.498,50.151,50.151,50.151 c27.653,0,50.151-22.498,50.151-50.151C229.474,251.988,206.976,229.491,179.323,229.491z M179.323,296.359 c-9.218,0-16.717-7.499-16.717-16.717s7.499-16.717,16.717-16.717s16.717,7.499,16.717,16.717S188.541,296.359,179.323,296.359z" />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path d="M379.928,229.491c-27.653,0-50.151,22.498-50.151,50.151c0,27.653,22.498,50.151,50.151,50.151 c27.653,0,50.151-22.498,50.151-50.151C430.079,251.988,407.581,229.491,379.928,229.491z M379.928,296.359 c-9.218,0-16.717-7.499-16.717-16.717s7.499-16.717,16.717-16.717c9.218,0,16.717,7.499,16.717,16.717 S389.146,296.359,379.928,296.359z" />
                      </g>
                    </g>
                  </svg>
                </Link>
              </>
            ) : (
              <>
                <Link
                  noLinkClass
                  href="/shop/"
                  className="page-toolbar-bottom__link js-toolbar-link"
                >
                  <i className="las la-shopping-cart"></i>
                </Link>
              </>
            )}
            {window?.GlobalConfig?.APP?.isSell ? (
              <>
                <Link
                  noLinkClass
                  href="/shop/"
                  className="page-toolbar-bottom__link active"
                >
                  <div className="page-toolbar-bottom__link-inner">
                    <i className="las la-shopping-basket"></i>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link
                  noLinkClass
                  href="/schedule/"
                  className="page-toolbar-bottom__link active"
                >
                  <div className="page-toolbar-bottom__link-inner">
                    <img src={iconBook} alt="Booking" />
                    {/* <i className="las la-calendar-plus"></i> */}
                  </div>
                </Link>
              </>
            )}
            {window?.GlobalConfig?.APP?.isSell ? (
              <Link
                noLinkClass
                href="/maps/"
                className="page-toolbar-bottom__link js-toolbar-link"
              >
                <i className="las la-map-marked-alt"></i>
              </Link>
            ) : (
              <Link
                noLinkClass
                href="/cardservice/"
                className="page-toolbar-bottom__link js-toolbar-link"
              >
                <i className="las la-clipboard-list"></i>
              </Link>
            )}

            <Link
              noLinkClass
              href="/profile/"
              className="page-toolbar-bottom__link js-toolbar-link"
            >
              <i className="las la-user-circle"></i>
            </Link>
          </React.Fragment>
        );
      default:
        return (
          <React.Fragment>
            <Link
              noLinkClass
              href="/news/"
              className="page-toolbar-bottom__link js-toolbar-link"
            >
              <i className="las la-newspaper"></i>
            </Link>
            {window?.GlobalConfig?.APP?.isSell ? (
              <>
                <Link
                  noLinkClass
                  href="/login/"
                  className="page-toolbar-bottom__link js-toolbar-link voucher"
                >
                  <svg
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 511.999 511.999"
                    xmlSpace="preserve"
                  >
                    <g>
                      <g>
                        <path d="M196.88,125.972c-6.527-6.527-17.113-6.529-23.641,0l-47.284,47.283c-6.529,6.527-6.529,17.113,0,23.641 c6.527,6.529,17.113,6.529,23.641,0l47.284-47.283C203.409,143.086,203.409,132.5,196.88,125.972z" />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path d="M492.398,326.925c12.63-12.63,19.586-29.422,19.586-47.284c0-17.861-6.955-34.653-19.586-47.283L279.625,19.585 C266.995,6.955,250.203,0,232.342,0s-34.653,6.955-47.283,19.585l-12.806,12.806C133.112,4.535,78.292,8.147,43.211,43.227 C7.459,78.978,4.917,133.846,32.365,172.28l-12.795,12.795c-26.072,26.072-26.072,68.493,0,94.565l212.774,212.774 c12.63,12.63,29.422,19.585,47.284,19.585s34.653-6.955,47.283-19.585l12.795-12.795c38.444,27.454,93.315,24.892,129.053-10.846 c35.738-35.738,38.302-90.609,10.846-129.053L492.398,326.925z M468.757,303.283l-23.641,23.641 c-6.524,6.523-6.529,17.113,0,23.641c26.132,26.132,26.137,68.43,0,94.566c-26.132,26.131-68.43,26.137-94.566,0 c-6.526-6.529-17.112-6.527-23.641,0l-23.642,23.641c-13.066,13.066-34.214,13.067-47.284,0L66.851,279.642l35.461-35.461 c6.529-6.529,6.529-17.113,0-23.641c-6.527-6.529-17.113-6.529-23.641,0l-35.461,35.461c-13.065-13.066-13.068-34.214,0-47.283 l23.642-23.641c6.524-6.523,6.529-17.114,0-23.641c-12.63-12.63-19.586-29.422-19.586-47.284 c0-36.955,29.908-66.868,66.868-66.868c17.861,0,34.653,6.957,47.284,19.586c6.527,6.529,17.113,6.527,23.641,0l23.642-23.641 c6.315-6.315,14.711-9.793,23.641-9.793c8.931,0,17.327,3.478,23.642,9.793l-35.462,35.462c-6.529,6.527-6.529,17.113,0,23.641 c6.527,6.529,17.112,6.529,23.641,0l35.461-35.464l189.131,189.132C481.825,269.069,481.824,290.215,468.757,303.283z" />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path d="M279.625,145.905c-9.232,0-16.717,7.485-16.717,16.717v234.039c0,9.232,7.485,16.717,16.717,16.717 c9.232,0,16.717-7.485,16.717-16.717V162.622C296.342,153.39,288.858,145.905,279.625,145.905z" />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path d="M179.323,229.491c-27.653,0-50.151,22.498-50.151,50.151c0,27.653,22.498,50.151,50.151,50.151 c27.653,0,50.151-22.498,50.151-50.151C229.474,251.988,206.976,229.491,179.323,229.491z M179.323,296.359 c-9.218,0-16.717-7.499-16.717-16.717s7.499-16.717,16.717-16.717s16.717,7.499,16.717,16.717S188.541,296.359,179.323,296.359z" />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path d="M379.928,229.491c-27.653,0-50.151,22.498-50.151,50.151c0,27.653,22.498,50.151,50.151,50.151 c27.653,0,50.151-22.498,50.151-50.151C430.079,251.988,407.581,229.491,379.928,229.491z M379.928,296.359 c-9.218,0-16.717-7.499-16.717-16.717s7.499-16.717,16.717-16.717c9.218,0,16.717,7.499,16.717,16.717 S389.146,296.359,379.928,296.359z" />
                      </g>
                    </g>
                  </svg>
                </Link>
              </>
            ) : (
              <>
                <Link
                  noLinkClass
                  href="/shop/"
                  className="page-toolbar-bottom__link js-toolbar-link"
                >
                  <i className="las la-shopping-cart"></i>
                </Link>
              </>
            )}
            {window?.GlobalConfig?.APP?.isSell ? (
              <>
                <Link
                  noLinkClass
                  href="/shop/"
                  className="page-toolbar-bottom__link active"
                >
                  <div className="page-toolbar-bottom__link-inner">
                    <i className="las la-shopping-basket"></i>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link
                  noLinkClass
                  href="/login/"
                  className="page-toolbar-bottom__link active"
                >
                  <div className="page-toolbar-bottom__link-inner">
                    <img src={iconBook} alt="Booking" />
                  </div>
                </Link>
              </>
            )}

            <Link
              noLinkClass
              href="/maps/"
              className="page-toolbar-bottom__link js-toolbar-link"
            >
              <i className="las la-map-marked-alt"></i>
            </Link>
            <Link
              noLinkClass
              href="/login/"
              className="page-toolbar-bottom__link js-toolbar-link"
            >
              <i className="las la-user-circle"></i>
            </Link>
            <div className="page-toolbar-indicator">
              <div className="page-toolbar-indicator__left"></div>
              <div className="page-toolbar-indicator__right"></div>
            </div>
          </React.Fragment>
        );
    }
  };

  render() {
    return (
      <div className="page-toolbar">
        <div
          className={`page-toolbar-bottom js-toolbar-bottom total-${this.checkTotal()}`}
          id="js-toolbar-bottom"
        >
          {this.menuToolbar()}
        </div>
      </div>
    );
  }
}
