"use strict";
const AWS = require("aws-sdk");
const csv = require("csvtojson");
const { randomUUID } = require("crypto");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

const addData = async (params) => {
	console.log("addData function ran");
	try {
		await dynamodb.put(params).promise();
		console.log("Added item:", JSON.stringify(params.Item, null, 2));
	} catch (error) {
		console.error("Unable to add item. Error:", JSON.stringify(error, null, 2));
	}
};

const csvToDynamodb = async (event) => {
	const s3Event = event.Records[0].s3;
	const bucket = s3Event.bucket.name;
	const key = s3Event.object.key;

	//grab csv file from S3 bucket
	const s3Stream = s3
		.getObject({
			Bucket: bucket,
			Key: key,
		})
		.createReadStream();

	await csv()
		.fromStream(s3Stream)
		.on("data", (row) => {
			//read each row
			let jsonContent = JSON.parse(row);
			let id = jsonContent.id !== "" ? jsonContent.id : randomUUID();
			console.log("Each Row parsed", JSON.stringify(jsonContent));

			//each row into DynamoDB
			let paramsToPush = {
				TableName: "CompetitorInfoTable",
				Item: {
					id: id,
					championship: jsonContent.championship,
					raceNumber: jsonContent.raceNumber,
					firstName: jsonContent.firstName,
					surname: jsonContent.surname,
					primaryColour: jsonContent.primaryColour,
					frontPlate1: jsonContent.frontPlate1,
					frontPlate2: jsonContent.frontPlate2,
					rearPlate1: jsonContent.rearPlate1,
					rearPlate2: jsonContent.rearPlate2,
					nonChampionshipBrandingText: jsonContent.nonChampionshipBrandingText,
					dropboxUrl: jsonContent.dropboxUrl,
				},
			};
			console.log("ParamsToPush: ", JSON.stringify(paramsToPush));
			addData(paramsToPush);
		});
};

module.exports = {
	handler: csvToDynamodb,
};
