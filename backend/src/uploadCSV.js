"use strict";
const AWS = require("aws-sdk");
const parser = require("lambda-multipart-parser");

const s3Client = new AWS.S3();

async function saveFile(file) {
	console.log({ file });
	const bucket = process.env.COMPETITOR_CSV_BUCKET;
	console.log({ bucket });
	const savedFile = await s3Client
		.putObject({
			Bucket: bucket,
			Key: file.filename,
			Body: file.content,
		})
		.promise();
	return savedFile;
}

const uploadCSV = async (event) => {
	const { files } = await parser.parse(event);
	files.forEach(saveFile);

	return {
		statusCode: 200,
		body: JSON.stringify({
			message: "CSV uploaded",
			contentsUploaded: files[0],
		}),
	};
};

module.exports = {
	handler: uploadCSV,
};
