import { List } from "@mui/material";
import ItemRow from "./ItemRow";

export default function ItemsList({ items, onUpdate, onDelete }) {
  return (
    <List>
      {items.map((item) => (
        <ItemRow
          key={item.id}
          item={item}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </List>
  );
}
