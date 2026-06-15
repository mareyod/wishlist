import Wish from "./Wish";
import styles from './WishlistGrid.module.css'

import type { SanitizedWishItem } from '../../../types/wish.types'
import type { ViewerContext } from '../../../types/friendship.types'

interface WishlistGridProps {
  items: SanitizedWishItem[];
  viewer?: ViewerContext | undefined;
  onClick: (wish: SanitizedWishItem) => void;
  onEdit: (wish: SanitizedWishItem) => void;
  onDelete: (id: number) => void;
  onReserve: (id: number) => void;
  onUnreserve: (id: number) => void;
}

export default function WishlistGrid({ 
  items, 
  viewer, 
  onClick, 
  onEdit, 
  onDelete, 
  onReserve, 
  onUnreserve
}: WishlistGridProps) {
  return (
    <div className={styles.grid}>
      {items.map(item => (
        <Wish
            key={item.id}
            wish={item}
            viewer={viewer}
            onClick={onClick}
            onEdit={onEdit}
            onDelete={onDelete}
            onReserve={onReserve}
            onUnreserve={onUnreserve}
        />
      ))}
    </div>
  );
}