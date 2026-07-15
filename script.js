const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  header.toggleAttribute("data-scrolled", window.scrollY > 24);
});

const contactForm = document.querySelector("#contact-form");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const data = new FormData(contactForm);
  const subject = data.get("subject").trim();
  const body = [
    data.get("message").trim(),
    "",
    `From: ${data.get("name").trim()}`,
    `Reply to: ${data.get("email").trim()}`,
  ].join("\n");

  const emailAddress = ["ibrahimdavid08", "gmail.com"].join("@");
  const emailUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const formNote = document.querySelector("#form-note");

  formNote.textContent = "Opening your email app… If nothing happens, your browser does not have an email app configured.";
  window.location.href = emailUrl;
});
