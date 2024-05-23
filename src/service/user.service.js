import {
  getToken
} from "../constants/user";
import http from "../service/http-common";

class UserService {
  login(username, password, deviceid = "") {
    return http.get(
      `/app/index.aspx?cmd=authen&USN=${username}&PWD=${encodeURIComponent(
        password
      )}&deviceid=${deviceid}&v=${
        window?.GlobalConfig?.APP?.DeviceCheck ? "2" : ""
      }`
    );
  }
  QRCodeLogin(qrcode, deviceid = '') {
    return http.get(
      `/api/v3/qcode?cmd=login&token=${qrcode}&deviceid=${deviceid}&v=${
        window?.GlobalConfig?.APP?.DeviceCheck ? "2" : ""
      }`
    );
  }
  register(fullname, password, phone, stock) {
    return http.get(
      `/app/index.aspx?Fn=${fullname}&Phone=${phone}&NewPWD=${password}&cmd=reg&ByStock=${stock}&USN=${phone}&Gender=-1`
    );
  }
  getInfo(Token, deviceid = '') {
    return http.get(`/app/index.aspx?cmd=authen&token=${Token || getToken()}&deviceid=${deviceid}&v=${
      window?.GlobalConfig?.APP?.DeviceCheck ? "2" : ""
    }`);
  }
  getSubscribe(usn, isUser, token) {
    return http.get(
      `/app/index.aspx?cmd=authen&USN=${usn}&token=${token}&IsUser=${isUser}`
    );
  }
  getListTagService(memberid, ismember) {
    return http.get(
      `/services/preview.aspx?a=1&token=${getToken()}&cmd=loadOrderService&MemberID=${memberid}&IsMember=${ismember}&fromOrderAdd=0`
    );
  }
  getBarCode(memberid) {
    return http.get(`/services/preview.aspx?cmd=Barcode&mid=${memberid}`);
  }
  updateBirthday(date, username, password) {
    return http.get(`/api/v1/?cmd=member_update_birth`, {
      params: {
        birth: date,
        token: getToken(),
      },
    });
  }
  updateEmail(email, crpwd, username, password) {
    return http.get(`/api/v1/?cmd=member_update_email`, {
      params: {
        email: email,
        crpwd: crpwd,
        token: getToken(),
      },
    });
  }
  updatePassword(data) {
    return http.post(`/app/index.aspx?cmd=chgpwd&token=${getToken()}`, data);
  }
  getStock() {
    return http.post(`/api/v3/web?cmd=getStock`);
  }
  setStock(data) {
    return http.post(`/api/v3/web?cmd=setStock`, data);
  }
  getVoucher(memberid) {
    return http.post(`/app/index.aspx?cmd=voucherandaff&mid=${memberid}`);
  }
  getWallet(data) {
    return http.post(`/services/preview.aspx?cmd=list_money`, data);
  }
  getCardWallet(id) {
    return http.get(`/api/v3/moneycard?cmd=get&memberid=${id}`);
  }
  getCardDetailWallet(id) {
    return http.get(`/api/v3/moneycard?cmd=detail&id_the_tien=${id}`);
  }
  getDiary(username, password) {
    return http.post(`/app/index.aspx?cmd=noti&token=${getToken()}`);
  }
  getReviews(memberid, params = '') {
    return http.get(
      `/api/v3/OrderService?cmd=get_service_unrate&mid=${memberid}${params}`
    );
  }
  postReviews(memberid, data) {
    return http.post(
      `/api/v3/OrderService?cmd=get_service_unrate&mid=${memberid}`,
      data
    );
  }
  getListProductMember(memberid, Ps) {
    return http.get(
      `/api/v3/member23?cmd=da_mua&memberid=${memberid}&ps=${Ps}`
    );
  }
  getNotification(acctype, accid, offset, next, refresh) {
    return http.get(
      `/api/v3/noti2?cmd=nextoffset&acctype=${acctype}&accid=${accid}&offset=${offset}&next=${next}${
        refresh ? "&refresh=1" : ""
      }`
    );
  }
  getNotiDetail(Id) {
    return http.get(`/api/v3/noticlient?cmd=detail&ids=${Id}`);
  }
  confirmBook(data) {
    return http.post(
      `/api/v3/MemberBookClient@AppConfirm`,
      JSON.stringify(data)
    );
  }
  deleteNotification(data) {
    return http.post(`/api/v3/noti2/?cmd=clear2`, data);
  }
  readedNotification(data) {
    return http.post(`/api/v3/noti2/?cmd=readed2`, data);
  }
  getOrderAll(memberID) {
    return http.get(
      `/services/preview.aspx?cmd=search_order&key=kh:${memberID}&getitems=1`
    );
  }
  getOrderAll2() {
    return http.get(`/app/index.aspx?cmd=orders&token=${getToken()}&IsUser=0`);
  }
  getConfig(name) {
    return http.get(`/api/v3/config?cmd=getnames&names=${name}`);
  }
  deleteUserLogin() {
    return http.get(`app/index.aspx?cmd=deleteAccount&token=${getToken()}`);
  }
  authForget(data) {
    return http.post(`/api/v3/authen?cmd=forget`, data);
  }
  authForgetReset(data) {
    return http.post(`/api/v3/authen?cmd=reset`, data);
  }
  authSendTokenFirebase({
    Token,
    Type,
    ID
  }) {
    return http.get(
      `/api/v3/apptoken?cmd=call&token=${Token}&accid=${ID}&acctype=${Type}`
    );
  }
  authRemoveFirebase({
    Token,
    Type,
    ID
  }) {
    return http.get(
      `/api/v3/apptoken?cmd=call&token=${Token}&accid=${ID}&acctype=${Type}&logout=1`
    );
  }
  updateInfo(data) {
    return http.post(
      `/api/v3/in4@edit?token=${getToken()}`,
      JSON.stringify(data)
    );
  }
  sendStringee(body) {
    return http.post('/api/v3/Stringee24@send', JSON.stringify(body))
  }
  verifyStringee(body) {
    return http.post('/api/v3/Stringee24@get', JSON.stringify(body))
  }
  existPhone(phone) {
    return http.get(`/api/gl/select2?cmd=member&q=${phone}&CurrentStockID=&member=`)
  }
  checkAuthenVQMM(body) {
    return http.post(`/api/v3/contact23@checkContact`, JSON.stringify(body))
  }
}

export default new UserService();