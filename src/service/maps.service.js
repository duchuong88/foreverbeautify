import http from "../service/http-common";

class MapsDataService {
    getAll(id) {
        return http.get(`/api/gl/select2?cmd=art&includeSource=1&channels=${id}`)
    }
}

export default new MapsDataService();