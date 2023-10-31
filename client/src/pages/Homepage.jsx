import React, { useState, useEffect } from "react"
import axios from 'axios'
import jwt_decode from "jwt-decode"
import { useNavigate } from 'react-router-dom'
import imageCon from "../Assets/balaikota.jpg"
import logo from "../Assets/diskominfo.png"
// import icon from "../Assets/icon.png"
import penugasan from "../Assets/image_Buat Penugasan.svg"
import peserta from "../Assets/image_Peserta magang.svg"
import statistik from "../Assets/image_Statistik.svg"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "../Components/SideBar/Style.css"
import './Homestyle.css'
import { TabTitle } from "../TabName"


const Homepage = () => {
  TabTitle('Homepage');
  const [nama, setNama] = useState('');
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(true);

  useEffect(() => {
    refreshToken();
  })

  const refreshToken = async () => {
    try {
      const response = await axios.get('https://api.diskominfo-smg-magang.cloud/account/token');
      const decoded = jwt_decode(response.data.token);
      setNama(decoded.nama);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  }


  return (
    <div className="body-main">
      <div className={`body-area${showNav ? " body-pd" : ""}`}>
        <header className={`header${showNav ? " body-pd" : ""}`}>
          <div className="header_toggle">
            <i
              className={`bi ${showNav ? "bi-x" : "bi-list"}`}
              onClick={() => setShowNav(!showNav)}
            />
          </div>
          <div className="header_img">
            <img
              src="https://reqres.in/img/faces/5-image.jpg"
              alt=""
            />
          </div>
        </header>
        <div className={`l-navbar${showNav ? " show" : ""}`}>
          <nav className="nav">
            <div>
              <a
                href="/homepage"
                target="_self"
                className="nav_logo"
              >
                {showNav ? (
                  <img src={logo} alt="" style={{ width: '150px', height: 'auto' }} />
                ) : (
                  <i className="bi bi-border-width nav_logo-icon" />
                )}
              </a>
              <div className="nav_list">
                <a
                  href="homepage"
                  target="_self"
                  className="nav_link"
                >
                  <i className="bi bi-house nav_icon" />
                  <span className="nav_name">Home</span>
                </a>
                <a href="admin" target="_self" className="nav_link">
                  <i className="bi bi-person-check-fill nav_icon" />
                  <span className="nav_name">Admin</span>
                </a>
                <a
                  href="peserta"
                  target="_self"
                  className="nav_link"
                >
                  <i className="bi bi-person nav_icon" />
                  <span className="nav_name">Peserta</span>
                </a>
                <a
                  href="presensi"
                  target="_self"
                  className="nav_link"
                >
                  <i className="bi bi-person-check nav_icon" />
                  <span className="nav_name">Presensi Magang</span>
                </a>
                <a
                  href="penugasan"
                  target="_self"
                  className="nav_link"
                >
                  <i className="bi bi-list-task nav_icon" />
                  <span className="nav_name">Penugasan</span>
                </a>
              </div>
            </div>
            <a
              href="/"
              target="_self"
              className="nav_link"
            >
              <i className="bi bi-box-arrow-left nav_icon" />
              <span className="nav_name">SignOut</span>
            </a>
          </nav>
        </div>
        <div className="pt-4 pb-4">
          <div className="homepage-container">
            <div className="image-container">
              <img className="background-home" src={imageCon} alt='' />
            </div>
            <div className="account-info-container">
              <div className="info-box">
                <div className="user-info">
                  <p className="user-info-1">Selamat Datang,</p>
                  <p className="user-info-1">{nama}</p>
                </div>
              </div>
              <div className='space'></div>
              <div className="user-image">
                <img src="https://reqres.in/img/faces/5-image.jpg" alt="" />
              </div>
            </div>
            <div className="action-buttons">
              <a href="/peserta">
                <img src={peserta} alt="" />
              </a>
              <a href="/penugasan">
                <img src={penugasan} alt="" />
              </a>
              <a href="/statistik">
                <img src={statistik} alt="" />
              </a>
            </div>
            <div className="action-buttons-1">
              <a href="/peserta">
                <span>Peserta</span>
              </a>
              <a href="/penugasan">
                <span>Penugasan</span>
              </a>
              <a href="/statistik">
                <span>Statistik</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;