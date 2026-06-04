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

  async function callFunction(name, data, { requireUser = true } = {}) {
    const user = auth.currentUser;
    if (requireUser && !user) throw new Error('Non connecté');
    const token = user ? await user.getIdToken() : null;
    const res = await fetch(`${FUNCTIONS_BASE}/${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

  function attachMapboxAddressSearch(inputEl, onPick) {
    const token = window.AFROBITE_MAPBOX_TOKEN;
    if (!token || !inputEl) return;
    let list = inputEl.parentElement.querySelector('.mapbox-suggestions');
    if (!list) {
      list = document.createElement('ul');
      list.className = 'mapbox-suggestions';
      list.hidden = true;
      inputEl.parentElement.appendChild(list);
    }
    let timer;
    inputEl.addEventListener('input', () => {
      clearTimeout(timer);
      const q = inputEl.value.trim();
      if (q.length < 3) {
        list.hidden = true;
        return;
      }
      timer = setTimeout(async () => {
        try {
          const url =
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json` +
            `?access_token=${encodeURIComponent(token)}&limit=5&country=bf&language=fr`;
          const res = await fetch(url);
          const data = await res.json();
          list.innerHTML = '';
          (data.features || []).forEach((f) => {
            const li = document.createElement('li');
            li.textContent = f.place_name;
            li.onclick = () => {
              inputEl.value = f.place_name;
              list.hidden = true;
              const [lng, lat] = f.center;
              onPick({ lat, lng, placeName: f.place_name });
            };
            list.appendChild(li);
          });
          list.hidden = !list.children.length;
        } catch (_) {
          list.hidden = true;
        }
      }, 350);
    });
  }

  async function loadMapboxGl() {
    if (window.mapboxgl) return window.mapboxgl;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.css';
    document.head.appendChild(link);
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return window.mapboxgl;
  }

  function attachRestaurantLocationPicker(addressInput, latInput, lngInput) {
    const token = window.AFROBITE_MAPBOX_TOKEN;
    if (!token || !addressInput?.parentElement) return;

    const picker = document.createElement('div');
    picker.className = 'location-picker';
    const hint = document.createElement('p');
    hint.className = 'hint';
    hint.textContent =
      'Recherchez une adresse, placez le repère sur la carte ou utilisez votre position GPS.';
    const mapEl = document.createElement('div');
    mapEl.className = 'mapbox-mini-map';
    const gpsBtn = document.createElement('button');
    gpsBtn.type = 'button';
    gpsBtn.className = 'btn btn-secondary location-gps-btn';
    gpsBtn.textContent = 'Utiliser ma position GPS';
    picker.appendChild(hint);
    picker.appendChild(mapEl);
    picker.appendChild(gpsBtn);
    addressInput.parentElement.appendChild(picker);

    const setCoords = async (lat, lng) => {
      latInput.value = String(lat);
      lngInput.value = String(lng);
      try {
        const url =
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json` +
          `?access_token=${encodeURIComponent(token)}&limit=1&language=fr`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.features?.[0]) addressInput.value = data.features[0].place_name;
      } catch (_) {}
    };

    let map;
    let marker;
    loadMapboxGl().then((mapboxgl) => {
      mapboxgl.accessToken = token;
      const center = [-1.51966, 12.371427];
      map = new mapboxgl.Map({
        container: mapEl,
        style: 'mapbox://styles/mapbox/streets-v12',
        center,
        zoom: 12,
      });
      marker = new mapboxgl.Marker({ draggable: true }).setLngLat(center).addTo(map);
      const onMove = () => {
        const { lng, lat } = marker.getLngLat();
        setCoords(lat, lng);
      };
      marker.on('dragend', onMove);
      map.on('click', (e) => {
        marker.setLngLat(e.lngLat);
        onMove();
      });
    });

    gpsBtn.onclick = () => {
      if (!navigator.geolocation) {
        alert('La géolocalisation n\'est pas disponible sur cet appareil.');
        return;
      }
      gpsBtn.disabled = true;
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          await setCoords(lat, lng);
          if (marker && map) {
            marker.setLngLat([lng, lat]);
            map.flyTo({ center: [lng, lat], zoom: 15 });
          }
          gpsBtn.disabled = false;
        },
        () => {
          alert('Impossible d\'obtenir votre position. Autorisez le GPS ou placez le repère sur la carte.');
          gpsBtn.disabled = false;
        },
        { enableHighAccuracy: true, timeout: 15000 }
      );
    };
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

  function setButtonLoading(btn, loading, defaultLabel) {
    if (!btn) return;
    btn.disabled = loading;
    btn.classList.toggle('is-loading', loading);
    btn.textContent = loading ? 'Envoi en cours…' : defaultLabel;
  }

  function renderAuth(container, partnerType, onAuthed) {
    container.innerHTML = `
      <div class="partner-card partner-auth">
        <h2>Créer votre compte</h2>
        <p class="hint">Connectez-vous pour envoyer votre candidature.</p>
        <div class="auth-buttons">
          <button type="button" class="btn btn-google" id="btn-google">
            <img src="assets/logo_google.png" alt="" width="20" height="20" />
            Continuer avec Google
          </button>
          <button type="button" class="btn btn-apple" id="btn-apple">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05 1.88-3.71 1.88-1.56 0-2.05-.93-3.82-.93-1.77 0-2.32.9-3.78.98-1.51.08-2.66-1.33-3.66-2.28C1.79 16.17 1 12.45 2.43 9.05c.72-1.66 2-2.73 3.4-2.73 1.41 0 2.3.93 3.47.93 1.15 0 1.85-.93 3.5-.93 1.25 0 2.57.68 3.3 1.75-2.9 1.6-2.43 5.77.48 7.21-.6 1.55-1.38 3.1-2.53 4.04zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            Continuer avec Apple
          </button>
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
      const btn = document.getElementById('btn-google');
      btn.disabled = true;
      btn.classList.add('is-loading');
      try {
        await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        onAuthed();
      } catch (e) {
        showErr(e);
      } finally {
        btn.disabled = false;
        btn.classList.remove('is-loading');
      }
    };

    document.getElementById('btn-apple').onclick = async () => {
      const btn = document.getElementById('btn-apple');
      btn.disabled = true;
      btn.classList.add('is-loading');
      try {
        const p = new firebase.auth.OAuthProvider('apple.com');
        await auth.signInWithPopup(p);
        onAuthed();
      } catch (e) {
        showErr(e);
      } finally {
        btn.disabled = false;
        btn.classList.remove('is-loading');
      }
    };

    document.getElementById('email-auth-form').onsubmit = async (e) => {
      e.preventDefault();
      const authSubmit = document.getElementById('auth-submit');
      setButtonLoading(authSubmit, true, 'Continuer');
      const email = document.getElementById('auth-email').value.trim();
      const pass = document.getElementById('auth-password').value;
      const pass2 = document.getElementById('auth-password2').value;
      if (mode === 'signup' && pass !== pass2) {
        showErr(new Error('Les mots de passe ne correspondent pas.'));
        setButtonLoading(authSubmit, false, 'Continuer');
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
      } finally {
        setButtonLoading(authSubmit, false, 'Continuer');
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

  function renderAuthBelow(root, partnerType, onAuthed) {
    const sep = document.createElement('div');
    sep.className = 'partner-section-separator';
    sep.innerHTML = '<hr /><h3>Créer votre compte</h3><p class="hint">Étape finale — requis pour envoyer la candidature.</p>';
    const slot = document.createElement('div');
    slot.id = 'partner-auth-slot';
    root.appendChild(sep);
    root.appendChild(slot);
    if (auth.currentUser) {
      slot.innerHTML = `<p class="signed-in">Connecté : <strong>${auth.currentUser.email || auth.currentUser.uid}</strong>
        <button type="button" id="sign-out" class="link-btn">Changer de compte</button></p>`;
      document.getElementById('sign-out').onclick = () => auth.signOut().then(() => location.reload());
    } else {
      renderAuth(slot, partnerType, onAuthed);
    }
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
          ${user ? `<p class="signed-in">Connecté : <strong>${user.email || user.uid}</strong>
            <button type="button" id="sign-out-top" class="link-btn">Changer</button></p>` : ''}
          <form id="restaurant-form">
            <label>Nom du restaurant *<input name="restaurantName" required /></label>
            <label>Responsable *<input name="ownerName" required /></label>
            <label>WhatsApp *<input id="whatsappNumber" name="whatsappNumber" type="tel" placeholder="+22670123456" required /></label>
            <label>Email *<input name="email" type="email" value="${user ? (user.email || '') : ''}" required /></label>
            <label>Adresse du restaurant
              <input name="address" id="restaurant-address" placeholder="Rechercher une adresse…" autocomplete="off" />
              <input type="hidden" name="latitude" id="restaurant-lat" />
              <input type="hidden" name="longitude" id="restaurant-lng" />
            </label>
            <label>Ville *<select name="city" required>${CITIES.map((c) => `<option value="${c}">${c}</option>`).join('')}</select></label>
            <label>Description (50–500 car.) *<textarea name="description" minlength="50" maxlength="500" required></textarea></label>
            <label>Logo (optionnel, JPG/PNG max 2 Mo)<input type="file" name="logo" accept="image/jpeg,image/png" /></label>
            <label>Site web<input name="websiteUrl" type="url" placeholder="https://" /></label>
            <label>Facebook<input name="facebook" /></label>
            <label>Instagram<input name="instagram" /></label>
            <label>TikTok<input name="tiktok" /></label>
            <p id="form-error" class="error" hidden></p>
            <button type="submit" class="btn btn-primary" id="restaurant-submit">Envoyer ma candidature</button>
          </form>
        </div>`;
      if (user) {
        const so = document.getElementById('sign-out-top');
        if (so) so.onclick = () => auth.signOut().then(() => location.reload());
      }
      renderAuthBelow(root, 'restaurant', () => renderForm());

      const addrInput = document.getElementById('restaurant-address');
      const latInput = document.getElementById('restaurant-lat');
      const lngInput = document.getElementById('restaurant-lng');
      attachMapboxAddressSearch(addrInput, ({ lat, lng }) => {
        latInput.value = lat;
        lngInput.value = lng;
      });
      attachRestaurantLocationPicker(addrInput, latInput, lngInput);

      document.getElementById('restaurant-form').onsubmit = async (e) => {
        e.preventDefault();
        const err = document.getElementById('form-error');
        const submitBtn = document.getElementById('restaurant-submit');
        err.hidden = true;
        if (!auth.currentUser) {
          err.textContent = 'Créez votre compte ou connectez-vous ci-dessous avant d\'envoyer.';
          err.hidden = false;
          return;
        }
        setButtonLoading(submitBtn, true, 'Envoyer ma candidature');
        const fd = new FormData(e.target);
        const whatsapp = normalizePhone(fd.get('whatsappNumber'));
        if (!validPhone(whatsapp)) {
          err.textContent = 'WhatsApp invalide (format international +226…).';
          err.hidden = false;
          setButtonLoading(submitBtn, false, 'Envoyer ma candidature');
          return;
        }
        const phone = whatsapp;
        let logoBase64 = null;
        const file = fd.get('logo');
        if (file && file.size) {
          if (file.size > 2 * 1024 * 1024) {
            err.textContent = 'Logo max 2 Mo.';
            err.hidden = false;
            setButtonLoading(submitBtn, false, 'Envoyer ma candidature');
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
          const lat = parseFloat(fd.get('latitude'));
          const lng = parseFloat(fd.get('longitude'));
          await callFunction('submitPartnerApplication', {
            partnerType: 'restaurant',
            restaurantName: fd.get('restaurantName'),
            ownerName: fd.get('ownerName'),
            phoneNumber: phone,
            whatsappSameAsPhone: true,
            whatsappNumber: whatsapp,
            email: fd.get('email'),
            address: fd.get('address'),
            latitude: Number.isFinite(lat) ? lat : null,
            longitude: Number.isFinite(lng) ? lng : null,
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
        } finally {
          setButtonLoading(submitBtn, false, 'Envoyer ma candidature');
        }
      };
    };

    auth.onAuthStateChanged(() => start());
    start();
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

    const renderForm = async () => {
      const user = auth.currentUser;
      let companies = [];
      try {
        const res = await callFunction('listActiveDeliveryCompanies', {}, { requireUser: false });
        companies = res.companies || [];
      } catch (_) {}
      const companyOptions = companies.length
        ? companies.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')
        : '<option value="">— Aucune société active —</option>';
      root.innerHTML = `
        <div class="partner-card">
          ${user ? `<p class="signed-in">Connecté : <strong>${user.email || user.uid}</strong>
            <button type="button" id="sign-out-top" class="link-btn">Changer</button></p>` : ''}
          <form id="delivery-form">
            <label>Nom complet *<input name="fullName" required placeholder="Prénom et nom" /></label>
            <label>WhatsApp *<input name="whatsappNumber" id="whatsappNumber" type="tel" placeholder="+22670123456" required /></label>
            <label>Email *<input name="email" type="email" value="${user ? (user.email || '') : ''}" required /></label>
            <label>Ville *<select name="city" required>${CITIES.map((c) => `<option value="${c}">${c}</option>`).join('')}</select></label>
            <label>Société de livraison *<select name="companyId" required>${companyOptions}</select></label>
            <label>Immatriculation (optionnel)<input name="licensePlate" /></label>
            <label>Pièce d'identité / CNB (optionnel)<input name="idDocumentRef" placeholder="Réf. ou n° document" /></label>
            <fieldset>
              <legend>Type de véhicule *</legend>
              <label class="radio"><input type="radio" name="vehicleType" value="motorcycle" required checked /> Moto</label>
              <label class="radio"><input type="radio" name="vehicleType" value="bicycle" /> Vélo</label>
              <label class="radio"><input type="radio" name="vehicleType" value="car" /> Voiture</label>
            </fieldset>
            <label>Note (optionnel)<textarea name="note"></textarea></label>
            <p id="form-error" class="error" hidden></p>
            <button type="submit" class="btn btn-primary" id="delivery-submit">Envoyer ma candidature</button>
          </form>
        </div>`;
      if (user) {
        const so = document.getElementById('sign-out-top');
        if (so) so.onclick = () => auth.signOut().then(() => location.reload());
      }
      renderAuthBelow(root, 'delivery', () => renderForm());

      document.getElementById('delivery-form').onsubmit = async (e) => {
        e.preventDefault();
        const err = document.getElementById('form-error');
        const submitBtn = document.getElementById('delivery-submit');
        err.hidden = true;
        if (!auth.currentUser) {
          err.textContent = 'Créez votre compte ou connectez-vous ci-dessous avant d\'envoyer.';
          err.hidden = false;
          return;
        }
        setButtonLoading(submitBtn, true, 'Envoyer ma candidature');
        const fd = new FormData(e.target);
        const whatsapp = normalizePhone(fd.get('whatsappNumber'));
        if (!validPhone(whatsapp)) {
          err.textContent = 'WhatsApp invalide (format +226…).';
          err.hidden = false;
          setButtonLoading(submitBtn, false, 'Envoyer ma candidature');
          return;
        }
        const fullName = String(fd.get('fullName') || '').trim();
        const parts = fullName.split(/\s+/);
        const firstName = parts[0] || fullName;
        const lastName = parts.slice(1).join(' ') || fullName;
        try {
          const companyId = fd.get('companyId');
          const company = companies.find((c) => c.id === companyId);
          await callFunction('submitPartnerApplication', {
            partnerType: 'delivery',
            firstName,
            lastName,
            phoneNumber: whatsapp,
            whatsappSameAsPhone: true,
            whatsappNumber: whatsapp,
            email: fd.get('email'),
            city: fd.get('city'),
            companyId: companyId || null,
            companyName: company?.name || null,
            licensePlate: fd.get('licensePlate'),
            idDocumentRef: fd.get('idDocumentRef'),
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
        } finally {
          setButtonLoading(submitBtn, false, 'Envoyer ma candidature');
        }
      };
    };

    auth.onAuthStateChanged(() => start());
    start();
  }

  // ── Delivery company application ─────────────────────────────────────────
  function initSocietePage() {
    const root = document.getElementById('partner-app');
    if (!root) return;
    initFirebase();

    const start = async () => {
      const existing = await checkExisting('delivery_company');
      if (existing && existing.status !== 'rejected') {
        showConfirmation(
          root,
          'Une candidature existe déjà pour ce compte (statut : ' + existing.status + ').'
        );
        return;
      }
      renderForm();
    };

    const renderForm = () => {
      const user = auth.currentUser;
      root.innerHTML = `
        <div class="partner-card">
          ${user ? `<p class="signed-in">Connecté : <strong>${user.email || user.uid}</strong>
            <button type="button" id="sign-out-top" class="link-btn">Changer</button></p>` : ''}
          <form id="societe-form">
            <label>Nom de la société *<input name="companyName" required /></label>
            <label>Nom du gérant *<input name="ownerName" required /></label>
            <label>WhatsApp du gérant *<input name="whatsappNumber" id="whatsappNumber" type="tel" placeholder="+22670123456" required /></label>
            <label>Email *<input name="email" type="email" value="${user ? (user.email || '') : ''}" required /></label>
            <label>Ville *<select name="city" required>${CITIES.map((c) => `<option value="${c}">${c}</option>`).join('')}</select></label>
            <fieldset>
              <legend>Types de véhicules *</legend>
              <label class="checkbox"><input type="checkbox" name="vehicleTypes" value="motorcycle" checked /> Moto</label>
              <label class="checkbox"><input type="checkbox" name="vehicleTypes" value="bicycle" /> Vélo</label>
              <label class="checkbox"><input type="checkbox" name="vehicleTypes" value="car" /> Voiture</label>
            </fieldset>
            <label>Réseaux sociaux (optionnel)<input name="socialMedia" placeholder="Facebook / Instagram" /></label>
            <label>Note (optionnel)<textarea name="note"></textarea></label>
            <p id="form-error" class="error" hidden></p>
            <button type="submit" class="btn btn-primary" id="societe-submit">Envoyer ma candidature</button>
          </form>
        </div>`;
      if (user) {
        const so = document.getElementById('sign-out-top');
        if (so) so.onclick = () => auth.signOut().then(() => location.reload());
      }
      renderAuthBelow(root, 'delivery_company', () => renderForm());

      document.getElementById('societe-form').onsubmit = async (e) => {
        e.preventDefault();
        const err = document.getElementById('form-error');
        const submitBtn = document.getElementById('societe-submit');
        err.hidden = true;
        if (!auth.currentUser) {
          err.textContent = 'Créez votre compte ou connectez-vous ci-dessous avant d\'envoyer.';
          err.hidden = false;
          return;
        }
        setButtonLoading(submitBtn, true, 'Envoyer ma candidature');
        const fd = new FormData(e.target);
        const whatsapp = normalizePhone(fd.get('whatsappNumber'));
        if (!validPhone(whatsapp)) {
          err.textContent = 'WhatsApp invalide.';
          err.hidden = false;
          setButtonLoading(submitBtn, false, 'Envoyer ma candidature');
          return;
        }
        const phone = whatsapp;
        const vehicleTypes = fd.getAll('vehicleTypes');
        try {
          await callFunction('submitPartnerApplication', {
            partnerType: 'delivery_company',
            companyName: fd.get('companyName'),
            ownerName: fd.get('ownerName'),
            phoneNumber: phone,
            whatsappSameAsPhone: true,
            whatsappNumber: whatsapp,
            email: fd.get('email'),
            city: fd.get('city'),
            vehicleTypes,
            socialMedia: fd.get('socialMedia'),
            note: fd.get('note'),
          });
          showConfirmation(
            root,
            'Votre demande a été reçue. L\'équipe AfroBite vous contactera sur WhatsApp dans les prochains jours.'
          );
        } catch (ex) {
          err.textContent = ex.message;
          err.hidden = false;
        } finally {
          setButtonLoading(submitBtn, false, 'Envoyer ma candidature');
        }
      };
    };

    auth.onAuthStateChanged(() => start());
    start();
  }

  function initPartenaireHub() {
    const root = document.getElementById('partner-app');
    if (!root) return;
    const tabs = document.querySelectorAll('[data-partner-tab]');
    const frame = document.createElement('iframe');
    frame.title = 'Inscription partenaire AfroBite';
    frame.style.cssText = 'width:100%;min-height:780px;border:0;border-radius:12px;background:#1a1208;';
    root.appendChild(frame);

    const setTab = (t) => {
      tabs.forEach((el) => el.classList.toggle('active', el.dataset.partnerTab === t));
      frame.src = t === 'livreur' ? 'partner-livreur.html' : 'partner-restaurant.html';
    };
    tabs.forEach((el) => {
      el.addEventListener('click', () => setTab(el.dataset.partnerTab));
    });
    setTab('restaurant');
  }

  const page = document.body.dataset.partnerPage;
  if (page === 'partenaire') initPartenaireHub();
  else if (page === 'restaurant') initRestaurantPage();
  else if (page === 'livreur') initLivreurPage();
  else if (page === 'societe') initSocietePage();
})();
