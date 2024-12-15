import React from 'react';
import './MainPage.css'; // Ensure you have a corresponding CSS file for these styles

const MainPage = () => {
  return (
    <div className="main-page">
      <header className="header">
        <h1>Welcome to Bidzone</h1>
        <p>Your trusted online auction platform</p>
      </header>

      <section className="about-section">
        <h2>About Us</h2>
        <p>At Bidzone, we connect buyers and sellers from around the globe, offering a seamless and secure auction experience. Whether you’re looking for rare collectibles, the latest gadgets, or unique finds, Bidzone is your go-to platform.</p>
      </section>

      <section className="what-we-do-section">
        <h2>What We Do</h2>
        <ul>
          <li>Facilitate secure online auctions</li>
          <li>Provide tools for sellers to list their items easily</li>
          <li>Offer a wide variety of categories to explore</li>
          <li>Ensure a safe and reliable bidding experience</li>
        </ul>
      </section>

      <section className="gallery-section">
        <h2>Explore the World of Auctions</h2>
        <div className="gallery">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/2019_Toyota_Corolla_Icon_Tech_VVT-i_Hybrid_1.8.jpg/1200px-2019_Toyota_Corolla_Icon_Tech_VVT-i_Hybrid_1.8.jpg" alt="Car" className="gallery-image" />
          <img src="https://image.invaluable.com/housePhotos/johnmoran/30/720930/H0045-L303138010_original.jpg" alt="Historical Collectable" className="gallery-image" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Schreibkabinett_18_Jh_rem.jpg" alt="Antique Furniture" className="gallery-image" />
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlnw13dlRmA8qr1hMsFFw6n8-DXsGEHSkOOg&s" alt="Watch" className="gallery-image" />
        </div>
      </section>

      <footer className="footer">
        <p>Join Bidzone today and start exploring the endless opportunities of online auctions!</p>
      </footer>
    </div>
  );
};

export default MainPage;
