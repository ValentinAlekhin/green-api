<template>
  <UCard class="w-full max-w-md">
    <template #header>
      <h3 class="text-lg font-semibold">Настройки GREEN-API</h3>
    </template>

    <UForm 
      :schema="schema" 
      :state="state" 
      class="space-y-4 flex flex-col"
      @submit="onSubmit"
    >
      <UFormField
        label="ID Instance" 
        name="idInstance"
        help="Уникальный идентификатор инстанса GREEN-API"
        class="w-full"
      >
        <UInput 
          v-model="state.idInstance" 
          placeholder="Введите ID Instance"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="API Token Instance" 
        name="apiTokenInstance"
        help="Токен доступа к API"
        class="w-full"
      >
        <UInput 
          v-model="state.apiTokenInstance" 
          placeholder="Введите API Token"
          class="w-full"
        />
      </UFormField>

      <div class="flex gap-2 pt-4">
        <UButton 
          type="submit" 
          :loading="pending"
          class="flex-1"
        >
          Подтвердить
        </UButton>
        
        <UButton 
          variant="soft"
          @click="resetForm"
        >
          Сброс
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { z } from 'zod'

interface ConfigFormState {
  idInstance: string
  apiTokenInstance: string
}

const { idInstance, apiTokenInstance, resetConfig } = useGreenApi()

const pending = ref(false)

const schema = z.object({
  idInstance: z.string()
    .min(1, 'ID Instance обязателен')
    .regex(/^\d+$/, 'ID Instance должен содержать только цифры'),
  apiTokenInstance: z.string()
    .min(1, 'API Token обязателен')
    .min(50, 'API Token должен содержать минимум 50 символов')
})

const state = reactive<ConfigFormState>({
  idInstance: idInstance.value,
  apiTokenInstance: apiTokenInstance.value
})

const emit = defineEmits<{
  submit: [config: { idInstance: string; apiTokenInstance: string }]
}>()

async function onSubmit() {
  pending.value = true
  
  try {
    idInstance.value = state.idInstance
    apiTokenInstance.value = state.apiTokenInstance
    
    emit('submit', {
      idInstance: state.idInstance,
      apiTokenInstance: state.apiTokenInstance
    })
    
    await new Promise(resolve => setTimeout(resolve, 500))
  } finally {
    pending.value = false
  }
}

function resetForm() {
  resetConfig()
  state.idInstance = ''
  state.apiTokenInstance = ''
}

watch([idInstance, apiTokenInstance], () => {
  state.idInstance = idInstance.value
  state.apiTokenInstance = apiTokenInstance.value
})
</script>