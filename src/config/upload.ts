 import multer from 'multer';
import path from 'path';

const tempDir = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  diretory: tempDir,
  storage: multer.diskStorage({
    destination: tempDir,
    filename(request, file, callback) {
      return callback(null, file.originalname);
    },
  }),
};
