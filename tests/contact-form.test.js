import assert from "node:assert/strict";
import { createServer } from "node:http";
import { after, before, test } from "node:test";
import { createContactPayload, sendContactMessage } from "../src/contact-form.js";

let origin;
let received;
const server = createServer(async (request, response) => {
  let body = "";
  for await (const chunk of request) body += chunk;
  const payload = JSON.parse(body);
  received = { path: request.url, headers: request.headers, payload };
  if (payload.name === "timeout") return;
  if (payload.name === "http-error") {
    response.writeHead(503).end("Unavailable");
  } else if (payload.name === "invalid-json") {
    response.writeHead(200).end("Not JSON");
  } else {
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ success: payload.name !== "rejected" ? "true" : "false" }));
  }
});

before(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
});

test("posts all form fields to the AJAX endpoint and accepts confirmed success", async () => {
  const payload = { name: "Тест", email: "test@example.com", message: "Нужен сайт", _subject: "Заявка", _honey: "" };
  await sendContactMessage(`${origin}/recipient`, payload);
  assert.equal(received.path, "/ajax/recipient");
  assert.equal(received.headers["content-type"], "application/json");
  assert.equal(received.headers.accept, "application/json");
  assert.deepEqual(received.payload, payload);
});

test("preserves Russian email labels and sets the visitor as Reply-To", async () => {
  const formData = new FormData();
  for (const [key, value] of Object.entries({
    Имя: "Тест",
    Почта: "visitor@example.com",
    Сообщение: "Нужен сайт",
    _subject: "Новая заявка с сайта",
    _template: "basic",
    _honey: "",
  })) formData.set(key, value);
  await sendContactMessage(`${origin}/recipient`, createContactPayload(formData));
  assert.equal(received.payload.Имя, "Тест");
  assert.equal(received.payload.Сообщение, "Нужен сайт");
  assert.equal(received.payload._replyto, received.payload.Почта);
  assert.equal(received.payload._subject, "Новая заявка с сайта");
  assert.equal(received.payload.email, undefined);
  assert.equal(received.payload.message, undefined);
});

test("does not mistake the service's string false for success", async () => {
  await assert.rejects(sendContactMessage(`${origin}/recipient`, { name: "rejected" }));
});

test("does not report success for an HTTP error or invalid response", async () => {
  for (const name of ["http-error", "invalid-json"]) {
    await assert.rejects(sendContactMessage(`${origin}/recipient`, { name }));
  }
});

test("aborts a stalled request so the form can become usable again", async () => {
  await assert.rejects(
    sendContactMessage(`${origin}/recipient`, { name: "timeout" }, { timeoutMs: 40 }),
    { name: "AbortError" },
  );
});
