import './style.css'

// M3：作品数据
const works = [
    {
        title:'作品集官网',
        desc:'你正在看的这个网站。Vite 搭建工程，CSS 变量管配色，Grid 管排布卡片墙',
        tags:['HTML','CSS','Vite'],
        link:'https://github.com/longdandan-dev/my-portfolio',
        demo:'https://longdandan-dev.github.io/my-portfolio/',
    },
    {
        title:'待办清单',
        desc:'原生JS写的增删改查，勾选状态存在浏览器刷新不丢',
        tags:['DOM','事件','localStorage'],
        link:'https://github.com/longdandan-dev/js-practice/blob/main/17-待办清单.html',
        demo:'https://longdandan-dev.github.io/js-practice/17-待办清单.html',
    },
    {
        title:'待办清单（Vue 版）',
        desc:'Vue 3 + TypeScript 重写的待办清单：组件化拆分、computed 三栏筛选、localStorage 刷新不丢',      
        tags:['Vue 3', 'TypeScript', '组件化'],
        link:'https://github.com/longdandan-dev/todo-vue',                 
        demo:'https://longdandan-dev.github.io/todo-vue/',
    },
    {
        title:'接口列表页',
        desc:'fetch 拉接口数据，带loading 状态、错误提示和关键词搜索过滤。',
        tags:['fetch','async / await','错误处理'],
        link:'https://github.com/longdandan-dev/js-practice/blob/main/20-接口列表页.html',
        demo:'https://longdandan-dev.github.io/js-practice/20-接口列表页.html',
    },
    {
        title:'布局练习页',
        desc:'导航栏 + 卡片墙 + 两栏内容区，专门练Flex 和Grid 的排布',
        tags:['Flex','Grid','响应式'],
        link:'https://github.com/longdandan-dev/js-practice/blob/main/25-布局练习页.html',
        demo:'https://longdandan-dev.github.io/js-practice/25-布局练习页.html',
    },
    {
        title:'音乐播放器',
        desc:'原生JS写的播放器：播放/暂停、上下曲、三种循环、拖进度条与音量，搜索收藏刷新不丢，坏音频自动跳过（音频为本机脚本合成，无版权问题）',       
        tags:['audio','localStorage','响应式'],
        link:'https://github.com/longdandan-dev/music-player',
        demo:'https://longdandan-dev.github.io/music-player/',
    },
    
    
];


//M3：视图区
function renderWorks(){
const grid = document.querySelector('#works-grid');

// 空状态：数据空了就说人话（说清为什么空 + 下一步去哪），不留一块白
if(works.length === 0){
    grid.innerHTML = `
    <p class="empty-state">
        作品还在整理中 —— 每完成一个项目就会补上来，想先看进度可以去
        <a href="https://github.com/longdandan-dev" target="_blank" rel="noopener">GitHub</a>。
    </p>`;
    return;
}

const html = works.map((work, index)=>{
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
grid.innerHTML = html ;
}

//执行
renderWorks();

// 项目数量和名单都从 works 数据算出来 —— 以后加项目只改数组，这两处自己跟上
document.querySelectorAll('[data-works-count]').forEach((el)=>{
    el.textContent = String(works.length);
});

const worksNames = document.querySelector('[data-works-names]');
if(worksNames){
    worksNames.textContent = works.map((work)=>work.title).join('、');
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
