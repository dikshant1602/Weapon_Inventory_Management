import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'

cloudinary.config({
    cloud_name: 'dzjaru1un',
    api_key: 876831381437172,
    api_secret: 'JUwK2XaKYx0zlPdx5tRtefwk9pQ'
})

const uploadToCloudinary = async (localFilePath) => {
    try {


        if (!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });

        fs.unlinkSync(localFilePath);
        return response

    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log(error);
        return null;
    }
}


export { uploadToCloudinary }