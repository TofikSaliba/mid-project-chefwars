import { useState } from "react";
import "./contact.css";

function Contact() {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  return (
    <div className="contactContainer">
      <form>
        <h1>Contact Us</h1>
        <input
          id="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          placeholder="Name..."
        />
        <input
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="E-mail..."
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
        />
        <button type="submit">Submit</button>
      </form>
      <div className="rightMessage">
        We will get back to you within 24 hours!
      </div>
    </div>
  );
}

export default Contact;
