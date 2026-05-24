import Wish from "./Wish";
import styles from './WishlistGrid.module.css'

export default function WishlistGrid({ 
  items, 
  viewer, 
  owner,
  onClick, 
  onEdit, 
  onDelete, 
  onReserve, 
  onUnreserve
}) {
  return (
    <div className={styles.grid}>
      {items.map(item => (
        <Wish
            key={item.id}
            wish={item}
            viewer={viewer}
            onClick={() => onClick(item)}
            onEdit={onEdit}
            onDelete={onDelete}
            onReserve={onReserve}
            onUnreserve={onUnreserve}
        />
      ))}
    </div>
  );
}