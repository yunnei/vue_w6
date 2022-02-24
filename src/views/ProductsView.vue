<template>
  <div class="container">
    <h1 class="mt-4">產品列表</h1>
    <div class="row row-cols-1 row-cols-md-3 g-3 mb-3">
      <div class="col" v-for="product in products" :key="product.id">
        <div class="card h-100">
          <img
            :src="product.imageUrl"
            class="card-img-top"
            :alt="product.title"
          />
          <div class="card-body">
            <h5 class="card-title">{{ product.title }}</h5>
          </div>
          <div class="card-footer bg-white text-end">
            <router-link
              :to="`/product/${product.id}`"
              class="btn btn-outline-secondary mx-2"
              >查看更多</router-link
            >
            <button
              type="button"
              class="btn btn-primary"
              @click="addToCart(product.id)"
              :disabled="isLoadingItem === product.id"
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import emitter from "@/libs/emitter";

export default {
  data() {
    return {
      products: [],
      isLoadingItem: "",
    };
  },
  methods: {
    getProducts() {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PAITH}/products/all`;
      this.$http
        .get(url)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
    addToCart(id) {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PAITH}/cart`;
      const data = {
        data: {
          product_id: id,
          qty: 1,
        },
      };
      this.isLoadingItem = id;
      this.$http
        .post(url, data)
        .then(() => {
          this.isLoadingItem = "";
          emitter.emit("get-cart");
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
  },
  mounted() {
    this.getProducts();
  },
};
</script>
