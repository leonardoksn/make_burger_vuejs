<script setup lang="ts">
import { ref, onMounted, onUpdated } from "vue";
import type { IIngredients } from "../interface/index";
import api from "../resources/api.js";
import MessageComp from "./MessageComp.vue";

const msg = ref<null | string>(null);
const breads = ref<IIngredients[]>([]);
const meats = ref<IIngredients[]>([]);
const optionsData = ref<IIngredients[]>([]);

const opcionais = ref([]);

onMounted(() => {
  getIngredientes();
});

async function createBurger(e: Event) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget as HTMLFormElement);
  const form = document.getElementById("burger-form") as HTMLFormElement;

  const body = {
    name: formData.get("name"),
    meat: formData.get("meat"),
    bread: formData.get("bread"),
    opcionais: Array.from(opcionais.value),
    status: "Solicitado",
  };

  const [error] = await api
    .post("/burger", body)
    .then((res) => {
      return [null, res.data];
    })
    .catch((err) => [err, null]);
  opcionais.value = [];
  form.reset();
  if (error) {
    msg.value = "Erro ao realizar o pedido!";
  } else {
    msg.value = "Pedido realizado com sucesso!";
  }

  setTimeout(() => {
    msg.value = null;
  }, 3000);
}
async function getIngredientes() {
  const response = await api("/ingredients");
  const data = await response.data;
  breads.value = data.paes;
  meats.value = data.carnes;
  optionsData.value = data.opcionais;
}
</script>

<template>
  <MessageComp :msg="msg" v-show="msg" />
  <div>
    <form autocomplete="off" id="burger-form" @submit="createBurger($event)">
      <div class="input-container">
        <label for="nome">Nome do cliente:</label>
        <input
          type="text"
          id="nome"
          name="name"
          placeholder="Digite o seu nome"
        />
      </div>
      <div class="input-container">
        <label for="pao">Escolha o pão:</label>
        <select name="bread" id="pao">
          <option value="">Selecione o seu pão</option>
          <option v-for="bread in breads" :key="bread.id" :value="bread.type">
            {{ bread.type }}
          </option>
        </select>
      </div>
      <div class="input-container">
        <label for="carne">Escolha a carne do seu Burger:</label>
        <select name="meat" id="carne">
          <option value="">Selecione o tipo de carne</option>
          <option v-for="meat in meats" :key="meat.id" :value="meat.type">
            {{ meat.type }}
          </option>
        </select>
      </div>
      <div id="opcionais-container" class="input-container">
        <label id="opcionais-title" for="opcionais"
          >Selecione os opcionais:</label
        >
        <div
          class="checkbox-container"
          v-for="optionData in optionsData"
          :key="optionData.id"
        >
          <input
            type="checkbox"
            name="opcionais"
            v-model="opcionais"
            :value="optionData.type"
          />

          <span>{{ optionData.type }}</span>
        </div>
      </div>
      <div class="input-container">
        <input class="submit-btn" type="submit" value="Criar meu Burger!" />
      </div>
    </form>
  </div>
</template>

<style scoped>
#burger-form {
  max-width: 400px;
  margin: 0 auto;
}

.input-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

label {
  font-weight: bold;
  margin-bottom: 15px;
  color: #222;
  padding: 5px 10px;
  border-left: 4px solid #fcba03;
}

input,
select {
  padding: 5px 10px;
  width: 300px;
}

#opcionais-container {
  flex-direction: row;
  flex-wrap: wrap;
}

#opcionais-title {
  width: 100%;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  width: 50%;
  margin-bottom: 20px;
}

.checkbox-container span,
.checkbox-container input {
  width: auto;
}

.checkbox-container span {
  margin-left: 6px;
  font-weight: bold;
}

.submit-btn {
  background-color: #222;
  color: #fcba03;
  font-weight: bold;
  border: 2px solid #222;
  padding: 10px;
  font-size: 16px;
  margin: 0 auto;
  cursor: pointer;
  transition: 0.5s;
}

.submit-btn:hover {
  background-color: transparent;
  color: #222;
}
</style>
