import React from "react";
import {
  Page,
  Link,
  Toolbar,
  Actions,
  ActionsGroup,
  ActionsLabel,
  ActionsButton,
  f7,
} from "framework7-react";
import UserService from "../service/user.service";
import {
  setStockIDStorage,
  getStockIDStorage,
  setStockNameStorage,
} from "../constants/user";
import { toast } from "react-toastify";

export default class SelectStock extends React.Component {
  constructor() {
    super();
    this.state = {
      arrStock: [],
      isReload: 0,
    };
  }

  async getStock() {
    UserService.getStock().then((response) => {
      const CurrentStockID = response.data.data.CurrentStockID;
      let ListStock = response.data.data.all;
      const StocksNotBook = window?.GlobalConfig?.StocksNotBook || "";
      ListStock = ListStock
        ? ListStock.filter((o) => o.ID !== 778 && !StocksNotBook.includes(o.ID))
        : "";
      this.setState({
        CurrentStockID: CurrentStockID,
        arrStock: ListStock,
      });
    });
  }

  componentDidMount() {
    const isOpenStock = this.props.isOpenStock;
    if (isOpenStock === true) {
      this.refs.actionStock.open();
      this.getStock();
    } else {
      const StockID = getStockIDStorage();
      this.setState({
        StockID: StockID,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { isReload, isOpenStock } = this.props;

    if (prevProps.isOpenStock !== isOpenStock) {
      this.getStock();
      this.refs.actionStock.open();
    }
    if (prevProps.isReload !== isReload) {
      const StockID = getStockIDStorage();
      this.setState({
        StockID: StockID,
        isReload: this.state.isReload + 1,
      });
    }
  }

  handleChangeStock = (event) => {
    var target = event.target;
    var CheckedStock = target.value;
    var NameStock = target.title;
    var bodyData = new FormData();
    bodyData.append("stockid", CheckedStock);

    UserService.setStock(bodyData)
      .then((response) => {
        this.refs.actionStock.close();
        setStockIDStorage(CheckedStock);
        setStockNameStorage(NameStock);
        this.setState({
          StockID: CheckedStock,
        });
        toast.success("Choose a success point !", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1500,
        });
        if (this.props.fnSuccess !== undefined) {
          this.props.fnSuccess(true);
        }
        this.props.nameStock && this.props.nameStock(NameStock);
        if(!this.props?.noReload) {
          this.$f7.views.main.router.navigate(this.$f7.views.main.router.url, {
            reloadCurrent: true,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  render() {
    const arrStock = this.state.arrStock;
    const StockID = this.state.StockID && this.state.StockID;
    if (!arrStock) return "";
    return (
      <Actions className="action-stock" ref="actionStock">
        <ActionsGroup>
          <div className="action-stock__list">
            <div className="action-stock__list-name title">
              <h5>Choose a facility near you</h5>
            </div>
            {arrStock &&
              arrStock.map((item) => (
                <div
                  className={
                    "action-stock__list-name " +
                    (parseInt(StockID) === item.ID ? "currentStock" : "")
                  }
                  key={item.ID}
                >
                  <input
                    name="ValueStock"
                    type="radio"
                    value={item.ID}
                    title={item.Title}
                    id={"stock" + item.ID}
                    defaultChecked={parseInt(StockID) === item.ID}
                    onChange={(e) => this.handleChangeStock(e)}
                  />
                  <label htmlFor={"stock" + item.ID}>
                    {item.Title} <i className="las la-check"></i>
                  </label>
                </div>
              ))}
          </div>
        </ActionsGroup>
        <ActionsGroup>
          <ActionsButton color="red">Close</ActionsButton>
        </ActionsGroup>
      </Actions>
    );
  }
}
