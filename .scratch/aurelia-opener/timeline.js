/* bang-motion stage/rig, original source DOM, one deterministic GSAP clock. */
const DURATION=26,W=1920,H=1080;
const Q=new URLSearchParams(location.search);
gsap.defaults({force3D:false});
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const source=JSON.parse($('#source-data').textContent);
const fragment=text=>{const box=document.createElement('div');box.innerHTML=text;return box;};
$('#website').innerHTML=source.hero+source.navigation;
$$('img',$('#website')).forEach(img=>{img.removeAttribute('srcset');img.removeAttribute('sizes');img.src='assets/hero.webp';img.loading='eager';});
$$('a,button,input,select',$('#website')).forEach(el=>el.tabIndex=-1);
$('#planner').innerHTML=source['dates-empty'];
const pane=$('.booking-drawer',$('#planner'));
const form=$('.booking-form',pane);
const context=$('.booking-context',pane);
const workflow=$('.booking-workflow',pane);
const dates=$('[data-booking-step="1"]',form);
const stay=$('[data-booking-step="2"]',fragment(source.stay)).cloneNode(true);
const contact=$('[data-booking-step="3"]',fragment(source['contact-empty'])).cloneNode(true);
$$('.booking-step',form).filter(el=>el!==dates).forEach(el=>el.remove());
form.append(stay,contact);
[dates,stay,contact].forEach(el=>el.removeAttribute('hidden'));
const result=$('.booking-success',fragment(source.result)).cloneNode(true);
workflow.append(result);
const actions=$('.booking-actions',form);
const originalBack=$('.booking-back',fragment(source.stay)).cloneNode(true);
const originalReview=$('button[type="submit"]',fragment(source.contact)).cloneNode(true);
const continueButton=$('.primary-button',actions);
const footerControls=$('div',actions);
footerControls.prepend(originalBack);
footerControls.append(originalReview);
const navItems=$$('nav li',context);
const navNumbers=navItems.map(el=>$('button > span',el));
const summary=$$('.booking-context__summary dd',context);
const progress=$('.booking-form__header > span i',form);
const stepLabel=$('.booking-form__header > p',form);
const fields={checkIn:$('input[name="checkIn"]',dates),checkOut:$('input[name="checkOut"]',dates),area:$('select[name="area"]',stay),property:$('select[name="property"]',stay),name:$('input[name="name"]',contact),email:$('input[name="email"]',contact)};
const reviewDate=$('.booking-review strong',contact),reviewStay=$('.booking-review small',contact);
const checkSvg=$('nav li button > span',fragment(source.result)).innerHTML;
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const state={photoBlur:0,daylightX:0,daylightY:0,daylightScale:1};
const blurStates=[];
function blurTween(target,at,from,to,duration,vertical=true){
 const id='motion-blur-'+blurStates.length,NS='http://www.w3.org/2000/svg';
 const f=document.createElementNS(NS,'filter');f.id=id;
 for(const [k,v]of Object.entries({x:'-70%',y:'-70%',width:'240%',height:'240%'}))f.setAttribute(k,v);
 const node=document.createElementNS(NS,'feGaussianBlur');node.setAttribute('stdDeviation','0 0');f.append(node);$('#filters defs').append(f);
 const s={v:from,node,vertical};blurStates.push(s);
 tl.set(target,{filter:'url(#'+id+')'},at);
 tl.fromTo(s,{v:from},{v:to,duration,ease:'power3.out',immediateRender:false},at);
 tl.set(target,{filter:'none'},at+duration);
}
let lastState='';
function render(t){
 $('#website').style.filter=`blur(${state.photoBlur.toFixed(3)}px)`;
 $('#selected-photo').style.filter=`blur(${state.photoBlur.toFixed(3)}px)`;
 $('#daylight').style.transform=`translate(${state.daylightX}px,${state.daylightY}px) scale(${state.daylightScale})`;
 for(const b of blurStates)b.node.setAttribute('stdDeviation',b.vertical?`${b.v*.08} ${b.v}`:`${b.v} ${b.v*.08}`);
 const stage=t<7.7?'dates':t<11.9?'stay':t<14.5?'revise':t<15.5?'stay-again':t<21.05?'contact':'result';
 const num=stage==='stay'||stage==='stay-again'?2:stage==='contact'||stage==='result'?3:1;
 if(stage!==lastState){
  stepLabel.textContent=`PRIVATE STAY REQUEST · 0${num} OF 03`;
  navItems.forEach((el,i)=>{const complete=i<num-1||stage==='result'||(stage==='revise'&&i<1);el.dataset.active=String(i===num-1);el.dataset.complete=String(complete);navNumbers[i].innerHTML=complete?checkSvg:'0'+(i+1);});
  lastState=stage;
 }
 const dateIn=t>=4.85, dateOut=t>=5.85, revised=t>=13.35, chosenArea=t>=9.75,chosenStay=t>=10.9;
 const values={checkIn:dateIn?'2027-03-09':'',checkOut:dateOut?(revised?'2027-03-14':'2027-03-12'):'',area:chosenArea?'Ubud':'',property:chosenStay?'tirta-forest-villa':'',name:'Alex Morgan'.slice(0,Math.round(clamp((t-16.05)/.72)*11)),email:'alex@example.com'.slice(0,Math.round(clamp((t-17.1)/1.05)*16))};
 for(const [key,value]of Object.entries(values))if(fields[key].value!==value)fields[key].value=value;
 summary[0].innerHTML=(dateIn?'Mar 9, 2027':'Add dates')+'<span>to '+(dateOut?(revised?'Mar 14, 2027':'Mar 12, 2027'):'Add dates')+'</span>';
 summary[1].textContent='2 adults';summary[2].textContent=chosenArea?'Ubud':'Open to suggestions';summary[3].textContent=chosenStay?'Tirta Forest Villa':'Aurelia to suggest';
 reviewDate.textContent='Mar 9, 2027 to Mar 14, 2027';reviewStay.textContent='2 adults · Tirta Forest Villa';
 const revising=t>=12.6&&t<13.8;
 fields.checkOut.style.borderColor=revising?'#29483a':'';
 fields.checkOut.style.boxShadow=revising?'0 0 0 3px rgba(111,141,114,.18)':'';
 progress.style.transform=`scaleX(${num/3})`;
 originalBack.style.visibility=num>1?'visible':'hidden';
 continueButton.style.display=num<3?'inline-flex':'none';
 originalReview.style.display=num===3?'inline-flex':'none';
 const menu=t>=9.05&&t<9.75?'area':t>=10.1&&t<10.9?'property':null;
 const choices=$('#choices');
 if(menu){
  const box=positions[menu];choices.style.left=box.x+'px';choices.style.top=(box.y+32)+'px';choices.style.width=box.width+'px';
  choices.innerHTML=menu==='area'?'<span>Uluwatu</span><span data-selected>Ubud</span><span>Pererenan</span><span>Canggu</span>':'<span>Awan Cliff House, Uluwatu</span><span>Sora Surf Villa, Uluwatu</span><span data-selected>Tirta Forest Villa, Ubud</span>';
 }
 $('#clock').textContent=t.toFixed(2)+'s';$('#scrub').value=String(Math.round(t*100));
}
const tl=gsap.timeline({paused:true,defaults:{ease:'power4.out'},onUpdate(){render(tl.time());},onComplete(){if(!Q.has('clean'))tl.play(0);}});
const positions={};
function point(el){const r=el.getBoundingClientRect(),p=$('#planner-plane').getBoundingClientRect();return{x:r.x-p.x+r.width/2,y:r.y-p.y+r.height/2,width:r.width};}
function pointer(target,at,duration=.48){const p=typeof target==='string'?positions[target]:target;tl.to('#cursor',{x:p.x-4,y:p.y-3,duration,ease:'power2.inOut'},at);}
function click(target,at){
 tl.to('#cursor',{scale:.86,duration:.1,ease:'power2.in'},at);
 tl.to('#cursor',{scale:1,duration:.18,ease:'power2.out'},at+.1);
 tl.fromTo('#cursor i',{opacity:.6,scale:.3},{opacity:0,scale:1.3,duration:.48,ease:'power2.out',immediateRender:false},at);
 if(target)tl.fromTo(target,{scale:1},{scale:.975,duration:.1,ease:'power2.in',immediateRender:false},at).to(target,{scale:1,duration:.18,ease:'power2.out'},at+.1);
}
function claim(id,at,end,up=true){
 const el=$(id);tl.fromTo(el,{opacity:0,y:up?34:-34},{opacity:1,y:0,duration:.8,ease:'power4.out',immediateRender:false},at);
 blurTween(el,at,12,0,.72,up);
 tl.to(el,{opacity:0,y:up?-24:24,duration:.35,ease:'power2.in'},end-.35);
 blurTween(el,end-.35,0,10,.35,up);
}
function change(out,next,at,direction=1){
 tl.to(out,{opacity:0,x:-24*direction,duration:.22,ease:'power2.in'},at);
 tl.fromTo(next,{opacity:0,x:32*direction},{opacity:1,x:0,duration:.45,ease:'power4.out',immediateRender:false},at+.1);
}
function focus(at,{scale=1.32,x=-310,y=-48,duration=.85}={}){tl.to('#world',{scale,x,y,duration,ease:'power2.inOut'},at);}
function wide(at,duration=.85){focus(at,{scale:1,x:0,y:0,duration});}
async function build(){
 await Promise.all(['400 16px Manrope','500 16px Manrope','600 16px Manrope','400 88px "Cormorant Garamond"','500 30px "Cormorant Garamond"','italic 400 112px "Cormorant Garamond"'].map(font=>document.fonts.load(font)));
 await document.fonts.ready;await Promise.all($$('img').map(img=>img.decode().catch(()=>{})));
 originalReview.style.display='none';originalBack.style.visibility='hidden';
 Object.entries(fields).forEach(([key,el])=>positions[key]=point(el));
 positions.continue=point(continueButton);positions.back=point(originalBack);
 continueButton.style.display='none';originalReview.style.display='inline-flex';positions.review=point(originalReview);
 continueButton.style.display='inline-flex';originalReview.style.display='none';
 positions.close=point($('.booking-drawer__close',pane));
 const rhythm=$$('.booking-modes label',stay)[0];positions.rhythm=point(rhythm);
 tl.set('#planner',{opacity:0});tl.set('#planner-plane',{opacity:0,scale:1.04});
 tl.set([stay,contact,result],{opacity:0});tl.set(dates,{opacity:0});
 tl.fromTo('#website',{scale:1.025,x:-12,y:-8},{scale:1,x:0,y:0,duration:3.2,ease:'sine.inOut',immediateRender:false},0);
 tl.fromTo(state,{daylightX:-120,daylightY:0,daylightScale:1},{daylightX:100,daylightY:70,daylightScale:1.12,duration:26,ease:'sine.inOut',immediateRender:false},0);
 tl.set('#planner-plane',{opacity:1},2.6);tl.set('#cursor',{opacity:1,x:1168,y:-122},2.65);
 pointer({x:1173,y:-119},2.65,.35);click($('#website .nav-cta'),3.12);
 tl.to('#cursor',{opacity:0,duration:.16},3.25);
 tl.fromTo('#planner',{opacity:0,x:1340,rotationY:-7},{opacity:1,x:0,rotationY:0,duration:.9,ease:'power4.out',immediateRender:false},3.35);
 tl.to(state,{photoBlur:12,duration:.8,ease:'power2.inOut'},3.35);tl.to('#photo-shade',{opacity:1,duration:.8,ease:'power2.inOut'},3.35);
 tl.fromTo(['.booking-context__brand','.booking-context nav','.booking-context__summary','.booking-form__header'],{y:16,opacity:0},{y:0,opacity:1,duration:.65,stagger:.075,immediateRender:false},3.55);
 tl.fromTo(dates,{y:12,opacity:0},{y:0,opacity:1,duration:.5,immediateRender:false},3.75);
 claim('#claim-dates',3.7,7.55);
 tl.set('#cursor',{x:positions.checkIn.x-90,y:positions.checkIn.y+70,opacity:1},4.25);
 focus(4.25,{scale:1.2,x:-310,y:-32});pointer('checkIn',4.35,.4);click(null,4.78);
 pointer('checkOut',5.3,.43);click(null,5.8);
 wide(6.35);pointer('continue',6.72,.5);click(continueButton,7.28);
 change(dates,stay,7.7);claim('#claim-stay',7.9,11.8,false);
 pointer('rhythm',8.15,.5);click(rhythm,8.67);
 pointer('area',8.72,.3);click(null,9.04);
 tl.fromTo('#choices',{opacity:0,y:-8},{opacity:1,y:0,duration:.18,immediateRender:false},9.05);
 pointer({x:positions.area.x-70,y:positions.area.y+94},9.3,.3);click(null,9.7);tl.to('#choices',{opacity:0,duration:.1},9.75);
 pointer('property',9.78,.3);click(null,10.06);tl.fromTo('#choices',{opacity:0,y:-8},{opacity:1,y:0,duration:.18,immediateRender:false},10.1);
 pointer({x:positions.property.x-50,y:positions.property.y+137},10.36,.35);click(null,10.83);tl.to('#choices',{opacity:0,duration:.1},10.9);
 tl.to('#selected-photo',{opacity:1,duration:1.15,ease:'power2.inOut'},10.95);
 pointer('back',11.23,.42);click(originalBack,11.72);change(stay,dates,11.9,-1);
 claim('#claim-edit',12.0,15.45);focus(12.15,{scale:1.37,x:-420,y:-56,duration:1});
 pointer('checkOut',12.45,.5);click(null,13.25);
 tl.fromTo('.booking-context__summary',{backgroundColor:'#e5efe8'},{backgroundColor:'#ffffff',duration:.85,ease:'sine.out',immediateRender:false},13.35);
 wide(13.8,.85);pointer('continue',13.78,.45);click(continueButton,14.24);change(dates,stay,14.5);
 pointer('continue',14.83,.22);click(continueButton,15.21);change(stay,contact,15.5);
 claim('#claim-review',15.75,20.95,false);pointer('name',15.65,.38);click(null,16.01);
 focus(16.2,{scale:1.12,x:-172,y:-20,duration:1.05});
 pointer('email',16.7,.36);click(null,17.06);
 tl.fromTo('.booking-review',{y:12,opacity:0},{y:0,opacity:1,duration:.7,ease:'power4.out',immediateRender:false},18.12);
 wide(18.6,.85);pointer('review',19.38,.65);click(originalReview,20.64);
 tl.to(form,{opacity:0,y:-24,duration:.27,ease:'power2.in'},21.05);
 tl.fromTo(result,{opacity:0,y:32},{opacity:1,y:0,duration:.75,ease:'power4.out',immediateRender:false},21.12);
 tl.fromTo('.booking-success__matches > span',{y:18,opacity:0},{y:0,opacity:1,duration:.65,stagger:.13,immediateRender:false},21.45);
 focus(21.6,{scale:1.045,x:-62,y:-18,duration:1.5});
 pointer('close',23.58,.6);click($('.booking-drawer__close',pane),24.2);
 tl.to('#cursor',{opacity:0,duration:.15},24.4);
 tl.to('#planner',{x:1340,rotationY:4,opacity:0,duration:.75,ease:'power3.inOut'},24.35);
 tl.to('#selected-photo',{opacity:0,duration:.7,ease:'power2.inOut'},24.4);
 tl.to('#photo-shade',{opacity:0,duration:.8,ease:'power2.inOut'},24.45);
 tl.to(state,{photoBlur:0,duration:.9,ease:'power2.inOut'},24.4);wide(24.4,1.1);
 tl.to('#website',{scale:1.025,x:-12,y:-8,duration:.9,ease:'sine.inOut'},25.1);
 tl.to({hold:0},{hold:1,duration:.01},25.99);
 const fit=()=>$('#stage').style.transform=`translate(-50%,-50%) scale(${Math.min(innerWidth/W,innerHeight/H)})`;fit();addEventListener('resize',fit);
 const seek=t=>{tl.pause();tl.time(0,true);render(0);tl.time(clamp(t,0,DURATION),true);render(t);};
 const seekFrame=async t=>{
  seek(t);
  // Rebuild paint layers at the final seek scale. Chromium otherwise reuses
  // text rasters from the previous zoom even when all DOM styles are identical.
  const stage=$('#stage');stage.style.display='none';void stage.offsetHeight;
  stage.style.display='block';void stage.offsetHeight;
 };
 window.OPENER={tl,DURATION,ready:true,seek,seekFrame,claims:['Start with your dates','Choose your holiday rhythm','Your dates stay editable','Review your stay plan']};
 seek(0);
 const toggle=()=>tl.paused()?tl.play(tl.time()>=DURATION?0:tl.time()):tl.pause();
 $('#btn-play').onclick=toggle;$('#btn-restart').onclick=()=>tl.play(0);$('#scrub').oninput=e=>seek(Number(e.target.value)/100);
 addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();toggle();}if(e.key.toLowerCase()==='r')tl.play(0);});
 if(Q.has('debug'))$('#ui').classList.add('on');
 if(!Q.has('clean'))tl.play(0);
}
build().catch(error=>{console.error(error);window.OPENER={ready:false,error:error.message};});
