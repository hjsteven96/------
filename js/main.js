// Scroll Progress Bar
window.addEventListener("scroll", () => {
  const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  const progressBar = document.getElementById("scroll-progress");
  if (progressBar) { progressBar.style.width = scrolled + "%"; }
});

// SVG Icons
const copySvg = `<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const successSvg = `<svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const errorSvg = `<svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

// Init copy buttons
document.querySelectorAll(".copy-button").forEach((button) => {
  const text = button.textContent;
  button.innerHTML = copySvg + `<span>${text}</span>`;
});

// Copy logic
async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "absolute";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  helper.select();
  document.execCommand("copy");
  document.body.removeChild(helper);
}

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const targetId = button.getAttribute("data-copy-target");
    const target = document.getElementById(targetId);
    if (!target) return;

    const originalText = button.querySelector("span").textContent;

    try {
      await copyText(target.innerText.trim());
      button.innerHTML = successSvg + "<span>복사 완료</span>";
      button.classList.add("copied");
    } catch (error) {
      button.innerHTML = errorSvg + "<span>복사 실패</span>";
      button.classList.add("copy-failed");
    }

    window.setTimeout(() => {
      button.innerHTML = copySvg + `<span>${originalText}</span>`;
      button.classList.remove("copied", "copy-failed");
    }, 1500);
  });
});

// Contextual styling for checklist boxes
document.querySelectorAll(".checklist").forEach((card) => {
  const heading = card.querySelector("h3");
  if (!heading) return;
  const text = heading.textContent;
  if (text.includes("위험") || text.includes("필독") || text.includes("주의")) {
    card.classList.add("checklist-unfit");
  } else if (text.includes("매트릭스") || text.includes("체크리스트")) {
    card.classList.add("checklist-warning");
  } else {
    card.classList.add("checklist-check");
  }
});

// Scrollspy
const chapters = document.querySelectorAll(".chapter, #appendix");
const tocLinks = document.querySelectorAll(".toc a");
const observerOptions = { root: null, rootMargin: "-20% 0px -60% 0px", threshold: 0 };

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute("id");
      tocLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }
  });
}, observerOptions);

chapters.forEach((chapter) => observer.observe(chapter));
