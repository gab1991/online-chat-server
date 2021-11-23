import { BadRequestException, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomBytes } from 'crypto';
import { diskStorage } from 'multer';
import { extname } from 'path';

const ACCEPTABLE_IMG_TYPES = ['image/jpeg', 'image/png'];

interface IImgSaverProps {
  fieldName?: string;
  dest?: string;
}

export const ImgSaver = (props: IImgSaverProps): MethodDecorator & ClassDecorator => {
  const { fieldName = 'file', dest = '' } = props;

  return UseInterceptors(
    FileInterceptor(fieldName, {
      storage: diskStorage({
        destination: `public/${dest}`,
        filename: (req, file, cb) => {
          const fileName = `${randomBytes(10).toString('hex')}${extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (ACCEPTABLE_IMG_TYPES.includes(file.mimetype)) {
          return cb(null, true);
        }
        return cb(new BadRequestException(`image has to be of types:${ACCEPTABLE_IMG_TYPES.join(' ')}`), false);
      },
    })
  );
};
