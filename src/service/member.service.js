import http from "../service/http-common";

const MemberAPI = {
  saveNoteKg: (data) =>
    http.post(`/api/v3/membernote@edit`, JSON.stringify(data)),
  deleteNoteKg: (data) =>
    http.post(`/api/v3/membernote@delete`, JSON.stringify(data)),
  listNoteKg: (data) =>
    http.post(`/api/v3/membernote@get`, JSON.stringify(data)),
};

export default MemberAPI;
