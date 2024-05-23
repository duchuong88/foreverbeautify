import http from "../service/http-common";

class AdvDataService {
  getMenuShop() {
    return http.get("/app/index.aspx?cmd=adv&pos=APP.MUAHANG");
  }
  getDetailAdv(id) {
    return http.get(`/api/v3/adv?cmd=getid&id=${id}`);
  }
}

export default new AdvDataService();
