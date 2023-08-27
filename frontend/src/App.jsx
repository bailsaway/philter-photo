import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import HomeScreen from "./components/HomeScreen.jsx";
import CompetitorPage from "./components/CompetitorPage.jsx";
import UploadPhotosPage from "./components/UploadPhotosPage.jsx";

//Link component allows for clicking like on a nav bar

function App() {
	return (
		<>
			<NavBar />
			<Routes>
				<Route path="/" element={<HomeScreen />} />
				<Route path="/competitors" element={<CompetitorPage />} />
				<Route path="/philter" element={<UploadPhotosPage />} />
			</Routes>
		</>
	);
}

export default App;
