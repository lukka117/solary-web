import { Outlet } from 'react-router-dom';
import SiteHeader from '../components/ui/SiteHeader';
import SiteFooter from '../components/ui/SiteFooter';

export default function SiteLayout() {
  return (
    <>
      <SiteHeader />
      <main className="site-main">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
