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

  const emailUrl = new URL("https://mail.google.com/mail/");
  emailUrl.searchParams.set("view", "cm");
  emailUrl.searchParams.set("fs", "1");
  emailUrl.searchParams.set("to", "ibrahimdavid08@gmail.com");
  emailUrl.searchParams.set("su", subject);
  emailUrl.searchParams.set("body", body);

  window.open(emailUrl.toString(), "_blank", "noopener,noreferrer");
});
