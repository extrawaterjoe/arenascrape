import fs from 'fs'
import path from 'path'
import https from 'https'
import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
import { Image, createCanvas } from 'canvas'
import fetch from 'node-fetch'
;(async () => {
  const canvas = createCanvas(595, 842)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, 595, 842)

  const res = await fetch('https://api.are.na/v2/channels/extra-water?page=1&amp;per=50')
  const data = await res.json()

  const images = data.contents
    .filter((item) => item.class === 'Image')
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)

  images.forEach((image, index) => {
    const fileName = String(index) + '.png'
    const filePath = path.join(__dirname, 'source', fileName)
    const file = fs.createWriteStream(filePath)
    const request = https.get(image.image.large.url, (response) => {
      response.pipe(file)
    })
  })

  setTimeout(() => {
    const files = fs.readdirSync(path.join(__dirname, 'source'))
    files.forEach((file, index) => {
      const img = new Image()
      img.src = path.join(__dirname, 'source', file)

      // draw images on to ctx canvas in a 2x2 grid with margin
      ctx.drawImage(img, (index % 2) * 300, Math.floor(index / 2) * 300)

      canvas.toBuffer((err, buffer) => {
        fs.writeFileSync(path.join(__dirname, 'output', 'output.png'), buffer)
      })
    })
  }, 9000)
})()
