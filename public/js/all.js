const API_BASE_URL = "https://thought-stream-y75l.vercel.app/api"; // your backend URL

async function load() {
  const list = document.getElementById('list');
  list.innerHTML = '<p class="muted">Loading feedback...</p>';
  try {
    const res = await fetch(`${API_BASE_URL}/feedback`);
    if (!res.ok) throw new Error('Failed to fetch');
    const items = await res.json();
    if (!items.length) {
      list.innerHTML = '<p>No feedback yet.</p>';
      return;
    }

    list.innerHTML = items.map(i => `
      <div class="card" data-id="${i._id}">
        <div class="card-row">
          <div>
            <div><strong>${escapeHtml(i.name)}</strong> — Rating: ${i.rating}</div>
            <div class="meta">${new Date(i.createdAt).toLocaleString()}</div>
            <div>${i.comment ? escapeHtml(i.comment) : ''}</div>
          </div>
          <div class="actions">
            <button class="btn btn-danger" data-id="${i._id}" title="Delete feedback">Delete</button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    list.innerHTML = '<p class="error">Error loading feedback.</p>';
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>\"']/g, function(m) { 
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'})[m]; 
  });
}

load();

// Confirmation modal and delete flow
const modal = document.getElementById('confirmModal');
const toast = document.getElementById('toast');
let pendingId = null;

document.getElementById('list').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-danger');
  if (!btn) return;
  pendingId = btn.dataset.id;
  openModal();
});

function openModal(){
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.getElementById('confirmYes').focus();
}

function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  pendingId = null;
}

document.getElementById('confirmNo').addEventListener('click', () => {
  closeModal();
});

document.getElementById('confirmYes').addEventListener('click', async (e) => {
  if (!pendingId) return;
  const btn = e.currentTarget;
  btn.disabled = true;
  btn.textContent = 'Deleting...';

  try {
    const res = await fetch(`${API_BASE_URL}/feedback/${encodeURIComponent(pendingId)}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      showToast('Error deleting: ' + (err.error || 'Unknown'), true);
      return;
    }

    const el = document.querySelector(`.card[data-id="${pendingId}"]`);
    if (el) el.remove();
    showToast('Feedback deleted');
  } catch (err) {
    showToast('Network error while deleting', true);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Delete';
    closeModal();
  }
});

function showToast(msg, isError){
  toast.textContent = msg;
  toast.className = 'toast' + (isError ? ' error' : '');
  toast.setAttribute('aria-hidden','false');
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    toast.setAttribute('aria-hidden','true');
  }, 3000);
}
