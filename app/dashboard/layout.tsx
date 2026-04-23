import DashboardNav from '../components/DashboardNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardNav />
      <main>{children}</main>
    </div>
  );
}
