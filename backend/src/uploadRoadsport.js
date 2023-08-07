"use strict";
const AWS = require("aws-sdk");
const parser = require("lambda-multipart-parser");

const s3Client = new AWS.S3();

async function saveFile(file) {
	console.log({ file });
	const bucket = process.env.ROADSPORT_BUCKET;
	console.log(bucket);
	const savedFile = await s3Client
		.putObject({
			Bucket: bucket,
			Key: file.filename,
			Body: file.content,
		})
		.promise();
	return savedFile;
}

const uploadRoadsport = async (event) => {
	const { files } = await parser.parse(event);
	try {
		files.forEach(saveFile);
	} catch (error) {
		console.log(error);
	}

	return {
		statusCode: 200,
		body: JSON.stringify({
			message: "Photos uploaded",
			input: await parser.parse(event),
		}),
	};
};

module.exports = {
	handler: uploadRoadsport,
};
