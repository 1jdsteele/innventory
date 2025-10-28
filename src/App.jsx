import { useState } from "react";
import "./App.css";

import {
  AppBar,
  Container,
  CssBaseline,
  Toolbar,
  Typography,
} from "@mui/material";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import AddInventory from "./AddInventory";
import InventoryPage from "./pages/InventoryPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <CssBaseline /> {/* Resets browser default styles */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Hotel Inventory</Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        {/* <Routes>
          <Route path="/" element={<AddInventory />} />
        </Routes> */}
        <Routes>
          <Route path="/" element={<InventoryPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
