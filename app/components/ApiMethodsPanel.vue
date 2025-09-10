<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-medium">Методы API</h3>
    </template>
    
    <div class="space-y-4">
      <!-- getSettings -->
      <div>
        <UButton 
          @click="$emit('callMethod', 'getSettings')"
          :loading="loadingStates.getSettings"
          :disabled="isAnyLoading"
          block
        >
          getSettings
        </UButton>
      </div>
      
      <!-- getStateInstance -->
      <div>
        <UButton 
          @click="$emit('callMethod', 'getStateInstance')"
          :loading="loadingStates.getStateInstance"
          :disabled="isAnyLoading"
          block
        >
          getStateInstance
        </UButton>
      </div>
      
      <!-- sendMessage -->
      <div>
        <UForm 
          ref="sendMessageFormRef" 
          :schema="sendMessageSchema" 
          :state="sendMessageForm" 
          class="space-y-4 flex flex-col"
          @submit="handleFormSubmit('sendMessage')"
        >
          <UFormField
            label="Chat ID" 
            name="chatId"
            help="ID чата для отправки сообщения"
            class="w-full"
          >
            <UInput 
              v-model="sendMessageForm.chatId" 
              placeholder="79876543210@c.us"
              :disabled="isAnyLoading"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Сообщение" 
            name="message"
            help="Текст сообщения для отправки"
            class="w-full"
          >
            <UTextarea 
              v-model="sendMessageForm.message" 
              placeholder="Текст сообщения"
              :disabled="isAnyLoading"
              :rows="3"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Цитируемый ID сообщения (опционально)" 
            name="quotedMessageId"
            help="ID сообщения для цитирования"
            class="w-full"
          >
            <UInput 
              v-model="sendMessageForm.quotedMessageId" 
              placeholder="ID сообщения для цитирования"
              :disabled="isAnyLoading"
              class="w-full"
            />
          </UFormField>
          <UButton 
            type="submit"
            :loading="loadingStates.sendMessage"
            :disabled="isAnyLoading"
            class="w-full"
          >
            sendMessage
          </UButton>
        </UForm>
      </div>
      
      <!-- sendFileByUrl -->
      <div>
        <UForm 
          ref="sendFileFormRef" 
          :schema="sendFileSchema" 
          :state="sendFileForm" 
          class="space-y-4 flex flex-col"
          @submit="handleFormSubmit('sendFileByUrl')"
        >
          <UFormField
            label="Chat ID" 
            name="chatId"
            help="ID чата для отправки файла"
            class="w-full"
          >
            <UInput 
              v-model="sendFileForm.chatId" 
              placeholder="79876543210@c.us"
              :disabled="isAnyLoading"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="URL файла" 
            name="urlFile"
            help="Прямая ссылка на файл"
            class="w-full"
          >
            <UInput 
              v-model="sendFileForm.urlFile" 
              placeholder="https://example.com/file.png"
              :disabled="isAnyLoading"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Имя файла" 
            name="fileName"
            help="Имя файла с расширением"
            class="w-full"
          >
            <UInput 
              v-model="sendFileForm.fileName" 
              placeholder="file.png"
              :disabled="isAnyLoading"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Подпись (опционально)" 
            name="caption"
            help="Описание файла"
            class="w-full"
          >
            <UTextarea 
              v-model="sendFileForm.caption" 
              placeholder="Описание файла"
              :disabled="isAnyLoading"
              :rows="2"
              class="w-full"
            />
          </UFormField>
          <UButton 
            type="submit"
            :loading="loadingStates.sendFileByUrl"
            :disabled="isAnyLoading"
            class="w-full"
          >
            sendFileByUrl
          </UButton>
        </UForm>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { z } from 'zod'

interface LoadingStates {
  getSettings: boolean
  getStateInstance: boolean
  sendMessage: boolean
  sendFileByUrl: boolean
}

interface Props {
  loadingStates: LoadingStates
  isAnyLoading: boolean
  sendMessageForm: {
    chatId: string
    message: string
    quotedMessageId: string
  }
  sendFileForm: {
    chatId: string
    urlFile: string
    fileName: string
    caption: string
  }
}

defineProps<Props>()

// Локальные ссылки на формы
const sendMessageFormRef = ref()
const sendFileFormRef = ref()

const emit = defineEmits<{
  callMethod: [method: 'getSettings' | 'getStateInstance']
  callMethodWithForm: [method: 'sendMessage' | 'sendFileByUrl']
}>()

// Функция для обработки отправки форм
async function handleFormSubmit(method: 'sendMessage' | 'sendFileByUrl') {
  let formRef
  
  if (method === 'sendMessage') {
    formRef = sendMessageFormRef.value
  } else {
    formRef = sendFileFormRef.value
  }
  
  if (!formRef) return
  
  try {
    await formRef.validate()
    emit('callMethodWithForm', method)
  } catch (error) {
    // Форма не валидна, ошибки уже отображаются
    return
  }
}

const sendMessageSchema = z.object({
  chatId: z.string().min(1, 'Chat ID обязателен').regex(/@c\.us$/, 'Chat ID должен заканчиваться на @c.us'),
  message: z.string().min(1, 'Сообщение обязательно').max(20000, 'Максимум 20,000 символов'),
  quotedMessageId: z.string().optional()
})

const sendFileSchema = z.object({
  chatId: z.string().min(1, 'Chat ID обязателен').regex(/@c\.us$/, 'Chat ID должен заканчиваться на @c.us'),
  urlFile: z.string().min(1, 'URL файла обязателен').regex(/^https?:\/\//, 'Введите корректный URL'),
  fileName: z.string().min(1, 'Имя файла обязательно'),
  caption: z.string().optional()
})
</script>