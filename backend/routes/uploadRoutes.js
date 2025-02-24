import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();
// fie  solo tendra la informacion del archivo subido como imagen
const storage = multer.diskStorage({
    destination : function(req , file, cb){
        cb(null, 'uploads/')
    },

    filename : function(req, file, cb){
        cb(null, `${file.originalname.split('.')[0]}-${Date.now()}${path.extname(file.originalname)}`)
    }
})


function checkTypeFile(file, cb){ //test prueba si una cadena coincide con el patron de la expresion regular
    const filetypes = /jpeg|jpg|png/ // expresion regular que especifica los tipos de archivos permitidos
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype) // mimetype: image/jpeg

    if (extname && mimetype){
        return cb(null, true)
    } else {
        cb('Error: Images only')
    }
}

const upload = multer({
    storage,
    fileFilter : function(req, file, cb){
        checkTypeFile(file , cb)
    }
})

router.post('/', upload.single('image'), (req , res)=> {
    res.json({
        message: 'File uploaded successfully',
        image: `/${req.file.path}`
    });
})

export default router;