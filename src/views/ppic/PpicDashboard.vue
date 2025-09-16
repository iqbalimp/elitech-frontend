<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold text-gray-800">Dashboard PPIC</h1>
    
    <div class="p-6 mt-8 bg-white rounded-lg shadow">
      <h3 class="text-lg font-semibold">Buat Rencana Produksi Baru</h3>
      <form @submit.prevent="handleCreatePlan" class="grid grid-cols-1 gap-6 mt-4 md:grid-cols-4">
        <div>
          <label class="block text-sm">Produk</label>
          <select v-model="newPlan.product_id" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
            <option disabled :value="null">Pilih Produk...</option>
            <option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm">Jumlah</label>
          <input v-model.number="newPlan.quantity" type="number" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
        </div>
        <div>
          <label class="block text-sm">Target Selesai</label>
          <input v-model="newPlan.due_date" type="date" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
        </div>
        <div class="self-end">
          <button type="submit" class="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Ajukan Rencana
          </button>
        </div>
      </form>
    </div>

    <div class="mt-8 overflow-x-auto bg-white rounded-lg shadow">
      <h3 class="p-4 text-lg font-semibold">Riwayat Rencana Produksi</h3>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">ID</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Dibuat</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Produk</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Jumlah</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Target</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="plan in plans" :key="plan.id">
            <td class="px-6 py-4">{{ plan.id }}</td>
            <td class="px-6 py-4">{{ plan.created_at }}</td>
            <td class="px-6 py-4">{{ plan.product }}</td>
            <td class="px-6 py-4">{{ plan.quantity }}</td>
            <td class="px-6 py-4">{{ plan.due_date || '-' }}</td>
            <td class="px-6 py-4">
              <span :class="getStatusClass(plan.status)">
                {{ plan.status.replace('_', ' ') }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '@/api';

const plans = ref([]);
const products = ref([]);
const newPlan = reactive({
  product_id: null,
  quantity: '',
  due_date: ''
});

const fetchInitialData = async () => {
  try {
    const [plansResponse, productsResponse] = await Promise.all([
      api.getPlans(),
      api.getProducts() 
    ]);
    plans.value = plansResponse.data.data;
    products.value = productsResponse.data.data;
  } catch (error) {
    console.error("Gagal mengambil data awal:", error);
  }
};

const handleCreatePlan = async () => {
  try {
    await api.createPlan(newPlan);
    alert('Rencana berhasil dibuat!');
    Object.assign(newPlan, { product_id: null, quantity: '', due_date: '' });
    const response = await api.getPlans();
    plans.value = response.data.data;
  } catch (error) {
    console.error("Gagal membuat rencana:", error);
    alert('Gagal membuat rencana.');
  }
};

const getStatusClass = (status) => {
  const classes = {
    menunggu_persetujuan: 'bg-yellow-100 text-yellow-800',
    disetujui: 'bg-green-100 text-green-800',
    ditolak: 'bg-red-100 text-red-800',
    diproses: 'bg-blue-100 text-blue-800',
  };
  return `px-2 py-1 text-xs font-semibold rounded-full ${classes[status] || 'bg-gray-100 text-gray-800'}`;
};

onMounted(fetchInitialData);
</script>
