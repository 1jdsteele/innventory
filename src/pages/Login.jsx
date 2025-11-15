import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Container, TextField, Typography, Box } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      alert("Logged in!");
      navigate("/"); // Go to InventoryPage after login
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
          Login
        </Button>
      </Box>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Don’t have an account? <Link to="/signup">Sign up</Link>
      </Typography>
    </Container>
  );
}
