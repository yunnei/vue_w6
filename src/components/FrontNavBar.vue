<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">前台</router-link>
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
            <router-link class="nav-link" to="/">首頁</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/products">產品列表</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/cart">
              購物車
              <span class="text-danger">{{ cartData.carts.length }}</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-dark" to="/login"
              >登入</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import emitter from "@/libs/emitter";

export default {
  data() {
    return {
      cartData: {
        carts: [],
      },
    };
  },
  methods: {
    getCart() {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PAITH}/cart`;
      this.$http
        .get(url)
        .then((res) => {
          this.cartData = res.data.data;
        })
        .catch((error) => {
          console.log(error.data);
        });
    },
  },
  mounted() {
    this.getCart();
    emitter.on("get-cart", () => {
      this.getCart();
    });
  },
};
</script>
