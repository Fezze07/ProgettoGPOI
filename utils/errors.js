export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export const handleApiError = (error) => {
  if (error instanceof ApiError) {
    return {
      status: error.status,
      body: { error: error.message },
    }
  }

  const message = error?.message || 'Errore interno del server'
  return {
    status: 500,
    body: { error: message },
  }
}
