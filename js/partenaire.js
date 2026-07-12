/**
 * AfroBite partenaire — partenaire-restaurant.html & partenaire-livraison.html
 *
 * Parcours volontairement SANS connexion sur le site : chaque formulaire
 * crée le compte Firebase ET envoie les informations en une seule soumission.
 * Le partenaire se connecte ensuite uniquement dans l'application mobile,
 * une fois validé par AfroBite.
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
      'auth/email-already-in-use':
        'Cet email a déjà un compte AfroBite avec un autre mot de passe. Utilisez un autre email ou écrivez à afrobyteapp@gmail.com.',
      'auth/invalid-email': 'Email invalide.',
      'auth/weak-password': 'Mot de passe trop faible (min. 6 caractères).',
      'auth/popup-closed-by-user': 'Connexion annulée.',
      'auth/popup-blocked': 'Popup bloquée par le navigateur — autorisez les popups puis réessayez.',
    };
    return m[code] || 'Erreur de création de compte.';
  }

  async function signInWithProvider(kind) {
    const provider =
      kind === 'google'
        ? new firebase.auth.GoogleAuthProvider()
        : new firebase.auth.OAuthProvider('apple.com');
    const cred = await auth.signInWithPopup(provider);
    return cred.user;
  }

  /** Valide un sous-ensemble de champs (parcours Google/Apple : les champs
   *  email/mot de passe du formulaire ne sont pas utilisés). */
  function validateFields(form, names) {
    for (const name of names) {
      const el = form.querySelector(`[name="${name}"]`);
      if (el && !el.checkValidity()) {
        el.reportValidity();
        return false;
      }
    }
    return true;
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

  function setMessage(el, kind, text) {
    if (!el) return;
    el.className = 'partner-form-message' + (kind ? ' ' + kind : '');
    el.textContent = text || '';
  }

  /**
   * Crée le compte Firebase (ou le réutilise si un précédent essai a déjà
   * créé/connecté ce même email — permet de réessayer après un échec réseau).
   */
  async function ensureAccount(email, password) {
    const current = auth.currentUser;
    if (current && (current.email || '').toLowerCase() === email.toLowerCase()) {
      return current;
    }
    if (current) await auth.signOut();
    try {
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      return cred.user;
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        // L'email existe déjà : on tente la connexion avec le mot de passe
        // fourni (cas « je réessaie après une erreur ») avant d'abandonner.
        try {
          const cred = await auth.signInWithEmailAndPassword(email, password);
          return cred.user;
        } catch (_) {
          throw e;
        }
      }
      throw e;
    }
  }

  function showSuccess(form, successEl) {
    if (form) form.hidden = true;
    if (successEl) {
      successEl.hidden = false;
      successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // ── Société de livraison : candidature simple, sans compte ─────────────────
  function bindLeadForm(form, partnerType, options = {}) {
    if (!form) return;
    const message = form.querySelector('[data-lead-message]');
    const submitBtn = form.querySelector('[data-lead-submit]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      setMessage(message, '', '');
      const prevLabel = submitBtn.textContent;
      setButtonLoading(submitBtn, true, prevLabel);

      const fd = new FormData(form);
      const phone = normalizePhone(fd.get('phone'));
      if (!validPhone(phone)) {
        setMessage(message, 'error', 'WhatsApp invalide (format +226…).');
        setButtonLoading(submitBtn, false, prevLabel);
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
        companyName: String(fd.get('companyName') || '').trim(),
        coveredZone: String(fd.get('coveredZone') || '').trim(),
        approximateDriverCount: fd.get('approximateDriverCount') || null,
        note: String(fd.get('note') || '').trim(),
      };

      try {
        const response = await fetch(LEAD_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(json.error || 'HTTP ' + response.status);
        form.reset();
        if (typeof options.onSuccess === 'function') options.onSuccess();
      } catch (_) {
        setMessage(
          message,
          'error',
          "Échec de l'envoi. Réessayez ou écrivez à afrobyteapp@gmail.com."
        );
      } finally {
        setButtonLoading(submitBtn, false, prevLabel);
      }
    });
  }

  // ── Restaurant : infos + compte en UNE soumission ──────────────────────────
  function initRestaurantPage() {
    initFirebase();

    const latInput = document.getElementById('lead-restaurant-lat');
    const lngInput = document.getElementById('lead-restaurant-lng');
    const addrInput = document.getElementById('lead-restaurant-address');
    if (addrInput && latInput && lngInput) {
      attachMapboxAddressSearch(addrInput, ({ lat, lng }) => {
        latInput.value = lat;
        lngInput.value = lng;
      });
    }

    const form = document.getElementById('restaurant-signup-form');
    if (!form) return;
    const message = form.querySelector('[data-signup-message]');
    const submitBtn = form.querySelector('[data-signup-submit]');
    const successEl = document.getElementById('restaurant-success');
    const INFO_FIELDS = ['restaurantName', 'ownerName', 'phone', 'city', 'address'];

    // Candidature + liaison du compte — commun aux parcours email et Google/Apple.
    async function finalizeRestaurant(fd, email, phone) {
      const leadPayload = {
        partnerType: 'restaurant',
        restaurantName: String(fd.get('restaurantName') || '').trim(),
        ownerName: String(fd.get('ownerName') || '').trim(),
        email,
        phone,
        city: String(fd.get('city') || '').trim(),
        address: String(fd.get('address') || '').trim(),
        description: String(fd.get('description') || '').trim(),
        latitude: fd.get('latitude') || null,
        longitude: fd.get('longitude') || null,
        source: 'afrobyte_partenaire_restaurant',
        submittedAtClient: new Date().toISOString(),
      };
      const response = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload),
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(json.error || 'HTTP ' + response.status);

      await callFunction('setupPartnerAccount', {
        partnerType: 'restaurant',
        email,
        whatsappNumber: phone,
        fullName: leadPayload.ownerName || null,
      });
      showSuccess(form, successEl);
    }

    function signupError(ex) {
      setMessage(
        message,
        'error',
        ex.code
          ? mapAuthError(ex.code)
          : (ex.message || 'Erreur — réessayez.') +
              (auth.currentUser
                ? ' Votre compte a bien été créé : cliquez à nouveau pour renvoyer la candidature.'
                : '')
      );
    }

    // Parcours email + mot de passe.
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const fd = new FormData(form);
      const phone = normalizePhone(fd.get('phone'));
      const email = String(fd.get('email') || '').trim();
      const password = String(fd.get('password') || '');
      const password2 = String(fd.get('password2') || '');

      if (!validPhone(phone)) {
        setMessage(message, 'error', 'WhatsApp invalide (format +226…).');
        return;
      }
      if (password !== password2) {
        setMessage(message, 'error', 'Les mots de passe ne correspondent pas.');
        return;
      }

      setMessage(message, '', '');
      const prevLabel = submitBtn.textContent;
      setButtonLoading(submitBtn, true, prevLabel);
      try {
        await ensureAccount(email, password);
        await finalizeRestaurant(fd, email, phone);
      } catch (ex) {
        signupError(ex);
      } finally {
        setButtonLoading(submitBtn, false, prevLabel);
      }
    });

    // Parcours Google / Apple : infos validées, compte créé via popup.
    function bindProvider(selector, kind) {
      const btn = form.querySelector(selector);
      if (!btn) return;
      btn.addEventListener('click', async () => {
        if (!validateFields(form, INFO_FIELDS)) return;
        const fd = new FormData(form);
        const phone = normalizePhone(fd.get('phone'));
        if (!validPhone(phone)) {
          setMessage(message, 'error', 'WhatsApp invalide (format +226…).');
          return;
        }
        setMessage(message, '', '');
        btn.disabled = true;
        try {
          const user = await signInWithProvider(kind);
          await finalizeRestaurant(fd, user.email || '', phone);
        } catch (ex) {
          signupError(ex);
        } finally {
          btn.disabled = false;
        }
      });
    }
    bindProvider('[data-auth-google]', 'google');
    bindProvider('[data-auth-apple]', 'apple');
  }

  // ── Livraison : candidature société uniquement ─────────────────────────────
  // L'inscription livreur se fait désormais directement dans l'application
  // mobile AfroBite Livraison (exigence Apple Guideline 4 — création de
  // compte in-app). Le site ne conserve que la candidature société.
  async function initLivraisonPage() {
    initFirebase();

    const societeForm = document.getElementById('partner-lead-form-societe');
    const societeSuccess = document.getElementById('societe-success-block');

    bindLeadForm(societeForm, 'delivery_company', {
      source: 'afrobyte_partenaire_livraison_societe',
      onSuccess: () => {
        if (societeSuccess) societeSuccess.hidden = false;
        if (societeForm) societeForm.hidden = true;
      },
    });

    // Anciens liens (#livreur / #create-driver-account) : on scrolle vers la
    // carte qui renvoie vers l'application mobile.
    if (location.hash === '#livreur' || location.hash === '#create-driver-account') {
      const target = document.getElementById('livreur-app-notice');
      if (target && typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  const page = document.body.dataset.partnerPage;
  if (page === 'partenaire-restaurant') initRestaurantPage();
  else if (page === 'partenaire-livraison') initLivraisonPage();
})();
