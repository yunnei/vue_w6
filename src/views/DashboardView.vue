<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/admin">後台</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/products"
              >產品列表</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <router-view v-if="logincheck" />
</template>

<script>
export default {
  data() {
    return {
      logincheck: false,
    };
  },
  methods: {
    checkLogin() {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hextoken\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      if (token) {
        this.$http.defaults.headers.common.Authorization = token;
        const url = `${process.env.VUE_APP_API}/api/user/check`;
        this.$http
          .post(url)
          .then(() => {
            this.logincheck = true;
          })
          .catch((error) => {
            console.log(error.data);
          });
      } else {
        // eslint-disable-next-line no-alert
        alert("請先登入。");
        this.$router.push("/login");
      }
    },
  },
  mounted() {
    this.checkLogin();
  },
};
</script>
