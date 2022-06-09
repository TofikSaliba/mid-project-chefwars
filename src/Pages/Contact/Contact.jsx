import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { addDoc, doc, collection } from "firebase/firestore";
import "./contact.css";

function Contact() {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [popUp, setPopUp] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "contactMessages"), {
        title: title,
        name: name,
        email: email,
        message: message,
      });
    } catch (err) {
      console.log(err.message);
    } finally {
      setPopUp(true);
      setTitle("");
      setName("");
      setEmail("");
      setMessage("");
    }
  };

  return (
    <div className="contactContainer">
      {popUp && (
        <div className="popUp">
          <div>
            <h2>Your submition was completed successfully! Thank you.</h2>
            <button onClick={() => setPopUp(false)}>Close</button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <h1>Contact Us</h1>
        <input
          id="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          placeholder="Name..."
          required
        />
        <input
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="E-mail..."
          required
        />
        <input
          id="title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          type="text"
          placeholder="Subject..."
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          name="message"
          id="message"
          placeholder="Your description here..."
          required
        />
        <button type="submit">Submit</button>
      </form>
      <div className="rightMessage">
        <h2>Another option at:</h2>
        <div>
          Phone: <span>088-477-777</span>
        </div>
        <span>OR</span>
        <div>
          Email: <span>Service@Chefwars.com</span>
        </div>
        <div>
          Our dear users you are so important to us!
          <br />
          <br />
          <span>We will get back to you within 24 hours!</span>
        </div>
      </div>
    </div>
  );
}

export default Contact;
