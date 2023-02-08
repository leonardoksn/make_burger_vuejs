<script lang="ts" setup>
import api from "@/resources/api";
import { ref, onMounted } from "vue";

onMounted(() => {
  Promise.all([getPedidos(), getStatus()]);
});

const burgers = ref<
  | {
      id: number;
      client_name: string;
      meat: string;
      bread: string;
      status: string;
      ingredients: string[];
    }[]
  | null
>(null);

const status = ref<{ status_type: string; id: number }[]>([]);

async function getPedidos() {
  const req = await api.get("/burgers");
  const data = req.data;
  burgers.value = data;
  // Resgata os status de pedidos
}

async function getStatus() {
  const req = await api.get("/status");
  const data = req.data;
  status.value = data;
}

async function deleteBurger(id: string) {
  await api.delete(`/burgers/${id}`);
  getPedidos();
}

async function updateBurger(event: any, id: string) {
  const option = event.target.value;
  const dataJson = { status: option };
  const req = await api.patch(`/burgers/${id}`, dataJson);
  const res = req;
  console.log(res);
}
</script>

<template>
  <div id="burger-table" v-if="burgers">
    <div>
      <div id="burger-table-heading">
        <div class="order-id">#:</div>
        <div>Cliente:</div>
        <div>Pão:</div>
        <div>Carne:</div>
        <div>Opcionais:</div>
        <div>Ações:</div>
      </div>
    </div>
    <div id="burger-table-rows">
      <div class="burger-table-row" v-for="burger in burgers" :key="burger.id">
        <div class="order-number">{{ burger.id }}</div>
        <div>{{ burger.client_name }}</div>
        <div>{{ burger.bread }}</div>
        <div>{{ burger.meat }}</div>
        <div>
          <ul v-for="(opcional, index) in burger.ingredients" :key="index">
            <li>{{ opcional }}</li>
          </ul>
        </div>
        <div>
          <select
            name="status"
            class="status"
            @change="updateBurger($event, burger.id.toString())"
          >
            <option
              :value="s.status_type"
              v-for="s in status"
              :key="s.id"
              :selected="burger.status == s.status_type"
            >
              {{ s.status_type }}
            </option>
          </select>
          <button
            class="delete-btn"
            @click="deleteBurger(burger.id.toString())"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <h2>Não há pedidos no momento!</h2>
  </div>
</template>

<style scoped>
#burger-table {
  max-width: 1200px;
  margin: 0 auto;
}

#burger-table-heading,
#burger-table-rows,
.burger-table-row {
  display: flex;
  flex-wrap: wrap;
}

#burger-table-heading {
  font-weight: bold;
  padding: 12px;
  border-bottom: 3px solid #333;
}

.burger-table-row {
  width: 100%;
  padding: 12px;
  border-bottom: 1px solid #ccc;
}

#burger-table-heading div,
.burger-table-row div {
  width: 19%;
}

#burger-table-heading .order-id,
.burger-table-row .order-number {
  width: 5%;
}

select {
  padding: 12px 6px;
  margin-right: 12px;
}

.delete-btn {
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

.delete-btn:hover {
  background-color: transparent;
  color: #222;
}
</style>
