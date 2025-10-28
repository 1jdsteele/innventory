import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, ListItem, ListItemText } from "@mui/material";

export default function ItemRow({ item, onUpdate, onDelete }) {
  // HERE hein will add logic for editing

  return (
    //HERE Hein will add ternary logic to have the list item we are editing go to "edit mode"
    <ListItem
      // MUI prop that allows right-side icons
      secondaryAction={
        <>
          <IconButton
            aria-label="edit"
            edge="end"
            onClick={() => onUpdate(item.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            edge="end"
            onClick={() => onDelete(item.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      }
    >
      <ListItemText
        primary={item.name}
        secondary={`Quantity: ${item.quantity}`}
        primaryTypographyProps={{ fontWeight: "bold" }}
      />
    </ListItem>
  );
}
