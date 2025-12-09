import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;

// إضافة CSRF token من meta tag
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

// Ensure Sanctum's XSRF cookie is set for SPA authentication
// This call prepares the session cookie for subsequent API requests.
window.axios.get('/sanctum/csrf-cookie').catch(() => {
    // ignore errors here; dev server may not be running yet
});
