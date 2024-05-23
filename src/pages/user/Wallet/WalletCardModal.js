import { Button, PageContent, Sheet } from "framework7-react";
import React, { useEffect, useState } from "react";
import LoadingDot from "../../../components/Loading/LoadingDot";
import { formatPriceVietnamese } from "../../../constants/format";
import userService from "../../../service/user.service";
import Skeleton from "react-loading-skeleton";
import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

function WalletCardModal({ sheetOpened, hideOpenSheet }) {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (sheetOpened.open && sheetOpened.ID) {
      setLoading(true);
      userService
        .getCardDetailWallet(sheetOpened.ID)
        .then(({ data }) => {
          setContent(data.data);
          setLoading(false);
        })
        .catch((error) => console.log(error));
    }
  }, [sheetOpened]);

  return (
    <Sheet
      opened={sheetOpened.open}
      className={`sheet-detail sheet-detail-wallet sheet-detail-order`}
      style={{
        height: "auto !important",
        maxHeight: "100%",
        overflow: "auto",
        "--f7-sheet-bg-color": "#fff",
      }}
      onSheetClosed={() => {
        hideOpenSheet();
      }}
      //swipeToClose
      backdrop
    >
      <Button className="show-close sheet-close" onClick={hideOpenSheet}>
        <i className="las la-times"></i>
      </Button>
      <PageContent>
        {sheetOpened.item && (
          <div>
            <div className="title-wallet">
              <h4>{sheetOpened.item.ten}</h4>
            </div>
            <div className="content-list">
              {
                sheetOpened.item.gia_tri_the !== sheetOpened.item.gia_tri_chi_tieu && <div className="item">
                  <div className="title">
                    Money card value
                    <span className="price">
                      ( {formatPriceVietnamese(sheetOpened.item.gia_tri_the)} )
                    </span>
                  </div>
                  {(sheetOpened.item.gioi_han_sp > 0 ||
                    sheetOpened.item.gioi_han_dv > 0) && (
                      <div className="value">
                        <span>
                          Product :
                          <span className="price">
                            {formatPriceVietnamese(sheetOpened.item.gioi_han_sp)}
                          </span>
                        </span>
                        <span>
                          Service :
                          <span className="price">
                            {formatPriceVietnamese(sheetOpened.item.gioi_han_dv)}
                          </span>
                        </span>
                      </div>
                    )}
                </div>
              }

              <div className="item">
                <div className="title">
                  Value spent
                  <span className="price">
                    ( {formatPriceVietnamese(sheetOpened.item.gia_tri_chi_tieu)}
                    )
                  </span>
                </div>
                {(sheetOpened.item.gia_tri_chi_tieu_dv > 0 ||
                  sheetOpened.item.gia_tri_chi_tieu_sp > 0) && (
                    <div className="value">
                      <span>
                        Product :
                        <span className="price">
                          {formatPriceVietnamese(
                            sheetOpened.item.gia_tri_chi_tieu_sp
                          )}
                        </span>
                      </span>
                      <span>
                        Service :
                        <span className="price">
                          {formatPriceVietnamese(
                            sheetOpened.item.gia_tri_chi_tieu_dv
                          )}
                        </span>
                      </span>
                    </div>
                  )}
              </div>
              <div className="item">
                <div className="title">
                  Spent
                  <span className="price">
                    ({formatPriceVietnamese(sheetOpened.item.su_dung)})
                  </span>
                </div>
                {(sheetOpened.item.su_dung_sp > 0 ||
                  sheetOpened.item.su_dung_dv > 0) && (sheetOpened.item.gioi_han_dv !== 0 || sheetOpened.item.gioi_han_sp !== 0 || sheetOpened.item.gia_tri_chi_tieu_dv !== 0 || sheetOpened.item.gia_tri_chi_tieu_sp !== 0) && (
                    <div className="value">
                      <span>
                        Product:
                        <span className="price">
                          {formatPriceVietnamese(sheetOpened.item.su_dung_sp)}
                        </span>
                      </span>
                      <span>
                        Service :
                        <span className="price">
                          {formatPriceVietnamese(sheetOpened.item.su_dung_dv)}
                        </span>
                      </span>
                    </div>
                  )}
              </div>
              <div className="item">
                <div className="title">
                  Remaining
                  <span className="price">
                    (
                    {formatPriceVietnamese(
                      sheetOpened.item.gia_tri_chi_tieu -
                      sheetOpened.item.su_dung
                    )}
                    )
                  </span>
                </div>
                {sheetOpened.item.gia_tri_chi_tieu_sp -
                  sheetOpened.item.su_dung_sp > 0 || sheetOpened.item.gia_tri_chi_tieu_dv - sheetOpened.item
                    .su_dung_dv ? <div className="value">
                  <span>
                    Product :
                    <span className="price">
                      {formatPriceVietnamese(
                        sheetOpened.item.gia_tri_chi_tieu_sp -
                        sheetOpened.item.su_dung_sp
                      )}
                    </span>
                  </span>
                  <span>
                    Service :
                    <span className="price">
                      {formatPriceVietnamese(
                        sheetOpened.item.gia_tri_chi_tieu_dv - sheetOpened.item
                          .su_dung_dv
                      )}
                    </span>
                  </span>
                </div> : ""}
              </div>
            </div>
            <div className="history-list">
              <div className="history-list-title">Usage history</div>
              <div className="wallet-history__list">
                <ul>
                  {loading &&
                    Array(5)
                      .fill()
                      .map((item, index) => (
                        <li
                          className={index % 2 === 0 ? "add" : "down"}
                          key={index}
                        >
                          <div className="price">
                            <div className="price-number">
                              {index % 2 === 0 > 0 ? "+" : ""}
                              <Skeleton width={50} />
                            </div>
                            <div className="price-time">
                              <Skeleton width={100} />
                            </div>
                          </div>
                          <div className="note">
                            <Skeleton width={150} />
                          </div>
                        </li>
                      ))}
                </ul>
                {!loading && <React.Fragment>
                  {content &&
                    content.length > 0 ? (<ul>{content.map((item, index) => (
                      <li className="down" key={index}>
                        <div className="price">
                          <div className="price-number">
                            {formatPriceVietnamese(item.gia_tri)}
                          </div>
                          <div className="price-time">
                            {moment(item.ngay).fromNow()}
                          </div>
                        </div>
                        <div className="note">{item.san_pham}</div>
                      </li>
                    ))}</ul>) : "No history yet"}
                </React.Fragment>}

              </div>
            </div>
          </div>
        )}
      </PageContent>
    </Sheet>
  );
}

export default WalletCardModal;
