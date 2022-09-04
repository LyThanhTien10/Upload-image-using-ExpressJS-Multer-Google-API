require('dotenv').config();
const express = require('express');
const multerMiddleware = require("./multer");
const {uploadImage} = require('./google-api/drive');
const PORT = process.env.PORT || 5000;
const path = require('path');
const app = express();

app.get('/',(req, res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', multerMiddleware.upload.single('images'), async(req, res)=>{
    const image = req.file;
    if (!image){
        return res.json({
            "message": "Upload error"
        });
    }
    const driveImage = await uploadImage(image);
    console.log(driveImage);
    res.json({"imageId": driveImage.id});
});

app.listen(PORT, ()=>{
    console.log(`App is running on PORT: ${PORT}`);
});