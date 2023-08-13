"use strict";
const AWS = require("aws-sdk");

const getCompetitors = async (event) => {
	const dynamodb = new AWS.DynamoDB.DocumentClient();

	let competitors;

	try {
		const result = await dynamodb
			.scan({ TableName: "CompetitorInfoTable" })
			.promise();
		competitors = result.Items;
	} catch (error) {
		console.log(error);
	}

	return {
		statusCode: 200,
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			message: "All competitors returned",
			allCompetitors: competitors,
		}),
	};
};

module.exports = {
	handler: getCompetitors,
};
