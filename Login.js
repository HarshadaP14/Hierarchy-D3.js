import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      onLogin(username, password);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="username is admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "400px" }} // Adjust width of input field
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password is admin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "400px" }} // Adjust width of input field
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>

        {error && <div className="mt-3 text-danger">{error}</div>}
      </Form>
    </div>
  );
};

export default Login;
