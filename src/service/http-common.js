import axios from "axios";
import { SERVER_APP } from "./../constants/config";

export default typeof ClientZ !== "undefined"
  ? ClientZ
  : axios.create({
      baseURL: SERVER_APP,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
    });

// export default axios.create({
//   baseURL: SERVER_APP,
//   headers: {
//     "Content-type": "application/x-www-form-urlencoded",
//   },
// });
