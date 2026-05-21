export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const handleApiError = (error) => {
  if (error instanceof ApiError || error?.name === 'ApiError') {
    return {
      status: error.status || 500,
      body: { error: error.message },
    }
  }

  if (error?.name === 'ZodError') {
    const firstError = error.errors?.[0]?.message || 'Errore di validazione'
    return {
      status: 400,
      body: { error: firstError },
    }
  }

  console.error("UNHANDLED API ERROR:", error);
  const message = error?.message || 'Errore interno del server'
  return {
    status: 500,
    body: { error: message, stack: error?.stack },
  }
}
