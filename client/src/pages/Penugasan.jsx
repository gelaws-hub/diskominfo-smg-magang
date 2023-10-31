import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../Assets/diskominfo.png";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../Components/SideBar/Style.css";
import "./Penugasan.css";
import axiosJWT from "../config/axiosJWT";
import { TabTitle } from "../TabName";

function Penugasan() {
  TabTitle("Penugasan");
  const [showNav, setShowNav] = useState(true);
  const [activeTasks, setActiveTasks] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeNow, setTimeNow] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tugas, setTugas] = useState([]);
  const [idtugas, setIdTugas] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    judul: "",
    tugas_url: "",
    dueDate: "",
  });

  useEffect(() => {
    getTugasById();
    getTugas();
    fetchCurrentTime();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exportPenugasan = async (tugasId) => {
    try {
      if (tugasId) {
        const response = await axiosJWT.get(
          `https://api.diskominfo-smg-magang.cloud/admin/tugas/${tugasId}/export-tugas`,
          {
            responseType: 'arraybuffer'
          }
        );
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Penugasan.xlsx';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        // Handle jika tugasId tidak tersedia
        console.error('Tugas ID tidak tersedia');
      }
    } catch (error) {
      // navigate('/');
      console.error(error);
    }
  };

  useEffect(() => {
    const activeTaskCount = tugas.filter((tugas) => {
      const dueDate = new Date(tugas.dueDate);
      return dueDate > currentTime;
    }).length;
    setActiveTasks(activeTaskCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime]);

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
      setTimeNow(dateTimeStringFormatted);
    } catch (error) {
      console.error('Error fetching current time:', error);
    }
  };

  function formatDueDate(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const addTugas = async (e) => {
    e.preventDefault();
    try {
      await axiosJWT.post("https://api.diskominfo-smg-magang.cloud/admin/tugas/add", formData);
      getTugas();
      setShowTaskForm(false);
    } catch (error) {
      navigate("/");
    }
  };

  const getTugas = async () => {
    try {
      const response = await axiosJWT.get("https://api.diskominfo-smg-magang.cloud/admin/tugas");
      setTugas(response.data.tugas);
    } catch (error) {
      navigate("/");
    }
  };

  const [statustugas, setStatusTugas] = useState([]);

  const getTugasById = async (taskId) => {
    try {
      const response = await axiosJWT.get(
        `https://api.diskominfo-smg-magang.cloud/admin/tugas/${taskId}`
      );
      setStatusTugas(response.data.tugas);
    } catch (error) {
    }
  };

  const handleShowTaskForm = () => {
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
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
              <a href="/homepage" target="_self" className="nav_logo">
                {showNav ? (
                  <img
                    src={logo}
                    alt=""
                    style={{ width: "150px", height: "auto" }}
                  />
                ) : (
                  <i className="bi bi-border-width nav_logo-icon" />
                )}
              </a>
              <div className="nav_list">
                <a href="homepage" target="_self" className="nav_link">
                  <i className="bi bi-house nav_icon" />
                  <span className="nav_name">Home</span>
                </a>
                <a href="admin" target="_self" className="nav_link">
                  <i className="bi bi-person-check-fill nav_icon" />
                  <span className="nav_name">Admin</span>
                </a>
                <a href="peserta" target="_self" className="nav_link">
                  <i className="bi bi-person nav_icon" />
                  <span className="nav_name">Peserta</span>
                </a>
                <a href="presensi" target="_self" className="nav_link">
                  <i className="bi bi-person-check nav_icon" />
                  <span className="nav_name">Presensi Magang</span>
                </a>
                <a href="penugasan" target="_self" className="nav_link">
                  <i className="bi bi-list-task nav_icon" />
                  <span className="nav_name">Penugasan</span>
                </a>
              </div>
            </div>
            <a href="/" target="_self" className="nav_link">
              <i className="bi bi-box-arrow-left nav_icon" />
              <span className="nav_name">SignOut</span>
            </a>
          </nav>
        </div>
        <div className="pt-1 pb-4">
          <div className="body-penugasan">
            <section id="penugasan">
              <p
                style={{
                  textAlign: "start",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 25,
                  marginBottom: 20,
                  color: "black"
                }}
              >
                Penugasan
              </p>
              <div className="card" style={{ backgroundColor: "red" }}>
                <p style={{ color: "white" }}>Tanggal Hari Ini</p>
                <p style={{ color: "white" }}>{timeNow}</p>
              </div>
            </section>
            <section id="cards-penugasan">
              <div className="card-penugasan-1 green-penugasan">
                <p>Jumlah Tugas Aktif: {activeTasks}</p>
              </div>
              <div
                className="card-penugasan-1 red-penugasan"
                style={{ display: "flex", alignItems: "center" }}
              >
                <button
                  onClick={handleShowTaskForm}
                  style={{
                    backgroundColor: "red",
                    border: "none",
                    color: "white",
                  }}
                >
                  Tambah Tugas
                </button>
              </div>
            </section>
            <section id="informasi-penugasan">
              <div className="container-penugasan left">
                <p style={{ textAlign: "center", fontFamily: "Poppins, sans-serif", fontSize: 20, color: "black", marginBottom: 10 }}>
                  Daftar Tugas
                </p>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Judul</th>
                      <th>Deskripsi</th>
                      <th>Deadline</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tugas.map((tugas, index) => (
                      <tr key={tugas.id}>
                        <td>{index + 1}</td>
                        <td>{tugas.judul}</td>
                        <td>{tugas.tugas_url}</td>
                        <td>{formatDueDate(tugas.dueDate)}</td>
                        <td>
                          <button
                            onClick={() => {
                              getTugasById(tugas.id);
                              setIdTugas(tugas.id);
                            }}
                            className="button is-small is-danger"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="container-penugasan right">
                <p style={{ textAlign: "center", fontFamily: "Poppins, sans-serif", fontSize: 20, color: "black", marginBottom: 10 }}>
                  Detail Penugasan
                </p>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Tugas URL</th>
                      <th>Status Pengerjaan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statustugas.map((tugas, index) => (
                      <tr key={tugas.id}>
                        <td>{tugas.nama}</td>
                        <td>
                          {tugas.status_tugas[0] && tugas.status_tugas[0].status_pengerjaan ? (
                            <a href={tugas.status_tugas[0].tugas_url} target="_self" rel="noopener noreferrer">
                              Sudah Mengerjakan
                            </a>
                          ) : (
                            tugas.status_tugas[0] && tugas.status_tugas[0].tugas_url ? (
                              <a href={tugas.status_tugas[0].tugas_url} target="_self" rel="noopener noreferrer">
                                {tugas.status_tugas[0].tugas_url}
                              </a>
                            ) : (
                              "Belum Mengerjakan"
                            )
                          )}
                        </td>
                        <td>
                          {tugas.status_tugas[0] && tugas.status_tugas[0].status_pengerjaan
                            ? "Sudah Selesai"
                            : "Belum Selesai"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={() => exportPenugasan(idtugas)}
                  className="button is-success"
                  style={{
                    marginTop: 18,
                    float: 'right',
                    display: idtugas === '' ? 'none' : 'block'
                  }}
                >
                  Export to Excel
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Modal
        show={showTaskForm}
        onHide={handleCloseTaskForm}
        backdrop="static"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Form Penugasan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={addTugas}>
            <Form.Group controlId="formTaskJudul">
              <Form.Label>Judul</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan judul"
                value={formData.judul}
                onChange={(e) =>
                  setFormData({ ...formData, judul: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formTaskDeskripsi">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Masukkan deskripsi"
                value={formData.tugas_url}
                onChange={(e) =>
                  setFormData({ ...formData, tugas_url: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formTaskDueDate">
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                type="datetime-local"
                value={formData.dueDate ? formData.dueDate.slice(0, 16) : ""}
                onChange={(e) => {
                  if (e.target.value) {
                    const selectedDate = new Date(e.target.value);
                    const isoDate = selectedDate.toISOString();
                    setFormData({ ...formData, dueDate: isoDate });
                  }
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTaskForm}>
            Batal
          </Button>
          <Button variant="primary" onClick={addTugas}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Penugasan;