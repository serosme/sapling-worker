export default defineEventHandler((event) => {
  if (!event.path.startsWith('/api/')) {
    setResponseStatus(event, 404)
    return ''
  }

  const { apiToken } = useRuntimeConfig(event)
  const token = apiToken.trim()

  if (!token || getHeader(event, 'authorization') !== `Bearer ${token}`) {
    throw createError({ statusCode: 401, message: 'Invalid token' })
  }
})
