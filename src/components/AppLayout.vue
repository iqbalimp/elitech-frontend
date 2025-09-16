<template>
  <div class="flex h-screen bg-gray-100">
    <aside class="flex-shrink-0 w-64 bg-gray-800 text-white flex flex-col">
      <div class="px-6 py-4 text-xl font-bold border-b border-gray-700">Elitech Manufaktur</div>
      <nav class="flex-1 px-4 py-4 space-y-2">
        <router-link
          to="/app/dashboard" class="block px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
        >Dashboard
        </router-link>

        <router-link
          v-if="userRole === 'manager'"
          to="/app/manager/ppic-approval"
          class="block px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
        >Persetujuan PPIC
        </router-link>

        <router-link
          v-if="userRole === 'staff_ppic'"
          to="/app/ppic"
          class="block px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >Produksi Plan
        </router-link>

        <router-link
          v-if="userRole === 'staff_ppic' | userRole === 'manager'"
          to="/app/ppic/logs"
          class="block px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">Produksi Plan Logs
        </router-link>
        
        <router-link
          v-if="userRole === 'staff_produksi'"
          to="/app/produksi"
          class="block px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">Produksi Order
        </router-link>
        <router-link
          v-if="userRole === 'staff_produksi' | userRole === 'manager'"
          to="/app/produksi/logs"
          class="block px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white">Produksi Order Logs
        </router-link>
      </nav>
      <div class="p-4 text-xs text-gray-500 border-t border-gray-700">© 2025 Elitech</div>
    </aside>

    <div class="flex flex-col flex-1">
      <header class="flex items-center justify-between p-4 bg-white border-b">
        <div></div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <button @click="toggleNotifications" class="relative">
              <BellIcon class="w-6 h-6 text-gray-600"/>
              <span v-if="unreadCount > 0" class="absolute top-0 right-0 w-4 h-4 text-xs text-white bg-red-500 rounded-full">{{ unreadCount }}</span>
            </button>
            <div v-if="showNotifications" class="absolute right-0 z-10 w-96 mt-2 bg-white rounded-md shadow-lg border overflow-hidden">
              <div class="max-h-96 overflow-y-auto">

                <div class="sticky top-0 z-10 bg-gray-100 border-b p-2 font-semibold text-gray-800">
                  Belum Dibaca
                </div>
                <div v-if="notifications.unread && notifications.unread.length > 0">
                  <div 
                    v-for="notif in notifications.unread" 
                    :key="notif.id" 
                    class="px-4 py-3 border-b hover:bg-blue-50 flex justify-between items-start"
                  >
                    <div>
                      <p class="text-sm text-gray-900 font-medium">{{ notif.data.message }}</p>
                      <p class="text-xs text-gray-500">Diterima: {{ formatDate(notif.created_at) }}</p>
                    </div>
                    <button 
                      @click.stop="readNotification(notif)" 
                      class="ml-2 text-xs text-blue-600 hover:underline"
                    >
                      Tandai Dibaca
                    </button>
                  </div>
                </div>
                <div v-else class="px-4 py-2 text-sm text-gray-500">Tidak ada notifikasi baru.</div>


                <div class="sticky top-0 z-10 bg-gray-100 border-b p-2 font-semibold text-gray-800">
                  Sudah Dibaca
                </div>
                <div v-if="notifications.read && notifications.read.length > 0">
                  <div 
                    v-for="notif in notifications.read" 
                    :key="notif.id" 
                    class="px-4 py-3 border-b hover:bg-gray-50"
                  >
                    <p class="text-sm text-gray-700">{{ notif.data.message }}</p>
                    <p class="text-xs text-gray-400">Diterima: {{ formatDate(notif.created_at) }}</p>
                  </div>
                </div>
                <div v-else class="px-4 py-2 text-sm text-gray-500">Belum ada notifikasi lama.</div>
              </div>
            </div>
          </div>
          <span>{{ user.name }}</span>
          <button @click="authStore.logout()" class="text-sm text-red-600 hover:underline">Logout</button>
        </div>
      </header>
      
      <main class="flex-1 p-6 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { BellIcon } from '@heroicons/vue/24/outline';
import api from '@/api';

const authStore = useAuthStore();
const router = useRouter();
const user = computed(() => authStore.user);
const userRole = computed(() => authStore.userRole);

const showNotifications = ref(false);
const notifications = ref({ unread: [], read: [] });
const unreadCount = computed(() => notifications.value.unread?.length || 0);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};


const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const fetchNotifications = async () => {
  try {
    const response = await api.getNotifications();
    notifications.value = response.data;
  } catch (error) {
    console.error('Gagal mengambil notifikasi:', error);
  }
};

const readNotification = async (notification) => {
  try {
    await api.markNotificationAsRead(notification.id);
    fetchNotifications();
  } catch (error) {
    console.error("Gagal menandai notifikasi:", error);
  }
};


onMounted(() => {
  fetchNotifications();
  setInterval(fetchNotifications, 60000);
});
</script>