/**
 * projects.js — Modular Project Grid, Filter, Live Search & Hash Router
 * Aryan Gupta Portfolio
 */

(function (window) {
  'use strict';

  let allProjects = [];
  let activeFilter = 'all';
  let searchQuery = '';
  let activeSort = 'newest';

  // Gradient generator for fallback banners
  const gradients = [
    'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #9333ea 100%)',
    'linear-gradient(135deg, #065f46 0%, #10b981 50%, #06b6d4 100%)',
    'linear-gradient(135deg, #7c2d12 0%, #f97316 50%, #ec4899 100%)',
    'linear-gradient(135deg, #4c1d95 0%, #8b5cf6 50%, #3b82f6 100%)',
    'linear-gradient(135deg, #831843 0%, #ec4899 50%, #f59e0b 100%)',
  ];

  function getGradientForSlug(slug) {
    let hash = 0;
    for (let i = 0; i < slug.length; i++) hash = slug.charCodeAt(i) + ((hash << 5) - hash);
    return gradients[Math.abs(hash) % gradients.length];
  }

  function handleImageFallback(img, project) {
    if (!img.dataset.fallbackStage) {
      img.dataset.fallbackStage = 'opengraph';
      if (project.githubRepo && project.githubRepo.includes('/')) {
        img.src = `https://opengraph.githubassets.com/1/${project.githubRepo}`;
        return;
      }
    }
    
    // Final fallback: CSS Gradient Banner
    img.dataset.fallbackStage = 'gradient';
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent && !parent.querySelector('.gradient-fallback-banner')) {
      const banner = document.createElement('div');
      banner.className = 'gradient-fallback-banner w-full h-full flex flex-col items-center justify-center p-6 text-center select-none';
      banner.style.background = getGradientForSlug(project.slug);
      banner.innerHTML = `
        <div class="text-3xl mb-2 drop-shadow-md">⚡</div>
        <span class="font-extrabold text-white text-base tracking-tight drop-shadow-md line-clamp-1">${project.title}</span>
        <span class="text-xs text-white/80 font-mono mt-1">${project.type === 'college' ? 'College Capstone' : 'Engineering Project'}</span>
      `;
      parent.appendChild(banner);
    }
  }

  // Expose globally for inline onerror
  window.handleProjectImgError = function(img) {
    const slug = img.dataset.slug;
    const project = allProjects.find((p) => p.slug === slug);
    if (project) handleImageFallback(img, project);
  };

  function createProjectCardHtml(project, index) {
    const isCollege = project.type === 'college';
    const typeBadge = isCollege
      ? `<span class="badge-pill bg-purple-500/10 text-purple-400 border border-purple-500/25">🎓 College</span>`
      : `<span class="badge-pill bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">🚀 Personal</span>`;

    const liveDemoBtn = project.liveUrl
      ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-card-action-btn hover:text-emerald-400" title="Live Application Demo" aria-label="Live Demo for ${project.title}" onclick="event.stopPropagation()">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          <span class="text-xs font-semibold">Demo</span>
        </a>`
      : '';

    const githubBtn = project.githubRepo
      ? `<a href="https://github.com/${project.githubRepo}" target="_blank" rel="noopener noreferrer" class="project-card-action-btn hover:text-primary" title="GitHub Repository" aria-label="GitHub Repository for ${project.title}" onclick="event.stopPropagation()">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          <span class="text-xs font-semibold">Code</span>
        </a>`
      : '';

    const techTags = (project.tech || [])
      .slice(0, 4)
      .map(
        (t) =>
          `<span class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-background/50 border border-card-border/40 text-muted">${t}</span>`
      )
      .join('');

    return `
      <div 
        class="project-card group relative bg-card/50 backdrop-blur-xl border border-card-border/60 rounded-3xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 focus:outline-none focus:ring-2 focus:ring-primary/60"
        tabindex="0"
        role="button"
        aria-label="View details for ${project.title}"
        data-slug="${project.slug}"
        style="animation-delay: ${index * 60}ms"
      >
        <!-- Top Media Container 16:9 -->
        <div class="project-card-media relative w-full aspect-video overflow-hidden bg-background/80 border-b border-card-border/40">
          <img 
            src="${project.screenshot || `assets/projects/${project.slug}.png`}" 
            alt="${project.title} Preview" 
            loading="lazy"
            class="project-card-img w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            data-slug="${project.slug}"
            onerror="window.handleProjectImgError && window.handleProjectImgError(this)"
          />
          <div class="absolute top-3 left-3 z-10 flex gap-2">
            ${typeBadge}
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
        </div>

        <!-- Body -->
        <div class="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-1">
              ${project.title}
            </h3>
            <p class="text-muted text-xs leading-relaxed line-clamp-2 mb-4">
              ${project.description}
            </p>
          </div>

          <div>
            <!-- Tech chips -->
            <div class="flex flex-wrap gap-1.5 mb-5">
              ${techTags}
            </div>

            <!-- Footer Action Row -->
            <div class="pt-3 border-t border-card-border/40 flex items-center justify-between">
              <span class="text-xs font-semibold text-primary/80 group-hover:text-primary flex items-center gap-1">
                <span>View Details</span>
                <span class="transition-transform group-hover:translate-x-1">→</span>
              </span>

              <div class="flex items-center gap-3">
                ${liveDemoBtn}
                ${githubBtn}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function filterAndSortProjects() {
    let list = [...allProjects];

    // Filter
    if (activeFilter !== 'all') {
      const f = activeFilter.toLowerCase();
      if (f === 'college' || f === 'personal') {
        list = list.filter((p) => (p.type || '').toLowerCase() === f);
      } else {
        list = list.filter((p) => {
          const cats = (p.category || []).map((c) => c.toLowerCase());
          const techs = (p.tech || []).map((t) => t.toLowerCase());
          return cats.some((c) => c.includes(f) || f.includes(c)) || techs.some((t) => t.includes(f) || f.includes(t));
        });
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const titleMatch = (p.title || '').toLowerCase().includes(q);
        const descMatch = (p.description || '').toLowerCase().includes(q);
        const techMatch = (p.tech || []).some((t) => t.toLowerCase().includes(q));
        const catMatch = (p.category || []).some((c) => c.toLowerCase().includes(q));
        return titleMatch || descMatch || techMatch || catMatch;
      });
    }

    // Sort
    if (activeSort === 'newest') {
      list.sort((a, b) => new Date(b.date || '2025-01-01') - new Date(a.date || '2025-01-01'));
    } else if (activeSort === 'oldest') {
      list.sort((a, b) => new Date(a.date || '2025-01-01') - new Date(b.date || '2025-01-01'));
    } else if (activeSort === 'az') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (activeSort === 'za') {
      list.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    }

    return list;
  }

  function renderGrid() {
    const gridContainer = document.getElementById('projects-grid');
    const countBadge = document.getElementById('project-count-badge');
    const emptyState = document.getElementById('empty-state');

    if (!gridContainer) return;

    const filtered = filterAndSortProjects();

    if (countBadge) {
      countBadge.textContent = `${filtered.length} Project${filtered.length === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
      gridContainer.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    gridContainer.innerHTML = filtered.map((p, idx) => createProjectCardHtml(p, idx)).join('');

    // Attach click and keyboard handlers
    gridContainer.querySelectorAll('.project-card').forEach((card) => {
      const slug = card.dataset.slug;
      const select = () => {
        window.location.hash = `#/${slug}`;
      };

      card.addEventListener('click', select);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          select();
        }
      });

      // Hook image error handling
      const img = card.querySelector('.project-card-img');
      if (img) {
        const project = allProjects.find((p) => p.slug === slug);
        img.addEventListener('error', () => {
          if (project) handleImageFallback(img, project);
        });
      }
    });
  }

  // Hash Router for Detail View
  function handleRouting() {
    const hash = window.location.hash.trim();
    const gridView = document.getElementById('projects-grid-view');
    const detailView = document.getElementById('project-detail-view');

    if (!gridView || !detailView) return;

    // Check if route matches #/{slug}
    const match = hash.match(/^#\/([a-zA-Z0-9_-]+)/);

    if (match) {
      const slug = match[1];
      const projectIndex = allProjects.findIndex((p) => p.slug === slug);

      if (projectIndex !== -1) {
        const project = allProjects[projectIndex];
        const prevProject = projectIndex > 0 ? allProjects[projectIndex - 1] : allProjects[allProjects.length - 1];
        const nextProject = projectIndex < allProjects.length - 1 ? allProjects[projectIndex + 1] : allProjects[0];

        renderDetailView(project, prevProject, nextProject);
        gridView.classList.add('hidden');
        detailView.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // Default: Show grid view
    detailView.classList.add('hidden');
    gridView.classList.remove('hidden');
  }

  function renderDetailView(project, prevProject, nextProject) {
    const detailView = document.getElementById('project-detail-view');
    if (!detailView) return;

    const isCollege = project.type === 'college';
    const typeBadge = isCollege
      ? `<span class="badge-pill bg-purple-500/10 text-purple-400 border border-purple-500/25 px-3 py-1">🎓 College Capstone</span>`
      : `<span class="badge-pill bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-3 py-1">🚀 Personal Engineering</span>`;

    const techChips = (project.tech || [])
      .map(
        (t) =>
          `<span class="px-3 py-1 rounded-xl text-xs font-semibold bg-card/60 border border-card-border/60 text-foreground">${t}</span>`
      )
      .join('');

    const liveBtn = project.liveUrl
      ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white shadow-xl shadow-primary/20 hover:-translate-y-0.5 transition-all">
          <span>🚀 Live Demo</span>
          <span>↗</span>
        </a>`
      : '';

    const githubBtn = project.githubRepo
      ? `<a href="https://github.com/${project.githubRepo}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-foreground bg-card/80 border border-card-border/60 hover:border-primary/50 hover:bg-card transition-all">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          <span>View on GitHub</span>
          <span>↗</span>
        </a>`
      : '';

    detailView.innerHTML = `
      <div class="max-w-4xl mx-auto px-6 md:px-8 py-10">
        <!-- Top Nav Controls -->
        <div class="flex items-center justify-between gap-4 mb-8">
          <button 
            id="btn-back-to-grid" 
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-muted hover:text-foreground bg-card/60 border border-card-border/60 hover:bg-card transition-all cursor-pointer"
          >
            <span>←</span>
            <span>Back to all projects</span>
          </button>

          <!-- Prev / Next Navigation -->
          <div class="flex items-center gap-2">
            <a 
              href="#/${prevProject.slug}" 
              class="p-2 rounded-full text-muted hover:text-foreground bg-card/60 border border-card-border/60 hover:bg-card transition-all flex items-center justify-center text-xs" 
              title="Previous Project: ${prevProject.title}"
            >
              ← Prev
            </a>
            <a 
              href="#/${nextProject.slug}" 
              class="p-2 rounded-full text-muted hover:text-foreground bg-card/60 border border-card-border/60 hover:bg-card transition-all flex items-center justify-center text-xs" 
              title="Next Project: ${nextProject.title}"
            >
              Next →
            </a>
          </div>
        </div>

        <!-- Detail Hero Banner (16:9) -->
        <div class="relative w-full aspect-video rounded-3xl overflow-hidden bg-background/90 border border-card-border/60 shadow-2xl mb-8">
          <img 
            id="detail-hero-img" 
            src="${project.screenshot || `assets/projects/${project.slug}.png`}" 
            alt="${project.title}" 
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent pointer-events-none"></div>
          
          <div class="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-2">
              ${typeBadge}
              <span class="badge-pill bg-white/10 text-muted border border-card-border px-3 py-1 font-mono text-[11px]">${project.date || '2025'}</span>
            </div>
            
            <button 
              id="btn-copy-share" 
              class="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              <span>Share</span>
            </button>
          </div>
        </div>

        <!-- Detail Header -->
        <div class="mb-10">
          <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
            ${project.title}
          </h1>
          <p class="text-base text-muted leading-relaxed mb-6">
            ${project.description}
          </p>

          <div class="flex flex-wrap gap-2 mb-8">
            ${techChips}
          </div>

          <div class="flex flex-wrap items-center gap-4 pt-6 border-t border-card-border/50">
            ${liveBtn}
            ${githubBtn}
          </div>
        </div>

        <!-- Live README Section -->
        <div class="pt-8 border-t border-card-border/50">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-2.5">
              <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
              <h2 class="text-xs font-mono font-bold uppercase tracking-wider text-muted">
                PROJECT README // LIVE_STREAM_MD
              </h2>
            </div>
            <span class="text-xs text-muted font-mono">Branch: ${project.branch || 'main'}</span>
          </div>

          <article id="readme-container" class="readme-prose bg-card/30 backdrop-blur-xl border border-card-border/60 rounded-3xl p-6 md:p-12 shadow-xl">
            <!-- Rendered via readme.js -->
          </article>
        </div>
      </div>
    `;

    // Handle back button
    const backBtn = document.getElementById('btn-back-to-grid');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.location.hash = '';
      });
    }

    // Handle copy share button
    const shareBtn = document.getElementById('btn-copy-share');
    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          shareBtn.innerHTML = `<span>Copied! ✓</span>`;
          setTimeout(() => {
            shareBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg><span>Share</span>`;
          }, 2000);
        } catch (e) {}
      });
    }

    // Handle Hero Image Fallback
    const heroImg = document.getElementById('detail-hero-img');
    if (heroImg) {
      heroImg.addEventListener('error', () => {
        handleImageFallback(heroImg, project);
      });
    }

    // Trigger README fetch
    const readmeContainer = document.getElementById('readme-container');
    if (readmeContainer && window.ReadmeViewer) {
      window.ReadmeViewer.renderProjectReadme(readmeContainer, project);
    }
  }

  // Refactor Featured Projects on index.html
  function initFeaturedProjects() {
    const featuredGrid = document.getElementById('projects-grid');
    if (!featuredGrid) return;

    // Check if we are on index.html (look for #project-filters or #projects-grid without #projects-grid-view)
    if (document.getElementById('projects-grid-view')) return;

    fetch('./projects.json?v=' + Date.now(), { cache: 'no-store' })
      .then((res) => res.json())
      .then((projects) => {
        allProjects = projects;
        // Take first 3 or those flagged featured: true
        const featured = projects.filter((p) => p.featured).slice(0, 3);
        if (featured.length === 0) return;

        featuredGrid.innerHTML = featured
          .map((project, idx) => {
            const num = String(idx + 1).padStart(2, '0');
            const colorClass = idx === 0 ? 'text-blue-400' : idx === 1 ? 'text-emerald-400' : 'text-orange-400';
            const accentGrad =
              idx === 0
                ? 'from-blue-500/60 to-purple-500/60'
                : idx === 1
                ? 'from-emerald-500/60 to-cyan-500/60'
                : 'from-orange-500/60 to-pink-500/60';
            let catStr = (project.category || []).join(' ').toLowerCase();
            if (catStr.includes('machine learning')) catStr += ' ml';
            if (catStr.includes('data analytics')) catStr += ' analytics';
            if (catStr.includes('deep learning')) catStr += ' deep-learning';

            const techSpans = (project.tech || [])
              .map(
                (t) =>
                  `<span class="bg-background/40 border border-card-border/30 text-foreground/80 px-2.5 py-1 rounded-lg text-[11px] font-semibold backdrop-blur-md">${t}</span>`
              )
              .join('');

            return `
              <div class="project-card group relative bg-card/60 backdrop-blur-2xl border border-card-border/60 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col" data-categories="${catStr}">
                <div class="h-1 w-full bg-gradient-to-r ${accentGrad}"></div>
                <div class="absolute inset-0 bg-gradient-to-br ${accentGrad} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>

                <div class="p-8 flex-1 flex flex-col relative z-10">
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-xs font-black tracking-[0.2em] uppercase ${colorClass}">
                      ${num} / Project
                    </span>
                    <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted">
                      ${project.type === 'college' ? 'College' : 'Personal'}
                    </span>
                  </div>

                  <h3 class="text-xl font-bold text-foreground mb-3 group-hover:text-white transition-colors duration-300 leading-snug">
                    ${project.title}
                  </h3>
                  <p class="text-muted text-sm leading-relaxed mb-6 flex-1">
                    ${project.description}
                  </p>

                  <div class="flex flex-wrap gap-2 mb-6">
                    ${techSpans}
                  </div>

                  <div class="flex items-center justify-between pt-4 border-t border-card-border/40 mt-auto">
                    <a href="projects.html#/${project.slug}" class="text-sm font-bold text-primary hover:underline flex items-center gap-1.5">
                      <span>View README</span>
                      <span class="text-xs">→</span>
                    </a>

                    <a href="https://github.com/${project.githubRepo}" target="_blank" rel="noopener noreferrer" class="text-xs font-bold text-muted hover:text-foreground transition-colors flex items-center gap-1">
                      <span>GitHub</span>
                      <span class="text-[10px]">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            `;
          })
          .join('');

        // Wire up category filter buttons on index.html
        const filterBtns = document.querySelectorAll('#project-filters .filter-btn');
        filterBtns.forEach((btn) => {
          btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            filterBtns.forEach((b) => {
              b.className = 'filter-btn px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 backdrop-blur-md bg-card/50 border border-card-border text-muted hover:text-foreground hover:bg-card';
            });
            btn.className = 'filter-btn px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 backdrop-blur-md bg-primary text-white shadow-md';

            featuredGrid.querySelectorAll('.project-card').forEach((card) => {
              const cats = card.dataset.categories || '';
              if (filter === 'all' || cats.includes(filter)) {
                card.style.display = 'flex';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
              } else {
                card.style.display = 'none';
              }
            });
          });
        });
      })
      .catch((e) => {
        console.warn('Could not load projects.json on index.html:', e);
      });
  }

  // Init Projects Page
  async function initProjectsPage() {
    const gridView = document.getElementById('projects-grid-view');
    if (!gridView) {
      // We are on index.html
      initFeaturedProjects();
      return;
    }

    try {
      const res = await fetch('./projects.json?v=' + Date.now(), { cache: 'no-store' });
      allProjects = await res.json();
    } catch (err) {
      console.error('Failed to load projects.json:', err);
      const grid = document.getElementById('projects-grid');
      if (grid) {
        grid.innerHTML = `
          <div class="col-span-full text-center py-12 text-muted">
            <p>Failed to load projects list. Please check projects.json.</p>
          </div>
        `;
      }
      return;
    }

    // Set up Search Input
    const searchInput = document.getElementById('project-search');
    const clearSearchBtn = document.getElementById('btn-clear-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (clearSearchBtn) {
          clearSearchBtn.classList.toggle('hidden', !searchQuery);
        }
        renderGrid();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.classList.add('hidden');
        renderGrid();
      });
    }

    // Set up Filter Pills
    const filterPills = document.querySelectorAll('.project-filter-pill');
    filterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        activeFilter = pill.dataset.filter || 'all';
        filterPills.forEach((p) => {
          p.classList.remove('bg-primary', 'text-white', 'shadow-lg', 'shadow-primary/30');
          p.classList.add('bg-card/50', 'border', 'border-card-border/60', 'text-muted');
        });
        pill.classList.remove('bg-card/50', 'border', 'border-card-border/60', 'text-muted');
        pill.classList.add('bg-primary', 'text-white', 'shadow-lg', 'shadow-primary/30');
        renderGrid();
      });
    });

    // Set up Sort Select
    const sortSelect = document.getElementById('project-sort');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        activeSort = e.target.value;
        renderGrid();
      });
    }

    // Set up Empty State Reset Button
    const btnResetFilters = document.getElementById('btn-reset-filters');
    if (btnResetFilters) {
      btnResetFilters.addEventListener('click', () => {
        activeFilter = 'all';
        searchQuery = '';
        if (searchInput) searchInput.value = '';
        if (clearSearchBtn) clearSearchBtn.classList.add('hidden');
        filterPills.forEach((p) => {
          const isAll = p.dataset.filter === 'all';
          if (isAll) {
            p.classList.add('bg-primary', 'text-white', 'shadow-lg', 'shadow-primary/30');
            p.classList.remove('bg-card/50', 'text-muted');
          } else {
            p.classList.remove('bg-primary', 'text-white', 'shadow-lg', 'shadow-primary/30');
            p.classList.add('bg-card/50', 'text-muted');
          }
        });
        renderGrid();
      });
    }

    // Initial render & handle routing
    renderGrid();
    handleRouting();
    window.addEventListener('hashchange', handleRouting);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectsPage);
  } else {
    initProjectsPage();
  }
})(window);
