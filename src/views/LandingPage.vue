<template>
  <div class="bg-white">
    <nav class="container mx-auto p-6 flex justify-between items-center">
      <div class="text-2xl font-bold text-blue-600">
        Elitech
      </div>
      <div class="hidden md:flex space-x-6 items-center">
        <router-link to="/login" class="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
          Login
        </router-link>
        <router-link to="/login" class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Mulai Sekarang
        </router-link>
      </div>
    </nav>

    <section class="container mx-auto px-6 py-24 text-center">
      <h1 class="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">
        Optimalkan Proses Manufaktur
      </h1>
      <p class="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
        Dari perencanaan hingga laporan akhir, alur kerja terintegrasi untuk efisiensi produksi yang maksimal.
      </p>
      <div class="mt-8">
        <router-link to="/login" class="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          Coba Demo
        </router-link>
      </div>
    </section>

    <section id="fitur" class="py-20 bg-gray-50">
      <div class="container mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-800">Fitur Unggulan</h2>
          <p class="text-gray-600 mt-2">Semua yang Anda butuhkan dalam satu platform.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div class="text-center">
            <div class="flex items-center justify-center h-16 w-16 mx-auto mb-4 bg-blue-100 rounded-full">
              <DocumentChartBarIcon class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800">Perencanaan Terpusat</h3>
            <p class="mt-2 text-gray-600">Modul PPIC memungkinkan Anda membuat, mengubah, dan mengelola semua rencana produksi di satu tempat.</p>
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center h-16 w-16 mx-auto mb-4 bg-blue-100 rounded-full">
              <CheckBadgeIcon class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800">Alur Persetujuan Jelas</h3>
            <p class="mt-2 text-gray-600">Manajer dapat meninjau dan menyetujui rencana dengan sekali klik, memastikan tidak ada produksi yang tidak sah.</p>
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center h-16 w-16 mx-auto mb-4 bg-blue-100 rounded-full">
              <BellIcon class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800">Notifikasi Real-Time</h3>
            <p class="mt-2 text-gray-600">Setiap peran akan mendapatkan notifikasi instan untuk setiap progres penting, dari pengajuan hingga penyelesaian.</p>
          </div>
        </div>
      </div>
    </section>
    
    <footer class="bg-gray-800 text-white py-8">
        <div class="container mx-auto px-6 text-center">
            <p>&copy; 2025 Elitech Manufaktur. All rights reserved.</p>
        </div>
    </footer>
  </div>
</template>

<script setup>
import { DocumentChartBarIcon, CheckBadgeIcon, BellIcon } from '@heroicons/vue/24/outline';
</script>