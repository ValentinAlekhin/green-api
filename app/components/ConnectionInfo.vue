<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium">Параметры подключения</h3>
        <UBadge color="success" variant="soft">Активна</UBadge>
      </div>
    </template>
    
    <div class="space-y-2 text-sm">
      <p><strong>ID Instance:</strong> {{ idInstance }}</p>
      <p><strong>API Token:</strong> {{ maskedToken }}</p>
    </div>
    
    <template #footer>
      <UButton 
        color="neutral" 
        variant="soft"
        @click="resetAndRedirect"
        block
      >
        Изменить настройки
      </UButton>
    </template>
  </UCard>
</template>

<script setup lang="ts">
const { idInstance, apiTokenInstance, resetConfig } = useGreenApi()

const maskedToken = computed(() => {
  if (!apiTokenInstance.value) return ''
  return apiTokenInstance.value.slice(0, 8) + '...' + apiTokenInstance.value.slice(-4)
})

function resetAndRedirect() {
  resetConfig()
  navigateTo('/auth')
}
</script>