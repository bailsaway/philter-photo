"use strict";
const AWS = require("aws-sdk");
const csv = require("csvtojson");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

const addData = async (params) => {
	console.log("Adding a new item based on: ");
	await dynamodb
		.put(params, function (err, data) {
			if (err) {
				console.error(
					"Unable to add item. Error JSON: ",
					JSON.stringify(err, null, 2)
				);
			} else {
				console.log("Added item: ", JSON.stringify(params.Item, null, 2));
			}
		})
		.promise();
};

const csvToDynamodb = async (event) => {
	const s3Event = event.Records[0].s3;
	const bucket = s3Event.bucket.name;
	const key = s3Event.object.key;
	console.log(`Bucket = ${bucket}; key = ${key}`);

	//grab csv file from S3 bucket
	const s3Stream = s3
		.getObject({
			Bucket: bucket,
			Key: key,
		})
		.createReadStream();

	csv()
		.fromStream(s3Stream)
		.on("data", (row) => {
			//read each row
			let jsonContent = JSON.parse(row);
			console.log(JSON.stringify(jsonContent));
			//push each row into DynamoDB
			let paramsToPush = {
				TableName: "CompetitorInfoTable",
				Item: {
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
			addData(paramsToPush);
		});
	return {
		statusCode: 200,
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			message: "Table updated",
		}),
	};
};

module.exports = {
	handler: csvToDynamodb,
};
