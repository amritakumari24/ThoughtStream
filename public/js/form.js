document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = document.getElementById('submitBtn');
  const name = document.getElementById('name').value.trim();
  const rating = Number(document.getElementById('rating').value);
  const comment = document.getElementById('comment').value.trim();
  const msg = document.getElementById('message');
  msg.textContent = '';
  msg.className = 'message';

  // Basic client-side validation
  if (!name) {
    msg.textContent = 'Please enter your name.';
    msg.classList.add('error');
    return;
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    msg.textContent = 'Please select a rating between 1 and 5.';
    msg.classList.add('error');
    return;
  }

  // UI: disable button and show sending state
  const prevBtnText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, rating, comment })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      msg.textContent = 'Error: ' + (err.error || 'Unable to submit');
      msg.classList.add('error');
      return;
    }

    await res.json();
    msg.textContent = 'Thanks! Feedback submitted.';
    msg.classList.add('success');
    document.getElementById('feedbackForm').reset();
  } catch (err) {
    msg.textContent = 'Network error — please try again.';
    msg.classList.add('error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = prevBtnText;
  }
});
