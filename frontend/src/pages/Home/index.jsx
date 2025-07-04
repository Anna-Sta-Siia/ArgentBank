import Header from '../../composants/Header';
import Banner from '../../composants/Banner';
import Features from '../../composants/Features';
import Footer from '../../composants/Footer';
import featuresData from '../../assets/featuresData';
import savingsImage from '../../assets/img/bank-tree.webp';

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
