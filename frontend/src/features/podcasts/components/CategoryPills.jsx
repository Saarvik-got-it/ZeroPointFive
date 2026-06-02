import { motion } from 'motion/react';
import { categories } from '@/features/podcasts/data/podcastsData';

export function CategoryPills({ activeCategory, onCategoryChange }) {
  return (
    <motion.div
      className="category-pills"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
    >
      <div className="category-pills__track">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              type="button"
              className={`category-pills__pill${isActive ? ' category-pills__pill--active' : ''}`}
              onClick={() => onCategoryChange(cat.id)}
              aria-pressed={isActive}
              aria-label={`${cat.label} — ${cat.count} episodes`}
            >
              {cat.label}
              <span className="category-pills__count">{cat.count}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

export default CategoryPills;
