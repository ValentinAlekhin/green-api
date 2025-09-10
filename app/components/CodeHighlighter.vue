<template>
  <div class="code-highlighter">
    <div v-if="pending">Загрузка подсветки...</div>
    <div v-else-if="error" class="text-red-500">Ошибка подсветки кода</div>
    <div v-else v-html="highlightedCode" class="text-sm"></div>
  </div>
</template>

<script setup lang="ts">
import { createHighlighter } from 'shiki'

interface Props {
  code: string
  lang?: string
  theme?: 'light' | 'dark'
}

const props = withDefaults(defineProps<Props>(), {
  lang: 'json',
  theme: 'light'
})

const highlightedCode = ref('')
const pending = ref(true)
const error = ref(false)

const lightTheme = 'github-light'
const darkTheme = 'github-dark'

const highlighter = ref<any>(null)

onMounted(async () => {
  try {
    highlighter.value = await createHighlighter({
      themes: [lightTheme, darkTheme],
      langs: ['json', 'javascript', 'typescript']
    })
    
    await updateHighlight()
  } catch (err) {
    console.error('Error creating highlighter:', err)
    error.value = true
  } finally {
    pending.value = false
  }
})

const updateHighlight = async () => {
  if (!highlighter.value) return
  
  try {
    const selectedTheme = props.theme === 'dark' ? darkTheme : lightTheme
    highlightedCode.value = highlighter.value.codeToHtml(props.code, {
      lang: props.lang,
      theme: selectedTheme
    })
  } catch (err) {
    console.error('Error highlighting code:', err)
    error.value = true
  }
}

watch(() => props.code, updateHighlight)
watch(() => props.theme, updateHighlight)
</script>

<style scoped>
.code-highlighter :deep(pre) {
  margin: 0;
  padding: 16px;
  background: transparent !important;
  border-radius: 8px;
  overflow-x: auto;
}

.code-highlighter :deep(code) {
  background: transparent !important;
}
</style>