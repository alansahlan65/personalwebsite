(async () => {
  const W=1920,H=1080,DURATION=40;
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const data=JSON.parse($('#source-data').textContent);
  const sourceArea=document.createElement('div'); sourceArea.innerHTML=data.areas;
  const alternate=sourceArea.querySelector('.areas__panel');
  alternate.removeAttribute('id'); alternate.classList.add('area-change');
  $$('.areas__panel').find(e=>e.closest('#page')).append(alternate);
  await document.fonts.ready;
  await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));
  // CSS transitions and wall clocks never participate in a frame seek.
  const rect=e=>{
    const a=e.getBoundingClientRect(),b=$('#page').getBoundingClientRect();
    return {x:a.x-b.x,y:a.y-b.y,w:a.width,h:a.height};
  };
  const point=e=>{const r=rect(e);return {x:r.x+r.w/2,y:r.y+r.h/2};};
  const sections=$$('#page main>section, #page>footer');
  const geometry=sections.map(e=>({selector:e.id?'#'+e.id:'.'+e.classList[0],...rect(e)}));
  const frame=e=>{
    const r=rect(e),style=getComputedStyle(e),pt=parseFloat(style.paddingTop),pb=parseFloat(style.paddingBottom);
    const h=r.h-pt-pb;
    return {s:Math.min(.90,972/(h+32)),fx:960,fy:r.y+pt+h/2};
  };
  const shots={};
  for(const e of sections)shots[e.id||e.classList[0]]=frame(e);
  const hero={s:.90,fx:960,fy:540};
  const CAM={...hero},pointer={x:1450,y:500};
  const state={carousel:0,featured:0,area:0,faq:0};
  const originalSlides=$$('#page .stays__slide');
  const track=$('#page .stays__track');
  const initialTrackX=new DOMMatrix(getComputedStyle(track).transform).m41;
  const finalTrackX=parseFloat(data.carousel.transforms.find(e=>e.className==='stays__track').transform.match(/translate3d\(([-\d.]+)/)[1]);
  const tabs=$$('#page .featured__chapters button'), panels=$$('#page .featured__panel');
  const areaTabs=$$('#page .areas__tabs button');
  const areaOriginal=$('#page #area-panel');
  const originalAreaChildren=[...areaOriginal.children].filter(e=>e!==alternate);
  const question=$('#page #faq details');
  const answer=question.querySelector('p');
  // Reserve the source answer's natural height so later camera coordinates stay fixed.
  question.open=true;const answerHeight=answer.getBoundingClientRect().height;question.open=false;
  const faqInitialHeight=$('#faq').offsetHeight;
  $('#faq').style.minHeight=(faqInitialHeight+answerHeight+16)+'px';
  const totalHeight=$('#page').offsetHeight;
  // FAQ reservation can move CTA/footer. Re-measure after the reservation.
  for(const e of sections)shots[e.id||e.classList[0]]=frame(e);
  const cursor=$('#cursor'),pulse=$('#cursor i');
  const tl=gsap.timeline({paused:true,onUpdate:()=>render(tl.time()),onComplete:()=>{tl.play(0);}});
  const shot=(at,duration,target,ease='power2.inOut')=>tl.to(CAM,{...target,duration,ease},at);
  const sectionShot=(at,duration,id)=>shot(at,duration,shots[id]);
  const settle=(at,duration,id,dy=8)=>shot(at,duration,{...shots[id],fy:shots[id].fy+dy},'sine.inOut');
  function gesture(at,e,hold=.6,screen=false){
    const target=screen?(()=>{const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})():point(e);
    tl.set(cursor,{opacity:0},at-.35);
    tl.to(pointer,{x:target.x,y:target.y,duration:.48,ease:'power3.out'},at-.3);
    tl.to(cursor,{opacity:1,duration:.16},at-.3);
    tl.to(cursor,{scale:.88,duration:.1,ease:'power2.in'},at+.18);
    tl.to(cursor,{scale:1,duration:.22,ease:'power2.out'},at+.28);
    tl.fromTo(pulse,{scale:.55,opacity:.75},{scale:1.65,opacity:0,duration:.42,immediateRender:false},at+.18);
    tl.to(cursor,{opacity:0,duration:.18},at+hold);
  }
  // Original reveal, with the complete hero visible from the opening frame.
  tl.fromTo($('#page .hero__image'),{scale:1.025},{scale:1,duration:1.9,ease:'power4.out',immediateRender:false},0);
  tl.fromTo($('#page .hero__title'),{y:12,opacity:.9},{y:0,opacity:1,duration:1.45,ease:'power4.out',immediateRender:false},0);
  const blur=$('#title-blur feGaussianBlur'),heroTitle=$('#page .hero__title');
  const titleState={blur:2.6};tl.to(titleState,{blur:0,duration:1.45,ease:'power4.out'},0);
  shot(2.0,1.7,{...hero,fy:546},'sine.inOut');
  sectionShot(3.85,.8,'arrival');
  // Preserve source chapter masks, photographic motion and contracting stage.
  const journey=$$('#page .journey__scene'),photos=$$('#page .journey__scene .theme-image'),copy=$$('#page .journey__scene-copy');
  gsap.set(journey.slice(1),{opacity:0,clipPath:'inset(0 0 0 100%)'});
  gsap.set(photos,{scale:1.045});
  gsap.set(copy.slice(1),{y:30,opacity:0});
  const jt=gsap.timeline({paused:false,defaults:{ease:'none'}});
  jt.to(photos[0],{scale:1.105,xPercent:-1.4,duration:1},0)
    .to(copy[0],{y:-24,opacity:0,duration:.18},.72)
    .to(journey[0],{filter:'brightness(.62) saturate(.78)',duration:.28},.72)
    .to(journey[1],{opacity:1,clipPath:'inset(0 0 0 0%)',duration:.34},.82)
    .to(photos[1],{scale:1,xPercent:1.2,duration:.92},.82)
    .to(copy[1],{y:0,opacity:1,duration:.2},1.16)
    .to(copy[1],{y:-24,opacity:0,duration:.18},1.68)
    .to(journey[1],{filter:'brightness(.58) saturate(.72)',duration:.28},1.68)
    .to(journey[2],{opacity:1,clipPath:'inset(0 0 0 0%)',duration:.34},1.78)
    .to(photos[2],{scale:1,yPercent:-1.2,duration:.9},1.78)
    .to(copy[2],{y:0,opacity:1,duration:.2},2.12)
    .to($('#page .journey__ambient'),{backgroundColor:'#111d18',duration:.7},1.72)
    .to(copy[2],{y:-18,opacity:0,duration:.2},2.55)
    .to($('#page .journey__topline'),{opacity:0,y:-14,duration:.18},2.55)
    .to($('#page .journey__ambient'),{'--journey-handoff-opacity':1,duration:.4},2.5)
    .to($('#page .journey__stage'),{scale:.88,yPercent:0,borderRadius:24,duration:.42,ease:'power2.inOut'},2.52)
    .to($$('#page .journey__scene-shade'),{opacity:.46,duration:.3},2.55)
    .fromTo($('#page .journey__handoff'),{opacity:0,y:22},{opacity:1,y:0,duration:.24,immediateRender:false},2.7);
  jt.timeScale(.82);tl.add(jt,4.65);
  sectionShot(8.45,.72,'stays');settle(9.17,1.05,'stays');
  gesture(10.05,$('#page .carousel-nav--next'));
  tl.to(state,{carousel:1,duration:.85,ease:'power3.inOut'},10.25);
  const cardPoint=point(originalSlides[1]);
  const cardBody=rect(originalSlides[1].querySelector('.stay-card'));
  // Horizontal track travel re-centers the second card at the native first-card location.
  const cardTarget={s:1.1,fx:cardPoint.x+(finalTrackX-initialTrackX),fy:cardBody.y+cardBody.h/2};
  shot(11.2,.55,cardTarget);shot(12.85,.55,shots.stays);
  sectionShot(13.9,.65,'ways-to-stay');settle(14.55,1.9,'ways-to-stay',10);
  sectionShot(16.75,.65,'featured');settle(17.4,1.15,'featured');
  gesture(18.65,tabs[1],.9);
  tl.to(state,{featured:1,duration:.65,ease:'power2.inOut'},18.85);
  settle(19.5,.85,'featured',12);
  sectionShot(20.75,.65,'areas');settle(21.4,1.05,'areas');
  gesture(22.55,areaTabs.find(e=>e.textContent.includes('Ubud')),.8);
  tl.to(state,{area:1,duration:.65,ease:'power2.inOut'},22.75);
  settle(23.4,1.05,'areas',12);
  sectionShot(24.75,.65,'standard');settle(25.4,2.1,'standard',16);
  sectionShot(27.8,.55,'faq');
  gesture(28.45,question.querySelector('summary'),.65);
  tl.to(state,{faq:1,duration:.38,ease:'power2.inOut'},28.65);
  sectionShot(29.8,.55,'final-cta');settle(30.35,.5,'final-cta');
  gesture(30.9,$('#page .final-cta .primary-button'),.5);
  tl.fromTo($('#planner-layer'),{autoAlpha:0},{autoAlpha:1,duration:.42,immediateRender:false},31.2);
  tl.fromTo($('#planner-plane'),{y:72,scale:.94},{y:0,scale:1,duration:.75,ease:'power4.out',immediateRender:false},31.2);
  // A single populated source state, no form typing and no result.
  tl.to($('#planner-plane'),{y:48,scale:.97,duration:.36,ease:'power2.in'},34.15);
  tl.to($('#planner-layer'),{autoAlpha:0,duration:.38},34.15);
  sectionShot(34.65,.6,'footer');settle(35.25,.55,'footer',10);
  const overview={s:Math.min(.90,948/totalHeight),fx:960,fy:totalHeight/2};
  shot(35.9,1.25,overview,'power3.inOut');
  // The physical page remains present throughout the overview-to-hero return.
  shot(37.15,.8,{...overview,fy:totalHeight/2-160},'sine.inOut');
  shot(37.95,1.8,hero,'power3.inOut');
  tl.to(CAM,{...hero,duration:.25,ease:'none'},39.75);
  tl.to($('#page .hero__image'),{scale:1.025,duration:.25,ease:'sine.inOut'},39.75);
  tl.to(heroTitle,{y:12,opacity:.9,duration:.25,ease:'sine.inOut'},39.75);
  tl.to(titleState,{blur:2.6,duration:.25,ease:'sine.inOut'},39.75);
  function render(t){
    const x=W/2-CAM.fx*CAM.s,y=H/2-CAM.fy*CAM.s;
    $('#world').style.transform=`translate(${x}px,${y}px) scale(${CAM.s})`;
    $('#daylight').style.transform=`translate(${60*Math.sin(t*Math.PI/20)}px,${36*Math.cos(t*Math.PI/20)}px)`;
    track.style.transform=`translate3d(${initialTrackX+(finalTrackX-initialTrackX)*state.carousel}px,0,0)`;
    originalSlides.forEach((e,i)=>{
      e.dataset.selected=String(i===(state.carousel>=.5?1:0));
      const c=e.querySelector('.stay-card');
      const selected=i===0?1-state.carousel:i===1?state.carousel:0;
      c.style.transform=`translateY(${22*(1-selected)}px) scale(${.91+.125*selected})`;
    });
    tabs.forEach((e,i)=>{e.dataset.active=String(i===(state.featured>=.5?1:0));e.setAttribute('aria-selected',e.dataset.active);});
    panels.forEach((e,i)=>{
      e.style.opacity=i===0?1-state.featured:i===1?state.featured:0;
      e.style.zIndex=i===(state.featured>=.5?1:0)?1:0;
      e.querySelectorAll('img').forEach(img=>img.style.transform=`scale(${i===1?1.035-.035*state.featured:1})`);
    });
    areaTabs.forEach(e=>e.setAttribute('aria-selected',String(state.area>=.5?e.textContent.includes('Ubud'):e===areaTabs[0])));
    originalAreaChildren.forEach(e=>e.style.opacity=1-state.area);
    alternate.style.opacity=state.area;
    alternate.querySelectorAll('img').forEach(e=>{e.style.opacity=e.dataset.active==='true'?1:0;e.style.transform=`scale(${1.035-.035*state.area})`;});
    question.open=state.faq>0;
    answer.style.opacity=state.faq;answer.style.maxHeight=(answerHeight*state.faq)+'px';answer.style.overflow='hidden';
    cursor.style.left=(x+pointer.x*CAM.s)+'px';
    cursor.style.top=(y+pointer.y*CAM.s)+'px';
    if(t<1.45||t>=39.75){heroTitle.style.filter='url(#title-blur)';blur.setAttribute('stdDeviation',`${titleState.blur*.08} ${titleState.blur}`);}else heroTitle.style.filter='none';
    // Hide fixed source nav on the tall page after its hero exits the camera.
    $('#page .site-header').style.opacity=1;
    if($('#clock'))$('#clock').textContent=t.toFixed(2)+'s';
    if($('#scrub')&&!$('#scrub').matches(':active'))$('#scrub').value=Math.round(t*100);
  }
  function seek(t){tl.pause();tl.time(Math.max(0,Math.min(DURATION,t)),false);render(tl.time());}
  async function seekFrame(t){
    seek(t);
    // Rebuild the transformed paint layer at its final scale for repeatable text rasterization.
    const world=$('#world');world.style.display='none';void world.offsetHeight;world.style.display='';
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  }
  function fit(){const s=Math.min(innerWidth/W,innerHeight/H);$('#stage').style.transform=`translate(-50%,-50%) scale(${s})`;}
  fit();addEventListener('resize',fit);
  $('#btn-play').onclick=()=>tl.paused()?tl.play():tl.pause();
  $('#btn-restart').onclick=()=>{seek(0);tl.play();};
  $('#scrub').oninput=e=>seek(Number(e.target.value)/100);
  addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();tl.paused()?tl.play():tl.pause();}if(e.key.toLowerCase()==='r'){seek(0);tl.play();}});
  const query=new URLSearchParams(location.search);
  if(query.has('debug'))$('#ui').classList.add('on');
  window.OPENER={tl,DURATION,seek,seekFrame,geometry,shots,totalHeight,ready:true};
  seek(0);
  if(!query.has('clean')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)tl.play();
})().catch(e=>{console.error(e);window.OPENER={ready:false,error:e.message};});
