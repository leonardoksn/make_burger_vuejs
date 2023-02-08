<script setup lang="ts">
import { RouterLink } from "vue-router";
const props = defineProps<{ logo: string; alt: string }>();
</script>

<template>
  <nav>
    <RouterLink to="/" id="logo-url">
      <img id="logo" :src="props.logo" :alt="alt" />
    </RouterLink>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/pedidos">Pedidos</RouterLink>
  </nav>
</template>

<style scoped>
nav {
  background-color: #222;
  border-bottom: 4px solid #111;
  padding: 15px 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
nav #logo-url {
  margin: auto;
  margin-left: 0;
}
#logo {
  width: 40px;
  height: 40px;
}
nav a {
  color: #fcba03;
  text-decoration: none;
  margin: 12px;
  transition: 0.5s;
}
nav a:hover {
  color: #fff;
}
</style>
