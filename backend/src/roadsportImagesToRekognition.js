"use strict";
const AWS = require("aws-sdk");
const parser = require("lambda-multipart-parser");

const s3Client = new AWS.S3();
const rekognition = new AWS.Rekognition();

async function saveFile(file) {
	try {
		console.log({ file });
		const bucket = process.env.ROADSPORT_BUCKET;
		console.log({ bucket });
		const savedFile = await s3Client
			.putObject({
				Bucket: bucket,
				Key: file.filename,
				Body: file.content,
			})
			.promise();
		const imageText = await rekognition
			.detectText({
				Image: {
					Bytes: file.content,
				},
			})
			.promise();
		return { savedFile, imageText };
	} catch (error) {
		console.error("Error saving file:", error);
		throw error;
	}
}

const roadsportImagesToRekognition = async (event) => {
	try {
		const { files } = await parser.parse(event);
		const savePromises = files.map(saveFile);
		const results = await Promise.all(savePromises);

		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(results),
		};
	} catch (error) {
		console.error("Error uploading image:", error);

		return {
			statusCode: 500,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				message: error,
			}),
		};
	}
};

module.exports = {
	handler: roadsportImagesToRekognition,
};
