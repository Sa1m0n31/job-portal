import { UnsupportedMediaTypeException } from '@nestjs/common';

export const fileExtensionFilter = (
    req: any,
    file,
    callback: (error: Error, acceptFile: boolean) => any,
) => {
    console.log(file);

    if(!(file.mimetype.indexOf("jpeg") > -1) &&
        !(file.mimetype.indexOf("jpg") > -1) &&
        !(file.mimetype.indexOf("text") > -1) &&
        !(file.mimetype.indexOf("pages") > -1) &&
        !(file.mimetype.indexOf("png") > -1) &&
        !(file.mimetype.indexOf('svg') > -1) &&
        !(file.mimetype.indexOf('pdf') > -1)
    ){
        callback(
            new UnsupportedMediaTypeException('Only excel files are allowed'),
            false,
        );
    }

    callback(null, true);
};
