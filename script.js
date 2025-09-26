let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = ()=> {
       menuIcon.classList.toggle("bx-x")
       navbar.classList.toggle("active")
}

const form = document.getElementById('contact-form');
const sendBtn = document.getElementById('sendBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  sendBtn.disabled = true;
  sendBtn.value = 'Gönderiliyor...';

  const formData = new FormData(form);
  const data = Object.fromEntries(formData); // { Ad: "...", Mail: "...", ... }

  // --- 1) Formspree örneği ---
  const endpoint = "https://formspree.io/f/mjkenjjb"; // kendi ID'ni koy
  // --- Eğer Web3Forms kullanıyorsan endpoint ve body farklı olacak, örnek aşağıda. ---

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const text = await res.text();
    console.log("HTTP status:", res.status);
    console.log("Raw response:", text);

    // JSON ise parse et
    let json = null;
    try { json = JSON.parse(text); console.log("Parsed JSON:", json); } catch(err) {}

    if (res.ok) {
      alert("Mesaj başarıyla gönderildi!");
      form.reset();
    } else {
      // Sunucunun döndürdüğü hatayı göster
      const serverMsg = (json && (json.error || json.message)) || text || `Status ${res.status}`;
      alert("Bir hata oluştu: " + serverMsg);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Bağlantı hatası: Konsolu kontrol et (CORS veya ağ hatası olabilir).");
  } finally {
    sendBtn.disabled = false;
    sendBtn.value = 'Mesaj Gönder';
  }
});

