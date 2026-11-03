/* Tiny Supabase REST client (no external library). */
(() => {
  const cfg = window.FN_CONFIG || {};
  const base = (cfg.supabaseUrl || '').replace(/\/+$/, '');
  const key = cfg.supabaseAnonKey || '';
  const configured = Boolean(base && key);

  const MESSAGES = {
    already_submitted: 'We already have an RSVP for this email address. Please use “Update my RSVP” with the edit code you received.',
    invalid_code: 'We couldn’t find an RSVP with that edit code. Please check it and try again.',
    email_taken: 'That email address is already used on another RSVP.',
    invalid_name: 'Please enter your full name.',
    invalid_email: 'Please enter a valid email address.',
    invalid_phone: 'Please enter a phone number we can reach you on.',
    invalid_party_size: 'Number of guests must be between 1 and 10.',
    invalid_events: 'Please let us know whether you will attend each celebration.',
    invalid_arrival_date: 'Please check your arrival date.',
    invalid_values: 'Some answers look incomplete — please check the form.',
    invalid_message: 'Please write a short message.',
    invalid_amount: 'Please enter the amount as a number, or leave it blank.',
    invalid_request: 'Something went wrong. Please refresh and try again.',
    busy: 'Lots of replies are arriving right now — please try again in a minute.',
  };

  async function request(path, { method = 'GET', body, token, headers = {} } = {}) {
    if (!configured) throw Object.assign(new Error('The RSVP system is not connected yet.'), { code: 'not_configured' });
    let res;
    try {
      res = await fetch(base + path, {
        method,
        headers: {
          apikey: key,
          Authorization: 'Bearer ' + (token || key),
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch (e) {
      throw Object.assign(new Error('We couldn’t reach the server. Please check your connection and try again.'), { code: 'network' });
    }
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
    if (!res.ok) {
      const raw = (data && (data.message || data.error_description || data.msg || data.error)) || res.statusText;
      const code = Object.keys(MESSAGES).find((k) => String(raw).includes(k));
      throw Object.assign(new Error(code ? MESSAGES[code] : raw || 'Request failed'), { code: code || 'error', status: res.status });
    }
    return data;
  }

  window.fnApi = {
    configured,
    rpc: (fn, args, token) => request('/rest/v1/rpc/' + fn, { method: 'POST', body: args || {}, token }),
    select: (table, query, token) => request('/rest/v1/' + table + '?' + query, { token }),
    remove: (table, query, token) => request('/rest/v1/' + table + '?' + query, { method: 'DELETE', token, headers: { Prefer: 'return=minimal' } }),
    signIn: (email, password) => request('/auth/v1/token?grant_type=password', { method: 'POST', body: { email, password } }),
    signOut: (token) => request('/auth/v1/logout', { method: 'POST', token }).catch(() => null),
    formatCode: (c) => String(c || '').replace(/[^0-9A-Za-z]/g, '').toUpperCase().replace(/(.{4})(?=.)/g, '$1-'),
  };
})();
