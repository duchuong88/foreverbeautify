import React from "react";
import { Link, Navbar, Page, Sheet, Toolbar } from "framework7-react";
import ReportKGForm from "./ReportKGForm";
import ReportKGList from "./ReportKGList";
import DatePicker from "react-mobile-datepicker";
import MemberAPI from "../../service/member.service";
import { getUser } from "../../constants/user";
import moment from "moment";
import { toast } from "react-toastify";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      opened: false,
      initial: null,
      isOpen: false,
      selected: new Date(),
      loading: false,
      isZ: true,
    };
  }

  componentDidMount() {}

  onReportKg = async () => {
    this.setState({ loading: true });
    const Member = getUser();
    const startOfMonth = moment().startOf("month").format("MM/DD/YYYY");
    const endOfMonth = moment().endOf("month").format("MM/DD/YYYY");
    const { data } = await MemberAPI.listNoteKg({
      pi: 1,
      ps: 31,
      filter: {
        MemberID: Member?.ID,
        CreateDate: [startOfMonth, endOfMonth],
      },
    });
    let index =
      data.list &&
      data.list.findIndex(
        (x) =>
          moment(x.CreateDate).format("MM/DD/YYYY") ===
          moment().format("MM/DD/YYYY")
      );
    if (index > -1) {
      toast.warning("Today you have done the KG newspaper.");
      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        opened: true,
        loading: false,
      });
    }
  };

  loadRefresh(done) {
    if (window.KGReload) {
      window.KGReload(done);
    } else {
      done();
    }
  }

  onPageBeforeOut() {
    this.setState({
      isZ: false,
    });
  }

  onPageBeforeIn() {
    this.setState({
      isZ: true,
    });
  }

  render() {
    const { opened, initial, isOpen, selected, loading, isZ } = this.state;

    const dateConfig = {
      month: {
        caption: "Month",
        format: "M",
        step: 1,
      },
      year: {
        caption: "Year",
        format: "YYYY",
        step: 1,
      },
    };

    return (
      <Page
        ptr
        className="bg-white"
        onPtrRefresh={this.loadRefresh.bind(this)}
        onPageBeforeOut={this.onPageBeforeOut.bind(this)}
        onPageBeforeIn={this.onPageBeforeIn.bind(this)}
      >
        <Navbar className={isZ && "z-20"}>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link
                onClick={() => {
                  if (
                    this.$f7router.history[
                      this.$f7router.history.length - 2
                    ]?.indexOf("/notification/") > -1
                  ) {
                    this.$f7router.navigate(`/notification/`);
                  } else {
                    this.$f7router.back();
                  }
                }}
              >
                <i className="las la-arrow-left"></i>
              </Link>
            </div>
            <div
              className="page-navbar__title"
              style={{
                flexDirection: "column",
              }}
            >
              <span className="title">Kilogram newspaper</span>
              <div
                style={{
                  fontSize: "11px",
                  opacity: "0.7",
                }}
              >
                {moment(selected).format("MM-YYYY")}
              </div>
            </div>
            <div
              className="page-navbar__back"
              onClick={() =>
                this.setState({
                  isOpen: true,
                })
              }
            >
              <Link>
                <i className="las la-calendar"></i>
              </Link>
            </div>
          </div>
        </Navbar>
        <ReportKGList
          selected={selected}
          onEdit={(val) => this.setState({ opened: true, initial: val })}
          f7={this.$f7}
        />
        <DatePicker
          theme="ios"
          cancelText="Close"
          confirmText="Filter now"
          headerFormat="MM/YYYY"
          showCaption={true}
          dateConfig={dateConfig}
          value={selected}
          isOpen={isOpen}
          onSelect={(date) => {
            this.setState({
              selected: date,
              isOpen: false,
            });
          }}
          onCancel={() =>
            this.setState({
              isOpen: false,
            })
          }
        />
        <Sheet
          className="demo-sheet-swipe-to-close"
          style={{
            height: "auto",
            "--f7-sheet-bg-color": "#fff",
            borderRadius: "10px 10px 0 0",
          }}
          swipeToClose
          backdrop
          opened={opened}
          onSheetClosed={() =>
            this.setState({
              opened: false,
              initial: null,
            })
          }
        >
          <ReportKGForm
            onClose={() =>
              this.setState({
                opened: false,
                initial: null,
              })
            }
            initial={initial}
          />
        </Sheet>
        <Toolbar tabbar position="bottom">
          <button
            className="page-btn-order btn-submit-order"
            onClick={this.onReportKg}
            disabled={loading}
          >
            {loading ? "Checking ..." : "KG newspaper today"}
          </button>
        </Toolbar>
      </Page>
    );
  }
}
