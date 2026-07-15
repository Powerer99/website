const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  header.toggleAttribute("data-scrolled", window.scrollY > 24);
});

document.querySelectorAll(".copy-email").forEach((button) => {
  const originalText = button.textContent;

  button.addEventListener("click", async () => {
    const email = button.dataset.email;

    try {
      await navigator.clipboard.writeText(email);
      button.textContent = "Email Copied";
    } catch {
      button.textContent = email;
    }

    window.setTimeout(() => {
      button.textContent = originalText;
    }, 2200);
  });
});
