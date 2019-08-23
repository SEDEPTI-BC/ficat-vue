const KnowledgeArea = require('../models/KnowledgeArea')
const HttpCodes = require('../httpCodes')
const MessageCodes = require('../../shared/messageCodes')

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
  ctx.body = await KnowledgeArea.fetchAll()
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

async function del(ctx) {
  const payload = ctx.request.body
  const id = payload.id
  const existingKa = await KnowledgeArea.where({ id }).fetch()
  if (!existingKa) {
    ctx.throw(HttpCodes.BAD_REQUEST.code, HttpCodes.BAD_REQUEST.message, {
      errCode: MessageCodes.error.errEntityDoesNotExist('knowledgeArea')
    })
    return
  }
  ctx.status = HttpCodes.OK.code
  const newKnowledgeArea = await KnowledgeArea.forge(payload).save()
  ctx.set('Location', `/api/knowledgeAreas/${id}`)
  ctx.body = newKnowledgeArea
}

module.exports = { create, list, update, del }