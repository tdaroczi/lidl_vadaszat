// Minta adat – 211 valós üzlet helyett most 10 példa
const STORES = [
  {id:1,name:"Lidl Budapest – Mammut",address:"Lövőház utca 2-6, 1024 Budapest",lat:47.5153,lng:19.0257},
  {id:2,name:"Lidl Budapest – Arena Plaza",address:"Kerepesi út 9, 1087 Budapest",lat:47.4980,lng:19.0907},
  {id:3,name:"Lidl Debrecen – Fórum",address:"Csapó utca 30, 4024 Debrecen",lat:47.5297,lng:21.6227},
  {id:4,name:"Lidl Szeged – Árkád",address:"Londoni körút 3, 6722 Szeged",lat:46.2468,lng:20.1481},
  {id:5,name:"Lidl Győr – ETO Park",address:"Tihanyi Árpád út 26, 9027 Győr",lat:47.6875,lng:17.6504},
  {id:6,name:"Lidl Pécs – Árkád",address:"Hunyadi János út 2, 7623 Pécs",lat:46.0718,lng:18.2321},
  {id:7,name:"Lidl Miskolc – Szinvapark",address:"Széchenyi István út 75, 3526 Miskolc",lat:48.1041,lng:20.7919},
  {id:8,name:"Lidl Nyíregyháza – Korzó",address:"Bocskai utca 25, 4400 Nyíregyháza",lat:47.9531,lng:21.7270},
  {id:9,name:"Lidl Kecskemét – Malom",address:"Kisfaludy utca 35, 6000 Kecskemét",lat:46.9068,lng:19.6905},
  {id:10,name:"Lidl Veszprém – Dóm",address:"Dózsa György út 1, 8200 Veszprém",lat:47.0930,lng:17.9075}
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