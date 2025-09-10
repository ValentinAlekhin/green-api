// Типы для ответов API
interface GetSettingsResponse {
  wid: string
  webhookUrl?: string
  delaySendMessagesMilliseconds?: number
  incomingWebhook?: boolean
  outgoingWebhook?: boolean
  [key: string]: any
}

interface GetStateInstanceResponse {
  stateInstance: 'notAuthorized' | 'authorized' | 'blocked' | 'starting' | 'yellowCard'
}

interface SendMessageRequest {
  chatId: string
  message: string
  quotedMessageId?: string
  linkPreview?: boolean
}

interface SendFileByUrlRequest {
  chatId: string
  urlFile: string
  fileName: string
  caption?: string
}

interface ApiResponse {
  idMessage?: string
  [key: string]: any
}

export const useGreenApi = () => {
  const idInstance = useLocalStorage('green-api-id-instance', '')
  const apiTokenInstance = useLocalStorage('green-api-token-instance', '')

  const isConfigured = computed(() => {
    return idInstance.value.trim() !== '' && apiTokenInstance.value.trim() !== ''
  })

  const resetConfig = () => {
    idInstance.value = ''
    apiTokenInstance.value = ''
  }

  const baseUrl = 'https://api.green-api.com'

  // Получение настроек инстанса
  const getSettings = async () => {
    if (!isConfigured.value) {
      throw new Error('GREEN-API не настроен. Укажите idInstance и apiTokenInstance.')
    }

    return await $fetch<GetSettingsResponse>(`${baseUrl}/waInstance${idInstance.value}/getSettings/${apiTokenInstance.value}`, {
      method: 'GET'
    })
  }

  // Получение состояния инстанса
  const getStateInstance = async () => {
    if (!isConfigured.value) {
      throw new Error('GREEN-API не настроен. Укажите idInstance и apiTokenInstance.')
    }

    return await $fetch<GetStateInstanceResponse>(`${baseUrl}/waInstance${idInstance.value}/getStateInstance/${apiTokenInstance.value}`, {
      method: 'GET'
    })
  }

  // Отправка текстового сообщения
  const sendMessage = async (messageData: SendMessageRequest) => {
    if (!isConfigured.value) {
      throw new Error('GREEN-API не настроен. Укажите idInstance и apiTokenInstance.')
    }

    return await $fetch<ApiResponse>(`${baseUrl}/waInstance${idInstance.value}/sendMessage/${apiTokenInstance.value}`, {
      method: 'POST',
      body: messageData
    })
  }

  // Отправка файла по URL
  const sendFileByUrl = async (fileData: SendFileByUrlRequest) => {
    if (!isConfigured.value) {
      throw new Error('GREEN-API не настроен. Укажите idInstance и apiTokenInstance.')
    }

    return await $fetch<ApiResponse>(`${baseUrl}/waInstance${idInstance.value}/sendFileByUrl/${apiTokenInstance.value}`, {
      method: 'POST',
      body: fileData
    })
  }

  return {
    idInstance,
    apiTokenInstance,
    isConfigured,
    resetConfig,
    getSettings,
    getStateInstance,
    sendMessage,
    sendFileByUrl
  }
}