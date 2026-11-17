
// ===================================
// ELEMEN WEBSITE
// ===================================

const sidebar = document.getElementById("sidebar");
const mainArea = document.querySelector(".main-area");
const toggleButton = document.getElementById("toggleSidebar");
const menuItems = document.querySelectorAll(".menu-item");
const currentPage = document.getElementById("currentPage");
const pages = document.querySelectorAll(".page-section");

// ===================================
// COLLAPSIBLE SIDEBAR
// ===================================

toggleButton.addEventListener("click", function () {
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle("mobile-open");
    } else {
        sidebar.classList.toggle("collapsed");
        mainArea.classList.toggle("expanded");
    }
});

// ===================================
// NAVIGASI HALAMAN
// ===================================

function navigateToPage(target) {
    const targetPage = document.getElementById("page-" + target);

    if (!targetPage) return;

    // Sembunyikan semua halaman
    pages.forEach(function (page) {
        page.classList.remove("active");
    });

    // Tampilkan halaman tujuan
    targetPage.classList.add("active");

    // Perbarui menu sidebar
    menuItems.forEach(function (menu) {
        menu.classList.remove("active");

        if (menu.getAttribute("href") === "#" + target) {
            menu.classList.add("active");
        }
    });

    // Perbarui judul halaman
    const activeMenu = document.querySelector(
        '.menu-item[href="#' + target + '"]'
    );

    if (activeMenu) {
        currentPage.textContent =
            activeMenu.querySelector(".menu-text").textContent;
    }

    // Kembali ke atas
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    // Tutup sidebar pada perangkat mobile
    if (window.innerWidth <= 768) {
        sidebar.classList.remove("mobile-open");
    }

    // Jalankan peta ketika halaman peta dibuka
    if (target === "peta-risiko") {
        setTimeout(initializeRiskMap, 300);
    }
}

// ===================================
// KLIK MENU SIDEBAR
// ===================================

menuItems.forEach(function (item) {
    item.addEventListener("click", function (event) {
        event.preventDefault();

        const target = item.getAttribute("href").replace("#", "");

        navigateToPage(target);
    });
});

// ===================================
// KLIK KARTU DASHBOARD
// ===================================

const dashboardLinks = document.querySelectorAll(
    ".dashboard-link, .dashboard-map-link"
);

dashboardLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
        event.preventDefault();

        const target = link.getAttribute("href").replace("#", "");

        navigateToPage(target);
    });
});

// ===================================
// PETA INTERAKTIF TURTLE-SAFE
// ===================================

// ===================================
// PETA INTERAKTIF TURTLE-SAFE
// ===================================

let riskMap = null;

function initializeRiskMap() {
    const mapElement = document.getElementById("riskMap");

    if (!mapElement) {
        console.error("Elemen riskMap tidak ditemukan.");
        return;
    }

    if (typeof L === "undefined") {
        console.error("Leaflet belum berhasil dimuat.");
        return;
    }

    // Buat peta hanya satu kali
    if (riskMap === null) {
        riskMap = L.map("riskMap").setView(
            [-0.45, 99.95],
            10
        );

        // Peta dasar menggunakan CartoDB Voyager (Aman dari blokir OSM & cocok untuk web)
        // Peta dasar menggunakan Esri World Imagery (Satelit, Gratis & Tanpa API Key)
        L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
                attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
                maxZoom: 19
            }
        ).addTo(riskMap);

        // Penanda lokasi pengamatan
        L.marker([-0.45, 99.95])
            .addTo(riskMap)
            .bindPopup(
                "<b>Kawasan Konservasi Pulau Pieh</b><br>Wilayah pengamatan TURTLE-SAFE"
            );
    }

    // Sesuaikan ukuran peta
    setTimeout(function () {
        riskMap.invalidateSize();
    }, 300);
}
// ==========================================
// SISTEM LOGIN SEDERHANA TURTLE-SAFE
// ==========================================
const AKUN_VALID = {
    username: "admin",       // Ganti username sesuai keinginanmu
    password: "turtlesafe26" // Ganti password sesuai keinginanmu
};

document.addEventListener("DOMContentLoaded", function () {
    const loginOverlay = document.getElementById("login-overlay");
    const loginForm = document.getElementById("login-form");
    const errorMsg = document.getElementById("login-error");

    // Cek apakah user sudah login di sesi browser ini
    if (sessionStorage.getItem("isLoggedIn") === "true") {
        loginOverlay.style.display = "none";
    }

    // Saat form login disubmit
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            
            const userInput = document.getElementById("username").value.trim();
            const passInput = document.getElementById("password").value.trim();

            if (userInput === AKUN_VALID.username && passInput === AKUN_VALID.password) {
                sessionStorage.setItem("isLoggedIn", "true");
                loginOverlay.style.display = "none";
                errorMsg.textContent = "";
            } else {
                errorMsg.textContent = "Username atau password salah!";
            }
        });
    }
});

// Fungsi untuk keluar (Logout)
function logout() {
    sessionStorage.removeItem("isLoggedIn");
    location.reload();
}
// ==========================================
// SISTEM LOGIN OPSIONAL & MENU PROFIL
// ==========================================
const AKUN_VALID = {
    username: "admin",
    password: "turtlesafe26"
};

document.addEventListener("DOMContentLoaded", function () {
    perbaruiTampilanStatusLogin();

    const loginForm = document.getElementById("login-form");
    const errorMsg = document.getElementById("login-error");

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            
            const userInput = document.getElementById("username").value.trim();
            const passInput = document.getElementById("password").value.trim();

            if (userInput === AKUN_VALID.username && passInput === AKUN_VALID.password) {
                sessionStorage.setItem("isLoggedIn", "true");
                errorMsg.textContent = "";
                loginForm.reset();
                tutupLogin();
                perbaruiTampilanStatusLogin();
            } else {
                errorMsg.textContent = "Username atau password salah!";
            }
        });
    }

    // Menutup dropdown profil jika pengguna mengklik area lain di luar profil
    window.addEventListener("click", function (e) {
        const wrapper = document.getElementById("user-profile-wrapper");
        const dropdown = document.getElementById("profile-dropdown");
        if (wrapper && dropdown && !wrapper.contains(e.target)) {
            dropdown.classList.remove("show");
        }
    });
});

function bukaLogin() {
    document.getElementById("login-overlay").style.display = "flex";
}

function tutupLogin() {
    document.getElementById("login-overlay").style.display = "none";
    document.getElementById("login-error").textContent = "";
}

function toggleProfileDropdown() {
    const dropdown = document.getElementById("profile-dropdown");
    if (dropdown) {
        dropdown.classList.toggle("show");
    }
}

function perbaruiTampilanStatusLogin() {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const btnLogin = document.getElementById("btn-open-login");
    const profileWrapper = document.getElementById("user-profile-wrapper");

    if (btnLogin && profileWrapper) {
        if (isLoggedIn) {
            btnLogin.style.display = "none";
            profileWrapper.style.display = "flex";
        } else {
            btnLogin.style.display = "inline-block";
            profileWrapper.style.display = "none";
        }
    }
}

function logout() {
    sessionStorage.removeItem("isLoggedIn");
    const dropdown = document.getElementById("profile-dropdown");
    if (dropdown) dropdown.classList.remove("show");
    perbaruiTampilanStatusLogin();
}