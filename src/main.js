import { createApp } from "vue";
import "bootstrap";
import axios from "axios";
import VueAxios from "vue-axios";

import { defineRule, Form, Field, ErrorMessage, configure } from "vee-validate";
import { required, max, min, email } from "@vee-validate/rules";
import { localize, loadLocaleFromURL } from "@vee-validate/i18n";

import App from "./App.vue";
import router from "./router";

loadLocaleFromURL(
  "https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json"
);
configure({
  generateMessage: localize("zh_TW"),
});

defineRule("required", required);
defineRule("max", max);
defineRule("min", min);
defineRule("email", email);

const app = createApp(App);
app.use(router);
app.use(VueAxios, axios);
app.component("VForm", Form);
app.component("VField", Field);
app.component("ErrorMessage", ErrorMessage);

app.mount("#app");
