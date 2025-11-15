// src/pages/Signup.jsx
import {
  Box,
  Button,
  Container,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "",
    organization: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password, role, organization } = form;

    // basic client-side validation
    if (
      !email.trim() ||
      !password.trim() ||
      !role.trim() ||
      !organization.trim()
    ) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      // 1) Create auth user in Supabase
      const { data: signupData, error: signupError } =
        await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
        });

      if (signupError) {
        throw signupError;
      }

      const user = signupData.user;
      if (!user) {
        // This can happen if email confirmation is required and user must confirm first
        // For your class project, you may want to disable "email confirmation" in Supabase Auth settings.
        throw new Error(
          "Signup succeeded, but no user was returned. Check your Supabase Auth email confirmation settings."
        );
      }

      // 2) Find or create organization row
      const orgName = organization.trim();

      // Try to find an existing organization by name
      const { data: existingOrg, error: orgSelectError } = await supabase
        .from("organizations")
        .select("id")
        .eq("name", orgName)
        .maybeSingle();

      if (orgSelectError && orgSelectError.code !== "PGRST116") {
        // PGRST116 = no rows found for maybeSingle
        throw orgSelectError;
      }

      let orgId;

      if (existingOrg) {
        orgId = existingOrg.id;
      } else {
        // Insert a new organization if it doesn't exist
        const { data: newOrg, error: orgInsertError } = await supabase
          .from("organizations")
          .insert({ name: orgName })
          .select("id")
          .single();

        if (orgInsertError) {
          throw orgInsertError;
        }

        orgId = newOrg.id;
      }

      // 3) Create profile row linked to auth user + organization
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id, // must match auth.users.id
        email: user.email,
        role: role.trim(),
        organization_id: orgId,
      });

      if (profileError) {
        throw profileError;
      }

      // 4) Done! Send user to login (or directly to Inventory if you prefer)
      alert("Account created successfully! Please log in.");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong while signing up.");
    } finally {
      setLoading(false);
    }
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
          helperText="Type the hotel / org name. A new org will be created if it doesn't exist."
        />

        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account? <Link to="/login">Log in</Link>
      </Typography>
    </Container>
  );
}
