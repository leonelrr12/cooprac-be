const aws = require("aws-sdk")
const { S3Client } = require("@aws-sdk/client-s3")
const fs = require('fs')

const { AWS_Access_key_ID, AWS_Secret_access_key, AWS_BUCKET_NAME, AWS_BUCKET_REGION } = process.env
const REGION = AWS_BUCKET_REGION
const s3Client = new S3Client({ region: REGION });

const s3 = new aws.S3({
  region: AWS_BUCKET_REGION,
  accessKeyId: AWS_Access_key_ID,
  secretAccessKey: AWS_Secret_access_key
})

const uploadFile = async (file, entity_f, nameImage, id) => {
  const fileStream = fs.createReadStream(file.path)
  const extSplit = file.filename.split('.')
  // console.log(file.filename, extSplit)
  let ext = 'jpeg'
  if (extSplit.length > 1) {
    ext = extSplit[extSplit.length - 1]
  }
  const uploadParams = {
    Bucket: AWS_BUCKET_NAME + "/" + entity_f + "/" + nameImage, 
    Body: fileStream,
    Key: id + '.' + ext
  }
  return await s3.upload(uploadParams).promise()

  // const params = {
  //   Bucket: AWS_BUCKET_NAME + "/" + entity_f + "/" + nameImage, 
  //   Key: id+'.'+ext,
  //   Body: fileStream,
  // }

  // try {
  //   const results = await s3Client.send(new PutObjectCommand(params));
  //   console.log(results);
  //   return results; // For unit tests.
  // } catch (err) {
  //   console.log("Error", err);
  // }
}

const uploadFile2 = async (file, entity_f, nameImage, id) => {
  const fileStream = fs.createReadStream(file)
  const uploadParams = {
    Bucket: AWS_BUCKET_NAME + "/" + entity_f + "/" + nameImage,
    Body: fileStream,
    Key: id
  }

  return await s3.upload(uploadParams).promise()
}


const uploadFile2a = (file, entity_f, nameImage, id) => {
  return new Promise( async (resolve, reject) => {
    const fileStream = fs.createReadStream(file)
    const uploadParams = {
      Bucket: AWS_BUCKET_NAME + "/" + entity_f + "/" + nameImage,
      Body: fileStream,
      Key: id
    }
    resolve(await s3.upload(uploadParams).promise())
  })
}

module.exports = { uploadFile, s3, uploadFile2, uploadFile2a }