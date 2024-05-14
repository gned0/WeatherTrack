import { createStore } from "vuex";
import authModule from "./modules/authModule.js";
import socketModule from "./modules/socketModule.js";

export default createStore({
  modules: {
    authModule,
    socketModule,
  },
});
