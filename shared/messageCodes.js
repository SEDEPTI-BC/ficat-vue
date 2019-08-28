const messages = {
  info: {},
  message: {},
  error: {
    errEntityAlreadyExist(entityName) {
      return `${entityName}AlreadyExist`
    },
    errEntityDoesNotExist(entityName) {
      return `${entityName}DoesNotExist`
    },
    errOnDbSave: 'errOnDbSave',
    errOnDbFetch: 'errOnDbFetch',
    invalidFields: 'invalidFields',
    missingFields: 'missingFields',
    errNotFound: 'errNotFound',
    errOnPayloadValidation: 'errOnPayloadValidation',
    errEmptyPayload: 'errEmptyPayload',
    errOnAuth: 'errOnAuth',
    errPasswordMismatch: 'errPasswordMismatch'
  },
  layout: {}
}

module.exports = messages
