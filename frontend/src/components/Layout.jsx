import Sidebar from "./Sidebar";

export default function Layout({ children, active }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex">
      <Sidebar active={active} />
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
