import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ContactPage = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // TODO: send to backend /api/contact
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setSubject('');
      setMessage('');
    } catch (err) {
      alert('Failed to send');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      {success && <p className="text-green-600">Message sent! We'll get back soon.</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium">Subject</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required className="w-full border rounded p-2" />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Message</label>
          <textarea rows="5" value={message} onChange={(e) => setMessage(e.target.value)} required className="w-full border rounded p-2" />
        </div>
        <button type="submit" disabled={sending} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {sending ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactPage;