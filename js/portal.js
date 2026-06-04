(function () {
  const FIREBASE_CONFIG = {
    apiKey: 'AIzaSyCl7fBX2VrdNtNk_lS_eatnbdad9_BZDIs',
    authDomain: 'foodsocialnetwork-74a07.firebaseapp.com',
    projectId: 'foodsocialnetwork-74a07',
    storageBucket: 'foodsocialnetwork-74a07.firebasestorage.app',
    messagingSenderId: '386220197764',
    appId: '1:386220197764:web:c17b14de842d599ef4bfd1',
  };

  let app;
  let auth;
  let db;

  function init() {
    if (!app) {
      app = firebase.initializeApp(FIREBASE_CONFIG);
      auth = firebase.auth();
      db = firebase.firestore();
    }
  }

  function nextFridayLabel() {
    const d = new Date();
    const day = d.getDay();
    const add = day <= 5 ? 5 - day : 12 - day;
    d.setDate(d.getDate() + add);
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  async function renderLogin(root) {
    root.innerHTML = `
      <form id="login-form" class="partner-card">
        <label>Email<input type="email" name="email" required /></label>
        <label>Mot de passe<input type="password" name="password" required /></label>
        <button type="submit" class="btn-primary">Se connecter</button>
        <p id="login-error" class="error" hidden></p>
      </form>`;
    document.getElementById('login-form').onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const err = document.getElementById('login-error');
      err.hidden = true;
      try {
        await auth.signInWithEmailAndPassword(fd.get('email'), fd.get('password'));
        window.location.href = 'dashboard.html';
      } catch (ex) {
        err.textContent = ex.message;
        err.hidden = false;
      }
    };
  }

  async function renderDashboard(root, user) {
    const token = await user.getIdTokenResult(true);
    const companyId = token.claims.companyAdminOf;
    if (!companyId) {
      root.innerHTML =
        '<p class="error">Accès non autorisé. Vous devez être manager d\'une société partenaire AfroBite.</p>';
      return;
    }
    const companySnap = await db.collection('delivery_companies').doc(companyId).get();
    if (!companySnap.exists) {
      root.innerHTML = '<p class="error">Société introuvable.</p>';
      return;
    }
    const company = companySnap.data();
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const driversSnap = await db
      .collection('drivers')
      .where('companyId', '==', companyId)
      .get();
    const drivers = driversSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const earningsSnap = await db
      .collection('driver_earnings')
      .where('companyId', '==', companyId)
      .orderBy('earnedAt', 'desc')
      .limit(200)
      .get();

    let weekKm = 0;
    let weekEarn = 0;
    let weekDeliveries = 0;
    const perDriver = {};
    earningsSnap.docs.forEach((doc) => {
      const e = doc.data();
      const at = e.earnedAt?.toDate?.() || new Date(0);
      if (at < weekStart) return;
      weekDeliveries += 1;
      weekEarn += Number(e.amount) || 0;
      weekKm += Number(e.distanceKm) || 0;
      const did = e.driverId || 'unknown';
      if (!perDriver[did]) perDriver[did] = { km: 0, earn: 0, count: 0, name: did };
      perDriver[did].km += Number(e.distanceKm) || 0;
      perDriver[did].earn += Number(e.amount) || 0;
      perDriver[did].count += 1;
    });
    drivers.forEach((d) => {
      if (perDriver[d.id]) perDriver[d.id].name = d.fullName || d.id;
    });

    const payoutsSnap = await db
      .collection('company_payouts')
      .where('companyId', '==', companyId)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    root.innerHTML = `
      <header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <div>
          <h1 style="color:#fffdf8;margin:0;">${company.name}</h1>
          <p style="color:#ccc;margin:0;">${company.status} · ${company.contractedRatePerKm} FCFA/km</p>
        </div>
        <button id="logout" class="btn-secondary">Déconnexion</button>
      </header>
      <section class="partner-card">
        <h2>Cette semaine</h2>
        <p>${weekDeliveries} livraisons · ${weekKm.toFixed(1)} km · ${weekEarn.toLocaleString('fr-FR')} FCFA dus</p>
        <p style="color:#aaa;">Prochain versement : ${nextFridayLabel()}</p>
      </section>
      <section class="partner-card">
        <h2>Par livreur</h2>
        <table style="width:100%;color:#eee;font-size:0.9rem;">
          <tr><th align="left">Livreur</th><th>Livraisons</th><th>Km</th><th>Gain</th></tr>
          ${Object.entries(perDriver)
            .map(
              ([, v]) =>
                `<tr><td>${v.name}</td><td>${v.count}</td><td>${v.km.toFixed(1)}</td><td>${v.earn.toLocaleString('fr-FR')}</td></tr>`
            )
            .join('') || '<tr><td colspan="4">Aucune donnée cette semaine</td></tr>'}
        </table>
      </section>
      <section class="partner-card">
        <h2>Historique des versements</h2>
        <ul style="color:#ddd;padding-left:1.2rem;">
          ${payoutsSnap.docs
            .map((p) => {
              const d = p.data();
              const dt = d.createdAt?.toDate?.()?.toLocaleDateString('fr-FR') || '—';
              return `<li>${dt} — ${(d.totalAmount || 0).toLocaleString('fr-FR')} FCFA (${d.status || 'pending'})</li>`;
            })
            .join('') || '<li>Aucun versement enregistré</li>'}
        </ul>
      </section>`;
    document.getElementById('logout').onclick = () =>
      auth.signOut().then(() => (window.location.href = 'login.html'));
  }

  init();
  const page = document.body.dataset.portalPage;
  const root =
    page === 'login'
      ? document.getElementById('portal-login-root')
      : document.getElementById('portal-dashboard-root');

  if (page === 'login') {
    auth.onAuthStateChanged((u) => {
      if (u) window.location.href = 'dashboard.html';
      else renderLogin(root);
    });
  } else if (page === 'dashboard') {
    auth.onAuthStateChanged((u) => {
      if (!u) window.location.href = 'login.html';
      else renderDashboard(root, u);
    });
  }
})();
