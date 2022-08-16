import { UnsupportedMediaTypeException } from '@nestjs/common';

export const fileExtensionFilter = (
    req: any,
    file,
    callback: (error: Error, acceptFile: boolean) => any,
) => {
    if(!(file.mimetype.indexOf("jpeg") > -1) &&
        !(file.mimetype.indexOf("jpg") > -1) &&
        !(file.mimetype.indexOf("text") > -1) &&
        !(file.mimetype.indexOf("pages") > -1) &&
        !(file.mimetype.indexOf("png") > -1) &&
        !(file.mimetype.indexOf('svg') > -1) &&
        !(file.mimetype.indexOf('pdf') > -1) &&
        !(file.mimetype.indexOf('docx') > -1)
    ){
        callback(
            new UnsupportedMediaTypeException('Dozwolone są tylko pliki w następujących formatach: jpg, txt, pages, png, svg, pdf, docx'),
            false,
        );
    }

    callback(null, true);
};
