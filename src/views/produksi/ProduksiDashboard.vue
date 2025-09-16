<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold text-gray-800">Daftar Order Produksi</h1>
    <div class="mt-8 overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Order ID</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Nama Produk</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Qty Rencana</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Qty Aktual</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Qty Reject</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Mulai</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Selesai</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in orders" :key="order.id">
            <td class="px-6 py-4">{{ order.id }}</td>
            <td class="px-6 py-4">{{ order.plan_details.product }}</td>
            <td class="px-6 py-4">{{ order.plan_details.quantity }}</td>
            <td class="px-6 py-4">{{ order.quantity_actual || '-' }}</td>
            <td class="px-6 py-4">{{ order.quantity_reject || '-' }}</td>
            <td class="px-6 py-4">{{ order.started_at || '-' }}</td>
            <td class="px-6 py-4">{{ order.finished_at || '-' }}</td>
            <td class="px-6 py-4">
              <span :class="getStatusClass(order.status)">
                {{ order.status.replace('_', ' ') }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button 
                v-if="order.status === 'menunggu'" 
                @click="openStartModal(order)"
                class="inline-flex items-center px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >Mulai Kerjakan
              </button>
              <button 
                v-if="order.status === 'sedang_dikerjakan'" 
                @click="openFinishModal(order)"
                class="inline-flex items-center px-2 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-500"
                >Selesaikan
              </button>
              <button 
                v-if="order.status === 'selesai'" 
                @click="openWarehouseModal(order)"
                class="inline-flex items-center px-2 py-1 bg-gray-700 text-white text-xs font-medium rounded hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-500"
                >Serahkan ke Gudang
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isStartModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-50">
      <div class="w-full max-w-md p-6 bg-blue-50 rounded-lg shadow-lg">
        <h3 class="text-lg font-bold text-blue-800">Mulai Order #{{ selectedOrder.id }}</h3>
        <form @submit.prevent="handleStartOrder" class="mt-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-blue-800">Notes</label>
            <textarea v-model="startForm.notes" class="w-full px-3 py-2 mt-1 border rounded-md resize-none h-24" placeholder="Masukkan catatan..."></textarea>
          </div>
          <div class="flex justify-end mt-4 space-x-4">
            <button type="button" @click="isStartModalOpen = false" class="px-3 py-1 bg-gray-300 text-xs font-medium rounded hover:bg-gray-400">Batal</button>
            <button type="submit" class="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700">Mulai</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="isFinishModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-50">
      <div class="w-full max-w-md p-6 bg-green-50 rounded-lg shadow-lg">
        <h3 class="text-lg font-bold text-green-800">Selesaikan Order #{{ selectedOrder.id }}</h3>
        <form @submit.prevent="handleFinishOrder" class="mt-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-green-800">Jumlah Aktual</label>
            <input v-model.number="finishForm.quantity_actual" type="number" required class="w-full px-3 py-2 border rounded-md">
          </div>
          <div>
            <label class="block text-sm font-medium text-green-800">Jumlah Reject</label>
            <input v-model.number="finishForm.quantity_reject" type="number" required class="w-full px-3 py-2 border rounded-md">
          </div>
          <div>
            <label class="block text-sm font-medium text-green-800">Notes</label>
            <textarea v-model="finishForm.notes" class="w-full px-3 py-2 mt-1 border rounded-md resize-none h-24" placeholder="Masukkan catatan..."></textarea>
          </div>
          <div class="flex justify-end mt-4 space-x-4">
            <button type="button" @click="isFinishModalOpen = false" class="px-3 py-1 bg-gray-300 text-xs font-medium rounded hover:bg-gray-400">Batal</button>
            <button type="submit" class="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700">Selesaikan</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="isWarehouseModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-50">
      <div class="w-full max-w-md p-6 bg-gray-50 rounded-lg shadow-lg">
        <h3 class="text-lg font-bold text-gray-800">Serahkan Order #{{ selectedOrder.id }} ke Gudang</h3>
        <form @submit.prevent="handleWarehouseOrder" class="mt-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-800">Notes</label>
            <textarea v-model="warehouseForm.notes" class="w-full px-3 py-2 mt-1 border rounded-md resize-none h-24" placeholder="Masukkan catatan pengiriman..."></textarea>
          </div>
          <div class="flex justify-end mt-4 space-x-4">
            <button type="button" @click="isWarehouseModalOpen = false" class="px-3 py-1 bg-gray-300 text-xs font-medium rounded hover:bg-gray-400">Batal</button>
            <button type="submit" class="px-3 py-1 bg-gray-700 text-white text-xs font-medium rounded hover:bg-gray-800">Serahkan</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>


<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '@/api';

const orders = ref([]);
const selectedOrder = ref(null);

const isStartModalOpen = ref(false);
const startForm = reactive({ notes: '' });

const isFinishModalOpen = ref(false);
const finishForm = reactive({ quantity_actual: 0, quantity_reject: 0, notes: '' });

const isWarehouseModalOpen = ref(false);
const warehouseForm = reactive({ notes: '' });

const fetchOrders = async () => {
    const response = await api.getOrders();
    orders.value = response.data.data;
};

const openStartModal = (order) => {
    selectedOrder.value = order;
    startForm.notes = '';
    isStartModalOpen.value = true;
};

const openFinishModal = (order) => {
    selectedOrder.value = order;
    finishForm.quantity_actual = order.plan_details.quantity;
    finishForm.quantity_reject = 0;
    finishForm.notes = '';
    isFinishModalOpen.value = true;
};

const openWarehouseModal = (order) => {
    selectedOrder.value = order;
    warehouseForm.notes = '';
    isWarehouseModalOpen.value = true;
};

const handleStartOrder = async () => {
    await api.updateOrderStatus(selectedOrder.value.id, { status: 'sedang_dikerjakan', notes: startForm.notes });
    isStartModalOpen.value = false;
    fetchOrders();
};

const handleFinishOrder = async () => {
    const payload = { ...finishForm, status: 'selesai' };
    await api.updateOrderStatus(selectedOrder.value.id, payload);
    isFinishModalOpen.value = false;
    fetchOrders();
};

const handleWarehouseOrder = async () => {
    await api.updateOrderStatus(selectedOrder.value.id, { status: 'diserahkan_ke_gudang', notes: warehouseForm.notes });
    isWarehouseModalOpen.value = false;
    fetchOrders();
};

const getStatusClass = (status) => {
  const classes = {
    menunggu: 'bg-yellow-100 text-yellow-800',
    sedang_dikerjakan: 'bg-blue-100 text-blue-800',
    selesai: 'bg-green-100 text-green-800',
    diserahkan_ke_gudang: 'bg-gray-100 text-gray-800'
  }
  return `px-2 py-1 text-xs font-semibold rounded-full ${classes[status] || 'bg-gray-100 text-gray-800'}`
}

onMounted(fetchOrders)
</script>