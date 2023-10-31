import axiosJWT from '../config/axiosJWT';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Peserta.css';
import logo from '../Assets/diskominfo.png';
import {
  Button,
  Modal,
  Form,
} from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../Components/SideBar/Style.css";
import { TabTitle } from '../TabName';

export const Peserta = () => {
  TabTitle('Peserta');
  const [users, setUsers] = useState([]);
  const [showNav, setShowNav] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);
  const maxPageButtons = 5;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getRenderedPageNumbers = () => {
    if (totalPages <= maxPageButtons) {
      return pageNumbers;
    }

    const halfButtons = Math.floor(maxPageButtons / 2);
    let startPage = Math.max(currentPage - halfButtons, 1);
    let endPage = startPage + maxPageButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxPageButtons + 1, 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const [formData, setFormData] = useState({
    nama: '',
    asal_univ: '',
    asal_jurusan: '',
    tanggal_mulai: null,
    tanggal_selesai: null,
    status_aktif: true,
    username: '',
    password: '',
  });

  const exportPeserta = async () => {
    try {
      const response = await axiosJWT.get("https://api.diskominfo-smg-magang.cloud/admin/export-peserta", {
        responseType: 'arraybuffer'
      });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Peserta.xlsx';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      navigate('/');
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm === '') {
      getUsers();
    } else {
      const filteredUsers = users.filter((user) => {
        const lowercaseSearchTerm = searchTerm.toLowerCase();
        const lowercaseUserName = user.nama.toLowerCase();
        return lowercaseUserName.includes(lowercaseSearchTerm);
      });
      setUsers(filteredUsers);
    }
  };

  useEffect(() => {
    getUsers(); // Fetch data for the initial page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUsers = async (page) => {
    try {
      const response = await axiosJWT.get('https://api.diskominfo-smg-magang.cloud/admin/peserta');
      setUsers(response.data.peserta_magang);
    } catch (error) {
      navigate('/');
    }
  };

  const deleteUser = async (id) => {
    try {
      await axiosJWT.delete(`https://api.diskominfo-smg-magang.cloud/admin/peserta/${id}/delete`);
      getUsers();
    } catch (error) {
      navigate("/");
    }
  };

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      await axiosJWT.post('https://api.diskominfo-smg-magang.cloud/admin/peserta/add', formData);
      getUsers();
      setShowTaskForm(false);
    } catch (error) {
      navigate("/");
    }
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
  };

  const handleShowTaskForm = () => {
    setShowTaskForm(true);
  };

  const renderedPageNumbers = getRenderedPageNumbers();

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
              <div className='info-peserta-magang' style={{ display: 'flex', justifyContent: "space-between" }}>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 25, marginBottom: 20 }}>Peserta</p>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 18, marginBottom: 20, border: '1px solid #000', padding: '10px', borderRadius: '5px' }}>Jumlah Peserta: {users.length} Peserta</p>
              </div>
              <div className='search-peserta' style={{ display: 'flex', justifyContent: "space-between" }}>
                <button
                  onClick={handleShowTaskForm}
                  className='button is-success'
                  style={{ marginTop: 18 }}
                >
                  Tambah Peserta
                </button>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Cari Peserta..."
                    onChange={handleSearch}
                    value={searchTerm}
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
                  <i className="bi bi-search" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}></i>
                </div>
              </div>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Universitas</th>
                    <th>Jurusan</th>
                    <th>Tanggal Mulai</th>
                    <th>Tanggal Selesai</th>
                    <th>Status Aktif</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.nama}</td>
                      <td>{user.asal_univ}</td>
                      <td>{user.asal_jurusan}</td>
                      <td>{user.tanggal_mulai}</td>
                      <td>{user.tanggal_selesai}</td>
                      <td>{user.status_aktif.toString() ? "Aktif" : "Tidak Aktif"}</td>
                      <td>
                        <Link to={`/edit/${user.id}`} className="button is-small is-info">Edit</Link>
                        <button onClick={() => deleteUser(user.id)} className="button is-small is-danger">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination-peserta" style={{ marginTop: 10 }}>
                <ul className="pagination-list-peserta">
                  <li className="pagination-item">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      className={`pagination-link ${currentPage === 1 ? 'is-disabled' : ''}`}
                    >
                      Previous
                    </button>
                  </li>
                  {renderedPageNumbers.map((number) => (
                    <li key={number} className="pagination-item">
                      <button
                        onClick={() => paginate(number)}
                        className={`pagination-link ${number === currentPage ? 'is-current' : ''}`}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                  <li className="pagination-item">
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      className={`pagination-link ${currentPage === totalPages ? 'is-disabled' : ''}`}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
              <button onClick={exportPeserta} className="button is-success" style={{ marginTop: 18, float: 'right' }}>
                Export to Excel
              </button>
            </div>
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
          <Modal.Title>Tambah Peserta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={saveUser}>
            <Form.Group controlId="formTaskTitle">
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan nama"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formTaskDescription">
              <Form.Label>Universitas</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan universitas"
                value={formData.asal_univ}
                onChange={(e) => setFormData({ ...formData, asal_univ: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formTaskDeadline">
              <Form.Label>Jurusan</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan jurusan"
                value={formData.asal_jurusan}
                onChange={(e) => setFormData({ ...formData, asal_jurusan: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formTaskDeadline">
              <Form.Label>Tanggal Mulai</Form.Label>
              <Form.Control
                type="date"
                value={formData.tanggal_mulai}
                onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formTaskDeadline">
              <Form.Label>Tanggal Selesai</Form.Label>
              <Form.Control
                type="date"
                value={formData.tanggal_selesai}
                onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formTaskStatus">
              <Form.Label>Status Aktif</Form.Label>
              <Form.Control
                as="select"
                value={formData.status_aktif.toString()}
                onChange={(e) => setFormData({ ...formData, status_aktif: e.target.value === 'true' })}
              >
                <option value="true">Aktif</option>
                <option value="false">Tidak Aktif</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formTaskUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formTaskPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Masukkan password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTaskForm}>
            Batal
          </Button>
          <Button variant="primary" onClick={saveUser}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Peserta;