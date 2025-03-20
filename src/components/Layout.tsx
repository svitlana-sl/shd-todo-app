import { ModeToggle } from "./mode-toggle";
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-background text-foreground flex min-h-screen items-start justify-center">
      <div className="w-[800px]">
        <header className="flex justify-between p-4">
          <h1 className="text-2xl font-bold">Todo App</h1>
          <ModeToggle />
        </header>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
