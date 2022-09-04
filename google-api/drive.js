require('dotenv').config();
const {google} = require('googleapis');
const { drive } = require('googleapis/build/src/apis/drive');
const fs = require('fs');
const path = require('path');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const imageFolderPath = path.join(__dirname, "../uploads");

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const googleDrive = google.drive({
    version: "v3",
    auth: oauth2Client
});

async function uploadImage(image){
    try {
        const imagePath = `${imageFolderPath}/${image.filename}`;
        console.log(fs.createReadStream(imagePath));
        
        const response = await googleDrive.files.create({
            requestBody: {
                name: image.filename,
                parents: ['12EomKIcHXWpRnhhGG6n-5bSbd4cTRoEe']
            },
            media: {
                mimeType: image.mimetype,
                body: fs.createReadStream(imagePath)
            }
        })
        return response.data;
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {uploadImage};