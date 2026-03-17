

/* ============================================
   HOMEGIGS — MOCK DATA & APP STATE
   ============================================ */

const HG = {
  /* ── Current session ── */
  session: {
    role: null,   // 'worker' | 'customer'
    user: null,
  },

  /* ── Category definitions ── */
  categories: [
    { id: 'cleaning',       name: 'Cleaning',        emoji: '🧹' },
    { id: 'plumbing',       name: 'Plumbing',        emoji: '🔧' },
    { id: 'assembly',       name: 'Assembly',        emoji: '🪛' },
    { id: 'painting',       name: 'Painting',        emoji: '🎨' },
    { id: 'window-cleaning',name: 'Window Cleaning', emoji: '🪟' },
    { id: 'electrical',     name: 'Electrical',      emoji: '⚡' },
    { id: 'landscaping',    name: 'Landscaping',     emoji: '🌿' },
    { id: 'moving',         name: 'Moving Help',     emoji: '📦' },
  ],

  /* ── Sample gig listings ── */
  gigs: [
    {
      id: 1, category: 'plumbing', title: 'Fix leaking kitchen tap',
      description: 'Dripping tap in kitchen, needs new washer or cartridge',
      details: 'Under-sink shutoff available. Tools provided if needed.',
      address: '142 Broad St, Regina SK',
      scheduledDate: null, scheduledTime: null,
      price: 60, status: 'open', postedBy: 'customer',
      customer: 'Sarah K.'
    },
    {
      id: 2, category: 'assembly', title: 'IKEA wardrobe assembly',
      description: 'PAX wardrobe, 2 doors, needs full assembly',
      details: 'All parts in boxes, instruction manual included.',
      address: '88 Albert St, Regina SK',
      scheduledDate: '03/22', scheduledTime: '10:00',
      price: 90, status: 'open', postedBy: 'customer',
      customer: 'Mike J.'
    },
    {
      id: 3, category: 'painting', title: 'Living room walls',
      description: 'Two coats on 3 walls, paint already purchased',
      details: '12ft x 14ft room, ceilings already done.',
      address: '34 Wascana Ave, Regina SK',
      scheduledDate: '03/25', scheduledTime: '09:00',
      price: 150, status: 'open', postedBy: 'customer',
      customer: 'Linda P.'
    },
    {
      id: 4, category: 'window-cleaning', title: 'Exterior window cleaning',
      description: 'Ground floor only, 8 windows total',
      details: 'Squeegee and solution provided.',
      address: '210 College Ave, Regina SK',
      scheduledDate: null, scheduledTime: null,
      price: 45, status: 'open', postedBy: 'customer',
      customer: 'David R.'
    },
    {
      id: 5, category: 'cleaning', title: 'Deep clean after party',
      description: 'Full house clean, 3 bedrooms',
      details: 'Focus on kitchen and bathrooms. Supplies available.',
      address: '55 Pasqua St, Regina SK',
      scheduledDate: null, scheduledTime: null,
      price: 120, status: 'bargaining', postedBy: 'customer',
      customer: 'Amy T.'
    },
  ],

  /* ── Worker's active gigs ── */
  workerGigs: [
    { id: 2, status: 'waiting' },
    { id: 5, status: 'bargaining' },
    { id: 3, status: 'confirmed' },
    { id: 1, status: 'completed' },
  ],

  /* ── Earnings data ── */
  earnings: {
    thisWeek: {
      total: 315,
      days: {
        Monday: 60, Tuesday: 90, Wednesday: 0,
        Thursday: 45, Friday: 120, Saturday: 0, Sunday: 0
      }
    },
    weekly: [
      { from: '03/09', to: '03/15', amount: 315 },
      { from: '03/02', to: '03/08', amount: 280 },
      { from: '02/23', to: '03/01', amount: 410 },
      { from: '02/16', to: '02/22', amount: 195 },
      { from: '02/09', to: '02/15', amount: 360 },
    ]
  },

  /* ── Conversations ── */
  conversations: {
    bargains: [
      { id: 1, jobTitle: 'Fix leaking kitchen tap', party: 'Sarah K.' },
      { id: 5, jobTitle: 'Deep clean after party',  party: 'Amy T.' },
    ],
    confirmed: [
      { id: 3, jobTitle: 'Living room walls',     party: 'Linda P.' },
      { id: 2, jobTitle: 'IKEA wardrobe assembly', party: 'Mike J.' },
    ]
  },

  /* ── Helpers ── */
  getGig(id) { return this.gigs.find(g => g.id === id); },
  getCategory(id) { return this.categories.find(c => c.id === id); },
  formatDate(d, t) {
    if (!d) return 'On The Spot';
    return `${d}${t ? ' at ' + t : ''}`;
  },
};

