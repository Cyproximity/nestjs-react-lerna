import { existsSync, mkdir } from "fs";
import { extname } from "path";
import { promisify } from "util";

import { diskStorage } from "multer";
import { v4 as uuid } from "uuid";

interface IUser {
  id?: number;
}

const mkDirAsync = promisify(mkdir);

export const storage = diskStorage({
  destination: async (req, file, callback) => {
    let userdir = "./uploads";
    if (!existsSync(userdir)) {
      await mkDirAsync(userdir);
    }
    const user: IUser = req?.user;
    if (user && user.id) {
      userdir = `./uploads/${user.id}`;
      if (!existsSync(userdir)) {
        await mkDirAsync(userdir);
      }
    }
    callback(null, userdir);
  },
  filename: async (req, file, callback) => {
    callback(null, generateFilename(file));
  },
});

function generateFilename(file: Express.Multer.File) {
  return `${uuid()}${extname(file.originalname)}`;
}
