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

const uploadCSV = async (event) => {
	try {
		const { files } = await parser.parse(event);
		const savePromises = files.map(saveFile);
		await Promise.all(savePromises);

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: "CSV uploaded",
				contentsUploaded: files[0],
			}),
		};
	} catch (error) {
		console.error("Error uploading CSV:", error);

		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "Error uploading CSV",
			}),
		};
	}
};

module.exports = {
	handler: uploadCSV,
};
