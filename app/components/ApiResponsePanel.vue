<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-medium">Ответ API</h3>
    </template>
    
    <div class="h-96 overflow-auto">
      <!-- Лоадер во время загрузки -->
      <div v-if="isLoading" class="flex items-center justify-center h-full">
        <div class="text-center space-y-2">
          <div class="inline-flex items-center justify-center w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-sm">Загрузка...</p>
        </div>
      </div>
      
      <!-- Ответ API -->
      <CodeHighlighter
        v-else-if="response"
        :code="JSON.stringify(response, null, 2)"
        lang="json"
        :theme="isDarkMode ? 'dark' : 'light'"
      />
      
      <!-- Пустое состояние -->
      <div v-else class="flex items-center justify-center h-full text-sm">
        Выберите метод и нажмите кнопку для получения ответа
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  response: any
  isLoading: boolean
}

defineProps<Props>()

// Определяем темную тему с использованием Nuxt UI color mode
const colorMode = useColorMode()
const isDarkMode = computed(() => colorMode.value === 'dark')
</script>