// components/DashboardHeader.jsx
import { Button, Stack } from "@mui/material";

export default function DashboardHeader({ onScrollToBottom }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 3 }}
    >
      <Button
        variant="text"
        onClick={onScrollToBottom}
        sx={{
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 500,
          color: "primary.main",
          padding: 0,
          minWidth: "unset",
        }}
      >
        Add item
      </Button>
    </Stack>
  );
}
