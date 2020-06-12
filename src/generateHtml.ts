import { RawDraftContentState } from "draft-js"

export default function generateHTML(messageBody: RawDraftContentState) {
  const date = new Date()
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  let howManyLinesHaveBeenWritten = 0
  let pageNumber = 1
  const charPerLine = 80

  return `
  <html><head><meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet" type="text/css">
  <title>Letter Template</title>
  <style>
  *, *:before, *:after {
    -webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box}body {
      width: 8.5in;height: 11in;
      margin: 0
    }
    .page { page-break-after: always; position: relative; width: 8.5in; height: 11in }
    .page-content {
      position: absolute;
      width: 8.125in;
      height: 10.625in;
      left: 0.1875in;
      top: 0.1875in;
      background-color: rgba(0,0,0,0)
    }
    .text {
      position: relative;
      left: 55px;
      top: 407px;
      width: 7in;
      font-family: 'Merriweather';
      font-size: 11pt;
      line-height: 17pt
  }
    .texting {
      position: relative;
      left: 55px;
      top: 55px;
      width: 7in;
      font-family: 'Merriweather';
      font-size: 11pt;
      line-height: 17pt
  }
    .date { padding: 20px 0; text-align: right }
  </style>
  </head>
  <body>
  <div class="page">
  <div class="page-content">
  <div class="text">
  <div class="date">${date.toLocaleDateString("en-US", options)}
  </div>${messageBody.blocks
    .map((block) => {
      let HTML = ``
      if (howManyLinesHaveBeenWritten > 24 && pageNumber === 1) {
        pageNumber += 1
        howManyLinesHaveBeenWritten = 0
        HTML += `</div></div></div><div class="page"><div class="page-content"><div class="texting">`
      }
      if (howManyLinesHaveBeenWritten > 45 && pageNumber > 1) {
        pageNumber += 1
        howManyLinesHaveBeenWritten = 0
        HTML += `</div></div></div><div class="page"><div class="page-content"><div class="texting">`
      }
      HTML += `<p>${block.text}</p>`
      howManyLinesHaveBeenWritten += Math.ceil(block.text.length / charPerLine) + 1
      return HTML
    })
    .join("")}
    </div>
    </div>
    </div>
    </body>
    </html>
  `
}
