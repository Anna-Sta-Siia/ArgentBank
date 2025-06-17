import PropTypes from 'prop-types'
import FeatureItem from '../FeatureItem'
import './features.css' 

export default function Features({ items }) {
  return (
    <section className="features">
      {items.map(({ icon, alt, title, description }, idx) => (
        <FeatureItem
          key={idx}
          icon={icon}
          alt={alt}
          title={title}
        >
          {description}
        </FeatureItem>
      ))}
    </section>
  )
}

Features.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.node.isRequired,
    })
  ).isRequired,
}