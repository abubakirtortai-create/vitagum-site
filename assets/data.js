/* ===== VITAGUM — данные сайта (единственный источник правды) =====
   Контакты — из Instagram @vitagum.kz. Цены: в Instagram их нет;
   2 200 ₸ — из брифа (со слов блогера) — СВЕРИТЬ. Состав Organic — liki.uz. */
window.VG_CONFIG = {
  waAlmaty: '77058151377',
  waAstana: '77058151377',
  phones: ['+7 705 815 13 77', '+7 708 358 69 01'],
  instagram: 'https://instagram.com/vitagum.kz',
  postPrice: 1500,
  b2bMin: 100000,
  pixelId: '',          // ID Meta Pixel (из Events Manager). Пусто → пиксель не грузится
};

/* price: null → «по запросу». flavors: [ru, цвет, kk].
   Поля *_kk — казахский текст (проверить носителем языка). */
window.VG_PRODUCTS = [
  {id:'org', cat:'VitaGum', name:'VITAGUM Organic',
   desc:'Жевательные мишки на пектине · натуральные экстракты фруктов · немецкие витамины',
   desc_kk:'Пектиндегі шайнайтын аюшықтар · табиғи жеміс сығындылары · неміс витаминдері',
   price:2200, priceNote:'за пачку', priceNote_kk:'бір пакет', tag:'Хит', tag_kk:'Хит', bg:'#efe6fb', bear:'#d93a3a',
   weight:'150 г', pcs:40, maker:'Soft Vitamin Business, Узбекистан', base:'сахар, сироп глюкозы, цитрусовый пектин, лимонная кислота', storage:'+20…+35 °C, влажность ≤65 %', /* liki.uz */
   flavors:[['Гранатовый сок','#d93a3a','Анар шырыны'],['Черника','#4b3f9e','Қаражидек'],['Чёрный тмин','#3a3a3a','Қара зира'],['Эхинацея','#c45aa8','Эхинацея']]},
  {id:'dtx', cat:'VitaGum', name:'VITAGUM Organic Detox',
   desc:'Мишки линейки Organic в большой пачке', desc_kk:'Organic желісінің аюшықтары, үлкен пакет',
   price:null, priceNote:'цена в WhatsApp', priceNote_kk:'бағасы WhatsApp-та', tag:'Новинка', tag_kk:'Жаңа', bg:'#e6f4e6', bear:'#7cc35a', dots:['#7cc35a','#f08a24']},
  {id:'gel', cat:'VitaGum', name:'VITAGUM Kinder Gel',
   desc:'Витаминно-минеральный гель для детей · апельсиновый вкус', desc_kk:'Балаларға арналған витаминді-минералды гель · апельсин дәмі',
   price:null, priceNote:'цена в WhatsApp', priceNote_kk:'бағасы WhatsApp-та', bg:'#fff0d9', bear:'#f08a24', dots:['#f08a24']},
];

/* Другие товары дистрибьютора — не в каталоге VITAGUM, только ссылкой */
window.VG_EXTRA = { name:'Vostok Shop', note:'Магний, D3+K2 и другие витамины — у нашего дистрибьютора', note_kk:'Магний, D3+K2 және басқа витаминдер — дистрибьюторымызда', text:'Сәлеметсіз бе! Хочу узнать про другие витамины Vostok Shop' };

window.VG_MARQUEE = {
  ru:['Халяль · пектин, без желатина','Курьер в день заказа по Астане и Алматы','Почта по всему Казахстану — 1 500 ₸','Оплата Kaspi по счёту','Дәрілік зат емес'],
  kk:['Халал · пектин, желатинсіз','Астана мен Алматыда курьер тапсырыс күні','Қазақстан бойынша пошта — 1 500 ₸','Kaspi арқылы шот бойынша төлем','Дәрілік зат емес'],
};
