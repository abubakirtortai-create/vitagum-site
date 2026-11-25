/* ===== VITAGUM — скрипт продающей главной (без app.js): подборщик пачек → одно сообщение в WhatsApp.
   UTM → «ref: …» в сообщении, Meta Pixel (VG_CONFIG.pixelId): ViewContent, AddToCart, Contact, Lead. */
(function(){
  const C=window.VG_CONFIG, PK=window.VG_PACKS, L=document.documentElement.lang==='kk'?'kk':'ru';
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const fmt=n=>n.toLocaleString('ru-RU').replace(/[\s  ,]/g,' ')+' ₸';
  const ss={get(k){try{return JSON.parse(sessionStorage.getItem(k))}catch(e){return null}},set(k,v){try{sessionStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
  const ls={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
  const plRu=n=>n%10===1&&n%100!==11?'пачка':[2,3,4].includes(n%10)&&![12,13,14].includes(n%100)?'пачки':'пачек';
  const T={
    ru:{head:'Сәлеметсіз бе! Хочу заказать VITAGUM:',pcs:'шт.',sum:'Сумма',city:'Город',post:'почта с трек-номером',courier:'курьер',pay:'Оплата: Kaspi',
      empty:'Сәлеметсіз бе! Хочу заказать VITAGUM. Подскажите, пожалуйста',other:'Другой город',
      bar0:'Выберите пачки — посчитаем сумму',bar:(n,s)=>`${n} ${plRu(n)} · ${s}`,postNote:p=>`+ почта ${p}`,cityNote:'курьер сегодня'},
    kk:{head:'Сәлеметсіз бе! VITAGUM тапсырыс бергім келеді:',pcs:'дана',sum:'Сомасы',city:'Қала',post:'трек-нөмірмен пошта',courier:'курьер',pay:'Төлем: Kaspi',
      empty:'Сәлеметсіз бе! VITAGUM тапсырыс бергім келеді. Көмектесіп жіберіңізші',other:'Басқа қала',
      bar0:'Пакетті таңдаңыз — соманы есептейміз',bar:(n,s)=>`${n} пакет · ${s}`,postNote:p=>`+ пошта ${p}`,cityNote:'бүгін курьер'}
  }[L];

  // UTM → ref в сообщении
  const q=new URLSearchParams(location.search),u={};
  ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(k=>{if(q.get(k))u[k]=q.get(k)});
  if(Object.keys(u).length)ss.set('vg_utm',u);
  const ref=()=>{const x=ss.get('vg_utm');if(!x)return '';const p=[x.utm_source,x.utm_campaign,x.utm_content].filter(Boolean);return p.length?`\n\nref: ${p.join(' / ')}`:''};

  // Meta Pixel
  const track=(e,p)=>{try{window.fbq&&window.fbq('track',e,p||{})}catch(err){}};
  if(C.pixelId){
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init',C.pixelId);track('PageView');track('ViewContent',{content_name:'VITAGUM landing'});
  }

  let city=ls.get('vg_city'); if(city==='Другой город')city='other';
  const cart={};
  const waNum=()=>city==='Алматы'?C.waAlmaty:C.waAstana;
  const wa=t=>`https://wa.me/${waNum()}?text=${encodeURIComponent(t+ref())}`;
  const total=()=>PK.reduce((s,p)=>s+p.price*(cart[p.id]||0),0);

  // карточки пачек
  const grid=$('#packs');
  if(grid) grid.innerHTML=PK.map(p=>`<article class="pk" style="--c:${p.c};--bg:${p.bg}">
    <div class="pk-img"><img src="${grid.dataset.base}img/${p.img}" alt="VITAGUM ${p.ru[0]}" loading="lazy" width="420" height="840"></div>
    <div class="pk-b"><h3>${p[L][0]}</h3><p>${p[L][1]}</p>
      <div class="pk-row"><b class="pk-price">${fmt(p.price)}</b>
        <div class="qty" data-id="${p.id}"><button type="button" data-d="-1" aria-label="−1">−</button><output aria-live="polite">0</output><button type="button" data-d="1" aria-label="+1">+</button></div></div></div></article>`).join('');

  function msg(){
    const ids=PK.filter(p=>cart[p.id]>0);
    if(!ids.length) return T.empty;
    const post=city==='other'?C.postPrice:0;
    return `${T.head}\n${ids.map((p,i)=>`${i+1}. ${p[L][0]} — ${cart[p.id]} ${T.pcs}`).join('\n')}\n${T.sum}: ${fmt(total())}${post?` + ${fmt(post)} (${T.post})`:''}`
      +`\n${T.city}: ${city==='other'?T.other:city||'—'}${city?` (${city==='other'?T.post:T.courier})`:''}\n${T.pay}`;
  }
  function render(){
    const n=PK.reduce((s,p)=>s+(cart[p.id]||0),0);
    $$('.qty').forEach(el=>{const v=cart[el.dataset.id]||0;el.querySelector('output').textContent=v;el.closest('.pk').classList.toggle('on',v>0)});
    const bar=$('#barTxt');
    if(bar) bar.textContent=n?T.bar(n,fmt(total()))+(city==='other'?' '+T.postNote(fmt(C.postPrice)):city?' · '+T.cityNote:''):T.bar0;
    $$('[data-order]').forEach(a=>a.href=wa(msg()));
    $$('.wa-dyn').forEach(a=>a.href=wa(a.dataset.text||T.empty));
    $$('[data-city]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.city===city)));
    document.body.classList.toggle('has-cart',n>0);
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('.qty button');
    if(b){const id=b.parentNode.dataset.id,d=+b.dataset.d;cart[id]=Math.max(0,(cart[id]||0)+d);
      if(d>0){const p=PK.find(x=>x.id===id);track('AddToCart',{content_ids:[id],content_name:p.ru[0],value:p.price,currency:'KZT'})}
      render();return}
    const c=e.target.closest('[data-city]');
    if(c){city=c.dataset.city;ls.set('vg_city',city);render();return}
    const a=e.target.closest('a[href*="wa.me/"]');
    if(a){if(a.hasAttribute('data-order')&&total()>0)track('Lead',{value:total(),currency:'KZT'});else track('Contact')}
  });
  document.addEventListener('click',e=>{const a=e.target.closest('[data-lang]');if(a)ls.set('vg_lang',a.dataset.lang)},true);

  // таймер «Берекелі Жұма» — до пятницы 00:00 Asia/Almaty (UTC+5); в пятницу — до конца дня
  const tm=$('#fri');
  if(tm){const OFF=5*36e5,DAY=864e5,pad=n=>String(n).padStart(2,'0');
    const tick=()=>{const now=Date.now(),loc=new Date(now+OFF),dow=loc.getUTCDay(),mid=Date.UTC(loc.getUTCFullYear(),loc.getUTCMonth(),loc.getUTCDate());
      const fri=dow===5,target=(fri?mid+DAY:mid+((5-dow+7)%7)*DAY)-OFF;let s=Math.max(0,Math.floor((target-now)/1e3));
      tm.classList.toggle('today',fri);const d=Math.floor(s/86400);s%=86400;
      tm.querySelector('[data-t=d]').textContent=d;tm.querySelector('[data-t=h]').textContent=pad(Math.floor(s/3600));s%=3600;
      tm.querySelector('[data-t=m]').textContent=pad(Math.floor(s/60));tm.querySelector('[data-t=s]').textContent=pad(s%60)};
    tick();setInterval(tick,1000)}

  // мягкое появление блоков
  if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.documentElement.classList.add('anim');
    const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.08});
    $$('.rv').forEach(el=>io.observe(el));
  }
  render();
})();
