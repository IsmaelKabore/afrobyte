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
      'auth/email-already-in-use': 'Cet email est déjà utilisé. Utilisez un autre email ou contactez AfroBite.',
      'auth/invalid-email': 'Email invalide.',
      'auth/weak-password': 'Mot de passe trop faible (min. 6 caractères).',
      'auth/popup-closed-by-user': 'Connexion annulée.',
    };
    return m[code] || 'Erreur de création de compte.';
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
        <p class="hint">Créez ici votre compte ${typeLabel}. Une fois validé par AfroBite, vous vous connecterez directement dans l'application mobile avec ces mêmes identifiants.</p>
        <div class="auth-buttons">
          <button type="button" class="btn btn-google" id="btn-google">
            <img src="assets/logo_google.png" alt="" width="20" height="20" />
            Créer avec Google
          </button>
          <button type="button" class="btn btn-apple" id="btn-apple">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05 1.88-3.71 1.88-1.56 0-2.05-.93-3.82-.93-1.77 0-2.32.9-3.78.98-1.51.08-2.66-1.33-3.66-2.28C1.79 16.17 1 12.45 2.43 9.05c.72-1.66 2-2.73 3.4-2.73 1.41 0 2.3.93 3.47.93 1.15 0 1.85-.93 3.5-.93 1.25 0 2.57.68 3.3 1.75-2.9 1.6-2.43 5.77.48 7.21-.6 1.55-1.38 3.1-2.53 4.04zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            Créer avec Apple
          </button>
        </div>
        <div class="divider">ou email</div>
        <form id="email-auth-form">
          <label>Email<input type="email" id="auth-email" required autocomplete="email" /></label>
          <label>Mot de passe<input type="password" id="auth-password" required minlength="6" autocomplete="new-password" /></label>
          <label>Confirmer le mot de passe<input type="password" id="auth-password2" minlength="6" autocomplete="new-password" required /></label>
          <p id="auth-error" class="error" hidden></p>
          <button type="submit" class="btn btn-primary" id="auth-submit">Créer mon compte</button>
        </form>
      </div>`;

    const errEl = container.querySelector('#auth-error');

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
      setButtonLoading(authSubmit, true, 'Créer mon compte');
      const email = container.querySelector('#auth-email').value.trim();
      const pass = container.querySelector('#auth-password').value;
      const pass2 = container.querySelector('#auth-password2').value;
      if (pass !== pass2) {
        showErr(new Error('Les mots de passe ne correspondent pas.'));
        setButtonLoading(authSubmit, false, 'Créer mon compte');
        return;
      }
      try {
        await auth.createUserWithEmailAndPassword(email, pass);
        onAuthed();
      } catch (ex) {
        showErr(ex);
      } finally {
        setButtonLoading(authSubmit, false, 'Créer mon compte');
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
        <p class="hint">Une fois votre compte approuvé et activé par AfroBite, connectez-vous à l'application mobile avec ces mêmes identifiants (email et mot de passe, ou Google/Apple).</p>
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

  async function finalizePartnerAccount(root, accountType, extra, options = {}) {
    const partnerType = accountType === 'livreur' ? 'delivery' : 'restaurant';
    const errEl =
      root.querySelector('#account-error') ||
      (options.errorElId ? document.getElementById(options.errorElId) : null);
    const btn =
      root.querySelector('#account-finalize') ||
      (options.btnId ? document.getElementById(options.btnId) : null);
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

  function getLivreurProfileExtra(companies) {
    const first = document.getElementById('driver-first-name')?.value?.trim() || '';
    const last = document.getElementById('driver-last-name')?.value?.trim() || '';
    const companyName = document.getElementById('driver-company-name')?.value?.trim() || '';
    const wa = normalizePhone(document.getElementById('driver-whatsapp-prefill')?.value || '');
    const errEl = document.getElementById('livreur-profile-error');
    if (!first || !last) {
      if (errEl) {
        errEl.hidden = false;
        errEl.textContent = 'Prénom et nom sont obligatoires.';
      }
      return null;
    }
    if (!validPhone(wa)) {
      if (errEl) {
        errEl.hidden = false;
        errEl.textContent = 'WhatsApp invalide (format +226…).';
      }
      return null;
    }
    if (errEl) errEl.hidden = true;
    const matched = companies.find(
      (c) => c.name && c.name.trim().toLowerCase() === companyName.toLowerCase()
    );
    return {
      fullName: `${first} ${last}`.trim(),
      whatsappNumber: wa,
      companyName: companyName || null,
      companyId: matched?.id || null,
    };
  }

  function setLivreurProfileVisible(visible) {
    const block = document.getElementById('livreur-profile-fields');
    if (block) block.hidden = !visible;
  }

  function initPartnerAccountBlock(rootId, accountType) {
    const root = document.getElementById(rootId);
    if (!root) return;

    initFirebase();
    let companies = [];
    let accountReady = false;
    const useExternalLivreurFields =
      accountType === 'livreur' && !!document.getElementById('livreur-profile-fields');

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
        if (useExternalLivreurFields) setLivreurProfileVisible(false);
        renderAuth(root, accountType === 'livreur' ? 'delivery' : 'restaurant', () => render());
        return;
      }

      if (accountType === 'livreur' && !companies.length) await loadCompanies();
      if (useExternalLivreurFields) setLivreurProfileVisible(!!user);

      const companyOptions = companies.length
        ? companies.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')
        : '<option value="">— Société à confirmer par l\'admin —</option>';

      const livreurExternal = accountType === 'livreur' && useExternalLivreurFields;
      const livreurFieldsBlock =
        accountType === 'livreur' && !useExternalLivreurFields
          ? `
            <label>Nom complet (optionnel)<input id="account-full-name" placeholder="Prénom et nom" /></label>
            <label>WhatsApp (optionnel)<input id="account-whatsapp" type="tel" placeholder="+22670123456" /></label>
            <label>Société de livraison (optionnel)
              <select id="account-company">${companyOptions}</select>
            </label>
          `
          : accountType === 'livreur'
            ? `<p class="hint">Complétez votre profil ci-dessous puis validez l'inscription.</p>`
            : `<p class="hint">Votre compte restaurant sera créé avec le statut <strong>en attente</strong>. Nous l'associerons à votre candidature si l'email correspond.</p>`;

      root.innerHTML = `
        <div class="partner-card">
          <p class="signed-in">Connecté : <strong>${user.email || user.uid}</strong>
            <button type="button" id="sign-out-top-${rootId}" class="link-btn">Changer</button></p>
          ${livreurFieldsBlock}
          ${
            livreurExternal
              ? ''
              : `<p id="account-error" class="error" hidden></p>
          <button type="button" class="btn btn-primary" id="account-finalize">${
            accountType === 'livreur' ? 'Créer mon compte livreur' : 'Créer mon compte'
          }</button>`
          }
        </div>`;

      root.querySelector(`#sign-out-top-${rootId}`).onclick = () =>
        auth.signOut().then(() => location.reload());

      const runFinalize = () => {
        const extra = {};
        if (accountType === 'livreur') {
          if (useExternalLivreurFields) {
            const profile = getLivreurProfileExtra(companies);
            if (!profile) return;
            Object.assign(extra, profile);
          } else {
            extra.fullName = root.querySelector('#account-full-name')?.value?.trim() || '';
            const wa = normalizePhone(root.querySelector('#account-whatsapp')?.value || '');
            if (wa && validPhone(wa)) extra.whatsappNumber = wa;
            const companyId = root.querySelector('#account-company')?.value || '';
            if (companyId) {
              extra.companyId = companyId;
              extra.companyName = companies.find((c) => c.id === companyId)?.name || null;
            }
          }
        }
        const finalizeOpts = livreurExternal
          ? { errorElId: 'account-error-livreur', btnId: 'livreur-finalize-btn' }
          : {};
        finalizePartnerAccount(root, accountType, extra, finalizeOpts).then(() => {
          accountReady = true;
          if (livreurExternal) setLivreurProfileVisible(false);
        });
      };

      const finalizeBtn = livreurExternal
        ? document.getElementById('livreur-finalize-btn')
        : root.querySelector('#account-finalize');
      if (finalizeBtn) finalizeBtn.onclick = runFinalize;
    };

    auth.onAuthStateChanged(() => {
      accountReady = false;
      if (useExternalLivreurFields) setLivreurProfileVisible(!!auth.currentUser);
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
      onSuccess: () => {
        const accountSection = document.getElementById('compte-restaurant');
        if (accountSection) {
          accountSection.hidden = false;
          accountSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        const message = document.querySelector('#partner-lead-form-restaurant [data-lead-message]');
        if (message) {
          message.className = 'partner-form-message success';
          message.textContent = 'Candidature reçue. Vous pouvez maintenant créer le compte restaurant.';
        }
      },
    });
    initPartnerAccountBlock('partner-app-restaurant', 'restaurant');
  }

  async function initLivraisonPage() {
    const tabs = document.querySelectorAll('[data-livraison-tab]');
    const panels = document.querySelectorAll('[data-livraison-panel]');
    const societeForm = document.getElementById('partner-lead-form-societe');
    const societeSuccess = document.getElementById('societe-success-block');
    let societeSubmitted = false;

    function setLivraisonTab(tabId) {
      tabs.forEach((el) => {
        const active = el.dataset.livraisonTab === tabId;
        el.classList.toggle('active', active);
        el.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      panels.forEach((panel) => {
        const isSociete = panel.dataset.livraisonPanel === 'societe';
        panel.hidden = tabId === 'societe' ? !isSociete : isSociete;
        if (isSociete && tabId === 'societe') {
          if (societeSuccess) societeSuccess.hidden = !societeSubmitted;
          if (societeForm) societeForm.hidden = societeSubmitted;
        }
      });
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const tabId = tab.dataset.livraisonTab;
        setLivraisonTab(tabId);
        if (tabId === 'livreur') location.hash = 'livreur';
        else location.hash = 'societe';
      });
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
        setLivraisonTab('societe');
      },
    });

    initFirebase();
    try {
      const res = await callFunction('listActiveDeliveryCompanies', {}, { requireUser: false });
      const companies = res.companies || [];
      const datalist = document.getElementById('driver-company-suggestions');
      if (datalist && companies.length) {
        datalist.innerHTML = companies.map((c) => `<option value="${c.name}"></option>`).join('');
      }
    } catch (_) {
      /* suggestions optionnelles — inscription possible sans liste */
    }

    const profileFields = document.getElementById('livreur-profile-fields');
    if (profileFields && !document.getElementById('livreur-profile-error')) {
      const err = document.createElement('p');
      err.id = 'livreur-profile-error';
      err.className = 'partner-form-message error';
      err.hidden = true;
      profileFields.appendChild(err);
    }

    initPartnerAccountBlock('partner-app-livreur', 'livreur');

    if (location.hash === '#livreur' || location.hash === '#create-driver-account') {
      const target = document.getElementById('inscription-livraison');
      if (target && typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  const page = document.body.dataset.partnerPage;
  if (page === 'partenaire-restaurant') initRestaurantPage();
  else if (page === 'partenaire-livraison') initLivraisonPage();
})();
