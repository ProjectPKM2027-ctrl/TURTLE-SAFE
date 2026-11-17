// ==========================================
// TURTLE-SAFE | NAVIGASI, LOGIN, DAN PETA
// ==========================================

const AKUN_VALID = {
    username: "admin",
    password: "turtlesafe26"
};

let riskMapInstance = null;

document.addEventListener("DOMContentLoaded", function () {
    setupLogin();
    setupNavigation();
    setupSidebar();
    setupMap();
});

// ------------------------------------------
// LOGIN DAN PROFIL
// ------------------------------------------
function setupLogin() {
    perbaruiTampilanStatusLogin();

    const loginForm = document.getElementById("login-form");
    const errorMsg = document.getElementById("login-error");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const username = document.getElementById("username")?.value.trim() || "";
            const password = document.getElementById("password")?.value.trim() || "";

            if (username === AKUN_VALID.username && password === AKUN_VALID.password) {
                sessionStorage.setItem("isLoggedIn", "true");
                if (errorMsg) errorMsg.textContent = "";
                loginForm.reset();
                tutupLogin();
                perbaruiTampilanStatusLogin();
            } else if (errorMsg) {
                errorMsg.textContent = "Username atau password salah!";
            }
        });
    }

    const profile = document.getElementById("user-profile-wrapper");
    const dropdown = document.getElementById("profile-dropdown");

    document.addEventListener("click", function (event) {
        if (profile && dropdown && !profile.contains(event.target)) {
            dropdown.classList.remove("show");
        }
    });
}

function bukaLogin() {
    const overlay = document.getElementById("login-overlay");
    if (overlay) overlay.style.display = "flex";
}

function tutupLogin() {
    const overlay = document.getElementById("login-overlay");
    const errorMsg = document.getElementById("login-error");
    if (overlay) overlay.style.display = "none";
    if (errorMsg) errorMsg.textContent = "";
}

function toggleProfileDropdown() {
    const dropdown = document.getElementById("profile-dropdown");
    if (dropdown) dropdown.classList.toggle("show");
}

function perbaruiTampilanStatusLogin() {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const loginButton = document.getElementById("btn-open-login");
    const profile = document.getElementById("user-profile-wrapper");

    if (loginButton) loginButton.style.display = isLoggedIn ? "none" : "inline-block";
    if (profile) profile.style.display = isLoggedIn ? "flex" : "none";
}

function logout() {
    sessionStorage.removeItem("isLoggedIn");
    document.getElementById("profile-dropdown")?.classList.remove("show");
    perbaruiTampilanStatusLogin();
}

// ------------------------------------------
// NAVIGASI ANTARHALAMAN
// ------------------------------------------
function bukaHalaman(targetId, clickedElement) {
    const targetPage = document.getElementById("page-" + targetId);
    if (!targetPage) return;

    document.querySelectorAll(".page-section").forEach(page => page.classList.remove("active"));
    targetPage.classList.add("active");

    document.querySelectorAll(".sidebar-menu .menu-item").forEach(menu => {
        menu.classList.toggle("active", menu.getAttribute("href") === "#" + targetId);
    });

    const activeMenu = document.querySelector('.sidebar-menu .menu-item[href="#' + targetId + '"]');
    const titleSource = activeMenu || clickedElement;
    const titleElement = titleSource?.querySelector(".menu-text") || titleSource?.querySelector("h3") || titleSource?.querySelector(".panel-heading h3") || titleSource?.querySelector("span:not(.card-link)");
    const currentPage = document.getElementById("currentPage");
    if (currentPage && titleElement) {
        currentPage.textContent = titleElement.textContent.trim();
    } else if (currentPage) {
        currentPage.textContent = targetId === "dashboard" ? "Dashboard" : targetId.replaceAll("-", " ");
    }

    // Tutup sidebar setelah memilih halaman pada layar HP.
    document.getElementById("sidebar")?.classList.remove("mobile-open");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Leaflet perlu menghitung ulang ukuran setelah kontainer peta ditampilkan.
    if (targetId === "peta-risiko" && riskMapInstance) {
        requestAnimationFrame(() => riskMapInstance.invalidateSize());
    }
}

function setupNavigation() {
    document.querySelectorAll('.sidebar-menu a[href^="#"], .dashboard-link[href^="#"], .dashboard-map-link[href^="#"]').forEach(link => {
        link.addEventListener("click", function (event) {
            const targetId = this.getAttribute("href").slice(1);
            if (!document.getElementById("page-" + targetId)) return;
            event.preventDefault();
            bukaHalaman(targetId, this);
        });
    });
}

// ------------------------------------------
// SIDEBAR DESKTOP DAN MOBILE
// ------------------------------------------
function setupSidebar() {
    const button = document.getElementById("toggleSidebar");
    const sidebar = document.getElementById("sidebar");
    const mainArea = document.querySelector(".main-area");
    if (!button || !sidebar || !mainArea) return;

    button.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 768px)").matches) {
            sidebar.classList.toggle("mobile-open");
        } else {
            sidebar.classList.toggle("collapsed");
            mainArea.classList.toggle("expanded", sidebar.classList.contains("collapsed"));
        }
    });

    window.addEventListener("resize", function () {
        if (window.matchMedia("(max-width: 768px)").matches) {
            sidebar.classList.remove("collapsed");
            mainArea.classList.remove("expanded");
        } else {
            sidebar.classList.remove("mobile-open");
        }
    });
}

// ------------------------------------------
// PETA LEAFLET (ESRI WORLD STREET MAP)
// ------------------------------------------
function setupMap() {
    const mapElement = document.getElementById("riskMap");
    if (!mapElement || typeof L === "undefined") {
        console.warn("Peta belum dapat dimuat: elemen #riskMap atau pustaka Leaflet tidak ditemukan.");
        return;
    }

    if (riskMapInstance) return;

    // Titik tengah Kawasan Konservasi Pulau Pieh
    riskMapInstance = L.map(mapElement, { zoomControl: true }).setView([-0.55, 100.15], 9);

    // Menggunakan Esri World Street Map (Bersih & Tanpa API Key)
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 19,
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, and the GIS User Community"
    }).addTo(riskMapInstance);

    setTimeout(() => {
        if (riskMapInstance) riskMapInstance.invalidateSize();
    }, 250);
}