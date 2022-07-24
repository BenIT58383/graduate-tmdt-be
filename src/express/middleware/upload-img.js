const mkdirp = require("mkdirp");
const multer = require("multer");

const uploadImage = (type, kind) => {
  // const made = mkdirp.sync(`./src/public/images/${type}`);
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./src/images`); // setup chổ cần lưu file
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname); // đặt lại tên cho file
    },
  });
  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      const extensionImageList = [".png", ".jpg", ".PNG", ".JPG", ".MKV"];
      const extension = file.originalname.slice(-4);
      const check = extensionImageList.includes(extension);
      if (check) {
        cb(null, true);
      } else {
        cb(new Error("extension không hợp lệ"));
      }
    },
  });
  if (kind && kind === 'array') {
    return upload.array(type);
  } else {
    return upload.single(type);
  }
};

module.exports = {
  uploadImage,
};
