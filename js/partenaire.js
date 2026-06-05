/**
 * AfroBite partenaire — partenaire-restaurant.html & partenaire-livraison.html
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

  const LEAD_ENDPOINT = `${FUNCTIONS_BASE}/submitPartnerLead`;
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

  function setButtonLoading(btn, loading, defaultLabel) {
    if (!btn) return;
    btn.disabled = loading;
    btn.classList.toggle('is-loading', loading);
    btn.textContent = loading ? 'Envoi en cours…' : defaultLabel;
  }

  function renderAuth(container, partnerType, onAuthed) {
    const typeLabel = partnerType === 'delivery' ? 'livreur' : 'restaurant';
    container.innerHTML = `
      <div class="partner-card partner-auth">
        <p class="hint">Inscrivez-vous ou connectez-vous pour créer votre compte ${typeLabel}. L'équipe AfroBite validera votre accès à l'application.</p>
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
    const errEl = container.querySelector('#auth-error');

    tabs.forEach((t) => {
      t.addEventListener('click', () => {
        mode = t.dataset.mode;
        tabs.forEach((x) => x.classList.toggle('active', x === t));
        confirm.hidden = mode !== 'signup';
        container.querySelector('#auth-password').autocomplete =
          mode === 'signup' ? 'new-password' : 'current-password';
      });
    });

    container.querySelector('#btn-google').onclick = async () => {
      const btn = container.querySelector('#btn-google');
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

    container.querySelector('#btn-apple').onclick = async () => {
      const btn = container.querySelector('#btn-apple');
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

    container.querySelector('#email-auth-form').onsubmit = async (e) => {
      e.preventDefault();
      const authSubmit = container.querySelector('#auth-submit');
      setButtonLoading(authSubmit, true, 'Continuer');
      const email = container.querySelector('#auth-email').value.trim();
      const pass = container.querySelector('#auth-password').value;
      const pass2 = container.querySelector('#auth-password2').value;
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

  function showAccountReady(root, partnerType, linkedCount) {
    const label = partnerType === 'delivery' ? 'livreur' : 'restaurant';
    const linkMsg =
      linkedCount > 0
        ? ' Votre candidature a été associée à ce compte.'
        : '';
    root.innerHTML = `
      <div class="partner-card success-card">
        <h2>Compte ${label} créé</h2>
        <p>Statut : <strong>en attente de validation</strong>. AfroBite vous contactera sur WhatsApp.${linkMsg}</p>
        <p class="hint">Vous pourrez vous connecter à l'application mobile une fois approuvé.</p>
        <button type="button" class="link-btn" id="sign-out-account">Changer de compte</button>
      </div>`;
    root.querySelector('#sign-out-account').onclick = () =>
      auth.signOut().then(() => location.reload());
  }

  function bindLeadForm(form, partnerType, options = {}) {
    if (!form) return;
    const message = form.querySelector('[data-lead-message]');
    const submitBtn = form.querySelector('[data-lead-submit]');
    const latInput = options.latInput || null;
    const lngInput = options.lngInput || null;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      message.textContent = '';
      message.className = 'partner-form-message';
      submitBtn.disabled = true;
      const prevLabel = submitBtn.textContent;
      submitBtn.textContent = 'Envoi en cours…';

      const fd = new FormData(form);
      const phone = normalizePhone(fd.get('phone'));
      if (!validPhone(phone)) {
        message.classList.add('error');
        message.textContent = 'WhatsApp invalide (format +226…).';
        submitBtn.disabled = false;
        submitBtn.textContent = prevLabel;
        return;
      }

      const payload = {
        partnerType,
        ownerName: String(fd.get('ownerName') || '').trim(),
        email: String(fd.get('email') || '').trim(),
        phone,
        city: String(fd.get('city') || '').trim(),
        source: options.source || 'afrobyte_partenaire_page',
        submittedAtClient: new Date().toISOString(),
      };

      if (partnerType === 'restaurant') {
        payload.restaurantName = String(fd.get('restaurantName') || '').trim();
        payload.address = String(fd.get('address') || '').trim();
        payload.description = String(fd.get('description') || '').trim();
        payload.latitude = fd.get('latitude') || null;
        payload.longitude = fd.get('longitude') || null;
      } else {
        payload.companyName = String(fd.get('companyName') || '').trim();
        payload.coveredZone = String(fd.get('coveredZone') || '').trim();
        payload.approximateDriverCount = fd.get('approximateDriverCount') || null;
        payload.note = String(fd.get('note') || '').trim();
      }

      try {
        const response = await fetch(LEAD_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(json.error || 'HTTP ' + response.status);
        form.reset();
        if (latInput) latInput.value = '';
        if (lngInput) lngInput.value = '';
        if (typeof options.onSuccess === 'function') {
          options.onSuccess();
          return;
        }
        message.classList.add('success');
        message.textContent =
          'Merci. Notre équipe vous contactera sur WhatsApp pour la suite du partenariat.';
      } catch (_) {
        message.classList.add('error');
        message.textContent =
          'Échec de l\'envoi. Réessayez ou écrivez à afrobyteapp@gmail.com.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = prevLabel;
      }
    });
  }

  async function finalizePartnerAccount(root, accountType, extra) {
    const partnerType = accountType === 'livreur' ? 'delivery' : 'restaurant';
    const errEl = root.querySelector('#account-error');
    const btn = root.querySelector('#account-finalize');
    if (btn) setButtonLoading(btn, true, 'Créer mon compte');
    try {
      const res = await callFunction('setupPartnerAccount', {
        partnerType,
        email: auth.currentUser?.email || extra?.email || '',
        whatsappNumber: extra?.whatsappNumber || null,
        companyId: extra?.companyId || null,
        companyName: extra?.companyName || null,
        fullName: extra?.fullName || null,
      });
      showAccountReady(root, partnerType, (res.linkedApplicationIds || []).length);
    } catch (ex) {
      if (errEl) {
        errEl.hidden = false;
        errEl.textContent = ex.message;
      }
      if (btn) setButtonLoading(btn, false, 'Créer mon compte');
    }
  }

  function initPartnerAccountBlock(rootId, accountType) {
    const root = document.getElementById(rootId);
    if (!root) return;

    initFirebase();
    let companies = [];
    let accountReady = false;

    const loadCompanies = async () => {
      if (accountType !== 'livreur') return;
      try {
        const res = await callFunction('listActiveDeliveryCompanies', {}, { requireUser: false });
        companies = res.companies || [];
      } catch (_) {
        companies = [];
      }
    };

    const render = async () => {
      if (accountReady) return;
      const user = auth.currentUser;
      if (!user) {
        renderAuth(root, accountType === 'livreur' ? 'delivery' : 'restaurant', () => render());
        return;
      }

      if (accountType === 'livreur' && !companies.length) await loadCompanies();
      const companyOptions = companies.length
        ? companies.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')
        : '<option value="">— Société à confirmer par l\'admin —</option>';

      root.innerHTML = `
        <div class="partner-card">
          <p class="signed-in">Connecté : <strong>${user.email || user.uid}</strong>
            <button type="button" id="sign-out-top-${rootId}" class="link-btn">Changer</button></p>
          ${accountType === 'livreur' ? `
            <label>Nom complet (optionnel)<input id="account-full-name" placeholder="Prénom et nom" /></label>
            <label>WhatsApp (optionnel)<input id="account-whatsapp" type="tel" placeholder="+22670123456" /></label>
            <label>Société de livraison (optionnel)
              <select id="account-company">${companyOptions}</select>
            </label>
          ` : `
            <p class="hint">Votre compte restaurant sera créé avec le statut <strong>en attente</strong>. Nous l'associerons à votre candidature si l'email correspond.</p>
          `}
          <p id="account-error" class="error" hidden></p>
          <button type="button" class="btn btn-primary" id="account-finalize">Créer mon compte</button>
        </div>`;

      root.querySelector(`#sign-out-top-${rootId}`).onclick = () =>
        auth.signOut().then(() => location.reload());

      root.querySelector('#account-finalize').onclick = () => {
        const extra = {};
        if (accountType === 'livreur') {
          extra.fullName = root.querySelector('#account-full-name')?.value?.trim() || '';
          const wa = normalizePhone(root.querySelector('#account-whatsapp')?.value || '');
          if (wa && validPhone(wa)) extra.whatsappNumber = wa;
          const companyId = root.querySelector('#account-company')?.value || '';
          if (companyId) {
            extra.companyId = companyId;
            extra.companyName = companies.find((c) => c.id === companyId)?.name || null;
          }
        }
        finalizePartnerAccount(root, accountType, extra).then(() => {
          accountReady = true;
        });
      };
    };

    auth.onAuthStateChanged(() => {
      accountReady = false;
      render();
    });
    render();
  }

  function initRestaurantPage() {
    const latInput = document.getElementById('lead-restaurant-lat');
    const lngInput = document.getElementById('lead-restaurant-lng');
    const addrInput = document.getElementById('lead-restaurant-address');
    if (addrInput && latInput && lngInput) {
      attachMapboxAddressSearch(addrInput, ({ lat, lng }) => {
        latInput.value = lat;
        lngInput.value = lng;
      });
    }
    bindLeadForm(document.getElementById('partner-lead-form-restaurant'), 'restaurant', {
      source: 'afrobyte_partenaire_restaurant',
      latInput,
      lngInput,
    });
    initPartnerAccountBlock('partner-app-restaurant', 'restaurant');
  }

  function initLivraisonPage() {
    const tabs = document.querySelectorAll('[data-livraison-tab]');
    const societeForm = document.getElementById('partner-lead-form-societe');
    const societeSuccess = document.getElementById('societe-success-block');
    const livreurSection = document.getElementById('livreur-account-section');
    let societeSubmitted = false;

    function setLivraisonTab(tabId) {
      tabs.forEach((el) => el.classList.toggle('active', el.dataset.livraisonTab === tabId));
      if (tabId === 'societe') {
        if (societeForm) societeForm.hidden = societeSubmitted;
        if (societeSuccess) societeSuccess.hidden = !societeSubmitted;
        if (livreurSection) livreurSection.hidden = true;
      } else {
        if (societeForm) societeForm.hidden = true;
        if (societeSuccess) societeSuccess.hidden = true;
        if (livreurSection) livreurSection.hidden = false;
      }
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => setLivraisonTab(tab.dataset.livraisonTab));
    });

    const initialTab =
      location.hash === '#livreur' || location.hash === '#create-driver-account'
        ? 'livreur'
        : 'societe';
    setLivraisonTab(initialTab);

    bindLeadForm(document.getElementById('partner-lead-form-societe'), 'delivery_company', {
      source: 'afrobyte_partenaire_livraison_societe',
      onSuccess: () => {
        societeSubmitted = true;
        if (societeForm) societeForm.hidden = true;
        if (societeSuccess) societeSuccess.hidden = false;
      },
    });

    initPartnerAccountBlock('partner-app-livreur', 'livreur');

    if (location.hash === '#livreur' || location.hash === '#create-driver-account') {
      document.getElementById('livreur-account-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const page = document.body.dataset.partnerPage;
  if (page === 'partenaire-restaurant') initRestaurantPage();
  else if (page === 'partenaire-livraison') initLivraisonPage();
})();
