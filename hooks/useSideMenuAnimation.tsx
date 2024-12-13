const useSideMenuAnimation = (menuExpanded: boolean) => {
  const desktopAnimate = { width: menuExpanded ? 285 : 80 };
  const desktopInitial = { width: 80 };

  return {
    animate: desktopAnimate,
    initial: desktopInitial,
  };
};

export default useSideMenuAnimation;
