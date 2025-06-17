import Logo from '../Logo'
import UserMenu from '../UserMenu'
import './header.css'

export default function Header({ userName }) {
  return (
    <nav className="main-nav">
      <Logo to="/" />
      <div>
        <UserMenu userName={userName} />
      </div>
    </nav>
  )
}
