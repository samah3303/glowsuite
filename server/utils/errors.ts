export const handlePrismaError = (error: any) => {
  if (error?.code === 'P2002') {
    throw createError({ statusCode: 400, statusMessage: 'Unique constraint failed' })
  }
  if (error?.code === 'P2025') {
    throw createError({ statusCode: 404, statusMessage: 'Record not found' })
  }
  if (error?.name === 'PrismaClientValidationError' || error?.name === 'PrismaClientKnownRequestError') {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request' })
  }
  
  const statusCode = error?.statusCode || 500;
  const statusMessage = statusCode === 500 ? 'Internal Server Error' : (error?.statusMessage || 'Internal Server Error');

  throw createError({
    statusCode,
    statusMessage
  })
}
