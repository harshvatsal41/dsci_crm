// animations/variants.js
export const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  },
  selected: {
    scale: 1.05,
    zIndex: 10,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20
    }
  }
};

export const sidebarVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20
    }
  }
};