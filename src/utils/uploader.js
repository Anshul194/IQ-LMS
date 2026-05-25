import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Standard storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName = file.originalname
            .replace(fileExt, "")
            .toLowerCase()
                .split(" ")
                .join("-") + "-" + Date.now();
        cb(null, fileName + fileExt);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        const types = /jpeg|jpg|png|pdf/;
        const extName = types.test(path.extname(file.originalname).toLowerCase());
        const mimeType = types.test(file.mimetype);

        if (extName && mimeType) {
            cb(null, true);
        } else {
            cb(new Error("Only .png, .jpg, .jpeg and .pdf format allowed!"));
        }
    }
});

export default upload;
