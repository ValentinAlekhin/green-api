<template>
  <div>
    <!-- Двухколоночная структура -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Левая колонка -->
      <div class="space-y-6">
        <!-- Информация о подключении -->
        <ConnectionInfo />
        
        <!-- Методы API -->
        <ApiMethodsPanel
          :loading-states="loadingStates"
          :is-any-loading="isAnyLoading"
          :send-message-form="sendMessageForm"
          :send-file-form="sendFileForm"
          @call-method="callApiMethod"
          @call-method-with-form="callApiMethodWithForm"
        />
      </div>
      
      <!-- Правая колонка -->
      <div>
        <ApiResponsePanel
          :response="apiResponse"
          :is-loading="isAnyLoading"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

const { 
  getSettings,
  getStateInstance,
  sendMessage,
  sendFileByUrl
} = useGreenApi()

// Состояние загрузки для каждого метода
const loadingStates = ref({
  getSettings: false,
  getStateInstance: false,
  sendMessage: false,
  sendFileByUrl: false
})

// Ответ API
const apiResponse = ref<any>(null)

// Проверяем, идет ли загрузка любого метода
const isAnyLoading = computed(() => {
  return Object.values(loadingStates.value).some(loading => loading)
})


// Состояние форм
const sendMessageForm = ref({
  chatId: '79876543210@c.us',
  message: '',
  quotedMessageId: ''
})

const sendFileForm = ref({
  chatId: '79876543210@c.us',
  urlFile: '',
  fileName: '',
  caption: ''
})


// Функция вызова метода без формы (GET запросы)
const callApiMethod = useDebounceFn(async (method: 'getSettings' | 'getStateInstance') => {
  loadingStates.value[method] = true
  apiResponse.value = null
  
  try {
    let result
    
    switch (method) {
      case 'getSettings':
        result = await getSettings()
        break
      case 'getStateInstance':
        result = await getStateInstance()
        break
    }
    
    apiResponse.value = {
      method,
      data: result,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    apiResponse.value = {
      method,
      error: (error as Error)?.message || 'Произошла ошибка',
      timestamp: new Date().toISOString()
    }
  } finally {
    loadingStates.value[method] = false
  }
}, 300)

// Функция вызова метода с формой (POST запросы)
const callApiMethodWithForm = useDebounceFn(async (method: 'sendMessage' | 'sendFileByUrl') => {
  loadingStates.value[method] = true
  apiResponse.value = null
  
  try {
    let result
    
    switch (method) {
      case 'sendMessage':
        result = await sendMessage({
          chatId: sendMessageForm.value.chatId,
          message: sendMessageForm.value.message,
          ...(sendMessageForm.value.quotedMessageId && { quotedMessageId: sendMessageForm.value.quotedMessageId })
        })
        break
      case 'sendFileByUrl':
        result = await sendFileByUrl({
          chatId: sendFileForm.value.chatId,
          urlFile: sendFileForm.value.urlFile,
          fileName: sendFileForm.value.fileName,
          ...(sendFileForm.value.caption && { caption: sendFileForm.value.caption })
        })
        break
    }
    
    apiResponse.value = {
      method,
      data: result,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    apiResponse.value = {
      method,
      error: (error as Error)?.message || 'Произошла ошибка',
      timestamp: new Date().toISOString()
    }
  } finally {
    loadingStates.value[method] = false
  }
}, 300)

</script>