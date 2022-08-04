import multer from 'multer'
import fs from 'fs'
import path from 'path'
import DatauriParser from 'datauri/parser'
import { appConfig } from './../../config'

const multerDiskStorage = multer.diskStorage({
  /**
   * Destination
   * @param req Request
   * @param file File data
   * @param cb Callback
   */
  destination: function (req, file, cb) {
    const { idEmployee } = req.body
    const dir = `${appConfig.DOCUMENT_PATH}/${idEmployee}`

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    cb(null, dir)
  },
  /**
   * Filename
   * @param req Request
   * @param file File data
   * @param cb Callback
   */
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`

    req.body.url = fileName

    cb(null, fileName)
  }
})

const diskStorage = multer({ storage: multerDiskStorage }).single('file')

const multerMemoryStorage = multer.memoryStorage()

const memoryStorage = multer({ storage: multerMemoryStorage }).single('file')

/**
 * Convert buffer to data url
 * @param {any} req the field object
 * @returns {String} The data url from the string buffer
 */
const dataUri = (req: any): string => {
  const parser = new DatauriParser()
  const format = parser.format(path.extname(req.file.originalname).toString(), req.file.buffer)

  return format.content
}

export {
  diskStorage,
  memoryStorage,
  dataUri
}
