/**
 * AfroBite — Demande de remboursement Orange Money
 * URL app : https://afrobite.app/refund/{token}
 * Soumission : Cloud Function submitRefundRequest (foodtok)
 */
(function () {
  const PHONE_RE = /^\+?226[0-9]{8}$/;
  const SUBMIT_URL =
    'https://us-central1-foodsocialnetwork-74a07.cloudfunctions.net/submitRefundRequest';

  function getTokenFromPage() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('token');
    if (fromQuery) return fromQuery;
    const match = window.location.pathname.match(/\/refund\/([^/?#]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  function decodeJwtPayload(token) {
    const parts = token.split('.');
    if (parts.length < 2) throw new Error('Token invalide');
    const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  }

  const token = getTokenFromPage();

  const formView = document.getElementById('refund-form-view');
  const errorView = document.getElementById('refund-error-view');
  const errorMessage = document.getElementById('refund-error-message');
  const form = document.getElementById('refund-form');
  const submitBtn = document.getElementById('refund-submit');

  const fields = {
    displayId: document.getElementById('order-display-id'),
    restaurantName: document.getElementById('order-restaurant'),
    amount: document.getElementById('order-amount'),
    accountHolderName: document.getElementById('account-holder-name'),
    phone: document.getElementById('orange-money-phone'),
    additionalInfo: document.getElementById('additional-info'),
  };

  function showError(msg) {
    if (formView) formView.hidden = true;
    if (errorView) errorView.hidden = false;
    if (errorMessage) errorMessage.textContent = msg;
  }

  function normalizePhone(input) {
    let s = input.trim().replace(/[\s-]/g, '');
    if (s.startsWith('+')) s = s.slice(1);
    if (/^\d{8}$/.test(s)) s = '226' + s;
    return s;
  }

  function validatePhone(input) {
    const normalized = normalizePhone(input);
    return PHONE_RE.test('+' + normalized) || PHONE_RE.test(normalized);
  }

  function loadContext() {
    if (!token) {
      showError('Lien de remboursement invalide. Ouvrez cette page depuis l\'application AfroBite.');
      return;
    }
    try {
      const claims = decodeJwtPayload(token);
      if (claims.exp && claims.exp * 1000 < Date.now()) {
        showError('Ce lien de remboursement a expiré. Rouvrez la demande depuis l\'application.');
        return;
      }

      if (fields.displayId) {
        fields.displayId.textContent = claims.displayId || claims.orderId?.slice(-6) || '—';
      }
      if (fields.restaurantName) {
        fields.restaurantName.textContent = claims.restaurantName || claims.restaurantId || '—';
      }
      if (fields.amount) {
        fields.amount.textContent = Number(claims.amount || 0).toLocaleString('fr-FR');
      }
      if (fields.accountHolderName && claims.customerName && !fields.accountHolderName.value) {
        fields.accountHolderName.value = claims.customerName;
      }
      if (fields.phone && claims.customerPhone && !fields.phone.value) {
        fields.phone.value = claims.customerPhone;
      }
    } catch (e) {
      showError('Token invalide ou expiré.');
    }
  }

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const name = fields.accountHolderName?.value.trim() || '';
      const phone = fields.phone?.value.trim() || '';
      const note = fields.additionalInfo?.value.trim() || '';

      if (!name) {
        alert('Veuillez indiquer le nom du titulaire du compte Orange Money.');
        return;
      }
      if (!validatePhone(phone)) {
        alert('Numéro Orange Money invalide. Utilisez le format 226XXXXXXXX ou +226XXXXXXXX.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';

      try {
        const res = await fetch(SUBMIT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({
            paymentMethod: 'orange_money',
            accountHolderName: name,
            phone: normalizePhone(phone),
            additionalInfo: note || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Échec de l\'envoi');
        }

        window.location.href =
          'refund-confirmation.html?ticket=' + encodeURIComponent(data.ticketId);
      } catch (err) {
        alert(err.message || 'Erreur lors de l\'envoi. Réessayez.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Soumettre la demande';
      }
    });
  }

  loadContext();
})();
