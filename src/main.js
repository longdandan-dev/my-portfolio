import './style.css'

// 作品数据：主项目用于求职展示；练习页单独分组，避免把练习和完整项目混为一谈。
// 排序口径：主项目按技术复杂度从高到低；练习页按完成时间从新到旧。
const works = [
    {
        kind:'featured',
        title:'后台数据看板（Vue 3 + TypeScript）',
        desc:'Vue 3 + TypeScript 写的后台管理系统：表格分页与搜索筛选、新增/编辑弹窗与表单校验、删除与批量删（乐观更新）、假登录与路由守卫、数据概览（统计卡 + 纯 CSS 柱状图）',
        tags:['Vue Router','Element Plus','Pinia'],
        link:'https://github.com/longdandan-dev/admin-dashboard',
        demo:'https://longdandan-dev.github.io/admin-dashboard/',
    },
    {
        kind:'featured',
        title:'音乐播放器（Vue 版）',
        desc:'用 Vue 3 + TypeScript 重写的播放器：Pinia 管状态、axios 加拦截器拉接口（加载/错误/空三态齐全），搜索与收藏刷新不丢，三档适配',
        tags:['Vue 3','Pinia','TypeScript'],
        link:'https://github.com/longdandan-dev/music-player-vue',
        demo:'https://longdandan-dev.github.io/music-player-vue/',
    },
    {
        kind:'featured',
        title:'待办清单（Vue 版）',
        desc:'Vue 3 + TypeScript 重写的待办清单：组件化拆分、computed 三栏筛选、localStorage 刷新不丢',
        tags:['Vue 3', 'TypeScript', '组件化'],
        link:'https://github.com/longdandan-dev/todo-vue',
        demo:'https://longdandan-dev.github.io/todo-vue/',
    },
    {
        kind:'featured',
        title:'作品集官网',
        desc:'当前网站。Vite 搭建工程，页面配色、字号、间距与动效统一使用设计令牌；作品卡片由 JavaScript 数据驱动渲染，并完成响应式、键盘访问和子路径部署。',
        tags:['HTML','CSS','Vite'],
        link:'https://github.com/longdandan-dev/my-portfolio',
        demo:'https://longdandan-dev.github.io/my-portfolio/',
    },
    {
        kind:'practice',
        title:'音乐播放器（原生 JS 版）',
        desc:'原生JS写的播放器：播放/暂停、上下曲、三种循环、拖进度条与音量，搜索收藏刷新不丢，坏音频自动跳过（音频为本机脚本合成，无版权问题）',
        tags:['audio','localStorage','响应式'],
        link:'https://github.com/longdandan-dev/music-player',
        demo:'https://longdandan-dev.github.io/music-player/',
    },
    {
        kind:'practice',
        title:'待办清单',
        desc:'原生JS写的增删改查，勾选状态存在浏览器刷新不丢',
        tags:['DOM','事件','localStorage'],
        link:'https://github.com/longdandan-dev/js-practice/blob/main/todo/index.html',
        demo:'https://longdandan-dev.github.io/js-practice/todo/',
    },
    {
        kind:'practice',
        title:'接口列表页',
        desc:'fetch 拉接口数据，带 loading 状态、错误提示和关键词搜索过滤。',
        tags:['fetch','async / await','错误处理'],
        link:'https://github.com/longdandan-dev/js-practice/blob/main/20-接口列表页.html',
        demo:'https://longdandan-dev.github.io/js-practice/20-接口列表页.html',
    },
    {
        kind:'practice',
        title:'布局练习页',
        desc:'导航栏 + 卡片墙 + 两栏内容区，专门练 Flex 和 Grid 的排布',
        tags:['Flex','Grid','响应式'],
        link:'https://github.com/longdandan-dev/js-practice/blob/main/25-布局练习页.html',
        demo:'https://longdandan-dev.github.io/js-practice/25-布局练习页.html',
    },
];


const featuredWorks = works.filter((work)=>work.kind === 'featured');
const practiceWorks = works.filter((work)=>work.kind === 'practice');

function renderCards(grid, items){
    if(!grid) return;

    if(items.length === 0){
        grid.innerHTML = `
        <p class="empty-state">
            作品还在整理中 —— 想先看进度可以去
            <a href="https://github.com/longdandan-dev" target="_blank" rel="noopener">GitHub</a>。
        </p>`;
        return;
    }

    grid.innerHTML = items.map((work, index)=>{
    return `
    <article class="card">
        <span class="card-index">${String(index + 1).padStart(2, '0')}</span>
        <h3 class="card-title">${work.title}</h3>
        <p class="card-desc">${work.desc}</p>
        <ul class="tag-list">
            ${work.tags.map((tag)=>`<li class="tag">${tag}</li>`).join('')}
        </ul>
        <div class="card-action">
        <a class="btn btn-primary btn-sm" href="${work.demo}" target="_blank" rel="noopener">在线预览</a>
        <a class="btn btn-ghost btn-sm" href="${work.link}" target="_blank" rel="noopener">看源码</a></div>
    </article>
    `;
    }).join('');
}

//执行
renderCards(document.querySelector('#works-grid'), featuredWorks);
renderCards(document.querySelector('#practice-grid'), practiceWorks);

// 项目数量和名单都从 works 数据算出来 —— 以后加项目只改数组，这两处自己跟上
document.querySelectorAll('[data-works-count]').forEach((el)=>{
    el.textContent = String(featuredWorks.length);
});
document.querySelectorAll('[data-practice-count]').forEach((el)=>{
    el.textContent = String(practiceWorks.length);
});

const worksNames = document.querySelector('[data-works-names]');
if(worksNames){
    worksNames.textContent = featuredWorks.map((work)=>work.title).join('、');
}

// 当前态：滚到哪个区块，导航就点亮哪一项（用 aria-current 表达，读屏也听得懂）
const navLinks = [...document.querySelectorAll('.nav-list a')];
const sections = navLinks
    .map((link)=>document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

if('IntersectionObserver' in window && sections.length){
    const observer = new IntersectionObserver((entries)=>{
        entries.forEach((entry)=>{
            if(!entry.isIntersecting) return;
            navLinks.forEach((link)=>{
                const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
                if(isCurrent) link.setAttribute('aria-current', 'true');
                else link.removeAttribute('aria-current');
            });
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach((section)=>observer.observe(section));
}

// 页头：往下滚之后浮起来一点，和内容分层
const header = document.querySelector('.site-header');

function syncHeader(){
    header.classList.toggle('is-scrolled', window.scrollY > 8);
}

syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });
