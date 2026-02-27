import Carousel from "../../components/ui/Carousel";
import "../../styles/HomePage.css";

function HomePage() {
  return (
    <div>
      <Carousel />

      {/* Hero Title Section */}
      <div className="hero-section">
        <div className="hero-inner">

          {/* Card: Bienvenidos */}
          <div className="hero-card card-bienvenidos">
            <h1>✦ Bienvenidos ✦</h1>
          </div>

          {/* Card: Liga Deportiva */}
          <div className="hero-card card-liga">
            <h1>Liga Deportiva Barrial Divino Niño</h1>

            {/* Estrellas decorativas */}
            <div className="stars">
              <span className="star-sm">★</span>
              <span className="star-lg">★</span>
              <span className="star-sm">★</span>
            </div>

            {/* Subtítulo */}
            <p className="hero-subtitle" >
              Uniendo a nuestra comunidad a través del deporte y la pasión por el fútbol
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HomePage;