import React, { useState, useEffect } from 'react';
import './PresensiMagang.css';
import logo from "../Assets/diskominfo.png"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "../Components/SideBar/Style.css"
import axiosJWT from '../config/axiosJWT';
import { TabTitle } from '../TabName';

export const Peserta = () => {
  TabTitle('Presensi Magang');
  const [users, setUsers] = useState([]);
  const [showNav, setShowNav] = useState(true);
  const [totalAttendance, setTotalAttendance] = useState(0);

  const [currentTime, setCurrentTime] = useState('');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    getUsers();
    fetchCurrentTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exportPresensi = async () => {
    const requestUrl = searchDate
      ? `https://api.diskominfo-smg-magang.cloud/admin/export-presensi?tanggal=${searchDate}`
      : 'https://api.diskominfo-smg-magang.cloud/admin/export-presensi';

    const response = await axiosJWT.get(requestUrl, {
      responseType: 'arraybuffer',
    });

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'Presensi.xlsx';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
  };

  const fetchCurrentTime = async () => {
    try {
      const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Jakarta');
      const data = await response.json();
      const dateTimeString = data.datetime;
      const dateTime = new Date(dateTimeString);

      const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const timeOptions = { hour: '2-digit', minute: '2-digit' };

      const date = dateTime.toLocaleDateString(undefined, dateOptions);
      const time = dateTime.toLocaleTimeString(undefined, timeOptions);

      const dateTimeStringFormatted = `${date} - ${time}`;
      setCurrentTime(dateTimeStringFormatted);
    } catch (error) {
      console.error('Error fetching current time:', error);
    }
  };


  const getUsers = async () => {
    const url = searchDate
      ? `https://api.diskominfo-smg-magang.cloud/admin/presensi?tanggal=${searchDate}`
      : 'https://api.diskominfo-smg-magang.cloud/admin/presensi';

    try {
      const response = await axiosJWT.get(url);
      setUsers(response.data.presensi);
      setTotalAttendance(response.data.totalSudahPresensi);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = () => {
    getUsers();
  };

  const getPresensiBelum = async () => {
    try {
      const response = await axiosJWT.get('https://api.diskominfo-smg-magang.cloud/admin/presensi/negatif');
      setUsers(response.data.presensi);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatDateTime = (dateTime) => {
    if (dateTime === null) {
      return '-'; // Display "-" for null values
    }

    const jakartaTimeZone = 'Asia/Jakarta';
    const options = {
      timeZone: jakartaTimeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // Use 24-hour format
    };

    const date = new Date(dateTime);
    const formattedTime = new Intl.DateTimeFormat('en-US', options).format(date);

    return formattedTime;
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
              alt="Clue Mediator"
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
        <div className="pb-4">
          <div className="columns mt-5">
            <div className="column">
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 25, marginBottom: 20 }}>Presensi Magang</p>
              <div className="cards">
                <div className="card" style={{ backgroundColor: "#4CAF50" }}>
                  <p style={{ color: "white" }}>Total Hadir Hari Ini</p>
                  <p style={{ color: "white" }}>{totalAttendance}</p>
                </div>
                <div className="card" style={{ backgroundColor: "#FF5733" }}>
                  <p style={{ color: "white" }}>Tanggal Hari Ini</p>
                  <p style={{ color: "white" }}>{currentTime}</p>
                </div>
              </div>
              <div className="button-container">
                <button
                  onClick={() => getPresensiBelum()}
                  className="button is-small is-danger"
                >
                  Peserta Belum Absen
                </button>
                <button
                  onClick={() => getUsers()}
                  className="button is-small is-success"
                >
                  Peserta Sudah Absen
                </button>
              </div>
              <div className='search'>
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  onClick={handleSearch}
                  style={{
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '16px',
                    width: '100%',
                    maxWidth: '300px',
                    margin: '10px 0',
                  }}
                />
              </div>
              <table className="custom-table-presensi">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Image In</th>
                    <th>Image Out</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(users) && users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.nama}</td>
                      {user.presensimagang.map((entry, entryIndex) => (
                        <React.Fragment key={entry.id}>
                          <td>{entry.check_in ? formatDateTime(entry.check_in) : '-'}</td>
                          <td>{entry.check_out ? formatDateTime(entry.check_out) : '-'}</td>
                          <td>
                            {entry.image_url_in ? (
                              <a href={entry.image_url_in} target="_self" rel="noopener noreferrer">
                                Absen Masuk
                              </a>
                            ) : '-'}
                          </td>
                          <td>
                            {entry.image_url_out ? (
                              <a href={entry.image_url_out} target="_self" rel="noopener noreferrer">
                                Absen Pulang
                              </a>
                            ) : '-'}
                          </td>
                        </React.Fragment>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={exportPresensi} className="button is-success" style={{ marginTop: 18, float: 'right' }}>
                Export to Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Peserta;