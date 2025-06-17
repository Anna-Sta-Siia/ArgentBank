import PropTypes from 'prop-types'
import './form.css'

export default function Form({
  onSubmit,
  className = '',
  children,
}) {
  return (
    <form
      className={`form-container ${className}`}
      onSubmit={e => {
        e.preventDefault()
        onSubmit(e)
      }}
    >
      {children}
    </form>
  )
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}
