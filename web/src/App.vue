<script setup lang="ts">
import { RouterView } from "vue-router";
import Navbar from "./components/NavbarComp.vue";
import FooterComp from "./components/FooterComp.vue";
import { ref } from "vue";

const logo_src = ref("/img/logo.png");
const app_name = ref("Make your Burger");
</script>

<template>
  <Navbar :logo="logo_src" :alt="app_name" />
  <RouterView />
  <FooterComp />
</template>
