<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold text-gray-800">Production Logs</h1>
    <div class="p-6 mt-6 bg-white rounded-lg shadow grid grid-cols-1 md:grid-cols-5 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Produk</label>
        <select v-model="filters.product" class="w-full px-3 py-2 mt-1 border rounded-md">
          <option value="">Semua</option>
          <option v-for="p in products" :key="p.id" :value="p.name">{{ p.name }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Status</label>
        <select v-model="filters.status" class="w-full px-3 py-2 mt-1 border rounded-md">
          <option value="">Semua</option>
          <option value="menunggu">Menunggu</option>
          <option value="sedang_dikerjakan">Sedang Dikerjakan</option>
          <option value="selesai">Selesai</option>
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
          Reset
        </button>
      </div>
    </div>
    <div class="mt-8 overflow-x-auto bg-white rounded-lg shadow">
      <div class="flex items-center justify-between p-4">
        <h3 class="text-lg font-semibold">Ringkasan Produksi</h3>
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
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Order ID</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Produk</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Jumlah</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Target</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Aktual</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Reject</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Mulai</th>
            <th class="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Selesai</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
            <template v-for="order in filteredOrders" :key="order.id">
                <tr>
                <td class="px-6 py-4">{{ order.id }}</td>
                <td class="px-6 py-4">{{ order.plan_details.product }}</td>
                <td class="px-6 py-4">{{ order.plan_details.quantity }}</td>
                <td class="px-6 py-4">{{ order.plan_details.due_date }}</td>
                <td class="px-6 py-4">
                    <span :class="getStatusClass(order.status)">
                    {{ order.status.replace('_', ' ') }}
                    </span>
                </td>
                <td class="px-6 py-4">{{ order.quantity_actual || '-' }}</td>
                <td class="px-6 py-4">{{ order.quantity_reject || 0 }}</td>
                <td class="px-6 py-4">{{ order.started_at || '-' }}</td>
                <td class="px-6 py-4">{{ order.finished_at || '-' }}</td>
                <td class="px-6 py-4">
                    <button 
                    @click="toggleExpand(order.id)" 
                    class="text-blue-600 hover:underline">
                    {{ expandedRow === order.id ? 'Sembunyikan' : 'Lihat Logs' }}
                    </button>
                </td>
                </tr>

                <tr v-if="expandedRow === order.id" :key="`logs-${order.id}`" class="bg-gray-50">
                <td colspan="10" class="px-6 py-4">
                    <h4 class="font-semibold">Logs</h4>
                    <table class="w-full mt-2 border">
                    <thead>
                        <tr class="bg-gray-100">
                        <th class="px-4 py-2 text-left">Timestamp</th>
                        <th class="px-4 py-2 text-left">Dari</th>
                        <th class="px-4 py-2 text-left">Ke</th>
                        <th class="px-4 py-2 text-left">User</th>
                        <th class="px-4 py-2 text-left">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(log, idx) in order.logs" :key="idx">
                        <td class="px-4 py-2">{{ log.timestamp }}</td>
                        <td class="px-4 py-2">{{ log.from }}</td>
                        <td class="px-4 py-2">{{ log.to }}</td>
                        <td class="px-4 py-2">{{ log.changed_by }}</td>
                        <td class="px-4 py-2">{{ log.notes || '-' }}</td>
                        </tr>
                    </tbody>
                    </table>
                </td>
                </tr>
            </template>
            <tr v-if="filteredOrders.length === 0">
                <td colspan="10" class="px-6 py-4 text-center text-gray-500">Tidak ada data</td>
            </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { DocumentArrowDownIcon } from '@heroicons/vue/24/solid'
import api from '@/api'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

dayjs.extend(isBetween)
dayjs.extend(weekOfYear)
dayjs.extend(customParseFormat)

const orders = ref([])
const products = ref([])
const expandedRow = ref(null)

const filters = reactive({
  product: '',
  status: '',
  periodMode: '',
  date: ''
})

const fetchData = async () => {
  try {
    const [ordersRes, productsRes] = await Promise.all([
      api.getOrders(),
      api.getProducts()
    ])
    orders.value = ordersRes.data.data
    products.value = productsRes.data.data
  } catch (e) {
    console.error(e)
  }
}

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const orderDate = dayjs(order.started_at || order.created_at)
    const baseDate = dayjs(filters.date)

    let matchProduct = true
    if (filters.product) {
      matchProduct = order.plan_details.product === filters.product
    }

    const matchStatus = filters.status ? order.status === filters.status : true

    let matchDate = true
    if (filters.date && filters.periodMode) {
      if (filters.periodMode === 'daily') {
        matchDate = orderDate.isSame(baseDate, 'day')
      } else if (filters.periodMode === 'weekly') {
        matchDate = orderDate.isBetween(baseDate.startOf('week'), baseDate.endOf('week'), null, '[]')
      } else if (filters.periodMode === 'monthly') {
        matchDate = orderDate.isSame(baseDate, 'month')
      }
    }

    return matchProduct && matchStatus && matchDate
  })
})

const resetFilters = () => {
  filters.product = ''
  filters.status = ''
  filters.periodMode = ''
  filters.date = ''
}

const toggleExpand = (id) => {
  expandedRow.value = expandedRow.value === id ? null : id
}

const getStatusClass = (status) => {
  const map = {
    menunggu: 'bg-yellow-100 text-yellow-800',
    sedang_dikerjakan: 'bg-blue-100 text-blue-800',
    selesai: 'bg-green-100 text-green-800'
  }
  return `px-2 py-1 text-xs font-semibold rounded-full ${map[status] || 'bg-gray-100 text-gray-800'}`
}

const exportPDF = () => {
  const doc = new jsPDF()
  doc.setFontSize(14)
  doc.text('Laporan Produksi', 14, 15)

  filteredOrders.value.forEach((order, idx) => {
    autoTable(doc, {
      startY: idx === 0 ? 25 : doc.lastAutoTable.finalY + 10,
      head: [['Order ID', 'Produk', 'Jumlah', 'Target', 'Status', 'Aktual', 'Reject', 'Mulai', 'Selesai']],
      body: [[
        order.id,
        order.plan_details.product,
        order.plan_details.quantity,
        order.plan_details.due_date,
        order.status,
        order.quantity_actual || '-',
        order.quantity_reject || 0,
        order.started_at || '-',
        order.finished_at || '-'
      ]],
      theme: 'grid',
      styles: { fontSize: 9 }
    })

    if (order.logs && order.logs.length > 0) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 5,
        head: [['Timestamp', 'Dari', 'Ke', 'User', 'Notes']],
        body: order.logs.map(log => [
          log.timestamp,
          log.from,
          log.to,
          log.changed_by,
          log.notes || '-'
        ]),
        theme: 'striped',
        styles: { fontSize: 8 }
      })
    }
  })

  doc.save(`production_logs_${dayjs().format('YYYYMMDD_HHmm')}.pdf`)
}

onMounted(fetchData)
</script>
