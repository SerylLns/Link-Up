type Props = {
  hideNavigation?: boolean;
  children: React.ReactNode;
};

const Layout = ({ children, hideNavigation = false }: Props) => {
  let rightColumnClasses = "";
  if (hideNavigation) {
    rightColumnClasses += "w-full";
  } else {
    rightColumnClasses += "mx-4 md:mx-0 md:w-9/12";
  }
  return (
    <div className="md:flex mt-4 max-w-4xl  mx-auto gap-6 mb-24 md:mb-0">
      <div className={rightColumnClasses}>{children}</div>
    </div>
  );
};

export default Layout;
