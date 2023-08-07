"use strict";
const AWS = require("aws-sdk");

const getACompetitor = async (event) => {
	const dynamodb = new AWS.DynamoDB.DocumentClient();
	const { id } = event.pathParameters;
	let competitor;

	try {
		const result = await dynamodb
			.get({ TableName: "CompetitorInfoTable", Key: { id } })
			.promise();
		competitor = result.Item;
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
			message: "Specific competitor returned",
			competitor,
		}),
	};
};

module.exports = {
	handler: getACompetitor,
};
