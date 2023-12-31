"use strict";
const parser = require("lambda-multipart-parser");
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");
const {
	CreateMultipartUploadCommand,
	UploadPartCommand,
	CompleteMultipartUploadCommand,
	AbortMultipartUploadCommand,
	S3Client,
} = require("@aws-sdk/client-s3");

//Define  size of the parts in bytes for the multipart upload
const twentyFiveMB = 25 * 1024 * 1024;

//Generate a string of a specified size filled with the character "x".
//This function is used to create the content for each part of the multipart upload.
const createString = (size = twentyFiveMB) => {
	return "x".repeat(size);
};

const s3Client = new S3Client({});
const bucketName = process.env.ROADSPORT_BUCKET;

//create a key that is human-readable based naming format: `${championship}_${track}_${year}_${session}`
const { files } = await parser.parse(event);
const uploadedZipName = files[0].filename;

const key = uploadedZipName;
const str = createString();
const buffer = Buffer.from(str, "utf8");

//The main asynchronous function that performs the multipart upload process.
const awsMultiPartUploader = async (event) => {
	let uploadId;

	try {
		const multipartUpload = await s3Client.send(
			new CreateMultipartUploadCommand({
				Bucket: bucketName,
				Key: key,
			})
		);

		uploadId = multipartUpload.UploadId;

		const uploadPromises = [];
		// Multipart uploads require a minimum size of 5 MB per part.
		const partSize = Math.ceil(buffer.length / 5);

		// Upload each part.
		for (let i = 0; i < 5; i++) {
			const start = i * partSize;
			const end = start + partSize;
			uploadPromises.push(
				s3Client
					.send(
						new UploadPartCommand({
							Bucket: bucketName,
							Key: key,
							UploadId: uploadId,
							Body: buffer.subarray(start, end),
							PartNumber: i + 1,
						})
					)
					.then((d) => {
						console.log("Part", i + 1, "uploaded");
						return d;
					})
			);
		}

		const uploadResults = await Promise.all(uploadPromises);

		return await s3Client.send(
			new CompleteMultipartUploadCommand({
				Bucket: bucketName,
				Key: key,
				UploadId: uploadId,
				MultipartUpload: {
					Parts: uploadResults.map(({ ETag }, i) => ({
						ETag,
						PartNumber: i + 1,
					})),
				},
			})
		);

		// Verify the output by downloading the file from the Amazon Simple Storage Service (Amazon S3) console.
		// Because the output is a 25 MB string, text editors might struggle to open the file.
	} catch (err) {
		console.error(err);

		if (uploadId) {
			const abortCommand = new AbortMultipartUploadCommand({
				Bucket: bucketName,
				Key: key,
				UploadId: uploadId,
			});

			await s3Client.send(abortCommand);
		}
	}
};

module.exports = {
	handler: awsMultiPartUploader,
};
