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

	// const newCompetitor = {
	// 	id,
	// 	championship,
	// 	raceNumber,
	// 	firstName,
	// 	surname,
	// 	primaryColour,
	// 	frontPlate1,
	// 	frontPlate2,
	// 	rearPlate1,
	// 	rearPlate2,
	// 	nonChampionshipBrandingText,
	// 	dropboxUrl,
	// };

	return {
		statusCode: 200,
		body: JSON.stringify({
			message: "All competitors returned",
			allCompetitors: competitors,
		}),
	};
};

module.exports = {
	handler: getCompetitors,
};
