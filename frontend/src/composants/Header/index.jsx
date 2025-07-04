import Logo from '../Logo';
import UserMenu from '../UserMenu';
import './header.css';

export default function Header() {
  return (
    <nav className="main-nav">
      <Logo />
      <div>
        <UserMenu />
      </div>
    </nav>
  );
}
