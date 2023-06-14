import multer from 'multer';
import path from 'path';
import { __dirname } from '../utilities.js';

// función para generar el nombre de archivo único
const generateUniqueFileName = (file,userID) => {
    const timestamp = Date.now();
    const randomSuffix = Math.round(Math.random() * 1e6);
    const extension = path.extname(file.originalname);
    return `${file.fieldname}-${timestamp}-${userID}-${randomSuffix}${extension}`;
};

// opciones de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = '';

        if (file.fieldname === 'product') {
            uploadPath = path.join(__dirname, 'public/documents/product');
        } else if (file.fieldname === 'profile') {
            uploadPath = path.join(__dirname, 'public/documents/profile');
        } else if (file.fieldname === 'identificacion' ||
            file.fieldname === 'domicilio' ||
            file.fieldname === 'cuentaStatus') {
            uploadPath = path.join(__dirname, 'public/documents/document');
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const userID = req.params.uid
        const uniqueFileName = generateUniqueFileName(file,userID);
        cb(null, uniqueFileName);
    },
});

const upload = multer({ storage });

export { upload };
