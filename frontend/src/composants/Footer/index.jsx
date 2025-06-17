import './footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer-text">
        © {new Date().getFullYear()} Argent Bank
      </p>
    </footer>
  )
}
