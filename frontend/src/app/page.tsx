"use client";
import Table from './components/Table'
import { useEffect, useState } from "react";

export default function Home() {
  const [contacts, setContacts] = useState([])

  const fetchContacts = async (accessToken) => {
    const res = await fetch('http://localhost/hubspot/contacts.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ access_token: accessToken }),
    });
    if (!res.ok) {
      throw new Error('API Error!!!');
    }

    const json = await res.json();
    setContacts(json);
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');

    if (accessToken) {
      localStorage.setItem('hubspot_access_token', accessToken);
      fetchContacts(accessToken);
    } else {
      const storedToken = localStorage.getItem('hubspot_access_token');
      if (storedToken) {
        fetchContacts(storedToken);
      }
    }
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Table contacts={contacts} />
    </main>
  );
}
