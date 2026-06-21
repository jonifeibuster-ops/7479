document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('review-form');
  if (!form) return;

  const msg = document.getElementById('review-message');
  const submitBtn = document.getElementById('review-submit-btn');
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    msg.textContent = '';
    msg.className = 'form__message';

    const formData = new FormData(form);
    const payload = {
      user_name: formData.get('user_name')?.toString().trim() ?? '',
      rating: Number(formData.get('rating')),
      comment: formData.get('comment')?.toString().trim() ?? '',
    };

    if (!payload.user_name || !payload.rating || !payload.comment) {
      msg.textContent = 'Заполните все поля формы.';
      msg.classList.add('form__message--error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errors = data.errors ?? {};
        const firstError = Object.values(errors).flat()[0];
        msg.textContent = firstError ?? data.message ?? 'Не удалось отправить отзыв. Попробуйте позже.';
        msg.classList.add('form__message--error');
        return;
      }

      form.reset();
      const defaultRating = form.querySelector('input[name="rating"][value="5"]');
      if (defaultRating) defaultRating.checked = true;

      msg.textContent = data.message ?? 'Спасибо! Ваш отзыв отправлен на модерацию.';
      msg.classList.add('form__message--success');
    } catch {
      msg.textContent = 'Ошибка сети. Проверьте подключение и попробуйте снова.';
      msg.classList.add('form__message--error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить отзыв';
    }
  });
});
