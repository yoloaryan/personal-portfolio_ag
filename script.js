/**
 * Portfolio Vanilla JavaScript
 * Pure JavaScript - 0 External Dependencies
 */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. THEME SWITCHER
  // ==========================================
  const themeButtons = document.querySelectorAll(".theme-btn");
  const themes = ["light", "dark", "reader"];

  function applyTheme(themeName) {
    if (!themes.includes(themeName)) themeName = "dark";
    themes.forEach(t => document.documentElement.classList.remove("theme-" + t));
    document.documentElement.classList.add("theme-" + themeName);
    localStorage.setItem("ag-theme", themeName);

    // Update active styles on buttons
    themeButtons.forEach(btn => {
      const isActive = btn.dataset.theme === themeName;
      if (isActive) {
        btn.classList.add("text-white");
        btn.classList.remove("text-muted");
      } else {
        btn.classList.remove("text-white");
        btn.classList.add("text-muted");
      }
    });
  }

  // Initial theme check
  const savedTheme = localStorage.getItem("ag-theme") || "dark";
  applyTheme(savedTheme);

  themeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      applyTheme(btn.dataset.theme);
    });
  });

  // ==========================================
  // 2. NAVIGATION & ACTIVE SCROLL SPY
  // ==========================================
  const navLinks = document.querySelectorAll("#desktop-nav .nav-link");
  const mobileNav = document.getElementById("mobile-nav");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  // Mobile menu toggle
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileNav.classList.toggle("open");
    });

    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("open");
      });
    });
  }

  // Smooth scroll spy using IntersectionObserver
  const sections = document.querySelectorAll("section[id], div[id='experience']");
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px",
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          const href = link.getAttribute("href");
          if (href === `#${id}`) {
            link.className = "nav-link px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-transparent text-primary bg-primary/10 border-primary/20 shadow-[0_4px_15px_rgba(var(--primary-rgb),0.2)]";
          } else {
            link.className = "nav-link px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-transparent text-muted hover:text-foreground hover:bg-white/10 hover:border-white/20 hover:backdrop-blur-md";
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => navObserver.observe(sec));

  // ==========================================
  // 3. SCROLL TO TOP & BOTTOM BUTTONS
  // ==========================================
  const btnScrollTop = document.getElementById("btn-scroll-top");
  const btnScrollBottom = document.getElementById("btn-scroll-bottom");

  if (btnScrollTop) {
    btnScrollTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      btnScrollTop.classList.add("flash-active");
      setTimeout(() => btnScrollTop.classList.remove("flash-active"), 1600);
    });
  }

  if (btnScrollBottom) {
    btnScrollBottom.addEventListener("click", () => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      btnScrollBottom.classList.add("flash-active");
      setTimeout(() => btnScrollBottom.classList.remove("flash-active"), 1600);
    });
  }

  // ==========================================
  // 4. EXPERTISE RADAR INTERACTIVITY
  // ==========================================
  const radarNodes = document.querySelectorAll(".radar-node");
  const radarReadout = document.getElementById("radar-readout");

  radarNodes.forEach(node => {
    node.addEventListener("mouseenter", () => {
      const skill = node.dataset.skill;
      const value = node.dataset.value;
      if (radarReadout) {
        radarReadout.textContent = `${value}% ${skill.toUpperCase()}`;
        radarReadout.style.opacity = "1";
      }
      const circle = node.querySelector("circle");
      if (circle) circle.setAttribute("r", "5");
      const text = node.querySelector("text");
      if (text) {
        text.classList.remove("fill-muted");
        text.classList.add("fill-primary");
      }
    });

    node.addEventListener("mouseleave", () => {
      if (radarReadout) {
        radarReadout.style.opacity = "0";
      }
      const circle = node.querySelector("circle");
      if (circle) circle.setAttribute("r", "3");
      const text = node.querySelector("text");
      if (text) {
        text.classList.add("fill-muted");
        text.classList.remove("fill-primary");
      }
    });
  });

  // ==========================================
  // 5. PROJECTS CATEGORY FILTER
  // ==========================================
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // Update button styles
      filterButtons.forEach(b => {
        b.className = "filter-btn px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 backdrop-blur-md bg-card/50 border border-card-border text-muted hover:text-foreground hover:bg-card hover:border-primary/50";
      });
      btn.className = "filter-btn px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 backdrop-blur-md bg-primary text-white shadow-lg shadow-primary/30";

      // Filter project cards
      projectCards.forEach(card => {
        const categories = card.dataset.categories || "";
        if (filter === "all" || categories.includes(filter)) {
          card.style.display = "flex";
          card.style.opacity = "1";
          card.style.transform = "scale(1)";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // ==========================================
  // 6. ARTICLE READER MODAL (BLOG)
  // ==========================================
  const btnOpenArticle = document.getElementById("btn-open-article");
  const btnCloseArticle = document.getElementById("btn-close-article");
  const articleModal = document.getElementById("article-modal");

  function openArticle() {
    if (articleModal) articleModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeArticle() {
    if (articleModal) articleModal.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (btnOpenArticle) btnOpenArticle.addEventListener("click", openArticle);
  if (btnCloseArticle) btnCloseArticle.addEventListener("click", closeArticle);
  if (articleModal) {
    articleModal.addEventListener("click", (e) => {
      if (e.target === articleModal) closeArticle();
    });
  }

  // ==========================================
  // 7. CONTACT FORM SUBMISSION
  // ==========================================
  const contactForm = document.getElementById("contact-form");
  const contactSuccess = document.getElementById("contact-success");
  const contactError = document.getElementById("contact-error");
  const btnSubmitContact = document.getElementById("btn-submit-contact");
  const btnResetContact = document.getElementById("btn-reset-contact");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        if (contactError) contactError.classList.remove("hidden");
        return;
      }

      if (contactError) contactError.classList.add("hidden");
      if (btnSubmitContact) {
        btnSubmitContact.disabled = true;
        btnSubmitContact.innerHTML = `
          <svg class="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Sending...
        `;
      }

      // Simulate instantaneous client-side transmission or Web3Forms/Formspree integration
      setTimeout(() => {
        contactForm.style.display = "none";
        if (contactSuccess) {
          contactSuccess.classList.remove("hidden");
          contactSuccess.classList.add("flex");
        }
        contactForm.reset();
        if (btnSubmitContact) {
          btnSubmitContact.disabled = false;
          btnSubmitContact.innerHTML = `<span>Send Message</span><svg class="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>`;
        }
      }, 700);
    });
  }

  if (btnResetContact) {
    btnResetContact.addEventListener("click", () => {
      if (contactSuccess) {
        contactSuccess.classList.add("hidden");
        contactSuccess.classList.remove("flex");
      }
      if (contactForm) contactForm.style.display = "block";
    });
  }

  // ==========================================
  // 8. NEWSLETTER SUBSCRIPTION
  // ==========================================
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterEmail = document.getElementById("newsletter-email");
  const newsletterMsg = document.getElementById("newsletter-msg");
  const btnNewsletterJoin = document.getElementById("btn-newsletter-join");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = newsletterEmail.value.trim();
      if (!email) return;

      btnNewsletterJoin.disabled = true;
      btnNewsletterJoin.textContent = "...";

      setTimeout(() => {
        btnNewsletterJoin.disabled = false;
        btnNewsletterJoin.textContent = "Join";
        newsletterEmail.value = "";
        if (newsletterMsg) {
          newsletterMsg.textContent = "Thanks for subscribing! 🎉";
          newsletterMsg.classList.remove("hidden");
          setTimeout(() => {
            newsletterMsg.classList.add("hidden");
          }, 3500);
        }
      }, 500);
    });
  }

  // ==========================================
  // 9. JOKE WIDGET
  // ==========================================
  const jokes = [
    { q: "Why do data scientists prefer dark mode?", a: "Because light attracts bugs!" },
    { q: "A SQL query goes into a bar, walks up to two tables and asks...", a: `"Can I join you?"` },
    { q: "Why did the machine learning algorithm break up with the dataset?", a: "It found hidden layers elsewhere." },
    { q: "How many programmers does it take to change a light bulb?", a: "None. It's a hardware problem." },
    { q: "Why do Python programmers have low self-esteem?", a: "They are constantly comparing their self to others." },
    { q: "What's a data scientist's favorite weight class in boxing?", a: "Random Forest." },
    { q: "Why did the programmer quit his job?", a: "Because he didn't get arrays." },
    { q: "Why do Java developers wear glasses?", a: "Because they can't C#." },
    { q: "How do you comfort a JavaScript bug?", a: "You console it." },
    { q: "What is an algorithm?", a: "A fancy word used by programmers when they don't want to explain what they did." },
    { q: "Why was the database administrator crying?", a: "Because he dropped his tables." },
    { q: "A programmer goes to the store. His wife says, 'Buy a gallon of milk, and if there are eggs, buy a dozen.'", a: "He returns with 12 gallons of milk." },
    { q: "There are 10 types of people in the world:", a: "Those who understand binary, and those who don't." }
  ];

  let currentJoke = jokes[0];
  const btnJokeStart = document.getElementById("btn-joke-start");
  const jokeStageAsking = document.getElementById("joke-stage-asking");
  const jokeQuestionText = document.getElementById("joke-question-text");
  const btnJokeReveal = document.getElementById("btn-joke-reveal");
  const jokeStageReveal = document.getElementById("joke-stage-reveal");
  const jokeQPreview = document.getElementById("joke-q-preview");
  const jokePunchlineText = document.getElementById("joke-punchline-text");
  const btnJokeRoll = document.getElementById("btn-joke-roll");

  function startRandomJoke() {
    currentJoke = jokes[Math.floor(Math.random() * jokes.length)];
    btnJokeStart.classList.add("hidden");
    jokeStageReveal.classList.add("hidden");
    jokeStageReveal.classList.remove("flex");

    jokeQuestionText.textContent = currentJoke.q;
    jokeStageAsking.classList.remove("hidden");
    jokeStageAsking.classList.add("flex");
  }

  function revealJokePunchline() {
    jokeStageAsking.classList.add("hidden");
    jokeStageAsking.classList.remove("flex");

    jokeQPreview.textContent = `"${currentJoke.q}"`;
    jokePunchlineText.textContent = currentJoke.a;

    jokeStageReveal.classList.remove("hidden");
    jokeStageReveal.classList.add("flex");
  }

  if (btnJokeStart) btnJokeStart.addEventListener("click", startRandomJoke);
  if (btnJokeReveal) btnJokeReveal.addEventListener("click", revealJokePunchline);
  if (btnJokeRoll) btnJokeRoll.addEventListener("click", startRandomJoke);

  // ==========================================
  // 10. AI NEURAL HUD MODAL & KEYBINDINGS
  // ==========================================
  const hudModal = document.getElementById("hud-modal");
  const btnOpenHud = document.getElementById("btn-open-hud");
  const btnCloseHud = document.getElementById("btn-close-hud");
  const hudLogStream = document.getElementById("hud-log-stream");
  const hudNavButtons = document.querySelectorAll(".hud-nav-btn");

  const mockLogs = [
    { t: "SYS", m: "Initializing Neural Core v4.0.2..." },
    { t: "DB",  m: "PostgreSQL Handshake: [SUCCESS] @ 0.4ms" },
    { t: "AI",  m: "Loading Model Weights: GPT-Portfolio-Large" },
    { t: "AI",  m: "Weight distribution: Normal | Mean: 0.02" },
    { t: "SYS", m: "Scanline Filter: ACTIVE_LEVEL_09" },
    { t: "NET", m: "Traffic routed through AES-256 Tunnel" },
    { t: "USER",m: "Session Hash: 0x8F2...A92B" },
    { t: "SYS", m: "Predicting Portfolio Growth: [EXPONENTIAL]" },
    { t: "AI",  m: "Gradient Descent: Step #2048 | Loss: 0.0001" },
    { t: "NET", m: "Global Node ping: 0.002ms (Fiber Optic)" }
  ];

  let logInterval = null;

  function appendLog() {
    if (!hudLogStream) return;
    const raw = mockLogs[Math.floor(Math.random() * mockLogs.length)];
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const logDiv = document.createElement("div");

    let colorClass = "text-white/70";
    if (raw.t === "SYS") colorClass = "text-primary";
    else if (raw.t === "AI") colorClass = "text-purple-400";
    else if (raw.t === "NET") colorClass = "text-cyan-400";

    logDiv.className = colorClass;
    logDiv.textContent = `> [${time}] [${raw.t}] ${raw.m}`;
    hudLogStream.appendChild(logDiv);

    if (hudLogStream.children.length > 14) {
      hudLogStream.removeChild(hudLogStream.firstChild);
    }
    hudLogStream.scrollTop = hudLogStream.scrollHeight;
  }

  function openHUD() {
    if (hudModal) hudModal.classList.add("open");
    document.body.style.overflow = "hidden";
    // Seed initial logs
    if (hudLogStream && hudLogStream.children.length === 0) {
      for (let i = 0; i < 6; i++) appendLog();
    }
    if (!logInterval) logInterval = setInterval(appendLog, 1600);
  }

  function closeHUD() {
    if (hudModal) hudModal.classList.remove("open");
    document.body.style.overflow = "";
    if (logInterval) {
      clearInterval(logInterval);
      logInterval = null;
    }
  }

  if (btnOpenHud) btnOpenHud.addEventListener("click", openHUD);
  if (btnCloseHud) btnCloseHud.addEventListener("click", closeHUD);

  hudNavButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      closeHUD();
    });
  });

  // Global key shortcuts
  window.addEventListener("keydown", (e) => {
    // CMD+K or CTRL+K opens/toggles HUD
    if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
      e.preventDefault();
      if (hudModal && hudModal.classList.contains("open")) {
        closeHUD();
      } else {
        openHUD();
      }
    }

    // Escape closes HUD or Article modal
    if (e.key === "Escape") {
      closeHUD();
      closeArticle();
    }

    // Inside HUD shortcuts
    if (hudModal && hudModal.classList.contains("open")) {
      if (e.key === "h" || e.key === "H") {
        window.location.hash = "#home";
        closeHUD();
      } else if (e.key === "a" || e.key === "A") {
        window.location.hash = "#about";
        closeHUD();
      } else if (e.key === "s" || e.key === "S") {
        window.location.hash = "#skills";
        closeHUD();
      } else if (e.key === "e" || e.key === "E") {
        window.location.hash = "#experience";
        closeHUD();
      } else if (e.key === "p" || e.key === "P") {
        window.location.hash = "#projects";
        closeHUD();
      } else if (e.key === "c" || e.key === "C") {
        window.location.hash = "#contact";
        closeHUD();
      }
    }
  });

  // ==========================================
  // 11. PORTFOLIO INFORMATION PANEL TABS
  // ==========================================
  const infoTabButtons = document.querySelectorAll(".info-tab-btn");
  const infoPanes = document.querySelectorAll(".info-panel-pane");

  if (infoTabButtons.length > 0) {
    infoTabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        infoTabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        infoPanes.forEach(pane => {
          if (pane.id === `pane-${tab}`) {
            pane.classList.remove("hidden");
          } else {
            pane.classList.add("hidden");
          }
        });
      });
    });
  }

  // Apple Notes Resume Fallback Interactivity (if present)
  const notesApp = document.getElementById("apple-notes-app");
  const notesSidebar = document.getElementById("notes-sidebar");
  const btnToggleSidebar = document.getElementById("btn-notes-sidebar-toggle");
  const btnFullscreen = document.getElementById("btn-notes-fullscreen");
  const btnClose = document.getElementById("btn-notes-close");
  const btnMinimize = document.getElementById("btn-notes-minimize");
  const noteItems = document.querySelectorAll(".note-item");
  const noteContentBlocks = document.querySelectorAll(".note-content-block");
  const notesEditorPane = document.getElementById("notes-editor-pane");

  if (notesApp && noteItems.length > 0) {
    // Note switching
    noteItems.forEach(item => {
      item.addEventListener("click", () => {
        const noteId = item.dataset.noteId;
        noteItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        noteContentBlocks.forEach(block => {
          if (block.id === `note-view-${noteId}`) {
            block.classList.remove("hidden");
          } else {
            block.classList.add("hidden");
          }
        });

        if (notesEditorPane) {
          notesEditorPane.scrollTop = 0;
        }
      });
    });

    // Toggle Sidebar
    if (btnToggleSidebar && notesSidebar) {
      btnToggleSidebar.addEventListener("click", () => {
        notesSidebar.classList.toggle("hidden");
      });
    }

    // Fullscreen Toggle (Green traffic light)
    if (btnFullscreen) {
      btnFullscreen.addEventListener("click", () => {
        notesApp.classList.toggle("fullscreen-notes");
      });
    }

    // Close / Reset Note (Red traffic light)
    if (btnClose) {
      btnClose.addEventListener("click", () => {
        if (notesApp.classList.contains("fullscreen-notes")) {
          notesApp.classList.remove("fullscreen-notes");
        } else {
          const defaultNote = document.querySelector('.note-item[data-note-id="resume"]');
          if (defaultNote) defaultNote.click();
        }
      });
    }

    // Minimize / Scroll Top (Yellow traffic light)
    if (btnMinimize && notesEditorPane) {
      btnMinimize.addEventListener("click", () => {
        notesEditorPane.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // Escape closes fullscreen notes
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && notesApp.classList.contains("fullscreen-notes")) {
        notesApp.classList.remove("fullscreen-notes");
      }
    });
  }
});
