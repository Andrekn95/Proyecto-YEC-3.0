import * as path from 'path';

export const getFileName = (req, file, callback) => {
  const fileExtName = path.extname(file.originalname);

  callback(null, `${Date.now()}${fileExtName}`);
};

export const imageFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(new Error('Solo jpg|jpeg|png estos tipos están permitidos!'), false);
  }
  callback(null, true);
};

export const fileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(pdf|doc|docx|ppt|pptx|pptm|xlsx|xls|jpg|jpeg|png)$/)) {
    return callback(
      new Error(
        'Solo pdf|doc|docx|ppt|pptx|pptm|xlsx|xls|jpg|jpeg|png estos tipos están permitidos!',
      ),
      false,
    );
  }
  callback(null, true);
};

export const excelFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(xlsx|xls)$/)) {
    return callback(new Error('Solo xlsx|xls estos tipos están permitidos!'), false);
  }
  callback(null, true);
};
