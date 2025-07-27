// A Firebase-hez szükséges összes funkció importálása a fájl elején
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
  getAuth,
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { 
  getFirestore,
  doc, 
  getDoc, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Your web app's Firebase configuration - Most már itt, biztonságban
const firebaseConfig = {
  apiKey: "AIzaSyBAibYE5ngSjnujCpMiqwrEXdivJAi4DFM",
  authDomain: "lidl-vadaszat.firebaseapp.com",
  projectId: "lidl-vadaszat",
  storageBucket: "lidl-vadaszat.firebasestorage.app",
  messagingSenderId: "353145173567",
  appId: "1:353145173567:web:4108b55fd000aa47aaaa8a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// Az üzletek listája (a te 199 üzletes listád)
const STORES = [
    {id: 260896313, name: "Lidl", address: "1051 Budapest, Arany János utca 27-29", lat: 47.5021289, lng: 19.0528886},
    {id: 1796395943, name: "Lidl", address: "1068 Budapest, Király utca 112", lat: 47.5071915, lng: 19.0717499},
    {id: 2010647754, name: "Lidl", address: "2096 Üröm, Dózsa György út 36", lat: 47.5903086, lng: 19.0108341},
    {id: 2363662151, name: "Lidl", address: "1065 Budapest, Bajcsy-Zsilinszky út 61", lat: 47.508896, lng: 19.0553676},
    {id: 2819579301, name: "Lidl", address: "1082 Budapest, Leonardo da Vinci utca 23", lat: 47.4860311, lng: 19.0772584},
    {id: 3007189604, name: "Lidl", address: "1114 Budapest, Bartók Béla út 47", lat: 47.4784068, lng: 19.0485455},
    {id: 3454542538, name: "Lidl", address: "2040 Budaörs, Károly király utca 145", lat: 47.4499809, lng: 18.9607007},
    {id: 4549748214, name: "Lidl", address: "2315 Szigethalom, Mű út 7", lat: 47.3297337, lng: 19.0056403},
    {id: 4939175421, name: "Lidl", address: "1074 Budapest, Rákóczi út 48", lat: 47.4975269, lng: 19.070864},
    {id: 5298253643, name: "Lidl", address: "1182 Budapest, Cziffra György utca 115", lat: 47.4338082, lng: 19.2002559},
    {id: 5334903721, name: "Lidl", address: "1132 Budapest, Victor Hugo utca 11", lat: 47.517784, lng: 19.0580714},
    {id: 5702459553, name: "Lidl", address: "1138 Budapest, Váci út 201", lat: 47.5590745, lng: 19.0780485},
    {id: 6560953994, name: "Lidl", address: "1053 Budapest, Ferenciek tere 2", lat: 47.4929623, lng: 19.0556926},
    {id: 6721047736, name: "Lidl", address: "7100 Szekszárd, Arany János utca 4", lat: 46.3470849, lng: 18.7035106},
    {id: 6881121025, name: "Lidl", address: "2111 Szada, Dózsa György út 1/b", lat: 47.6236781, lng: 19.3248814},
    {id: 8255585579, name: "Lidl", address: "6200 Kiskőrös, Kossuth Lajos út 13", lat: 46.6228395, lng: 19.2896131},
    {id: 8503076717, name: "Lidl", address: "1027 Budapest, Csalogány utca 43", lat: 47.5080712, lng: 19.0314108},
    {id: 9343701376, name: "Lidl", address: "6724 Szeged, Vásárhelyi Pál utca 3-5", lat: 46.2609189, lng: 20.1277388},
    {id: 9865958292, name: "Lidl", address: "6000 Kecskemét, Nyíri út 38/e", lat: 46.9110304, lng: 19.6731576},
    {id: 10021254392, name: "Lidl", address: "1149 Budapest, Nagy Lajos király útja 121-123", lat: 47.5172405, lng: 19.1165842},
    {id: 10096049345, name: "Lidl", address: "6230 Soltvadkert, Kossuth Lajos utca 110", lat: 46.5823935, lng: 19.3727872},
    {id: 10171837943, name: "Lidl", address: "6000 Kecskemét, Izsáki út 2", lat: 46.8994554, lng: 19.6766974},
    {id: 11542816339, name: "Lidl", address: "4030 Debrecen, Mikepércsi út 168", lat: 47.4944224, lng: 21.6329232},
    {id: 12479193409, name: "Lidl", address: "8000 Székesfehérvár, Pozsonyi út 4", lat: 47.2058668, lng: 18.4406117},
    {id: 12607364704, name: "Lidl", address: "2151 Fót, Keleti Márton utca 7", lat: 47.6143562, lng: 19.176739},
    {id: 30924476, name: "Lidl", address: "7400 Kaposvár, Bereczk Sándor utca 2", lat: 46.3575003, lng: 17.7824055},
    {id: 39698892, name: "Lidl", address: "8000 Székesfehérvár, Farkasvermi köz 1", lat: 47.204961, lng: 18.3853154},
    {id: 40885474, name: "Lidl", address: "2510 Dorog, Bányász körönd ", lat: 47.7289568, lng: 18.7273763},
    {id: 68081626, name: "Lidl", address: "3700 Kazincbarcika, Mátyás király út 34/a", lat: 48.2468846, lng: 20.6238383},
    {id: 81290372, name: "Lidl", address: "2220 Vecsés, Fő út 244", lat: 47.4160408, lng: 19.2539401},
    {id: 87342989, name: "Lidl", address: "7570 Barcs, Erkel Ferenc utca 2", lat: 45.962299, lng: 17.4675545},
    {id: 87772685, name: "Lidl", address: "1157 Budapest, Erdőkerülő utca 36", lat: 47.5414571, lng: 19.1501174},
    {id: 94510194, name: "Lidl", address: "1173 Budapest, Pesti út 237/H", lat: 47.4727786, lng: 19.2746419},
    {id: 94553744, name: "Lidl", address: "1033 Budapest, Huszti út 20", lat: 47.5531584, lng: 19.0381987},
    {id: 96329122, name: "Lidl", address: "1188 Budapest, Nagykőrösi út 35-38", lat: 47.406637, lng: 19.1820518},
    {id: 99344962, name: "Lidl", address: "9200 Mosonmagyaróvár, Királyhidai utca 49", lat: 47.8770204, lng: 17.2628468},
    {id: 100057574, name: "Lidl", address: "1106 Budapest, Maglódi út 17", lat: 47.4857476, lng: 19.1533593},
    {id: 100790093, name: "Lidl", address: "2060 Bicske, Szent László utca 55", lat: 47.4996847, lng: 18.6297295},
    {id: 102735041, name: "Lidl", address: "9024 Győr, Mécs László utca 1/A", lat: 47.662444, lng: 17.6364132},
    {id: 103030441, name: "Lidl", address: "2800 Tatabánya, Győri út 31", lat: 47.5930922, lng: 18.388275},
    {id: 103309466, name: "Lidl", address: "2800 Tatabánya, Szent Borbála út 31", lat: 47.5594056, lng: 18.4134446},
    {id: 108685404, name: "Lidl", address: "1158 Budapest, Madách utca 72", lat: 47.5376092, lng: 19.1385412},
    {id: 112923895, name: "Lidl", address: "5600 Békéscsaba, Corvin utca 29-33", lat: 46.6705574, lng: 21.105607},
    {id: 117590555, name: "Lidl", address: "6900 Makó, Szegedi út 63", lat: 46.2104395, lng: 20.4616259},
    {id: 118892479, name: "Lidl", address: "3516 Miskolc, Pesti út 5", lat: 48.0596396, lng: 20.7972757},
    {id: 118935080, name: "Lidl", address: "3533 Miskolc, Csermőkei út 207", lat: 48.0768205, lng: 20.7736468},
    {id: 119140139, name: "Lidl", address: "7400 Kaposvár, Füredi út 97", lat: 46.3780597, lng: 17.7797087},
    {id: 120199393, name: "Lidl", address: "6000 Kecskemét, Szolnoki út 18", lat: 46.9131603, lng: 19.7102717},
    {id: 121040290, name: "Lidl", address: "9027 Győr, Szeszgyár utca 6", lat: 47.6887556, lng: 17.6515151},
    {id: 121253689, name: "Lidl", address: "6500 Baja, Bajcsy-Zsilinszky Endre utca 9", lat: 46.1829871, lng: 18.9347513},
    {id: 122072287, name: "Lidl", address: "7400 Kaposvár, Előd vezér utca 3", lat: 46.3672023, lng: 17.8090543},
    {id: 126204881, name: "Lidl", address: "1135 Budapest, Béke utca 2-4", lat: 47.5317075, lng: 19.0783517},
    {id: 135421624, name: "Lidl", address: "2400 Dunaújváros, Velinszky László utca 1", lat: 46.9594732, lng: 18.9463517},
    {id: 137626397, name: "Lidl", address: "1042 Budapest, Görgey Artúr út 14-20", lat: 47.5657802, lng: 19.0959149},
    {id: 138505048, name: "Lidl", address: "2200 Monor, Gém utca 1", lat: 47.3469852, lng: 19.4334346},
    {id: 139584078, name: "Lidl", address: "8100 Várpalota, Hétvezér utca 3", lat: 47.2006371, lng: 18.146743},
    {id: 141001087, name: "Lidl", address: "1225 Budapest, Nagytétényi út 216-218", lat: 47.3996711, lng: 19.0031899},
    {id: 142709323, name: "Lidl", address: "9023 Győr, Tihanyi Árpád út 9", lat: 47.6836166, lng: 17.6428789},
    {id: 147430031, name: "Lidl", address: "3531 Miskolc, Kiss Ernő utca 13/B", lat: 48.0998342, lng: 20.7459992},
    {id: 153583189, name: "Lidl", address: "6723 Szeged, Makkosházi körút 21", lat: 46.2729112, lng: 20.1526848},
    {id: 154098887, name: "Lidl", address: "2310 Szigetszentmiklós, Csepeli út 16/a", lat: 47.3557997, lng: 19.0453313},
    {id: 156320663, name: "Lidl", address: "8300 Tapolca, Veszprémi út 1", lat: 46.8800908, lng: 17.4529367},
    {id: 157290225, name: "Lidl", address: "8000 Székesfehérvár, Balatoni út 21", lat: 47.1834924, lng: 18.4066063},
    {id: 158208936, name: "Lidl", address: "2484 Gárdony, Akácfa utca 2", lat: 47.1987556, lng: 18.6103989},
    {id: 165260881, name: "Lidl", address: "8800 Nagykanizsa, Balatoni utca 41", lat: 46.4614214, lng: 17.0070799},
    {id: 166825314, name: "Lidl", address: "8400 Ajka, Hársfa utca 1/a", lat: 47.1155822, lng: 17.5503203},
    {id: 170221400, name: "Lidl", address: "7300 Komló, Tröszt utca 1", lat: 46.1903328, lng: 18.2580797},
    {id: 171784335, name: "Lidl", address: "2330 Dunaharaszti, Némedi út 102/A", lat: 47.3471695, lng: 19.117297},
    {id: 171940326, name: "Lidl", address: "8360 Keszthely, Tapolcai út 45/a", lat: 46.7742686, lng: 17.2715102},
    {id: 172050557, name: "Lidl", address: "2013 Pomáz, József Attila utca 32", lat: 47.6427776, lng: 19.0294025},
    {id: 172225467, name: "Lidl", address: "1039 Budapest, Szentendrei út 251-253", lat: 47.5805307, lng: 19.0483259},
    {id: 173984799, name: "Lidl", address: "6100 Kiskunfélegyháza, Majsai út 5", lat: 46.7061739, lng: 19.8369647},
    {id: 175650667, name: "Lidl", address: "8330 Sümeg, Fehérkő utca 1/1", lat: 46.9854497, lng: 17.2850125},
    {id: 176573692, name: "Lidl", address: "8638 Balatonlelle, Rákóczi út 307", lat: 46.783226, lng: 17.6822259},
    {id: 178272531, name: "Lidl", address: "3078 Bátonyterenye, Berekgát köz 2", lat: 48.0039209, lng: 19.826359},
    {id: 178446778, name: "Lidl", address: "6729 Szeged, Szabadkai út 1/C", lat: 46.2430752, lng: 20.1266205},
    {id: 178489415, name: "Lidl", address: "9700 Szombathely, Verseny utca 30", lat: 47.2534571, lng: 16.6192789},
    {id: 182389785, name: "Lidl", address: "1211 Budapest, Ady Endre út 58", lat: 47.4354784, lng: 19.0748882},
    {id: 185287137, name: "Lidl", address: "9028 Győr, Jereváni út 42", lat: 47.6688755, lng: 17.6560931},
    {id: 189899282, name: "Lidl", address: "1152 Budapest, Régi Fóti út 1", lat: 47.5666795, lng: 19.1336683},
    {id: 191913080, name: "Lidl", address: "1149 Budapest, Mogyoródi út 23-29", lat: 47.5063853, lng: 19.1153835},
    {id: 202426686, name: "Lidl", address: "1161 Budapest, János utca 196", lat: 47.5339678, lng: 19.1598811},
    {id: 202713510, name: "Lidl", address: "1165 Budapest, Újszász utca 47/B", lat: 47.5049364, lng: 19.2003893},
    {id: 202843343, name: "Lidl", address: "8360 Keszthely, Sopron utca 43", lat: 46.7758309, lng: 17.2421868},
    {id: 205694377, name: "Lidl", address: "5630 Békés, Kossuth Lajos utca 31", lat: 46.7720977, lng: 21.123537},
    {id: 205743856, name: "Lidl", address: "3300 Eger, II. Rákóczi Ferenc utca 141", lat: 47.9248443, lng: 20.3680221},
    {id: 205990027, name: "Lidl", address: "9900 Körmend, Dr. Remetei Filep utca 1", lat: 47.0084534, lng: 16.5929211},
    {id: 206808059, name: "Lidl", address: "8900 Zalaegerszeg, Átkötő utca 3", lat: 46.8452309, lng: 16.8644837},
    {id: 207956422, name: "Lidl", address: "8900 Zalaegerszeg, Platán sor 6/a", lat: 46.8394626, lng: 16.833776},
    {id: 208408453, name: "Lidl", address: "4220 Hajdúböszörmény, Bánság tér 10", lat: 47.6622565, lng: 21.5117215},
    {id: 211512853, name: "Lidl", address: "8000 Székesfehérvár, Mártírok útja 11", lat: 47.1889814, lng: 18.4471926},
    {id: 216936420, name: "Lidl", address: "2500 Esztergom, Bánomi út 10", lat: 47.8029252, lng: 18.7527632},
    {id: 216936668, name: "Lidl", address: "2500 Esztergom, Dobogókői út 39", lat: 47.7735955, lng: 18.7537652},
    {id: 220555189, name: "Lidl", address: "2030 Érd, Diósdi út 2-4", lat: 47.3792902, lng: 18.9236166},
    {id: 221525563, name: "Lidl", address: "5350 Tiszafüred, Húszöles út 25", lat: 47.6235489, lng: 20.7461623},
    {id: 222472997, name: "Lidl", address: "5100 Jászberény, Nagykátai út 7/a", lat: 47.4909772, lng: 19.8893126},
    {id: 224353692, name: "Lidl", address: "1097 Budapest, Gubacsi út 34", lat: 47.4589218, lng: 19.0872016},
    {id: 224367527, name: "Lidl", address: "3000 Hatvan, Radnóti tér 19", lat: 47.6695275, lng: 19.6735165},
    {id: 228979993, name: "Lidl", address: "7200 Dombóvár, Kórház utca 55", lat: 46.3872242, lng: 18.1431367},
    {id: 228982159, name: "Lidl", address: "7627 Pécs, Puskin tér 22", lat: 46.0848375, lng: 18.2633005},
    {id: 229041030, name: "Lidl", address: "8500 Pápa, Jókai Mór utca 57", lat: 47.3229641, lng: 17.4734005},
    {id: 229103014, name: "Lidl", address: "2143 Kistarcsa, Szabadság útja 60", lat: 47.549298, lng: 19.2682121},
    {id: 229599121, name: "Lidl", address: "7100 Szekszárd, Béri Balogh Ádám utca 94B", lat: 46.3345864, lng: 18.701101},
    {id: 229984990, name: "Lidl", address: "4400 Nyíregyháza, Pazonyi út 37/a", lat: 47.9690186, lng: 21.7383215},
    {id: 229990495, name: "Lidl", address: "4405 Nyíregyháza, Debreceni út 106/c", lat: 47.9365287, lng: 21.7207409},
    {id: 230143073, name: "Lidl", address: "9700 Szombathely, Kenyérvíz utca 2", lat: 47.224523, lng: 16.6329973},
    {id: 230160200, name: "Lidl", address: "3980 Sátoraljaújhely, Esze Tamás utca 92", lat: 48.3878841, lng: 21.6543134},
    {id: 230256599, name: "Lidl", address: "7090 Tamási, Deák Ferenc utca 10/a", lat: 46.6282823, lng: 18.2803328},
    {id: 230372005, name: "Lidl", address: "4150 Püspökladány, Rákóczi Ferenc utca 16-20", lat: 47.3214811, lng: 19.8164278},
    {id: 230603323, name: "Lidl", address: "8130 Enying, Rákóczi utca 5", lat: 46.9258525, lng: 18.2492211},
    {id: 230894180, name: "Lidl", address: "7000 Sárbogárd, Ady Endre utca 232-236", lat: 46.877546, lng: 18.6254714},
    {id: 230908103, name: "Lidl", address: "3400 Mezőkövesd, Dohány utca 2/A", lat: 47.7996843, lng: 19.8164278},
    {id: 231121699, name: "Lidl", address: "1103 Budapest, Sibrik Miklós út 30/B", lat: 47.469446, lng: 19.154867},
    {id: 231256056, name: "Lidl", address: "6320 Solt, Kossuth utca 2-8", lat: 46.8061329, lng: 19.0038164},
    {id: 232355081, name: "Lidl", address: "6300 Kalocsa, Pataji utca 31", lat: 46.5390977, lng: 18.9862892},
    {id: 232478657, name: "Lidl", address: "8600 Siófok, Zamárdi utca 1-2", lat: 46.8993883, lng: 18.0284244},
    {id: 232552305, name: "Lidl", address: "4100 Berettyóújfalu, Kossuth utca 98", lat: 47.2339301, lng: 21.5327209},
    {id: 232588793, name: "Lidl", address: "5500 Gyomaendrőd, Fő út 81/2", lat: 46.9310188, lng: 20.8013322},
    {id: 234998833, name: "Lidl", address: "6400 Kiskunhalas, Széchenyi utca 1-5", lat: 46.4350713, lng: 19.4861183},
    {id: 235029956, name: "Lidl", address: "4244 Újfehértó, Debreceni út 14-24", lat: 47.7955513, lng: 21.6829742},
    {id: 235415064, name: "Lidl", address: "4060 Balmazújváros, Böszörményi utca 1", lat: 47.6153676, lng: 21.3477126},
    {id: 235548781, name: "Lidl", address: "5800 Mezőkovácsháza, Árpád utca 135", lat: 46.4054045, lng: 20.9188046},
    {id: 235895186, name: "Lidl", address: "2760 Nagykáta, Dózsa György utca 16", lat: 47.4156641, lng: 19.7401563},
    {id: 236491692, name: "Lidl", address: "1037 Budapest, Bécsi út 325-337", lat: 47.5605051, lng: 19.0251141},
    {id: 236798264, name: "Lidl", address: "7500 Nagyatád, Árpád utca 49", lat: 46.2240974, lng: 17.3694605},
    {id: 239880391, name: "Lidl", address: "9400 Sopron, Bánfalvi út 12", lat: 47.6858169, lng: 16.569255},
    {id: 243419254, name: "Lidl", address: "2400 Dunaújváros, Magyar út 11", lat: 46.974888, lng: 18.927568},
    {id: 243721851, name: "Lidl", address: "1186 Budapest, Margó Tivadar utca 83", lat: 47.4317181, lng: 19.1751148},
    {id: 245448337, name: "Lidl", address: "4025 Debrecen, Széchenyi utca 59", lat: 47.525492, lng: 21.6151474},
    {id: 245537448, name: "Lidl", address: "4031 Debrecen, Derék utca 31", lat: 47.5249156, lng: 21.5972821},
    {id: 246444332, name: "Lidl", address: "1086 Budapest, Teleki László tér 1", lat: 47.4932152, lng: 19.083733},
    {id: 252731065, name: "Lidl", address: "2000 Szentendre, Dózsa György út 20", lat: 47.6514781, lng: 19.0720894},
    {id: 255956470, name: "Lidl", address: "3200 Gyöngyös, Budai Nagy Antal tér 10", lat: 47.7760773, lng: 19.9276495},
    {id: 256119016, name: "Lidl", address: "1087 Budapest, Hungária körút 26", lat: 47.4953335, lng: 19.108422},
    {id: 257173018, name: "Lidl", address: "8640 Fonyód, Ady Endre utca 57-59", lat: 46.751761, lng: 17.5693441},
    {id: 257634788, name: "Lidl", address: "7632 Pécs, Málomi út 5", lat: 46.0465972, lng: 18.2259169},
    {id: 258453921, name: "Lidl", address: "2100 Gödöllő, Ottó Ferenc utca 2-4", lat: 47.6120896, lng: 19.3368291},
    {id: 260856314, name: "Lidl", address: "2700 Cegléd, Törteli út 2", lat: 47.1728256, lng: 19.8163532},
    {id: 263268421, name: "Lidl", address: "4242 Hajdúhadház, Dr. Földi János utca 55", lat: 47.6905586, lng: 21.6724654},
    {id: 264450903, name: "Lidl", address: "1118 Budapest, Budaörsi út 121", lat: 47.466504, lng: 19.0142385},
    {id: 264960121, name: "Lidl", address: "5700 Gyula, Szent István utca 69/1", lat: 46.635293, lng: 21.2810986},
    {id: 265434697, name: "Lidl", address: "5000 Szolnok, Széchenyi István körút 4/B", lat: 47.1914902, lng: 20.1945532},
    {id: 267232910, name: "Lidl", address: "5900 Orosháza, Hóvirág utca 1-5", lat: 46.5540957, lng: 20.6537332},
    {id: 273118251, name: "Lidl", address: "1028 Budapest, Máriaremetei út 1-3", lat: 47.5452938, lng: 18.9633215},
    {id: 274978775, name: "Lidl", address: "2170 Aszód, Pesti út 14-16", lat: 47.650904, lng: 19.4725043},
    {id: 278641693, name: "Lidl", address: "5520 Szeghalom, Széchenyi utca 49", lat: 47.0155453, lng: 21.1654817},
    {id: 278658219, name: "Lidl", address: "8200 Veszprém, Cholnoky Jenő utca 29/1", lat: 47.086782, lng: 17.9223846},
    {id: 280373459, name: "Lidl", address: "7900 Szigetvár, Almáspatak utca 5", lat: 46.0454508, lng: 17.7967919},
    {id: 284757480, name: "Lidl", address: "3580 Tiszaújváros, Lévai József utca 118", lat: 47.9375179, lng: 21.0280261},
    {id: 288475391, name: "Lidl", address: "1239 Budapest, Haraszti út 34", lat: 47.3851543, lng: 19.1087413},
    {id: 289595406, name: "Lidl", address: "8060 Mór, Akai út 8", lat: 47.3754291, lng: 18.1901452},
    {id: 292054390, name: "Lidl", address: "5400 Mezőtúr, Földvári út 21", lat: 47.0025983, lng: 20.612185},
    {id: 296165308, name: "Lidl", address: "1181 Budapest, Üllői út 379-381", lat: 47.4459633, lng: 19.1706421},
    {id: 297841960, name: "Lidl", address: "2600 Vác, Naszály út 20", lat: 47.7874987, lng: 19.1318042},
    {id: 298421325, name: "Lidl", address: "2300 Ráckeve, Lacházi út 26", lat: 47.1640161, lng: 18.9531818},
    {id: 298662683, name: "Lidl", address: "2600 Vác, Bolgár utca 1", lat: 47.7616654, lng: 19.1416719},
    {id: 301559372, name: "Lidl", address: "9400 Sopron, Lófuttató utca 4", lat: 47.6733235, lng: 16.6016752},
    {id: 302481565, name: "Lidl", address: "7633 Pécs, Lázár Vilmos utca 10", lat: 46.0709426, lng: 18.2054611},
    {id: 302549543, name: "Lidl", address: "5000 Szolnok, Délibáb utca 6", lat: 47.1835698, lng: 20.1836647},
    {id: 303226969, name: "Lidl", address: "2120 Dunakeszi, Berek utca 2", lat: 47.623157, lng: 19.1227546},
    {id: 304770561, name: "Lidl", address: "9600 Sárvár, Rákóczi Ferenc út 12", lat: 47.2503251, lng: 16.9406528},
    {id: 306244580, name: "Lidl", address: "2750 Nagykőrös, Kecskeméti út 73", lat: 47.0211756, lng: 19.7744358},
    {id: 310991893, name: "Lidl", address: "7632 Pécs, Lahti utca 45", lat: 46.040854, lng: 18.2116244},
    {id: 310994701, name: "Lidl", address: "7632 Pécs, Siklósi út 52/A", lat: 46.0559798, lng: 18.2292705},
    {id: 314309055, name: "Lidl", address: "2840 Oroszlány, Környei út 2", lat: 47.4934149, lng: 18.3217431},
    {id: 318421766, name: "Lidl", address: "7150 Bonyhád, Deák Ferenc utca 10/a", lat: 46.2954157, lng: 18.539257},
    {id: 319220850, name: "Lidl", address: "3360 Heves, Kolozsvári utca 2/a", lat: 47.5913506, lng: 20.2803131},
    {id: 324125881, name: "Lidl", address: "1191 Budapest, Báthory utca 6", lat: 47.4568656, lng: 19.1448831},
    {id: 325680381, name: "Lidl", address: "5435 Martfű, Földvári út 1", lat: 47.0169877, lng: 20.290074},
    {id: 336739063, name: "Lidl", address: "7030 Paks, Tolnai út 70", lat: 46.6118026, lng: 18.8515217},
    {id: 336887585, name: "Lidl", address: "4031 Debrecen, Balmazújvárosi út 7", lat: 47.5431682, lng: 21.5960015},
    {id: 339986132, name: "Lidl", address: "1101 Budapest, Üllői út 112", lat: 47.4728073, lng: 19.1105151},
    {id: 341456378, name: "Lidl", address: "1098 Budapest, Lobogó utca 12", lat: 47.4620612, lng: 19.1145663},
    {id: 343612297, name: "Lidl", address: "8840 Csurgó, Széchenyi tér 12-14", lat: 46.2555938, lng: 17.1009088},
    {id: 357284285, name: "Lidl", address: "3600 Ózd, Sárli út 2", lat: 48.2209355, lng: 20.280562},
    {id: 368941207, name: "Lidl", address: "8700 Marcali, Rákóczi Ferenc utca 50", lat: 46.584982, lng: 17.4104273},
    {id: 375602985, name: "Lidl", address: "9700 Szombathely, Zanati út 42", lat: 47.2380582, lng: 16.6452293},
    {id: 407396982, name: "Lidl", address: "5540 Szarvas, Csabai út 1/4", lat: 46.8560799, lng: 20.5665355},
    {id: 420276815, name: "Lidl", address: "1173 Budapest, Pesti út 2", lat: 47.4855581, lng: 19.2262174},
    {id: 431486608, name: "Lidl", address: "6600 Szentes, Ipartelepi út 2-6", lat: 46.6540103, lng: 20.2771142},
    {id: 440993282, name: "Lidl", address: "7700 Mohács, Pécsi út 41", lat: 45.9961623, lng: 18.6682229},
    {id: 461373687, name: "Lidl", address: "2112 Veresegyház, Szadai út 7", lat: 47.6482103, lng: 19.2921588},
    {id: 463503069, name: "Lidl", address: "5310 Kisújszállás, Deák Ferenc utca 10", lat: 47.2169368, lng: 20.7505763},
    {id: 471832597, name: "Lidl", address: "2370 Dabas, Bartók Béla út 63", lat: 47.1883526, lng: 19.3225883},
    {id: 489650277, name: "Lidl", address: "1237 Budapest, Ciklámen utca 3", lat: 47.4162607, lng: 19.1300994},
    {id: 542661326, name: "Lidl", address: "2085 Pilisvörösvár, Budai út 18", lat: 47.613524, lng: 18.9264171},
    {id: 547707466, name: "Lidl", address: "2660 Balassagyarmat, Kóvári út 8", lat: 48.0736636, lng: 19.2811776},
    {id: 564624851, name: "Lidl", address: "2900 Komárom, Mártírok útja 80", lat: 47.7383115, lng: 18.1391741},
    {id: 586596736, name: "Lidl", address: "5200 Törökszentmiklós, Kossuth Lajos utca 102-108", lat: 47.1799732, lng: 20.4173873},
    {id: 611761440, name: "Lidl", address: "6640 Csongrád, Fő utca 59", lat: 46.7107062, lng: 20.1371518},
    {id: 616600147, name: "Lidl", address: "3900 Szerencs, Csalogány utca 58", lat: 48.1545625, lng: 21.1945532},
    {id: 618285105, name: "Lidl", address: "6800 Hódmezővásárhely, Hódtó utca 2", lat: 46.4103328, lng: 20.3254921},
    {id: 654317880, name: "Lidl", address: "2112 Veresegyház, Erkel Ferenc tér 4", lat: 47.6588264, lng: 20.2802319},
    {id: 673183331, name: "Lidl", address: "3104 Salgótarján, Csokonai út 23", lat: 48.076504, lng: 19.7901594},
    {id: 675544912, name: "Lidl", address: "1116 Budapest, Fehérvári út 211", lat: 47.4470381, lng: 19.036573},
    {id: 677268186, name: "Lidl", address: "3300 Eger, Mátyás király út 144", lat: 47.8695191, lng: 20.3809009},
    {id: 690021092, name: "Lidl", address: "7800 Siklós, Szent István tér 2", lat: 45.854668, lng: 18.2936279},
    {id: 742291443, name: "Lidl", address: "2083 Solymár, Terstyánszky utca 89", lat: 47.5957777, lng: 18.929559},
    {id: 841440048, name: "Lidl", address: "8200 Veszprém, Észak-keleti útgyűrű 18", lat: 47.1112028, lng: 17.9271168},
    {id: 863147212, name: "Lidl", address: "2890 Tata, Piac tér 8", lat: 47.6520392, lng: 18.3159043},
    {id: 908876641, name: "Lidl", address: "9025 Győr, Kossuth Lajos utca 123", lat: 47.6786524, lng: 17.615024},
    {id: 1013768837, name: "Lidl", address: "4034 Debrecen, Faraktár utca 58", lat: 47.5293657, lng: 21.6502127},
    {id: 1046839584, name: "Lidl", address: "4080 Hajdúnánás, Dorogi út 108", lat: 47.8408972, lng: 21.4458316},
    {id: 1154304246, name: "Lidl", address: "4200 Hajdúszoboszló, Dózsa György út 62", lat: 47.4352516, lng: 21.3784136},
    {id: 1179940870, name: "Lidl", address: "2092 Budakeszi, Kert utca 27-29", lat: 47.5036838, lng: 18.9223194},
    {id: 1224883512, name: "Lidl", address: "9330 Kapuvár, Győri út 60", lat: 47.5921827, lng: 17.039755},
    {id: 1247264666, name: "Lidl", address: "9300 Csorna, Soproni út 66/C", lat: 47.610111, lng: 17.2413813},
    {id: 1267213597, name: "Lidl", address: "8175 Balatonfűzfő, Vízmű utca 1", lat: 47.0692257, lng: 18.0324021},
    {id: 1283043110, name: "Lidl", address: "5440 Kunszentmárton, Kossuth Lajos út 23", lat: 46.8420653, lng: 20.2901764},
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
    authContainer.innerHTML = `Szia, ${user.displayName}! <button id="logout-btn">Kijelentkezés</button>`;
    document.getElementById('logout-btn').addEventListener('click', handleSignOut);
    
    // Töltsük be a mentett boltjait az adatbázisból
    loadVisitedStores();
  } else {
    // Ha a felhasználó ki van jelentkezve:
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
  
  const userDocRef = doc(db, "users", currentUser.uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    visited = docSnap.data().visited || [];
  } else {
    visited = [];
  }
  
  renderAll();
}

/**
 * Mentés a Firestore-ba
 */
async function saveVisitedStores() {
  if (!currentUser) return;
  
  const userDocRef = doc(db, "users", currentUser.uid);
  try {
    await setDoc(userDocRef, { visited: visited });
  } catch (error) {
    console.error("Hiba a mentés során:", error);
  }
}

// --- MEGLÉVŐ LOGIKA ÁTALAKÍTVA ---

/**
 * Táblázatok renderelése
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
 * Markerek renderelése
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
 * A teljes felület frissítése
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
  
  if (!currentUser) {
    alert("A boltok megjelöléséhez kérlek jelentkezz be!");
    e.target.checked = !e.target.checked;
    return;
  }
  
  const id = +e.target.dataset.id;
  if (e.target.checked) {
    if (!visited.includes(id)) visited.push(id);
  } else {
    visited = visited.filter(v => v !== id);
  }
  
  renderTables();
  saveVisitedStores();
});
