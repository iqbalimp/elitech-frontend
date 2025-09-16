<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold text-gray-800">PPIC LOGS</h1>
    <div class="p-6 mt-6 bg-white rounded-lg shadow grid grid-cols-1 md:grid-cols-5 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Produk</label>
        <select v-model="filters.product_id" class="w-full px-3 py-2 mt-1 border rounded-md">
          <option value="">Semua</option>
          <option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Status</label>
        <select v-model="filters.status" class="w-full px-3 py-2 mt-1 border rounded-md">
          <option value="">Semua</option>
          <option value="menunggu_persetujuan">Menunggu Persetujuan</option>
          <option value="disetujui">Disetujui</option>
          <option value="ditolak">Ditolak</option>
          <option value="diproses">Diproses</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Periode</label>
        <select v-model="filters.periodMode" class="w-full px-3 py-2 mt-1 border rounded-md">
          <option value="">Semua</option>
          <option value="daily">Harian</option>
          <option value="weekly">Mingguan</option>
          <option value="monthly">Bulanan</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Tanggal Acuan</label>
        <input type="date" v-model="filters.date" class="w-full px-3 py-2 mt-1 border rounded-md">
      </div>

      <div class="flex items-end">
        <button @click="resetFilters" class="px-4 py-2 w-full bg-gray-200 rounded hover:bg-gray-300">
          Reset Filter
        </button>
      </div>
    </div>

    
    <div class="mt-8 overflow-x-auto bg-white rounded-lg shadow">
      <div class="flex items-center justify-between p-4">
        <h3 class="text-lg font-semibold">Riwayat Rencana Produksi</h3>
        <button 
        @click="exportPDF" 
        class="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">
        <DocumentArrowDownIcon class="w-5 h-5" />
        Export PDF
      </button>
      </div> 
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">ID</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Produk</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Jumlah</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Target</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Dibuat</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="plan in filteredPlans" :key="plan.id">
            <td class="px-6 py-4">{{ plan.id }}</td>
            <td class="px-6 py-4">{{ plan.product }}</td>
            <td class="px-6 py-4">{{ plan.quantity }}</td>
            <td class="px-6 py-4">{{ plan.due_date || '-' }}</td>
            <td class="px-6 py-4">
              <span :class="getStatusClass(plan.status)">
                {{ plan.status.replace('_', ' ') }}
              </span>
            </td>
            <td class="px-6 py-4">{{ plan.created_at }}</td>
          </tr>
          <tr v-if="filteredPlans.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">Tidak ada data</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { DocumentArrowDownIcon } from '@heroicons/vue/24/solid'; 
import api from '@/api';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import weekOfYear from 'dayjs/plugin/weekOfYear';
dayjs.extend(isBetween);
dayjs.extend(weekOfYear);
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


const plans = ref([]);
const products = ref([]);
const filters = reactive({
  product_id: '',
  status: '',
  periodMode: '', 
  date: ''
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

const filteredPlans = computed(() => {
  return plans.value.filter(plan => {
    
    const planDate = dayjs(plan.created_at, "DD-MM-YYYY HH:mm:ss");
    const baseDate = dayjs(filters.date);

    
    let matchProduct = true;
    if (filters.product_id) {
      const selectedProduct = products.value.find(p => p.id == filters.product_id);
      matchProduct = selectedProduct ? plan.product === selectedProduct.name : false;
    }

    
    const matchStatus = filters.status ? plan.status === filters.status : true;

    
    let matchDate = true;
    if (filters.date && filters.periodMode) {
      if (filters.periodMode === "daily") {
        matchDate = planDate.isSame(baseDate, "day");
      } else if (filters.periodMode === "weekly") {
        matchDate = planDate.isBetween(
          baseDate.startOf("week"),
          baseDate.endOf("week"),
          null,
          "[]"
        );
      } else if (filters.periodMode === "monthly") {
        matchDate = planDate.isSame(baseDate, "month");
      }
    }
    return matchProduct && matchStatus && matchDate;
  });
});

const exportPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Laporan Rencana Produksi (PPIC Logs)", 14, 15);

  autoTable(doc, {
    startY: 25,
    head: [["ID", "Produk", "Jumlah", "Target", "Status", "Dibuat"]],
    body: filteredPlans.value.map(plan => [
      plan.id,
      plan.product,
      plan.quantity,
      plan.due_date || "-",
      plan.status,
      plan.created_at
    ]),
    theme: "striped",
    styles: { fontSize: 10 }
  });

  
  doc.save(`ppic_logs_${dayjs().format("YYYYMMDD_HHmm")}.pdf`);
};

const resetFilters = () => {
  filters.product_id = '';
  filters.status = '';
  filters.periodMode = '';
  filters.date = '';
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
