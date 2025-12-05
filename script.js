// ----------------- Firebase Konfiqurasiya -----------------
var firebaseConfig = {
  apiKey: "AIzaSyCwnn6JY3f-Nv9NWx2beIUjAnyVCqU749E",
  authDomain: "cay-love-you.firebaseapp.com",
  databaseURL: "https://cay-love-you-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cay-love-you",
  storageBucket: "cay-love-you.firebasestorage.app",
  messagingSenderId: "526657108236",
  appId: "1:526657108236:web:8ce574d880d232c754b129",
  measurementId: "G-XVP460DCK9"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.database();

// Səs faylı
var pingSound = new Audio('ping.mp3');

// ----------------- Ofisiant -----------------
function sendOrder(){
    const masa = document.getElementById('masa').value.trim();
    const mehsul = document.getElementById('mehsul').value.trim();
    const qeyd = document.getElementById('qeyd').value.trim() || '-';
    if(!masa || !mehsul){ alert('Masa və məhsul boş ola bilməz!'); return; }

    const id = Date.now();
    db.ref('orders/' + id).set({
        masa, mehsul, qeyd,
        time: new Date().toLocaleTimeString(),
        status: 'new'
    });
    pingSound.play().catch(()=>{});
    alert('Sifariş göndərildi ✔');
}

// ----------------- Mətbəx -----------------
var lastOrderIds = [];
function loadKitchen(){
    db.ref('orders').on('value', snapshot => {
        if(!snapshot.exists()){
            document.getElementById('ordersBox').innerHTML = 'Sifariş yoxdur';
            lastOrderIds = [];
            return;
        }
        const data = snapshot.val();
        let html = '';
        let currentIds = [];
        Object.keys(data).forEach(id=>{
            const o = data[id];
            currentIds.push(id);
            html += `<div class='order'>
                        <b>Masa:</b> ${o.masa} <br>
                        <b>Sifariş:</b> ${o.mehsul} <br>
                        <b>Qeyd:</b> ${o.qeyd} <br>
                        <b>Zaman:</b> ${o.time}
                    </div>`;
        });
        currentIds.forEach(id => { if(!lastOrderIds.includes(id)) pingSound.play().catch(()=>{}); });
        lastOrderIds = currentIds;
        document.getElementById('ordersBox').innerHTML = html;
    });
}

// ----------------- Admin -----------------
function adminLogin(){
    if(document.getElementById('adminCode').value === '1986'){
        document.getElementById('panel').style.display = 'block';
        loadAdminOrders();
    } else alert('Kod səhvdir!');
}

function loadAdminOrders(){
    db.ref('orders').once('value', snapshot=>{
        const list = document.getElementById('adminList');
        list.innerHTML = '';
        snapshot.forEach(snap=>{
            const o = snap.val();
            const li = document.createElement('li');
            li.innerHTML = `<div><b>Masa ${o.masa}</b><br>${o.mehsul} — ${o.qeyd}<br>${o.time} — ${o.status}</div>`;
            const btn = document.createElement('button');
            btn.textContent = 'Sil';
            btn.onclick = ()=>db.ref('orders/' + snap.key).remove();
            li.appendChild(btn);
            list.appendChild(li);
        });
    });
}
