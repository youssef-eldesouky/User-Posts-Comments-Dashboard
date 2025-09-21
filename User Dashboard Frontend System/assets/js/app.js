/* app.js - common utilities + seeded mock data for the project
   Provides fetchUsers(), fetchPosts(), fetchComments(postId), fetchAllComments()
*/

// Toggle this to false to use live JSONPlaceholder API instead of seed
const USE_SEED = true;

// --- Seeded Users (5 Egyptian names) ---
const SEED_USERS = [
  { id: 1, name: "Youssef Eldesouky", email: "youssef.eldesouky@example.com", phone: "+20 100 111 2222", address: { city: "Cairo" } },
  { id: 2, name: "Ahmed Hassan", email: "ahmed.hassan@example.com", phone: "+20 122 333 4444", address: { city: "Alexandria" } },
  { id: 3, name: "Mohamed Samir", email: "mohamed.samir@example.com", phone: "+20 111 222 3333", address: { city: "Giza" } },
  { id: 4, name: "Karim Mostafa", email: "karim.mostafa@example.com", phone: "+20 155 666 7777", address: { city: "Mansoura" } },
  { id: 5, name: "Omar Nader", email: "omar.nader@example.com", phone: "+20 199 888 0000", address: { city: "Tanta" } }
];

// --- Seeded Posts (6 posts about sports / football transfers) ---
const SEED_POSTS = [
  { userId: 1, id: 1, title: "Zamalek signs promising striker", body: "Zamalek announced the signing of a young striker on a three-year deal. Fans expect him to add pace and finishing to the frontline." },
  { userId: 2, id: 2, title: "Al Ahly close to midfield maestro", body: "Al Ahly reportedly reached an agreement to bring a creative midfielder expected to strengthen control in the midfield." },
  { userId: 3, id: 3, title: "Egyptian defender moves to Europe", body: "An Egyptian national team defender has completed a transfer to a Portuguese club, aiming to take the next step in his career." },
  { userId: 4, id: 4, title: "Local club signs veteran goalkeeper", body: "A veteran goalkeeper has joined a premier league side to bolster experience and leadership at the back." },
  { userId: 5, id: 5, title: "Summer transfer round-up: rumors and deals", body: "A quick roundup of the summer window covering regional moves, loan deals, and a few surprise signings." },
  { userId: 1, id: 6, title: "Youth academy talent promoted to first team", body: "A talented academy forward is promoted to the first team after impressive performances in preseason." }
];

// --- Seeded Comments ---
// 2 comments each for posts 1..4; posts 5 & 6 have none
const SEED_COMMENTS = [
  { postId: 1, id: 1, name: "Fatma Ali", email: "fatma.ali@example.com", body: "Welcome to the team! Can't wait to see him score." },
  { postId: 1, id: 2, name: "Hassan Ibrahim", email: "hassan.ibr@example.com", body: "Good signing — needs time to adapt to the league." },

  { postId: 2, id: 3, name: "Sara Mostafa", email: "sara.mos@example.com", body: "If he joins, midfield will look much stronger." },
  { postId: 2, id: 4, name: "Mahmoud Tarek", email: "mahmoud.trk@example.com", body: "Hope the deal goes through — can't wait for derby matches." },

  { postId: 3, id: 5, name: "Laila Hany", email: "laila.hany@example.com", body: "Fantastic move — great for his development." },
  { postId: 3, id: 6, name: "Amr Galal", email: "amr.gal@example.com", body: "Portugal is a good stepping stone for African players." },

  { postId: 4, id: 7, name: "Noura Sami", email: "noura.sami@example.com", body: "Veteran presence will calm the defense." },
  { postId: 4, id: 8, name: "Khaled Omar", email: "khaled.omr@example.com", body: "Experience is priceless, great pickup." }
];

// deep copy helper
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// fetch helpers used across the app
function fetchUsers() {
  if (USE_SEED) return Promise.resolve(deepCopy(SEED_USERS));
  return fetch('https://jsonplaceholder.typicode.com/users').then(r => r.json());
}
function fetchPosts() {
  if (USE_SEED) return Promise.resolve(deepCopy(SEED_POSTS));
  return fetch('https://jsonplaceholder.typicode.com/posts').then(r => r.json());
}
function fetchComments(postId) {
  if (USE_SEED) {
    const list = SEED_COMMENTS.filter(c => Number(c.postId) === Number(postId));
    return Promise.resolve(deepCopy(list));
  }
  return fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`).then(r => r.json());
}
function fetchAllComments() {
  if (USE_SEED) return Promise.resolve(deepCopy(SEED_COMMENTS));
  return fetch('https://jsonplaceholder.typicode.com/comments').then(r => r.json());
}

// ----------------- existing utilities (loader, theme, toastr) -----------------
function showLoader() { $('#loader').show(); }
function hideLoader() { $('#loader').hide(); }

toastr.options = {
  positionClass: "toast-bottom-right",
  timeOut: "2200",
  progressBar: true,
  newestOnTop: true
};

function initTheme() {
  const t = localStorage.getItem('theme') || 'light';
  if (t === 'dark') $('body').addClass('dark');
  $('#themeToggle').prop('checked', t === 'dark');
}
function toggleTheme(checked) {
  if (checked) {
    $('body').addClass('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    $('body').removeClass('dark');
    localStorage.setItem('theme', 'light');
  }
}

function markActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  $('.navlinks a').each(function(){
    const href = $(this).attr('href');
    if (!href) return;
    if ((href === path) || (href === 'index.html' && (path === '' || path === 'index.html'))) $(this).addClass('active');
    else $(this).removeClass('active');
  });
}
function animateNavLinks() {
  $('.navlinks a').each(function(i){
    const delay = 60 * i;
    $(this).css({ opacity: 0, transform: 'translateY(6px)' });
    setTimeout(() => {
      $(this).animate({ opacity: 1, top: 0 }, { duration: 260 });
      $(this).css('transform', 'translateY(0)');
    }, delay);
  });
}

$(document).ready(() => {
  initTheme();
  $('#themeToggle').on('change', function() { toggleTheme(this.checked); });
  $(document).on('click', '#cancelEditUser', function(){ $('#editUserModal').hide(); });
  $(document).on('click', '#cancelEditPost', function(){ $('#editPostModal').hide(); });
  markActiveNav();
  animateNavLinks();
  $(document).on('keydown', function(e){ if (e.key === 'Tab') $('body').addClass('keyboard-focus'); });
});

// small HTML escape helper
function escapeHtml(s) {
  if (s === null || s === undefined) return '';
  return String(s).replace(/[&<>"'`]/g, chr => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;", "`":"&#96;"}[chr]));
}
