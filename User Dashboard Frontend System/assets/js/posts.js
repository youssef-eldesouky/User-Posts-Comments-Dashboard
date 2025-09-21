/* posts.js - handles Posts: live search, add/edit/delete locally, show comments
   Uses fetchPosts() and fetchComments() from app.js (seeded)
*/

const LS_POSTS = 'posts_local';

function getLocalPosts() { try { return JSON.parse(localStorage.getItem(LS_POSTS) || '[]'); } catch(e){ return []; } }
function setLocalPosts(arr) { localStorage.setItem(LS_POSTS, JSON.stringify(arr)); }

async function fetchAndRenderPosts() {
  try {
    showLoader();
    const apiPosts = await fetchPosts();
    const local = getLocalPosts();

    const localMap = {};
    local.forEach(p => localMap[p.id] = p);

    const merged = apiPosts
      .filter(p => !(localMap[p.id] && localMap[p.id].deleted))
      .map(p => ({...p, ...(localMap[p.id] || {})}));

    const addedLocal = local.filter(p => p.id < 0 && !p.deleted);
    const finalList = merged.concat(addedLocal);

    renderPosts(finalList);
  } catch (err) {
    console.error(err);
    toastr.error('Failed to fetch posts');
  } finally {
    hideLoader();
  }
}

function renderPosts(posts) {
  const $container = $('#postsContainer').empty();
  if (!posts.length) $container.append('<div>No posts found.</div>');
  posts.forEach(p => {
    const title = escapeHtml(p.title);
    const body = escapeHtml(p.body);
    const postHtml = $(`
      <div class="post-card animate__animated animate__fadeInUp" data-id="${p.id}">
        <h3>${title}</h3>
        <p>${body}</p>
        <div class="post-actions">
          <button class="btn btn-small btn-comments" data-id="${p.id}"><i class="fa fa-comments"></i> Comments</button>
          <button class="btn btn-small btn-edit" data-id="${p.id}"><i class="fa fa-pen"></i> Edit</button>
          <button class="btn btn-small btn-delete" data-id="${p.id}"><i class="fa fa-trash"></i> Delete</button>
        </div>
        <div class="comments" style="display:none; margin-top:10px;"></div>
      </div>
    `);
    $container.append(postHtml);
  });
}

// Live search
$(document).on('input', '#postSearch', function(){
  const q = $(this).val().toLowerCase().trim();
  $('.post-card').each(function(){
    const title = $(this).find('h3').text().toLowerCase();
    const body = $(this).find('p').text().toLowerCase();
    $(this).toggle(title.indexOf(q) !== -1 || body.indexOf(q) !== -1);
  });
});

// Add post locally
$('#addPostForm').on('submit', function(e){
  e.preventDefault();
  const title = $('#newPostTitle').val().trim();
  const body = $('#newPostBody').val().trim();
  if (!title || !body) { toastr.error('Please provide title and body'); return; }

  const local = getLocalPosts();
  const minId = local.length ? Math.min(...local.map(p => p.id)) : 0;
  const newId = (minId < 0) ? minId - 1 : -1;
  const post = { userId: 1, id: newId, title, body };
  local.push(post);
  setLocalPosts(local);
  toastr.success('Post added (local)');
  $('#addPostForm')[0].reset();
  fetchAndRenderPosts();
});

// Delete post locally
$(document).on('click', '.post-card .btn-delete', function(){
  const id = Number($(this).data('id'));
  let local = getLocalPosts();
  const idx = local.findIndex(p => p.id === id);
  if (idx !== -1) local[idx].deleted = true;
  else local.push({ id, deleted: true });
  setLocalPosts(local);
  toastr.success('Post deleted (local)');
  fetchAndRenderPosts();
});

// Edit post flow
$(document).on('click', '.post-card .btn-edit', function(){
  const id = Number($(this).data('id'));
  const card = $(this).closest('.post-card');
  const title = card.find('h3').text();
  const body = card.find('p').text();
  $('#editPostId').val(id);
  $('#editPostTitle').val(title);
  $('#editPostBody').val(body);
  $('#editPostModal').show();
});

$('#saveEditPost').on('click', function(){
  const id = Number($('#editPostId').val());
  const title = $('#editPostTitle').val().trim();
  const body = $('#editPostBody').val().trim();
  if (!title || !body) { toastr.error('Please add title and body'); return; }

  let local = getLocalPosts();
  const idx = local.findIndex(p => p.id === id);
  if (idx === -1) local.push({ id, title, body });
  else local[idx] = { ...local[idx], id, title, body, deleted: false };
  setLocalPosts(local);
  $('#editPostModal').hide();
  toastr.success('Post updated (local)');
  fetchAndRenderPosts();
});

// Toggle show comments and fetch if needed
$(document).on('click', '.post-card .btn-comments', async function(){
  const id = Number($(this).data('id'));
  const $card = $(this).closest('.post-card');
  const $comments = $card.find('.comments');

  if ($comments.is(':visible')) { $comments.slideUp(); return; }

  try {
    showLoader();
    const comments = await fetchComments(id);
    $comments.empty();
    if (!comments || comments.length === 0) $comments.append('<div>No comments.</div>');
    else comments.forEach(c => {
      $comments.append(`<div class="comment"><strong>${escapeHtml(c.name)}</strong> <div style="color:var(--muted);font-size:13px">${escapeHtml(c.email)}</div><p>${escapeHtml(c.body)}</p></div>`);
    });
    $comments.slideDown();
  } catch (err) {
    console.error(err);
    toastr.error('Failed to fetch comments');
  } finally {
    hideLoader();
  }
});

$(document).ready(() => {
  fetchAndRenderPosts();
});
