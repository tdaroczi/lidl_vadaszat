// Bővített adatbázis az OpenStreetMap adatai alapján
const STORES = [
  {id:257334759, name:"Lidl", address:"1148 Budapest, Örs vezér tere 25.", lat:47.5028, lng:19.1274},
  {id:257334762, name:"Lidl", address:"1106 Budapest, Kerepesi út 73.", lat:47.4947, lng:19.1472},
  {id:257334768, name:"Lidl", address:"1173 Budapest, Pesti út 2.", lat:47.4727, lng:19.2568},
  {id:257938361, name:"Lidl", address:"1039 Budapest, Heltai Jenő tér 7.", lat:47.5878, lng:19.0667},
  {id:298836561, name:"Lidl", address:"2040 Budaörs, Kinizsi utca 1-3.", lat:47.4589, lng:18.9610},
  {id:299230553, name:"Lidl", address:"2100 Gödöllő, Bossányi Krisztina utca 2.", lat:47.5953, lng:19.3621},
  {id:321583803, name:"Lidl", address:"2700 Cegléd, Kossuth Ferenc utca 21-23.", lat:47.1774, lng:19.8055},
  {id:346808799, name:"Lidl", address:"5000 Szolnok, Jubileum tér 1.", lat:47.1683, lng:20.2081},
  {id:410663702, name:"Lidl", address:"6000 Kecskemét, Izsáki út 12.", lat:46.8929, lng:19.6732},
  {id:410664971, name:"Lidl", address:"6500 Baja, Szegedi út 82.", lat:46.1691, lng:18.9568},
  {id:428234898, name:"Lidl", address:"7622 Pécs, Bajcsy-Zsilinszky utca 11.", lat:46.0768, lng:18.2268},
  {id:428234900, name:"Lidl", address:"7100 Szekszárd, Rákóczi utca 141.", lat:46.3653, lng:18.6946},
  {id:428234903, name:"Lidl", address:"7400 Kaposvár, Áchim András utca 2.", lat:46.3602, lng:17.7788},
  {id:477936162, name:"Lidl", address:"8000 Székesfehérvár, Budai út 157.", lat:47.2023, lng:18.4384},
  {id:477936165, name:"Lidl", address:"8800 Nagykanizsa, Dózsa György utca 135.", lat:46.4632, lng:16.9839},
  {id:477936166, name:"Lidl", address:"8900 Zalaegerszeg, Ola utca 1.", lat:46.8404, lng:16.8285},
  {id:477936171, name:"Lidl", address:"8200 Veszprém, Érseki utca 1.", lat:47.1039, lng:17.9056},
  {id:503233633, name:"Lidl", address:"9400 Sopron, Bánfalvi út 18.", lat:47.6749, lng:16.5822},
  {id:503233634, name:"Lidl", address:"9024 Győr, Tihanyi Árpád út 83.", lat:47.6702, lng:17.6568},
  {id:503233635, name:"Lidl", address:"9700 Szombathely, Körmendi út 52-54.", lat:47.2185, lng:16.6111},
  {id:539957771, name:"Lidl", address:"4400 Nyíregyháza, Pazonyi út 37.", lat:47.9712, lng:21.7226},
  {id:539957772, name:"Lidl", address:"4031 Debrecen, Kishatár út 1.", lat:47.5510, lng:21.5975},
  {id:539957773, name:"Lidl", address:"3527 Miskolc, József Attila utca 87.", lat:48.0934, lng:20.8066},
  {id:539957774, name:"Lidl", address:"3300 Eger, Rákóczi Ferenc út 95.", lat:47.9126, lng:20.3719},
  {id:539957775, name:"Lidl", address:"3100 Salgótarján, Bajcsy-Zsilinszky út 16.", lat:48.0877, lng:19.7946},
  {id:1068864932, name:"Lidl", address:"1046 Budapest, Fóti út 16.", lat:47.5732, lng:19.1086},
  {id:1071277874, name:"Lidl", address:"1221 Budapest, Gádor utca 113.", lat:47.4101, lng:19.0200},
  {id:1123547225, name:"Lidl", address:"1031 Budapest, Szentendrei út 259.", lat:47.5759, lng:19.0537},
  {id:1387611030, name:"Lidl", address:"1117 Budapest, Fehérvári út 211.", lat:47.4475, lng:19.0436},
  {id:1499554378, name:"Lidl", address:"1191 Budapest, Üllői út 249.", lat:47.4616, lng:19.1419},
  {id:1509378745, name:"Lidl", address:"1162 Budapest, Szlovák út 114.", lat:47.5381, lng:19.1868},
  {id:1803738096, name:"Lidl", address:"4220 Hajdúböszörmény, Külső-Debreceni utca 20.", lat:47.6599, lng:21.5173},
  {id:1838634587, name:"Lidl", address:"1212 Budapest, II. Rákóczi Ferenc út 154-170.", lat:47.4267, lng:19.0834},
  {id:1977754388, name:"Lidl", address:"1097 Budapest, Gubacsi út 34.", lat:47.4589, lng:19.0872},
  {id:2151876547, name:"Lidl", address:"1152 Budapest, Régi Fóti út 68-70.", lat:47.5615, lng:19.1309},
  {id:2294248554, name:"Lidl", address:"2030 Érd, Iparos utca 5.", lat:47.3813, lng:18.9163},
  {id:2428867372, name:"Lidl", address:"5600 Békéscsaba, Szarvasi út 64.", lat:46.6914, lng:21.0827},
  {id:2428868102, name:"Lidl", address:"5700 Gyula, Kétegyházi út 1.", lat:46.6366, lng:21.2829},
  {id:2528789524, name:"Lidl", address:"2092 Budakeszi, Tiefenweg utca 10.", lat:47.5137, lng:18.9221},
  {id:2623315808, name:"Lidl", address:"2310 Szigetszentmiklós, Csepeli út 66/B", lat:47.3562, lng:19.0494},
  {id:2659104052, name:"Lidl", address:"1183 Budapest, Gyömrői út 99.", lat:47.4452, lng:19.1764},
  {id:2682977508, name:"Lidl", address:"2330 Dunaharaszti, Némedi út 67.", lat:47.3486, lng:19.0963},
  {id:2717906950, name:"Lidl", address:"1135 Budapest, Béke út 2-4.", lat:47.5317, lng:19.0784},
  {id:2823616853, name:"Lidl", address:"1103 Budapest, Gyömrői út 108.", lat:47.4627, lng:19.1578},
  {id:3213506144, name:"Lidl", address:"6728 Szeged, Csorvai út 55.", lat:46.2694, lng:20.1068},
  {id:3698063223, name:"Lidl", address:"1138 Budapest, Váci út 178.", lat:47.5428, lng:19.0718},
  {id:4294868296, name:"Lidl", address:"1024 Budapest, Lövőház utca 2-6.", lat:47.5153, lng:19.0257},
  {id:4432322389, name:"Lidl", address:"1113 Budapest, Bocskai út 43.", lat:47.4735, lng:19.0354},
  {id:4638367566, name:"Lidl", address:"1087 Budapest, Kerepesi út 9.", lat:47.4980, lng:19.0907},
  {id:5018693892, name:"Lidl", address:"1077 Budapest, Wesselényi utca 63.", lat:47.5020, lng:19.0725},
  {id:5732168979, name:"Lidl", address:"1126 Budapest, Kiss János altábornagy utca 55-59.", lat:47.4921, lng:19.0150},
  {id:6763428178, name:"Lidl", address:"1116 Budapest, Hunyadi Mátyás út 49.", lat:47.4429, lng:19.0163}
];

