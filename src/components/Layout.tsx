import { ModeToggle } from "./mode-toggle";
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="flex justify-between p-4">
        <h1 className="text-2xl font-bold">Todo App</h1>
        <ModeToggle />
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
};

export default Layout;
