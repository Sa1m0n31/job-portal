export class FileUploadHelper {
    static customFileName(req, file, cb) {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
        let fileExtension = "";
        if(file.mimetype.indexOf("jpeg") > -1){
            fileExtension = "jpg"
        }
        else if(file.mimetype.indexOf("png") > -1){
            fileExtension = "png";
        }
        else if(file.mimetype.indexOf('svg') > -1) {
            fileExtension = 'svg';
        }
        else if(file.mimetype.indexOf('pdf') > -1) {
            fileExtension = 'pdf';
        }
        else if(file.mimetype.indexOf('text') > -1) {
            fileExtension = 'txt';
        }
        else if(file.mimetype.indexOf('pages') > -1) {
            fileExtension = 'pages';
        }
        else if(file.mimetype.indexOf('docx') > -1) {
            fileExtension = 'docx';
        }

        const originalName = file.originalname.split(".")[0];
        cb(null, originalName + '-' + uniqueSuffix+"."+fileExtension);
    }
}