const map = L.map('map').setView([47.2, 19.5], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution:'© OpenStreetMap'}).addTo(map);

let visited = JSON.parse(localStorage.getItem('lidlVisited') || '[]');

function save() { localStorage.setItem('lidlVisited', JSON.stringify(visited)); }

function renderTables() {
  const vTbody = document.querySelector('#visited tbody');
  const uTbody = document.querySelector('#unvisited tbody');
  vTbody.innerHTML = '';
  uTbody.innerHTML = '';

  STORES.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${s.name}</td><td>${s.address}</td>`;
    (visited.includes(s.id) ? vTbody : uTbody).appendChild(tr);
  });
  document.getElementById('visited-count').textContent   = visited.length;
  document.getElementById('unvisited-count').textContent = STORES.length - visited.length;
}

STORES.forEach(s => {
  const marker = L.marker([s.lat, s.lng]).addTo(map);
  const isVisited = visited.includes(s.id);
  const checkbox = `<label><input type="checkbox" data-id="${s.id}" ${isVisited?'checked':''}> Meglátogattam</label>`;
  marker.bindPopup(`<b>${s.name}</b><br>${s.address}<br>${checkbox}`);
});

document.addEventListener('change', e => {
  if (!e.target.matches('input[type=checkbox]')) return;
  const id = +e.target.dataset.id;
  if (e.target.checked) { if (!visited.includes(id)) visited.push(id); }
  else { visited = visited.filter(v => v !== id); }
  save();
  renderTables();
});

renderTables();

renderTables();
