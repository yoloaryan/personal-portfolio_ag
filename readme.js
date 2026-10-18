/**
 * readme.js — GitHub README Live Fetcher, Markdown Parser & Syntax Highlighter
 * Aryan Gupta Portfolio
 */

(function (window) {
  'use strict';

  function rewriteGitHubContent(html, owner, repo, branch = 'main') {
    const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}`;
    const blobBase = `https://github.com/${owner}/${repo}/blob/${branch}`;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Rewrite relative image URLs
    doc.querySelectorAll('img').forEach((img) => {
      let src = img.getAttribute('src');
      if (
        src &&
        !src.startsWith('http://') &&
        !src.startsWith('https://') &&
        !src.startsWith('data:') &&
        !src.startsWith('//')
      ) {
        src = src.replace(/^\.\//, '').replace(/^\//, '');
        img.src = `${rawBase}/${src}`;
      }
      img.loading = 'lazy';
      img.classList.add('readme-img');
      img.onerror = () => {
        img.style.display = 'none';
      };
    });

    // Rewrite relative links and force external new tab
    doc.querySelectorAll('a').forEach((a) => {
      let href = a.getAttribute('href');
      if (
        href &&
        !href.startsWith('http://') &&
        !href.startsWith('https://') &&
        !href.startsWith('#') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('javascript:')
      ) {
        href = href.replace(/^\.\//, '').replace(/^\//, '');
        a.href = `${blobBase}/${href}`;
      }
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });

    return doc.body.innerHTML;
  }

  function addCopyButtonToCodeBlock(codeEl) {
    const pre = codeEl.closest('pre');
    if (!pre || pre.querySelector('.code-copy-btn')) return;

    pre.style.position = 'relative';
    const btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.type = 'button';
    btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span>Copy</span>`;
    btn.setAttribute('aria-label', 'Copy code to clipboard');

    btn.addEventListener('click', async () => {
      const codeText = codeEl.innerText;
      try {
        await navigator.clipboard.writeText(codeText);
        btn.classList.add('copied');
        btn.innerHTML = `<span>Copied! ✓</span>`;
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span>Copy</span>`;
        }, 2000);
      } catch (err) {
        btn.textContent = 'Copied';
      }
    });

    pre.appendChild(btn);
  }

  async function fetchReadme(githubRepo, defaultBranch = 'main') {
    if (!githubRepo || !githubRepo.includes('/')) {
      throw new Error('Invalid GitHub repository format');
    }

    const [owner, repo] = githubRepo.split('/');
    const cacheKey = `ag_readme_${owner}_${repo}`;

    // Check sessionStorage cache
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        sessionStorage.removeItem(cacheKey);
      }
    }

    const branches = [defaultBranch, 'main', 'master'].filter(
      (v, i, a) => a.indexOf(v) === i
    );
    let markdown = null;
    let chosenBranch = defaultBranch;

    for (const b of branches) {
      try {
        const url = `https://raw.githubusercontent.com/${owner}/${repo}/${b}/README.md`;
        const res = await fetch(url);
        if (res.ok) {
          markdown = await res.text();
          chosenBranch = b;
          break;
        }
      } catch (e) {}
    }

    // Fallback: GitHub REST API
    if (!markdown) {
      try {
        const apiRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/readme`,
          {
            headers: { Accept: 'application/vnd.github.raw' },
          }
        );
        if (apiRes.ok) {
          markdown = await apiRes.text();
        }
      } catch (e) {}
    }

    if (!markdown) {
      throw new Error(`README not found for ${githubRepo}`);
    }

    const payload = { markdown, owner, repo, branch: chosenBranch };
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(payload));
    } catch (e) {}

    return payload;
  }

  async function renderProjectReadme(container, project) {
    if (!container) return;

    // Animated Skeleton Loader
    container.innerHTML = `
      <div class="readme-skeleton space-y-4 animate-pulse">
        <div class="h-8 bg-card-border/50 rounded-lg w-1/3"></div>
        <div class="h-4 bg-card-border/40 rounded w-full"></div>
        <div class="h-4 bg-card-border/40 rounded w-5/6"></div>
        <div class="h-4 bg-card-border/40 rounded w-4/6"></div>
        <div class="h-36 bg-card-border/30 rounded-2xl w-full my-6"></div>
        <div class="h-6 bg-card-border/50 rounded-lg w-1/4"></div>
        <div class="h-4 bg-card-border/40 rounded w-11/12"></div>
        <div class="h-4 bg-card-border/40 rounded w-3/4"></div>
      </div>
    `;

    try {
      const { markdown, owner, repo, branch } = await fetchReadme(
        project.githubRepo,
        project.branch || 'main'
      );

      // Configure marked
      if (typeof window.marked !== 'undefined') {
        window.marked.setOptions({
          gfm: true,
          breaks: true,
        });
      }

      const rawHtml =
        typeof window.marked !== 'undefined'
          ? window.marked.parse(markdown)
          : `<pre>${markdown}</pre>`;

      // Sanitize
      const sanitized =
        typeof window.DOMPurify !== 'undefined'
          ? window.DOMPurify.sanitize(rawHtml, {
              ADD_ATTR: ['target', 'rel', 'loading', 'align'],
            })
          : rawHtml;

      // Rewrite relative URLs
      const finalHtml = rewriteGitHubContent(sanitized, owner, repo, branch);
      container.innerHTML = finalHtml;

      // Syntax highlight
      if (typeof window.hljs !== 'undefined') {
        container.querySelectorAll('pre code').forEach((codeBlock) => {
          window.hljs.highlightElement(codeBlock);
          addCopyButtonToCodeBlock(codeBlock);
        });
      }
    } catch (err) {
      console.warn('Could not load live README:', err);
      container.innerHTML = `
        <div class="p-8 md:p-12 rounded-3xl border border-card-border/60 bg-card/40 backdrop-blur-xl text-center max-w-xl mx-auto my-8">
          <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-2xl">
            📄
          </div>
          <h3 class="text-xl font-bold text-foreground mb-2">README Unavailable Live</h3>
          <p class="text-sm text-muted leading-relaxed mb-6">
            Unable to stream README.md directly from GitHub for <code>${project.githubRepo}</code>. The repository may be private, initializing, or subject to rate limits.
          </p>
          <div class="flex items-center justify-center gap-3">
            <a href="https://github.com/${project.githubRepo}" target="_blank" rel="noopener noreferrer" class="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
              <span>View Repository on GitHub</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      `;
    }
  }

  // Export functions to window
  window.ReadmeViewer = {
    fetchReadme,
    renderProjectReadme,
  };
})(window);
