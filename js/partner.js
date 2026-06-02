/**
 * AfroBite partner onboarding — afrobite.app
 * Auth + forms → Cloud Functions (foodtok)
 */
(function () {
  const FIREBASE_CONFIG = {
    apiKey: 'AIzaSyCl7fBX2VrdNtNk_lS_eatnbdad9_BZDIs',
    authDomain: 'foodsocialnetwork-74a07.firebaseapp.com',
    projectId: 'foodsocialnetwork-74a07',
    storageBucket: 'foodsocialnetwork-74a07.firebasestorage.app',
    messagingSenderId: '386220197764',
    appId: '1:386220197764:web:c17b14de842d599ef4bfd1',
  };

  const FUNCTIONS_BASE =
    'https://us-central1-foodsocialnetwork-74a07.cloudfunctions.net';

  const CITIES = [
    'Ouagadougou',
    'Bobo-Dioulasso',
    'Koudougou',
    'Ouahigouya',
    'Banfora',
    'Dédougou',
    'Autre',
  ];

  const PHONE_RE = /^\+[1-9]\d{7,14}$/;

  let firebaseApp;
  let auth;

  function initFirebase() {
    if (firebaseApp) return;
    firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
    auth = firebase.auth();
  }

  function normalizePhone(input) {
    let s = String(input || '').trim().replace(/[\s-]/g, '');
    if (!s) return '';
    if (!s.startsWith('+')) {
      if (/^\d{8}$/.test(s)) s = '+226' + s;
      else if (/^0\d{8}$/.test(s)) s = '+226' + s.slice(1);
      else if (s.startsWith('226') && s.length === 11) s = '+' + s;
      else s = '+' + s;
    }
    return s;
  }

  function validPhone(input) {
    return PHONE_RE.test(normalizePhone(input));
  }

  async function callFunction(name, data) {
    const user = auth.currentUser;
    if (!user) throw new Error('Non connecté');
    const token = await user.getIdToken();
    const res = await fetch(`${FUNCTIONS_BASE}/${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg =
        json.error?.message || json.error || 'Erreur serveur (' + res.status + ')';
      throw new Error(msg);
    }
    return json.result ?? json.data ?? json;
  }

  function mapAuthError(code) {
    const m = {
      'auth/email-already-in-use': 'Cet email est déjà utilisé. Connectez-vous.',
      'auth/invalid-email': 'Email invalide.',
      'auth/weak-password': 'Mot de passe trop faible (min. 6 caractères).',
      'auth/wrong-password': 'Email ou mot de passe incorrect.',
      'auth/popup-closed-by-user': 'Connexion annulée.',
    };
    return m[code] || 'Erreur de connexion.';
  }

  function bindWhatsAppToggle(checkboxId, wrapId, inputId, phoneInputId) {
    const cb = document.getElementById(checkboxId);
    const wrap = document.getElementById(wrapId);
    const wa = document.getElementById(inputId);
    const phone = document.getElementById(phoneInputId);
    if (!cb || !wrap) return;
    const sync = () => {
      const same = cb.checked;
      wrap.hidden = same;
      if (same && phone && wa) wa.value = phone.value;
    };
    cb.addEventListener('change', sync);
    if (phone) phone.addEventListener('input', () => {
      if (cb.checked && wa) wa.value = phone.value;
    });
    sync();
  }

  function renderAuth(container, partnerType, onAuthed) {
    container.innerHTML = `
      <div class="partner-card partner-auth">
        <h2>Connexion AfroBite</h2>
        <p class="hint">Connectez-vous avant de remplir le formulaire.</p>
        <div class="auth-buttons">
          <button type="button" class="btn btn-google" id="btn-google">Continuer avec Google</button>
          <button type="button" class="btn btn-apple" id="btn-apple">Continuer avec Apple</button>
        </div>
        <div class="divider">ou email</div>
        <div class="tabs">
          <button type="button" class="tab active" data-mode="signup">Créer un compte</button>
          <button type="button" class="tab" data-mode="signin">Se connecter</button>
        </div>
        <form id="email-auth-form">
          <label>Email<input type="email" id="auth-email" required autocomplete="email" /></label>
          <label>Mot de passe<input type="password" id="auth-password" required minlength="6" autocomplete="new-password" /></label>
          <label class="confirm-only">Confirmer le mot de passe<input type="password" id="auth-password2" minlength="6" autocomplete="new-password" /></label>
          <p id="auth-error" class="error" hidden></p>
          <button type="submit" class="btn btn-primary" id="auth-submit">Continuer</button>
        </form>
      </div>`;

    let mode = 'signup';
    const tabs = container.querySelectorAll('.tab');
    const confirm = container.querySelector('.confirm-only');
    const errEl = document.getElementById('auth-error');

    tabs.forEach((t) => {
      t.addEventListener('click', () => {
        mode = t.dataset.mode;
        tabs.forEach((x) => x.classList.toggle('active', x === t));
        confirm.hidden = mode !== 'signup';
        document.getElementById('auth-password').autocomplete =
          mode === 'signup' ? 'new-password' : 'current-password';
      });
    });

    document.getElementById('btn-google').onclick = async () => {
      try {
        await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        onAuthed();
      } catch (e) {
        showErr(e);
      }
    };

    document.getElementById('btn-apple').onclick = async () => {
      try {
        const p = new firebase.auth.OAuthProvider('apple.com');
        await auth.signInWithPopup(p);
        onAuthed();
      } catch (e) {
        showErr(e);
      }
    };

    document.getElementById('email-auth-form').onsubmit = async (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email').value.trim();
      const pass = document.getElementById('auth-password').value;
      const pass2 = document.getElementById('auth-password2').value;
      if (mode === 'signup' && pass !== pass2) {
        showErr(new Error('Les mots de passe ne correspondent pas.'));
        return;
      }
      try {
        if (mode === 'signup') {
          await auth.createUserWithEmailAndPassword(email, pass);
        } else {
          await auth.signInWithEmailAndPassword(email, pass);
        }
        onAuthed();
      } catch (ex) {
        showErr(ex);
      }
    };

    function showErr(e) {
      errEl.hidden = false;
      errEl.textContent = e.code ? mapAuthError(e.code) : e.message;
    }

    auth.onAuthStateChanged((u) => {
      if (u) onAuthed();
    });
  }

  function showConfirmation(root, message) {
    root.innerHTML = `
      <div class="partner-card success-card">
        <h2>Demande envoyée</h2>
        <p>${message}</p>
        <a href="partner.html" class="btn btn-primary">Retour</a>
      </div>`;
  }

  async function checkExisting(partnerType) {
    try {
      const res = await callFunction('getMyPartnerApplication', { partnerType });
      return res.application;
    } catch {
      return null;
    }
  }

  function initRestaurantPage() {
    const root = document.getElementById('partner-app');
    if (!root) return;
    initFirebase();

    const start = async () => {
      const existing = await checkExisting('restaurant');
      if (existing && existing.status !== 'rejected') {
        showConfirmation(
          root,
          'Une candidature existe déjà pour ce compte (statut : ' +
            existing.status +
            ').'
        );
        return;
      }
      renderForm();
    };

    const renderForm = () => {
      const user = auth.currentUser;
      root.innerHTML = `
        <div class="partner-card">
          <p class="signed-in">Connecté : <strong>${user.email || user.uid}</strong>
            <button type="button" id="sign-out" class="link-btn">Changer</button></p>
          <form id="restaurant-form">
            <label>Nom du restaurant *<input name="restaurantName" required /></label>
            <label>Responsable *<input name="ownerName" required /></label>
            <label>Téléphone *<input id="phoneNumber" name="phoneNumber" type="tel" placeholder="+22670123456" required /></label>
            <label class="checkbox"><input type="checkbox" id="wa-same" checked /> Mon numéro WhatsApp est le même</label>
            <div id="wa-wrap" hidden>
              <label>WhatsApp *<input name="whatsappNumber" type="tel" placeholder="+22670123456" /></label>
            </div>
            <label>Email *<input name="email" type="email" value="${user.email || ''}" required /></label>
            <label>Adresse *<input name="address" required /></label>
            <label>Ville *<select name="city" required>${CITIES.map((c) => `<option value="${c}">${c}</option>`).join('')}</select></label>
            <label>Description (50–500 car.) *<textarea name="description" minlength="50" maxlength="500" required></textarea></label>
            <label>Logo (optionnel, JPG/PNG max 2 Mo)<input type="file" name="logo" accept="image/jpeg,image/png" /></label>
            <label>Site web<input name="websiteUrl" type="url" placeholder="https://" /></label>
            <label>Facebook<input name="facebook" /></label>
            <label>Instagram<input name="instagram" /></label>
            <label>TikTok<input name="tiktok" /></label>
            <p id="form-error" class="error" hidden></p>
            <button type="submit" class="btn btn-primary">Envoyer ma candidature</button>
          </form>
        </div>`;
      document.getElementById('sign-out').onclick = () => auth.signOut().then(() => location.reload());
      bindWhatsAppToggle('wa-same', 'wa-wrap', 'whatsappNumber', 'phoneNumber');
      const phoneInput = document.querySelector('[name="phoneNumber"]');
      if (phoneInput && !phoneInput.id) phoneInput.id = 'phoneNumber';
      const waInput = document.querySelector('[name="whatsappNumber"]');
      if (waInput && !waInput.id) waInput.id = 'whatsappNumber';

      document.getElementById('restaurant-form').onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const err = document.getElementById('form-error');
        err.hidden = true;
        const phone = normalizePhone(fd.get('phoneNumber'));
        if (!validPhone(phone)) {
          err.textContent = 'Téléphone invalide (format +226…).';
          err.hidden = false;
          return;
        }
        const waSame = document.getElementById('wa-same').checked;
        const whatsapp = waSame ? phone : normalizePhone(fd.get('whatsappNumber'));
        if (!validPhone(whatsapp)) {
          err.textContent = 'WhatsApp invalide.';
          err.hidden = false;
          return;
        }
        let logoBase64 = null;
        const file = fd.get('logo');
        if (file && file.size) {
          if (file.size > 2 * 1024 * 1024) {
            err.textContent = 'Logo max 2 Mo.';
            err.hidden = false;
            return;
          }
          logoBase64 = await new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(String(r.result).split(',')[1]);
            r.onerror = rej;
            r.readAsDataURL(file);
          });
        }
        try {
          await callFunction('submitPartnerApplication', {
            partnerType: 'restaurant',
            restaurantName: fd.get('restaurantName'),
            ownerName: fd.get('ownerName'),
            phoneNumber: phone,
            whatsappSameAsPhone: waSame,
            whatsappNumber: whatsapp,
            email: fd.get('email'),
            address: fd.get('address'),
            city: fd.get('city'),
            description: fd.get('description'),
            websiteUrl: fd.get('websiteUrl'),
            socialMedia: {
              facebook: fd.get('facebook'),
              instagram: fd.get('instagram'),
              tiktok: fd.get('tiktok'),
            },
            logoBase64,
          });
          showConfirmation(
            root,
            'Votre demande a été reçue. L\'équipe AfroBite vous contactera sur WhatsApp dans les prochains jours.'
          );
        } catch (ex) {
          err.textContent = ex.message;
          err.hidden = false;
        }
      };
    };

    auth.onAuthStateChanged((u) => {
      if (u) start();
      else renderAuth(root, 'restaurant', start);
    });
  }

  function initLivreurPage() {
    const root = document.getElementById('partner-app');
    if (!root) return;
    initFirebase();

    const start = async () => {
      const existing = await checkExisting('delivery');
      if (existing && existing.status !== 'rejected') {
        showConfirmation(
          root,
          'Une candidature existe déjà pour ce compte (statut : ' +
            existing.status +
            ').'
        );
        return;
      }
      renderForm();
    };

    const renderForm = () => {
      const user = auth.currentUser;
      root.innerHTML = `
        <div class="partner-card">
          <p class="signed-in">Connecté : <strong>${user.email || user.uid}</strong>
            <button type="button" id="sign-out" class="link-btn">Changer</button></p>
          <form id="delivery-form">
            <label>Prénom *<input name="firstName" required /></label>
            <label>Nom *<input name="lastName" required /></label>
            <label>Téléphone *<input name="phoneNumber" id="phoneNumber" type="tel" placeholder="+22670123456" required /></label>
            <label class="checkbox"><input type="checkbox" id="wa-same" checked /> Mon numéro WhatsApp est le même</label>
            <div id="wa-wrap" hidden>
              <label>WhatsApp *<input name="whatsappNumber" id="whatsappNumber" type="tel" /></label>
            </div>
            <label>Email *<input name="email" type="email" value="${user.email || ''}" required /></label>
            <label>Ville *<select name="city" required>${CITIES.map((c) => `<option value="${c}">${c}</option>`).join('')}</select></label>
            <fieldset>
              <legend>Type de véhicule *</legend>
              <label class="radio"><input type="radio" name="vehicleType" value="motorcycle" required checked /> Moto</label>
              <label class="radio"><input type="radio" name="vehicleType" value="bicycle" /> Vélo</label>
              <label class="radio"><input type="radio" name="vehicleType" value="car" /> Voiture</label>
            </fieldset>
            <label>Note (optionnel)<textarea name="note"></textarea></label>
            <p id="form-error" class="error" hidden></p>
            <button type="submit" class="btn btn-primary">Envoyer ma candidature</button>
          </form>
        </div>`;
      document.getElementById('sign-out').onclick = () => auth.signOut().then(() => location.reload());
      bindWhatsAppToggle('wa-same', 'wa-wrap', 'whatsappNumber', 'phoneNumber');

      document.getElementById('delivery-form').onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const err = document.getElementById('form-error');
        err.hidden = true;
        const phone = normalizePhone(fd.get('phoneNumber'));
        if (!validPhone(phone)) {
          err.textContent = 'Téléphone invalide.';
          err.hidden = false;
          return;
        }
        const waSame = document.getElementById('wa-same').checked;
        const whatsapp = waSame ? phone : normalizePhone(fd.get('whatsappNumber'));
        if (!validPhone(whatsapp)) {
          err.textContent = 'WhatsApp invalide.';
          err.hidden = false;
          return;
        }
        try {
          await callFunction('submitPartnerApplication', {
            partnerType: 'delivery',
            firstName: fd.get('firstName'),
            lastName: fd.get('lastName'),
            phoneNumber: phone,
            whatsappSameAsPhone: waSame,
            whatsappNumber: whatsapp,
            email: fd.get('email'),
            city: fd.get('city'),
            vehicleType: fd.get('vehicleType'),
            note: fd.get('note'),
          });
          showConfirmation(
            root,
            'Votre demande a été reçue. L\'équipe AfroBite vous contactera sur WhatsApp dans les prochains jours.'
          );
        } catch (ex) {
          err.textContent = ex.message;
          err.hidden = false;
        }
      };
    };

    auth.onAuthStateChanged((u) => {
      if (u) start();
      else renderAuth(root, 'delivery', start);
    });
  }

  const page = document.body.dataset.partnerPage;
  if (page === 'restaurant') initRestaurantPage();
  else if (page === 'livreur') initLivreurPage();
})();
