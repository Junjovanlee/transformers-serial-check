'use client';

import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head'; // Import Head dari next/head

export default function Home() {
  const [serial, setSerial] = useState('');
  const [name, setName] = useState('');
  let [whatsappNumber, setWhatsappNumber] = useState('');
  const [dob, setDob] = useState('');
  const [location, setLocation] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false); // State untuk memeriksa apakah kita di client-side

  // Pastikan kita hanya melakukan render di client-side
  useEffect(() => {
    setIsClient(true); // Set isClient menjadi true setelah komponen dirender di client-side
  }, []);

  const handleCheck = async () => {
    if (!serial.trim() || !whatsappNumber.trim() || !dob.trim() || !location.trim()) return;

    if (!whatsappNumber.startsWith('+62')) {
      whatsappNumber = '+62' + whatsappNumber.replace(/^0/, ''); 
    }

    setLoading(true);
    setResult(null);

    const body = new URLSearchParams();
    body.append('serial', serial);
    body.append('name', name);
    body.append('dob', dob);
    body.append('location', location);
    body.append('whatsapp', whatsappNumber);

    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbxpfbUgyjS27tpB2vcrCbXX78qKeoWJ8DqvaKyGI5WzCUaYN_MSMc3u4YOkfM95GOx9/exec',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: body,
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Gagal cek serial:', error);
      setResult({ status: 'error' });
    }

    setLoading(false);
  };

  // Format Tanggal
  const formatDate = (dateString) => {
    const d = new Date(dateString); // Membuat objek Date dari dateString
    const day = String(d.getDate()).padStart(2, '0'); // Mendapatkan tanggal dan menambah awalan 0 jika perlu
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Mendapatkan bulan dan menambah awalan 0 jika perlu
    const year = d.getFullYear(); // Mendapatkan tahun
  
    return `${day}-${month}-${year}`; // Mengembalikan hasil dalam format dd-mm-yyyy
  };
  

  const handleWhatsappChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); 
    setWhatsappNumber(value);
  };

  const renderResult = () => {
    if (!result) return null;

    if (result.status === 'activated') {
      return (
        <div className="alert alert-success mt-4">
          ✅ Serial valid! Garansi aktif pada: {formatDate(result.date)}<br />
          <strong>Nama Pembeli:</strong> {result.name}<br />
          <strong>Tanggal Lahir:</strong> {formatDate(result.dob)}<br />
          <strong>Lokasi:</strong> {result.location}<br />
          <strong>WhatsApp:</strong> {result.whatsapp}<br />
          <strong>Nomor Seri:</strong> {result.serial}
        </div>
      );
    }

    if (result.status === 'already_activated') {
      return <div className="alert alert-warning mt-4">⚠️ Serial sudah pernah diaktivasi pada: {formatDate(result.date)}</div>;
    }

    if (result.status === 'not_found') {
      return <div className="alert alert-danger mt-4">❌ Nomor Serial Number Produk Tidak Ditemukan!</div>;
    }

    if (result.status === 'error') {
      return <div className="alert alert-danger mt-4">❌ Gagal menghubungi server. Coba lagi nanti.</div>;
    }
  };

  // Pastikan render hanya dilakukan di client-side
  if (!isClient) {
    return null; // Prevent rendering until we're on the client
  }

  return (
    <div>
      <Head>
        <title>Transformers Official Indonesia</title> {/* Title di sini */}
        <meta name="description" content="Verifikasi garansi dan keaslian produk Transformers Anda." />
      </Head>
      
      {/* Toko Name Section */}
      <header className="text-center py-2 bg-dark text-white">
  <h2 className="display-4">TRANSFORMERS OFFICIAL INDONESIA</h2>
</header>

      {/* Hero Section */}
      <header className="bg-dark text-white text-center py-3">
  <img
    src="images/Banner.jpg" // Pastikan gambar ada di folder public
    alt="Transformers Banner"
    className="img-fluid mb-4"
    style={{ maxHeight: '400px', objectFit: 'cover' }}
  />
  <h1 className="display-4">Cek Keaslian Produk Transformers</h1>
  <p className="lead">Verifikasi garansi dan keaslian produk Transformers Anda dengan mudah.</p>
</header>

      {/* Form Section */}
      <main className="container my-5">
        <form action="/submit" method="POST">
          <div className="mb-3">
            <label htmlFor="serial" className="form-label">Serial Number</label>
            <input type="text" id="serial" name="serial" className="form-control" value={serial} onChange={(e) => setSerial(e.target.value)} disabled={loading} required />
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nama Pembeli</label>
            <input type="text" id="name" name="name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} required />
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Nomor Telepon</label>
            <input type="tel" id="phone" name="phone" className="form-control" value={whatsappNumber} onChange={handleWhatsappChange} disabled={loading} required />
          </div>

          <div className="mb-3">
            <label htmlFor="dob" className="form-label">Tanggal Lahir</label>
            <input type="date" id="dob" name="dob" className="form-control" value={dob} onChange={(e) => setDob(e.target.value)} disabled={loading} required />
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">Kota</label>
            <input type="text" id="address" name="address" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} disabled={loading} required />
          </div>

          <button type="button" className="btn btn-warning w-100" onClick={handleCheck} disabled={loading}>
            {loading ? 'Memeriksa...' : 'Cek Sekarang'}
          </button>
        </form>
        {renderResult()}
      </main>

      {/* Footer */}
      <footer className="text-center py-3 bg-dark text-white">
        <p>© 2025 Transformers Official Store</p>
      </footer>
    </div>
  );
}