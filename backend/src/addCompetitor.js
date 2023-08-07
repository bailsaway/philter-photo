"use strict";
const { v4 } = require("uuid");
const aws = require("aws-sdk");

const addCompetitor = async (event) => {
	const dynamodb = AWS.dynamodb.DocumentClient();
	const { competitor } = JSON.parse(event.body);
	const id = v4;

	console.log("this is an ID:", id);

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

	await dynamodb.put({
		TableName: "CompetitorInfoTable",
		Item: newCompetitor,
	});

	return {
		statusCode: 200,
		body: JSON.stringify(
			{
				message: "Go Serverless v1.0! Your function executed successfully!",
				competitorAdded: newCompetitor,
				input: event,
			},
			null,
			2
		),
	};
};

module.exports = {
	handler: addCompetitor,
};
