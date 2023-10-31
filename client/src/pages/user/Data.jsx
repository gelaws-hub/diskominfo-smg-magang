import React, { useState, useEffect } from 'react';
import axiosJWT from '../../config/axiosJWT';
import ListTable from './ListTable';
import logo from "../../Assets/diskominfo.png"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "../../Components/SideBar/Navbar.css"
import axios from 'axios';
import jwt_decode from "jwt-decode";

// Import a modal library or create your custom modal component
// For this example, I'm using a custom modal component.
import ImageModal from './ImageModal'; // Create this component
import { TabTitle } from '../../TabName';

function formatDueDate(inputDate) {
  const date = new Date(inputDate);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return hours + ':' + minutes;
}

function Data(props) {
  TabTitle('Data Presensi')
  const [data, setData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showNav, setShowNav] = useState(true);

  useEffect(() => {
    const fetchDataAndPresensiData = async () => {
      try {
        const ambilid = await axios.get('https://api.diskominfo-smg-magang.cloud/account/token');
        const decoded = jwt_decode(ambilid.data.token);

          
        const response = await axiosJWT.get(`https://api.diskominfo-smg-magang.cloud/user/presensi/${decoded.userId}`);
        const dataWithKosong = response.data.presensi.map((item) => ({
          ...item,
          check_in: item.check_in === null ? (
            <span style={{ color: "red" }}>Belum Presensi</span>
          ) : (
            <span style={{ color: "blue", cursor: "pointer" }} onClick={() => handleImageClick(item.image_url_in)}>
              {formatDueDate(item.check_in)}
            </span>
          ),
          check_out: item.check_out === null ? (
            <span style={{ color: "red" }}>Belum Presensi</span>
          ) : (
            <span style={{ color: "blue", cursor: "pointer" }} onClick={() => handleImageClick(item.image_url_out)}>
              {formatDueDate(item.check_out)}
            </span>
          ),
          image_url_in: item.image_url_in === null ? (
            <span style={{ color: "red" }}>Belum Presensi</span>
          ) : (
            <span style={{ color: "blue", cursor: "pointer" }} onClick={() => handleImageClick(item.image_url_in)}>
              Sudah Presensi
            </span>
          ),
          image_url_out: item.image_url_out === null ? (
            <span style={{ color: "red" }}>Belum Presensi</span>
          ) : (
            <span style={{ color: "blue", cursor: "pointer" }} onClick={() => handleImageClick(item.image_url_out)}>
              Sudah Presensi
            </span>
          ),
        }));
        setData(dataWithKosong);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataAndPresensiData();
  }, []);

  function handleImageClick(imageUrl) {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  }

  function closeImageModal() {
    setShowImageModal(false);
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
                href="/user/homepage"
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
                  href="/user/homepage"
                  target="_self"
                  className="nav_link"
                >
                  <i className="bi bi-house nav_icon" />
                  <span className="nav_name">Home</span>
                </a>
                <a
                  href="/user/presensi/riwayat"
                  target="_self"
                  className="nav_link"
                >
                  <i className="bi bi-list-task nav_icon" />
                  <span className="nav_name">History Presensi</span>
                </a>
                <a
                  href="/user/presensi"
                  target="_self"
                  className="nav_link"
                >
                  <i className="bi bi-camera nav_icon" />
                  <span className="nav_name">Lakukan Presensi</span>
                </a>
                <a
                  href="/user/tugas"
                  target="_self"
                  className="nav_link"
                >
                  <i className="bi bi-card-checklist nav_icon" />
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1>Daftar data Absen</h1>
          <ListTable data={data} />
        </div>

        {showImageModal && (
          <ImageModal imageUrl={selectedImage} onClose={closeImageModal} />
        )}
      </div>
    </div>
  );
}

export default Data;
