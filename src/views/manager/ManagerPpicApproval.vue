<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold text-gray-800">Persetujuan Rencana Produksi</h1>
    <div class="mt-8 overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Id</th>
            <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Nama Produk</th>
            <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Jumlah</th>
            <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Tenggat Waktu</th>
            <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Diajukan Oleh</th>
            <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Dibuat Tanggal</th>
            <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Approved At</th>
            <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="9" class="py-4 text-center">Loading...</td>
          </tr>
          <tr v-for="plan in pendingPlans" :key="plan.id">
            <td class="px-6 py-4">{{ plan.id }}</td>
            <td class="px-6 py-4">{{ plan.product }}</td>
            <td class="px-6 py-4">{{ plan.quantity }}</td>
            <td class="px-6 py-4">{{ plan.due_date }}</td>
            <td class="px-6 py-4">{{ plan.created_by.name }}</td>
            <td class="px-6 py-4">{{ plan.created_at }}</td>
            <td class="px-6 py-4">{{ plan.approved_at || '-' }}</td>
            <td class="px-6 py-4">
              <span :class="getStatusClass(plan.status)">
                {{ formatStatus(plan.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <template v-if="!plan.approved_at">
                <button
                  @click="processPlan(plan.id, 'approve')"
                  class="px-3 py-1 text-xs font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
                >
                  Setujui
                </button>
                <button
                  @click="processPlan(plan.id, 'reject')"
                  class="px-3 py-1 ml-2 text-xs font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700"
                >
                  Tolak
                </button>
              </template>
              <span v-else class="text-sm text-gray-400">Sudah Diproses</span>
            </td>
          </tr>
          <tr v-if="!loading && pendingPlans.length === 0">
            <td colspan="9" class="py-4 text-center text-gray-500">
              Tidak ada rencana yang menunggu persetujuan.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';

const pendingPlans = ref([]);
const loading = ref(true);

const fetchPendingPlans = async () => {
  loading.value = true;
  try {
    const response = await api.getPlans({ status: 'menunggu_persetujuan' });
    pendingPlans.value = response.data.data;
  } catch (error) {
    console.error('Gagal mengambil data rencana:', error);
  } finally {
    loading.value = false;
  }
};

const processPlan = async (planId, action) => {
  try {
    if (action === 'approve') {
      await api.approvePlan(planId);
    } else {
      await api.rejectPlan(planId);
    }
    fetchPendingPlans();
  } catch (error) {
    console.error(`Gagal ${action} rencana:`, error);
  }
};

const getStatusClass = (status) => {
  const classes = {
    disetujui: 'bg-green-100 text-green-800 px-2 py-1 text-xs font-semibold rounded-full',
    ditolak: 'bg-red-100 text-red-800 px-2 py-1 text-xs font-semibold rounded-full',
    menunggu_persetujuan: 'bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-semibold rounded-full',
  };
  return classes[status] || 'bg-gray-100 text-gray-800 px-2 py-1 text-xs font-semibold rounded-full';
};

const formatStatus = (status) => {
  return status.replace('_', ' ');
};

onMounted(fetchPendingPlans);
</script>
