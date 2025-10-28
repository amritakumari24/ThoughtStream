async function load() {
  const list = document.getElementById('list');
  list.innerHTML = '<p class="muted">Loading feedback...</p>';
  try {
    const res = await fetch('/api/feedback');
    if (!res.ok) throw new Error('Failed to fetch');
    const items = await res.json();
    if (!items.length) {
      list.innerHTML = '<p>No feedback yet.</p>';
      return;
    }

    list.innerHTML = items.map(i => `
      <div class="card">
        <div><strong>${escapeHtml(i.name)}</strong> — Rating: ${i.rating}</div>
        <div class="meta">${new Date(i.createdAt).toLocaleString()}</div>
        <div>${i.comment ? escapeHtml(i.comment) : ''}</div>
      </div>
    `).join('');
  } catch (err) {
    list.innerHTML = '<p class="error">Error loading feedback.</p>';
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>\"']/g, function(m) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'})[m]; });
}

load();
