(function () {
  'use strict';
  const DAY = 86400000;
  const properties = [
    { id: 'wia', name: 'Palais WIA', area: 'Cocody', note: ['Boutique-hôtel', 'Boutique hotel'] },
    { id: 'atta', name: 'Résidences ATTA', area: 'Plateau', note: ['Appartements & résidences', 'Apartments & residences'] },
    { id: 'astral', name: 'Hôtel Astral', area: 'Yopougon', note: ['Hôtel & séjours d’affaires', 'Hotel & business stays'] }
  ];
  const paths = {
    hotel: '<path d="M4 21V4h12v17M16 9h4v12M2 21h20M8 8h4M8 12h4M8 21v-5h4v5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18M8 15h2M14 15h2"/>',
    bed: '<path d="M3 18v3M21 18v3M3 13V6M3 18h18v-7h-9v7M3 10h5a4 4 0 0 1 4 4M3 14h9"/>',
    people: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 5a3 3 0 0 1 0 6M21 21v-3a6 6 0 0 0-3-5"/>',
    chevron: '<path d="m8 10 4 4 4-4"/>',
    left: '<path d="m14 6-6 6 6 6"/>',
    right: '<path d="m10 6 6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>'
  };
  const icon = name => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths[name] + '</svg>';
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const today = () => new Date().toISOString().slice(0, 10);
  const date = key => new Date(key + 'T00:00:00Z');
  const keyOf = value => value.toISOString().slice(0, 10);
  const monthOf = key => key.slice(0, 7) + '-01';
  const shiftMonth = (key, step) => { const value = date(key); value.setUTCMonth(value.getUTCMonth() + step); return keyOf(value); };
  const validDate = key => typeof key === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(key) && Number.isFinite(date(key).valueOf()) && keyOf(date(key)) === key;
  let mounted = null;

  function validate(state) {
    if (!properties.some(item => item.id === state.property)) return { field: 'property', code: 'property_required' };
    if (!validDate(state.arrival) || state.arrival < today()) return { field: 'arrival', code: 'invalid_arrival' };
    if (!validDate(state.departure) || state.departure <= state.arrival) return { field: 'departure', code: 'invalid_departure' };
    if (!Number.isSafeInteger(state.rooms) || state.rooms < 1) return { field: 'rooms', code: 'invalid_rooms' };
    if (!Number.isSafeInteger(state.adults) || state.adults < 1 || !Number.isSafeInteger(state.children) || state.children < 0 || state.adults + state.children > 3) return { field: 'guests', code: 'invalid_guests' };
    return null;
  }
  function destinationURL(criteria, registry) {
    if (validate(criteria)) throw new Error('Invalid booking criteria');
    const destination = registry[criteria.property];
    if (!destination || !destination.reservation || !destination.bookingParams) throw new Error('Missing booking destination');
    const url = new URL(destination.reservation);
    Object.entries(destination.fixedBookingParams || {}).forEach(([name, value]) => url.searchParams.set(name, value));
    ['arrival', 'departure', 'rooms', 'adults', 'children'].forEach(name => url.searchParams.set(destination.bookingParams[name], String(criteria[name])));
    return url.href;
  }
  function markup(english) {
    const t = (fr, en) => english ? en : fr;
    const fields = [
      ['property', 'hotel', t('ÉTABLISSEMENT', 'PROPERTY'), t('Choisir une adresse', 'Choose a property')],
      ['arrival', 'calendar', t('ARRIVÉE', 'CHECK-IN'), t('Choisir une date', 'Choose a date')],
      ['departure', 'calendar', t('DÉPART', 'CHECK-OUT'), t('Choisir une date', 'Choose a date')],
      ['rooms', 'bed', t('CHAMBRES', 'ROOMS'), t('1 chambre', '1 room')],
      ['guests', 'people', t('VOYAGEURS', 'GUESTS'), t('2 voyageurs', '2 guests')]
    ];
    return '<section class="hlh-booking-section" id="portal-booking" aria-labelledby="hlh-booking-title"><div class="container">' +
      '<div class="hlh-booking-heading"><h2 id="hlh-booking-title">' + t('Préparez votre séjour', 'Plan your stay') + '</h2><p>' + t('Une adresse, une expérience qui vous ressemble.', 'An address. An experience made for you.') + '</p></div>' +
      '<form class="hlh-booking" data-hlh-booking novalidate aria-label="' + t('Rechercher un séjour à Abidjan', 'Search for a stay in Abidjan') + '"><div class="hlh-booking-bar">' + fields.map(([id, glyph, label, value]) =>
        '<div class="hlh-booking-field" data-hlh-field="' + id + '"><button class="hlh-booking-trigger" type="button" data-hlh-open="' + id + '" aria-haspopup="' + (id === 'property' ? 'listbox' : 'dialog') + '" aria-expanded="false" aria-controls="hlh-panel-' + id + '">' + icon(glyph) + '<span class="hlh-booking-text"><span class="hlh-booking-label">' + label + '</span><span class="hlh-booking-value" data-hlh-value="' + id + '">' + value + '</span></span>' + icon('chevron') + '</button><div class="hlh-booking-panel" id="hlh-panel-' + id + '" data-hlh-panel="' + id + '" role="' + (id === 'property' ? 'listbox' : 'dialog') + '" aria-label="' + label + '" hidden></div></div>'
      ).join('') + '<button class="hlh-booking-search" type="submit" aria-label="' + t('Recherche des disponibilités', 'Search availability') + '">' + icon('search') + '<span>' + t('Recherche', 'Search') + '</span><span class="hlh-booking-spinner" aria-hidden="true"></span></button></div>' +
      '<div class="hlh-booking-foot"><p data-hlh-stay aria-live="polite">' + t('Jusqu’à 3 voyageurs, pour l’ensemble du séjour.', 'Up to 3 guests for the entire booking.') + '</p><p>' + t('Réservation directement auprès de l’établissement.', 'Book directly with your selected property.') + '</p></div><p class="hlh-booking-feedback" data-hlh-feedback role="status" aria-live="polite"></p></form></div></section>';
  }

  function mount(root, english) {
    if (mounted) mounted.destroy();
    const form = root.querySelector('[data-hlh-booking]');
    if (!form) return;
    const t = (fr, en) => english ? en : fr;
    const locale = english ? 'en-GB' : 'fr-FR';
    const state = { property: '', arrival: '', departure: '', rooms: 1, adults: 2, children: 0 };
    let active = '', visibleMonth = monthOf(today()), pending = false, opener = null;
    const abort = new AbortController();
    const on = (target, type, fn, options = {}) => target.addEventListener(type, fn, { ...options, signal: abort.signal });
    const query = selector => form.querySelector(selector);
    const trigger = field => query('[data-hlh-open="' + field + '"]');
    const panel = field => query('[data-hlh-panel="' + field + '"]');
    const feedback = query('[data-hlh-feedback]');
    const formatDate = key => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(date(key));
    const nights = () => state.arrival && state.departure ? (date(state.departure) - date(state.arrival)) / DAY : 0;
    const plural = (amount, singular, multiple) => amount + ' ' + (amount === 1 ? singular : multiple);

    function position() {
      if (!active) return;
      const content = panel(active), anchor = trigger(active);
      if (!content || content.hidden || !anchor) return;
      const header = document.getElementById('header');
      const headerBottom = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
      const anchorRect = anchor.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const mobile = matchMedia('(max-width: 700px)').matches;

      // The popover is viewport-anchored so it can never be clipped by its
      // field/container. It is repositioned on scroll and closed as soon as
      // its trigger leaves the usable area below the sticky header.
      content.style.position = 'fixed';
      content.style.transform = 'none';
      content.style.right = 'auto';
      content.style.bottom = 'auto';
      content.style.left = '0px';
      content.style.top = '0px';
      content.style.width = mobile ? 'min(400px, calc(100vw - 24px))' : (active === 'property' ? '390px' : ['arrival', 'departure'].includes(active) ? '650px' : '360px');
      content.style.maxWidth = 'calc(100vw - 24px)';
      content.style.maxHeight = 'min(72vh, 620px)';
      content.style.overflow = 'auto';

      const panelRect = content.getBoundingClientRect();
      const width = Math.min(panelRect.width || (mobile ? 400 : (active === 'property' ? 390 : ['arrival', 'departure'].includes(active) ? 650 : 360)), viewportWidth - 24);
      const preferredLeft = !mobile && ['rooms', 'guests'].includes(active) ? anchorRect.right - width : anchorRect.left;
      const left = Math.max(12, Math.min(preferredLeft, viewportWidth - width - 12));
      const usableTop = Math.max(headerBottom + 8, 8);
      const gap = 10;
      const naturalHeight = Math.min(content.scrollHeight, viewportHeight * 0.72, 620);
      const below = viewportHeight - anchorRect.bottom - gap - 8;
      const above = anchorRect.top - usableTop - gap;
      const openAbove = below < Math.min(naturalHeight, 240) && above > below;
      const available = Math.max(120, openAbove ? above : below);
      const panelHeight = Math.min(naturalHeight, available, viewportHeight - usableTop - 8);
      const top = openAbove
        ? Math.max(usableTop, anchorRect.top - gap - panelHeight)
        : Math.max(usableTop, anchorRect.bottom + gap);

      content.style.left = left + 'px';
      content.style.top = top + 'px';
      content.style.maxHeight = Math.max(120, Math.min(panelHeight, viewportHeight - top - 8)) + 'px';
      content.classList.toggle('is-above', openAbove);
    }
    function closeIfAnchorLeavesView() {
      if (!active) return;
      const anchor = trigger(active);
      const headerBottom = document.getElementById('header')?.getBoundingClientRect().bottom || 0;
      const rect = anchor.getBoundingClientRect();
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      if (rect.bottom <= headerBottom + 2 || rect.top >= viewportHeight - 2) {
        close(false);
        return;
      }
      position();
    }
    function close(restore) {
      form.querySelectorAll('[data-hlh-panel]').forEach(item => { item.hidden = true; });
      form.querySelectorAll('[data-hlh-open]').forEach(item => item.setAttribute('aria-expanded', 'false'));
      form.querySelectorAll('.is-active').forEach(item => item.classList.remove('is-active'));
      active = '';
      position();
      if (restore && opener) opener.focus({ preventScroll: true });
    }
    function update() {
      const property = properties.find(item => item.id === state.property);
      query('[data-hlh-value="property"]').textContent = property ? property.name : t('Choisir une adresse', 'Choose a property');
      ['arrival', 'departure'].forEach(field => { query('[data-hlh-value="' + field + '"]').textContent = state[field] ? formatDate(state[field]) : t('Choisir une date', 'Choose a date'); });
      query('[data-hlh-value="rooms"]').textContent = plural(state.rooms, t('chambre', 'room'), t('chambres', 'rooms'));
      query('[data-hlh-value="guests"]').textContent = plural(state.adults + state.children, t('voyageur', 'guest'), t('voyageurs', 'guests'));
      trigger('guests').title = plural(state.adults, t('adulte', 'adult'), t('adultes', 'adults')) + ' · ' + plural(state.children, t('enfant', 'child'), t('enfants', 'children'));
      query('[data-hlh-stay]').textContent = nights() ? plural(nights(), t('nuit', 'night'), t('nuits', 'nights')) + ' · ' + plural(state.adults + state.children, t('voyageur', 'guest'), t('voyageurs', 'guests')) : t('Jusqu’à 3 voyageurs, pour l’ensemble du séjour.', 'Up to 3 guests for the entire booking.');
      if (active === 'rooms' || active === 'guests') {
        form.querySelectorAll('[data-hlh-count]').forEach(button => {
          const name = button.dataset.hlhCount, delta = Number(button.dataset.delta);
          button.disabled = pending || (delta < 0 ? state[name] <= (name === 'children' ? 0 : 1) : name === 'rooms' ? state.rooms >= Number.MAX_SAFE_INTEGER : state.adults + state.children >= 3);
        });
        form.querySelectorAll('[data-hlh-number]').forEach(item => { item.textContent = state[item.dataset.hlhNumber]; });
        const limit = query('[data-hlh-limit]');
        if (limit) limit.classList.toggle('at-limit', state.adults + state.children === 3);
      }
      position();
    }
    function calendarMonth(month) {
      const first = date(month), offset = (first.getUTCDay() + 6) % 7;
      const count = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
      const title = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(first);
      const weekdays = english ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
      let cells = '<span aria-hidden="true"></span>'.repeat(offset);
      for (let day = 1; day <= count; day++) {
        const key = month.slice(0, 8) + String(day).padStart(2, '0');
        const disabled = key < today() || active === 'departure' && state.arrival && key <= state.arrival;
        const selected = key === state.arrival || key === state.departure;
        const range = state.arrival && state.departure && key > state.arrival && key < state.departure;
        const label = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date(key));
        cells += '<button type="button" data-hlh-day="' + key + '" class="hlh-calendar-day' + (selected ? ' is-selected' : '') + (range ? ' in-range' : '') + '" aria-label="' + escape(label) + '" aria-pressed="' + selected + '"' + (key === today() ? ' aria-current="date"' : '') + (disabled ? ' disabled' : '') + '>' + day + '</button>';
      }
      return '<section class="hlh-calendar-month" aria-label="' + escape(title) + '"><h4>' + title + '</h4><div class="hlh-calendar-weekdays" aria-hidden="true">' + weekdays.map(day => '<span>' + day + '</span>').join('') + '</div><div class="hlh-calendar-days">' + cells + '</div></section>';
    }
    function calendar() {
      return '<div class="hlh-panel-heading"><span>' + (active === 'arrival' ? t('Votre arrivée', 'Your check-in') : t('Votre départ', 'Your check-out')) + '</span><div class="hlh-calendar-nav"><button type="button" data-hlh-month="-1" aria-label="' + t('Mois précédent', 'Previous month') + '"' + (visibleMonth <= monthOf(today()) ? ' disabled' : '') + '>' + icon('left') + '</button><button type="button" data-hlh-month="1" aria-label="' + t('Mois suivant', 'Next month') + '">' + icon('right') + '</button></div></div><div class="hlh-calendar-months">' + calendarMonth(visibleMonth) + calendarMonth(shiftMonth(visibleMonth, 1)) + '</div><div class="hlh-panel-bottom"><span>' + (nights() ? plural(nights(), t('nuit', 'night'), t('nuits', 'nights')) : t('Choisissez les dates de votre séjour', 'Choose the dates of your stay')) + '</span><button type="button" data-hlh-close>' + t('Fermer', 'Close') + '</button></div>';
    }
    function counters() {
      const fields = active === 'rooms' ? [['rooms', t('Chambres', 'Rooms'), t('Nombre d’unités souhaitées', 'Number of units requested')]] : [['adults', t('Adultes', 'Adults'), t('13 ans et plus', '13 and over')], ['children', t('Enfants', 'Children'), t('Jusqu’à 12 ans', 'Up to 12')]];
      return '<div class="hlh-panel-heading"><span>' + (active === 'rooms' ? t('Votre hébergement', 'Your accommodation') : t('Qui voyage avec vous ?', 'Who is travelling?')) + '</span></div>' + fields.map(([field, title, note]) => '<div class="hlh-counter-row"><span><strong>' + title + '</strong><small>' + note + '</small></span><div class="hlh-counter-controls"><button type="button" data-hlh-count="' + field + '" data-delta="-1" aria-label="' + t('Réduire : ', 'Decrease: ') + title + '">' + icon('minus') + '</button><output data-hlh-number="' + field + '" aria-live="polite">' + state[field] + '</output><button type="button" data-hlh-count="' + field + '" data-delta="1" aria-label="' + t('Augmenter : ', 'Increase: ') + title + '">' + icon('plus') + '</button></div></div>').join('') + (active === 'guests' ? '<p class="hlh-guest-limit" data-hlh-limit>' + t('Maximum 3 voyageurs', 'Maximum 3 guests') + '<small>' + t('Toutes chambres confondues.', 'Across all rooms.') + '</small></p>' : '') + '<button class="hlh-booking-apply" type="button" data-hlh-close>' + t('APPLIQUER', 'APPLY') + icon('check') + '</button>';
    }
    function open(field, focus) {
      if (pending) return;
      close(false);
      if (field === 'departure' && !state.arrival) field = 'arrival';
      active = field;
      opener = trigger(field);
      opener.setAttribute('aria-expanded', 'true');
      opener.parentElement.classList.add('is-active');
      const content = panel(field);
      if (field === 'arrival' || field === 'departure') {
        visibleMonth = monthOf(state[field] || state.arrival || today());
        content.innerHTML = calendar();
      } else if (field === 'property') {
        content.innerHTML = properties.map(item => '<button class="hlh-property-option" type="button" role="option" data-hlh-property="' + item.id + '" aria-selected="' + (state.property === item.id) + '">' + icon('hotel') + '<span><strong>' + item.name + '<small>' + item.area + '</small></strong><span>' + item.note[english ? 1 : 0] + '</span></span>' + icon('check') + '</button>').join('');
      } else content.innerHTML = counters();
      content.hidden = false;
      update();
      if (focus) (content.querySelector('[aria-selected="true"]') || content.querySelector('[aria-pressed="true"]:not(:disabled)') || content.querySelector('button:not(:disabled)'))?.focus({ preventScroll: true });
    }
    const messages = {
      property_required: t('Choisissez votre établissement.', 'Choose your property.'),
      invalid_arrival: t('Choisissez une date d’arrivée à partir d’aujourd’hui.', 'Choose a check-in date from today onwards.'),
      invalid_departure: t('Choisissez un départ après votre arrivée.', 'Choose a check-out date after check-in.'),
      invalid_rooms: t('Choisissez au moins une chambre.', 'Choose at least one room.'),
      invalid_guests: t('Sélectionnez 1 à 3 voyageurs, dont au moins un adulte.', 'Select 1 to 3 guests, including at least one adult.')
    };
    function error(issue) {
      feedback.textContent = messages[issue.code] || t('Vérifiez les informations de votre séjour.', 'Check your booking details.');
      form.querySelectorAll('[data-hlh-open]').forEach(item => item.removeAttribute('aria-invalid'));
      trigger(issue.field)?.setAttribute('aria-invalid', 'true');
      open(issue.field, false);
      trigger(active)?.focus({ preventScroll: true });
    }
    function changed() {
      feedback.textContent = '';
      form.querySelectorAll('[aria-invalid]').forEach(item => item.removeAttribute('aria-invalid'));
      update();
    }
    on(form, 'click', event => {
      const button = event.target.closest('button');
      if (!button || button.disabled) return;
      if (button.dataset.hlhOpen) { active === button.dataset.hlhOpen ? close(false) : open(button.dataset.hlhOpen, true); return; }
      if (button.dataset.hlhProperty) { state.property = button.dataset.hlhProperty; changed(); close(true); return; }
      if (button.dataset.hlhCount) {
        const name = button.dataset.hlhCount, delta = Number(button.dataset.delta), next = state[name] + delta;
        if (!Number.isSafeInteger(next) || next < (name === 'children' ? 0 : 1) || name !== 'rooms' && state.adults + state.children + delta > 3) return;
        state[name] = next;
        changed();
        return;
      }
      if (button.dataset.hlhMonth) {
        const next = shiftMonth(visibleMonth, Number(button.dataset.hlhMonth));
        if (next < monthOf(today())) return;
        visibleMonth = next;
        panel(active).innerHTML = calendar();
        panel(active).querySelector('[data-hlh-month="' + button.dataset.hlhMonth + '"]')?.focus({ preventScroll: true });
        position();
        return;
      }
      if (button.dataset.hlhDay) {
        const selected = button.dataset.hlhDay;
        if (selected < today() || active === 'departure' && selected <= state.arrival) return;
        if (active === 'arrival') {
          state.arrival = selected;
          if (state.departure <= selected) state.departure = '';
          changed();
          open('departure', true);
        } else { state.departure = selected; changed(); close(true); }
        return;
      }
      if (button.hasAttribute('data-hlh-close')) close(true);
    });
    on(document, 'pointerdown', event => { if (active && !panel(active).contains(event.target) && !trigger(active).contains(event.target)) close(false); });
    on(document, 'keydown', event => {
      if (!active) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(true); return; }
      const options = active === 'property' ? Array.from(panel(active).querySelectorAll('[role="option"]')) : [];
      if (options.length && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const current = options.indexOf(document.activeElement);
        const index = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (current + (event.key === 'ArrowUp' ? -1 : 1) + options.length) % options.length;
        options[index].focus();
      }
      if (event.target.matches('[data-hlh-day]') && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        event.preventDefault();
        const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key];
        const target = keyOf(new Date(date(event.target.dataset.hlhDay).valueOf() + step * DAY));
        if (target < today() || active === 'departure' && target <= state.arrival) return;
        visibleMonth = monthOf(target);
        panel(active).innerHTML = calendar();
        panel(active).querySelector('[data-hlh-day="' + target + '"]')?.focus({ preventScroll: true });
        position();
      }
      if (event.key === 'Tab') setTimeout(() => { if (active && !panel(active).contains(document.activeElement) && !trigger(active).contains(document.activeElement)) close(false); }, 0);
    });
    on(window, 'resize', position);
    on(window, 'scroll', closeIfAnchorLeavesView, { passive: true, capture: true });
    if (window.visualViewport) {
      on(window.visualViewport, 'resize', position);
      on(window.visualViewport, 'scroll', closeIfAnchorLeavesView, { passive: true });
    }
    on(form, 'submit', async event => {
      event.preventDefault();
      if (pending) return;
      const issue = validate(state);
      if (issue) { error(issue); return; }
      close(false);
      const criteria = { ...state };
      pending = true;
      form.setAttribute('aria-busy', 'true');
      query('.hlh-booking-search').disabled = true;
      feedback.textContent = t('Préparation de votre recherche…', 'Preparing your search…');
      try {
        const response = await fetch('/api/hlh-search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(criteria), signal: AbortSignal.timeout(12000) });
        const result = await response.json();
        if (!response.ok || !result.ok) {
          pending = false;
          if (result.field && messages[result.code]) error(result);
          else throw new Error('Search validation failed');
          return;
        }
        feedback.textContent = '';
        window.location.assign(destinationURL(result.criteria, window.HLH_SITE_LINKS));
      } catch (failure) {
        feedback.textContent = t('La recherche n’a pas pu être transmise. Réessayez dans un instant.', 'Your search could not be sent. Please try again shortly.');
      } finally {
        pending = false;
        form.removeAttribute('aria-busy');
        query('.hlh-booking-search').disabled = false;
      }
    });
    mounted = {
      destroy() { abort.abort(); close(false); },
      choose(property) {
        if (properties.some(item => item.id === property)) state.property = property;
        changed();
        trigger(property ? 'arrival' : 'property').focus({ preventScroll: true });
      }
    };
    update();
    return mounted;
  }
  window.HLHBookingPremium = Object.freeze({ markup, mount, validate, destinationURL, choose: property => mounted?.choose(property) });
})();
