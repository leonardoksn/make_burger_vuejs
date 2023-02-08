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

<style>
* {
  font-family: Helvetica;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
main {
  margin: 50px;
  min-height: 250px;
}
h1 {
  text-align: center;
  font-size: 42px;
  margin-bottom: 30px;
  color: #222;
}
</style>