/* ── Navigation Helper ── */
function goTo(page) {
  window.location.href = page;
}

/* ── Toast Helper ── */
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

/* ── Overlay Menu Toggle ── */
function toggleMenu() {
  const overlay = document.getElementById('overlayMenu');
  if (overlay) overlay.classList.toggle('open');
}

/* ── Build Top Bar ── */
function buildTopBar(title, chatLink) {
  return `
  <div class="topbar">
    <div class="topbar__menu" onclick="toggleMenu()">
      <span></span><span></span><span></span>
    </div>
    <span class="topbar__title">${title || 'HomeGigs'}</span>
    <a class="topbar__chat" href="${chatLink || 'conversations.html'}">
      <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
    </a>
  </div>`;
}

/* ── Build Bottom Bar (Worker) ── */
function buildBottomBarWorker(active) {
  const isHome = active === 'home';
  const isEarn = active === 'earn';
  const isAcct = active === 'account';
  return `
  <nav class="bottombar">
    <a class="bottombar__btn ${isHome ? 'active' : ''}" href="dashboard-worker.html">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
      <span>Home</span>
    </a>
    <a class="bottombar__btn bottombar__btn--post" href="post-gig.html" style="display:none"></a>
    <a class="bottombar__btn ${isEarn ? 'active' : ''}" href="earnings.html">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
      <span>Earnings</span>
    </a>
    <a class="bottombar__btn ${isAcct ? 'active' : ''}" href="account-worker.html">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
      <span>Account</span>
    </a>
  </nav>`;
}

/* ── Build Bottom Bar (Customer) ── */
function buildBottomBarCustomer(active) {
  const isHome = active === 'home';
  const isPost = active === 'post';
  const isAcct = active === 'account';
  return `
  <nav class="bottombar">
    <a class="bottombar__btn ${isHome ? 'active' : ''}" href="dashboard-customer.html">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
      <span>Home</span>
    </a>
    <a class="bottombar__btn bottombar__btn--post ${isPost ? 'active' : ''}" href="post-gig.html">
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
      <span>Post</span>
    </a>
    <a class="bottombar__btn ${isAcct ? 'active' : ''}" href="account-customer.html">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
      <span>Account</span>
    </a>
  </nav>`;
}

/* ── Build Overlay Menu ── */
function buildOverlayMenu(role) {
  const workerItems = [
    { label: 'Dashboard',    icon: '🏠', href: 'dashboard-worker.html' },
    { label: 'My Gigs',      icon: '📋', href: 'gigs-report.html' },
    { label: 'Earnings',     icon: '💰', href: 'earnings.html' },
    { label: 'Messages',     icon: '💬', href: 'conversations.html' },
    { label: 'My Account',   icon: '👤', href: 'account-worker.html' },
    { label: 'Log Out',      icon: '🚪', href: 'index.html' },
  ];
  const customerItems = [
    { label: 'Dashboard',    icon: '🏠', href: 'dashboard-customer.html' },
    { label: 'Post a Gig',   icon: '➕', href: 'post-gig.html' },
    { label: 'Messages',     icon: '💬', href: 'conversations.html' },
    { label: 'My Account',   icon: '👤', href: 'account-customer.html' },
    { label: 'Log Out',      icon: '🚪', href: 'index.html' },
  ];
  const items = role === 'worker' ? workerItems : customerItems;
  return `
  <div class="overlay-menu" id="overlayMenu" onclick="handleOverlayClick(event)">
    <div class="overlay-menu__panel">
      <div class="overlay-menu__header">MENU</div>
      ${items.map(i => `
        <a class="overlay-menu__item" href="${i.href}">
          <span>${i.icon}</span> ${i.label}
        </a>`).join('')}
      <div class="overlay-menu__logo">
        <div style="font-family:var(--font-display);font-size:1.6rem;color:var(--purple-dark);letter-spacing:2px;">HomeGigs</div>
      </div>
      <div class="overlay-menu__close">
        <button class="btn--back btn" onclick="toggleMenu()">← Close</button>
      </div>
    </div>
  </div>`;
}

function handleOverlayClick(e) {
  if (e.target.id === 'overlayMenu') toggleMenu();
}
