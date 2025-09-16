<template>
  <div class="flex justify-center bg-gray-100 py-30 min-h-[calc(100vh-4rem)]">
    <div class="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
      <h1 class="mb-8 text-2xl font-bold text-center text-gray-800">Pilih Modul</h1>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        <router-link
          v-if="userRole === 'manager'"
          to="/app/manager/ppic-approval"
          class="flex flex-col items-center p-6 space-y-3 text-center transition bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm hover:bg-yellow-100">
          <CheckCircleIcon class="w-10 h-10 text-yellow-600" />
          <span class="text-lg font-semibold text-yellow-700">Approval PPIC</span>
        </router-link>

        <router-link
          v-if="userRole === 'staff_ppic'"
          to="/app/ppic"
          class="flex flex-col items-center p-6 space-y-3 text-center transition bg-green-50 border border-green-200 rounded-lg shadow-sm hover:bg-green-100">
          <ClipboardDocumentListIcon class="w-10 h-10 text-green-600" />
          <span class="text-lg font-semibold text-green-700">Produksi Plan</span>
        </router-link>

        <router-link
          v-if="userRole === 'staff_ppic' | userRole === 'manager'"
          to="/app/ppic/logs"
          class="flex flex-col items-center p-6 space-y-3 text-center transition bg-green-50 border border-green-200 rounded-lg shadow-sm hover:bg-green-100">
          <DocumentTextIcon class="w-10 h-10 text-green-600" />
          <span class="text-lg font-semibold text-green-700">Produksi Plan Logs</span>
        </router-link>

        <router-link
          v-if="userRole === 'staff_produksi'"
          to="/app/produksi"
          class="flex flex-col items-center p-6 space-y-3 text-center transition bg-blue-50 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-100">
          <WrenchScrewdriverIcon class="w-10 h-10 text-blue-600" />
          <span class="text-lg font-semibold text-blue-700">Produksi Order</span>
        </router-link>
        <router-link
          v-if="userRole === 'staff_produksi' | userRole === 'manager'"
          to="/app/produksi/logs"
          class="flex flex-col items-center p-6 space-y-3 text-center transition bg-blue-50 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-100">
          <DocumentTextIcon class="w-10 h-10 text-blue-600" />
          <span class="text-lg font-semibold text-blue-700">Produksi Order Logs</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

import {
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const userRole = computed(() => authStore.userRole);
</script>
