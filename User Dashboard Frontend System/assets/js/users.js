/* users.js - handles Users page: DataTables, favorites, local edit/delete
   Uses fetchUsers() from app.js (seeded)
*/

const LS_USERS = 'users_local';
const LS_FAVS = 'favorites';

function getLocalUsers() { try { return JSON.parse(localStorage.getItem(LS_USERS) || '[]'); } catch(e){ return []; } }
function setLocalUsers(arr) { localStorage.setItem(LS_USERS, JSON.stringify(arr)); }
function getFavorites() { try { return JSON.parse(localStorage.getItem(LS_FAVS) || '[]'); } catch(e){ return []; } }
function setFavorites(arr) { localStorage.setItem(LS_FAVS, JSON.stringify(arr)); }

let usersTable;
async function fetchAndRenderUsers() {
  try {
    showLoader();
    const apiUsers = await fetchUsers();
    const local = getLocalUsers();

    const localMap = {};
    local.forEach(u => localMap[u.id] = u);

    const merged = apiUsers
      .filter(u => !(localMap[u.id] && localMap[u.id].deleted))
      .map(u => {
        const mu = {...u};
        if (localMap[u.id]) {
          if (localMap[u.id].name) mu.name = localMap[u.id].name;
          if (localMap[u.id].email) mu.email = localMap[u.id].email;
          if (localMap[u.id].phone) mu.phone = localMap[u.id].phone;
          if (localMap[u.id].address && localMap[u.id].address.city) mu.address = {...mu.address, city: localMap[u.id].address.city};
        }
        mu.city = mu.address && mu.address.city ? mu.address.city : '';
        return mu;
      });

    const localAdded = local.filter(u => u.id < 0 && !u.deleted).map(u => {
      return {
        id: u.id,
        name: u.name || '(local) No name',
        email: u.email || '',
        phone: u.phone || '',
        city: (u.address && u.address.city) ? u.address.city : ''
      };
    });

    const finalUsers = merged.concat(localAdded);
    renderDataTable(finalUsers);
  } catch (err) {
    console.error(err);
    toastr.error('Failed to fetch users');
  } finally {
    hideLoader();
  }
}

function renderDataTable(users) {
  if ($.fn.dataTable.isDataTable('#usersTable')) {
    usersTable.clear().rows.add(users).draw();
    return;
  }

  usersTable = $('#usersTable').DataTable({
    data: users,
    columns: [
      { data: 'id', orderable:false, render: renderFav },
      { data: 'name' },
      { data: 'email' },
      { data: 'phone' },
      { data: 'city', defaultContent: '' },
      { data: 'id', orderable:false, render: renderActions }
    ],
    pageLength: 8,
    lengthChange: false
  });

  $('#usersTable tbody').on('click', '.fav-toggle', function(e){
    e.preventDefault();
    const id = Number($(this).data('id'));
    toggleFavorite(id, $(this));
  });

  $('#usersTable tbody').on('click', '.btn-edit', function(){
    const id = Number($(this).data('id'));
    openEditModal(id);
  });

  $('#usersTable tbody').on('click', '.btn-delete', function(){
    const id = Number($(this).data('id'));
    deleteUserLocal(id);
  });
}

function renderFav(id) {
  const favs = getFavorites();
  const isFav = favs.includes(Number(id));
  return `<a href="#" class="fav-toggle" data-id="${id}" title="Toggle favorite">
            <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-star"></i>
          </a>`;
}
function renderActions(id) {
  return `
    <button class="btn btn-small btn-edit" data-id="${id}" title="Edit"><i class="fa fa-pen"></i></button>
    <button class="btn btn-small btn-delete" data-id="${id}" title="Delete"><i class="fa fa-trash"></i></button>
  `;
}

function toggleFavorite(id, $el) {
  const favs = getFavorites();
  const idx = favs.indexOf(Number(id));
  if (idx === -1) {
    favs.push(Number(id));
    toastr.success('Added to favorites');
    $el.find('i').removeClass('fa-regular').addClass('fa-solid');
  } else {
    favs.splice(idx, 1);
    toastr.info('Removed from favorites');
    $el.find('i').removeClass('fa-solid').addClass('fa-regular');
  }
  setFavorites(favs);
}

function deleteUserLocal(id) {
  const local = getLocalUsers();
  const existsIdx = local.findIndex(u => u.id === id);
  if (existsIdx !== -1) {
    local[existsIdx].deleted = true;
  } else {
    if (Number(id) < 0) {
      // nothing
    } else {
      local.push({ id: Number(id), deleted: true });
    }
  }
  setLocalUsers(local);
  toastr.success('User deleted (local)');
  fetchAndRenderUsers();
}

function openEditModal(id) {
  const data = usersTable.rows().data().toArray().find(u => Number(u.id) === Number(id));
  if (!data) { toastr.error('User not found'); return; }
  $('#editUserId').val(data.id);
  $('#editName').val(data.name || '');
  $('#editEmail').val(data.email || '');
  $('#editPhone').val(data.phone || '');
  $('#editCity').val(data.city || '');
  $('#editUserModal').show();
}

$('#saveEditUser').on('click', function(){
  const id = Number($('#editUserId').val());
  const name = $('#editName').val().trim();
  const email = $('#editEmail').val().trim();
  const phone = $('#editPhone').val().trim();
  const city = $('#editCity').val().trim();

  let local = getLocalUsers();
  const idx = local.findIndex(u => u.id === id);
  const payload = { id, name, email, phone, address: { city } };
  if (idx === -1) local.push(payload);
  else local[idx] = { ...local[idx], ...payload, deleted: false };
  setLocalUsers(local);
  $('#editUserModal').hide();
  toastr.success('User updated (local)');
  fetchAndRenderUsers();
});

$(document).ready(() => {
  fetchAndRenderUsers();
});
