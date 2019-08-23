const KnowledgeArea = require('../models/KnowledgeArea')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')
const { validatePayload } = require('../../shared/utils')

async function create(ctx) {
  const payload = ctx.request.body
  const code = payload.code
  const existingKa = await KnowledgeArea.where({ code }).fetch()
  if (existingKa) {
    ctx.throw(HttpCodes.BAD_REQUEST.code, HttpCodes.BAD_REQUEST.message, {
      errCode: MessageCodes.error.errEntityAlreadyExist('knowledgeArea')
    })
    return
  }
  ctx.status = HttpCodes.OK.code
  const newKnowledgeArea = await KnowledgeArea.forge(payload).save()
  const id = newKnowledgeArea.id
  ctx.set('Location', `/api/knowledgeAreas/${id}`)
  ctx.body = newKnowledgeArea
}

async function list(ctx) {
  const query = Object.assign({}, ctx.query)
  if (Object.keys(query).length) {
    const validation = validatePayload(query, ['page', 'size'], true)
    const { page = 1, size = process.env.API_PAGE_SIZE } = query
    if (validation.valid) {
      ctx.body = await KnowledgeArea.fetchPage({
        pageSize: size,
        page
      })
    } else {
      ctx.status = HttpCodes.BAD_REQUEST.code
      const errorMessages = []
      for (const i in validation) {
        if (i === 'valid') continue
        errorMessages.push({
          errCode: MessageCodes.error[i],
          fields: `${validation[i].join(', ')}`
        })
      }
      ctx.throw(HttpCodes.BAD_REQUEST.code, HttpCodes.BAD_REQUEST.message, {
        errors: errorMessages
      })
    }
  } else ctx.body = await KnowledgeArea.fetchAll()
}

async function update(ctx) {
  const id = +ctx.params.id
  const payload = ctx.request.body
  const ka = await KnowledgeArea.where({ id }).fetch()
  if (ka) {
    try {
      await KnowledgeArea.where({ id }).save(payload, {
        patch: true
      })
      ctx.body = ka
      ctx.status = HttpCodes.OK.code
    } catch (e) {
      ctx.throw(HttpCodes.INT_SRV_ERROR.code, HttpCodes.INT_SRV_ERROR.message, {
        error: {
          errCode: MessageCodes.error.errOnDbSave,
          rawErrorMessage: e
        }
      })
    }
  } else {
    ctx.throw(HttpCodes.BAD_REQUEST.code, HttpCodes.BAD_REQUEST.message, {
      error: {
        errCode: MessageCodes.error.errEntityDoesNotExist('knowledgeArea')
      }
    })
  }
}

// needs to test
async function del(ctx) {
  const id = +ctx.params.id
  const existingKa = await KnowledgeArea.where({ id }).fetch()
  if (!existingKa) {
    ctx.throw(HttpCodes.BAD_REQUEST.code, HttpCodes.BAD_REQUEST.message, {
      errCode: MessageCodes.error.errEntityDoesNotExist('knowledgeArea')
    })
    return
  }
  try {
    await KnowledgeArea.where({ id }).destroy()
    ctx.status = HttpCodes.OK.code
  } catch (e) {
    ctx.throw(HttpCodes.BAD_REQUEST.code, HttpCodes.BAD_REQUEST.message, {
      errCode: MessageCodes.error.errOnDbSave
    })
  }
}

module.exports = { create, list, update, del }
