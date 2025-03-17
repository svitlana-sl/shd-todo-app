const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-center text-2xl font-bold">Todo App</h1>
      {children}
    </div>
  );
};

export default Layout;
