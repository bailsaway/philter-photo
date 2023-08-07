"use strict";
const AWS = require("aws-sdk");
//use node.js built in crypto module as AWS doesn't like uuid
const { randomUUID } = require("crypto");

const addCompetitor = async (event) => {
	const dynamodb = new AWS.DynamoDB.DocumentClient();
	const {
		championship,
		raceNumber,
		firstName,
		surname,
		primaryColour,
		frontPlate1,
		frontPlate2,
		rearPlate1,
		rearPlate2,
		nonChampionshipBrandingText,
		dropboxUrl,
	} = JSON.parse(event.body);
	const id = randomUUID();

	console.log("DB ID", id);

	const newCompetitor = {
		id,
		championship,
		raceNumber,
		firstName,
		surname,
		primaryColour,
		frontPlate1,
		frontPlate2,
		rearPlate1,
		rearPlate2,
		nonChampionshipBrandingText,
		dropboxUrl,
	};

	await dynamodb
		.put({
			TableName: "CompetitorInfoTable",
			Item: newCompetitor,
		})
		.promise();

	return {
		statusCode: 200,
		body: JSON.stringify({
			message: "New competitor successfully added",
			competitorAdded: newCompetitor,
		}),
	};
};

module.exports = {
	handler: addCompetitor,
};
