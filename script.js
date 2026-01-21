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

document.addEventListener('DOMContentLoaded', function() {
    const username = 'KaganYildirimJuniorDev'; 
    const container = document.getElementById('github-content');
    
    // Hafıza Ayarları (Token derdi yok, kota derdi yok)
    const CACHE_KEY = 'github_data_v2';
    const CACHE_TIME = 'github_time_v2';
    const EXPIRE_TIME = 1000 * 60 * 60; // 1 Saat hafızada tut

    if (!container) return;

    // Arayüzü Güncelleme Fonksiyonu
    function renderGitHubCard(data) {
        container.innerHTML = `
            <img src="${data.avatar_url}" alt="${data.login}" class="github-avatar">
            <div class="github-info">
                <h3>${data.login}</h3>
                <p>${data.bio ? data.bio : 'Yazılım Mühendisliği & Siber Vatan Öğrencisi'}</p>
                <div class="github-stats">
                    <div class="github-stat-item"><span>${data.public_repos}</span><small>Repo</small></div>
                    <div class="github-stat-item"><span>${data.followers}</span><small>Takipçi</small></div>
                    <div class="github-stat-item"><span>${data.following}</span><small>Takip</small></div>
                </div>
                <a href="${data.html_url}" target="_blank" class="github-btn">
                    <i class="fab fa-github"></i> GitHub Profiline Git
                </a>
            </div>
        `;
        container.style.justifyContent = 'flex-start';
    }

    // 1. Önce Hafızaya Bak
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME);
    const now = new Date().getTime();

    if (cachedData && cachedTime && (now - cachedTime < EXPIRE_TIME)) {
        console.log("✅ GitHub verisi hafızadan yüklendi (Kota harcanmadı).");
        renderGitHubCard(JSON.parse(cachedData));
        return; // İşlem bitti, GitHub'a gitme
    }

    // 2. Hafızada yoksa veya eskiyse GitHub'a git (TOKEN YOK)
    console.log("🌍 GitHub'dan yeni veri çekiliyor...");
    fetch(`https://api.github.com/users/${username}`)
        .then(response => {
            if (!response.ok) {
                // Kota dolmuşsa (403 hatası)
                if(response.status === 403) throw new Error("Kota Doldu");
                throw new Error("Veri Alınamadı");
            }
            return response.json();
        })
        .then(data => {
            renderGitHubCard(data);
            // Veriyi hafızaya kaydet
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(CACHE_TIME, now);
        })
        .catch(error => {
            console.error(error);
            // Hata olursa (Kota dolarsa) manuel kart göster
            container.innerHTML = `
                <div style="text-align: center; color: #e50914; padding: 20px;">
                    <h3>KaganYildirim</h3>
                    <p>Yazılım Mühendisliği & Siber Vatan Öğrencisi</p>
                    <a href="https://github.com/${username}" target="_blank" class="github-btn">GitHub'a Git</a>
                </div>
            `;
        });
});
