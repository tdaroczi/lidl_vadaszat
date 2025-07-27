// Importáljuk be a Firebase-hez szükséges funkciókat az index.html-ben létrehozott modulból
import { auth, db } from './firebase-init.js'; // This will work because index.html handles the initialization and export
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { 
  doc, 
  getDoc, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Az üzletek listája változatlan
const STORES = [
    // Ide jön a teljes, 199 üzletet tartalmazó lista, amit korábban adtam.
    // A rövidség kedvéért most csak néhány példát hagyok itt.
    {id: 260896313, name: "Lidl", address: "1051 Budapest, Arany János utca 27-29", lat: 47.5021289, lng: 19.0528886},
    {id: 1796395943, name: "Lidl", address: "1068 Budapest, Király utca 112", lat: 47.5071915, lng: 19.0717499},
    {id: 11327147, name: "Lidl", address: "1044 Budapest, Megyeri út 53", lat: 47.5877561, lng: 19.0992336},
    {id: 18479968, name: "Lidl", address: "4600 Kisvárda, Attila út 2/A", lat: 48.2098048, lng: 22.076219}
];


// HTML elemek elérése
const authContainer = document.getElementById('auth-container');
const visitedTbody = document.querySelector('#visited tbody');
const unvisitedTbody = document.querySelector('#unvisited tbody');
const visitedCountSpan = document.getElementById('visited-count');
const unvisitedCountSpan = document.getElementById('unvisited-count');

// Térkép inicializálása
const map = L.map('map').setView([47.2, 19.5], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution:'© OpenStreetMap'}).addTo(map);

let visited = [];
let currentUser = null;

// --- ÚJ RÉSZ: FIREBASE FUNKCIÓK ---

/**
 * Figyeljük a bejelentkezési állapot változását.
 * Ez a program központi vezérlője. Akkor fut le, ha valaki be- vagy kijelentkezik.
 */
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (user) {
    // Ha a felhasználó be van jelentkezve:
    console.log("Bejelentkezve:", user.displayName);
    authContainer.innerHTML = `Szia, ${user.displayName}! <button id="logout-btn">Kijelentkezés</button>`;
    document.getElementById('logout-btn').addEventListener('click', handleSignOut);
    
    // Töltsük be a mentett boltjait az adatbázisból
    loadVisitedStores();
  } else {
    // Ha a felhasználó ki van jelentkezve:
    console.log("Kijelentkezve.");
    authContainer.innerHTML = `<button id="login-btn">Bejelentkezés Google fiókkal</button>`;
    document.getElementById('login-btn').addEventListener('click', handleSignIn);
    
    // Töröljük a listákat és nullázzuk a számlálókat
    visited = [];
    renderAll();
  }
});

/**
 * Bejelentkezés Google fiókkal
 */
async function handleSignIn() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Hiba a bejelentkezés során:", error);
  }
}

/**
 * Kijelentkezés
 */
async function handleSignOut() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Hiba a kijelentkezés során:", error);
  }
}

/**
 * Adatok betöltése a Firestore adatbázisból
 */
async function loadVisitedStores() {
  if (!currentUser) return;
  
  // Hivatkozás a felhasználó saját "dokumentumára" az adatbázisban a felhasználói ID-ja alapján
  const userDocRef = doc(db, "users", currentUser.uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    // Ha már van mentett listája, betöltjük
    visited = docSnap.data().visited || [];
  } else {
    // Ha még nincs neki (új felhasználó), üres listával kezd
    visited = [];
  }
  
  // Betöltés után mindent újrarenderelünk az adatok alapján
  renderAll();
}

/**
 * Mentés a Firestore-ba (a régi localStorage-os save() függvény helyett)
 */
async function saveVisitedStores() {
  if (!currentUser) return;
  
  const userDocRef = doc(db, "users", currentUser.uid);
  try {
    // Elmentjük a teljes 'visited' listát a felhasználó dokumentumába
    await setDoc(userDocRef, { visited: visited });
  } catch (error) {
    console.error("Hiba a mentés során:", error);
  }
}

// --- MEGLÉVŐ LOGIKA KIS ÁTALAKÍTÁSSAL ---

/**
 * Táblázatok renderelése a 'visited' lista alapján
 */
function renderTables() {
  visitedTbody.innerHTML = '';
  unvisitedTbody.innerHTML = '';

  STORES.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${s.name}</td><td>${s.address}</td>`;
    (visited.includes(s.id) ? visitedTbody : unvisitedTbody).appendChild(tr);
  });
  
  visitedCountSpan.textContent = visited.length;
  unvisitedCountSpan.textContent = STORES.length - visited.length;
}

/**
 * Markerek létrehozása és a checkboxok állapotának beállítása a 'visited' lista alapján
 */
function renderMarkers() {
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    STORES.forEach(s => {
        const marker = L.marker([s.lat, s.lng]).addTo(map);
        const isVisited = visited.includes(s.id);
        const checkbox = `<label><input type="checkbox" data-id="${s.id}" ${isVisited ? 'checked' : ''}> Meglátogattam</label>`;
        marker.bindPopup(`<b>${s.name}</b><br>${s.address}<br>${checkbox}`);
    });
}

/**
 * Egy közös renderelő függvény, ami a teljes felületet frissíti
 */
function renderAll() {
    renderTables();
    renderMarkers();
}

/**
 * Checkbox eseménykezelője
 */
document.addEventListener('change', e => {
  if (!e.target.matches('input[type=checkbox]')) return;
  
  // Csak akkor engedélyezzük a pipálást, ha a felhasználó be van jelentkezve
  if (!currentUser) {
    alert("A boltok megjelöléséhez kérlek jelentkezz be!");
    e.target.checked = !e.target.checked; // Visszaállítjuk a pipát, ha nincs bejelentkezve
    return;
  }
  
  const id = +e.target.dataset.id;
  if (e.target.checked) {
    if (!visited.includes(id)) visited.push(id);
  } else {
    visited = visited.filter(v => v !== id);
  }
  
  renderTables(); // Táblázat azonnali frissítése a jobb felhasználói élményért
  saveVisitedStores(); // Mentés az adatbázisba a háttérben
});
