/* All visual state comes from GSAP timeline time. No event-history-dependent UI. */
(() => {
  'use strict';
  const W = 1920, H = 1080, DUR = 36;
  const $ = s => document.querySelector(s);
  const all = s => [...document.querySelectorAll(s)];
  const params = new URLSearchParams(location.search);
  const embedded = params.has('embed'), clean = params.has('clean'), debug = params.has('debug');
  const prototype = params.has('prototype');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const forced = matchMedia('(forced-colors: active)');
  const stage = $('#stage'), world = $('#world'), hero = $('#hero-plane');
  const gallery = $('#gallery-plane'), planner = $('#planner-plane');
  const photo = $('[data-card="1"] .stay-card__image img');
  const cardImageParent = photo.parentElement;
  const galleryImageParent = $('.stay-modal__gallery figure img').parentElement;
  const galleryOriginal = $('.stay-modal__gallery figure img');
  galleryOriginal.remove();
  const photoStyle = photo.getAttribute('style') || '';
  const shared = $('#shared-photo');
  const heroTitle = $('.hero__title'), heroContent = $('.hero__content');
  const heroLines = all('.hero__title-line');
  heroLines.forEach(line => {
    const words = line.textContent.trim().split(' ');
    line.innerHTML = words.map(word => `<span class="word-mask"><span class="film-word">${word}</span></span>`).join(' ');
  });
  $('[data-card="1"] .stay-card').dataset.selected = 'true';
  let scale = 1, ready = false, seeking = false, lastState = '', previousParent = cardImageParent;
  let photoSource = '';
  let blurAmount = '';
  function fit() {
    scale = Math.min(innerWidth / W, innerHeight / H);
    stage.style.transform = `translate(-50%,-50%) scale(${scale})`;
  }
  fit(); addEventListener('resize', fit);
  const stageRect = stage.getBoundingClientRect();
  function rect(el) {
    const r = el.getBoundingClientRect();
    return { x:(r.left-stageRect.left)/scale, y:(r.top-stageRect.top)/scale, w:r.width/scale, h:r.height/scale };
  }
  const cardRect = rect($('[data-card="1"] .stay-card__image'));
  const galleryRect = rect($('.stay-modal__gallery figure'));
  const plannerRect = rect(planner);
  const localRect = el => {
    const r = rect(el);
    return { x:r.x-plannerRect.x, y:r.y-plannerRect.y, w:r.w, h:r.h };
  };
  const inputs = {
    arrival: $('#planner-plane [name="checkIn"]'), departure: $('#planner-plane [name="checkOut"]'),
    adults: $('#planner-plane [name="adults"]'), area: $('#planner-plane [name="area"]'), property: $('#planner-plane [name="property"]'),
  };
  const arrivalRect = localRect(inputs.arrival), departureRect = localRect(inputs.departure);
  const continueRect = localRect($('.booking-actions .primary-button'));
  const backRect = localRect($('.booking-back'));
  const thumbRect = rect($('[aria-label="View image 2"]'));
  const planRect = rect($('.stay-modal__action .primary-button'));
  const entryRect = rect($('#hero-plane .desktop-nav a[href="#stays"]'));
  const CAM = { s:1, fx:960, fy:540 };
  const HP = { inset:0, size:184, x:160, y:380, support:0, second:0, a:1 };
  const brand = {scale:1};
  const RELAY = {x:0,y:0,s:1,r:0,ink:1,typeY:0};
  const ENTRY = {x:704,y:112,s:1.12,heading:0,headingY:48,sides:0,sideY:96};
  const PL = { x:2080, y:148, s:1, a:1 };
  const F = { x:1920, a:1 };
  const G = { chrome:0, title:0 };
  const IMG = { x:0, y:0, w:0, h:0, r:12, rot:0, shadow:0, crop:1.035 };
  const TY = { hinge:0, hingeX:64, revision:0, revisionY:128 };
  const CUR = { x:0, y:0, a:0, s:1, ring:0, ringS:.54 };
  const range = { length:0, a:0 };
  const openingWords = all('.hero__title-line:first-child .film-word').map(el => ({el, y:48, a:0}));
  const secondWords = all('.hero__title-line:last-child .film-word').map(el => ({el, y:48, a:0}));
  const tl = gsap.timeline({ paused:true, defaults:{ ease:'power4.out' }, onUpdate:()=>{
    render(tl.time());
    if (prototype && !seeking && !tl.paused() && tl.time() >= 16.7) tl.play(6.7);
  }, onComplete:()=>{ if(!clean&&!seeking) tl.play(prototype ? 6.7 : 0); } });
  window.tl = tl;
  // A single shared camera. Components and cursor targets use world-space bounds.
  const shot = (at, dur, s, fx=960, fy=540) => tl.to(CAM,{s,fx,fy,duration:dur,ease:'power3.inOut'},at);
  const screen = (r, cam={s:1,fx:960,fy:540}, panel=null) => {
    const x = panel ? panel.x+(r.x+r.w/2)*panel.s : r.x+r.w/2;
    const y = panel ? panel.y+(r.y+r.h/2)*panel.s : r.y+r.h/2;
    return {x:960+(x-cam.fx)*cam.s-4,y:540+(y-cam.fy)*cam.s-4};
  };
  function pointer(at, duration, point, show=true) {
    if(show) tl.to(CUR,{a:1,duration:.12},at);
    tl.to(CUR,{x:point.x,y:point.y,duration,ease:'power2.inOut'},at);
  }
  function contact(at, ring=true) {
    tl.to(CUR,{s:.88,duration:.08,ease:'power2.in'},at);
    tl.to(CUR,{s:1,duration:.16,ease:'power2.out'},at+.08);
    if(ring){tl.set(CUR,{ring:.65,ringS:.54},at+.04);tl.to(CUR,{ring:0,ringS:1,duration:.3,ease:'power2.out'},at+.04);}
  }
  const hidePointer = at => tl.to(CUR,{a:0,duration:.15},at);
  // Beat 1. A photographic aperture and a masked word rise.
  tl.to(HP,{inset:1,duration:1.1,ease:'power3.out'},0);
  openingWords.forEach((w,i)=>tl.to(w,{y:0,a:1,duration:.72},.18+i*.075));
  // Beat 2. The same type settles into the actual hero composition.
  tl.to(HP,{inset:2,size:144,x:64,y:270,duration:1.0,ease:'power3.inOut'},2.55);
  secondWords.forEach((w,i)=>tl.to(w,{y:0,a:1,duration:.68},3.05+i*.07));
  tl.to(HP,{support:1,duration:.6},3.6);
  tl.set(CUR, {...screen(entryRect),a:0},5.0);
  pointer(5.02,.4,screen(entryRect)); contact(5.5,false); hidePointer(5.72);
  // Beat 3. Two distinct photographs relay attention before the collection settles.
  tl.to(RELAY,{ink:0,typeY:-64,duration:.48,ease:'power2.inOut'},5.54);
  tl.to(RELAY,{x:-256,y:304,s:416/1080,r:32,duration:.94,ease:'power3.inOut'},5.56);
  tl.to(RELAY,{x:-960,duration:.62,ease:'power3.inOut'},6.22);
  tl.to(ENTRY,{x:0,y:0,s:1,duration:1.18,ease:'power3.inOut'},5.64);
  tl.to(ENTRY,{heading:1,headingY:0,duration:.7,ease:'power3.out'},5.96);
  tl.to(ENTRY,{sides:.65,sideY:24,duration:.76,ease:'power3.out'},6.12);
  shot(6.88,.72,1.45,960,612);
  const cardCam = {s:1.45,fx:960,fy:612};
  const cardTarget = screen({...cardRect,y:cardRect.y+cardRect.h*.1,h:cardRect.h*.6},cardCam);
  tl.set(CUR,{x:cardTarget.x+120,y:cardTarget.y+96,a:0},7.66);
  pointer(7.68,.32,cardTarget); contact(8.05); hidePointer(8.28);
  const startRect = {x:960+(cardRect.x-cardCam.fx)*cardCam.s,y:540+(cardRect.y-cardCam.fy)*cardCam.s,w:cardRect.w*cardCam.s,h:cardRect.h*cardCam.s};
  tl.set(IMG,{...startRect,r:12*1.45},8.18);
  tl.to(IMG,{y:startRect.y-16,rot:-2.2,shadow:.24,duration:.22,ease:'power2.out'},8.18);
  tl.to(IMG,{x:0,y:0,w:1920,h:1080,r:0,rot:0,crop:1,shadow:0,duration:.9,ease:'power3.inOut'},8.4);
  tl.set(CAM,{s:1,fx:960,fy:540},9.3);
  tl.to(IMG,{x:galleryRect.x,y:galleryRect.y,w:galleryRect.w,h:galleryRect.h,r:20.4,duration:.72,ease:'power4.out'},9.42);
  tl.to(G,{chrome:1,duration:.65},9.52);
  tl.to(G,{title:1,duration:.35},9.84);
  // Beat 4. Use the real second-image thumbnail, then the real planning action.
  tl.set(CUR,{x:thumbRect.x+thumbRect.w/2+80,y:thumbRect.y+thumbRect.h/2-88,a:0},10.36);
  pointer(10.38,.48,screen(thumbRect)); contact(10.96); hidePointer(11.24);
  const planCam={s:1.5,fx:1175,fy:642};
  shot(12.2,.72,planCam.s,planCam.fx,planCam.fy);
  const planPoint=screen(planRect,planCam);
  tl.set(CUR,{x:planPoint.x-96,y:planPoint.y-48,a:0},12.64);
  pointer(12.7,.48,planPoint); contact(13.28); hidePointer(13.58);
  shot(13.7,.8,1,960,540);
  // Beat 5. The arriving panel brings one forest type hinge.
  tl.to(PL,{x:800,y:148,duration:.92,ease:'power4.out'},13.6);
  tl.to(F,{x:0,duration:.92,ease:'power3.inOut'},14.0);
  tl.to(TY,{hinge:1,hingeX:0,duration:.75},14.45);
  tl.to(TY,{hinge:0,hingeX:-48,duration:.4,ease:'power2.in'},16.15);
  tl.to(PL,{x:400,y:88,duration:.82,ease:'power3.inOut'},16.55);
  tl.to(F,{a:0,duration:.6},16.75);
  shot(16.65,.85,1.25,960,480);
  // Beats 6–8. Source date fields, supported preselection, Back, and departure edit.
  const wideCam={s:1.25,fx:960,fy:480}, dateCam={s:2,fx:1136,fy:550};
  const workingPanel={x:400,y:88,s:1};
  function dayCell(field,day){
    const column=day%7,row=Math.floor(day/7);
    return {x:field.x+16+column*(288/7),y:field.y+field.h+8+92+row*36,w:288/7,h:36};
  }
  shot(17.45,.7,dateCam.s,dateCam.fx,dateCam.fy);
  const arrivalPoint=screen({...arrivalRect,x:arrivalRect.x+arrivalRect.w-40,w:32},dateCam,workingPanel);
  tl.set(CUR,{x:arrivalPoint.x-96,y:arrivalPoint.y-64,a:0},18.17);
  pointer(18.2,.25,arrivalPoint);contact(18.47,false);
  pointer(18.56,.32,screen(dayCell(arrivalRect,9),dateCam,workingPanel));contact(18.96);
  pointer(19.06,.35,screen({...departureRect,x:departureRect.x+departureRect.w-40,w:32},dateCam,workingPanel));contact(19.44,false);
  pointer(19.5,.24,screen(dayCell(departureRect,12),dateCam,workingPanel));contact(19.79);
  tl.to(range,{length:96,a:.65,duration:.32,ease:'power2.out'},19.84);
  hidePointer(20.12);shot(20.1,.7,wideCam.s,wideCam.fx,wideCam.fy);
  const nextPoint=screen(continueRect,wideCam,workingPanel);
  tl.set(CUR,{x:nextPoint.x-96,y:nextPoint.y-64,a:0},21.23);
  pointer(21.25,.45,nextPoint);contact(21.85,false);hidePointer(22.15);
  // Tirta and Ubud already persist. No duplicate click on a selected control.
  shot(22.12,.65,1.25,944,480);
  const stayCam={s:1.25,fx:944,fy:480};
  const backPoint=screen(backRect,stayCam,workingPanel);
  tl.set(CUR,{x:backPoint.x+72,y:backPoint.y-64,a:0},24.85);
  pointer(24.88,.42,backPoint);contact(25.45,false);hidePointer(25.68);
  tl.to(PL,{y:216,duration:.55,ease:'power3.inOut'},25.7);
  shot(25.7,.55,1,960,540);
  tl.to(TY,{revision:1,revisionY:0,duration:.58},26.15);
  tl.to(TY,{revision:0,revisionY:-112,duration:.38,ease:'power2.in'},27.0);
  tl.to(PL,{y:88,duration:.65,ease:'power3.inOut'},27.22);
  shot(27.25,.65,dateCam.s,dateCam.fx,dateCam.fy);
  const editPoint=screen({...departureRect,x:departureRect.x+departureRect.w-40,w:32},dateCam,workingPanel);
  tl.set(CUR,{x:editPoint.x-80,y:editPoint.y-48,a:0},27.8);
  pointer(27.82,.34,editPoint);contact(28.18,false);
  pointer(28.25,.24,screen(dayCell(departureRect,14),dateCam,workingPanel));contact(28.5);
  tl.to(range,{length:100,a:.9,duration:.28},28.55);
  hidePointer(28.82);shot(29,.6,wideCam.s,wideCam.fx,wideCam.fy);
  // Beat 9. Return to the same source hero, calm hold, then match opening geometry.
  tl.to(PL,{x:2080,y:148,s:.85,duration:.95,ease:'power3.inOut'},31.15);
  shot(31.05,.9,1,960,540);
  tl.set(HP,{a:0},30);
  tl.set(RELAY,{x:0,y:0,s:1,r:0,ink:1,typeY:0},30);
  tl.to(HP,{a:1,duration:.75},31);
  tl.to(HP,{inset:2,size:144,x:64,y:270,support:1,duration:.8},31.15);
  tl.to(brand,{scale:1.6,duration:.8,ease:'power3.inOut'},31.95);
  tl.to(brand,{scale:1,duration:.9,ease:'power3.inOut'},35.1);
  tl.to(HP,{inset:0,size:184,x:160,y:380,support:0,duration:.9,ease:'power3.inOut'},35.1);
  openingWords.forEach((w,i)=>tl.to(w,{y:48,a:0,duration:.42,ease:'power2.in'},35.48+i*.025));
  secondWords.forEach((w,i)=>tl.to(w,{y:48,a:0,duration:.38,ease:'power2.in'},35.25+i*.025));
  tl.to({end:0},{end:1,duration:DUR,ease:'none'},0);
  const summaryRows = all('.booking-context__summary dl > div');
  const progress = all('.booking-context nav li');
  const calendar = $('#browser-calendar'), dateCells = all('.calendar-days button');
  let calendarPosition = {x:0,y:0};
  const sourceSrc = 'assets/tirta-forest-villa-1.webp', secondSrc = 'assets/tirta-forest-villa-2.webp';
  // Stable scene nodes are looked up once rather than during every animation frame.
  const view = {
    daylight:$('#daylight'), heroMedia:$('.hero__media'), heroScrim:$('.hero__scrim'), wordmark:$('.wordmark'),
    blur:$('#word-blur feGaussianBlur'), heroSupport:all('.hero__eyebrow,.hero__body,.hero-search,.hero__threshold,.site-header'),
    collection:$('#collection-plane'), collectionHeading:$('#collection-heading'), mainCard:$('[data-card="1"]'),
    sideCards:all('.film-card:not([data-card="1"])'), galleryChrome:all('#gallery-plane .stay-modal__content,#gallery-plane .stay-modal__thumbnails,#gallery-plane .stay-modal__close,#gallery-plane .stay-modal__gallery-controls'),
    galleryHeading:$('.stay-modal__heading'), modal:$('.stay-modal'), thumbnails:all('.stay-modal__thumbnails button'),
    cardImage:$('[data-card="1"] .stay-card__image'), thumb:$('[aria-label="View image 2"]'), plan:$('.stay-modal__action .primary-button'),
    continue:$('.booking-actions .primary-button'), back:$('.booking-back'), caption:$('#photo-caption'),
    forest:$('#forest-panel'), forestLight:$('.forest-light'), hinge:$('#planning-phrase'), revision:$('#revision-phrase'),
    dates:$('.booking-field-grid--dates'), cursor:$('#cursor'), ring:$('#cursor i'),
  };
  function setParent(parent) {
    if(previousParent===parent) return;
    parent.append(photo); previousParent=parent;
    photo.setAttribute('style', parent===shared ? '' : photoStyle);
  }
  function setPhoto(src) {if(photoSource!==src){photo.src=src;photoSource=src;}}
  function dateState(t) {
    return { arrival:t>=19.01, departure:t>=19.84, revised:t>=28.55, step:t>=21.92 && t<25.55?2:1,
      calendar:t>=18.49&&t<19.03?'arrival':t>=19.46&&t<20.0?'departure':t>=28.2&&t<28.73?'revision':'' };
  }
  function renderState(t) {
    const state=dateState(t), key=JSON.stringify(state);
    if(lastState!==key){
      lastState=key;
      inputs.arrival.value=state.arrival?'2027-03-09':'';
      inputs.departure.value=state.departure?`2027-03-${state.revised?'14':'12'}`:'';
      inputs.adults.value='2';inputs.area.value='Ubud';inputs.property.value='tirta-forest-villa';
      const arrivalLabel=state.arrival?'Mar 9, 2027':'Add dates';
      const departureLabel=state.departure?`Mar ${state.revised?'14':'12'}, 2027`:'Add dates';
      summaryRows[0].querySelector('dd').innerHTML=`${arrivalLabel}<span>to ${departureLabel}</span>`;
      summaryRows[1].querySelector('dd').textContent='2 adults';
      summaryRows[2].querySelector('dd').textContent='Ubud';
      summaryRows[3].querySelector('dd').textContent='Tirta Forest Villa';
      all('.booking-step').forEach(e=>e.hidden=Number(e.dataset.bookingStep)!==state.step);
      $('.booking-form').dataset.step=String(state.step);
      $('.booking-actions').dataset.step=String(state.step);
      $('.booking-form__header .section-label').textContent=`Private stay request · 0${state.step} of 03`;
      $('.booking-form__header i').style.transform='none';
      $('.booking-form__header i').style.width=`${state.step/3*100}%`;
      $('.booking-back').style.visibility=state.step===2?'visible':'hidden';
      progress.forEach((li,i)=>{
        li.dataset.active=String(state.step===i+1);li.dataset.complete=String(t>=21.92&&i===0);
        li.querySelector('button').disabled=i>1||(i===1&&t<21.92);
        if(state.step===i+1)li.querySelector('button').setAttribute('aria-current','step');
        else li.querySelector('button').removeAttribute('aria-current');
        if(i===0)li.querySelector('button > span').innerHTML=t>=21.92?$('.booking-modes .booking-mode-check').outerHTML.replace('class="booking-mode-check"','').replace('width="18"','width="14"').replace('height="18"','height="14"'):'01';
      });
      calendar.style.visibility=state.calendar?'visible':'hidden';
      inputs.arrival.dataset.focused=String(state.calendar==='arrival');
      inputs.departure.dataset.focused=String(state.calendar==='departure'||state.calendar==='revision');
      dateCells.forEach(e=>{
        const selected=state.calendar==='arrival'&&state.arrival?'9':state.calendar==='departure'&&state.departure?'12':state.calendar==='revision'?(state.revised?'14':'12'):'';
        e.dataset.selected=String(e.dataset.day===selected&&Boolean(selected));
        e.dataset.hovered=String(e.dataset.selected!=='true'&&e.dataset.day===(state.calendar==='arrival'?'9':state.calendar==='departure'?'12':'14'));
      });
    }
    if(state.calendar){
      const r=state.calendar==='arrival'?arrivalRect:departureRect;
      calendarPosition={x:PL.x+r.x*PL.s,y:PL.y+(r.y+r.h+8)*PL.s};
      calendar.style.transform=`translate(${calendarPosition.x}px,${calendarPosition.y}px) scale(${PL.s})`;
    }
    document.documentElement.dataset.step=String(state.step);
    document.documentElement.dataset.departure=inputs.departure.value;
  }
  function render(t) {
    // Camera motion stays on the compositor; CSS zoom reflows every native control.
    world.style.transform=`translate3d(${960-CAM.fx*CAM.s}px,${540-CAM.fy*CAM.s}px,0) scale(${CAM.s})`;
    view.daylight.style.transform=`translate3d(${Math.sin(t*Math.PI*2/36)*48}px,${Math.cos(t*Math.PI*2/36)*24}px,0) rotate(${Math.sin(t*Math.PI*2/36)*3}deg)`;
    hero.style.visibility=t<6.84||t>=31?'visible':'hidden';
    hero.style.opacity=t>=31?HP.a:1;
    hero.style.background=t>=5.54&&t<6.84?'transparent':'#142019';
    // Inset interpolation keeps the photograph fixed in one plane without warping it.
    const aperture=HP.inset<=1?[200-HP.inset*72,192-HP.inset*96,144-HP.inset*48,192-HP.inset*96]:[128*(2-HP.inset),96*(2-HP.inset),96*(2-HP.inset),96*(2-HP.inset)];
    view.heroMedia.style.clipPath=`inset(${aperture.map(v=>v+'px').join(' ')} round ${Math.max(0,16*(2-HP.inset))}px)`;
    view.heroMedia.style.transform=`translate3d(${RELAY.x}px,${RELAY.y}px,0) scale(${RELAY.s})`;
    view.heroMedia.style.borderRadius=RELAY.r+'px';
    view.heroScrim.style.opacity=(.96+.04*Math.cos(t*Math.PI*2/36))*RELAY.ink;
    view.wordmark.style.transform=`scale(${brand.scale})`;
    view.wordmark.style.transformOrigin='left center';
    heroTitle.style.transform=`scale(${HP.size/144})`;
    heroContent.style.opacity=RELAY.ink;
    heroContent.style.transform=`translate3d(${HP.x-64}px,${HP.y-270+RELAY.typeY}px,0)`;
    const openingBlur=t<1.1;
    const nextBlur=`0 ${openingBlur?Math.max(...openingWords.map(w=>Math.abs(w.y)))*.065:0}`;
    if(nextBlur!==blurAmount){view.blur.setAttribute('stdDeviation',nextBlur);blurAmount=nextBlur;}
    openingWords.forEach(w=>{w.el.style.transform=`translate3d(0,${w.y}px,0)`;w.el.style.opacity=w.a;w.el.style.filter=openingBlur&&Math.abs(w.y)>1&&w.a>0?'url(#word-blur)':'none';});
    secondWords.forEach(w=>{w.el.style.transform=`translateY(${w.y}px)`;w.el.style.opacity=w.a;});
    view.heroSupport.forEach(e=>{e.style.opacity=HP.support*RELAY.ink;});
    view.collection.style.visibility=t>=5.54&&t<9.3?'visible':'hidden';
    view.collectionHeading.style.opacity=ENTRY.heading;
    view.collectionHeading.style.transform=`translate3d(0,${ENTRY.headingY}px,0)`;
    view.mainCard.style.transform=`translate3d(${ENTRY.x}px,${ENTRY.y}px,0) scale(${ENTRY.s})`;
    view.sideCards.forEach(e=>{e.style.opacity=ENTRY.sides;e.style.transform=`translate3d(0,${ENTRY.sideY}px,0) scale(.91)`;});
    gallery.style.visibility=t>=9.3&&t<14.6?'visible':'hidden';
    view.galleryChrome.forEach(e=>{e.style.opacity=G.chrome;});
    view.galleryHeading.style.opacity=G.title;
    view.modal.style.background=t<10.14?'transparent':'white';
    view.modal.style.boxShadow=t<10.14?'none':'';
    const lifted=t>=8.18&&t<10.14;
    setParent(lifted?shared:t>=10.14&&t<30.6?galleryImageParent:cardImageParent);
    setPhoto(t>=11.06&&t<30.6?secondSrc:sourceSrc);
    shared.style.visibility=lifted?'visible':'hidden';
    if(lifted){
      shared.style.width=IMG.w+'px';shared.style.height=IMG.h+'px';shared.style.borderRadius=IMG.r+'px';
      shared.style.transform=`translate(${IMG.x}px,${IMG.y}px) rotate(${IMG.rot}deg)`;
      shared.style.boxShadow=`0 16px 32px rgb(20 32 25/${IMG.shadow}),0 56px 96px rgb(20 32 25/${IMG.shadow})`;
      photo.style.transform=`scale(${IMG.crop})`;
    }else if(t<8.18){photo.style.transform=`scale(${t>=7.8?1.045:1.035})`;}else{photo.style.transform='none';}
    view.thumbnails.forEach((e,i)=>e.setAttribute('aria-pressed',String(i===(t>=11.06?1:0))));
    const pressed=(at)=>t>=at&&t<at+.24 ? 1-.025*Math.sin((t-at)/.24*Math.PI):1;
    view.cardImage.style.transform=`scale(${pressed(8.05)})`;
    view.thumb.style.transform=`scale(${pressed(10.96)})`;
    view.plan.style.transform=`scale(${pressed(13.28)})`;
    view.continue.style.transform=`scale(${pressed(21.85)})`;
    view.back.style.transform=`scale(${pressed(25.45)})`;
    view.caption.style.opacity=lifted&&t>=8.55?1-G.title:0;
    view.forest.style.visibility=t>=14&&t<18?'visible':'hidden';
    view.forest.style.transform=`translate3d(${F.x}px,0,0)`;view.forest.style.opacity=F.a;
    view.forestLight.style.transform=`translate3d(${Math.sin(t*.45)*32}px,0,0)`;
    planner.style.visibility=t>=13.6&&t<32?'visible':'hidden';
    planner.style.transform=`translate(${PL.x-400}px,${PL.y-88}px) scale(${PL.s})`;
    view.hinge.style.opacity=TY.hinge;view.hinge.style.clipPath=`inset(0 0 0 ${(1-TY.hinge)*100}%)`;view.hinge.style.transform=`translate3d(${TY.hingeX}px,0,0)`;
    view.revision.style.opacity=TY.revision;view.revision.firstElementChild.style.transform=`translate3d(0,${TY.revisionY}px,0)`;
    view.dates.style.setProperty('--range-length',range.length);
    view.dates.style.setProperty('--range-alpha',range.a);
    view.cursor.style.opacity=CUR.a;view.cursor.style.transform=`translate3d(${CUR.x}px,${CUR.y}px,0) scale(${CUR.s})`;
    view.ring.style.opacity=CUR.ring;view.ring.style.transform=`scale(${CUR.ringS})`;
    renderState(t);
    if(debug){
      $('#scrub').value=String(t*100);$('#clock').textContent=t.toFixed(2)+'s';
      $('#btn-play').textContent=tl.paused()?'Play':'Pause';
    }
  }
  function post(type, extra={}) {
    if(embedded) parent.postMessage({source:'aurelia-composition',type,playing:!tl.paused(),duration:DUR,...extra},location.origin);
  }
  function seek(t) {
    seeking=true;tl.pause().time(Math.max(0,Math.min(DUR,t)),false);
    render(tl.time());seeking=false;
  }
  function play() {if(!ready)return;tl.play();post('state');}
  function pause() {tl.pause();post('state');}
  function restart(auto=true) {seek(prototype?6.7:0);if(auto)play();else post('state');}
  window.__tour={seek,play,pause,restart,duration:DUR,get time(){return tl.time();},get playing(){return !tl.paused();},get ready(){return ready;},get state(){return {...dateState(tl.time()),property:'tirta-forest-villa',area:'Ubud',adults:2};}};
  window.__seek=seek;
  if(debug){$('#ui').style.display='flex';}
  $('#scrub').addEventListener('input',e=>{seek(Number(e.target.value)/100);post('state');});
  $('#btn-play').addEventListener('click',()=>tl.paused()?play():pause());
  $('#btn-restart').addEventListener('click',()=>restart());
  addEventListener('keydown',e=>{
    if(e.target instanceof HTMLInputElement)return;
    if(e.code==='Space'){e.preventDefault();tl.paused()?play():pause();}
    if(e.key.toLowerCase()==='r')restart();
  });
  addEventListener('message',e=>{
    if(e.source!==parent||e.origin!==location.origin||e.data?.source!=='portfolio-composition')return;
    if(e.data.type==='play')play();
    else if(e.data.type==='pause')pause();
    else if(e.data.type==='restart')restart(e.data.play!==false);
    else if(e.data.type==='poster'){seek(33.4);post('state');}
    else if(e.data.type==='status')post(ready?'ready':'loading');
  });
  function preference(){if(reduced.matches||forced.matches){seek(33.4);post('state');}}
  reduced.addEventListener('change',preference);forced.addEventListener('change',preference);
  render(0);
  Promise.all([document.fonts.ready,...[...document.images].map(i=>i.decode().catch(()=>{}))]).then(()=>{
    ready=true;$('#loading-poster').style.display='none';
    if(reduced.matches||forced.matches)seek(33.4);
    else if(prototype)seek(6.7);
    if(!clean&&!embedded&&!reduced.matches&&!forced.matches)play();
    post('ready');
  });
})();
