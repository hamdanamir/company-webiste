const enquiryForm = document.querySelector('.contact-form');
const enquiryStatus = enquiryForm.querySelector('.form-status');
const enquiryButton = enquiryForm.querySelector('button[type="submit"]');
const contactConfig = window.veytrixaContact || {};
const useWeb3Forms = contactConfig.provider === 'web3forms';
const configuredEndpoint = useWeb3Forms ? 'https://api.web3forms.com/submit' : contactConfig.endpoint || '';
const enquiryReady = useWeb3Forms
  ? /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(contactConfig.accessKey || '')
  : /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(configuredEndpoint);
if (enquiryReady) {
  enquiryButton.firstChild.textContent = 'Send project enquiry ';
  enquiryForm.querySelector('.form-note').textContent = `Your details will be sent securely to Veytrixa through ${useWeb3Forms ? 'Web3Forms' : 'Formspree'}. Please don’t include passwords or confidential files.`;
}
enquiryForm.addEventListener('submit', async event => {
  if (!enquiryReady) return; // The local brief remains available until delivery is connected.
  event.preventDefault();
  event.stopImmediatePropagation();
  if (!enquiryForm.reportValidity() || enquiryButton.disabled) return;
  if (enquiryForm.elements.website.value) return;
  const fields = new FormData(enquiryForm);
  fields.delete('website');
  fields.set('_subject', 'New project enquiry — Veytrixa Technologies');
  if (useWeb3Forms) {
    fields.delete('_subject');
    fields.set('access_key', contactConfig.accessKey);
    fields.set('subject', 'New project enquiry — Veytrixa Technologies');
    fields.set('from_name', 'Veytrixa website');
    fields.set('replyto', String(fields.get('email')));
  }
  enquiryButton.disabled = true;
  enquiryForm.setAttribute('aria-busy', 'true');
  enquiryStatus.dataset.state = 'pending';
  enquiryStatus.textContent = 'Sending your enquiry…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(configuredEndpoint, {
      method: 'POST', body: fields, headers: { Accept: 'application/json' }, signal: controller.signal
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || (useWeb3Forms ? result?.success !== true : result?.ok !== true)) throw new Error('Delivery was not confirmed');
    enquiryStatus.dataset.state = 'success';
    enquiryStatus.textContent = 'Thank you. Your enquiry has been submitted to Veytrixa. We’ll reply using the email you provided.';
    enquiryForm.reset();
  } catch (error) {
    enquiryStatus.dataset.state = 'error';
    enquiryStatus.textContent = error.name === 'AbortError'
      ? 'The request timed out. Delivery could not be confirmed. Your details are still here; check your connection before trying again.'
      : 'We couldn’t confirm your enquiry was sent. Your details are still here. Please try again later.';
  } finally {
    clearTimeout(timeout);
    enquiryButton.disabled = false;
    enquiryForm.removeAttribute('aria-busy');
  }
}, { capture: true });
