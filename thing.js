//something about presigned URLs

const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");
const { S3Client } = require("@aws-sdk/client-s3");
const s3Client = new S3Client({});
const bucketName = process.env.ROADSPORT_BUCKET;
//create a key that is human-readable based naming format: `${championship}_${track}_${year}_${session}`
const { files } = await parser.parse(event);
const uploadedZipName = files[0].filename;
const key = uploadedZipName;
const str = createString();
const buffer = Buffer.from(str, "utf8");

//*break**/

const createPostUrl = async (event) => {
	const client = new S3Client(clientParams);
	const { url, fields } = await createPresignedPost(client, {
		Bucket: bucketName,
		Key: key,
		Expires: 600, //Seconds before the presigned post expires. 3600 by default.
	});
	return {
		statusCode: 200,
		body: JSON.stringify(
			{
				url,
				fields,
			},
			null,
			2
		),
	};
};
