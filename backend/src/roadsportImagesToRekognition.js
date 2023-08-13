"use strict";
const AWS = require("aws-sdk");
const parser = require("lambda-multipart-parser");

const s3Client = new AWS.S3();

async function saveFile(file) {
	try {
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
	} catch (error) {
		console.error("Error saving file:", error);
		throw error; // Rethrow the error to be caught in the caller
	}
}

const roadsportImagesToRekognition = async (event) => {
	try {
		const { files } = await parser.parse(event);
		const savePromises = files.map(saveFile);
		await Promise.all(savePromises);

		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				message: "image uploaded",
				contentsUploaded: files[0],
			}),
		};
	} catch (error) {
		console.error("Error uploading image:", error);

		return {
			statusCode: 500,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				message: "Error uploading image",
			}),
		};
	}
};

module.exports = {
	handler: roadsportImagesToRekognition,
};
