import about from "../../assets/images/About.jpg";
import aboutSmall from "../../assets/images/aboutSmall.jpeg";
import { NavLink } from "react-router-dom";
import "./about.css";

function About() {
  return (
    <div className="aboutPage">
      <img src={about} alt="about" />
      <div className="aboutContainer">
        <div className="aboutText">
          <h1>Our Story Goes Something Like This...</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Necessitatibus amet accusamus dignissimos accusantium pariatur dicta
            qui incidunt nam nobis quia dolorum, totam, esse distinctio debitis
            in aliquam quisquam.
            <br />
            <br />
            Neque obcaecati molestias explicabo? Consectetur aperiam mollitia
            iste perferendis hic dolore reprehenderit aspernatur eum eligendi
            quam impedit, fugiat rem in consequatur, sapiente natus. Impedit
            provident beatae accusamus. Perferendis, esse. Sint necessitatibus
            harum molestias totam laboriosam, reprehenderit delectus. Cum vero
            nesciunt inventore explicabo blanditiis, accusamus voluptate
            repellendus omnis, nulla vitae iusto deserunt illum dicta excepturi
            in doloremque dolores porro! Aliquam inventore natus odit repellat,
            debitis dicta reprehenderit, ducimus mollitia labore provident,
            officia deleniti ea.
            <br />
            <br />
            Sequi libero rem distinctio eum, at ad facilis incidunt, dolore qui
            fugiat iure error dignissimos nostrum minima et, fuga possimus quia?
            Veniam, est laborum? Quis laudantium voluptas harum accusamus. Eius,
            aperiam reprehenderit fugiat quae magnam mollitia beatae odit sint
            aliquid numquam repudiandae quasi quisquam consequuntur nulla error
            dolorem deleniti a recusandae voluptas voluptates ipsa obcaecati
            quidem quas? Magni, pariatur nemo quidem dolorem ab consequuntur
            unde? Eius natus quasi, quisquam veniam ea sunt ex qui cupiditate
            deleniti.
            <br />
            <br />
            Dignissimos, quis ab nemo alias? Iusto eveniet accusantium harum et
            unde tenetur? Similique et laboriosam quas. Ratione quae, laudantium
            optio laborum facilis quas.
          </p>
        </div>
        <div className="contactUsContainer">
          <div className="contactUs">
            If you have any questions don't hesitate ask! you are weclome to
            contact us{" "}
            <NavLink to="/Contact">
              <button>Here</button>
            </NavLink>
          </div>
          <img src={aboutSmall} alt="sideImg" />
        </div>
      </div>
    </div>
  );
}

export default About;
