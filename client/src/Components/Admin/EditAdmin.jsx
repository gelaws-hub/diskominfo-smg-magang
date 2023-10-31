import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import axiosJWT from "../../config/axiosJWT";

export const EditAdmin = () => {
    const [nama, setNama] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        getAdminById();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateAdmin = async (e) => {
        e.preventDefault();
        try {
            await axiosJWT.patch(`https://api.diskominfo-smg-magang.cloud/admin/editadmin/${id}`, {
                nama,
                username,
                password
            });
            navigate("/admin");
        } catch (error) {
            console.log(error);
        }
    };

    const getAdminById = async () => {
        const response = await axiosJWT.get(`https://api.diskominfo-smg-magang.cloud/admin/show-admin-id/${id}`);
        setNama(response.data.admin.nama);
    };

    return (
        <div className="columns mt-5 is-centered">
            <div className="column is-half">
                <p style={{ textAlign: "center", fontFamily: "Poppins" }}>Edit Admin</p>
                <Form onSubmit={updateAdmin}>
                    <Form.Group controlId="nama">
                        <Form.Label>Nama</Form.Label>
                        <Form.Control
                            type="text"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            placeholder="Nama"
                        />
                    </Form.Group>

                    <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                        />
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                    </Form.Group>

                    <Button style={{ marginTop: 10 }} variant="success" type="submit">
                        Update
                    </Button>

                    <Button style={{ marginTop: 10, marginLeft: 10 }} variant="secondary" onClick={() => navigate("/admin")}>
                        Cancel
                    </Button>

                </Form>
            </div>
        </div>
    );
};

export default EditAdmin;