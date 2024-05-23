import clsx from "clsx";
import { Link } from "framework7-react";
import React, { useState } from "react";
import { checkSale, formatPriceVietnamese } from "../../constants/format";
import { getStockIDStorage, getUser } from "../../constants/user";
import ShopDataService from '../../service/shop.service'
import { toast } from "react-toastify";
import { TruncateLines } from "react-truncate-lines";

const ButtonCart = ({ item, f7, f7router }) => {
  const [loading, setLoading] = useState(false);

  const orderSubmit = () => {
    const infoUser = getUser();
    const getStock = getStockIDStorage();
    if (!infoUser) {
      f7router.navigate("/login/");
      return false;
    } else {
      setLoading(true);
      const data = {
        order: {
          ID: 0,
          SenderID: infoUser.ID,
          Tinh: 5,
          Huyen: 37,
          MethodPayID: 1,
        },
        adds: [
          {
            ProdID: item.ID,
            Qty: 1,
          },
        ],
        forceStockID: getStock,
      };
      ShopDataService.getUpdateOrder(data)
        .then((response) => {
          const { errors } = response.data.data;
          setLoading(false);
          if (response.data.success) {
            if (errors && errors.length > 0) {
              toast.error(errors.join(", "), {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 1500,
              });
            } else {
              toast.success(`Thêm mặt hàng vào giỏ hàng thành công !`, {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 3000,
              });
              f7router.navigate("/pay/");
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div className="w-55px d--f jc--fe ai--c">
      <div
        className={clsx(
          "cursor-pointer btn-shopping btn-shopping-sm",
          loading && "loading"
        )}
        onClick={orderSubmit}
      >
        <i className="las la-plus"></i>
      </div>
    </div>
  );
};

function ShopListServiceItem({ item, CateId, f7router, lines }) {
  const [itemShow, setItemShow] = useState(3);

  const isPublic = (o) => {
    if (o.IsPublic > 0) {
      return true;
    }
    return o.IsOptPublic;
  };
  return (
    <div className={clsx("service-about__list pt-12px")}>
      <ul>
        {item?.items &&
          item.items.length > 0 &&
          item.items
            .filter((item) => isPublic(item))
            .slice(0, itemShow)
            .map((subitem) => (
              <li key={subitem.ID}>
                {window?.GlobalConfig?.APP?.UIBase ? (
                  <div className="d-flex px-15px pb-15px">
                    <div className="f--1">
                      <div className="title max-w-100 mb-3px">
                        {lines ? (
                          <TruncateLines lines={1} ellipsis={<span>...</span>}>
                            {subitem.Title}
                          </TruncateLines>
                        ) : (
                          subitem.Title
                        )}
                      </div>
                      <div
                        className={
                          "price max-w-100 ai--fs fd--r " +
                          (subitem.IsDisplayPrice !== 0 &&
                          checkSale(
                            subitem.SaleBegin,
                            subitem.SaleEnd,
                            subitem.PriceSale
                          ) === true
                            ? "sale"
                            : "")
                        }
                      >
                        {subitem.IsDisplayPrice === 0 ? (
                          <span className="price-to">Liên hệ</span>
                        ) : (
                          <React.Fragment>
                            <span className="price-to">
                              {formatPriceVietnamese(subitem.PriceProduct)}
                              <b>đ</b>
                            </span>
                            <span className="price-sale pl-8px">
                              {formatPriceVietnamese(subitem.PriceSale)}
                              <b>đ</b>
                            </span>
                          </React.Fragment>
                        )}
                      </div>
                    </div>
                    <ButtonCart item={subitem} f7router={f7router} />
                  </div>
                ) : (
                  <Link
                    href={
                      "/shop/detail/" +
                      subitem.ID +
                      "/?original=" +
                      item.root.ID +
                      "&CateId=" +
                      item.root.Cates[0].ID
                    }
                  >
                    <div className="title">{subitem.Title}</div>
                    <div
                      className={
                        "price " +
                        (subitem.IsDisplayPrice !== 0 &&
                        checkSale(
                          subitem.SaleBegin,
                          subitem.SaleEnd,
                          subitem.PriceSale
                        ) === true
                          ? "sale"
                          : "")
                      }
                    >
                      {subitem.IsDisplayPrice === 0 ? (
                        <span className="price-to">Liên hệ</span>
                      ) : (
                        <React.Fragment>
                          <span className="price-to">
                            {formatPriceVietnamese(subitem.PriceProduct)}
                            <b>đ</b>
                          </span>
                          <span className="price-sale">
                            {formatPriceVietnamese(subitem.PriceSale)}
                            <b>đ</b>
                          </span>
                        </React.Fragment>
                      )}
                    </div>
                  </Link>
                )}
              </li>
            ))}
      </ul>
      {item?.items.length > 3 && itemShow < item.items.length && (
        <button
          className="btn-more-service"
          onClick={() => setItemShow(itemShow + 5)}
        >
          Xem thêm <i className="las la-angle-down"></i>
        </button>
      )}
    </div>
  );
}

export default ShopListServiceItem;
