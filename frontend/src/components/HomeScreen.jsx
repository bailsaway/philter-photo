import { Link } from "react-router-dom";

function HomeScreen() {
	return (
		<>
			<h1>Welcome to PhilterPhoto</h1>
			<p>
				This website has been built specifically for{" "}
				<a href="http://www.snappyracers.com/">SnappyRacer</a> in support of the
				following workflow:
			</p>
			<ul className="list-group list-group-flush">
				<li className="list-group-item">
					Photos are taken of all track sessions: testing; qualification and
					races over a weekend on the one SD card
				</li>
				<li className="list-group-item">
					Photos are then sorted in Adobe LightRoom into folders based on
					Championship. During this, photos are also filtered out based on
					quality etc
				</li>
				<li className="list-group-item">
					A folder of photos grouped by Championship is uploaded to
					PhilterPhotos <Link to="/philter">here</Link>
				</li>
				<li className="list-group-item">
					The folder is zipped and uploaded to London-based{" "}
					<a href="https://aws.amazon.com/s3/">AWS S3</a> via multipart upload &
					presigned URLs
				</li>
				<li className="list-group-item">
					<a href="https://aws.amazon.com/rekognition/">AWS Rekognition</a>{" "}
					examines each photo against a{" "}
					<a href="https://aws.amazon.com/dynamodb/">DynamoDB</a> of competitor
					information
				</li>
				<li className="list-group-item">
					The database of competitors can be managed and maintained from{" "}
					<Link to="/competitors">here</Link>
				</li>
				<li className="list-group-item">
					Each photo is keyword tagged in the metadata with the drivers'
					surnames, separated with commas as necessary
				</li>
				<li className="list-group-item">
					WebHooks listen for the completion of processing, providing a URL for
					downloading a single zip with one sub-folder for photos which have
					been unsuccessfully parsed.
				</li>
				<li className="list-group-item">
					SnappyRacer reimports the downloaded photos into Adobe LightRoom
				</li>
			</ul>
		</>
	);
}

export default HomeScreen;
