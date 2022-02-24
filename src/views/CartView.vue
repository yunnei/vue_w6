<template>
  <div class="container">
    <h1 class="mt-4">購物車</h1>
    <table class="table mt-4">
      <thead>
        <tr>
          <td></td>
          <td>品名</td>
          <td class="text-center" width="20%">數量/單位</td>
          <td class="text-end">單價</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cartData.carts" :key="item.id">
          <td>
            <button
              type="button"
              class="btn btn-outline-danger"
              @click="deleteCartItem(item.id)"
            >
              x
            </button>
          </td>
          <td>{{ item.product.title }}</td>
          <td class="text-center">
            <label :for="item.id" class="input-group input-group-sm">
              <input
                :id="item.id"
                type="number"
                class="form-control"
                min="1"
                v-model="item.qty"
                @change="updateCartItem(item)"
                :disabled="isLoadingItem === item.id"
              />
              <span class="input-group-text">{{ item.product.unit }}</span>
            </label>
          </td>
          <td class="text-end">{{ item.product.price }} 元</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="text-end">
          <td colspan="3">總計</td>
          <td>{{ cartData.final_total }} 元</td>
        </tr>
      </tfoot>
    </table>
    <div class="text-end">
      <button
        type="button"
        class="btn btn-outline-danger"
        @click="deleteAllCart"
      >
        清空購物車
      </button>
    </div>
    <!-- 表單 -->
    <div class="row justify-content-center">
      <v-form
        class="col-10"
        v-slot="{ errors }"
        @submit="createOrder"
        ref="form"
      >
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <v-field
            type="email"
            name="email"
            class="form-control"
            id="email"
            placeholder="請輸入Email"
            :class="{ 'is-invalid': errors['email'] }"
            rules="email|required"
            v-model="form.user.email"
          ></v-field>
          <error-message name="email" class="invalid-feedback"></error-message>
        </div>
        <div class="mb-3">
          <label for="姓名" class="form-label">收件人姓名</label>
          <v-field
            type="name"
            name="姓名"
            class="form-control"
            id="姓名"
            placeholder="請輸入收件人姓名"
            :class="{ 'is-invalid': errors['姓名'] }"
            rules="required"
            v-model="form.user.name"
          ></v-field>
          <error-message name="姓名" class="invalid-feedback"></error-message>
        </div>
        <div class="mb-3">
          <label for="電話" class="form-label">收件人電話</label>
          <v-field
            type="tel"
            name="電話"
            class="form-control"
            id="電話"
            placeholder="請輸入收件人電話"
            :class="{ 'is-invalid': errors['電話'] }"
            rules="required|min:9|max:10"
            v-model="form.user.tel"
          ></v-field>
          <error-message name="電話" class="invalid-feedback"></error-message>
        </div>
        <div class="mb-3">
          <label for="地址" class="form-label">收件人地址</label>
          <v-field
            type="text"
            name="地址"
            class="form-control"
            id="地址"
            placeholder="請輸入收件人地址"
            :class="{ 'is-invalid': errors['地址'] }"
            rules="required"
            v-model="form.user.address"
          ></v-field>
          <error-message name="地址" class="invalid-feedback"></error-message>
        </div>
        <div class="mb-3">
          <label for="message" class="form-label">留言</label>
          <textarea
            class="form-control"
            id="message"
            rows="3"
            v-model="form.message"
          ></textarea>
        </div>
        <div class="text-end">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="
              Object.keys(errors).length > 0 || cartData.carts.length === 0
            "
          >
            送出
          </button>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
import emitter from "@/libs/emitter";

export default {
  data() {
    return {
      cartData: {
        carts: [],
      },
      isLoadingItem: "",
      form: {
        user: {
          email: "",
          name: "",
          tel: "",
          address: "",
        },
        message: "",
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
    updateCartItem(item) {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PAITH}/cart/${item.id}`;
      const data = {
        data: {
          product_id: item.product_id,
          qty: item.qty,
        },
      };
      this.isLoadingItem = item.id;
      this.$http
        .put(url, data)
        .then(() => {
          this.isLoadingItem = "";
          this.getCart();
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
    deleteCartItem(id) {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PAITH}/cart/${id}`;
      this.$http
        .delete(url)
        .then(() => {
          this.getCart();
          emitter.emit("get-cart");
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
    deleteAllCart() {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PAITH}/carts`;
      this.$http
        .delete(url)
        .then(() => {
          this.getCart();
          emitter.emit("get-cart");
        })
        .catch((error) => {
          // eslint-disable-next-line no-alert
          alert(error.response.data.message);
        });
    },
    createOrder() {
      console.log("send");
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PAITH}/order`;
      const data = {
        data: this.form,
      };
      this.$http
        .post(url, data)
        .then((res) => {
          alert(res.data.message);
          this.$refs.form.resetForm();
          this.form.message = "";
          this.getCart();
        })
        .catch((error) => {
          console.log(error.data);
        });
    },
  },
  mounted() {
    this.getCart();
  },
};
</script>
