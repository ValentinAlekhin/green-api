export default defineNuxtRouteMiddleware((to) => {
  const { isConfigured } = useGreenApi()
  
  // Если переходим на страницу auth, не перенаправляем
  if (to.path === '/auth') {
    return
  }
  
  // Если конфигурация не настроена, перенаправляем на auth
  if (!isConfigured.value) {
    return navigateTo('/auth')
  }
})