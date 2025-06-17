import PropTypes from 'prop-types'
import './banner.css'

export default function Banner({ image, children, className = '' }) {
  const style = {
    backgroundImage: `url(${image})`,
  }

  return (
    <section
      className={`banner banner--absolute ${className}`}
      style={style}
    >
      <div className="banner-text">{children}
      </div>
    </section>
  )
}

Banner.propTypes = {
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}
