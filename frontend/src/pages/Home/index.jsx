import Header from '../../composants/Header';
import Banner from '../../composants/Banner';
import Features from '../../composants/Features';
import Footer from '../../composants/Footer';

import savingsImage from '../../assets/img/bank-tree.webp';
import iconChat from '../../assets/img/icon-chat.png';
import iconMoney from '../../assets/img/icon-money.png';
import iconSecurity from '../../assets/img/icon-security.png';

const featuresData = [
  {
    icon: iconChat,
    alt: 'Chat Icon',
    title: 'You are our #1 priority',
    description: (
      <>
        Need to talk to a representative? You can get in touch through our 24/7
        chat or through a phone call in less than 5 minutes.
      </>
    ),
  },
  {
    icon: iconMoney,
    alt: 'Money Icon',
    title: 'More savings means higher rates',
    description: (
      <>The more you save with us, the higher your interest rate will be!</>
    ),
  },
  {
    icon: iconSecurity,
    alt: 'Security Icon',
    title: 'Security you can trust',
    description: (
      <>
        We use top-of-the-line encryption to make sure your data and money is
        always safe.
      </>
    ),
  },
];

export default function Home({ currentUser }) {
  return (
    <>
      <Header userName={currentUser?.name} />
      <main className="page-container">
        <Banner image={savingsImage}>
          <h2>
            No fees.
            <br />
            No minimum deposit.
            <br />
            High interest rates.
          </h2>
          <p>Open a savings account with Argent Bank today!</p>
        </Banner>

        {/* Section des fonctionnalités  */}
        <Features items={featuresData} />
      </main>
      <Footer />
    </>
  );
}
