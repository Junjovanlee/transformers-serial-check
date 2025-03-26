'use client';

import { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head'; // Import Head dari next/head
import './styles.css'; // Pastikan untuk mengimpor file CSS
import ReCAPTCHA from 'react-google-recaptcha'; // Import reCAPTCHA

export default function Home() {
  const [serial, setSerial] = useState('');
  const [name, setName] = useState('');
  let [whatsappNumber, setWhatsappNumber] = useState('');
  const [dob, setDob] = useState('');
  const [location, setLocation] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [isClient, setIsClient] = useState(false); // State untuk memeriksa apakah kita di client-side
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false); // State untuk memeriksa apakah CAPTCHA sudah diverifikasi
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State untuk disable button

  const resultRef = useRef(null); // Ref untuk menandai tempat notifikasi muncul

  // Pastikan kita hanya melakukan render di client-side
  useEffect(() => {
    setIsClient(true); // Set isClient menjadi true setelah komponen dirender di client-side
  }, []);

  // Menambahkan fungsi untuk scroll otomatis
  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll halus ke notifikasi
    }
  }, [result]); // Akan dipanggil setiap kali `result` berubah

  const handleCheck = async () => {
    if (!serial.trim() || !whatsappNumber.trim() || !dob.trim() || !location.trim() || !captchaToken) return; // Pastikan CAPTCHA sudah ada

    if (!whatsappNumber.startsWith('+62')) {
      whatsappNumber = '+62' + whatsappNumber.replace(/^0/, ''); 
    }

    setLoading(true);
    setResult(null);
    setIsButtonDisabled(true); // Disable button saat proses berjalan

    const body = new URLSearchParams();
    body.append('serial', serial);
    body.append('name', name);
    body.append('dob', dob);
    body.append('location', location);
    body.append('whatsapp', whatsappNumber);
    body.append('captchaToken', captchaToken); // Kirim token CAPTCHA

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
      if (data.status === 'activated') {
        setIsCaptchaVerified(true); // Menandai bahwa CAPTCHA sudah diverifikasi dan berhasil
      }

      // Reset CAPTCHA jika status adalah 'already_activated' atau 'not_found'
      if (data.status === 'already_activated' || data.status === 'not_found') {
        setCaptchaToken('');
        setIsCaptchaVerified(false); // Menandai bahwa CAPTCHA perlu diulang
      }
    } catch (error) {
      console.error('Gagal cek serial:', error);
      setResult({ status: 'error' });
    }

    setLoading(false);
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString); // Membuat objek Date dari dateString
    const day = String(d.getDate()).padStart(2, '0'); // Mendapatkan tanggal dan menambah awalan 0 jika perlu
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Mendapatkan bulan dan menambah awalan 0 jika perlu
    const year = d.getFullYear(); // Mendapatkan tahun
  
    return `${day}-${month}-${year}`; // Mengembalikan hasil dalam format dd-mm-yyyy
  };

  const handleWhatsappChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Hanya mengizinkan angka
    setWhatsappNumber(value); // Menyimpan nilai nomor WhatsApp yang hanya angka
  };

  const renderResult = () => {
    if (!result) return null;

    if (result.status === 'activated') {
      return (
        <div ref={resultRef} className="alert alert-success mt-4">
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
      return <div ref={resultRef} className="alert alert-warning mt-4">⚠️ Serial sudah pernah diaktivasi pada: {formatDate(result.date)}</div>;
    }

    if (result.status === 'not_found') {
      return <div ref={resultRef} className="alert alert-danger mt-4">❌ Nomor Serial Number Produk Tidak Ditemukan!</div>;
    }

    if (result.status === 'error') {
      return <div ref={resultRef} className="alert alert-danger mt-4">❌ Gagal menghubungi server. Coba lagi nanti.</div>;
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
        <div className="d-flex flex-wrap justify-content-center align-items-center mb-4">
          <p className="lead mb-0 me-2">Temukan kami disini :</p>
          <a href="https://shopee.co.id/shop/1325393615" className="btn btn-gradient-red me-2 mb-2">Shopee</a>
          <a href="https://shopee.co.id/transformersstoreindonesia" className="btn btn-gradient-red me-2 mb-2">Shopee Mall</a>
          <a href="https://www.tokopedia.com/transformers-indonesia" className="btn btn-gradient-red me-2 mb-2">Tokopedia</a>
          <a href="https://vt.tiktok.com/ZSMxBjVKk/" className="btn btn-gradient-red mb-2">Tiktok</a>
        </div>
      </header>

      {/* Form Section */}
      <main className="container my-5">
        <form action="/submit" method="POST">
          <div className="mb-3">
            <label htmlFor="serial" className="form-label">Serial Number</label>
            <input type="text" id="serial" name="serial" className="form-control" value={serial} onChange={(e) => setSerial(e.target.value)} disabled={loading || isButtonDisabled} required />
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nama Pembeli</label>
            <input type="text" id="name" name="name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} disabled={loading || isButtonDisabled} required />
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Nomor Telepon</label>
            <input type="tel" id="phone" name="phone" className="form-control" value={whatsappNumber} onChange={handleWhatsappChange} disabled={loading || isButtonDisabled} required />
          </div>

          <div className="mb-3">
            <label htmlFor="dob" className="form-label">Tanggal Lahir</label>
            <input type="date" id="dob" name="dob" className="form-control" value={dob} onChange={(e) => setDob(e.target.value)} disabled={loading || isButtonDisabled} required />
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">Kota</label>
            <input type="text" id="address" name="address" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} disabled={loading || isButtonDisabled} required />
          </div>

          {/* CAPTCHA */}
          <div className="mb-3">
            <ReCAPTCHA
              sitekey="6LevtQArAAAAAEjo8fGnnPGqBvENUuO9Jf8RNwiB"
              onChange={(token) => {
                setCaptchaToken(token);
                setIsCaptchaVerified(false); // Reset CAPTCHA setelah verifikasi
              }} 
            />
          </div>

          <button type="button" className="btn btn-gradient-red w-100" onClick={handleCheck} disabled={loading || isButtonDisabled}>
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
