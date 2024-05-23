import React from "react";
import { App, View } from "framework7-react";

import {
  app_request,
  getUser,
  removeUserStorage,
  setUserStorage,
} from "../constants/user";
import UserService from "../service/user.service";
import { setNotiID, getNotiID } from "./../constants/user";
import routes from "../js/routes";
import { NAME_APP } from "../constants/config";
import {
  CLOSE_APP,
  RELOAD_APP,
  REMOVE_BADGE,
  SEND_TOKEN_FIREBASE,
} from "../constants/prom21";
import { iOS } from "../constants/helpers";
import { ref, onValue, set } from "firebase/database";
import { database } from "../firebase/firebase";
import { QueryClient, QueryClientProvider } from "react-query";
import DeviceHelpers from "../constants/DeviceHelpers";

const queryClient = new QueryClient();

window.timeOutForce = null;

export default class extends React.Component {
  constructor() {
    super();

    this.state = {
      // Framework7 Parameters
      f7params: {
        name: NAME_APP, // App name
        theme: "auto", // Automatic theme detection
        id: "vn.cser",
        // App routes
        routes: routes,
        dialog: {
          buttonCancel: "Close",
        },
        on: {
          init: function () {
            window.hasPopup = false;

            const infoUser = getUser();
            if (infoUser) {
              UserService.getInfo().then(({ data }) => {
                if (data?.Status === -1) {
                  SEND_TOKEN_FIREBASE().then(async (response) => {
                    if (!response.error && response.Token) {
                      const { ID, acc_type } = data;
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
                    location.reload();
                  });
                } else if (data?.error && data?.error.indexOf("TOKEN") > -1) {
                  removeUserStorage();
                } else if (data?.token_renew) {
                  setUserStorage(data.token_renew, data);
                } else if (data?.token) {
                  setUserStorage(data.token, data);
                } else {
                  // Không phải lỗi Token
                }
                if (
                  window?.GlobalConfig?.APP?.DeviceCheck &&
                  data?.Status !== -1
                ) {
                  DeviceHelpers.get({
                    success: ({ deviceId }) => {
                      if (data?.DeviceIDs && data?.DeviceIDs !== deviceId) {
                        this.dialog.alert(
                          "Your login session has expired.",
                          () => {
                            SEND_TOKEN_FIREBASE().then(async (response) => {
                              if (!response.error && response.Token) {
                                const { ID, acc_type } = data;
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
                              location.reload();
                            });
                          }
                        );
                      }
                    },
                  });
                }
              });
            }
            //console.log("Lần đầu mở App");
          },
          pageInit: function () {},
        },
        view: {
          allowDuplicateUrls: true,
          routesBeforeEnter: function (to, from, resolve, reject) {
            if (window.GlobalConfig) {
              resolve();
            }
          },
        },
      },
    };
  }

  render() {
    return (
      <QueryClientProvider client={queryClient}>
        <App params={this.state.f7params}>
          {/* Your main view, should have "view-main" class */}
          <View id="main-view" main className="safe-areas" url="/" />
        </App>
      </QueryClientProvider>
    );
  }

  notiDefault = (evt) => {
    if (evt.data.id && Number(getNotiID()) !== Number(evt.data.id)) {
      setNotiID(evt.data.id);
      this.$f7.views.main.router.navigate(`/notification/${evt.data.id}`);
    }
  };

  notiCateProdID = (evt) => {
    this.$f7.views.main.router.navigate(`/shop/list/794/${evt.data.id}`);
  };

  notiProdID = (evt) => {
    this.$f7.views.main.router.navigate(`/shop/detail/${evt.data.id}`);
  };

  notiArtID = (evt) => {
    this.$f7.views.main.router.navigate(`/news/detail/${evt.data.id}`);
  };

  notiVoucher = (evt) => {
    this.$f7.views.main.router.navigate(`/voucher/`);
  };

  ToBackBrowser = () => {
    const { history } = this.$f7.views.main.router;
    if (history.length === 1 && history[0] === "/") {
      CLOSE_APP();
    } else {
      this.$f7.views.main.router.back();
    }
    this.$f7.views.main.app.sheet.close();
  };

  onAppForceIn = () => {
    // window.timeOutForce = setTimeout(() => {
    //   RELOAD_APP();
    // }, 2 * 60 * 1000); //3 * 60 * 60 * 100
  };

  onAppForceOut = () => {
    //if (window.timeOutForce) clearTimeout(window.timeOutForce);
  };

  componentDidMount() {
    window.Dialog = this.$f7.dialog;
    window.APP_READY = true;
    window.percent = 100;
    document.body.addEventListener("noti_click.go_noti", this.notiDefault);
    document.body.addEventListener("noti_click.prod_id", this.notiProdID);
    document.body.addEventListener("noti_click.art_id", this.notiArtID);
    document.body.addEventListener(
      "noti_click.cate_prod_id",
      this.notiCateProdID
    );
    document.body.addEventListener("noti_click.voucher_id", this.notiVoucher);
    //
    document.addEventListener("onAppForceIn", this.onAppForceIn);
    document.addEventListener("onAppForceOut", this.onAppForceOut);
    //
    window.ToBackBrowser = this.ToBackBrowser;

    const starCountRef = ref(database, "logout");
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      const dataArr = data
        ? Object.keys(data).map((key) => {
            return { ...data[key], Key: key };
          })
        : [];

      let UserCurrent = getUser();
      if (UserCurrent && UserCurrent.ID) {
        if (dataArr.findIndex((item) => item.UserID === UserCurrent.ID) > -1) {
          set(ref(database, `/logout/${UserCurrent.ID}`), null).then(() => {
            SEND_TOKEN_FIREBASE().then(async (response) => {
              if (!response.error && response.Token) {
                const { ID, acc_type } = UserCurrent;
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
              this.$f7.views.main.router.navigate("/", {
                reloadCurrent: true,
              });
            });
          });
        }
      }
    });
  }

  componentWillUnmount() {
    document.body.removeEventListener("noti_click.go_noti", this.notiDefault);
    document.body.removeEventListener("noti_click.prod_id", this.notiProdID);
    document.body.removeEventListener("noti_click.art_id", this.notiArtID);
    document.body.removeEventListener(
      "noti_click.cate_prod_id",
      this.notiCateProdID
    );
    document.body.removeEventListener(
      "noti_click.voucher_id",
      this.notiVoucher
    );
    //
    document.removeEventListener("onAppForceIn", this.onAppForceIn);
    document.removeEventListener("onAppForceOut", this.onAppForceOut);
  }
}
