import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "",
    organization: "",
  });
  const [error, setError] = useState("");

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const { email, password, role, organization } = form;

    if (!email.trim() || !password.trim() || !role.trim() || !organization.trim()) {
      setError("Please fill in all fields");
      return;
    }

    // Everything stored as Strings for the database
    const newUser = {
      email: String(email),
      password: String(password),
      role: String(role),
      organization: String(organization),
    };

    // Save temporarily in localStorage (until you connect real DB)
    localStorage.setItem("demo_account", JSON.stringify(newUser));

    alert("Account created successfully!");
    navigate("/login", { replace: true });
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Sign Up
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          value={form.email}
          onChange={onChange}
        />

        <TextField
          fullWidth
          margin="normal"
          type="password"
          label="Password"
          name="password"
          value={form.password}
          onChange={onChange}
        />

        <TextField
          fullWidth
          select
          margin="normal"
          label="Role"
          name="role"
          value={form.role}
          onChange={onChange}
        >
          <MenuItem value="Employee">Employee</MenuItem>
          <MenuItem value="Manager">Manager</MenuItem>
        </TextField>

        <TextField
          fullWidth
          margin="normal"
          label="Organization Name"
          name="organization"
          value={form.organization}
          onChange={onChange}
        />

        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
          Create Account
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </Typography>
    </Container>
  );
}
