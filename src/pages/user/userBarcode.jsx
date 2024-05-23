import React from "react";
import bgImage from '../../assets/images/headerbottombgapp.png';
import { checkAvt } from "../../constants/format";
import { getUser,getPassword } from "../../constants/user";
import { Page, Link } from "framework7-react";
import UserService from "../../service/user.service";
import Barcode from 'react-barcode';
export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            memberInfo: [],
            code: "code",
            open: true,
            widthLine: 0,
            MemberID: ""
        };
    }
    
    componentDidMount() {
        const infoUser = getUser();
        const password = getPassword();
        if(!infoUser) return false;
        const username = infoUser?.MobilePhone;
        this.setState({
            MemberID : infoUser.ID
        })

        UserService.getInfo(username,password)
            .then(response => {
                const memberInfo = response.data;
                this.setState({
                    memberInfo: memberInfo
                })
            })
            .catch(err => console.log(err));
        this.getBarCode(infoUser.ID);
        this.barCodePlay();
    }
    barCodePlay() {
        this.playBarCode = setInterval(this.setBarCode, 2*60*100);
    }
    setBarCode = () => {
        const MemberID = this.state.MemberID;
        var $$ = this.Dom7;
        var $this = this;
        var $widthRs = this.state.widthLine;
        $$('.line-qr').css("width", $widthRs + "%");
        if ($widthRs === 100) {
            clearInterval(this.playBarCode);
            $this.$f7.dialog.confirm('The Check In code has expired. Do you want to refresh ?', () => {
                this.getBarCode(MemberID);
                $this.barCodePlay();
                this.setState({
                    widthLine: 0
                });
            });
        }
        this.setState({
            widthLine: $widthRs + 1
        });
    }

    onPageBeforeOut() {
        clearInterval(clearInterval(this.playBarCode));
    }

    getBarCode = (memberID) => {
        UserService.getBarCode(memberID)
            .then(response => {
                const code = response.data.code;
                this.setState({
                    code: code
                })
            })
            .catch(err => console.log(err))
    }

    render() {
        const member = this.state.memberInfo && this.state.memberInfo;
        const code = this.state.code;
        return (
            <Page onPageBeforeOut={this.onPageBeforeOut.bind(this)} name="barcode" noNavbar noToolbar>
                <div className="profile-bg">
                    <div className="page-login__back">
                        <Link onClick={() => this.$f7router.back()}>
                            <i className="las la-arrow-left"></i>
                        </Link>
                    </div>
                    <div className="name">
                        Check In
                    </div>
                    <img src={bgImage} />
                </div>
                <div className="profile-info">
                    <div className="profile-info__avatar">
                        <img src={checkAvt(member.Photo)} />
                    </div>
                    <div className="profile-info__basic">
                        <div className="name">{member.FullName}</div>
                        <div className="group">{member.acc_group > 0 ? (member.MemberGroups[0].Title) : "Khách thường"}</div>
                    </div>
                </div>
                <div className="barcode-qr">
                    <div className="barcode-qr__box">
                        <div className="barcode-qr__box-text">
                            {/* <i className="las la-camera"></i> */}
                            <span>Please scan your barcode</span>
                        </div>
                        <Barcode value={code && code} />
                        <div className="line-qr"></div>
                    </div>
                </div>
            </Page>
        )
    }

}