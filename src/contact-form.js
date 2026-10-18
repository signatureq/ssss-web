export async function sendContactMessage(
  action,
  fields,
  { timeoutMs = 20000 } = {},
) {
  const endpoint = new URL(action);
  endpoint.pathname = `/ajax${endpoint.pathname}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`FormSubmit HTTP ${response.status}`);
    const result = await response.json();
    if (result.success !== true && result.success !== "true") {
      throw new Error("FormSubmit did not accept the message");
    }
    return result;
  } finally {
    clearTimeout(timeout);
  }
}

export function createContactPayload(formData) {
  const payload = Object.fromEntries(formData);
  payload._replyto = payload["Почта"];
  return payload;
}

export function initContactForm(form) {
  if (!form) return;
  const fields = form.querySelector("fieldset");
  const label = form.querySelector(".contact-submit-label");
  const status = form.querySelector(".contact-status");
  let pending = false;

  form.addEventListener("input", (event) => {
    event.target.setCustomValidity?.("");
    if (!pending) {
      status.textContent = "";
      delete status.dataset.state;
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (pending) return;
    for (const field of form.querySelectorAll("[required]")) {
      field.value = field.value.trim();
    }
    if (!form.reportValidity()) return;

    const payload = createContactPayload(new FormData(form));
    pending = true;
    fields.disabled = true;
    form.setAttribute("aria-busy", "true");
    label.textContent = "Отправляем…";
    status.textContent = "Отправляем ваше сообщение…";
    delete status.dataset.state;

    try {
      await sendContactMessage(form.action, payload);
      form.reset();
      status.dataset.state = "success";
      status.textContent = "Сообщение отправлено. Отвечу на указанную почту.";
    } catch {
      status.dataset.state = "error";
      status.textContent =
        "Не удалось подтвердить отправку. Попробуйте позже или напишите в Telegram.";
    } finally {
      pending = false;
      fields.disabled = false;
      form.removeAttribute("aria-busy");
      label.textContent = "Отправить заявку";
    }
  });
}
