<template>
  <FrontNavBar></FrontNavBar>
  <router-view />
</template>

<script>
import FrontNavBar from "@/components/FrontNavBar.vue";

export default {
  components: {
    FrontNavBar,
  },
};
</script>
