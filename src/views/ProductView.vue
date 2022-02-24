<template>
  <div class="container">
    <div class="row mt-4">
      <div class="col-6">
        <img class="img-fluid" :src="product.imageUrl" :alt="product.title" />
      </div>
      <div class="col-6">
        <h2 class="mt-2">{{ product.title }}</h2>
        <p>
          商品描述：<br />
          {{ product.description }}
        </p>
        <p>
          商品內容：<br />
          {{ product.content }}
        </p>
        <p class="fs-3 text-danger">$ {{ product.price }}</p>
        <label :for="product.id" class="input-group">
          <input
            :id="product.id"
            type="number"
            min="1"
            class="form-control"
            v-model="qty"
          />
          <button
            type="button"
            class="btn btn-primary"
            @click="addToCart(product.id)"
            :disabled="isLoadingItem === product.id"
          >
            加入購物車
          </button>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import emitter from "@/libs/emitter";

export default {
  data() {
    return {
      product: {},
      qty: 1,
      isLoadingItem: "",
    };
  },
  methods: {
    getProduct() {
      const { id } = this.$route.params;
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PAITH}/product/${id}`;
      this.$http
        .get(url)
        .then((res) => {
          this.product = res.data.product;
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
          qty: this.qty,
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
          console.log(error.data);
        });
    },
  },
  mounted() {
    this.getProduct();
  },
};
</script>
