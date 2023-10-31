import React, { useState, useRef, useEffect } from 'react';
import logo from "../../Assets/diskominfo.png"
import { Container } from 'react-bootstrap';
import Dates from '../../Assets/Date';
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "../../Components/SideBar/Navbar.css"
import jwt_decode from "jwt-decode"
import axiosJWT from '../../config/axiosJWT';
import axios from 'axios';
import { TabTitle } from '../../TabName';

const Presensi = () => {
  TabTitle('Presensi');
  const videoRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [captureTime, setCaptureTime] = useState(null);
  const [showNav, setShowNav] = useState(true);

  useEffect(() => {
    let stream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();

    // Cleanup function: stop the camera when the component unmounts
    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []); // Empty dependency array ensures that this effect runs once when the component mounts

  const capture = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d'); 
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const capturedImageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
    const capturedImageFile = new File([capturedImageBlob], 'captured-image.jpg', { type: 'image/jpeg' });

    // Set the captured image as a File object in state
    setImageSrc(capturedImageFile);
    setCaptureTime(new Date());
    console.log('Captured Image:', capturedImageFile);
  };

  const uploadImage = async () => {
    try {
      const ambilid = await axios.get('https://api.diskominfo-smg-magang.cloud/account/token');
      const decoded = jwt_decode(ambilid.data.token);

      // Create a FormData object to send the image as multipart/form-data
      const formData = new FormData();
      formData.append('image', imageSrc);

      const response = await axiosJWT.patch(`https://api.diskominfo-smg-magang.cloud/user/presensi/${decoded.userId}/up`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Set content type to multipart/form-data
        }
      });
      console.log('Server Response:', response.data);
      window.alert("Berhasil Melakukan Presensi")
    } catch (error) {
      console.error('Error:', error);
      window.alert("Gagal Melakukan Presensi")
    }
  };

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
                  href="homepage"
                  target="_self"
                  className="nav_link"
                >
                  <i className="bi bi-house nav_icon" />
                  <span className="nav_name">Home</span>
                </a>
                <a
                  href="presensi/riwayat"
                  target="_self"
                  className="nav_link"
                >
                  <i className="bi bi-list-task nav_icon" />
                  <span className="nav_name">History Presensi</span>
                </a>
                <a
                  href="presensi"
                  target="_self"
                  className="nav_link"
                >
                  <i className="bi bi-camera nav_icon" />
                  <span className="nav_name">Lakukan Presensi</span>
                </a>
                <a
                  href="tugas"
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
          <h1 style={{ marginBottom: "10px" }}>Silahkan Presensi</h1>
          <div> <Dates style={{ display: 'flex', alignItems: 'end' }} /> </div>
          <Container style={{ marginTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <video ref={videoRef} autoPlay style={{ width: '50%', height: '60%' }} />
              {imageSrc && <img src={URL.createObjectURL(imageSrc)} alt="Selfie" style={{ width: '50%', height: '60%' , marginLeft:"10px" }} />}
            </div>
            <div style={{ display: 'flex', marginTop: 10 }}>
              <button onClick={capture} style={{ height: "40px", width: "100px", borderRadius: "10px" }}>Ambil Foto</button>
              <button onClick={uploadImage} style={{ marginLeft: 10, height: "40px", width: "120px", borderRadius: "10px" }}>Upload Foto</button>
              {captureTime && <p style={{ marginLeft: 10, marginTop: 10 }}>Foto diambil pada: {captureTime.toLocaleTimeString()}</p>}
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Presensi;