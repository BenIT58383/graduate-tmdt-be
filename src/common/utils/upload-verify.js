import multer from 'multer'
import config from '../config'
import path from 'path'

const acceptedExtensions = [config.ALLOW_FILE_EXTENSION]
const fileSize = config.MAX_FILE_SIZE * 1024
const fileLimmit = config.MAX_UPLOAD_FILE

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // cb(null, __dirname + "../../../tmp/my-uploads");
    console.log(path.join(process.cwd(), 'tmp', 'my-uploads'))
    cb(null, path.join(process.cwd(), 'tmp', 'my-uploads'))
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.xlsx')
  },
})

const multerVerify = multer({
  limits: {
    fileSize, // 250KB upload limit
    files: fileLimmit, // 1 file
  },
  dest: config.UPLOAD_DIR,
  storage: storage,
  fileFilter: (req, file, callback) => {
    // if the file extension is in our accepted list
    if (
      acceptedExtensions.some(extension =>
        file.originalname.toLowerCase().endsWith(`.${extension}`)
      )
    ) {
      return callback(null, true)
    }
    // otherwise, return error
    const error = new multer.MulterError()
    error.code = 'UPLOAD_WRONG_TYPE'
    return callback(error)
  },
})

const uploadVerify = fileUpload => multerVerify.single(fileUpload)

const uploadSingleFileMemoryStorage = fileName => {
  return multer({ storage: multer.memoryStorage() }).single(fileName)
}

const uploadMultipleFileMemoryStorage = fileName => {
  return multer({ storage: multer.memoryStorage() }).array(fileName, 5)
}

export default {
  uploadSingleFileMemoryStorage,
  uploadMultipleFileMemoryStorage,
  uploadVerify,
}
