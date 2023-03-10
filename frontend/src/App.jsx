import "./App.css"
import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/Home/HomePage"
import RoomPage from "./pages/Room/RoomPage"
import ProfilePage from "./pages/Profile/ProfilePage"
// import UserInfo from "./pages/Profile/Info/UserInfo"
// import GraphInfo from "./pages/Profile/GraphInfo/GraphInfo"
import RoomResult from "./pages/Result/RoomResult"
import SignParentPage from "./pages/Sign/SignParentPage"
import NotFound from "./pages/NotFound/NotFound"
import DoorParentPage from "./pages/Door/DoorParentPage"
import axios from "axios"
import OauthLoad from "./pages/OauthLoad/OauthLoad"
import { useEffect } from "react"
import Modal from "./components/UI/Modal"

axios.defaults.baseURL = "https://i8a105.p.ssafy.io/api"
// axios.defaults.transformRequest = []

function App() {
  useEffect(function () {
    if (localStorage.getItem("Access") && localStorage.getItem("Refresh")) {
      axios.defaults.headers.common["AccessToken"] =
        localStorage.getItem("Access")
      axios.defaults.headers.common["RefreshToken"] =
        localStorage.getItem("Refresh")
    }
  }, [])
  return (
    <div className="App">
      <Modal />
      <Routes>
        <Route path={`/`} element={<HomePage />} />
        <Route path={`/sign`} element={<SignParentPage />} />
        <Route path={`/room`} element={<RoomPage />} />
        <Route path={`/result`} element={<RoomResult />} />
        <Route path={`/profile`} element={<ProfilePage />} />
        <Route path={`/profile/:infoType`} element={<ProfilePage />} />
        <Route path={`/door`} element={<DoorParentPage />} />
        <Route path={`/manage`} element />
        <Route path={`/oauth`} element={<OauthLoad />} />
        <Route path={`*`} element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
