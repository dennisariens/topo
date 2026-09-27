/* A dependency-free session deck and reward state shared by the app and tests. */
(function (root) {
  'use strict';

  const STOPS = ['Rome', 'Florence', 'Bologna', 'Venetië', 'Milaan', 'Genua', 'Napels'];
  const SLICES_PER_PIZZA = 8;
  const PIZZAS_PER_TRIP = 3;

  function shuffle(values, random = Math.random) {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function session(items, random = Math.random) {
    return { deck: shuffle(items.map(item => item.id), random), lastId: null, turns: 0 };
  }

  function draw(state, items, mistakes = [], random = Math.random) {
    if (!items.length) return null;
    const available = new Map(items.map(item => [item.id, item]));
    state.deck = state.deck.filter(id => available.has(id));
    if (!state.deck.length) state.deck = shuffle([...available.keys()], random);

    // A due mistake is reviewed between fresh cards, never twice in a row.
    const due = state.turns > 0 && state.turns % 5 === 0
      ? mistakes.filter(id => available.has(id) && id !== state.lastId)
      : [];
    let id;
    if (due.length) {
      id = due[Math.floor(random() * due.length)];
    } else {
      let index = state.deck.findIndex(candidate => candidate !== state.lastId);
      if (index === -1) index = 0; // a one-item group is allowed to repeat
      [id] = state.deck.splice(index, 1);
    }
    state.lastId = id;
    state.turns++;
    return available.get(id);
  }

  function migrate(previousV3, previousV2) {
    if (previousV3?.schema === 3) {
      return {
        schema: 3,
        good: safeInt(previousV3.good),
        pizzas: safeInt(previousV3.pizzas),
        slices: Math.min(7, safeInt(previousV3.slices)),
        trips: safeInt(previousV3.trips),
        mistakes: validMistakes(previousV3.mistakes)
      };
    }
    const old = previousV2 || {};
    const pizzas = safeInt(old.pizzas);
    // Preserve already earned pizzas; scale a partial five-answer meter to eight slices.
    const slices = Math.min(7, Math.floor((safeInt(old.pizzaSteps) % 5) * 8 / 5));
    return { schema: 3, good: safeInt(old.good), pizzas, slices,
      trips: Math.floor(pizzas / PIZZAS_PER_TRIP), mistakes: validMistakes(old.mistakes) };
  }

  function safeInt(value) {
    return Number.isSafeInteger(value) && value > 0 ? value : 0;
  }

  function validMistakes(values) {
    return Array.isArray(values) ? [...new Set(values.filter(value => typeof value === 'string'))] : [];
  }

  function award(progress) {
    progress.good++;
    progress.slices++;
    let pizza = false;
    let trip = false;
    if (progress.slices === SLICES_PER_PIZZA) {
      progress.slices = 0;
      progress.pizzas++;
      pizza = true;
      if (progress.pizzas % PIZZAS_PER_TRIP === 0) {
        progress.trips++;
        trip = true;
      }
    }
    return { pizza, trip, ...journey(trip ? progress.trips : progress.trips + 1) };
  }

  function journey(tripNumber) {
    const from = STOPS[(tripNumber - 1) % STOPS.length];
    const to = STOPS[tripNumber % STOPS.length];
    return { from, to };
  }

  root.TopoLearning = { shuffle, session, draw, migrate, award, journey,
    SLICES_PER_PIZZA, PIZZAS_PER_TRIP, STOPS };
})(typeof window === 'undefined' ? globalThis : window);
