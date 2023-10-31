import axiosJWT from "../config/axiosJWT";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Peserta.css";
import logo from "../Assets/diskominfo.png";
import { Button, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../Components/SideBar/Style.css";
import { TabTitle } from "../TabName";

export const Admin = () => {
    TabTitle('Admin');
    const [admins, setAdmins] = useState([]);
    const [showNav, setShowNav] = useState(true);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState({
        nama: "",
        username: "",
        password: "",
    });

    const handleSearch = (e) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);
        if (searchTerm === "") {
            getAdmin();
        } else {
            const filteredUsers = admins.filter((user) => {
                const lowercaseSearchTerm = searchTerm.toLowerCase();
                const lowercaseUserName = user.nama.toLowerCase();
                return lowercaseUserName.includes(lowercaseSearchTerm);
            });
            setAdmins(filteredUsers);
        }
    };

    useEffect(() => {
        getAdmin();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAdmin = async () => {
        try {
            const response = await axiosJWT.get('https://api.diskominfo-smg-magang.cloud/admin/show-admin');
            setAdmins(response.data.admin);
        } catch (error) {
            navigate("/");
        }
    };

    const saveAdmin = async (e) => {
        e.preventDefault();
        try {
            await axiosJWT.post("https://api.diskominfo-smg-magang.cloud/admin/add-admin", formData);
            getAdmin();
            setShowTaskForm(false);
        } catch (error) {
            navigate("/");
            console.log(error);
        }
    };

    const exportAdmin = async () => {
        try {
            const response = await axiosJWT.get("https://api.diskominfo-smg-magang.cloud/admin/export-admin", {
                responseType: 'arraybuffer'
            });
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Admins.xlsx';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            navigate('/');
        }
    }

    const handleCloseTaskForm = () => {
        setShowTaskForm(false);
    };

    const handleShowTaskForm = () => {
        setShowTaskForm(true);
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
                <div className="pb-4">
                    <div className="columns mt-5">
                        <div className="column">
                            <div
                                className="info-admin-magang"
                                style={{ display: "flex", justifyContent: "space-between" }}
                            >
                                <p
                                    style={{
                                        fontFamily: "Poppins, sans-serif",
                                        fontSize: 25,
                                        marginBottom: 20,
                                    }}
                                >
                                    Admin
                                </p>
                                <p
                                    style={{
                                        fontFamily: "Poppins, sans-serif",
                                        fontSize: 18,
                                        marginBottom: 20,
                                        border: "1px solid #000",
                                        padding: "10px",
                                        borderRadius: "5px",
                                    }}
                                >
                                    Jumlah Admin: {admins.length} Admin
                                </p>
                            </div>
                            <div
                                className="search-peserta"
                                style={{ display: "flex", justifyContent: "space-between" }}
                            >
                                <button
                                    onClick={handleShowTaskForm}
                                    className="button is-success"
                                    style={{ marginTop: 18 }}
                                >
                                    Tambah Admin
                                </button>
                                <div style={{ position: "relative" }}>
                                    <input
                                        type="text"
                                        placeholder="Cari Admin..."
                                        onChange={handleSearch}
                                        value={searchTerm}
                                        style={{
                                            padding: "10px",
                                            borderRadius: "5px",
                                            border: "1px solid #ccc",
                                            fontSize: "16px",
                                            width: "100%",
                                            maxWidth: "300px",
                                            margin: "10px 0",
                                        }}
                                    />
                                    <i
                                        className="bi bi-search"
                                        style={{
                                            position: "absolute",
                                            right: "10px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                        }}
                                    ></i>
                                </div>
                            </div>
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Nama</th>
                                        <th>Username</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admins.map((admin, index) => (
                                        <tr key={admin.id}>
                                            <td>{index + 1}</td>
                                            <td>{admin.nama}</td>
                                            <td>{admin.username}</td>
                                            <td>
                                                <Link
                                                    to={`/edit-admin/${admin.id}`}
                                                    className="button is-small is-info"
                                                    style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                                                >
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button onClick={exportAdmin} className="button is-success" style={{ marginTop: 18, float: 'right' }}>Export to Excel</button>
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
                    <Modal.Title>Tambah Admin</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={saveAdmin}>
                        <Form.Group controlId="formTaskNama">
                            <Form.Label>Nama</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Masukkan nama"
                                value={formData.nama}
                                onChange={(e) =>
                                    setFormData({ ...formData, nama: e.target.value })
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="formTaskUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Masukkan username"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="formTaskPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Masukkan password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseTaskForm}>
                        Batal
                    </Button>
                    <Button variant="primary" onClick={saveAdmin}>
                        Simpan
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    );
};

export default Admin;
