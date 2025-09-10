<template>
  <div class="max-w-md mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold">Настройка GREEN-API</h1>
      <p class="mt-2 text-sm text-gray-600">
        Введите параметры подключения к инстансу
      </p>
    </div>
    
    <GreenApiConfigForm @submit="onConfigSubmit" />
  </div>
</template>

<script setup lang="ts">
function onConfigSubmit(config: { idInstance: string; apiTokenInstance: string }) {
  console.log('Конфигурация сохранена:', config)
  navigateTo('/')
}
</script>