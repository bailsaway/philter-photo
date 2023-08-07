"use strict";
const AWS = require("aws-sdk");
//use node.js built in crypto module as AWS doesn't like uuid
const { randomUUID } = require("crypto");

const updateCompetitor = async (event) => {
	const dynamodb = new AWS.DynamoDB.DocumentClient();
	const { id } = event.pathParameters;
	let competitor;

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

	await dynamodb
		.update({
			TableName: "CompetitorInfoTable",
			Key: { id },
			UpdateExpression:
				"set championship = :championship, raceNumber = :raceNumber, firstName= :firstName, surname= :surname, primaryColour= :primaryColour, frontPlate1= :frontPlate1, frontPlate2= :frontPlate2, rearPlate1= :rearPlate1, rearPlate2= :rearPlate2, nonChampionshipBrandingText= :nonChampionshipBrandingText, dropboxUrl= :dropboxUrl",
			ExpressionAttributeValues: {
				":championship": championship,
				":raceNumber": raceNumber,
				":firstName": firstName,
				":surname": surname,
				":primaryColour": primaryColour,
				":frontPlate1": frontPlate1,
				":frontPlate2": frontPlate2,
				":rearPlate1": rearPlate1,
				":rearPlate2": rearPlate2,
				":nonChampionshipBrandingText": nonChampionshipBrandingText,
				":dropboxUrl": dropboxUrl,
			},
			ReturnValues: "ALL_NEW",
		})
		.promise();

	return {
		statusCode: 200,
		body: JSON.stringify({
			message: "Competitor modified",
		}),
	};
};

module.exports = {
	handler: updateCompetitor,
};
