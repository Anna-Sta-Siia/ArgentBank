
import PropTypes from 'prop-types'
import './accountCard.css'

export default function AccountCard({ title, amount, desc, onView }) {
  return (
    <div className="account-card">
      <div className="account-card-details">
        <h3 className="account-card-title">{title}</h3>
        <p className="account-card-amount">{amount}</p>
        <p className="account-card-desc">{desc}</p>
      </div>
      <div className="account-card-cta">
        <button className="account-card-button" onClick={onView}>
          View transactions
        </button>
      </div>
    </div>
  )
}

AccountCard.propTypes = {
  title:   PropTypes.string.isRequired,
  amount:  PropTypes.string.isRequired,
  desc:    PropTypes.string.isRequired,
  onView:  PropTypes.func,
}
