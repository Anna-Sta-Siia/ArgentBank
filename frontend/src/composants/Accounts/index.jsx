import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import AccountCard from '../AccountCard';
import { setAccounts } from '../../slices/profile/profileSlice';
import mockAccounts from '../../assets/mockAccounts';
import './accounts.css';

export default function Accounts() {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.profile.accounts);
  const user = useSelector((state) => state.profile.data);

  const [accountsInitialized, setAccountsInitialized] = useState(false);

  useEffect(() => {
    if (user && accounts.length === 0 && !accountsInitialized) {
      dispatch(setAccounts(mockAccounts));
      setAccountsInitialized(true);
    }
  }, [user, accounts.length, accountsInitialized, dispatch]);

  return (
    <section className="accounts">
      <h2 className="sr-only">Accounts</h2>
      {accounts.map((acct) => (
        <AccountCard
          key={acct.id}
          title={acct.title}
          amount={acct.amount}
          desc={acct.desc}
          onView={() => {
            /* navigation future */
          }}
        />
      ))}
    </section>
  );
}
