import http from "../service/http-common";

class ConfigServiceAPI {
    getConfigName(name) {
        return http.get(`/api/v3/config?cmd=getnames&names=${name}&ignore_root=1`);
    }
}

export default new ConfigServiceAPI();