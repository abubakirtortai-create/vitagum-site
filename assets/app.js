/* ===== VITAGUM — общий каркас: шапка, бегущая строка, подвал, город, корзина, языки, аналитика =====
   Подключение (после data.js):
     <html lang="ru"> или <html lang="kk"> (казахские страницы лежат в /kk/, ассеты — ../assets/)
     <div id="vg-header" data-active="home|shop|product|info|lp"></div> ... <div id="vg-footer"></div>
     <script src="assets/data.js"></script><script src="assets/app.js"></script>
   API: window.VG = { lang, t(key), tp(product, field), flavName(p,i), fmt, add(id, flavorIndex, n), waLink(text),
                      bear(color,w), prodOf(id), nameOf(key), open(el), close(), toast(text), openCart(), onChange(fn), city, cityLabel(), track(event, params) }
   Аналитика: VG_CONFIG.pixelId → Meta Pixel (PageView, AddToCart, Contact, Lead).
   UTM-метки из адреса сохраняются в sessionStorage и дописываются в каждое сообщение WhatsApp как «ref: …». */
(function(){
  const C = window.VG_CONFIG, P = window.VG_PRODUCTS;
  const LANG = document.documentElement.lang === 'kk' ? 'kk' : 'ru';
  const IN_KK = /\/kk\//.test(location.pathname);
  const $ = s => document.querySelector(s);
  const fmt = n => n.toLocaleString('ru-RU').replace(/[  ,]/g,' ') + ' ₸';
  const store = {get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}}, set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
  const sstore = {get(k,d){try{return JSON.parse(sessionStorage.getItem(k))??d}catch{return d}}, set(k,v){try{sessionStorage.setItem(k,JSON.stringify(v))}catch{}}};

  /* ---------- первый визит на корневую главную → казахская версия ---------- */
  const file = location.pathname.split('/').pop() || 'index.html';
  if(LANG==='ru' && !IN_KK && file==='index.html' && !store.get('vg_lang',null) && !/[?&]lang=ru/.test(location.search)){
    location.replace('kk/index.html'+location.search+location.hash); return;
  }

  /* ---------- словарь ---------- */
  const D = {
    ru:{ nav:[['index.html','главная','home'],['shop.html','магазин','shop'],['product.html','о продукте','product'],['info.html','доставка и FAQ','info']],
      city:'город', cart:'корзина', cartAria:'Корзина', cartAriaN:n=>`Корзина, товаров: ${n}`, menu:'Меню', home:'VITAGUM — главная',
      cityTitle:'Вы здесь?', citySub:'Выберите город — подскажем доставку и нужный WhatsApp',
      cityAst:'Астана', cityAlm:'Алматы', cityOther:'Другой город Казахстана', cityOtherShort:'Другой город',
      courierSmall:'курьер в день заказа', otherSmall:'Шымкент, Сарыағаш, Талдықорған… — почта с трек-номером, 1 500 ₸',
      total:'Итого', close:'Закрыть', less:'Меньше', more:'Больше', remove:'Убрать',
      empty:'Пока пусто 🐻', pickFlavor:'Выбрать вкус',
      delivOther:p=>`включая доставку почтой с трек-номером ${p}`, delivCity:c=>`Курьер по городу ${c} — в день заказа`, delivNone:'Выберите город, чтобы увидеть доставку',
      checkout:'Оформить заказ в WhatsApp →', trust:'Ответим в WhatsApp, проверим наличие и пришлём счёт Kaspi. В регионы — почтой с трек-номером.',
      ask:'Задать вопрос', askText:'Сәлеметсіз бе! Хочу спросить про VITAGUM', hello:'Сәлеметсіз бе!',
      inCart:n=>`${n} — в корзине`, toCheckout:'Оформить', chooseCity:'Выберите город — подскажем доставку',
      msgHead:'Сәлеметсіз бе! Хочу заказать VITAGUM:', pcs:'шт.', msgPost:'Доставка почтой', msgCity:'Город', msgDeliv:'Доставка', msgPostW:'почта с трек-номером', msgCourier:'курьер', msgPay:'Оплата: Kaspi по счёту',
      fHelp:'Помощь', fOrder:'Как заказать', fDeliv:'Доставка и оплата', fReturn:'Возврат и обмен', fInfo:'Информация', fComp:'Состав', fHow:'Как принимать', fFaq:'Частые вопросы', fContact:'Связь',
      fAbout:'VITAGUM — витаминные мишки на пектине. Официальный дистрибьютор в Казахстане — Vostok Shop KZ, магазины в Астане и Алматы.',
      legal:'Дәрілік зат емес. Не является лекарственным средством.', langOther:'ҚАЗ', langOtherAria:'Қазақша нұсқа', priceAsk:'по запросу' },
    kk:{ nav:[['index.html','басты бет','home'],['shop.html','дүкен','shop'],['product.html','өнім туралы','product'],['info.html','жеткізу және FAQ','info']],
      city:'қала', cart:'себет', cartAria:'Себет', cartAriaN:n=>`Себет, тауар саны: ${n}`, menu:'Мәзір', home:'VITAGUM — басты бет',
      cityTitle:'Қай қаладасыз?', citySub:'Қаланы таңдаңыз — жеткізуді және керекті WhatsApp нөмірін көрсетеміз',
      cityAst:'Астана', cityAlm:'Алматы', cityOther:'Қазақстанның басқа қаласы', cityOtherShort:'Басқа қала',
      courierSmall:'тапсырыс күні курьер', otherSmall:'Шымкент, Сарыағаш, Талдықорған… — трек-нөмірмен пошта, 1 500 ₸',
      total:'Барлығы', close:'Жабу', less:'Азайту', more:'Көбейту', remove:'Алып тастау',
      empty:'Әзірге бос 🐻', pickFlavor:'Дәм таңдау',
      delivOther:p=>`трек-нөмірмен пошта жеткізуі қоса алғанда ${p}`, delivCity:c=>`${c} қаласы бойынша курьер — тапсырыс күні`, delivNone:'Жеткізуді көру үшін қаланы таңдаңыз',
      checkout:'WhatsApp арқылы тапсырыс беру →', trust:'WhatsApp-та жауап береміз, бар-жоғын тексеріп, Kaspi шотын жібереміз. Өңірлерге — трек-нөмірмен пошта.',
      ask:'Сұрақ қою', askText:'Сәлеметсіз бе! VITAGUM туралы сұрағым бар еді', hello:'Сәлеметсіз бе!',
      inCart:n=>`${n} — себетте`, toCheckout:'Рәсімдеу', chooseCity:'Қаланы таңдаңыз — жеткізуді айтамыз',
      msgHead:'Сәлеметсіз бе! VITAGUM тапсырыс бергім келеді:', pcs:'дана', msgPost:'Пошта жеткізуі', msgCity:'Қала', msgDeliv:'Жеткізу', msgPostW:'трек-нөмірмен пошта', msgCourier:'курьер', msgPay:'Төлем: Kaspi шоты',
      fHelp:'Көмек', fOrder:'Қалай тапсырыс беру', fDeliv:'Жеткізу және төлем', fReturn:'Қайтару және айырбас', fInfo:'Ақпарат', fComp:'Құрамы', fHow:'Қалай қабылдау', fFaq:'Жиі қойылатын сұрақтар', fContact:'Байланыс',
      fAbout:'VITAGUM — пектиндегі витаминді аюшықтар. Қазақстандағы ресми дистрибьютор — Vostok Shop KZ, Астана мен Алматыдағы дүкендер.',
      legal:'Дәрілік зат емес. Дәрі-дәрмек болып табылмайды.', langOther:'РУС', langOtherAria:'Русская версия', priceAsk:'сұрау бойынша' },
  };
  const T = D[LANG];
  const t = k => T[k];
  const tp = (p, f) => (LANG==='kk' && p[f+'_kk']) || p[f];
  const flavName = (p, i) => (LANG==='kk' && p.flavors[i][2]) || p.flavors[i][0];

  /* ---------- состояние ---------- */
  let cart = store.get('vg_cart2',{}), city = store.get('vg_city',null);
  if(city==='Другой город') city='other';               // миграция со старой версии
  const listeners = [];
  const cityLabel = () => city==='other' ? T.cityOtherShort : city;

  /* ---------- UTM ---------- */
  (function(){const q=new URLSearchParams(location.search);const keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
    const u={};keys.forEach(k=>{if(q.get(k))u[k]=q.get(k)});if(Object.keys(u).length){u.page=file;sstore.set('vg_utm',u)}})();
  function refTag(){const u=sstore.get('vg_utm',null);if(!u)return '';const parts=[u.utm_source,u.utm_campaign,u.utm_content].filter(Boolean);return parts.length?`\n\nref: ${parts.join(' / ')}`:''}

  /* ---------- Meta Pixel ---------- */
  function track(ev, params){try{window.fbq&&window.fbq('track',ev,params||{})}catch{}}
  if(C.pixelId){
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', C.pixelId); track('PageView');
  }

  /* ---------- товары ---------- */
  const prodOf = k => P.find(p=>p.id===String(k).split(':')[0]);
  const nameOf = k => { const p=prodOf(k), i=String(k).split(':')[1]; return p.flavors&&i!=null ? `${p.name} — ${flavName(p,+i)}` : p.name };
  const bearOf = k => { const p=prodOf(k), i=String(k).split(':')[1]; return p.flavors&&i!=null ? p.flavors[i][1] : p.bear };
  const waNum = () => city==='Алматы' ? C.waAlmaty : C.waAstana;
  const waLink = text => `https://wa.me/${waNum()}?text=${encodeURIComponent(text+refTag())}`;
  const bear = (fill, w) => `<svg viewBox="0 0 60 70" ${w?`width="${w}"`:''} aria-hidden="true"><use href="#bear" fill="${fill}"/></svg>`;
  const otherLangUrl = () => (IN_KK ? '../' : 'kk/') + file + location.search + location.hash;

  const WA_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.8-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.4-.3z"/></svg>';
  const LOGO = `<span class="mark">${bear('#e8562a')}</span><span class="wm"><b>VITAGUM<sup>®</sup></b><small>vitamins &amp; minerals</small></span>`;

  function renderShell(){
    document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="bear" viewBox="0 0 60 70">
      <circle cx="14" cy="10" r="8"/><circle cx="46" cy="10" r="8"/><ellipse cx="30" cy="22" rx="18" ry="16"/><ellipse cx="30" cy="50" rx="20" ry="19"/>
      <circle cx="10" cy="40" r="7"/><circle cx="50" cy="40" r="7"/><circle cx="16" cy="64" r="7"/><circle cx="44" cy="64" r="7"/>
      <circle cx="24" cy="20" r="2.2" fill="#2b1a24" opacity=".55"/><circle cx="36" cy="20" r="2.2" fill="#2b1a24" opacity=".55"/>
      <ellipse cx="30" cy="27" rx="4" ry="2.6" fill="#2b1a24" opacity=".35"/><ellipse cx="22" cy="44" rx="5" ry="8" fill="#fff" opacity=".25"/></symbol></svg>`);
    const h = $('#vg-header');
    if(h){
      const act = h.dataset.active, mq = window.VG_MARQUEE[LANG] || window.VG_MARQUEE.ru;
      h.outerHTML = `<div class="marquee" aria-hidden="true"><div>${[...mq,...mq].map(x=>`<span>✦ ${x}</span>`).join('')}</div></div>
      <header><div class="wrap hdr">
        <button class="pill burger" id="burger" aria-label="${T.menu}" aria-expanded="false">☰</button>
        <a class="logo" href="index.html" aria-label="${T.home}">${LOGO}</a>
        <nav class="main" id="mainNav">${T.nav.map(([u,x,k])=>`<a href="${u}" class="${k===act?'on':''}">${x}</a>`).join('')}</nav>
        <div class="hdr-r">
          <a class="pill lang-btn" href="${otherLangUrl()}" data-lang="${IN_KK?'ru':'kk'}" aria-label="${T.langOtherAria}" lang="${IN_KK?'ru':'kk'}">${T.langOther}</a>
          <button class="pill city-btn" id="cityBtn">📍 <span id="cityName">${cityLabel()||T.city}</span></button>
          <button class="pill cart-btn" id="cartBtn" aria-label="${T.cartAria}"><span class="cart-ic" aria-hidden="true">🛒</span><span class="cart-txt">${T.cart}</span> <em id="cartCount">0</em></button>
        </div></div></header>`;
    }
    const f = $('#vg-footer');
    if(f){
      f.outerHTML = `<footer id="contacts"><div class="wrap"><div class="fgrid">
        <div><a class="logo" href="index.html">${LOGO}</a>
          <p style="color:var(--muted);margin-top:10px;max-width:300px">${T.fAbout}</p>
          <p style="margin-top:8px;font-weight:800">${C.phones.map(p=>`<a href="tel:${p.replace(/\s/g,'')}">${p}</a>`).join('<br>')}</p></div>
        <div><h4>${T.fHelp}</h4><ul><li><a href="info.html#order">${T.fOrder}</a></li><li><a href="info.html#delivery">${T.fDeliv}</a></li><li><a href="info.html#return">${T.fReturn}</a></li></ul></div>
        <div><h4>${T.fInfo}</h4><ul><li><a href="product.html#composition">${T.fComp}</a></li><li><a href="product.html#how">${T.fHow}</a></li><li><a href="info.html#faq">${T.fFaq}</a></li></ul></div>
        <div><h4>${T.fContact}</h4><ul><li><a href="#" target="_blank" rel="noopener" class="wa-dyn" data-text="${T.hello}">WhatsApp</a></li><li><a href="${C.instagram}" target="_blank" rel="noopener">Instagram</a></li><li><a href="${otherLangUrl()}" data-lang="${IN_KK?'ru':'kk'}">${IN_KK?'Русская версия':'Қазақша нұсқа'}</a></li></ul></div>
      </div><div class="legal"><span>© 2026 VITAGUM · Vostok Shop KZ · Астана · Алматы · Қазақстан</span><b>${T.legal}</b></div></div></footer>`;
    }
    document.body.insertAdjacentHTML('beforeend', `
      <div class="ov" id="ov"></div>
      <div class="modal" id="cityModal" role="dialog" aria-modal="true" aria-labelledby="cityTitle"><h3 id="cityTitle">${T.cityTitle}</h3><p>${T.citySub}</p>
        <button data-city="Астана">${T.cityAst} <small>${T.courierSmall}</small></button><button data-city="Алматы">${T.cityAlm} <small>${T.courierSmall}</small></button><button data-city="other">${T.cityOther} <small>${T.otherSmall}</small></button></div>
      <aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="${T.cartAria}">
        <div class="dh"><h3>${T.cartAria}</h3><button id="closeCart" aria-label="${T.close}" style="font-size:26px">×</button></div>
        <div class="items" id="items"></div>
        <div class="df"><div class="sum"><span>${T.total}</span><span id="total">0 ₸</span></div><div class="note" id="delivNote"></div>
          <a class="wa" id="checkout" target="_blank" rel="noopener">${WA_ICON} ${T.checkout}</a>
          <p class="trustline">${T.trust}</p></div></aside>
      <div class="toast" id="toast" role="status" aria-live="polite"></div>
      <a class="ask-fab wa-dyn" href="#" target="_blank" rel="noopener" data-text="${T.askText}">${WA_ICON}<span>${T.ask}</span></a>`);
  }

  let lastTotal = 0;
  function renderCart(){
    const ids=Object.keys(cart).filter(id=>cart[id]>0&&prodOf(id)&&prodOf(id).price!=null);
    const count=ids.reduce((s,id)=>s+cart[id],0);
    const sum=ids.reduce((s,id)=>s+cart[id]*prodOf(id).price,0);
    const post = city==='other' ? C.postPrice : 0;
    const total = sum+(ids.length?post:0); lastTotal = total;
    if($('#cartCount')){$('#cartCount').textContent=count;$('#cartBtn').setAttribute('aria-label',T.cartAriaN(count))}
    $('#items').innerHTML=ids.length?ids.map(id=>{const p=prodOf(id);return `
      <div class="it"><span class="sw" style="background:${p.bg}">${bear(bearOf(id))}</span>
        <div><b>${nameOf(id)}</b><span style="color:var(--muted);font-size:14px">${fmt(p.price)}</span></div>
        <span class="qty"><button data-q="${id}" data-d="-1" aria-label="${T.less}">−</button>${cart[id]}<button data-q="${id}" data-d="1" aria-label="${T.more}">+</button></span>
        <button class="rm" data-rm="${id}" aria-label="${T.remove}: ${nameOf(id)}">×</button></div>`}).join('')
      :`<div class="empty">${T.empty}<br><a href="shop.html" class="pill" style="display:inline-block;margin-top:12px;background:var(--brand);color:#fff;border-color:var(--brand)">${T.pickFlavor}</a></div>`;
    $('#total').textContent=fmt(total);
    $('#delivNote').textContent = city==='other' ? T.delivOther(fmt(C.postPrice)) : city ? T.delivCity(city) : T.delivNone;
    const lines=ids.map((id,i)=>`${i+1}. ${nameOf(id)} — ${cart[id]} ${T.pcs} × ${fmt(prodOf(id).price)}`);
    const msg=`${T.msgHead}\n${lines.join('\n')}`
      +`${post&&ids.length?`\n${T.msgPost}: ${fmt(post)}`:''}\n${T.total}: ${fmt(total)}`
      +`\n${T.msgCity}: ${cityLabel()||'—'}\n${T.msgDeliv}: ${city==='other'?T.msgPostW:T.msgCourier}\n${T.msgPay}`;
    const co=$('#checkout'); co.href=waLink(msg); co.setAttribute('aria-disabled',ids.length?'false':'true');
    document.querySelectorAll('.wa-dyn').forEach(a=>a.href=waLink(a.dataset.text||T.hello));
    store.set('vg_cart2',cart);
    listeners.forEach(fn=>fn({count,sum,city}));
  }

  let lastFocus=null, lockY=0, pendingWa=null;
  function lock(){if(document.body.classList.contains('locked'))return;lockY=scrollY;document.body.style.top=`-${lockY}px`;document.body.classList.add('locked')}
  function unlock(){if(!document.body.classList.contains('locked'))return;document.body.classList.remove('locked');document.body.style.top='';scrollTo(0,lockY)}
  function open(el){lastFocus=document.activeElement;close(true);$('#ov').classList.add('show');el.classList.add('show');lock();setTimeout(()=>{const b=el.querySelector('button,a');b&&b.focus()},50)}
  function close(silent){document.querySelectorAll('.ov.show,.modal.show,.drawer.show,.qv.show').forEach(e=>e.classList.remove('show'));unlock();if(!silent&&lastFocus&&lastFocus.focus)lastFocus.focus()}
  function toast(x,cta){const e=$('#toast');e.innerHTML=`<span>${x}</span>`+(cta?`<button data-opencart>${cta}</button>`:'');e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2600)}
  function setCity(c){city=c;store.set('vg_city',c);if($('#cityName'))$('#cityName').textContent=cityLabel();close(true);renderCart();
    if(pendingWa){const href=pendingWa.replace(/wa\.me\/\d+/,'wa.me/'+waNum());pendingWa=null;track('Contact');window.open(href,'_blank','noopener')}}
  function add(id, fi, n){const p=prodOf(id);if(!p||p.price==null)return;const k=p.flavors?`${p.id}:${fi||0}`:p.id;cart[k]=(cart[k]||0)+(n||1);renderCart();
    track('AddToCart',{content_ids:[k],content_name:nameOf(k),value:p.price*(n||1),currency:'KZT'});
    toast(T.inCart(nameOf(k)),T.toCheckout);const b=$('#cartCount');if(b){b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump')}}

  // заказ без города → сначала город; клики по WhatsApp → события пикселя
  document.addEventListener('click',e=>{const a=e.target.closest('a[href*="wa.me/"]');if(!a)return;
    if(!city){e.preventDefault();e.stopPropagation();pendingWa=a.href;open($('#cityModal'));toast(T.chooseCity);return}
    if(a.id==='checkout') track('Lead',{value:lastTotal,currency:'KZT'}); else track('Contact');},true);
  document.addEventListener('click',e=>{const a=e.target.closest('[data-lang]');if(a)store.set('vg_lang',a.dataset.lang)},true);

  document.addEventListener('click',e=>{
    const x=e.target.closest('[data-q],[data-rm],[data-city],[data-opencart],#cartBtn,#closeCart,#ov,#cityBtn,#burger');
    if(!x) return;
    if(x.dataset.rm){delete cart[x.dataset.rm];renderCart()}
    else if(x.hasAttribute('data-opencart')){$('#toast').classList.remove('on');open($('#drawer'))}
    else if(x.dataset.q){cart[x.dataset.q]=Math.max(0,(cart[x.dataset.q]||0)+ +x.dataset.d);renderCart()}
    else if(x.dataset.city) setCity(x.dataset.city);
    else if(x.id==='cartBtn') open($('#drawer'));
    else if(x.id==='cityBtn') open($('#cityModal'));
    else if(x.id==='burger'){const n=$('#mainNav');const o=n.classList.toggle('open');x.setAttribute('aria-expanded',o)}
    else close();
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});

  if(!store.get('vg_lang',null)) store.set('vg_lang',LANG);
  renderShell(); renderCart();
  let lastY=scrollY;addEventListener('scroll',()=>{if(document.body.classList.contains('locked'))return;const y=scrollY,h=document.querySelector('header');if(!h)return;
    if(innerWidth<=900&&y>lastY+6&&y>140)h.classList.add('hide');else if(y<lastY-6||y<140)h.classList.remove('hide');lastY=y},{passive:true});
  if(!city) setTimeout(()=>{if(!city&&!document.querySelector('.show'))open($('#cityModal'))},4000);

  window.VG = { lang:LANG, t, tp, flavName, fmt, add, toast, open, close, waNum, waLink, bear, prodOf, nameOf, track, cityLabel,
    openCart:()=>open($('#drawer')), onChange:fn=>{listeners.push(fn)}, get city(){return city} };
})();
