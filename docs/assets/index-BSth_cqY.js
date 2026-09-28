(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[{title:`作品集官网`,desc:`你正在看的这个网站。Vite 搭建工程，CSS 变量管配色，Grid 管排布卡片墙`,tags:[`HTML`,`CSS`,`Vite`],link:`https://github.com/longdandan-dev/my-portfolio`,demo:`https://longdandan-dev.github.io/my-portfolio/`},{title:`待办清单`,desc:`原生JS写的增删改查，勾选状态存在浏览器刷新不丢`,tags:[`DOM`,`事件`,`localStorage`],link:`https://github.com/longdandan-dev/js-practice/blob/main/17-待办清单.html`,demo:`https://longdandan-dev.github.io/js-practice/17-待办清单.html`},{title:`接口列表页`,desc:`fetch 拉接口数据，带loading 状态、错误提示和关键词搜索过滤。`,tags:[`fetch`,`async / await`,`错误处理`],link:`https://github.com/longdandan-dev/js-practice/blob/main/20-接口列表页.html`,demo:`https://longdandan-dev.github.io/js-practice/20-接口列表页.html`},{title:`布局练习页`,desc:`导航栏 + 卡片墙 + 两栏内容区，专门练Flex 和Grid 的排布`,tags:[`Flex`,`Grid`,`响应式`],link:`https://github.com/longdandan-dev/js-practice/blob/main/25-布局练习页.html`,demo:`https://longdandan-dev.github.io/js-practice/25-布局练习页.html`}];function t(){let t=document.querySelector(`#works-grid`);if(e.length===0){t.innerHTML=`
    <p class="empty-state">
        作品还在整理中 —— 每完成一个项目就会补上来，想先看进度可以去
        <a href="https://github.com/longdandan-dev" target="_blank" rel="noopener">GitHub</a>。
    </p>`;return}t.innerHTML=e.map((e,t)=>`
    <article class="card">
        <span class="card-index">${String(t+1).padStart(2,`0`)}</span>
        <h3 class="card-title">${e.title}</h3>
        <p class="card-desc">${e.desc}</p>
        <ul class="tag-list">
            ${e.tags.map(e=>`<li class="tag">${e}</li>`).join(``)}
        </ul>
        <div class="card-action">
        <a class="btn btn-primary btn-sm" href="${e.demo}" target="_blank" rel="noopener">在线预览</a>
        <a class="btn btn-ghost btn-sm" href="${e.link}" target="_blank" rel="noopener">看源码</a></div>
    </article>
    `).join(``)}t();var n=[...document.querySelectorAll(`.nav-list a`)],r=n.map(e=>document.querySelector(e.getAttribute(`href`))).filter(Boolean);if(`IntersectionObserver`in window&&r.length){let e=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&n.forEach(t=>{t.getAttribute(`href`)===`#${e.target.id}`?t.setAttribute(`aria-current`,`true`):t.removeAttribute(`aria-current`)})})},{rootMargin:`-40% 0px -55% 0px`});r.forEach(t=>e.observe(t))}var i=document.querySelector(`.site-header`);function a(){i.classList.toggle(`is-scrolled`,window.scrollY>8)}a(),window.addEventListener(`scroll`,a,{passive:!0});