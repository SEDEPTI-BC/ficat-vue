/**
 * Gera o modelo PDF baseado nos dados da
 * ficha catalográfica gerados pelo usuário final
 * @param {PDFKit.PDFDocument} doc
 * @param {Object} {
 *  cutter: String
 *  authors: {
      authorName: String,
      authorSurname: String,
      author2Name: String,
      author2Surname: String
    },
    work: {
      workTitle: String,
      workSubtitle: String,
      presentationYear: String,
      workImagesType: String,
      totalPages: String,
      workType: String
    },
    advisors: {
      advisorName: String,
      advisorSurname: String,
      isFemaleAdvisor: Boolean,
      advisorTitle: String,
      coadvisorName: String,
      coadvisorSurname: String,
      isFemaleCoadvisor: Boolean,
      coadvisorTitle: String
    },
    academicDetails: {
      program: String,
      acdUnity: String
    },
    cdd: String
 */
function catalogCard(
  doc,
  font,
  { cutter, authors, work, advisors, academicDetails, keywords, cdd }
) {
  doc.moveDown(20)

  const defaultFont = `${font === 'times' ? 'Times' : 'Arial'}`

  const header = `
Dados Internacionais de Catalogação na Publicação (CIP) de acordo com ISBD
Sistema de Bibliotecas da Universidade Federal do Pará
Gerada automaticamente pelo módulo Ficat, mediante os dados fornecidos pelo(a) autor(a)`

  doc.font(`${defaultFont}-Bold`, 10).text(header, {
    align: 'center',
    continued: true
  })

  function drawLine(doc, x, y, length) {
    doc
      .lineWidth(2)
      .moveTo(x, y)
      .lineTo(x + length, y)
      .stroke()
  }

  drawLine(doc, 90, 425, 430)

  const subtitle = work.workSubtitle ? `: ${work.workSubtitle}` : ''

  const author2 = authors.author2Name
    ? `, ${authors.author2Name} ${authors.author2Surname}.`
    : '.'

  const color = {
    nocolor: '',
    color: ' : il. color',
    pb: ' : il. pb'
  }

  doc
    .font(`${defaultFont}-Regular`, 10)
    .text(cutter, -270, 450, {
      align: 'justify'
    })
    .text(` ${authors.surname}, ${authors.name}`, 150, 450)
    .text(
      `  ${work.workTitle} ${subtitle} / ${authors.authorName} ${authors.authorSurname}${author2} — ${work.presentationYear}`
    )
    .text(` ${work.totalPages} f.${color[work.workImagesType]}`)

  const advisorHeader = `Orientador(a): ${advisors.advisorTitle} ${advisors.advisorName} ${advisors.advisorSurname}`
  const coadvisorHeader = advisors.coadvisorName
    ? `Coorientador(a): ${advisors.coadvisorTitle} ${advisors.coadvisorName} ${advisors.coadvisorSurname}`
    : ''

  const workHeader = `${work.workType} - ${academicDetails.course}, ${academicDetails.acdUnity}`

  const localHeader = `${academicDetails.program}, Universidade Federal do Pará, Belém, 2019.`

  let kws = ''
  for (const kn in keywords) {
    kws += `${kn + 1}. ${keywords[kn]}`
  }
  const keywordHeader = `${kws} . I. ${work.workTitle}.`

  doc
    .moveDown(1)
    .text('   ' + advisorHeader)
    .text(coadvisorHeader ? '   ' + coadvisorHeader : '')
    .text('   ' + workHeader, {
      width: 300
    })
    .text(localHeader, {
      width: 300
    })
    .moveDown(0.5)
    .text(keywordHeader, {
      width: 300
    })

  doc.moveDown(1).text(cdd, 520 - cdd.length * 5.5)

  drawLine(doc, 90, 610, 430)
}

module.exports = catalogCard