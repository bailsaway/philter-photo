# PhilterPhoto

Organise race car photos using AWS Rekognition based on predefined criteria and push to DropBox

### Existing Workflow for Replacing

1. Photos are taken of all testing, quali and races on a weekend on one SD card
2. Photos are then sorted in Adobe Lightroom into folders based on championship. During this, photos are also filtered out based on quality etc
3. Photo files are tagged with the meta data "keyword" of the driver's surname, comma separated if there's more than one driver per shot
4. Photos are then grouped into folders based on driver surname
5. Folders uploaded to DropBox and shared with driver
   Note that many pictures of race cars have family and friends of the drivers, so there is a need for the manual grouping.

### How will PhilterPhoto Work?

This is designed to support the existing workflow and to not replace it. This may come in time.

1. Photos are taken of all testing, quali and races on a weekend on one SD card
2. Photos are then sorted in Adobe Lightroom into folders based on **championship**. During this, photos are also filtered out based on quality etc
3. The _folder_ of photos grouped by championship are uploaded via browser
4. Folder is zipped and uploaded to S3 via multipart upload & presigned URLs
5. AWS Rekognition TextLabels examines photos against a DynamoDB of driver information
6. Each photo is keyword tagged in the metadata with the driver surnames (comma separated as necessary)
7. WebHook listens for processing completion and files are downloaded to the local client as a single zip with one sub-folder for "_unknown_"
8. Photographer reimports to Adobe Lightroom as the keyworded files are reused for other creative purposes

### CRUD DynamoDB database

1. CSV upload for initial processing
2. CRUD endpoints for editing individual document data
3. Available via UI

## Stack

1. AWS Lambda
2. AWS DynamoBD
3. Serverless cloudformation framework
4. React UI leveraging AWS Amplify
5. AWS S3
6. AWS Rekognition

## Get Started:

Run from backend
`sls deploy --verbose`

update a lambda function hander
`sudo sls deploy -f <name of function>`

## Useful Videos for reference

1. "<https://blogs.perficient.com/2018/12/21/populating-a-dynamodb-table-based-on-a-csv-file/>"
2. "<https://moduscreate.com/blog/upload-files-to-aws-s3-using-a-serverless-framework/>"
3. "<https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpu-upload-object.html>"
4. "<https://www.youtube.com/watch?v=fgG2HQWNelI>"
5. "<https://aws.amazon.com/blogs/compute/uploading-large-objects-to-amazon-s3-using-multipart-upload-and-transfer-acceleration/>"

Some notes: ?folder nomenclature
uploading: championship_track_year_session
where session = testing 1 - 6; quali; race 1 - 4
