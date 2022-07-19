const mkdirp = require("mkdirp");
const multer = require("multer");

const uploadImage = (type, kind) => {
  console.log(77777777, type);
  const made = mkdirp.sync(`./public/images/${type}`);
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(6666666, kind);
      cb(null, `./public/images/${type}`); // setup chổ cần lưu file
      console.log(555555555555, type);
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
  console.log(9999999, type);
  if (kind && kind === 'array') {
    return upload.array(type);
  } else {
    return upload.single(type);
  }
};

module.exports = {
  uploadImage,
};
