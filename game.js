(()=>{
const $=id=>document.getElementById(id),pick=a=>a[Math.random()*a.length|0],dist=(ax,az,bx,bz)=>Math.hypot(ax-bx,az-bz);
/* ================= branches, layouts, save ================= */
const BR=[
 {n:'Burger Shop Empire',w:0x2a9d8f,t:0xe9c46a,f:[0xe9ebee,0xd3d7dc],m:1,c:0xef476f,pn:'Grill',gn:'GRILL',cn:['COUNTER','serve here'],dn:['DRINKS','cold'],dp:'Drinks Bar',ej:'\u{1F354}',wl:0xe0a339,fl:[0xf5e6c8,0xd9b77a],tr:0x8b4513,ac:0xd62828},
 {n:'Pizza Express',w:0xc0392b,t:0xf4d35e,f:[0xf6e7d0,0xe0c9a6],m:2,c:0xffd166,pn:'Pizza Oven',gn:'PIZZA OVEN',cn:['COUNTER','serve here'],dn:['SODA BAR','cold'],dp:'Soda Bar',ej:'\u{1F355}',wl:0xa63d2f,fl:[0xe8d5b5,0xc9a97c],tr:0x5c2018,ac:0xf4d35e},
 {n:'Hot Samosa Corner',w:0xe08a1e,t:0x5b2a0c,f:[0xf6e3b4,0xe3c98a],m:4,c:0x2ecc71,pn:'Samosa Fryer',gn:'SAMOSA FRYER',cn:['CHUTNEY COUNTER','serve here'],dn:['CHAI & SODA','cold'],dp:'Drinks Bar',ej:'\u{1F95F}',wl:0xe8851f,fl:[0xf2d9a6,0xd9b36b],tr:0x6b3410,ac:0xffc857},
 {n:'Crispy Jalebi Sweets',w:0xf4845f,t:0xffe066,f:[0xfff0d9,0xffd9b0],m:8,c:0xff7b00,pn:'Jalebi Pan',gn:'JALEBI PAN',cn:['COUNTER','serve here'],dn:['SYRUP STATION','sugar syrup'],dp:'Syrup Station',ej:'\u{1F365}',wl:0xf49078,fl:[0xffe3cc,0xffc9a3],tr:0xc2410c,ac:0xff5d8f},
 {n:'Chhole Bhature Junction',w:0xb5651d,t:0xf6bd60,f:[0xf0e1c6,0xdcc7a0],m:16,c:0xd62828,pn:'Bhatura Tawa',gn:'BHATURA TAWA',cn:['COUNTER','serve here'],dn:['LASSI BAR','cold'],dp:'Lassi Bar',ej:'\u{1FAD3}',wl:0xb9833a,fl:[0xe9d3a1,0xc9a566],tr:0x5a3a14,ac:0xf2c230},
 {n:'Indo-Chinese Manchurian Hub',w:0xa4161a,t:0xf4d35e,f:[0xd8d8d8,0x9aa0a6],m:32,c:0xffd60a,pn:'Wok Station',gn:'WOK STATION',cn:['COUNTER','serve here'],dn:['TEA & SODA','cold'],dp:'Drinks Bar',ej:'\u{1F35C}',wl:0x7f1218,fl:[0x4a3a34,0x2f2420],tr:0xc9a227,ac:0xffd60a},
 {n:'Mutton & Biryani Palace',w:0x6b4226,t:0xd4af37,f:[0xf2e6cf,0xd9c7a1],m:64,c:0xd4af37,pn:'Biryani Handi',gn:'BIRYANI HANDI',cn:['COUNTER','serve here'],dn:['RAITA BAR','cold'],dp:'Raita Bar',ej:'\u{1F35B}',wl:0x5a3a22,fl:[0xd8c08e,0xb89a5e],tr:0xd4af37,ac:0xf0c75e},
 {n:'Egg Roll Street',w:0xe67e22,t:0x6a040f,f:[0xf4e4c1,0xe2cf9f],m:128,c:0x00e5ff,pn:'Roll Griddle',gn:'ROLL GRIDDLE',cn:['COUNTER','serve here'],dn:['SODA BAR','cold'],dp:'Soda Bar',ej:'\u{1F32F}',wl:0xf07f13,fl:[0xf1dcb5,0xd8b982],tr:0x7a2e0e,ac:0xffd23f},
 {n:'South Indian Dosa Hut',w:0x3a7d44,t:0xf2cc8f,f:[0xf6efd9,0xe0d6b3],m:256,c:0xffb703,pn:'Dosa Tawa',gn:'DOSA TAWA',cn:['COUNTER','serve here'],dn:['FILTER COFFEE','hot'],dp:'Coffee Bar',ej:'\u{1F95E}',wl:0x4a8a4f,fl:[0xb98a5a,0x9c6e3f],tr:0x6b4423,ac:0xf2cc8f},
 {n:'Royal Sweets & Desserts',w:0x5f0f40,t:0xffd700,f:[0xfff3d6,0xf1d58a],m:512,c:0xffd700,pn:'Sweets Kitchen',gn:'SWEETS KITCHEN',cn:['COUNTER','serve here'],dn:['FALOODA BAR','cold'],dp:'Falooda Bar',ej:'\u{1F370}',wl:0xe58ab0,fl:[0xfff0f3,0xf6d6a8],tr:0xd4a017,ac:0xffd700}];
const NB=BR.length;
BR.forEach((b,i)=>{b.m=Math.pow(2.5,i);}); // every hotel costs ~2.5x the previous one, and pays ~2.5x too (PRICE/TIP/DB are multiplied by M)
// Floor plans (union of rects), station order, table grid, doors and management corner. 5 plans, reused across the 10 hotels (each hotel has its own look, food and decor).
const LAY=[
 {rects:[[-20,-12,20,12]],nz:-12,st:{counter:-15,drink:-8,grill:-1.5,pack:5.5,win:13},
  tabs:[[-6,2],[2,2],[-6,-3.5],[2,-3.5],[-6,7.5],[2,7.5]],ent:{x:-15,z:12},ex:{x:7,z:12},cash:[-11.8,-4.8],trash:[-12.2,-.5],
  mz:{x:9.6,z:10.2,dx:2.4,dz:0,rx:0,rz:-2.4},nd:{x:20,z:-2,a:'E'},arrN:{x:18.4,z:-2},pd:{x:-20,z:4,a:'W'},arrP:{x:-18.4,z:4},start:[-9,-1]},
 {rects:[[-22,-12,22,2],[-22,2,6,10]],nz:-12,st:{counter:-17.5,grill:-10,drink:-3,pack:4,win:12},
  tabs:[[-9,2.5],[-1,2.5],[-9,-3],[-1,-3],[-9,7],[-1,7]],ent:{x:-17.5,z:10},ex:{x:-12.5,z:10},cash:[-14.3,-4.8],trash:[-14.8,.5],
  mz:{x:9.5,z:0,dx:2.4,dz:0,rx:0,rz:-2.4},nd:{x:22,z:-6,a:'E'},arrN:{x:20.4,z:-6},pd:{x:-22,z:-4,a:'W'},arrP:{x:-20.4,z:-4},start:[-13,-5]},
 {rects:[[-20,-12,20,-4],[-20,-4,-8,8],[-8,-4,14,14]],nz:-12,st:{drink:-18,grill:-11,counter:-3,pack:5,win:13},
  tabs:[[5,6],[11.5,6],[5,1],[11.5,1],[5,11],[11.5,11]],ent:{x:-3,z:14},ex:{x:.5,z:14},cash:[.2,-4.8],trash:[-6.2,3],
  mz:{x:-17.8,z:6.2,dx:2.4,dz:0,rx:0,rz:-2.4},nd:{x:20,z:-8,a:'E'},arrN:{x:18.4,z:-8},pd:{x:-20,z:-6,a:'W'},arrP:{x:-18.4,z:-6},start:[-6,-6]},
 {rects:[[-26,-10,26,10]],nz:-10,st:{counter:-22,drink:-14,grill:-6.5,pack:1.5,win:10},
  tabs:[[-10.5,5],[-2,5],[6.5,5],[-10.5,-1],[-2,-1],[6.5,-1]],ent:{x:-22,z:10},ex:{x:-16.5,z:10},cash:[-18.8,-2.8],trash:[-24.4,7],
  mz:{x:12,z:8.2,dx:2.4,dz:0,rx:0,rz:-2.4},nd:{x:26,z:-3,a:'E'},arrN:{x:24.4,z:-3},pd:{x:-26,z:-2,a:'W'},arrP:{x:-24.4,z:-2},start:[-16,2]},
 {rects:[[-22,-12,-8,10],[-8,-12,8,-4],[8,-12,22,10]],nz:-12,st:{counter:-17,grill:-9.5,drink:-2.5,pack:4.5,win:12.5},
  tabs:[[12,2.5],[18.5,2.5],[12,-3],[18.5,-3],[12,8],[18.5,8]],ent:{x:-17,z:10},ex:{x:15.5,z:10},cash:[-20.2,-4.8],trash:[-14.6,-5],
  mz:{x:-9.8,z:-1,dx:0,dz:2.4,rx:-2.4,rz:0},nd:{x:22,z:-8,a:'E'},arrN:{x:20.4,z:-8},pd:{x:-22,z:2,a:'W'},arrP:{x:-20.4,z:2},start:[-12,-6]},
 // 5: long kitchen strip on top, small lobby (entrance + queue) bottom-left, big dining block bottom-right, offices + management corner in the strip
 {rects:[[-24,-12,24,2],[-24,2,-10,10],[-4,2,24,14]],nz:-12,st:{counter:-19,drink:-11,grill:-3,pack:5.5,win:14},
  tabs:[[0,6],[8,6],[16,6],[0,11],[8,11],[16,11]],ent:{x:-19,z:10},ex:{x:5,z:14},cash:[-15.8,-4.8],trash:[-14.8,5.5],
  mz:{x:-12,z:-3.5,dx:2.4,dz:0,rx:0,rz:2.4},nd:{x:24,z:8,a:'E'},arrN:{x:22.4,z:8},pd:{x:-24,z:4,a:'W'},arrP:{x:-22.4,z:4},start:[-14,.5]},
 // 6: stepped plan: kitchen block top-left (drive-thru on the far left, counter in the middle), dining block bottom-right, offices under the west stations
 {rects:[[-28,-12,12,4],[-10,4,30,18]],nz:-12,st:{win:-24,pack:-16.5,grill:-9,counter:-1,drink:7},
  tabs:[[6,9],[14,9],[22,9],[6,14],[14,14],[22,14]],ent:{x:-1,z:18},ex:{x:11,z:18},cash:[2.2,-4.8],trash:[-7.5,-4],
  mz:{x:-11.4,z:1.5,dx:2.4,dz:0,rx:0,rz:-2.4},nd:{x:30,z:10,a:'E'},arrN:{x:28.4,z:10},pd:{x:-28,z:0,a:'W'},arrP:{x:-26.4,z:0},start:[-12,-4]}];
const KEY='restaurantEmpireSave_v4',BAK=KEY+'_bak',CKEY='restaurantEmpireCash_v4',OLDKEYS=['restaurantEmpireSave_v3','restaurantEmpireSave_v2'];
const num=v=>Number.isFinite(+v)&&+v>0?+v:0;
const rj=k=>{try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}};
const okSave=o=>o&&typeof o==='object'&&Array.isArray(o.b)&&o.b.length>0?o:null;
/* Load order: main save, backup copy (whichever is newer), then older save formats so nobody loses money after an update. */
let SV=okSave(rj(KEY));{const bk=okSave(rj(BAK));if(bk&&(!SV||(+bk.ts||0)>(+SV.ts||0)))SV=bk;}
if(!SV)for(const k of OLDKEYS){const o=okSave(rj(k));if(o){SV=o;break;}}
if(!SV)SV={br:0,mx:0,ps:0,pc:0,b:[],pos:null,arr:null,st:1};
if(SV.cash!==undefined&&!SV.b.some(o=>o&&o.cash!==undefined)){ // old format: one global wallet + tier objects -> move the wallet into the hotel you were in
 const cur=Math.max(0,Math.floor(num(SV.br)));let ps=0,pc=0;
 SV.b=SV.b.map((o,j)=>{const t=o&&typeof o==='object'?o:{},sum=Object.keys(t).reduce((a,k)=>a+(Number.isFinite(+t[k])?+t[k]:0),0);ps=Math.max(ps,t.ps|0);pc=Math.max(pc,t.pc|0);
  return{cash:j===cur?num(SV.cash):0,pile:j===cur?num(SV.pile):0,step:Math.min(11,Math.round(sum/29*11)),tx:0};});SV.ps=ps;SV.pc=pc;}
// every hotel keeps its OWN cash, uncollected cash pile, build step and extra-table count
SV.b=Array.from({length:NB},(_,i)=>{const o=SV.b&&SV.b[i];return{cash:num(o&&o.cash),pile:num(o&&o.pile),step:o&&o.nv?Math.min(15,Math.floor(num(o.step))):[0,1,2,3,4,5,6,13,13,13,14,15][Math.min(11,Math.floor(num(o&&o.step)))],nv:1,tx:Math.min(3,Math.floor(num(o&&o.tx))),hp:(Array.isArray(o&&o.hp)?o.hp:Array.from({length:Math.min(3,Math.floor(num(o&&o.rc)))},()=>1)).slice(0,7).map(v=>Math.min(7,Math.max(1,Math.floor(num(v))))),tl:Math.min(2,Math.floor(num(o&&o.tl))),z2:o&&o.z2?1:0,zt:Math.min(6,Math.floor(num(o&&o.zt))),bz:o&&o.bz?1:0,bt:Math.min(6,Math.floor(num(o&&o.bt))),sd:o&&o.sd?1:0,ps:Math.min(7,Math.floor(num(o&&o.ps!==undefined?o.ps:i===0?SV.ps:0))),pc:Math.min(7,Math.floor(num(o&&o.pc!==undefined?o.pc:i===0?SV.pc:0))),pu:Math.min(7,Math.floor(num(o&&o.pu!==undefined?o.pu:i===0?SV.pu:0)))};});
delete SV.ps;delete SV.pc;delete SV.pu; // player upgrades are per-hotel now (T.ps/T.pc/T.pu)
SV.mx=Math.min(NB-1,Math.floor(num(SV.mx)));SV.ws=Math.min(3,Math.floor(num(SV.ws)));SV.wc=Math.min(3,Math.floor(num(SV.wc)));{const mu=SV.mu||{};SV.mu={c:Math.min(2,Math.floor(num(mu.c))),g:Math.min(3,Math.floor(num(mu.g))),d:Math.min(8,Math.floor(num(mu.d))),p:Math.min(3,Math.floor(num(mu.p))),w:Math.min(2,Math.floor(num(mu.w)))};} // machine upgrade levels (grill / drinks / packing)
// player level / XP / gems are global (shared by all hotels). Old saves without them start at Level 1, 0 XP, 0 gems.
SV.pl=Math.max(1,Math.floor(num(SV.pl)));SV.px=num(SV.px);SV.gems=Math.floor(num(SV.gems));const OFF_AWAY=SV.act?Math.max(0,Date.now()-num(SV.act))/1000:0;SV.dl=String(SV.dl||'');SV.snd=SV.snd===0?0:1;SV.ro=Math.min(3,Math.floor(num(SV.ro)));{const m=SV.ms,ok=m&&Array.isArray(m.a)&&Array.isArray(m.p)&&Array.isArray(m.c)&&m.a.length===m.p.length&&m.a.length===m.c.length&&m.a.every(k=>['build','serve','clean','car','time'].includes(k));SV.ms=ok?{d:String(m.d||''),a:m.a,p:m.p.map(num),c:m.c.map(x=>x?1:0)}:{d:'',a:[],p:[],c:[]};} // daily missions, daily reward day, sound, last-active time (offline earnings)
const BI=Math.min(NB-1,Math.max(0,Math.floor(num(SV.br)))),B0=BR[BI],M=B0.m,T=SV.b[BI],LI=[0,1,2,3,4,5,6,3,4,0][BI],L=LAY[LI];SV.br=BI;if(SV.st){delete SV.st;} // new player: NO starter cash (steps 1-3 are free)
/* ===== DINING ZONE 2 (kind 0, 16x12) + BOOTH ZONE (kind 1, 16x14): two extra rooms bolted onto the hotel floor plan. Each hotel gets its own site (hotels that share a floor plan pick different sites), always >=4 away from every door / entrance / exit. Original floor = L.r0 (main-floor pads and decor keep using it). ===== */
const ZA=[null,null];
{L.r0=L.r0||L.rects.slice();
 const cs=rs=>{const s=new Set();rs.forEach(([a,b,c,d])=>{for(let i=a/2;i<c/2;i++)for(let j=b/2;j<d/2;j++)s.add(i+','+j);});return s;};
 const keep=[L.ent,L.ex].concat(L.nd?[L.nd]:[],L.pd?[L.pd]:[]);
 let q0=1e9,q1=-1e9,q2=-1e9;L.r0.forEach(([a,b,c,d])=>{q0=Math.min(q0,a);q1=Math.max(q1,c);q2=Math.max(q2,d);});
 for(let kind=0;kind<2;kind++){
  const W=16,D=kind?14:12,all=cs(L.rects),all0=cs(L.r0),aA=(kind&&ZA[0])?cs([[ZA[0].x0,ZA[0].z0,ZA[0].x1,ZA[0].z1]]):new Set(),out=[];
  for(let x0=q0-W-(kind?W:0);x0<=q1+(kind?W:0);x0+=2)for(let z0=L.nz+8;z0<=q2;z0+=2){
   const x1=x0+W,z1=z0+D,sh=[{l:[0,1e9,-1e9],r:[0,1e9,-1e9]},{l:[0,1e9,-1e9],r:[0,1e9,-1e9]}];let ok=true,zs=0;
   const add=(o,j)=>{o[0]++;o[1]=Math.min(o[1],2*j);o[2]=Math.max(o[2],2*j+2);};
   for(let i=x0/2;i<x1/2&&ok;i++)for(let j=z0/2;j<z1/2;j++){
    if(all.has(i+','+j)){ok=false;break;}
    if(i===x0/2){if(all0.has((i-1)+','+j))add(sh[0].l,j);if(aA.has((i-1)+','+j))add(sh[1].l,j);}
    if(i===x1/2-1){if(all0.has((i+1)+','+j))add(sh[0].r,j);if(aA.has((i+1)+','+j))add(sh[1].r,j);}
    if(j===z0/2&&all.has(i+','+(j-1)))zs++;
    if(j===z1/2-1&&all.has(i+','+(j+1)))zs++;}
   if(!ok||(kind&&zs))continue; // booth room needs two free long walls (north + south)
   let par=0,s=null,left=true;
   for(const p of [0,1]){const a=sh[p];if(a.l[0]>=3||a.r[0]>=3){par=p;left=a.l[0]>=a.r[0];s=left?a.l:a.r;break;}}
   if(!s)continue;
   if(keep.some(k=>Math.hypot(Math.max(x0-k.x,0,k.x-x1),Math.max(z0-k.z,0,k.z-z1))<4))continue;
   out.push({x0,z0,x1,z1,W,D,left,zmin:s[1],zmax:s[2],par});}
  if(!out.length)continue;
  const n=out.length,idx=(((LI*3+kind*2)%n)+(BI>=5?Math.floor(n/2):0))%n;
  ZA[kind]=out[idx];L.rects.push([ZA[kind].x0,ZA[kind].z0,ZA[kind].x1,ZA[kind].z1]);}}
const SCZ=2.3,CRAD=1.1,stZ=(k,Lp=L)=>k==='counter'?Lp.nz+5:Lp.nz+1.4; // SCZ = serving circle sits SCZ behind the counter (toward the wall), CRAD = circle radius
{const cm=rj(CKEY);if(cm&&cm.br===BI&&(+cm.ts||0)>(+SV.ts||0)){T.cash=num(cm.cash);T.pile=num(cm.pile);}} // tiny cash-only mirror, written on every cash change
let ACT=0,cash=T.cash,pile=T.pile,player=null,traveling=false,dirty=false,saveT=0,lastC=cash,lastP=pile;
/* Saves cash (wallet + any money already put into a pad that is not finished) + uncollected pile + build step + position + level/xp/gems, in three separate writes so one failing write never blocks the others. */
function save(){if(window.__wipe)return;let j;try{T.cash=Math.round((cash+pads.reduce((a,q)=>a+q.paid,0))*100)/100;T.pile=Math.round(pile*100)/100;SV.ts=Date.now();if(ACT)SV.act=ACT;
 if(player&&!traveling)SV.pos={br:BI,x:+player.position.x.toFixed(2),z:+player.position.z.toFixed(2)};j=JSON.stringify(SV);}catch(e){return;}
 try{localStorage.setItem(KEY,j);}catch(e){}try{localStorage.setItem(BAK,j);}catch(e){}
 try{localStorage.setItem(CKEY,JSON.stringify({br:BI,cash:T.cash,pile:T.pile,ts:SV.ts}));}catch(e){}}
setInterval(save,1500);['pagehide','beforeunload','freeze','blur'].forEach(ev=>addEventListener(ev,save));document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});

/* ================= renderer / camera (cozy zoom) ================= */
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.setClearColor(0x6ab73a);
document.body.prepend(renderer.domElement);
const scene=new THREE.Scene(),cam=new THREE.OrthographicCamera(-1,1,1,-1,.1,300),camOff=new THREE.Vector3(11,19,11),camT=new THREE.Vector3(0,0,0);
let follow=.6;
/* close-up camera: about 13 world units across the shorter screen side (portrait: 13 wide). Landscape keeps the same zoom: 13 units tall. */
const ZOOM=13;
function fit(){const a=innerWidth/innerHeight,Z=ZOOM*1.25,w=a<1?Z:Z*a,h=w/a;follow=1;const sh=-h*.03;cam.left=-w/2;cam.right=w/2;cam.top=h/2+sh;cam.bottom=-h/2+sh;cam.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);}
addEventListener('resize',fit);fit();
/* Studio lighting: warm key light with soft shadows, sky/ground hemisphere bounce and a cool fill. Fake ambient occlusion comes from the soft contact blobs (aoBlob). */
scene.add(new THREE.HemisphereLight(0xfff0d6,0xffb36b,.98));
scene.add(new THREE.AmbientLight(0xffdcb4,.4));
const sun=new THREE.DirectionalLight(0xffe0b0,.9);sun.position.set(12,24,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{left:-30,right:30,top:30,bottom:-30,near:1,far:90});sun.shadow.bias=-.0006;sun.shadow.normalBias=.02;scene.add(sun,sun.target);
const fill=new THREE.DirectionalLight(0xffd9b8,.22);fill.position.set(-14,10,-10);scene.add(fill);
{const gr=new THREE.Mesh(new THREE.PlaneGeometry(1500,1500),new THREE.MeshStandardMaterial({color:0x6ab73a,roughness:1}));gr.rotation.x=-Math.PI/2;gr.position.y=-.31;gr.receiveShadow=true;scene.add(gr);}

/* ================= helpers ================= */
const mc={},gc={},gm={},sm={};
const _hsl={h:0,s:0,l:0};
const satc=(c,k=1.32)=>{const o=new THREE.Color(c);o.getHSL(_hsl);if(_hsl.s>.08)o.setHSL(_hsl.h,Math.min(1,_hsl.s*k),Math.min(.9,_hsl.l*1.03));return o;};
const mat=c=>mc[c]||(mc[c]=new THREE.MeshStandardMaterial({color:satc(c),roughness:.85,flatShading:true}));
const shiny=c=>sm[c]||(sm[c]=new THREE.MeshStandardMaterial({color:c,roughness:.3,metalness:.5,emissive:c,emissiveIntensity:.28,flatShading:true}));
const gmat=c=>gm[c]||(gm[c]=new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.9}));
const G=(k,f)=>gc[k]||(gc[k]=f());
function add(geo,p,c,x,y,z){const m=new THREE.Mesh(geo,mat(c));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;p.add(m);return m;}
const box=(p,w,h,d,c,x,y,z)=>add(G('b'+w+','+h+','+d,()=>new THREE.BoxGeometry(w,h,d)),p,c,x,y,z);
const cyl=(p,rt,rb,h,c,x,y,z,s=12)=>add(G('c'+[rt,rb,h,s],()=>new THREE.CylinderGeometry(rt,rb,h,s)),p,c,x,y,z);
const sph=(p,r,c,x,y,z)=>add(G('s'+r,()=>new THREE.SphereGeometry(r,10,8)),p,c,x,y,z);
function glow(p,w,h,d,c,x,y,z){const o=new THREE.Mesh(G('b'+w+','+h+','+d,()=>new THREE.BoxGeometry(w,h,d)),gmat(c));o.position.set(x,y,z);p.add(o);return o;}
function ring(x,z,col=0xffffff,r=1.05){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,.03,24),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.3}));m.position.set(x,.02,z);scene.add(m);return m;}
function limb(p,w,h,d,c,x,y,z){const g=new THREE.Group();g.position.set(x,y,z);box(g,w,h,d,c,0,-h/2,0);p.add(g);return g;}
function padLabel(sc=.66){const c=document.createElement('canvas');c.width=288;c.height=216;const t=new THREE.CanvasTexture(c);
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));s.scale.set(3.6*sc,2.7*sc,1);s.renderOrder=10;
 const fit=(x,txt,max,min,w)=>{let fs=max;do{x.font='800 '+fs+'px "Baloo 2",Trebuchet MS,sans-serif';fs-=2;}while(x.measureText(txt).width>w&&fs>=min);};
 s.draw=(a,b,u)=>{const x=c.getContext('2d');x.clearRect(0,0,288,216);x.textAlign='center';x.lineJoin='round';x.lineWidth=9;x.strokeStyle='#3b2200';
  fit(x,a,40,18,268);x.fillStyle='#fff';x.strokeText(a,144,46);x.fillText(a,144,46);
  fit(x,b,64,30,268);x.fillStyle='#ffd23f';x.strokeText(b,144,112);x.fillText(b,144,112);
  if(u){fit(x,u,30,16,276);x.lineWidth=7;x.fillStyle='#b8ffc9';x.strokeText(u,144,166);x.fillText(u,144,166);}t.needsUpdate=true;};return s;}
function label(sc=1){const c=document.createElement('canvas');c.width=256;c.height=128;const t=new THREE.CanvasTexture(c);
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));s.scale.set(3.2*sc,1.6*sc,1);s.renderOrder=10;
 s.draw=(a,b)=>{const x=c.getContext('2d');x.clearRect(0,0,256,128);x.textAlign='center';x.lineWidth=8;x.lineJoin='round';x.strokeStyle='#3b2200';
  let fs=36;x.font='800 '+fs+'px "Baloo 2",Trebuchet MS,sans-serif';while(x.measureText(a).width>232&&fs>18){fs-=2;x.font='800 '+fs+'px "Baloo 2",Trebuchet MS,sans-serif';}x.fillStyle='#fff';x.strokeText(a,128,48);x.fillText(a,128,48);
  x.font='800 52px "Baloo 2",Trebuchet MS,sans-serif';x.fillStyle='#ffd23f';x.strokeText(b,128,106);x.fillText(b,128,106);t.needsUpdate=true;};return s;}
function decal(txt,x,z,w){const c=document.createElement('canvas');c.width=512;c.height=96;const g=c.getContext('2d');g.fillStyle='rgba(255,255,255,.5)';g.fillRect(0,0,512,96);g.fillStyle='#3b2200';g.font='800 50px "Baloo 2",Trebuchet MS,sans-serif';g.textAlign='center';g.fillText(txt,256,66);
 const m=new THREE.Mesh(new THREE.PlaneGeometry(w,w*96/512),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true}));m.rotation.x=-Math.PI/2;m.position.set(x,.04,z);scene.add(m);}

/* ================= asset loader hooks (drop-in .glb / textures) =================
   Everything is generated from primitives by default. To use real art without touching game code, define BEFORE this script:
     window.RestaurantAssets={models:{player:gltf.scene,car:...},textures:{floor:texture}}
   or call RestaurantAssets.register('name',object3D) / registerTexture('floor',tex) / loadGLTF('name','x.glb') (needs GLTFLoader on the page) and reload.
   Names: player, worker, customer, car, scooter, table, trash, item_<b|d|k>[_<hotel 0-9>], station_<grill|counter|pack|drink|win>_<look 0-3>; textures: floor, wall.
   Custom models face +Z, stand on y=0 and only replace the visual mesh - game logic is untouched. */
const Assets={models:{},textures:{},
 register(n,o){this.models[n]=o;return this;},registerTexture(n,t){this.textures[n]=t;return this;},has(n){return !!this.models[n];},
 clone(n){const o=this.models[n];if(!o||!o.clone)return null;const c=o.clone(true);c.traverse(m=>{if(m.isMesh)m.castShadow=m.receiveShadow=true;});return c;},
 loadGLTF(n,url){return new Promise(res=>{if(!THREE.GLTFLoader){console.warn('GLTFLoader not loaded; keeping built-in mesh for',n);return res(null);}new THREE.GLTFLoader().load(url,g=>{this.register(n,g.scene);res(g.scene);},undefined,e=>{console.warn('Could not load',url,e);res(null);});});}};
{const pre=window.RestaurantAssets;if(pre){Object.assign(Assets.models,pre.models||{});Object.assign(Assets.textures,pre.textures||{});}}
window.RestaurantAssets=Assets;
const mtx={};const matTex=(c,n)=>{const k=c+'|'+n;return mtx[k]||(mtx[k]=new THREE.MeshStandardMaterial({color:c,map:Assets.textures[n],roughness:.85}));};
const useCustom=(bd,name)=>{const cm=Assets.clone(name);if(!cm)return;bd.children.slice().forEach(c=>{c.visible=false;});bd.add(cm);};
/* soft contact shadow blobs = cheap ambient occlusion */
const aoTex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),gr=g.createRadialGradient(32,32,2,32,32,32);gr.addColorStop(0,'rgba(0,0,0,.6)');gr.addColorStop(.55,'rgba(0,0,0,.25)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);})();
const aoGeo=new THREE.PlaneGeometry(1,1),aoMats={};
function aoBlob(parent,x,z,w,d,op=1){const k=op;const m=new THREE.Mesh(aoGeo,aoMats[k]||(aoMats[k]=new THREE.MeshBasicMaterial({map:aoTex,transparent:true,depthWrite:false,opacity:op})));m.rotation.x=-Math.PI/2;m.scale.set(w,d,1);m.position.set(x,.014,z);m.renderOrder=1;parent.add(m);return m;}
/* particles: one pooled set of tiny cubes for every pop / burst / confetti */
const PN=160,parts=[];{const pg=new THREE.BoxGeometry(.15,.15,.15);for(let i=0;i<PN;i++){const m=new THREE.Mesh(pg,new THREE.MeshBasicMaterial({color:0xffffff,transparent:true}));m.visible=false;scene.add(m);parts.push({m,life:0,max:1,vx:0,vy:0,vz:0,s:1});}}
let pIdx=0;
function burst(x,y,z,col,n=10,sp=3,up=4,size=1){for(let k=0;k<n;k++){const p=parts[pIdx++%PN],a=Math.random()*6.283,r=Math.random()*sp;p.m.visible=true;p.m.position.set(x,y,z);p.m.material.color.setHex(Array.isArray(col)?pick(col):col);p.vx=Math.cos(a)*r;p.vz=Math.sin(a)*r;p.vy=up*(.5+Math.random()*.7);p.life=p.max=.55+Math.random()*.45;p.s=size*(.6+Math.random()*.8);p.m.scale.setScalar(p.s);p.m.material.opacity=1;}}
function updParts(dt){for(const p of parts){if(p.life<=0)continue;p.life-=dt;if(p.life<=0){p.m.visible=false;continue;}p.vy-=11*dt;const q=p.m.position;q.x+=p.vx*dt;q.y+=p.vy*dt;q.z+=p.vz*dt;if(q.y<.08){q.y=.08;p.vy*=-.35;p.vx*=.7;p.vz*=.7;}const k=p.life/p.max;p.m.scale.setScalar(p.s*(.3+.7*k));p.m.material.opacity=Math.min(1,k*2.2);}}
/* timed effects: shockwave rings, flying bills and plates */
const fxl=[];
function addFx(m,dur,upd,end,delay=0){scene.add(m);fxl.push({m,t:-delay,dur,upd,end});}
function updFx(dt){for(let i=fxl.length-1;i>=0;i--){const f=fxl[i];f.t+=dt;if(f.t<0)continue;const k=Math.min(1,f.t/f.dur);f.upd(k,f.m);if(k>=1){scene.remove(f.m);fxl.splice(i,1);if(f.end)f.end();}}}
function shoot(m,a,b,dur,arc,end,delay=0){m.visible=false;m.position.set(a.x,a.y,a.z);addFx(m,dur,(k,o)=>{o.visible=true;o.position.set(a.x+(b.x-a.x)*k,a.y+(b.y-a.y)*k+Math.sin(k*Math.PI)*arc,a.z+(b.z-a.z)*k);o.rotation.y=k*9;o.rotation.x=k*4;},end,delay);}
/* flyItem: any hand-over (take / give / pack / bin) shows the item flying through the air instead of vanishing. a/b = world {x,y,z}. */
const hdp=p=>({x:p.x,y:2.9,z:p.z});
function flyItem(t,a,b,dur=.3,arc=1.2,end=null,delay=0){const m=makeItem(t);m.scale.setScalar(t==='k'?1.3:1);shoot(m,a,b,dur,arc,end,delay);}
const spos={g:()=>({x:G0.x,y:1.4,z:G0.z+2}),d:()=>({x:S.drink.x,y:1.4,z:S.drink.z+2}),cb:()=>({x:CT.x-.6,y:1.4,z:CT.z}),cd:()=>({x:CT.x+.2,y:1.4,z:CT.z+.1}),pi:()=>({x:S.pack.x-.7,y:1.5,z:S.pack.z}),po:()=>({x:S.pack.x+.7,y:1.6,z:S.pack.z}),w:()=>({x:S.win.x-.6,y:1.5,z:S.win.z}),tr:()=>({x:trash.x,y:1.3,z:trash.z})};
const shockGeo=new THREE.RingGeometry(.45,.6,28),billGeo=new THREE.BoxGeometry(.85,.08,.48),billMat=new THREE.MeshStandardMaterial({color:0x2fe05c,emissive:0x12a83a,emissiveIntensity:.5,roughness:.6});
/* bright, glowing cash look (tip piles on tables + cash pad) */
const billA=new THREE.MeshStandardMaterial({color:0x4dff7c,emissive:0x1fe05a,emissiveIntensity:.7,roughness:.45}),billB=new THREE.MeshStandardMaterial({color:0xa2ffba,emissive:0x35e870,emissiveIntensity:.65,roughness:.45}),bandM=new THREE.MeshStandardMaterial({color:0xfff27a,emissive:0xffd23f,emissiveIntensity:.85,roughness:.4}),tbGeo=new THREE.BoxGeometry(.92,.12,.56),tbBand=new THREE.BoxGeometry(.2,.15,.6);
const dollarTex=(()=>{const c=document.createElement('canvas');c.width=c.height=96;const x=c.getContext('2d');x.font='800 78px "Baloo 2",Trebuchet MS,sans-serif';x.textAlign='center';x.textBaseline='middle';x.lineWidth=10;x.lineJoin='round';x.strokeStyle='#3b2200';x.fillStyle='#7CFC9A';x.strokeText('$',48,52);x.fillText('$',48,52);return new THREE.CanvasTexture(c);})();
function shock(x,z,col){const m=new THREE.Mesh(shockGeo,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.85,depthWrite:false,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.set(x,.09,z);addFx(m,.65,(k,o)=>{o.scale.setScalar(1+k*5.5);o.material.opacity=.85*(1-k);},()=>{m.material.dispose();});}
/* wobbling stacks: items lag behind the carrier's movement like a springy tower, and the newest item pops in */
function animStack(g,vx,vz,tm,dt){const n=g.children.length;if(!n)return;const sp=Math.min(1,Math.hypot(vx,vz)/3),now=performance.now(),k=1-Math.exp(-dt*14);
 for(let i=0;i<n;i++){const c=g.children[i],u=c.userData,h=i+1;
  const tx=-vx*.011*i*h+Math.sin(tm*7+i*.8)*.03*sp*h*.5+Math.sin(tm*1.7+i)*.004*h,tz=-vz*.011*i*h+Math.cos(tm*6.3+i*.7)*.025*sp*h*.5;
  c.position.x+=(tx-c.position.x)*k;c.position.z+=(tz-c.position.z)*k;c.rotation.z=-c.position.x*.9;c.rotation.x=c.position.z*.9;
  if(u.t0){const a=Math.min(1,(now-u.t0)/190),e=1+2.70158*Math.pow(a-1,3)+1.70158*Math.pow(a-1,2);c.scale.setScalar(.35+.65*e);if(a>=1)u.t0=0;}}}

/* ================= food items ================= */
const STEP={b:[.34,.14,.36,.22,.34,.34,.5,.3,.32,.34][BI],k:[.44,.17,.46,.42,.32,.4,.34,.32,.34,.34][BI],d:.5,w:.16,s:.4};STEP.K=STEP.k; // 'K' = takeaway bag that also holds a side item
const tor=(p,R,r,c,x,y,z)=>{const m=add(G('t'+R+','+r,()=>new THREE.TorusGeometry(R,r,6,16)),p,c,x,y,z);m.rotation.x=Math.PI/2;return m;};
/* Packaged order, one look per hotel (BI): burger box, pizza box, kagaz ka thaila (samosa / jalebi), bhatura dabba, noodle carton, biryani dabba,
   roll paper (egg roll / dosa), mithai box. Returns the hinged lid group (closed = rotation 0, open = rotation.x -2.1) so the packing station can animate it. */
function mkPack(g){const lid=new THREE.Group(),H=(py,pz)=>{lid.position.set(0,py,pz);g.add(lid);},bX=(w,h,d,c,x,y,z)=>box(g,w,h,d,c,x,y,z),lX=(w,h,d,c,x,y,z)=>box(lid,w,h,d,c,x,y,z),hz=m=>{m.rotation.z=Math.PI/2;return m;};
 if(BI===0){bX(.62,.3,.46,0xd62828,0,.15,0);bX(.64,.04,.48,0xfff3d6,0,.28,0);H(.3,-.23);lX(.62,.1,.46,0xfff3d6,0,.05,.23);cyl(lid,.1,.1,.02,B0.c,0,.11,.23,10);}
 else if(BI===1){bX(.64,.07,.64,0xe9d3a3,0,.035,0);H(.07,-.32);lX(.64,.06,.64,0xf4e4c1,0,.03,.32);lX(.5,.02,.14,0xd62828,0,.065,.32);}
 else if(BI===2){bX(.46,.38,.3,0xc8a165,0,.19,0);bX(.2,.1,.31,0xd62828,0,.2,0);H(.38,-.15);lX(.46,.04,.22,0xb88a4f,0,.02,.12);}
 else if(BI===3){bX(.46,.34,.3,0xfff0d9,0,.17,0);bX(.47,.06,.31,0xff8c00,0,.12,0);bX(.47,.06,.31,0xff8c00,0,.26,0);H(.34,-.15);lX(.46,.04,.22,0xffd166,0,.02,.12);}
 else if(BI===4){bX(.6,.18,.42,0xb08a55,0,.09,0);H(.18,-.21);lX(.6,.08,.42,0xf2e6c8,0,.04,.21);lX(.3,.04,.2,0xd62828,0,.1,.21);}
 else if(BI===5){cyl(g,.26,.2,.34,0xd62828,0,.17,0,8);cyl(g,.25,.25,.05,0xffffff,0,.14,0,8);H(.34,-.26);cyl(lid,.26,.26,.05,0xd62828,0,.025,.26,8);lX(.5,.03,.04,0x7a7a82,0,.07,.26);}
 else if(BI===6){cyl(g,.3,.26,.24,0xc7ccd4,0,.12,0,14);H(.24,-.3);cyl(lid,.31,.31,.06,0xf5e6a8,0,.03,.3,14);lX(.64,.065,.07,0xd62828,0,.03,.3);}
 else if(BI===7||BI===8){hz(cyl(g,.13,.13,.62,BI===7?0xd9a441:0xe3b365,0,.14,0,8));hz(cyl(g,.18,.18,.38,0xfff3d6,0,.14,0,10));hz(cyl(g,.185,.185,.06,BI===7?0xd62828:0x2e9e44,0,.14,0,10));H(.28,-.14);lX(.4,.03,.28,0xfff3d6,0,.015,.14);}
 else{bX(.6,.22,.46,0x5f0f40,0,.11,0);H(.22,-.23);lX(.62,.08,.48,0xd4af37,0,.04,.23);lX(.08,.09,.5,0xff3b6b,0,.045,.23);lX(.64,.09,.08,0xff3b6b,0,.045,.23);}
 return lid;}
function makeItem(t){const g=new THREE.Group();{const cm=Assets.clone('item_'+t+'_'+BI)||Assets.clone('item_'+t);if(cm)return cm;}
 if(t==='k'){mkPack(g);return g;}
 if(t==='K'){mkPack(g);const sd=makeItem('s');sd.scale.setScalar(.6);sd.position.set(0,.36,0);g.add(sd);return g;} // bag + side item
 if(t==='d'){ // one distinct drink per hotel (BI)
  if(BI===0){cyl(g,.27,.2,.46,0xd6f0ff,0,.23,0,12);cyl(g,.25,.19,.34,0xef476f,0,.19,0,12);box(g,.13,.13,.13,0xffffff,-.05,.44,.04).rotation.set(.4,.5,.2);box(g,.12,.12,.12,0xffffff,.09,.42,-.06).rotation.set(.2,.8,.4);box(g,.05,.55,.05,0x3a86ff,.08,.55,0).rotation.z=-.15;}
  else if(BI===1){cyl(g,.17,.17,.34,0x2e9e44,0,.17,0,10);cyl(g,.08,.17,.14,0x2e9e44,0,.41,0,10);cyl(g,.07,.07,.12,0x2e9e44,0,.54,0,10);cyl(g,.09,.09,.05,0xd62828,0,.62,0,8);cyl(g,.175,.175,.12,0xffffff,0,.2,0,10);}
  else if(BI===2){cyl(g,.27,.17,.4,0xb5651d,0,.2,0,9);tor(g,.26,.03,0x8a4b1a,0,.4,0);cyl(g,.24,.24,.02,0xc98a4b,0,.38,0,12);cyl(g,.18,.18,.03,0xe9d3a3,0,.4,0,12);}
  else if(BI===3){cyl(g,.34,.34,.04,0xfff3d6,0,.02,0,14);cyl(g,.25,.18,.28,0xfff8e7,0,.18,0,12);cyl(g,.22,.22,.02,0xb5651d,0,.31,0,12);tor(g,.26,.025,0xd4af37,0,.32,0).rotation.x=Math.PI/2;const h=tor(g,.1,.03,0xfff8e7,.27,.2,0);h.rotation.set(0,0,0);}
  else if(BI===4){const m=cyl(g,.25,.2,.46,0xc7ccd4,0,.23,0,12);m.material=shiny(0xc7ccd4);cyl(g,.255,.255,.04,0x9aa0a8,0,.42,0,12).material=shiny(0x9aa0a8);const f=sph(g,.25,0xffffff,0,.46,0);f.scale.set(1,.55,1);sph(g,.12,0xffffff,.1,.58,.04);sph(g,.1,0xfdfdfd,-.1,.57,-.03);}
  else if(BI===5){cyl(g,.34,.34,.04,0xffffff,0,.02,0,14);cyl(g,.28,.19,.26,0xffffff,0,.17,0,12);cyl(g,.285,.285,.04,0x3a86ff,0,.26,0,12);cyl(g,.24,.24,.02,0xc2753a,0,.3,0,12);const h=tor(g,.1,.03,0xffffff,.3,.19,0);h.rotation.set(0,0,0);box(g,.02,.3,.02,0xeeeeee,-.1,.42,0).rotation.z=.35;box(g,.14,.1,.02,0xffd23f,-.2,.58,0);}
  else if(BI===6){const k=cyl(g,.34,.2,.22,0xc7ccd4,0,.11,0,14);k.material=shiny(0xc7ccd4);tor(g,.34,.03,0xdfe3e8,0,.22,0);cyl(g,.31,.31,.03,0xfffdf2,0,.2,0,14);[[.1,.08],[-.12,0],[0,-.12],[.05,.14]].forEach(([x,z])=>sph(g,.04,0x2e9e44,x,.24,z));box(g,.06,.04,.06,0xd62828,-.06,.23,.1);}
  else if(BI===7){const c=cyl(g,.18,.18,.46,0xd62828,0,.23,0,12);c.material=shiny(0xd62828);cyl(g,.17,.18,.03,0xc7ccd4,0,.47,0,12).material=shiny(0xc7ccd4);cyl(g,.185,.185,.1,0xffffff,0,.26,0,12);box(g,.12,.02,.07,0x9aa0a8,0,.5,0);}
  else if(BI===8){const dv=cyl(g,.34,.26,.14,0xc7ccd4,0,.07,0,14);dv.material=shiny(0xc7ccd4);cyl(g,.3,.3,.02,0x6b3a12,0,.13,0,14);const tb=cyl(g,.19,.16,.36,0xc7ccd4,0,.28,0,12);tb.material=shiny(0xc7ccd4);cyl(g,.18,.18,.03,0xe9d3a3,0,.46,0,12);}
  else{cyl(g,.27,.18,.5,0xff9ec4,0,.25,0,12);cyl(g,.25,.17,.14,0xffffff,0,.1,0,12);cyl(g,.25,.2,.12,0xe63988,0,.26,0,12);const ic=sph(g,.22,0xfff3f7,0,.56,0);ic.scale.set(1,.8,1);sph(g,.07,0xd62828,.04,.78,0);box(g,.04,.6,.04,0xffd23f,.12,.62,0).rotation.z=-.2;}
  return g;}
 if(t==='s'){ // SIDE ITEM, one look per hotel (BI): fries, garlic bread, chai + samosa, chai, pyaaz-achaar, spring roll, salan/mirchi, cold coffee, vada, rabri
  const pl=(c=0xffffff)=>cyl(g,.34,.3,.04,c,0,.02,0,12);
  if(BI===0){box(g,.34,.26,.2,0xd62828,0,.13,0);[-.1,-.03,.04,.1].forEach((x,i)=>box(g,.05,.22,.05,0xffd23f,x,.34+(i&1)*.04,(i-1.5)*.03));}
  else if(BI===1){pl();[-.1,.12].forEach(z=>{box(g,.5,.1,.16,0xe3b365,0,.1,z);box(g,.4,.02,.08,0x7cb342,0,.16,z);});}
  else if(BI===2){cyl(g,.34,.3,.04,0xfff3d6,0,.02,0,12);cyl(g,.12,.09,.2,0xd6f0ff,-.14,.14,-.04,10);cyl(g,.105,.085,.14,0xb5651d,-.14,.12,-.04,10);cyl(g,0,.16,.16,0xd9a441,.14,.1,.06,3);} // chai glass + samosa
  else if(BI===3){cyl(g,.3,.3,.03,0xffffff,0,.015,0,12);cyl(g,.16,.13,.28,0xd6f0ff,0,.17,0,10);cyl(g,.15,.12,.2,0xc2753a,0,.15,0,10);cyl(g,.15,.15,.02,0xe9d3a3,0,.26,0,10);box(g,.03,.3,.03,0xc7ccd4,.08,.3,0).rotation.z=-.3;} // cutting chai glass
  else if(BI===4){pl();[[-.12,.06],[.1,.1],[.02,-.12]].forEach(([x,z])=>tor(g,.1,.03,0xc77dff,x,.08,z));cyl(g,.03,.03,.3,0x2e9e44,.16,.1,-.1,6).rotation.z=Math.PI/2;box(g,.14,.06,.1,0xffd23f,-.18,.07,-.14);}
  else if(BI===5){pl();[-.08,.1].forEach(z=>{cyl(g,.07,.07,.4,0xd9a441,0,.09,z,8).rotation.z=Math.PI/2;sph(g,.05,0x7cb342,.2,.09,z);});cyl(g,.08,.06,.07,0xd62828,.22,.07,-.2,8);} // spring rolls + sauce
  else if(BI===6){cyl(g,.3,.2,.22,0xc7ccd4,0,.11,0,12);cyl(g,.27,.27,.02,0x8a4b1f,0,.2,0,12);[[-.1,.05],[.1,-.05],[0,.12]].forEach(([x,z])=>{box(g,.14,.04,.05,0x2e9e44,x,.23,z).rotation.y=x*6;});}
  else if(BI===7){cyl(g,.18,.15,.4,0xd6f0ff,0,.2,0,12);cyl(g,.17,.14,.3,0x8a5a3a,0,.17,0,12);const w=sph(g,.15,0xffffff,0,.4,0);w.scale.y=.6;box(g,.04,.5,.04,0x3a86ff,.07,.5,0).rotation.z=-.15;} // cold coffee
  else if(BI===8){cyl(g,.34,.3,.04,0x3a7d44,0,.02,0,12);[[-.14,.06],[.12,.08],[0,-.12]].forEach(([x,z])=>tor(g,.1,.05,0xc98a2b,x,.08,z));cyl(g,.08,.06,.07,0xd9822b,.22,.07,-.18,8);} // medu vada + sambar
  else{cyl(g,.28,.18,.2,0xd4af37,0,.1,0,14);cyl(g,.25,.25,.03,0xfff3d6,0,.2,0,14);[[.08,.06],[-.1,.04],[0,-.1]].forEach(([x,z])=>sph(g,.04,0x6ab04c,x,.24,z));sph(g,.035,0xff3b6b,.02,.25,.1);} // rabri bowl
  return g;}
 if(t==='w'){cyl(g,.34,.28,.05,0xffffff,0,.03,0,12);cyl(g,.2,.2,.02,0xe9eef3,0,.07,0,12);cyl(g,.12,.12,.05,0xd62828,.06,.1,.05,6);return g;} // dirty plates (waste)
 if(BI===0){cyl(g,.38,.4,.12,0xd9893b,0,.06,0,10);cyl(g,.4,.4,.08,0x7a3b1d,0,.16,0,10);cyl(g,.43,.43,.04,0x5fcf4a,0,.22,0,10);cyl(g,.36,.38,.14,0xe09a4c,0,.31,0,10);}
 else if(BI===1){cyl(g,.42,.42,.08,0xf4c542,0,.04,0,3);[[.15,.05],[-.1,.12],[.02,-.15]].forEach(([x,z])=>cyl(g,.07,.07,.04,0xd62828,x,.1,z,6));}
 else if(BI===2){cyl(g,.46,.46,.05,0xc98a2b,0,.025,0,3);cyl(g,0,.46,.46,0xd9a441,0,.28,0,3);cyl(g,.13,.1,.1,0x2ecc71,.4,.05,.24,8);}
 else if(BI===3){tor(g,.3,.075,0xff8c00,0,.08,0);tor(g,.2,.075,0xffa62b,0,.15,0);tor(g,.1,.075,0xffc233,0,.22,0);}
 else if(BI===4){const b=sph(g,.3,0xe3a857,-.12,.2,.05);b.scale.set(1.3,.6,1.1);cyl(g,.22,.14,.2,0xb5442c,.3,.1,-.05,10);[[.26,-.02],[.34,.04],[.3,-.12]].forEach(([x,z])=>sph(g,.07,0xc58b3c,x,.22,z));}
 else if(BI===5){cyl(g,.32,.2,.26,0xf1f1f1,0,.13,0,12);cyl(g,.28,.28,.04,0x5a2d0c,0,.27,0,12);[[-.1,0],[.1,.05],[0,-.1]].forEach(([x,z])=>sph(g,.09,0x7b3f00,x,.34,z));
  const c1=box(g,.04,.04,.75,0xe9c46a,.12,.4,.05);c1.rotation.set(-.5,.35,0);const c2=box(g,.04,.04,.75,0xe9c46a,.2,.4,.05);c2.rotation.set(-.5,.35,0);}
 else if(BI===6){const h=sph(g,.36,0xb5651d,0,.3,0);h.scale.y=.85;cyl(g,.33,.33,.06,0x6b3a12,0,.5,0,12);cyl(g,.28,.28,.05,0xf5e6a8,0,.54,0,12);[[.1,.08],[-.12,0],[0,-.12]].forEach(([x,z])=>box(g,.14,.12,.14,0x7b3f00,x,.62,z));}
 else if(BI===7){[-.14,.14].forEach(z=>{cyl(g,.13,.13,.7,0xd9a441,0,.14,z,8).rotation.z=Math.PI/2;});}
 else if(BI===8){const d=cyl(g,.1,.22,.85,0xe3b365,0,.2,0,10);d.rotation.z=Math.PI/2;cyl(g,.12,.09,.1,0xffffff,.35,.05,.28,8);sph(g,.07,0x2ecc71,.35,.1,.28);}
 else{cyl(g,.38,.22,.16,0xd4af37,0,.08,0,12);[[-.12,-.05],[.12,-.05],[0,.12]].forEach(([x,z])=>sph(g,.12,0x5c2a0e,x,.2,z));sph(g,.04,0xfca311,0,.33,0);}
 return g;}
function stack(g,arr){const prev=g.userData.n|0,now=performance.now();while(g.children.length)g.remove(g.children[0]);let y=0,i=0;for(const t of arr){const it=makeItem(t);it.position.y=y;it.userData.t0=(i>=prev&&prev>=0&&g.userData.pop)?now:0;g.add(it);y+=STEP[t];i++;}g.userData.n=arr.length;}
const st=(g,n,t)=>stack(g,Array(Math.max(0,Math.min(n,g.userData.mx||8))).fill(t));

/* ================= building: floor, walls, doors, decor ================= */
const solids=[],pops=[],pockets=[],cells=new Set(),gaps=[L.ent,L.ex];
if(L.nd&&BI<NB-1)gaps.push(L.nd);if(L.pd&&BI>0)gaps.push(L.pd);
const solid=(x,z,w,d)=>solids.push({x,z,hw:w/2,hd:d/2});
function pop(o,delay=0){o.scale.setScalar(.001);pops.push({o,t:-delay});}
let bx0=1e9,bx1=-1e9,bz0=1e9,bz1=-1e9;
L.rects.forEach(([x0,z0,x1,z1])=>{bx0=Math.min(bx0,x0);bx1=Math.max(bx1,x1);bz0=Math.min(bz0,z0);bz1=Math.max(bz1,z1);for(let i=x0/2;i<x1/2;i++)for(let j=z0/2;j<z1/2;j++)cells.add(i+','+j);});
const CX=(bx0+bx1)/2,CZ=(bz0+bz1)/2;
const inF=(x,z)=>cells.has(Math.floor(x/2)+','+Math.floor(z/2)),inP=(x,z)=>pockets.some(p=>x>=p.x0&&x<=p.x1&&z>=p.z0&&z<=p.z1);
const walk=(x,z)=>[[.45,0],[-.45,0],[0,.45],[0,-.45]].every(([a,b])=>inF(x+a,z+b)||inP(x+a,z+b));
function deco(mx,mz){const i=Math.round((mx-1)/2);
 if(BI===0)box(scene,2,.22,.1,0xffffff,mx,1.4,mz+.2);
 else if(BI===1){box(scene,2.1,.1,.1,0x8e2a1f,mx,.8,mz+.2);box(scene,2.1,.1,.1,0x8e2a1f,mx,1.6,mz+.2);}
 else if(BI===2){glow(scene,.35,.35,.35,0xffa200,mx,2.1,mz+.5);}
 else if(BI===3)box(scene,.9,.35,.12,(i&1)?0xff8c00:0xffd166,mx,2.1,mz+.25);
 else if(BI===4)box(scene,1,.3,.3,(i&1)?0xffffff:0xd62828,mx,2.3,mz+.3);
 else if(BI===5){glow(scene,.35,.45,.35,0xff3b3b,mx,2.0,mz+.5);box(scene,.08,.5,.08,0xffd60a,mx,2.55,mz+.5);}
 else if(BI===6)box(scene,1.5,.14,.28,0xd4af37,mx,2.25,mz+.3);
 else if(BI===7&&(i&1)){cyl(scene,.06,.06,1.6,0x333333,mx,1.8,mz+.4,6);glow(scene,.3,.2,.3,0x00e5ff,mx,2.7,mz+.4);}
 else if(BI===8)box(scene,1.8,.2,.12,(i&1)?0x2d6a4f:0x95d5b2,mx,2.2,mz+.25);
 else if(BI===9){box(scene,1.1,.24,.2,0xffd700,mx,2.3,mz+.3);glow(scene,.16,.16,.16,0xff3b6b,mx,2.5,mz+.3);}
 wthm(1,mx,mz+.15);}
/* hotel wall theme (look only, small boxes on the inside face of the tall N / W walls): 1 Pizza = brick wall, 2 Samosa + 3 Jalebi = colourful flags, 6 Biryani = gold border, 8 Dosa = wooden rail + leaves, 9 Sweets = pink + gold jhalar. (x,z) = inner face of the wall segment. */
function wthm(hz,x,z){if(!(BI===1||BI===2||BI===3||BI===6||BI===8||BI===9))return;
 const i=Math.round(((hz?x:z)-1)/2),m6=((i%6)+6)%6,mix=(a,c,t)=>{const q=s=>Math.round(((a>>s)&255)*(1-t)+((c>>s)&255)*t);return(q(16)<<16)|(q(8)<<8)|q(0);},
  P=(w,h,t,c,dx,y)=>wb(hz,x,y,z,w,h,t,c,dx,0,.01+t/2),R=(m,a)=>{if(hz)m.rotation.z=a;else m.rotation.x=a;return m;},GD=0xd4af37,PK=0xff7fb0;
 if(BI===1){const c0=mix(B0.wl,0x000000,.22),c1=mix(B0.wl,0xffffff,.12); // brick rows, every second row shifted by half a brick
  for(let r=0;r<6;r++){const y=.55+r*.4;(r&1?[[0,.96],[-.78,.5],[.78,.5]]:[[-.52,.96],[.52,.96]]).forEach(([dx,w],k)=>P(w,.3,.05,(r+k)&1?c0:c1,dx,y));}}
 else if(BI===6){P(2.1,.1,.06,GD,0,2.66);P(2.1,.04,.05,0xf5d76e,0,2.56);P(2.1,.07,.06,GD,0,.46);
  if(m6!==4)[-.9,-.45,0,.45,.9].forEach((dx,k)=>{P(.1,.1,.05,k&1?0xf5d76e:GD,dx,2.45);P(.1,.1,.05,k&1?GD:0xf5d76e,dx,.64);});}
 else if(BI===8){P(2.1,.5,.04,mix(0x8a5a2b,B0.wl,.25),0,.62);[-.7,0,.7].forEach(dx=>P(.03,.5,.06,0x5a3a1a,dx,.62)); // wooden lower panel
  if(m6!==4){P(2.1,.09,.12,0x6b4423,0,2.42);[-.85,-.5,-.15,.2,.55,.9].forEach((dx,k)=>{P(.03,.12,.04,0x6b4423,dx,2.34);R(P(.3,.12,.05,k&1?0x3a7d44:0x7cb342,dx,2.26),k&1?.6:-.6);});}} // rail with hanging leaves
 else if(BI===9){P(2.1,.1,.08,GD,0,2.68);P(2.1,.14,.07,PK,0,2.55);
  if(m6!==4)[-.9,-.6,-.3,0,.3,.6,.9].forEach((dx,k)=>{const l=.28+(k&1)*.12;P(.04,l,.05,k&1?GD:PK,dx,2.48-l/2);P(.1,.1,.06,k&1?PK:GD,dx,2.48-l-.04);});} // hanging tassels
 else{if(m6===4)return;const C=[0xff5d8f,0xffd23f,0x2ecc71,0x3a86ff,0xff7b00,0xffffff,0xc77dff];
  (BI===3?[2.55,2.2]:[2.5]).forEach((y,rw)=>{if(rw&&(m6===1||m6===2))return;P(2.1,.025,.04,0x5b2a0c,0,y);[-.9,-.6,-.3,0,.3,.6,.9].forEach((dx,k)=>{const o=rw?.15:0;if(Math.abs(dx+o)>.98)return;R(P(.2,.2,.04,C[(k+i+rw*2+BI)%7],dx+o,y-.12),Math.PI/4);});});}} // flag bunting
/* wall decor: black-glass windows with red frames, clock, picture frame (inside faces of the tall N / W walls) */
const wb=(hz,x,y,z,w,h,t,c,dx=0,dy=0,dt=0)=>{const m=hz?box(scene,w,h,t,c,x+dx,y+dy,z+dt):box(scene,t,h,w,c,x+dt,y+dy,z+dx);m.castShadow=false;return m;};
function winD(hz,x,z){wb(hz,x,1.55,z,1.95,1.25,.07,0xd62828);wb(hz,x,1.55,z,1.65,.95,.09,0x12151b);wb(hz,x,1.55,z,.08,.95,.11,0xd62828);wb(hz,x,1.8,z,.5,.08,.1,0x3b4350,-.4,0,.01);}
function clockD(hz,x,z){const f=cyl(scene,.4,.4,.05,0x5b3a1f,hz?x:x+.02,2.1,hz?z+.02:z,20),c=cyl(scene,.34,.34,.06,0xfff8e7,hz?x:x+.04,2.1,hz?z+.04:z,20);[f,c].forEach(m=>{if(hz)m.rotation.x=Math.PI/2;else m.rotation.z=Math.PI/2;m.castShadow=false;});wb(hz,x,2.1,z,.04,.26,.03,0x222222,0,.1,.08);wb(hz,x,2.1,z,.18,.04,.03,0x222222,.07,0,.08);}
function frameD(hz,x,z){wb(hz,x,1.8,z,1.15,.85,.06,0x7a4b2a,0,0,.02);wb(hz,x,1.93,z,.95,.4,.08,0x8fd3ff,0,0,.03);wb(hz,x,1.65,z,.95,.2,.08,0x6ab73a,0,0,.03);wb(hz,x,1.95,z,.16,.16,.09,0xffd23f,.25,0,.03);}
const FLRK=BI?B0.fl[0]:0xf5b46a,FLRD=BI?B0.fl[1]:0xfdd9a0,WLC=BI?B0.wl:0xf7b57a,TRC=BI?B0.tr:0xffe066,KZ=stZ('counter')+1; // kitchen rows (up to the counter) = orange planks, everything in front = cream dining floor
const plankM=(()=>{const hx=n=>'#'+n.toString(16).padStart(6,'0'),dk=(n,k)=>{const q=s=>Math.round(((n>>s)&255)*k);return(q(16)<<16)|(q(8)<<8)|q(0);},c0=BI?hx(FLRK):'#f5b46a',c1=BI?hx(dk(FLRK,.97)):'#f2ae62',c2=BI?hx(dk(FLRK,.8)):'#d9954c',c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');for(let r=0;r<4;r++){x.fillStyle=r&1?c1:c0;x.fillRect(0,r*32,128,32);x.fillStyle=c2;x.fillRect(0,r*32,128,3);x.fillRect(r%2?40:96,r*32,3,32);}return new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(c),roughness:.85});})();
for(const k of cells){const[i,j]=k.split(',').map(Number);
 {const kit=2*j+1<KZ,fc=kit?FLRK:FLRD,ft=box(scene,2,.3,2,fc,2*i+1,-.15,2*j+1);ft.castShadow=false;if(kit)ft.material=plankM;if(Assets.textures.floor)ft.material=matTex(fc,'floor');}
 [[0,-1,'N'],[0,1,'S'],[-1,0,'W'],[1,0,'E']].forEach(([di,dj,s])=>{if(cells.has((i+di)+','+(j+dj)))return;
  const mx=s==='W'?2*i:s==='E'?2*i+2:2*i+1,mz=s==='N'?2*j:s==='S'?2*j+2:2*j+1;
  if(gaps.some(g=>Math.abs(g.x-mx)<.6&&Math.abs(g.z-mz)<.6))return;
  const h=(s==='N'||s==='W')?2.8:1,hz=(s==='N'||s==='S'),w=hz?2.1:.3,d=hz?.3:2.1,ox=s==='W'?-.15:s==='E'?.15:0,oz=s==='N'?-.15:s==='S'?.15:0;
  {const wm=box(scene,w,h,d,WLC,mx+ox,h/2,mz+oz);if(Assets.textures.wall)wm.material=matTex(WLC,'wall');}box(scene,w+.1,.2,d+.1,TRC,mx+ox,h+.1,mz+oz);if(s==='N')deco(mx,mz+oz);else if(s==='W')wthm(0,mx,mz);
  {const side=h>2?1:-1,ix=s==='W'?1:s==='E'?-1:0,iz=s==='N'?1:s==='S'?-1:0,cx=mx+ox+ix*side*.185,cz=mz+oz+iz*side*.185,bb=hz?box(scene,2.1,.2,.07,0xd62828,mx,.1,cz):box(scene,.07,.2,2.1,0xd62828,cx,.1,mz);bb.castShadow=false;} /* thin red baseboard */ if(s==='N'||s==='W'){const hzz=s==='N',m6=(((hzz?i:j)%6)+6)%6,wx=hzz?mx:mx+.04,wz=hzz?mz+.04:mz;if(m6===1)winD(hzz,wx,wz);else if(m6===4)clockD(hzz,wx,wz);else if(m6===2)frameD(hzz,wx,wz);}
  aoBlob(scene,mx+(s==='W'?.6:s==='E'?-.6:0),mz+(s==='N'?.6:s==='S'?-.6:0),hz?2.3:1.5,hz?1.5:2.3,h>2?.55:.3);});}
[L.ent,L.ex].forEach((g,n)=>{[-1.05,1.05].forEach(o=>box(scene,.35,1.9,.35,B0.t,g.x+o,.95,g.z+.15));decal(n?'EXIT':'ENTRANCE',g.x,g.z-1.2,n?2:3.4);});
/* ===== outside world: bright grass, thin sidewalk + black road with cream kerbs (drive-thru lane), small palm trees along the walls, hotel name board + awning at the entrance ===== */
function palm(x,z,sc=1){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=(x*7.3+z*3.1)%6.28;scene.add(g);
 const t=cyl(g,.09*sc,.15*sc,2.3*sc,0x9a6b3a,.115*sc,1.15*sc,0,6);t.rotation.z=-.1;const cr=new THREE.Group();cr.position.set(.23*sc,2.3*sc,0);g.add(cr);
 for(let k=0;k<7;k++){const pv=new THREE.Group();pv.rotation.y=k*6.283/7;cr.add(pv);const dr=new THREE.Group();dr.rotation.x=.45;pv.add(dr);box(dr,.4*sc,.05,1.5*sc,k&1?0x3fc04a:0x2fa83c,0,0,.75*sc);}
 sph(cr,.16*sc,0x6b4a1f,0,-.1,0);aoBlob(g,0,0,1.4*sc,1.4*sc,.55);}
function buildOuter(){const zc=L.nz-3.8,cx=L.st.win;
 box(scene,160,.2,3.6,0x3d3b3a,cx,-.1,zc).castShadow=false;[-1,1].forEach(sd=>box(scene,160,.22,.28,0xf3e6c4,cx,0,zc+sd*1.92).castShadow=false);
 for(let x=-60;x<70;x+=3)box(scene,1.4,.04,.15,0xf3e6c4,cx+x,.03,zc).castShadow=false;
 box(scene,160,.2,1.4,0xa9cdb0,cx,-.1,L.nz-1.05).castShadow=false;
 for(const k of cells){const[i,j]=k.split(',').map(Number);
  [[-1,0,'W'],[1,0,'E'],[0,1,'S']].forEach(([di,dj,s])=>{if(cells.has((i+di)+','+(j+dj)))return;
   const wx=s==='W'?2*i-1.5:s==='E'?2*i+3.5:2*i+1,wz=s==='S'?2*j+3.5:2*j+1;if((((s==='S'?i:j)%3)+3)%3!==0)return;
   if(gaps.some(g=>dist(g.x,g.z,wx,wz)<4.5))return;palm(wx,wz,.85+(((i*7+j*3)%4)+4)%4*.08);});}
 const e=L.ent,bz=e.z+2.9,bw=5.4,cv=document.createElement('canvas');cv.width=1024;cv.height=200;const g=cv.getContext('2d');
 g.fillStyle='#7a4b2a';g.fillRect(0,0,1024,200);g.fillStyle='#'+B0.w.toString(16).padStart(6,'0');g.fillRect(14,14,172,172);g.fillStyle='#fff';g.font='800 130px "Baloo 2",Trebuchet MS,sans-serif';g.textAlign='center';g.fillText(B0.n[0],100,150);
 const nm=B0.n.toUpperCase();let fs=110;do{g.font='800 '+fs+'px "Baloo 2",Trebuchet MS,sans-serif';fs-=6;}while(g.measureText(nm).width>780&&fs>30);g.textAlign='left';g.lineWidth=10;g.lineJoin='round';g.strokeStyle='#3b2200';g.strokeText(nm,206,132);g.fillStyle='#fff3d6';g.fillText(nm,206,132);
 [-1,1].forEach(sd=>box(scene,.22,3.1,.22,0x5b2a0c,e.x+sd*bw/2,1.55,bz));box(scene,bw+.3,1.35,.2,0x5b2a0c,e.x,3.2,bz);
 const bm=new THREE.Mesh(new THREE.PlaneGeometry(bw,bw*200/1024),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv)}));bm.position.set(e.x,3.2,bz+.11);scene.add(bm);
 for(let k=0;k<5;k++){const a=box(scene,.7,.1,1.5,k&1?0xffffff:B0.w,e.x-1.4+k*.7,2.3,e.z+.3);a.rotation.x=.2;}}
buildOuter();

/* ================= stations with tier skins ================= */
/* Strict 15-step chain. Steps 1-3 (grill, counter, table 1) are free so a brand-new hotel with $0 can start earning. */
/* ===== ECONOMY (Burger-Idle style) =====
   * Steps 0, 1 and 2 are free, then every step costs ECO.g (1.5x) the previous one: 140, 210, 315, 473 ... (x hotel multiplier M = 2.5^hotel). Target time per step runs from ECO.t0 (60 s) to ECO.t1 (240 s): a whole hotel takes ~26-30 min.
   * Customer pay (PRICE / TIP / DB) is derived from the same model so that earning one step takes about ECO.t0 s at the start
     and ECO.t1 s at the end, assuming the player keeps the shop ~ECO.eff efficient. Tune ECO.* and reload; console.table prints everything. */
const ECO={c0:140,g:1.5,t0:60,t1:240,eff:.75,carEvery:9,tipRate:.75,drinkRate:.6,
 cost1:i=>i<3?0:ECO.c0*Math.pow(ECO.g,i-3),
 clamp:s=>Math.min(14,Math.max(3,s)),
 T:s=>ECO.t0*Math.pow(ECO.t1/ECO.t0,(ECO.clamp(s)-3)/11),
 tables:s=>(s>=3?1:0)+(s>=6?1:0)+(s>=10?2:0),
 K:s=>{s=ECO.clamp(s);const A=Math.max(1.8,4.2-.2*s),tb=ECO.tables(s),share=tb?Math.min(.55,.2+.1*tb):0;return ECO.eff/A*(1+share*ECO.tipRate+(s>=9?.6*ECO.drinkRate:0))+(s>=5?2*ECO.eff/ECO.carEvery:0);}, // pay units earned per second
 raw:e=>ECO.cost1(e)/(ECO.T(e)*ECO.K(e)),
 price:s=>{s=ECO.clamp(s);let m=0;for(let e=3;e<=s;e++)m=Math.max(m,ECO.raw(e));return m;}}; // pay never drops when a feature unlocks
const nice=n=>{if(!(n>0))return 0;const p=Math.pow(10,Math.max(0,Math.floor(Math.log10(n))-2));return Math.round(n/p)*p;};
function fmt(n){n=Math.floor(n+1e-9);if(!(n>=1000))return String(Math.max(0,n));const u=['K','M','B','T','Qa','Qi'];let v=n,i=-1;while(v>=1000&&i<u.length-1){v/=1000;i++;}
 const t=v<10?Math.floor(v*100)/100:v<100?Math.floor(v*10)/10:Math.floor(v);return t+u[i];}
const STEPS=Array.from({length:15},(_,i)=>ECO.cost1(i)),NS=STEPS.length,SC=1;
let GT=0;
const step=()=>T.step|0,costOf=i=>nice(ECO.cost1(i)*M);
const lk=()=>step()>=NS?3:step()>=12?2:step()>=8?1:0; // station look: wood -> painted -> steel -> gold/neon as the hotel grows
const HLV=w=>Math.min(7,Math.max(1,w.lv|0)),WCAP=w=>w&&w.role==='H'?[1,2,3,4,5,6,7][HLV(w)-1]:3+SV.wc,WSPD=w=>w&&w.role==='H'?2.2+.45*HLV(w):3.8+.55*SV.ws+(step()>=13?.5:0), // helpers ('H'): speed 2.2+.45*lv, capacity = lv; other workers keep the old global values
 PS=()=>3.4+.35*T.ps,CAPS=[1,2,3,4,6,8,10,12],CAP=()=>CAPS[T.pc];
const BON={c:()=>step()>=7?1:0,g:()=>0,p:()=>step()>=11?1:0,d:()=>step()>=14?1:0}; // free +1 machine level from the chain's upgrade steps (counter / grill / packing / drinks), per hotel
const MAXLV=8,MU_BASE={g:8,d:6,p:8},SMUL2=l=>1+.25*l,SMUL=k=>SMUL2(SV.mu[k]+BON[k]()),PL=[{t:2.4,c:8},{t:1.8,c:10},{t:.9,c:12},{t:.4,c:14}],PLV=()=>Math.min(3,SV.mu.p),WL=[{t:1.6},{t:1.1},{t:.55}],WLV=()=>Math.min(2,SV.mu.w),CL=[{t:1.0},{t:.7},{t:.35}],CLV=()=>Math.min(2,SV.mu.c), // counter: L1 you serve from the circle, L2 Counter Helper 'S' appears (only hands dishes to customers), L3 fast. // drive-thru window: L1 you hand over bags (slow), L2 Window Helper 'D' appears, L3 fast hand-over
  // packing: L1 you pack (slow), L2 Packing Helper 'P' appears, L3 fast, L4 turbo
 GL=[{t:5,c:4},{t:3.5,c:6},{t:2.2,c:8},{t:1.2,c:10}],GC=l=>nice(ECO.c0*Math.pow(ECO.g,3)*M*Math.pow(2.2,l)),MCAP=k=>k==='g'?GL[Math.min(3,SV.mu.g)].c:k==='p'?PL[PLV()].c+2*BON.p():MU_BASE[k]+2*(SV.mu[k]+BON[k]()); // machine upgrade: +25% speed and +2 stock per level
const GI=()=>GL[Math.min(3,SV.mu.g)].t,DIV=()=>(3.2-.4*lk())/SMUL('d'),CSV=()=>CL[CLV()].t/(1+.25*BON.c()),PIV=()=>PL[PLV()].t/(1+.25*BON.p()),HTV=()=>WL[WLV()].t;
let PRICE=1,TIP=1,DB=1;
function econ(){PRICE=Math.max(1,nice(ECO.price(step())*M*(1+.1*T.pu)));TIP=Math.max(1,Math.round(PRICE*ECO.tipRate));DB=Math.max(1,Math.round(PRICE*ECO.drinkRate));}
econ();
const PAL=BI?(()=>{const mixc=(a,c,t)=>{const m=q=>Math.round(((a>>q)&255)*(1-t)+((c>>q)&255)*t);return(m(16)<<16)|(m(8)<<8)|m(0);},A=B0.ac,TR=B0.tr; // hotels 2-10: body = accent colour, trim = trim colour; higher levels keep the steel / gold feel by blending a little steel / gold into the accent
 return[{body:mixc(A,0x000000,.25),top:0xf2e3c6,trim:TR},{body:A,top:0xffffff,trim:TR},{body:mixc(A,0xb8c0cc,.35),top:0xe9eef3,trim:TR},{body:mixc(A,0xd4af37,.35),top:0xfff0a8,trim:TR}];})():[{body:0x8d5524,top:0xf2e3c6,trim:0x6c4a2a},{body:B0.w,top:0xffffff,trim:B0.t},{body:0xb8c0cc,top:0xe9eef3,trim:0x8d99ae},{body:0xd4af37,top:0xfff0a8,trim:0xb8860b}];
const SK={grill:{w:2.2,d:1.6,k:'grill'},counter:{w:3.2,d:1.4,k:'counter'},pack:{w:2.6,d:1.4,k:'pack'},drink:{w:1.8,d:1.2,k:'drink'},win:{w:3,d:1.2,k:'drive'},side:{w:1.8,d:1.2,k:'side'}};
const HC=[0xef476f,0xd9482b,0xe08a1e,0xff7b00,0xd62828,0xffd60a,0xd4af37,0x00bcd4,0x3a7d44,0xe91e63];
/* Part 5: every hotel has its own cooking machine (boxes/cylinders only). BI = hotel dish, Lk 0..3 = machine level.
   Colours: natural material tinted with the hotel's B0.c, trims use B0.t. Level up = bigger (skin() scales body), shinier (Lk>=2), glowier (Lk>=3).
   The dish standing on the machine is makeItem('b'), i.e. exactly the food this hotel serves. Top of cabinet = y 1.12. */
function cook(b,Lk,w,d,P,X){const C=B0.c,TT=B0.t,
 mx=(a,c,t)=>{const m=q=>Math.round(((a>>q)&255)*(1-t)+((c>>q)&255)*t);return(m(16)<<16)|(m(8)<<8)|m(0);},
 sc=(c,t=.4)=>{const k=mx(c,C,t);return Lk>=3?mx(k,TT,.25):k;},
 cy=(rt,rb,h,c,x,y,z,s=14)=>{const m=cyl(b,rt,rb,h,c,x,y,z,s);if(Lk>=2)m.material=shiny(c);return m;},
 cz=(rt,rb,h,c,x,y,z,s=16)=>{const m=cy(rt,rb,h,c,x,y,z,s);m.rotation.x=Math.PI/2;return m;}, // disc facing the player (front = +z)
 sp=(r,c,x,y,z,sx=1,sy=1,sz=1)=>{const m=sph(b,r,c,x,y,z);m.scale.set(sx,sy,sz);return m;},
 rg=(R,r,c,x,y,z,sz=1)=>{const m=tor(b,R,r,c,x,y,z);if(Lk>=2)m.material=shiny(c);m.scale.y=sz;return m;}, // flat ring (sz squashes depth)
 fl=(x,y,z,h=.18,c=0xff6b35)=>glow(b,.14,h*(1+.2*Lk),.14,c,x,y,z),
 dish=(x,y,z,s=1)=>{const it=makeItem('b');it.position.set(x,y,z);it.scale.setScalar(s*(1+.1*Lk));b.add(it);b.userData.dish=it;return it;},
 iron=sc(0x1c1c20,.3),steel=sc(0xc7ccd4,.25),dark=sc(0x2b2b30,.3),flame=0xff6b35;
 X(w+.1,.16,d+.1,C,0,.55,0);if(Lk>=2)glow(b,w,.06,.06,C,0,1.1,d/2+.04);
 if(BI===0){ // BBQ grill: black grate over glowing coals, lid open at the back
  X(1.9,.38,1.3,dark,0,1.31,0);[-.66,.66].forEach(z=>X(1.94,.06,.06,TT,0,1.52,z));[-.94,.94].forEach(x=>X(.06,.06,1.34,TT,x,1.52,0));
  glow(b,1.7,.04,1.1,0xff4a1a,0,1.52,0);
  for(let i=-5;i<=5;i++)X(.05,.05,1.2,0x0a0a0a,i*.17,1.57,0);[-.4,0,.4].forEach(z=>X(1.8,.04,.05,0x0a0a0a,0,1.545,z));
  const lid=X(1.9,.07,.7,dark,0,1.86,-.81);lid.rotation.x=1.1;X(1.7,.05,.5,C,0,1.9,-.88).rotation.x=1.1;
  [-.4,.4].forEach(z=>cy(.08,.08,.35,z<0?0xd62828:0xffd60a,1.05,1.3,z,8));dish(0,1.6,0,1.1);}
 else if(BI===1){ // brick pizza oven: dome + round arch mouth with fire glow, wooden peel in front
  const br=sc(0xb0452a,.4),br2=sc(0x8a3520,.4);sp(.95,br,0,1.12,-.2,1.1,.95,.8);
  [.25,.5,.72].forEach(h=>rg(1.045*Math.sqrt(1-Math.pow(h/.9025,2)),.03,br2,0,1.12+h,-.2,.727));
  X(1.5,.95,.22,br,0,1.6,.45);[0,1,2].forEach(i=>X(1.52,.04,.24,br2,0,1.35+i*.3,.45));
  cz(.52,.52,.1,TT,0,1.55,.58);X(1.04,.43,.1,TT,0,1.335,.58);cz(.42,.42,.12,0x120805,0,1.55,.62);X(.84,.43,.12,0x120805,0,1.335,.62);
  glow(b,.6,.3,.04,0xff7a1a,0,1.3,.69);glow(b,.34,.28,.04,0xffb040,0,1.58,.69);
  cy(.17,.2,.7,sc(0x6b6b72,.3),.55,2.35,-.3,10);cy(.24,.24,.06,TT,.55,2.72,-.3,10);
  X(1.1,.05,.4,0x8a5a2b,0,1.15,.72);cy(.1,.1,.6,0x6b3a12,-.95,1.2,.55,6).rotation.x=Math.PI/2;dish(0,1.2,.72,.95);}
 else if(BI===2){ // kadhai of hot oil on a chulha
  cy(.5,.7,.4,sc(0x3a3a3a,.35),0,1.32,0,10);[-.3,0,.3].forEach(x=>fl(x,1.3,.62));
  cy(.88,.52,.42,iron,0,1.8,0,18);cy(.82,.82,.03,0xe0a21b,0,1.98,0,18);rg(.88,.05,steel,0,2.02,0);[-1,1].forEach(k=>X(.3,.07,.08,iron,k*1.02,2.0,0));
  cy(.03,.03,1,steel,-.7,2.3,.4,6).rotation.z=.6;cy(.2,.14,.14,C,.95,1.2,.62,10);dish(0,2.0,0,.9);}
 else if(BI===3){ // wide shallow jalebi pan + chashni katora
  X(1.6,.14,.9,dark,-.15,1.2,0);cy(.95,.8,.2,iron,-.15,1.37,0,22).scale.z=.75;cy(.88,.88,.03,0xff9a1f,-.15,1.45,0,22).scale.z=.75;rg(.95,.045,steel,-.15,1.47,0,.75);
  [-.6,.3].forEach(x=>fl(x,1.22,.5));
  cy(.3,.22,.22,steel,.9,1.22,.45,14);cy(.25,.25,.03,0xffb347,.9,1.33,.45,14);cy(.04,.04,.7,steel,.9,1.6,.2,6).rotation.x=.4;dish(-.15,1.46,0,1.05);}
 else if(BI===4){ // tawa for bhature + big pateela of chhole
  cy(.62,.62,.07,iron,-.5,1.2,.05,18);X(.08,.06,.3,iron,-.5,1.2,.82);glow(b,1.2,.06,.06,flame,-.5,.9,d/2+.02);dish(-.5,1.26,.05,.95);
  cy(.5,.5,.6,steel,.62,1.42,-.1,14);cy(.44,.44,.04,0x8a4b1f,.62,1.74,-.1,14);[[.52,-.1],[.72,0],[.62,-.25]].forEach(([x,z])=>sp(.09,0xb06a2a,x,1.82,z));
  [-1,1].forEach(k=>X(.2,.06,.08,steel,.62+k*.55,1.6,-.1));cy(.03,.03,.9,steel,.62,2.1,.3,6).rotation.z=.4;
  cy(.2,.14,.15,0xffffff,.55,1.2,.65,8);sp(.09,0xc2185b,.55,1.3,.65);}
 else if(BI===5){ // wok on a roaring burner, long flames
  X(1.2,.3,1.2,dark,0,1.27,0);cy(.55,.65,.18,iron,0,1.5,0,12);cy(.88,.42,.42,iron,0,1.82,0,20);cy(.76,.76,.03,0xb5442c,0,1.98,0,20);rg(.88,.05,steel,0,2.03,0);
  const hd=X(.7,.07,.09,iron,1.02,2.0,.7);hd.rotation.y=-.6;
  [[-.7,.5],[.7,.5],[0,.7]].forEach(([x,z])=>fl(x,1.5,z,.55,0xff3b3b));fl(-.35,1.45,.65,.4,0xffa200);fl(.35,1.45,.65,.4,0xffa200);
  cy(.04,.04,.9,steel,-.7,2.2,.35,6).rotation.z=.5;cy(.15,.1,.12,0x5a2d0c,-1,1.2,.6,8);dish(0,2,0,.85);}
 else if(BI===6){ // biryani handi (matka) on a chulha, dhakkan leaning beside
  const clay=sc(0xb5651d,.3),gold=0xd4af37;
  X(1.1,.3,1.1,sc(0x5a2d0c,.3),-.25,1.27,0);sp(.78,clay,-.25,1.85,0,1,.85,1);cy(.5,.55,.16,clay,-.25,2.42,0,16);cy(.46,.46,.03,0xf5e6a8,-.25,2.5,0,16);rg(.52,.05,gold,-.25,2.51,0);
  if(Lk>=1)rg(.79,.04,gold,-.25,1.85,0);[-.65,.15].forEach(x=>fl(x,1.3,.52));
  cz(.45,.45,.07,sc(0xc0842f,.2),.8,1.57,-.35);sp(.07,gold,.8,1.57,-.28);dish(.8,1.14,.5,.85);}
 else if(BI===7){ // flat griddle with rails and splash-back
  X(1.9,.1,1.3,sc(0x9aa0a8,.3),0,1.17,0);[-.64,.64].forEach(z=>X(1.9,.14,.07,sc(0x6c7078,.3),0,1.24,z));[-.93,.93].forEach(x=>X(.07,.14,1.3,sc(0x6c7078,.3),x,1.24,0));
  X(1.9,.55,.07,steel,0,1.55,-.7);glow(b,1.8,.05,.06,C,0,1.84,-.7);glow(b,1.5,.06,.06,flame,0,.9,d/2+.02);
  cy(.3,.3,.02,0xfff1b0,.55,1.23,.3,12);sp(.08,0xffb703,.55,1.26,.3);X(.5,.03,.1,steel,-.7,1.28,.38);
  cy(.09,.09,.35,0xd62828,-.75,1.42,-.45,8);cy(.09,.09,.35,0xffd60a,-.55,1.42,-.45,8);dish(0,1.23,0,1.1);}
 else if(BI===8){ // big round dosa tawa
  cy(.88,.88,.08,iron,0,1.17,0,26);cy(.78,.78,.03,sc(0xc98a2b,.2),0,1.22,0,26);rg(.88,.04,steel,0,1.2,0);cy(.55,.55,.035,0xe3b365,0,1.25,0,24);
  glow(b,1.4,.06,.06,flame,0,.9,d/2+.02);cy(.3,.3,.4,steel,.92,1.3,.6,12);cy(.24,.24,.02,0xd62828,.92,1.51,.6,12);
  cy(.22,.16,.16,0xffffff,-.95,1.2,.55,10);cy(.22,.16,.16,0x2ecc71,-.95,1.2,-.35,10);dish(0,1.27,0,1);}
 else if(BI===9){ // gold kadhai of mithai + thali of sweets
  const gold=sc(0xd4af37,.2);
  X(.9,.2,.9,dark,-.4,1.22,0);cy(.78,.48,.34,gold,-.4,1.5,0,18);cy(.68,.68,.03,0xffe9a8,-.4,1.66,0,18);rg(.78,.05,gold,-.4,1.68,0);X(.25,.07,.08,gold,.48,1.66,0);
  [[-.65,.1],[-.3,-.25],[-.3,.3]].forEach(([x,z])=>sp(.13,0x5c2a0e,x,1.78,z));[-.7,-.15].forEach(x=>fl(x,1.22,.5));
  cy(.48,.48,.04,0xe6c04a,.7,1.14,.1,18);rg(.48,.03,gold,.7,1.17,.1);X(.22,.08,.22,0xff7fb0,.9,1.16,.7);X(.22,.08,.22,0xffffff,.55,1.16,.7);dish(.7,1.18,.1,1);
  if(Lk>=1){X(2.2,.1,1.3,mx(0xe91e63,C,.3),0,2.75,0);[-1,1].forEach(a=>[-1,1].forEach(c=>X(.06,1.2,.06,gold,a*1.05,2.15,c*.6)));}}
 if(Lk>=1)X(w+.14,.05,.05,TT,0,.9,d/2+.06); // level 2+: trim line
 if(Lk>=3)[[-1.1,2.2,.7],[1.1,2.5,.7],[1,1.9,-.7],[-1,1.8,-.7]].forEach(([x,y,z])=>{glow(b,.12,.12,.12,0xfff3a0,x,y,z).rotation.set(.8,.8,0);}); // level 4: sparkles
 cyl(b,.6,.6,.08,0xe5e5e5,0,.04,2,16);}
function skin(o){const b=o.body;while(b.children.length)b.remove(b.children[0]);const Lk=o.kind==='grill'?Math.min(3,SV.mu.g):o.kind==='pack'?PLV():o.kind==='win'?WLV():o.kind==='counter'?Math.min(3,CLV()+(step()>=NS?1:0)):lk(),P=PAL[Lk],{w,d}=SK[o.kind];if(o.kind==='grill')b.scale.setScalar([.85,1,1.1,1.22][Lk]);{const cm=Assets.clone('station_'+o.kind+'_'+Lk);if(cm){b.add(cm);return;}}
 const X=(bw,bh,bd,c,x,y,z)=>{const m=box(b,bw,bh,bd,c,x,y,z);if(Lk>=2)m.material=shiny(c);return m;},Y=m=>{if(Lk>=2)m.material=shiny(P.trim);return m;};
 X(w,1,d,P.body,0,.5,0);X(w+.2,.12,d+.2,P.top,0,1.06,0);if(Lk>=1)X(w+.06,.12,d+.06,P.trim,0,.1,0);
 if(o.kind==='grill'){cook(b,Lk,w,d,P,X);}
 else if(o.kind==='drink'){ // a different drink machine per hotel (BI); Lk 0..3 = brighter steel, gold trim, glow, sparkles
  const S2=(m,c)=>{if(Lk>=2)m.material=shiny(c);return m;},stl=[0x9aa0a8,0xb4bac2,0xd0d5dc,0xe6ebf0][Lk],gl=(x,y,z,ww,hh,dd,c)=>{if(Lk>=1)glow(b,ww,hh,dd,c,x,y,z);};
  if(BI===0){ // juice dispenser: two juice tanks with taps
   S2(cyl(b,.3,.3,.9,0xffa62b,-.42,1.6,-.1,14),0xffa62b);S2(cyl(b,.3,.3,.9,0xef476f,.42,1.6,-.1,14),0xef476f);
   [-.42,.42].forEach((x,i)=>{cyl(b,.33,.33,.08,0x2b2b30,x,2.08,-.1,14);cyl(b,.33,.33,.08,0x2b2b30,x,1.17,-.1,14);sph(b,.12,i?0xe63946:0xff8c1a,x,2.22,-.1);X(.12,.14,.24,stl,x,1.3,.28);});
   X(1.0,.05,.34,0x2b2b30,0,1.13,.45);gl(0,.75,.62,w-.2,.05,.05,0xffa62b);if(Lk>=2)[-.42,.42].forEach(x=>glow(b,.1,.7,.05,0xfff3a0,x,1.6,.2));}
  else if(BI===1){ // soda fountain: nozzle head with colour buttons + cup stack
   X(1.5,.5,.55,0x2b2b30,0,1.4,-.25);X(1.56,.06,.6,stl,0,1.68,-.25);X(1.2,.3,.1,B0.c,0,1.95,-.5);gl(0,1.95,-.44,1,.12,.04,0xffffff);
   [-.5,-.17,.17,.5].forEach((x,i)=>{cyl(b,.07,.05,.22,stl,x,1.2,.1,8);glow(b,.14,.08,.05,[0xd62828,0x2ecc71,0xff7b00,0x3a86ff][i],x,1.45,.04);});
   X(1.0,.04,.4,0x55555f,0,1.14,.4);cyl(b,.13,.1,.4,0xffffff,.68,1.3,.3,8);}
  else if(BI===2||BI===3){ // chai: kettle on a burner + kulhad rack
   const kc=BI===3?0xd9a441:0xc7ccd4;X(.9,.16,.8,0x2b2b30,-.35,1.2,0);[-.55,-.35,-.15].forEach(x=>glow(b,.1,.14*(1+.2*Lk),.1,0xff6b35,x,1.3,.38));
   S2(cyl(b,.3,.38,.5,kc,-.35,1.6,0,14),kc);S2(cyl(b,.2,.3,.08,kc,-.35,1.88,0,14),kc);sph(b,.07,0x2b2b30,-.35,1.98,0);X(.12,.4,.1,kc,-.7,1.7,0).rotation.z=.7;tor(b,.24,.035,0x2b2b30,-.35,1.9,0).rotation.x=0;
   if(Lk>=1)[[-.75,2.05],[-.68,2.25]].forEach(([x,y])=>sph(b,.08,0xffffff,x,y,0));
   [.3,.8].forEach(x=>X(.06,.9,.06,0x6c4a2a,x,1.55,-.2));[1.5,1.9].forEach(y=>X(.7,.05,.5,0x8a5a3a,.55,y,-.1));
   [[.38,1.6],[.55,1.6],[.72,1.6],[.38,2],[.55,2],[.72,2],[.3,1.2],[.55,1.2],[.8,1.2]].forEach(([x,y])=>cyl(b,.09,.06,.14,BI===3?0xc27a2a:0xb5651d,x,y,y===1.2?.35:-.1,8));}
  else if(BI===4){ // lassi: big clay matka on a stand, steel glasses
   X(1.0,.14,1.0,0x6c4a2a,0,1.19,-.05);const mk=sph(b,.6,0xb5651d,0,1.72,-.05);mk.scale.set(1,.85,1);S2(mk,0xb5651d);cyl(b,.35,.42,.15,0xb5651d,0,2.28,-.05,14);cyl(b,.38,.38,.05,0xffffff,0,2.38,-.05,14);
   cyl(b,.05,.05,.25,stl,0,1.42,.55,8).rotation.x=Math.PI/2;if(Lk>=1)tor(b,.4,.04,0xd4af37,0,2.24,-.05);if(Lk>=2)tor(b,.6,.035,0xd4af37,0,1.72,-.05);
   [-.7,.68].forEach(x=>{S2(cyl(b,.13,.1,.3,stl,x,1.27,.3,10),stl);cyl(b,.125,.125,.03,0xffffff,x,1.43,.3,10);});}
  else if(BI===5){ // tea urn: tall steel urn with tap + water gauge
   cyl(b,.5,.52,.12,0x2b2b30,0,1.18,-.05,16);S2(cyl(b,.42,.42,1,stl,0,1.74,-.05,16),stl);S2(cyl(b,.36,.44,.14,stl,0,2.3,-.05,16),stl);sph(b,.08,0x2b2b30,0,2.42,-.05);
   cyl(b,.05,.05,.25,0xb08a2a,0,1.45,.42,8).rotation.x=Math.PI/2;X(.22,.05,.05,0xd62828,0,1.55,.5);X(.08,.6,.05,0xcfeeff,.28,1.8,.38);gl(.28,1.65,.4,.05,.35,.04,0xffb347);
   X(.7,.04,.4,0x55555f,0,1.14,.5);cyl(b,.1,.07,.16,0xfff3d6,.7,1.2,.35,8);}
  else if(BI===6){ // raita: big copper vessel with ladle, small katoras in front
   S2(cyl(b,.62,.45,.5,0xb87333,0,1.4,-.05,18),0xb87333);cyl(b,.55,.55,.03,0xfffdf2,0,1.66,-.05,18);tor(b,.62,.04,Lk>=1?0xd4af37:0xb87333,0,1.66,-.05);
   [[.15,.1],[-.2,-.1],[.1,-.25],[-.25,.2]].forEach(([x,z])=>sph(b,.05,0x2e9e44,x,1.7,z-.05));cyl(b,.02,.02,.9,stl,.5,2.0,.1,6).rotation.z=-.7;
   [-.5,0,.5].forEach(x=>{S2(cyl(b,.17,.1,.12,stl,x,1.24,.4,10),stl);cyl(b,.15,.15,.02,0xffffff,x,1.3,.4,10);});}
  else if(BI===7){ // soda cooler: red chest cooler with glass front + cans
   X(1.6,.75,.8,0xd62828,0,1.5,-.12);X(1.64,.08,.84,0xffffff,0,1.9,-.12);X(1.2,.4,.04,0xbfe9ff,0,1.45,.3);
   [-.4,-.13,.13,.4].forEach((x,i)=>cyl(b,.09,.09,.3,[0xd62828,0x2e9e44,0xff7b00,0x3a86ff][i],x,1.45,.34,8));X(.5,.06,.06,0x2b2b30,0,1.78,.3);box(b,.6,.2,.08,B0.c,0,2.05,-.4);gl(0,2.05,-.34,.5,.1,.04,0x9be8ff);gl(0,1.1,.3,1.4,.05,.05,0x9be8ff);}
  else if(BI===8){ // coffee machine: steel espresso machine with group heads, gauge, steam wand
   X(1.5,.8,.7,stl,0,1.55,-.15);X(1.56,.1,.76,0x2b2b30,0,2.0,-.15);S2(cyl(b,.2,.25,.3,0x6b3a12,.3,2.2,-.2,8),0x6b3a12);
   [-.4,.4].forEach(x=>{cyl(b,.14,.14,.12,0x2b2b30,x,1.3,.25,10);cyl(b,.03,.03,.14,stl,x,1.18,.3,6);cyl(b,.09,.07,.12,0xffffff,x,1.2,.38,8);});
   cyl(b,.12,.12,.04,0xfff3d6,0,1.75,.22,12).rotation.x=Math.PI/2;cyl(b,.025,.025,.5,stl,.7,1.5,.25,6).rotation.z=.15;
   glow(b,.1,.1,.04,0xff3b3b,-.65,1.8,.22);gl(-.5,1.8,.22,.1,.1,.04,0x2ecc71);X(1.2,.05,.4,0x2b2b30,0,1.13,.38);}
  else{ // falooda counter: pink + gold, glasses with ice cream, tub, rose syrup, gold frame
   X(w+.04,.05,d+.04,0xff7fb0,0,1.12,0);[-.85,.85].forEach(x=>X(.08,1.3,.08,0xd4af37,x,1.75,-.5));X(1.8,.08,.1,0xd4af37,0,2.4,-.5);
   [-.6,-.25,.1].forEach(x=>{S2(cyl(b,.17,.12,.42,0xff9ec4,x,1.35,.15,10),0xff9ec4);sph(b,.17,0xfff3f7,x,1.62,.15);sph(b,.05,0xd62828,x,1.78,.15);});
   cyl(b,.3,.28,.3,0xffffff,.6,1.27,-.2,12);cyl(b,.28,.28,.02,0xff7fb0,.6,1.43,-.2,12);cyl(b,.07,.07,.3,0xe63988,.35,1.27,.25,8);gl(0,1.12,.62,w,.05,.05,0xffd700);}
  cyl(b,.6,.6,.08,0xe5e5e5,0,.04,2,16);if(Lk>=2)glow(b,w-.3,.5,.06,0x9be8ff,0,.6,d/2+.04);}
 else if(o.kind==='pack'){ // packing table: pad in the middle (the box is built there), flat boxes + tape; look grows with the packing level
  X(.8,.02,.7,0x2b2b30,0,1.13,0);X(.7,.14,.42,0xd9b383,-.2,1.2,-.55);X(.6,.1,.38,B0.c,-.2,1.32,-.55);cyl(b,.14,.14,.12,0xe8d9a8,.55,1.18,-.55,10);
  if(Lk>=1){[-.9,.9].forEach(x=>X(.08,.6,.08,P.trim,x,1.4,-.62));X(2,.07,.07,P.trim,0,1.72,-.62);X(.6,.2,.06,P.trim,.3,1.55,-.62);} // L2: gantry + paper roll holder
  if(Lk>=2){glow(b,1.8,.05,.05,0x9be8ff,0,1.66,-.58);X(.5,.5,.3,P.trim,1,1.37,-.5);X(.3,.06,.06,0xffffff,1,1.65,-.34);} // L3: lamp strip + label printer
  if(Lk>=3){[[-1.1,1.95,.5],[1.1,1.95,.5],[0,2.05,-.6]].forEach(([x,y,z])=>{glow(b,.12,.12,.12,0xfff3a0,x,y,z).rotation.set(.8,.8,0);});glow(b,w,.06,.06,B0.c,0,1.13,d/2+.06);}} // L4 turbo: sparkles + glow edge
 else if(o.kind==='side'){ // small side-items counter: display tray with the side dish, posts, striped awning, lamp strip (look grows with Lk)
  X(1.5,.06,.7,P.trim,0,1.16,-.1);[-.7,.7].forEach(x=>X(.06,.8,.06,P.trim,x,1.55,-.42));X(1.6,.08,.16,P.trim,0,1.95,-.42);
  for(let i=0;i<5;i++){const a=X(.34,.06,.8,i&1?0xffffff:B0.c,-.68+i*.34,2.02,-.55);a.rotation.x=-.25;}
  const it=makeItem('s');it.position.set(0,1.2,-.1);it.scale.setScalar(1.4);b.add(it);
  if(Lk>=1)glow(b,.9,.08,.05,B0.c,0,1.88,-.34);if(Lk>=2)glow(b,w-.3,.5,.06,0x9be8ff,0,.6,d/2+.04);}
 else{ // counter / car window: open top (no awning, no poles) so the burger stack stays visible
  X(.5,.35,.4,0x333333,w/2-.5,1.3,-.2);if(o.kind==='counter'){X(.74,.1,.64,0xd62828,w/2-.5,1.15,.05);glow(b,.36,.24,.04,0x9be8ff,w/2-.5,1.66,-.02);}if(BI===2&&o.kind==='counter')[0x2ecc71,0xd62828,0xf4a261].forEach((c,i)=>cyl(b,.15,.11,.12,c,-w/2+.45+i*.48,1.18,.52,10));}
 if(o.kind==='win'){ // drive-thru window look grows with its level (Lk 0..2): L1 simple hatch, L2 awning + frame + open sign, L3 neon + conveyor + menu board
  X(w-.3,.06,.5,0xd9b383,0,1.16,-.42);cyl(b,.1,.12,.1,0xffd23f,-w/2+.35,1.2,.15,8);
  if(Lk===0){X(.08,.9,.08,0x6c4a2a,w/2-.2,1.6,-.45);X(.6,.3,.06,0xfff3d6,w/2-.5,2.0,-.45);}
  if(Lk>=1){[-1,1].forEach(sd=>X(.1,1.3,.1,P.trim,sd*(w/2-.1),1.7,-.5));X(w-.1,.12,.12,P.trim,0,2.35,-.5);
   for(let i=0;i<5;i++){const a=X(.6,.06,.95,i&1?0xffffff:B0.w,-1.2+i*.6,2.25,-.9);a.rotation.x=-.25;}glow(b,.5,.18,.06,0x2ecc71,w/2-.5,1.95,-.45);}
  if(Lk>=2){glow(b,w-.1,.06,.06,B0.c,0,2.4,-.44);X(w-.4,.05,.3,0x2b2b30,0,1.2,-.4);[-1,-.5,0,.5,1].forEach(x=>glow(b,.12,.04,.12,0x9be8ff,x,1.24,-.4));X(.7,.8,.1,0x2b2b30,w/2-.45,1.7,.58);glow(b,.5,.5,.04,B0.c,w/2-.45,1.7,.65);}}
 if(Lk===3){glow(b,w+.15,.07,.07,B0.c,0,.18,d/2+.06);glow(b,w+.15,.07,.07,B0.c,0,1.13,d/2+.1);glow(b,.07,1,.07,B0.c,w/2+.08,.55,d/2+.06);glow(b,.07,1,.07,B0.c,-w/2-.08,.55,d/2+.06);}}
/* ===== cooking animation (VISUAL ONLY, no game logic touched) =====
   While G0 produces an item, a few primitives on the machine move/scale in stages. Stage = k = G0.t / GI() (0..1), the same
   timer that fills the progress bar above the machine: bar fill = k, white ticks on the bar mark where each stage ends.
   Built lazily once per page (BI never changes), only the active parts are touched per frame. Static dish is hidden while cooking. */
const ckPh=(k,a,b)=>k<=a?0:k>=b?1:(k-a)/(b-a),ckEo=t=>1-Math.pow(1-t,3),ckOb=t=>1+2.70158*Math.pow(t-1,3)+1.70158*Math.pow(t-1,2),
 ckBo=t=>t<.3636?7.5625*t*t:t<.7273?7.5625*(t-=.5455)*t+.75:t<.9091?7.5625*(t-=.8182)*t+.9375:7.5625*(t-=.9545)*t+.984375,
 ckC=new THREE.Color(),ckOw=m=>{m.material=m.material.clone();return m;},ckTn=(m,a,b,t)=>{m.material.color.setHex(a);ckC.setHex(b);m.material.color.lerp(ckC,t);};
function cookBuild(o){
 const g=new THREE.Group(),bg=new THREE.Group(),P=[],f={g,bg,P,s:[.25,.5,.75]};o.g.add(g,bg);
 // R: part visible while a<k<h, fn(t,k) with t=0..1 over a..b. DR: drops in (bounce). GR: grows in (overshoot). PF: rising puffs / bubbles.
 const R=(m,a,b,fn,h)=>{m.visible=false;m.castShadow=false;P.push({m,a,b,fn,h});return m;},
  DR=(m,a,b,x,y,z,H,h,ex)=>R(m,a,b,(t,k)=>{m.position.set(x,y+H*(1-ckBo(t)),z);if(ex)ex(t,k);},h),
  GR=(m,a,b,x,y,z,sx=1,sy=1,sz=1,h,ex)=>R(m,a,b,(t,k)=>{const s=ckOb(t);m.position.set(x,y,z);m.scale.set(sx*s,sy*s,sz*s);if(ex)ex(t,k);},h),
  PF=(x,y,z,a,b,c,n,H,r,h)=>{for(let i=0;i<n;i++){const m=sph(g,r,c,x,y,z);R(m,a,b,(t,k)=>{const q=((k-a)*3+i/n)%1;m.position.set(x+Math.sin(q*6+i*2)*.12,y+H*q,z);m.scale.setScalar(.05+Math.sin(q*Math.PI));},h);}};
 if(BI===0){ // burger: bottom bun, patty (cooks), lettuce, cheese, tomato, top bun
  const y=1.6,bb=cyl(g,.42,.44,.13,0xd9893b,0,0,0),pt=ckOw(cyl(g,.44,.44,.09,0xc2576b,0,0,0)),lt=cyl(g,.47,.47,.05,0x5fcf4a,0,0,0),ch=box(g,.8,.03,.8,0xffc72c,0,0,0),tm=cyl(g,.34,.34,.04,0xe63946,0,0,0),tp=cyl(g,.4,.42,.15,0xe09a4c,0,0,0);
  ch.rotation.y=.785;
  DR(bb,0,.2,0,y+.07,0,1.3);DR(pt,.2,.38,0,y+.19,0,1.3,undefined,(t,k)=>ckTn(pt,0xc2576b,0x4a2412,ckPh(k,.2,.6)));
  DR(lt,.38,.52,0,y+.26,0,1.2);DR(ch,.5,.64,0,y+.3,0,1.2);DR(tm,.62,.74,0,y+.335,0,1.2);DR(tp,.72,.88,0,y+.43,0,1.4);
  PF(0,y+.2,0,.2,.9,0xd0d0d0,3,.8,.06);f.s=[.2,.38,.64,.88];}
 else if(BI===1){ // pizza: dough, sauce, cheese, toppings, slides into oven, bakes golden, comes out
  const pg=new THREE.Group(),dg=ckOw(cyl(pg,.46,.46,.06,0xefd9a0,0,.03,0,18)),sa=cyl(pg,.38,.38,.02,0xc62828,0,.07,0,18),cs=ckOw(cyl(pg,.34,.34,.02,0xf6d365,0,.09,0,18));
  g.add(pg);pg.position.set(0,1.2,.72);
  R(pg,0,1,(t,k)=>{const i=ckPh(k,.62,.74),b=ckPh(k,.88,1),m=i*(1-b);pg.position.set(0,1.2+.13*m,.72-.67*m);pg.scale.setScalar(1-.2*m);});
  GR(dg,0,.14,0,.03,0,1,1,1,undefined,(t,k)=>{dg.rotation.y=(1-t)*6;ckTn(dg,0xefd9a0,0xd9953a,ckPh(k,.74,.88));});
  GR(sa,.14,.28,0,.07,0);GR(cs,.28,.38,0,.09,0,1,1,1,undefined,(t,k)=>ckTn(cs,0xf6d365,0xe8a83a,ckPh(k,.74,.88)));
  [[.15,.05],[-.12,.14],[.02,-.17]].forEach(([x,z],i)=>DR(cyl(pg,.07,.07,.03,0xb71c1c,0,0,0,8),.36+i*.02,.46+i*.02,x,.12,z,.8));
  [[-.2,-.08],[.22,-.12],[-.02,.02]].forEach(([x,z],i)=>DR(box(pg,.1,.03,.06,0x2e7d32,0,0,0),.42+i*.02,.52+i*.02,x,.12,z,.8));
  PF(0,1.4,.72,.88,1,0xffffff,3,.6,.07);f.s=[.14,.28,.62,.88];}
 else if(BI===2){ // samosa: dropped in hot oil (splash), bubbles, flipped, lifted out golden
  const oy=2.03;
  [[-.26,0],[.26,.06]].forEach(([x,z],i)=>{const a=i*.06,m=ckOw(cyl(g,0,.36,.36,0xe8cf9b,x,oy,z,3)),rg=tor(g,.2,.03,0xffffff,x,oy,z);
   DR(m,a,a+.2,x,oy+.15,z,1.3,undefined,(t,k)=>{if(k>.26)m.position.y=oy+.15+Math.sin(k*38+i*2)*.03;const fl=ckPh(k,.45,.6);m.rotation.z=fl*6.283;m.position.y+=Math.sin(fl*Math.PI)*.45+ckEo(ckPh(k,.8,1))*.7;ckTn(m,0xe8cf9b,0xc77a22,ckPh(k,.2,.8));});
   R(rg,a+.14,a+.3,t=>{rg.position.set(x,oy+.02,z);rg.scale.setScalar(1+t*3);},a+.3);});
  PF(-.3,oy,.12,.2,.82,0xfff2b0,3,.3,.06);PF(.3,oy,-.1,.22,.82,0xfff2b0,3,.3,.06);f.s=[.2,.45,.8];}
 else if(BI===3){ // jalebi: batter piped in rings, fries in oil with bubbles, chashni poured with a ladle
  const cx=-.15,y=1.53,pp=cyl(g,.1,.035,.45,0xf1f1f1,0,0,0,8),lg=new THREE.Group(),sy=box(g,.05,.5,.05,0xffb347,0,0,0);
  [.3,.2,.1].forEach((r,i)=>{const m=ckOw(tor(g,r,.075,0xf6d58a,cx,y,0));GR(m,i*.1,i*.1+.12,cx,y,0,1,1,1,undefined,(t,k)=>{ckTn(m,0xf6d58a,0xff8c00,ckPh(k,.3,.62));if(k>.74)ckTn(m,0xff8c00,0xffbf3a,ckPh(k,.74,.9));});});
  R(pp,0,.32,t=>{const a=t*12.5,r=.3*(1-.7*t);pp.position.set(cx+Math.cos(a)*r,1.8,Math.sin(a)*r);pp.rotation.z=.3;},.34);
  cyl(lg,.17,.11,.13,0xc7ccd4,0,0,0,10);cyl(lg,.035,.035,.8,0xc7ccd4,.4,.2,0,6).rotation.z=-1.2;g.add(lg);
  R(lg,.62,1,(t,k)=>{const a=ckEo(ckPh(k,.62,.72)),r=ckEo(ckPh(k,.9,1)),m=a*(1-r);lg.position.set(.9+(cx+.1-.9)*m,1.6+.5*m,.45-.4*m);lg.rotation.z=.8*ckPh(k,.72,.8)*(1-r);});
  R(sy,.74,.9,t=>{const s=Math.min(1,t*4);sy.scale.y=s;sy.position.set(cx+.1,2-.25*s,.05);});
  PF(cx-.5,1.47,.12,.14,.62,0xfff2b0,3,.25,.05);PF(cx+.5,1.47,-.1,.16,.62,0xfff2b0,3,.25,.05);f.s=[.3,.62,.9];}
 else if(BI===4){ // bhatura: dough ball, flattened on tawa, flipped, puffs up golden, moved onto a plate with chhole
  const px=-.1,pz=.78,db=ckOw(sph(g,.22,0xf3e3c3,0,0,0));
  R(db,0,1,(t,k)=>{const d=ckPh(k,0,.18),fl=ckPh(k,.18,.38),fp=ckPh(k,.4,.55),pf=ckPh(k,.55,.78),ot=ckEo(ckPh(k,.8,1)),sy=(1-.7*fl)*(1+.9*pf),sx=1+.9*fl-.2*pf;
   db.scale.set(sx,sy,sx);db.rotation.x=fp*Math.PI;
   db.position.set(-.5+(px+.5)*ot,1.24+.22*sy+(k<.18?.9*(1-ckBo(d)):0)+Math.sin(fp*Math.PI)*.45+Math.sin(ot*Math.PI)*.4,.05+(pz-.05)*ot);
   ckTn(db,0xf3e3c3,0xe3a857,ckPh(k,.38,.78));});
  GR(cyl(g,.4,.4,.04,0xffffff,px,1.2,pz,16),.78,.9,px,1.2,pz);GR(sph(g,.13,0xb06a2a,px+.2,1.27,pz-.05),.8,.92,px+.2,1.27,pz-.05);
  PF(-.5,1.45,.05,.25,.78,0xffffff,3,.7,.07);f.s=[.18,.38,.55,.78];}
 else if(BI===5){ // wok: veggies drop in, tossed over flames, noodles, sauce, steam
  const wy=2.06;
  [[0xff8c1a,-.3,.1],[0x2e9e44,.25,.2],[0xf1f1f1,0,-.3],[0xe63946,.3,-.15],[0x9bd04a,-.2,-.2]].forEach(([c,x,z],i)=>{const m=box(g,.14,.1,.14,c,0,0,0);DR(m,i*.05,i*.05+.14,x,wy,z,1.1,undefined,(t,k)=>{if(k>.3&&k<.8){m.position.y+=Math.abs(Math.sin(k*17+i))*.5;m.rotation.set(k*14+i,0,k*11);}});});
  const nd=tor(g,.3,.06,0xe9c46a,0,wy,0);GR(nd,.3,.42,0,wy,0,1,1,1,undefined,(t,k)=>{if(k>.44&&k<.8)nd.position.y+=Math.abs(Math.sin(k*15))*.4;});
  GR(cyl(g,.52,.52,.02,0x5a2d0c,0,0,0,16),.42,.54,0,2,0);
  [-.45,.45].forEach((x,i)=>{const m=glow(g,.16,.5,.16,0xffa200,x,1.7,.62);R(m,.3,.8,(t,k)=>{m.scale.y=.5+Math.abs(Math.sin(k*30+i*2))*.9;m.position.set(x,1.7,.62);});});
  PF(0,2.2,0,.5,1,0xffffff,4,.7,.09);f.s=[.28,.54,.8];}
 else if(BI===6){ // biryani: meat, rice layer, saffron/masala, dum steam, plated
  const hx=-.25;
  [[.12,.08],[-.12,-.02],[0,-.14]].forEach(([x,z],i)=>DR(box(g,.16,.13,.16,0x7b3f00,0,0,0),i*.06,i*.06+.14,hx+x,2.6,z,1.2));
  GR(cyl(g,.4,.4,.1,0xf5e6a8,hx,2.66,0,16),.2,.34,hx,2.66,0);
  [[.12,.1],[-.14,.05],[.02,-.15],[-.05,.14]].forEach(([x,z],i)=>DR(box(g,.07,.05,.07,i&1?0xff7b00:0xd62828,0,0,0),.34+i*.03,.44+i*.03,hx+x,2.74,z,.6));
  PF(hx,2.8,0,.5,.86,0xffffff,4,.9,.1);
  GR(cyl(g,.4,.4,.04,0xffffff,.8,1.16,.5,16),.86,.94,.8,1.16,.5);GR(sph(g,.26,0xf5e6a8,.8,1.33,.5),.9,1,.8,1.33,.5,1,.6,1);f.s=[.2,.5,.86];}
 else if(BI===7){ // egg roll: paratha, egg, fillings, rolled up, slid onto plate
  const fg=new THREE.Group(),rl=cyl(g,.14,.14,.8,0xd9a441,0,0,0,10),pl=cyl(g,.4,.4,.04,0xffffff,0,1.2,.85,16);g.add(fg);
  R(fg,0,.72,(t,k)=>{fg.scale.set(1,1,1-.55*ckPh(k,.5,.72));},.72);
  DR(cyl(fg,.52,.52,.03,0xe9c46a,0,0,0,18),0,.14,0,1.27,0,.9);
  GR(cyl(fg,.4,.4,.02,0xfff6d8,0,0,0,16),.14,.28,0,1.3,0);GR(sph(fg,.09,0xffc400,0,0,0),.2,.3,0,1.33,0);
  [0x7cb342,0xd62828,0xf4f4f4].forEach((c,i)=>DR(box(fg,.5,.04,.08,c,0,0,0),.28+i*.07,.4+i*.07,0,1.36+i*.02,-.15+i*.15,.7));
  R(rl,.58,1,(t,k)=>{const o=ckEo(ckPh(k,.8,1));rl.rotation.z=Math.PI/2;rl.scale.set(1,ckEo(ckPh(k,.58,.74)),1);rl.position.set(0,1.38-.02*o+Math.sin(o*Math.PI)*.3,.85*o);});
  GR(pl,.76,.88,0,1.2,.85);PF(0,1.5,0,.3,.78,0xffffff,3,.7,.07);f.s=[.14,.28,.5,.78];}
 else if(BI===8){ // dosa: batter poured and spread in a spiral, fries golden, masala, rolled, onto plate
  const ds=ckOw(cyl(g,.8,.8,.025,0xf6ead0,0,1.285,0,24)),ld=cyl(g,.1,.07,.18,0xc7ccd4,0,0,0,10),rl=cyl(g,.1,.22,.85,0xe3b365,0,0,0,10),px=.95,pz=-.2,mk=sph(g,.22,0xe8b21a,0,0,0);
  R(ds,0,.8,(t,k)=>{const s=.12+.88*ckEo(ckPh(k,0,.36));ds.scale.set(s,1,s*(1-.62*ckPh(k,.62,.78)));ckTn(ds,0xf6ead0,0xe3b365,ckPh(k,.36,.6));},.8);
  R(ld,0,.36,t=>{const a=t*14,r=.65*t;ld.position.set(Math.cos(a)*r,1.55,Math.sin(a)*r);ld.rotation.z=.4;},.38);
  mk.scale.set(1.4,.6,1.1);DR(mk,.5,.62,0,1.34,0,.6,.8);
  R(rl,.62,1,(t,k)=>{const o=ckEo(ckPh(k,.8,1));rl.rotation.z=Math.PI/2;rl.scale.set(1,ckEo(ckPh(k,.62,.8)),1);rl.position.set(px*o,1.4-.04*o+Math.sin(o*Math.PI)*.3,pz*o);});
  GR(cyl(g,.36,.36,.04,0xffffff,px,1.2,pz,16),.78,.9,px,1.2,pz);PF(0,1.5,0,.38,.78,0xffffff,3,.7,.07);f.s=[.36,.62,.8];}
 else{ // royal sweets: dough balls into hot ghee, bubbles, fried dark, lifted to the thali, syrup spreads
  [[-.55,.1],[-.2,-.15],[-.35,.25]].forEach(([x,z],i)=>{const m=ckOw(sph(g,.13,0xd9a066,0,0,0)),a=i*.07,tx=.58+i*.12,tz=.1+(i-1)*.12;
   DR(m,a,a+.16,x,1.76,z,1.1,undefined,(t,k)=>{ckTn(m,0xd9a066,0x5c2a0e,ckPh(k,.3,.6));if(k>.2&&k<.6)m.position.y+=Math.sin(k*30+i*2)*.03;const tr=ckEo(ckPh(k,.6,.84));if(tr>0)m.position.set(x+(tx-x)*tr,1.76-.46*tr+Math.sin(tr*Math.PI)*.6,z+(tz-z)*tr);});});
  GR(cyl(g,.4,.4,.02,0xffb347,.7,1.19,.1,18),.84,.94,.7,1.19,.1);
  PF(-.4,1.7,0,.12,.6,0xfff1b0,3,.3,.05);f.s=[.3,.6,.84];}
 // progress bar above the machine: fill = k (same timer as production), ticks = end of each stage
 const bk=box(bg,1.7,.2,.12,0x1b1b22,0,0,0);bk.castShadow=false;f.fill=box(bg,1.6,.1,.14,0x2ecc71,0,0,.01);f.fill.castShadow=false;
 f.s.slice(0,-1).forEach(s=>{const t=box(bg,.03,.16,.15,0xffffff,-.8+1.6*s,0,.02);t.castShadow=false;});
 bg.position.set(0,3.35,.3);return f;}
function cookAnim(o){
 const on=o.on&&o.stock<MCAP('g'),f=o.fx,dd=o.body.userData.dish;
 if(!on){if(f&&f.g.visible){f.g.visible=f.bg.visible=false;if(dd)dd.visible=true;}return;}
 const fx=f||(o.fx=cookBuild(o)),k=Math.min(1,o.t/GI());
 if(dd)dd.visible=false;fx.g.visible=fx.bg.visible=true;fx.g.scale.setScalar(o.body.scale.x);
 const kk=Math.max(.001,k);fx.fill.scale.x=kk;fx.fill.position.x=-.8*(1-kk);
 for(const p of fx.P){const v=k>p.a&&(p.h===undefined||k<p.h);p.m.visible=v;if(v)p.fn(ckPh(k,p.a,p.b),k);}}
const stations=[];
function newStn(kind,x,a,lazy,zz){const z=zz===undefined?stZ(kind):zz,g=new THREE.Group();g.position.set(x,0,z);scene.add(g);const o={kind,x,z,g,body:new THREE.Group(),px:x,pz:z+(kind==='side'?1.6:2.1)};g.add(o.body);aoBlob(g,0,.2,SK[kind].w+1.5,SK[kind].d+1.7,1);
 if(kind==='grill'||kind==='drink'||kind==='side'){o.sg=new THREE.Group();o.sg.position.set(0,.08,kind==='side'?1.6:2);g.add(o.sg);o.stock=kind==='side'?0:3;o.t=0;o.fk=kind==='grill'?'b':kind==='side'?'s':'d';if(kind==='grill')o.sg.userData.mx=10;st(o.sg,o.stock,o.fk);
  if(kind==='grill'){box(g,2.3,.07,1.6,[0x23232b,0x8a5a3a,0x5a4030,0xc27a2a,0x4a4a52,0x3a2a2a,0x6b4226,0x6b7078,0x2f5a38,0x7a3b5c][BI],0,.035,2.05).castShadow=false;for(let i=-3;i<=3;i++)box(g,.1,.03,1.4,0x55555f,i*.33,.08,2.05).castShadow=false;}o.rg=ring(o.px,o.pz,kind==='grill'?0xffd23f:kind==='side'?0xff7fb0:0x4cc9f0);}
 else if(kind==='pack'){o.gin=new THREE.Group();o.gout=new THREE.Group();o.gin.position.set(-.7,1.1,0);o.gout.position.set(.7,1.1,0);g.add(o.gin,o.gout);o.gsn=new THREE.Group();o.gsn.position.set(0,1.1,.52);g.add(o.gsn);Object.assign(o,{inb:0,out:0,prog:0,sin:0,oS:0}); // sin = side items waiting to be packed, oS = finished boxes that contain a sideo.gout.scale.setScalar(1.45); // finished boxes are stored side-by-side, bigger
  o.pa=new THREE.Group();o.pa.position.set(0,1.1,0);o.pa.visible=false;g.add(o.pa);o.pbx=new THREE.Group();o.pa.add(o.pbx);o.plid=mkPack(o.pbx);o.pdi=makeItem('b');o.pdi.scale.setScalar(.7);o.pa.add(o.pdi); // packing animation: box + lid + dish
  o.bar=box(g,1.6,.12,.12,0x2ecc71,0,2.4,0);o.bar.scale.x=.001;o.bar.castShadow=false;ring(o.px,o.pz,0xd9b383);}
 else{o.sg=new THREE.Group();o.sg.position.set(-.6,1.12,0);g.add(o.sg);o.stock={k:0,ks:0};if(kind==='counter'){o.dg=new THREE.Group();o.dg.position.set(.2,1.12,.1);g.add(o.dg);o.sgk=new THREE.Group();o.sgk.position.set(-.2,1.12,.62);g.add(o.sgk);Object.assign(o,{shelf:0,dk:0,sk:0,q:[],sv:0});}else ring(o.px,o.pz,0xffa62b);}
 const l=label();l.position.set(0,3.9,0);g.add(l);l.draw({grill:B0.gn,counter:B0.cn[0],pack:'PACKING',drink:B0.dn[0],win:'CAR & SCOOTER',side:['FRIES','GARLIC BREAD','CHAI + SAMOSA','CUTTING CHAI','PYAAZ ACHAAR','SPRING ROLL','SALAN MIRCHI','COLD COFFEE','MEDU VADA','RABRI'][BI]}[kind],{grill:'cook',counter:B0.cn[1],pack:'stand here',drink:B0.dn[1],win:'hand bags',side:'extra $'}[kind]);
 o.on=!lazy;if(lazy){g.visible=false;if(o.rg)o.rg.visible=false;}else solid(x,z,SK[kind].w+.2,SK[kind].d);skin(o);stations.push(o);if(a&&!lazy)pop(g);return o;}
function activate(o,a){o.on=true;o.g.visible=true;if(o.rg)o.rg.visible=true;solid(o.x,o.z,SK[o.kind].w+.2,SK[o.kind].d);if(a)pop(o.g);}
const CT=newStn('counter',L.st.counter,false,true),G0=newStn('grill',L.st.grill,false,true),S={pack:null,drink:null,win:null,side:null};
const reskin=()=>stations.forEach(skin);
function mkLane(){} // the road now exists from the start (buildOuter)
const trash={x:L.trash[0],z:L.trash[1]};
{const g=new THREE.Group();g.position.set(trash.x,0,trash.z);scene.add(g);const cm=Assets.clone('trash');
 if(cm){g.add(cm);trash.lid=new THREE.Group();trash.lid.position.y=1.06;g.add(trash.lid);}else{cyl(g,.5,.4,1,0x6c757d,0,.5,0,10);cyl(g,.52,.52,.06,0x8d99ae,0,.9,0,10);trash.lid=cyl(g,.56,.56,.12,0x495057,0,1.06,0,10);cyl(g,.1,.1,.14,0xced4da,0,1.18,0,6);}
 const tl=label(.55);tl.position.y=2.1;g.add(tl);tl.draw('TRASH','bin');aoBlob(g,0,0,2,2,1);solid(trash.x,trash.z,1,1);ring(trash.x,trash.z,0xff595e);}
const cashPad={x:L.cash[0],z:L.cash[1]},cashStack=new THREE.Group();
{const g=new THREE.Group();g.position.set(cashPad.x,0,cashPad.z);scene.add(g);cyl(g,1.2,1.2,.08,0x2ecc71,0,.04,0,24);aoBlob(g,0,0,3.2,3.2,.7);cashStack.position.y=.08;cashStack.scale.setScalar(1.5);g.add(cashStack);cashPad.lab=label(.75);cashPad.lab.position.y=1.9;g.add(cashPad.lab);}
/* ===== long customer queue: red runner + slot dots + arrows + chrome stanchions, up to QMAX people; the end label shows how full it is ===== */
const QMAX=9,QL=new THREE.Group(),qx=L.st.counter,qz0=stZ('counter')+1.9;QL.visible=false;scene.add(QL);
{const zS=qz0-.9,zE=qz0+QMAX-1+.9,len=zE-zS,cz=(zS+zE)/2;
 const ps=[];for(let z=zS+.1;z<=zE+.01;z+=2)ps.push(z);
 [-1,1].forEach(sd=>{const px=qx+sd*1.05;ps.forEach((z,k)=>{cyl(QL,.2,.22,.06,0xdfe3e8,px,.03,z,10);cyl(QL,.06,.06,.85,0xdfe3e8,px,.45,z,8);sph(QL,.1,0xffd23f,px,.92,z);if(k<ps.length-1)box(QL,.05,.05,1.85,0xd62828,px,.78,z+1);});});
 const ql=label(.7);ql.position.set(qx,2.2,zE+.9);QL.add(ql);QL.ql=ql;}
const CIRM=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.strokeStyle='#fff';x.lineWidth=11;x.lineCap='round';x.setLineDash([26,20]);x.beginPath();x.arc(128,128,112,0,Math.PI*2);x.stroke();return new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false});})();
{const m=new THREE.Mesh(new THREE.PlaneGeometry(2.4,2.4),CIRM);m.rotation.x=-Math.PI/2;m.position.set(L.st.counter,.07,stZ('counter')-SCZ);m.renderOrder=2;QL.add(m);}
function qUpd(){const n=CT.q.length;if(QL.n!==n){QL.n=n;QL.ql.draw(n>=QMAX?'QUEUE FULL':'QUEUE',n+'/'+QMAX);}}
function refreshPile(){const n=Math.min(32,Math.ceil(pile/(PRICE*.4)));if(cashStack.userData.n!==n){cashStack.userData.n=n;while(cashStack.children.length)cashStack.remove(cashStack.children[0]);
 for(let i=0;i<n;i++){const col=i&1,lvl=i>>1,y=.07+lvl*.11,x=(col?.4:-.4)+Math.sin(i*3.1)*.03,b=box(cashStack,.74,.1,.44,(lvl&1)?0x29d955:0x4cf07a,x,y,Math.cos(i*2.3)*.04);b.rotation.y=Math.sin(i*5)*.1;b.material=(lvl&1)?billB:billA;
  if(lvl%4===3){const bn=box(cashStack,.76,.11,.1,0xfff1a0,x,y,0);bn.rotation.y=b.rotation.y;bn.material=bandM;}}}cashPad.lab.draw('CASH','$'+fmt(pile));}
/* tables: customers must eat here; dirty tables block seating until cleaned */
const tables=[];
/* simple wooden chair: seat + back + 4 legs; ry turns the back away from the table */
function chair(p,cx,ry,col=B0.w){const c=new THREE.Group();c.position.set(cx,0,0);c.rotation.y=ry;p.add(c);box(c,.62,.1,.62,col,0,.5,0);box(c,.62,.7,.1,0x6c4a2a,0,.9,-.26);[[-.25,-.25],[.25,-.25],[-.25,.25],[.25,.25]].forEach(([a,b])=>box(c,.08,.45,.08,0x6c4a2a,a,.22,b));}
/* table levels (T.tl = 0..2 saved in SV.b[BI]): L1 plain wood, L2 coloured top + cloth (tips x1.3), L3 marble/gold + sofa seating (tips x1.7) */
const TBM=()=>[1,1.3,1.7][Math.min(2,T.tl|0)],TLC=[8,10],tblCost=()=>sc2(TLC[Math.min(1,T.tl|0)]);
function sofa(p,cx,ry,col,col2){const c=new THREE.Group();c.position.set(cx,0,0);c.rotation.y=ry;p.add(c);box(c,1.5,.34,.8,col,0,.25,0);box(c,1.1,.14,.6,col2,0,.49,.06);box(c,1.5,.62,.2,col,0,.62,-.33);[-.65,.65].forEach(a=>box(c,.2,.42,.8,col,a,.46,0));box(c,.3,.28,.1,0xffd166,-.3,.72,-.18);box(c,.3,.28,.1,0xffd166,.3,.72,-.18);}
function skinTable(t){const s=t.sk,l=Math.min(2,T.tl|0);while(s.children.length)s.remove(s.children[0]);
 if(t.zk){skinZ(t,s,l);return;}
 if(l===0){const cm=Assets.clone('table');if(cm)s.add(cm);else{box(s,1.3,.1,1.3,HC[BI],0,.95,0);[[-.5,-.5],[.5,-.5],[-.5,.5],[.5,.5]].forEach(([a,b])=>box(s,.1,.9,.1,0x6c4a2a,a,.45,b));}chair(s,1.3,-Math.PI/2,B0.w);chair(s,-1.3,Math.PI/2,B0.w);}
 else if(l===1){box(s,1.3,.1,1.3,HC[BI],0,.95,0);[[-.5,-.5],[.5,-.5],[-.5,.5],[.5,.5]].forEach(([a,b])=>box(s,.1,.9,.1,0x264653,a,.45,b));box(s,.9,.03,.9,B0.w,0,1.015,0).rotation.y=Math.PI/4;box(s,.5,.034,.5,HC[BI],0,1.017,0).rotation.y=Math.PI/4;chair(s,1.3,-Math.PI/2,B0.w);chair(s,-1.3,Math.PI/2,B0.w);}
 else{box(s,1.4,.1,1.4,0xf2efe8,0,.95,0);box(s,1.46,.04,1.46,0xd4af37,0,.91,0);cyl(s,.14,.2,.85,0xd4af37,0,.45,0,10);cyl(s,.5,.55,.06,0xd4af37,0,.03,0,12);cyl(s,.06,.08,.22,0xe63946,-.5,1.11,.5,8);sph(s,.1,0xff6b81,-.5,1.28,.5);sofa(s,1.3,-Math.PI/2,0xb5446e,0xf4a6c0);sofa(s,-1.3,Math.PI/2,0xb5446e,0xf4a6c0);}}
function upTable(){const l=T.tl|0;if(l>=2||traveling||UP.open||!player)return;const t=tables.find(q=>dist(player.position.x,player.position.z,q.x,q.z)<2.6);if(!t)return;const c=tblCost();
 if(cash<c){popText(new THREE.Vector3(t.x,2.4,t.z),'Not enough cash','#ff6b6b');beep(180,.1,.05);return;}
 cash-=c;hud();T.tl=l+1;tables.forEach(q=>{skinTable(q);pop(q.sk);burst(q.x,1.5,q.z,[0xffd23f,0x7CFC9A,0xffffff],20,3,5,1);starBurst(q.x,1.6,q.z,8);});
 flash();banner('TABLE UPGRADED!','Level '+(T.tl+1)+' - tips x'+TBM());[523,659,784,1046].forEach((f,j)=>setTimeout(()=>beep(f,.1,.05),j*70));dirty=true;save();}
function addTable(p,a){const[x,z]=p,g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
 const sk=new THREE.Group();g.add(sk);aoBlob(g,0,0,3.6,2.6,.9);solid(x-1.3,z,.7,.7);
 const bills=new THREE.Group();bills.position.y=1;g.add(bills);const plates=new THREE.Group();plates.position.y=1.02;g.add(plates);
 cyl(plates,.3,.3,.05,0xffffff,-.2,0,.1,10);cyl(plates,.3,.3,.05,0xffffff,.25,0,-.2,10);cyl(plates,.12,.12,.06,0xd62828,-.2,.05,.1,6);plates.visible=false;
 solid(x,z,1.4,1.4);const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:dollarTex,transparent:true,depthTest:false}));sp.scale.set(1.15,1.15,1);sp.position.set(0,2.5,0);sp.renderOrder=10;sp.visible=false;g.add(sp);
 tables.push({x,z,occ:false,dirty:false,res:false,sOcc:[false,false],sRes:[false,false],cash:0,ct:0,bills,plates,sp,sk,sl:[{x:x+1.3,z,ry:-Math.PI/2,ent:[{x:x+1.3,z:z-1.7},{x:x+1.3,z}],out:[{x:x+1.3,z:z-1.7},{x:x+2.6,z:z-1.7}]},{x:x-1.3,z,ry:Math.PI/2,ent:[{x:x-1.3,z:z-1.7},{x:x-1.3,z}],out:[{x:x-1.3,z:z-1.7},{x:x+2.6,z:z-1.7}]}]});skinTable(tables[tables.length-1]);if(a)pop(g);}
function refreshTable(t){while(t.bills.children.length)t.bills.remove(t.bills.children[0]);
 const n=Math.min(14,Math.ceil(t.cash/(TIP*.5))),two=n>7;t.sp.visible=t.cash>0;
 for(let i=0;i<n;i++){const lvl=two?i>>1:i,m=new THREE.Mesh(tbGeo,(lvl&1)?billB:billA);m.position.set(two?((i&1)?.5:-.5):0,.08+lvl*.14,0);m.rotation.y=Math.sin(i*5)*.12;m.castShadow=true;t.bills.add(m);
  if(lvl%4===3){const b=new THREE.Mesh(tbBand,bandM);b.position.copy(m.position);b.rotation.y=m.rotation.y;t.bills.add(b);}}}
const refreshPack=()=>{const P=S.pack,n=Math.min(8,P.out),w=Math.min(n,P.oS);st(P.gin,P.inb,'b');st(P.gsn,P.sin,'s');stack(P.gout,Array(n-w).fill('k').concat(Array(w).fill('K')));};
/* packing animation (visual only), k = pack progress 0..1 = the bar: 0-22% box opens, 22-42% dish lifts over, 42-60% drops in,
   60-82% lid closes, 82-100% closed box slides to the big out-stack (the real stack item appears at the same spot when it finishes) */
function packAnim(o,k){const a=k>.004,gc=o.gin.children,tp=gc[gc.length-1];if(tp)tp.visible=!a;o.pa.visible=a;if(!a)return;
 const mv=ckEo(ckPh(k,.22,.42)),dr=ckPh(k,.42,.6),sl=ckEo(ckPh(k,.82,1)),sy=Math.max(0,o.inb-1)*STEP.b+.05;
 o.plid.rotation.x=-2.1*ckEo(ckPh(k,0,.22))*(1-ckEo(ckPh(k,.6,.82)));
 o.pdi.visible=k<.6;o.pdi.position.set(-.7*(1-mv),dr>0?.8-.92*ckEo(dr):sy+(.8-sy)*mv+Math.sin(mv*Math.PI)*.15,0);
 o.pbx.position.set(.7*sl,.03*(1-sl)+sl*o.out*STEP.k*1.45,0);o.pbx.scale.setScalar(1+.45*sl);}

/* ================= drive-thru cars: hand-off must be done by a person at the window ================= */
const cars=[],dtq=[];let carT=3,hand=0;
function makeVehicle(sc){const g=new THREE.Group(),kind=sc?'scooter':'car';
 if(Assets.has(kind)){g.add(Assets.clone(kind));return g;}
 const col=pick([0xef476f,0x118ab2,0xffd166,0x06d6a0,0x9b5de5,0xff7b00]);
 if(!sc){box(g,2.8,.7,1.4,col,0,.65,0);box(g,1.4,.55,1.3,0xcfe8ff,.2,1.2,0);glow(g,.1,.2,.3,0xfff3a0,-1.42,.7,.45);glow(g,.1,.2,.3,0xfff3a0,-1.42,.7,-.45);
  [[-.9,.65],[.9,.65],[-.9,-.65],[.9,-.65]].forEach(([x,zz])=>{cyl(g,.35,.35,.2,0x222222,x,.35,zz,10).rotation.x=Math.PI/2;});}
 else{box(g,1.5,.32,.5,col,0,.5,0);box(g,.45,.8,.45,col,-.6,.95,0);box(g,.75,.16,.42,0x222222,.25,.82,0);box(g,.08,.08,.95,0x333333,-.75,1.45,0);glow(g,.1,.16,.2,0xfff3a0,-.95,1.05,0);
  [-.7,.7].forEach(x=>{cyl(g,.3,.3,.16,0x222222,x,.3,0,10).rotation.x=Math.PI/2;});
  box(g,.55,.5,.55,0xffd23f,.85,1.1,0);box(g,.38,.55,.34,pick([0x4cc9f0,0xf72585,0x90be6b]),.15,1.2,0);sph(g,.22,0xffd9b3,.15,1.72,0);sph(g,.27,pick([0xef476f,0xffffff,0x3a86ff]),.15,1.8,0).scale.y=.8;}
 aoBlob(g,0,0,sc?2.2:3.8,sc?1.1:2.1,.9);return g;}
const winShow=()=>{const w=S.win.stock,n=Math.min(8,w.k),s=Math.min(n,w.ks);stack(S.win.sg,Array(n-s).fill('k').concat(Array(s).fill('K')));}; // window shelf: plain bags + bags with a side item
function spawnCar(){const sc=Math.random()<.4,g=makeVehicle(sc),z=L.nz-3.8;g.position.set(L.st.win+34,0,z);scene.add(g);
 const l=label(.8);l.position.y=sc?2.6:2.8;g.add(l);const sd=!!S.side&&Math.random()<.3;l.draw(sc?'Scooter':'Order',sd?'bag+side':'1 bag');const c={g,l,out:false,sc,sd}; // 30% of cars also want a side item (only once the Side Items counter exists)cars.push(c);dtq.push(c);}
const winAt=()=>S.win&&(dist(player.position.x,player.position.z,S.win.px,S.win.pz)<2.6||workers.some(w=>w.role==='D'&&dist(w.g.position.x,w.g.position.z,S.win.px,S.win.pz)<2.6));
/* the finished bag (this hotel's own package look) flies from the window into the car / scooter, then the vehicle drives off */
function flyBag(a,b,dur,end){const m=makeItem('k');m.scale.setScalar(1.5);m.visible=false;addFx(m,dur,(k,o)=>{o.visible=true;o.position.set(a.x+(b.x-a.x)*k,a.y+(b.y-a.y)*k+Math.sin(k*Math.PI)*2.2,a.z+(b.z-a.z)*k);o.rotation.y=k*6.283;o.scale.setScalar(1.5-.7*k);},end);}
function carsUpd(dt){if(!S.win)return;carT+=dt;if(carT>7&&dtq.length<2){carT=0;spawnCar();}
 for(let i=cars.length-1;i>=0;i--){const c=cars[i],sx=L.st.win,tx=c.out?sx-60:sx+dtq.indexOf(c)*4.5,d=tx-c.g.position.x;c.g.position.x+=Math.sign(d)*Math.min(Math.abs(d),(c.out?9:6)*dt);
  if(c.sd&&!c.out&&!c.fly&&dtq[0]===c&&Math.abs(d)<.05&&S.win.stock.k>=1&&S.win.stock.ks<1){c.sw=(c.sw||0)+dt;if(c.sw>25){c.sd=false;c.l.draw(c.sc?'Scooter':'Order','1 bag');}} // no side item for 25s: the car takes a plain bag instead
  if(!c.out&&!c.fly&&dtq[0]===c&&Math.abs(d)<.05&&S.win.stock.k>=1&&(!c.sd||S.win.stock.ks>=1)&&winAt()){hand+=dt;if(hand>=HTV()){hand=0;c.fly=1;{const W=S.win.stock;if(c.sd||W.k<=W.ks)W.ks--;W.k--;}winShow();const pay=(PRICE*2+(c.sd?PRICE:0))*evm();pile+=pay;refreshPile();tossBills(sx,L.nz-3.2,pay);burst(sx,1.8,L.nz-3.4,[0xffd23f,0xffffff,0x7CFC9A],16,3.2,4.5,.9);shock(sx,L.nz-3.8,0x7CFC9A);
   popText(new THREE.Vector3(sx,2.6,L.nz-3.8),'+$'+fmt(pay)+' x2!','#7CFC9A');beep(740,.08);beep(990,.1);addXP(8);mis('car');c.l.visible=false;
   flyBag({x:sx-.6,y:1.9,z:L.nz+1.4},{x:c.g.position.x+(c.sc?-.3:-.9),y:c.sc?1.15:1.2,z:L.nz-3.8},.75,()=>{const bg=makeItem('k');bg.scale.setScalar(.75);bg.position.set(c.sc?-.3:-.9,c.sc?1.0:1.05,0);c.g.add(bg);
    burst(c.g.position.x,1.6,L.nz-3.8,[0xffd23f,0xffffff,0x7CFC9A],10,2,3.5,.8);beep(880,.06);const j=dtq.indexOf(c);if(j>=0)dtq.splice(j,1);c.out=true;});}}
  if(c.g.position.x<sx-55){scene.remove(c.g);cars.splice(i,1);}}}

/* ================= upgrade pads (strict chain: ONE chain pad exists at a time) ================= */
const pads=[];
/* Pad layout: station pads sit BESIDE their station (on its own row, never in the pickup lane in front), table pads sit on the open side of their table, and speed / carry / helper pads stand in one tidy line in the Management Office along the outer wall. Pads never sit in the middle of the floor. */
function computePads(L){const z0=L.nz+1.4,cs=new Set();(L.r0||L.rects).forEach(([x0,za,x1,zb])=>{for(let i=x0/2;i<x1/2;i++)for(let j=za/2;j<zb/2;j++)cs.add(i+','+j);});
 const inFl=(x,z)=>cs.has(Math.floor(x/2)+','+Math.floor(z/2)),fl=(x,z,r)=>[[r,0],[-r,0],[0,r],[0,-r],[r*.7,r*.7],[-r*.7,r*.7],[r*.7,-r*.7],[-r*.7,-r*.7]].every(([a,b])=>inFl(x+a,z+b));
 const stn=Object.keys(L.st).map(k=>({k,x:L.st[k],z:stZ(k,L),hw:SK[k].w/2+.1,hd:SK[k].d/2})),rectD=(x,z,o)=>Math.hypot(Math.max(Math.abs(x-o.x)-o.hw,0),Math.max(Math.abs(z-o.z)-o.hd,0));
 const fx=[];stn.forEach(o=>{fx.push([o.x,o.z+2.1,1.5]);if(o.k==='counter')fx.push([o.x,o.z-SCZ,1.7]);});                                   // pickup spots in front of every station
 for(let zz=stZ('counter',L)+1.9;zz<=L.ent.z;zz+=1)fx.push([L.st.counter,zz,1.3]);                        // customer queue
 fx.push([L.cash[0],L.cash[1],1.6],[L.trash[0],L.trash[1],1.5],[L.ex.x,L.ex.z-1.6,1.5]);   // cash pad, trash, exit aisle
 [L.arrN,L.arrP].forEach(a=>a&&fx.push([a.x,a.z,1.6]));
L.tabs.forEach(([tx,tz])=>[[-1.6,0,.95],[0,-1.25,1],[0,1.25,1]].forEach(([a,b,r])=>fx.push([tx+a,tz+b,r])));   // chairs around tables
 const mg=[0,1,2,3].map(i=>({x:L.mz.x+i*L.mz.dx,z:L.mz.z+i*L.mz.dz}));mg.forEach(m=>fx.push([m.x,m.z,1.9]));
 const hr=[0,1,2].map(i=>({x:L.mz.x+L.mz.rx+i*L.mz.dx,z:L.mz.z+L.mz.rz+i*L.mz.dz}));hr.forEach(m=>fx.push([m.x,m.z,1.9]));
 const used=[];
 const ok=(x,z,rx,rf)=>{if(!fl(x,z,.9*rf))return false;for(const[a,b,r]of fx)if(Math.hypot(x-a,z-b)<r*rx)return false;for(const o of stn)if(rectD(x,z,o)<.85*rf)return false;for(const[a,b]of used)if(Math.hypot(x-a,z-b)<1.9*rx)return false;return true;};
 const pickFirst=(c,extra)=>{for(const[rx,rf]of[[1,1],[.8,.9],[.6,.8],[.4,.7]])for(const[x,z]of c)if(ok(x,z,rx,rf)&&(!extra||extra(x,z)))return{x,z};return null;};
 // 1) station pads: always BESIDE the station on its own row (never in front). Exhaustive search -> closest valid side/offset for all five.
 const keys=[['grill','grill'],['counter','counter'],['pack','pack'],['drink','drink'],['drive','win']],opt=[];
 keys.forEach(([key,kind])=>{const o=stn.find(q=>q.k===kind),a=[];[.9,1.0,1.25,1.55,1.9,2.4,3.0].forEach(off=>[1,-1].forEach(sd=>{const x=o.x+sd*(o.hw+off),z=o.z;if(fl(x,z,.9)&&stn.every(q=>rectD(x,z,q)>=.85)&&fx.every(([p,q,r])=>Math.hypot(x-p,z-q)>=r))a.push({x,z,c:off+(sd<0?.05:0)});}));opt.push(a);});
 if(typeof DBG!=="undefined")console.log(opt.map((a,i)=>keys[i][0]+":"+a.map(p=>p.x.toFixed(1)).join("/")).join("  "));let bestC=1e9,bestA=null;const cur=[];
 (function dfs(i,c){if(c>=bestC)return;if(i===opt.length){bestC=c;bestA=cur.slice();return;}for(const p of opt[i]){if(cur.some(q=>Math.hypot(q.x-p.x,q.z-p.z)<1.9))continue;cur[i]=p;dfs(i+1,c+p.c);cur.length=i+1;}})(0,0);
 const st={};keys.forEach(([key],i)=>{const p=bestA?bestA[i]:pickFirst([[stn[i].x+stn[i].hw+1.2,stn[i].z]]);st[key]=p;used.push([p.x,p.z]);});
 // 2) table pads: next to their own table, preferring the open (left) side, never on its chair/aisle side. Search a fine grid around the table, nearest first.
 const grid=(cx,cz,R,cf)=>{const c=[];for(let dx=-R;dx<=R+1e-6;dx+=.4)for(let dz=-R;dz<=R+1e-6;dz+=.4){const d=Math.hypot(dx,dz);if(d<=R)c.push([+(cx+dx).toFixed(2),+(cz+dz).toFixed(2),cf(dx,dz,d)]);}return c.sort((p,q)=>p[2]-q[2]);};
 const tab=[];L.tabs.forEach(([tx,tz],i)=>{const c=grid(tx,tz,4.6,(dx,dz,d)=>d+(dx>.3?2.2:0)+Math.abs(dz)*.12);
  const p=pickFirst(c,(x,z)=>L.tabs.every(([a,b])=>Math.hypot(x-a,z-b)>=1.7&&Math.hypot(x-a-1.3,z-b)>=1.3)&&Math.hypot(x-tx,z-tz)<=4.6);tab.push(p||{x:tx-2.4,z:tz});used.push([tab[i].x,tab[i].z]);});
 // 3) door pad: the closest free spot beside the hotel door
 const dr=L.nd,door=pickFirst(grid(dr.x,dr.z,8,(dx,dz,d)=>d),(x,z)=>Math.hypot(x-dr.x,z-dr.z)>=2.4)||{x:dr.x-2,z:dr.z+3};
 return{st,tab,mg,hr,door};}
const PADS=computePads(L);
/* little plants beside each station (on the side away from its upgrade pad); skipped if they would crowd a pad */
function plant(x,z,v){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
 cyl(g,.26,.2,.3,v===1?0xff7043:0xd9822b,0,.15,0,8);cyl(g,.27,.27,.05,0x6b3e1e,0,.3,0,8);
 if(v===0){[[0,.75,0,.34],[.18,.55,.1,.24],[-.2,.58,-.08,.26]].forEach(([a,b,c,r])=>sph(g,r,0x2fbf4a,a,b,c));}
 else if(v===1){cyl(g,.1,.12,.7,0x3cc45a,0,.65,0,6);box(g,.28,.06,.06,0x3cc45a,.16,.8,0).rotation.z=.6;[[0,1.05,0],[.14,.85,.1],[-.14,.8,-.06]].forEach(([a,b,c],i)=>sph(g,.12,[0xff4d6d,0xffd60a,0xff7b00][i],a,b,c));}
 else{[[0,.8,0,.3],[0,1.1,0,.22]].forEach(([a,b,c,r])=>sph(g,r,0x3fd35f,a,b,c));sph(g,.1,0xffe14d,.1,1.3,.05);}
 aoBlob(g,0,0,1.1,1.1,.7);}
{const SKw={grill:2.2,counter:3.2,pack:2.6,drink:1.8,win:3},pl=[];let n=0;
 Object.keys(L.st).forEach(k=>{const w=SKw[k]||2.4,pd=PADS.st[k==='win'?'drive':k]||PADS.st[k];const sg=pd&&pd.x>L.st[k]?-1:1,x=L.st[k]+sg*(w/2+.5),z=L.nz+.5;
  const near=[].concat(Object.values(PADS.st),PADS.tab,PADS.mg,PADS.hr,[PADS.door]).some(p=>p&&dist(p.x,p.z,x,z)<1.25),
   hit=Object.keys(L.st).some(o=>Math.abs(x-L.st[o])<(SKw[o]||2.4)/2+.45&&Math.abs(z-(L.nz+1.4))<1.1);
  if(!near&&!hit&&inF(x,z)&&!pl.some(q=>Math.abs(q-x)<1.2)){pl.push(x);plant(x,z,(n+BI)%3);n++;}});}
/* floor decor: potted plants beside the entrance and exit (kept away from pads, tables, cash, trash) */
{const bad=[].concat(Object.values(PADS.st),PADS.tab,PADS.mg,[PADS.door]).filter(Boolean).map(p=>[p.x,p.z]).concat([L.cash,L.trash],L.arrN?[[L.arrN.x,L.arrN.z]]:[]);
 [[L.ent.x-2.5,L.ent.z-1.2],[L.ent.x+2.5,L.ent.z-1.2],[L.ex.x-2,L.ex.z-1.2],[L.ex.x+2,L.ex.z-1.2]].forEach(([x,z],n)=>{if(inF(x,z)&&walk(x,z)&&bad.every(([a,b])=>dist(x,z,a,b)>2.6)&&L.tabs.every(([a,b])=>dist(x,z,a,b)>3.4))plant(x,z,n%3);});}
/* ===== UPGRADE OFFICE + HR OFFICE: two real rooms (4 walls, black door with glass strip, desk, clerk, shelf, notice board). Standing on the round pad opens a bottom-sheet panel. Opens at step 12 (HR Office). ===== */
const RMX=[[[6,-6.4],[11.4,-6.4]],[[5.5,-6],[11,-6]],[[-19.4,-3.4],[-13.8,-3.4]],[[12,-3.5],[17.4,-3.5]],[[-13,-6.2],[-13,2]],[[8,-6.4],[13.4,-6.4]],[[-23,-6.4],[-17.6,-6.4]]][LI],ROOMS=[],HRP={x:0,z:0,wt:0};
function rtxt(txt,x,z){const F='800 92px "Baloo 2",Trebuchet MS,sans-serif',c=document.createElement('canvas');let g=c.getContext('2d');g.font=F;const tw=g.measureText(txt).width;c.width=Math.ceil(tw+130);c.height=160;g=c.getContext('2d');g.font=F;g.textBaseline='middle';g.fillStyle='rgba(112,28,28,.92)';g.fillText(txt,8,84);
 const ax=tw+70;g.beginPath();g.moveTo(ax,6);g.lineTo(ax+44,60);g.lineTo(ax+17,60);g.lineTo(ax+17,152);g.lineTo(ax-17,152);g.lineTo(ax-17,60);g.lineTo(ax-44,60);g.closePath();g.fill();
 const gp=new THREE.Group(),m=new THREE.Mesh(new THREE.PlaneGeometry(c.width*1.1/160,1.1),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false}));m.rotation.x=-Math.PI/2;gp.add(m);gp.position.set(x,.06,z);gp.rotation.y=Math.PI/4;scene.add(gp);}
function mkRoom(x0,z0,tag,keys,ttl){const W=5,x1=x0+W,z1=z0+W,cx=x0+W/2,cz=z0+W/2,gw=2,sw=(W-gw)/2;
 // look only: hotel 1 keeps the original colours, hotels 2-10 take wall / floor / desk / shelf books / notice board colours from BR[BI]
 const mx=(a,c,t)=>{const m=q=>Math.round(((a>>q)&255)*(1-t)+((c>>q)&255)*t);return(m(16)<<16)|(m(8)<<8)|m(0);},
  RC=BI?{wall:B0.wl,cap:B0.t,base:B0.tr,floor:B0.fl[0],dTop:mx(B0.ac,0xffffff,.2),dBody:mx(B0.tr,B0.wl,.25),shelf:mx(B0.wl,B0.tr,.3),plank:mx(B0.wl,B0.tr,.6),books:[B0.ac,B0.c,B0.t,mx(B0.fl[0],0xffffff,.5)],board:mx(B0.tr,0x000000,.35),paper:mx(B0.fl[0],0xffffff,.6)}:{wall:0xf0b07a,cap:0xffe066,base:0xd62828,floor:0xfde8bf,dTop:0xe0a84e,dBody:0x8a5a3a,shelf:0xf2d067,plank:0xb8891f,books:[0x3a86ff,0xef476f,0x2ecc71,0xffffff],board:0x3b2b1a,paper:0xfff3d6};
 const wl=(x,z,w,d)=>{box(scene,w,2.6,d,RC.wall,x,1.3,z);box(scene,w+.1,.14,d+.1,RC.cap,x,2.67,z);box(scene,w+.04,.3,d+.04,RC.base,x,.15,z);solid(x,z,w,d);};
 wl(cx,z0,W+.3,.3);wl(x0,cz,.3,W);wl(x1,cz,.3,W);wl(x0+sw/2,z1,sw,.3);wl(x1-sw/2,z1,sw,.3);
 box(scene,W-.3,.05,W-.3,RC.floor,cx,.03,cz).castShadow=false;
 [-1.05,1.05].forEach(o=>box(scene,.22,2.5,.4,0x5b2a0c,cx+o,1.25,z1));box(scene,2.3,.3,.4,0x5b2a0c,cx,2.45,z1);
 const D=new THREE.Group();D.position.set(cx,0,z1);scene.add(D);box(D,1.7,2.2,.14,0x1b1f27,0,1.1,0);box(D,.9,.28,.04,0xbfe9ff,0,1.75,.09);box(D,.14,.1,.06,0xdfe6ee,.55,1,.1);
 box(scene,1.4,1.9,.5,RC.shelf,x0+1.2,.95,z0+.4);[.55,1.05,1.5].forEach((y,i)=>{box(scene,1.2,.06,.42,RC.plank,x0+1.2,y,z0+.5);for(let k=0;k<4;k++)box(scene,.18,.32,.3,RC.books[(k+i)%4],x0+.8+k*.27,y+.2,z0+.5);});
 box(scene,1.3,.85,.08,RC.board,cx+1.2,1.6,z0+.2);[[-.35,.1],[0,-.12],[.34,.1]].forEach(([a,b])=>box(scene,.3,.3,.03,RC.paper,cx+1.2+a,1.6+b,z0+.27));
 box(scene,1.9,.1,.95,RC.dTop,cx+.2,.85,cz-.2);box(scene,1.7,.8,.8,RC.dBody,cx+.2,.4,cz-.2);
 [[-.3,.1],[.4,-.15]].forEach(([a,r])=>{box(scene,.7,.45,.05,0x222233,cx+.2+a,1.25,cz-.4).rotation.y=r;box(scene,.1,.2,.1,0x555b66,cx+.2+a,1,cz-.4);});
 box(scene,.6,.12,.6,0x4a3020,cx+.5,.5,cz-.95);box(scene,.55,.62,.4,0x7a4a2c,cx+.5,.95,cz-.95);sph(scene,.27,0x7a4a2c,cx+.5,1.5,cz-.95);box(scene,.14,.14,.5,0x7a4a2c,cx+.25,1,cz-.62);box(scene,.14,.14,.5,0x7a4a2c,cx+.75,1,cz-.62);
 const pg=new THREE.Group(),pz=z1-1.2;pg.position.set(cx,0,pz);scene.add(pg);cyl(pg,.88,.88,.05,0xffffff,0,.05,0,28);cyl(pg,.74,.74,.07,0xffa62b,0,.06,0,28);const pl=label(.6);pl.position.y=1.7;pg.add(pl);pl.draw(ttl,'stand here');
 const tg=label(.5);tg.position.set(cx,3.1,z1+.2);scene.add(tg);tg.draw('LOCKED','step 12');
 const ds={x:cx,z:z1,hw:gw/2,hd:.25};solids.push(ds);rtxt(tag,cx,z1+1.9);
 const bit=tag==='HR'?2:1;ROOMS.push({cx,px:cx,pz,arm:1,bit,D,tg,pg,ds,locked:true,open:()=>{SV.ro|=bit;dirty=true;sheet(ttl,keys);}});}
mkRoom(RMX[0][0],RMX[0][1],'UPGRADE',['ps','pc','pu'],'PLAYER');mkRoom(RMX[1][0],RMX[1][1],'HR',['ws','wc','rc'],'STAFF');HRP.x=ROOMS[1].px;HRP.z=ROOMS[1].pz;
function hrDraw(){const un=step()>=12;ROOMS.forEach(r=>{if(un&&r.locked){r.locked=false;const k=solids.indexOf(r.ds);if(k>=0)solids.splice(k,1);}r.D.position.x=un?r.cx-.92:r.cx;r.D.scale.x=un?.08:1;r.tg.visible=!un;r.pg.visible=un;});$('ibh').style.display=un?'flex':'none';}
const stepUn=i=>['Unlocks: Cooking','Unlocks: Customers','Unlocks: Dine-in + tips','Unlocks: Takeaway bags','Unlocks: Drive-Thru','Unlocks: 2nd table','Unlocks: Faster counter','Unlocks: Faster '+B0.pn.toLowerCase(),'Unlocks: '+B0.dp,'Unlocks: Tables 3 & 4','Unlocks: Faster packing','Unlocks: Upgrade + HR offices','Unlocks: Faster staff','Unlocks: Drinks upgrade',BI<NB-1?'Unlocks: Next hotel':'Unlocks: Royal Crown'][i];
const stepName=i=>[B0.pn,BI===2?'Chutney Counter':'Counter','Table 1','Packing','Drive-Thru','Table 2','Counter Upgrade 1',B0.pn+' Upgrade 1',B0.dp,'Tables 3 & 4','Packing Upgrade 1','HR Office','Staff Bonus','More Upgrades',BI<NB-1?'Hotel Door':'Royal Crown'][i];
// upgrade steps reuse the station's own pad spot (its station pad is already built by then); only one chain pad exists at a time
const chainPos=i=>[PADS.st.grill,PADS.st.counter,PADS.tab[0],PADS.st.pack,PADS.st.drive,PADS.tab[1],PADS.st.counter,PADS.st.grill,PADS.st.drink,PADS.tab[2],PADS.st.pack,PADS.mg[2],PADS.mg[3],PADS.st.drink,PADS.door][i];
/* ================= DINING ZONE 2 + BOOTH ZONE =================
   Opens once step >= Z2_STEP or player level >= Z2_LVL (see zoneOn). Flow: big pad "Dining Zone 2" -> 6 table pads one by one (4 chairs each) -> big pad "Booth Zone" -> 6 wall-booth pads one by one (sofa on the wall + 2 aisle chairs).
   Zone seats live in the SAME `tables` array, so tips, the 3 table upgrades (T.tl) and the dirty-plates / trash-bin system work on them with no extra code. Every hotel has its own palette + table shape + carpet pattern; the sites come from ZA (see top of file). */
const Z2_STEP=8,Z2_LVL=4,ZUK=10.4,ZTB=[10.6,10.8,11,11.2,11.4,11.6],BUK=12.2,BTB=[12.4,12.6,12.8,13,13.2,13.4];
const zoneOn=()=>!!ZN&&step()>=3&&(step()>=Z2_STEP||SV.pl>=Z2_LVL);
// per hotel: c carpet, a accent, t table top, k chair colour, s table shape (0 square, 1 round, 2 octagon)
const ZPAL=[{c:0x1f4e5f,a:0xffb703,t:0xfff1d0,k:0xe76f51,s:0},{c:0x6a0d2e,a:0xffd166,t:0xf8edeb,k:0x2a9d8f,s:1},{c:0x2d5a27,a:0xffa62b,t:0xfdf0d5,k:0x7a1f1f,s:2},{c:0x3b2f8f,a:0xff5d8f,t:0xfff0f5,k:0xffc43d,s:0},{c:0x1b4332,a:0xf4a261,t:0xe9ecef,k:0xd62828,s:1},
 {c:0x540b0e,a:0xf4d35e,t:0xfdf6e3,k:0x1d3557,s:2},{c:0x0b3954,a:0xd4af37,t:0xfaf3e0,k:0x6b4226,s:0},{c:0x7b2cbf,a:0x00e5ff,t:0xf1f3f5,k:0x2b2d42,s:1},{c:0x264653,a:0xe9c46a,t:0xfefae0,k:0x2a9d8f,s:2},{c:0x2b0a3d,a:0xffd700,t:0xfff3d6,k:0xc9184a,s:0}];
// booth zone per hotel: c carpet, s sofa, s2 cushion, t table top
const ZBP=[{c:0x3d405b,s:0xe07a5f,s2:0xf4a6a0,t:0xf2cc8f},{c:0x1b263b,s:0x2a9d8f,s2:0x8fd5c8,t:0xfefae0},{c:0x4a1c1c,s:0xd4a017,s2:0xf6d77a,t:0x5b3a29},{c:0x14213d,s:0xf72585,s2:0xffb3d1,t:0xe5e5e5},{c:0x283618,s:0xbc6c25,s2:0xe9b872,t:0xfefae0},
 {c:0x22223b,s:0xc9184a,s2:0xff8fa3,t:0xf8f9fa},{c:0x2d1e2f,s:0x3a86ff,s2:0x9ec5ff,t:0xd4af37},{c:0x1a1a2e,s:0x06d6a0,s2:0xa8f0d8,t:0xffffff},{c:0x3a2e1f,s:0x9c6644,s2:0xdbb88f,t:0x2d6a4f},{c:0x24123a,s:0xffd60a,s2:0xfff0a0,t:0x7b2cbf}];
const ZN=ZA[0]?(()=>{
 const AZ=L.ex.z-1.6,room=(r,kind)=>{const cx=(r.x0+r.x1)/2,cz=(r.z0+r.z1)/2,dir=r.left?1:-1,gx=r.left?r.x0:r.x1,cor=r.z0+(kind?7:6),gz=Math.min(Math.max(cor,r.zmin+1),r.zmax-1);
  return{r,kind,cx,cz,dir,cor,gate:{x:gx,z:gz},ig:{x:gx-dir*1.5,z:gz},ae:{x:gx+dir*1.2,z:gz},pad:{x:cx,z:cz}};};
 const A=room(ZA[0],0),B=ZA[1]?room(ZA[1],1):null;A.hub=[A.ig,A.gate,A.ae];
 if(B)B.hub=(ZA[1].par?A.hub.concat([{x:A.ae.x,z:A.cor},{x:B.ig.x,z:A.cor}]):[]).concat([B.ig,B.gate,B.ae]); // a booth room that hangs off the dining room is reached through it
 // customer route: queue -> hub (door of the room) -> room corridor -> lane beside the table -> seat, and the same way back out
 const route=(R,gl,apz,seat)=>{const mid=[{x:R.ae.x,z:R.cor},{x:gl,z:R.cor},{x:gl,z:apz}];
  return{ent:[{x:R.hub[0].x,z:AZ}].concat(R.hub,mid,[{x:seat.x,z:seat.z}]),out:mid.slice().reverse().concat(R.hub.slice().reverse())};};
 const tb=[],bb=[];
 for(let rw=0;rw<2;rw++)for(let c=0;c<3;c++){const x=ZA[0].x0+2.6+4.6*c,z=ZA[0].z0+3.5+5*rw; // 3 x 2 grid, 4 chairs each (E, W, N, S)
  const seats=[[1.1,0],[-1.1,0],[0,-1.1],[0,1.1]].map(([dx,dz])=>{const s={x:x+dx,z:z+dz,ry:Math.atan2(-dx,-dz)};Object.assign(s,route(A,dx<0?x-2.3:x+2.3,s.z,s));return s;});
  tb.push({k:'t',x,z,fz:1,bw:1.4,bd:1.4,pad:{x:x+2.3,z},seats});}
 if(B)for(let sd=0;sd<2;sd++)for(let i=0;i<3;i++){const cx=ZA[1].x0+3+5*i,fz=sd?-1:1,wall=sd?ZA[1].z0+14:ZA[1].z0,z=wall+fz*2.3; // 3 booths on the north wall, 3 on the south wall
  const seats=[[-.8,.85,fz],[.8,.85,fz],[-.8,3.4,-fz],[.8,3.4,-fz]].map(([dx,d,face])=>{const s={x:cx+dx,z:wall+fz*d,ry:Math.atan2(0,face)};Object.assign(s,route(B,cx+2.5,s.z,s));return s;});
  bb.push({k:'b',x:cx,z,fz,bw:2.4,bd:1,pad:{x:cx,z:wall+fz*5.2},seats});}
 // carpet (own colour + pattern per hotel) and the LOCKED mat that is lifted when the room is opened
 const deco=(R,col,acc,pat,ttl)=>{const r=R.r,g=new THREE.Group();scene.add(g);const f=m=>{m.castShadow=false;return m;};
  f(box(g,r.W-.5,.02,r.D-.5,col,R.cx,.015,R.cz));[-1,1].forEach(b=>{f(box(g,r.W-.9,.012,.16,acc,R.cx,.03,R.cz+b*(r.D/2-.55)));f(box(g,.16,.012,r.D-.9,acc,R.cx+b*(r.W/2-.55),.03,R.cz));});
  if(pat===1)for(let i=-3;i<=3;i++)f(box(g,.5,.011,r.D-1.6,acc,R.cx+i*2,.028,R.cz));
  else if(pat===2)for(let i=0;i<7;i++)for(let j=0;j<5;j++)if((i+j)&1)f(box(g,.9,.011,.9,acc,R.cx-6+i*2,.028,R.cz-4+j*2)).rotation.y=Math.PI/4;
  const cv=new THREE.Group();scene.add(cv);const m=new THREE.Mesh(new THREE.PlaneGeometry(r.W-.2,r.D-.2),new THREE.MeshBasicMaterial({color:0x151a22,transparent:true,opacity:.78,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(R.cx,.035,R.cz);cv.add(m);
  const l=label(.9);l.position.set(R.cx,2.6,R.cz-3);cv.add(l);l.draw(ttl,'locked');R.cover=cv;};
 deco(A,ZPAL[BI%10].c,ZPAL[BI%10].a,BI%3,'DINING ZONE 2');if(B)deco(B,ZBP[BI%10].c,ZPAL[(BI+3)%10].a,(BI+1)%3,'BOOTH ZONE');
 return{A,B,tb,bb};})():null;
/* ===== SIDE ITEMS zone: opens when step >= SD_STEP AND player level >= SD_LVL. L.sd = one free floor spot per layout (picked once from the main floor: clear of every station + pickup spot, table, chair, pad, door, queue, cash, trash, office and zone route) for the big unlock pad. Buying it saves SV.b[BI].sd=1 (T.sd). The counter / packing of this zone are NOT built yet. */
const SD_STEP=8,SD_LVL=3,sdOn=()=>!!L.sd&&step()>=SD_STEP&&SV.pl>=SD_LVL;
{const c0=new Set(),pts=[],rcs=[],HX=1.05,HZ=1.8; // HX / HZ = half size of the big pad (2.4 x 1.4, turned 90 deg, scaled 1.5)
 let lox=1e9,hix=-1e9,loz=1e9,hiz=-1e9,sx=0,sz=0,n=0;
 L.r0.forEach(([a,b,c,d])=>{lox=Math.min(lox,a);hix=Math.max(hix,c);loz=Math.min(loz,b);hiz=Math.max(hiz,d);for(let i=a/2;i<c/2;i++)for(let j=b/2;j<d/2;j++){c0.add(i+','+j);sx+=2*i+1;sz+=2*j+1;n++;}});
 const mx=sx/n,mz=sz/n,inM=(x,z)=>c0.has(Math.floor(x/2)+','+Math.floor(z/2)),rd=(x,z,a,b)=>Math.hypot(Math.max(Math.abs(x-a)-HX,0),Math.max(Math.abs(z-b)-HZ,0));
 Object.keys(L.st).forEach(k=>{const o={x:L.st[k],z:stZ(k),hw:SK[k].w/2+.1,hd:SK[k].d/2};rcs.push([o.x,o.z,o.hw,o.hd,.8]);pts.push([o.x,o.z+2.1,1.5]);if(k==='counter')pts.push([o.x,o.z-SCZ,1.7]);});
 for(let zz=stZ('counter')+1.9;zz<=L.ent.z+1;zz+=1)pts.push([L.st.counter,zz,1.3]); // customer queue
 pts.push([L.cash[0],L.cash[1],1.6],[L.trash[0],L.trash[1],1.5],[L.ent.x,L.ent.z-1.6,3.2],[L.ex.x,L.ex.z-1.6,3.2]);
 [L.arrN,L.arrP,L.nd,L.pd].forEach(a=>a&&pts.push([a.x,a.z,3.2]));
 L.tabs.forEach(([x,z])=>pts.push([x,z,2.6])); // table + both chairs + seat approach
 Object.values(PADS.st).forEach(p=>p&&pts.push([p.x,p.z,1.5]));PADS.tab.concat(PADS.mg,PADS.hr,[PADS.door]).forEach(p=>p&&pts.push([p.x,p.z,1.5]));
 RMX.forEach(([x,z])=>rcs.push([x+2.5,z+4,2.8,4,.4])); // upgrade / HR office rooms + their door apron
 if(ZN)[ZN.A,ZN.B].forEach(R=>{if(!R)return;const AZ=L.ex.z-1.6,pl=[{x:L.st.counter,z:stZ('counter')+1.9},{x:R.hub[0].x,z:AZ}].concat(R.hub); // customer route into the zone rooms
  for(let i=0;i<pl.length-1;i++){const a=pl[i],b=pl[i+1],m=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/.8));for(let k=0;k<=m;k++)pts.push([a.x+(b.x-a.x)*k/m,a.z+(b.z-a.z)*k/m,1.3]);}});
 const FP=[[-1.2,-1.9],[1.2,-1.9],[-1.2,1.9],[1.2,1.9],[0,-1.9],[0,1.9],[-1.2,0],[1.2,0]];let best=null;
 for(const k of [1,.8,.6]){let bd=1e9;
  for(let x=lox;x<=hix;x+=.5)for(let z=loz;z<=hiz;z+=.5){
   if(!FP.every(([a,b])=>inM(x+a,z+b)))continue;
   if(pts.some(([a,b,r])=>rd(x,z,a,b)<r*k))continue;
   if(rcs.some(([a,b,hw,hd,g])=>Math.hypot(Math.max(Math.abs(x-a)-HX-hw,0),Math.max(Math.abs(z-b)-HZ-hd,0))<g*k))continue;
   const d=Math.hypot(x-mx,z-mz);if(d<bd){bd=d;best={x:+x.toFixed(2),z:+z.toFixed(2)};}}
  if(best)break;} // relax the clearances a little only if the floor is very crowded
 L.sd=best;}
function zChair(p,x,z,col,ry,gold){const c=new THREE.Group();c.position.set(x,0,z);c.rotation.y=ry;p.add(c);const w=gold?0xd4af37:0x6c4a2a;box(c,.62,.1,.62,col,0,.5,0);box(c,.62,.7,.1,gold?0xd4af37:col,0,.9,-.26);[[-.25,-.25],[.25,-.25],[-.25,.25],[.25,.25]].forEach(([a,b])=>box(c,.08,.45,.08,w,a,.22,b));}
/* skins follow the 3 table upgrade levels (T.tl): L1 plain, L2 coloured top + cloth, L3 marble + gold + sofas / gold booth */
function skinZ(t,s,l){
 if(t.zk==='t'){const P=ZPAL[BI%10],top=(w,h,col,y)=>P.s===1?cyl(s,w/2,w/2,h,col,0,y,0,20):P.s===2?cyl(s,w/2,w/2,h,col,0,y,0,8):box(s,w,h,w,col,0,y,0);
  cyl(s,.5,.55,.06,l>1?0xd4af37:0x4a3a2a,0,.03,0,12);cyl(s,.12,.16,.85,l>1?0xd4af37:l?0x264653:0x6c4a2a,0,.45,0,10);
  if(l===0)top(1.3,.1,P.t,.95);
  else if(l===1){top(1.3,.1,P.a,.95);box(s,.9,.03,.9,P.t,0,1.015,0).rotation.y=Math.PI/4;box(s,.45,.034,.45,P.c,0,1.02,0).rotation.y=Math.PI/4;}
  else{top(1.4,.1,0xf2efe8,.95);top(1.48,.04,0xd4af37,.91);cyl(s,.06,.08,.22,0xe63946,-.4,1.11,.4,8);sph(s,.1,0xff6b81,-.4,1.28,.4);}
  if(l<2)[[1.1,0],[-1.1,0],[0,-1.1],[0,1.1]].forEach(([a,b])=>zChair(s,a,b,P.k,Math.atan2(-a,-b),false));
  else{sofa(s,1.45,-Math.PI/2,P.k,P.a);sofa(s,-1.45,Math.PI/2,P.k,P.a);zChair(s,0,-1.1,P.k,0,true);zChair(s,0,1.1,P.k,Math.PI,true);}return;}
 const B=ZBP[BI%10],bg=new THREE.Group();bg.rotation.y=t.fz>0?0:Math.PI;s.add(bg);       // booth: local -z = the wall, +z = the aisle
 box(bg,3.4,.34,.8,B.s,0,.25,-1.7);box(bg,3,.14,.6,B.s2,0,.49,-1.65);box(bg,3.4,.7,.2,B.s,0,.75,-2.1);[-1.6,1.6].forEach(a=>box(bg,.2,.5,.8,B.s,a,.5,-1.7));
 if(BI%2)[-.8,.8].forEach(a=>box(bg,.5,.3,.12,0xffd166,a,.8,-1.92));else[-.8,.8].forEach(a=>sph(bg,.16,0xffd166,a,.72,-1.9));
 [-.8,.8].forEach(a=>cyl(bg,.1,.13,.9,l>1?0xd4af37:0x6c4a2a,a,.45,0,8));
 box(bg,2.4,.1,1,l>1?0xf2efe8:B.t,0,.95,0);if(l>0)box(bg,1.7,.03,.6,l>1?0xd4af37:B.s,0,1.015,0);if(l>1)box(bg,2.5,.04,1.1,0xd4af37,0,.91,0);
 if(l>0){cyl(bg,.06,.08,.22,0xe63946,0,1.11,0,8);sph(bg,.1,0xff6b81,0,1.28,0);}
 [-.8,.8].forEach(a=>zChair(bg,a,1.1,B.s,Math.PI,l>1));}
function addZT(s,a){const g=new THREE.Group();g.position.set(s.x,0,s.z);scene.add(g);
 const sk=new THREE.Group();g.add(sk);aoBlob(g,0,0,s.k==='b'?4.2:3.6,s.k==='b'?2.6:3.6,.9);solid(s.x,s.z,s.bw,s.bd);if(s.k==='b')solid(s.x,s.z-s.fz*1.7,3.4,.9);
 const bills=new THREE.Group();bills.position.y=1;g.add(bills);const plates=new THREE.Group();plates.position.y=1.02;g.add(plates);
 cyl(plates,.3,.3,.05,0xffffff,-.2,0,.1,10);cyl(plates,.3,.3,.05,0xffffff,.25,0,-.2,10);cyl(plates,.12,.12,.06,0xd62828,-.2,.05,.1,6);plates.visible=false;
 const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:dollarTex,transparent:true,depthTest:false}));spr.scale.set(1.15,1.15,1);spr.position.set(0,2.5,0);spr.renderOrder=10;spr.visible=false;g.add(spr);
 tables.push({x:s.x,z:s.z,fz:s.fz,zk:s.k,occ:false,dirty:false,res:false,sOcc:[false,false,false,false],sRes:[false,false,false,false],cash:0,ct:0,bills,plates,sp:spr,sk,sl:s.seats});
 skinTable(tables[tables.length-1]);if(a)pop(g);}
function zoneEnsure(a){if(!ZN)return;const cnt=k=>tables.filter(q=>q.zk===k).length;
 ZN.A.cover.visible=!T.z2;if(ZN.B)ZN.B.cover.visible=!T.bz;
 while(T.z2&&cnt('t')<Math.min(6,T.zt|0))addZT(ZN.tb[cnt('t')],a);
 while(ZN.B&&T.bz&&cnt('b')<Math.min(6,T.bt|0))addZT(ZN.bb[cnt('b')],a);}
function zonePads(){if(!zoneOn())return;const has=k=>pads.some(p=>p.key===k),zt=T.zt|0,bt=T.bt|0;
 if(!T.z2){if(!has('z2'))mkPad('z2',ZN.A.pad,sc2(ZUK),'Dining Zone 2',false,'Unlocks: 6 new tables',true);}
 else if(zt<6){if(!has('zt'))mkPad('zt',ZN.tb[zt].pad,sc2(ZTB[zt]),'Zone Table '+(zt+1),false,'Unlocks: Zone table '+(zt+1)+' (4 chairs)');}
 else if(ZN.B){if(!T.bz){if(!has('bz'))mkPad('bz',ZN.B.pad,sc2(BUK),'Booth Zone',false,'Unlocks: 6 wall booths',true);}
  else if(bt<6&&!has('bt'))mkPad('bt',ZN.bb[bt].pad,sc2(BTB[bt]),'Booth '+(bt+1),false,'Unlocks: Booth '+(bt+1)+' (sofa seats)');}}
/* ===== reference-style pads: big orange rounded rectangle (2.4 x 1.4) with thick white outline, big white cost number (K format) + small green $ bill painted on the floor, orange fill that grows while you stand on it ===== */
const rrShape=(w,h,r)=>{const s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;};
function drawPad(p){const r=Math.ceil(p.cost-p.paid);if(r===p.shown)return;p.shown=r;const x=p.cv.getContext('2d'),txt=p.cost<=0?'FREE':fmt(r);x.clearRect(0,0,512,256);x.textBaseline='middle';x.textAlign='left';x.lineJoin='round';
 let fs=170;do{x.font='800 '+fs+'px "Baloo 2",Trebuchet MS,sans-serif';fs-=8;}while(x.measureText(txt).width>340&&fs>60);
 const tw=x.measureText(txt).width,t0=256-(tw+90)/2;x.lineWidth=16;x.strokeStyle='rgba(150,80,0,.55)';x.strokeText(txt,t0,118);x.fillStyle='#fff';x.fillText(txt,t0,118);
 x.save();x.translate(t0+tw+48,172);x.rotate(-.2);x.fillStyle='#5ee07a';x.strokeStyle='#0f7a35';x.lineWidth=6;x.beginPath();x.rect(-34,-22,68,44);x.fill();x.stroke();x.fillStyle='#0b5a28';x.font='800 30px sans-serif';x.textAlign='center';x.fillText('$',0,2);x.restore();p.tx.needsUpdate=true;}
function mkPad(key,pos,cost,name,chain,un,big){const g=new THREE.Group();g.position.set(pos.x,0,pos.z);g.rotation.y=Math.PI/2;scene.add(g);
 const fl=(geo,col,y)=>{const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:col}));m.rotation.x=-Math.PI/2;m.position.y=y;g.add(m);return m;};
 fl(G('rrA',()=>new THREE.ShapeGeometry(rrShape(2.4,1.4,.4))),0xffffff,.04);fl(G('rrB',()=>new THREE.ShapeGeometry(rrShape(2.1,1.1,.28))),0xffb85c,.05);
 const f=fl(G('rrF',()=>{const q=new THREE.ShapeGeometry(rrShape(2.1,1.1,.28));q.translate(1.05,0,0);return q;}),0xff8c1a,.06);f.position.x=-1.05;f.scale.x=.001;
 const cv=document.createElement('canvas');cv.width=512;cv.height=256;const tx=new THREE.CanvasTexture(cv),t=new THREE.Mesh(new THREE.PlaneGeometry(2,1),new THREE.MeshBasicMaterial({map:tx,transparent:true,depthWrite:false}));t.rotation.x=-Math.PI/2;t.position.y=.08;g.add(t);if(big)g.scale.setScalar(1.5);else pop(g);
 const p={key,chain,big:!!big,x:pos.x,z:pos.z,g,f,cv,tx,cost,paid:0,dw:0,shown:-1,name,un,t0:GT};pads.push(p);drawPad(p);}
const SPB=[1.2,3.4,5.6],PCB=[1.6,3.8,6],TXB=[7.7,8.7,9.7],sc2=k=>nice(ECO.c0*Math.pow(ECO.g,k)*M); // upgrade prices sit on the same 1.5x curve (k = chain-step equivalent)
function refreshPads(){if((step()===2||step()===7)&&!pads.some(p=>p.chain)){T.step=step()+1;econ();ensure(true);} // step 2 (Table 1) is free: the first table appears the moment the counter opens
 const s=step();
 if(s<NS&&!pads.some(p=>p.chain))mkPad('s'+s,chainPos(s),costOf(s),stepName(s),true,stepUn(s));
 if(s>=2){ // optional player upgrades appear once the counter is open; they are not part of the chain
  }
 if(s>=10&&(T.tx|0)<3&&!pads.some(p=>p.key==='tx'))mkPad('tx',PADS.tab[3+(T.tx|0)],sc2(TXB[T.tx|0]),'Table '+(4+(T.tx|0)),false,'Unlocks: Table '+(4+(T.tx|0))+' seating');
 zonePads();
 if(sdOn()&&!T.sd&&!pads.some(p=>p.key==='sd'))mkPad('sd',L.sd,nice(costOf(8)*3),'Side Items',false,'Unlocks: Side Items zone',true);} // big pad, ~3x the Drinks Bar price
function complete(q){
 if(q.chain){const took=GT-(q.t0||0),tg=ECO.cost1(step())>0?ECO.T(step()):0;console.log('[economy] Step '+(step()+1)+' "'+q.name+'" cost $'+q.cost+' took '+took.toFixed(0)+'s of play (target ~'+tg.toFixed(0)+'s)');T.step=step()+1;econ();if(step()>=NS&&BI<NB-1)SV.mx=Math.max(SV.mx|0,BI+1);}
 else if(q.key==='ps')T.ps++;else if(q.key==='pc')T.pc++;else if(q.key==='tx')T.tx=(T.tx|0)+1;else if(q.key==='z2')T.z2=1;else if(q.key==='zt')T.zt=(T.zt|0)+1;else if(q.key==='bz')T.bz=1;else if(q.key==='bt')T.bt=(T.bt|0)+1;else if(q.key==='sd')T.sd=1;else if(q.key==='ws')SV.ws++;else if(q.key==='wc')SV.wc++;else if(q.key==='rc'&&T.hp.length<7)T.hp.push(1);
 ensure(true);refreshPads();refreshDoors();
 if(q.chain)banner(step()>=NS?(BI<NB-1?'HOTEL COMPLETE!':'ROYAL EMPIRE COMPLETE!'):'STEP '+step()+' / '+NS,q.name+(step()>=NS&&BI<NB-1?': next hotel door is open':' built'));else banner('UPGRADED!',q.name);
 popText(new THREE.Vector3(q.x,2,q.z),q.name+'!','#ffffff');unlockFX(q);if(q.chain&&step()>=NS)confetti();
 addXP(q.chain?30:20);mis('build'); // XP for every pad unlock
 if(q.chain&&step()>=NS){const hg=20+10*BI;addGems(hg);popText(new THREE.Vector3(q.x,3.2,q.z),'+'+hg+' \u{1F48E}','#d8a7ff');banner('HOTEL BONUS!','+'+hg+' gems');} // gems for completing a hotel
 save();hud();}
/* ================= workers ================= */
const workers=[];
/* helper look per level (1-7): [clothes, hat]. L1 plain clothes + white cap, L2 green, L3 blue, L4 purple, L5 orange, L6 gold, L7 bright gold + glow ring. A coloured band appears on the cap from L2. */
const HLK=[[0x9aa4b2,0xffffff],[0x2ecc71,0xffffff],[0x3a86ff,0xffffff],[0x9b5de5,0xffffff],[0xff7b00,0xffffff],[0xd4af37,0xffe9a8],[0xffd23f,0xfff3a0]];
function hSkin(w){const l=HLV(w)-1,c=HLK[l][0];w.tor.material=mat(c);w.aL.children[0].material=w.aR.children[0].material=mat(c);if(w.hat)w.hat.material=mat(HLK[l][1]);w.band.visible=l>0;w.band.material=mat(c);w.ring.visible=l===6;}
function addWorker(role,a){const idx=workers.filter(w=>w.role===role).length;if(role!=='H'&&idx)return;const g=new THREE.Group(),bd=new THREE.Group();g.add(bd);
 const col=role==='H'?[0x39ff6a,0xff4d9a,0x00e5c8][idx%3]:{C:0xff5d00,S:0xffffff,P:0x00c2ff,D:0xd100ff}[role];
 let hat=null;const tor1=box(bd,.7,.8,.45,col,0,1,0);sph(bd,.32,0xffd9b3,0,1.7,0);if(role==='S'){cyl(bd,.42,.42,.06,0x1b1b22,0,2.0,0,12);cyl(bd,.26,.28,.32,0x1b1b22,0,2.2,0,12);box(bd,.26,.62,.05,0x1b1b22,-.2,1.05,.24);box(bd,.26,.62,.05,0x1b1b22,.2,1.05,.24);box(bd,.08,.42,.05,0xd62828,0,1.1,.26);}else hat=cyl(bd,.3,.3,.3,0xffffff,0,2.1,0,10);box(bd,.06,.08,.05,0x222222,-.12,1.72,.3);box(bd,.06,.08,.05,0x222222,.12,1.72,.3);
 const lA=limb(bd,.26,.6,.26,0x2f4bd0,-.18,.6,0),lB=limb(bd,.26,.6,.26,0x2f4bd0,.18,.6,0),aL=limb(bd,.2,.55,.2,col,-.46,1.35,0),aR=limb(bd,.2,.55,.2,col,.46,1.35,0),cg=new THREE.Group();cg.position.y=2.55;g.add(cg);
 const base={C:G0,S:CT,P:S.pack,D:S.win,H:G0}[role],home=role==='S'?{x:CT.x,z:CT.z-SCZ}:role==='H'?{x:base.px-1.9-idx*1.5,z:base.pz}:{x:base.px+1.7,z:base.pz};g.position.set(home.x,0,home.z);scene.add(g);
 cg.userData.pop=true;useCustom(bd,'worker');aoBlob(g,0,0,1.4,1.4,.8);workers.push({role,g,bd,lA,lB,aL,aR,cg,carry:[],t:0,ph:Math.random()*6,home,idx,vx:0,vz:0,lv:role==='H'?Math.min(7,Math.max(1,T.hp[idx]|0)):0});
 if(role==='H'){const hw=workers[workers.length-1];hw.tor=tor1;hw.hat=hat;hw.band=cyl(bd,.31,.31,.06,0xffffff,0,1.97,0,10);hw.ring=new THREE.Mesh(new THREE.CylinderGeometry(.8,.8,.04,24),new THREE.MeshBasicMaterial({color:0xffd23f,transparent:true,opacity:.55}));hw.ring.position.y=.05;g.add(hw.ring);hSkin(hw);}
 if(a)pop(g);}
function ensure(a){const s=step();
 if(s>=1&&!G0.on)activate(G0,a);
 if(s>=2&&!CT.on)activate(CT,a);
 if(s>=4&&!S.pack)S.pack=newStn('pack',L.st.pack,a);
 if(s>=5&&!S.win){mkLane();S.win=newStn('win',L.st.win,a);}
 if(s>=9&&!S.drink)S.drink=newStn('drink',L.st.drink,a);
 if(T.sd&&L.sd&&!S.side)S.side=newStn('side',L.sd.x,a,false,L.sd.z); // SIDE ITEMS counter appears once the Side Items pad is bought (SV.b[BI].sd)
 const nt=(s>=3?1:0)+(s>=6?1:0)+(s>=10?1:0)+(s>=10?(T.tx|0):0);const nb=()=>tables.filter(q=>!q.zk).length;while(nb()<nt)addTable(L.tabs[nb()],a);zoneEnsure(a);
 if(CT.on&&CLV()>=1)addWorker('S',a);if(S.win&&WLV()>=1)addWorker('D',a);if(S.pack&&PLV()>=1)addWorker('P',a);while(workers.filter(w=>w.role==='H').length<T.hp.length)addWorker('H',a);reskin();hrDraw();}

/* ================= economy report (console.table) ================= */
function ecoReport(){try{
 const rows=[],pr=[];let cum=0,tsec=0;
 for(let i=0;i<NS;i++){const c=costOf(i),e=ECO.clamp(i),P=Math.max(1,nice(ECO.price(i)*M)),est=c>0?c/(P*ECO.K(e)):0;cum+=c;tsec+=est;
  rows.push({step:i,name:stepName(i),unlocks:stepUn(i),cost:c,costFmt:'$'+fmt(c),'x prev':i>3?+(ECO.cost1(i)/ECO.cost1(i-1)).toFixed(2):'-',cumulative:'$'+fmt(cum),'pay/customer':P,tip:Math.round(P*ECO.tipRate),drinkBonus:Math.round(P*ECO.drinkRate),'car/scooter pay':P*2,'income $/s':+(P*ECO.K(e)).toFixed(1),'est. seconds':Math.round(est),'target s':c>0?Math.round(ECO.T(i)):0,'total minutes':+(tsec/60).toFixed(1)});}
 console.log('Hotel 1: paid steps need ~'+Math.round(tsec/60)+' min of play (+ ~1-2 min for the 3 free steps); total cost $'+fmt(cum));
 console.log('%c'+B0.n+' (hotel '+(BI+1)+', multiplier x'+M+')','font-weight:bold');console.table(rows);
 [['Player Speed',SPB],['Player Carry',PCB],['Worker Speed',[6.2,7.4,8.6]],['Worker Capacity',[6.5,7.7,8.9]],['Recruiter',[6.8,8.2,9.6]],['Extra Tables',TXB]].forEach(([n,a])=>pr.push({upgrade:n,'tier 1':'$'+fmt(sc2(a[0])),'tier 2':'$'+fmt(sc2(a[1])),'tier 3':a[2]!==undefined?'$'+fmt(sc2(a[2])):'-'}));
 console.table(pr);
 console.table(BR.map((b,h)=>{const tot=Array.from({length:NS},(_,i)=>nice(ECO.cost1(i)*b.m)).reduce((x,y)=>x+y,0);return{hotel:h+1,name:b.n,multiplier:'x'+b.m,'vs previous':h?'x'+(b.m/BR[h-1].m).toFixed(1):'-','first paid step cost':'$'+fmt(nice(ECO.cost1(3)*b.m)),'door cost':'$'+fmt(nice(ECO.cost1(NS-1)*b.m)),'whole hotel':'$'+fmt(tot),'pay/customer @step3':'$'+fmt(Math.max(1,nice(ECO.price(3)*b.m))),'pay/customer @door':'$'+fmt(Math.max(1,nice(ECO.price(NS-1)*b.m)))};}));
}catch(e){console.warn('economy report failed',e);}}
window.ecoReport=ecoReport;
/* ================= HUD, doors, popups ================= */
function popText(pos,txt,col){const v=pos.clone().project(cam),d=document.createElement('div');d.className='pop';d.textContent=txt;d.style.left=(v.x*.5+.5)*innerWidth+'px';d.style.top=(-v.y*.5+.5)*innerHeight+'px';d.style.color=col;document.body.appendChild(d);setTimeout(()=>d.remove(),950);}
let ac;const AC=window.AudioContext||window.webkitAudioContext;
function beep(f,d=.07,v=.04){try{if(!ac||SV.snd===0)return;const o=ac.createOscillator(),g=ac.createGain();o.type='square';o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(ac.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+d);o.stop(ac.currentTime+d);}catch(e){}}
/* banners are queued so a level-up banner never wipes out a "step built" banner that fired in the same moment */
let bnext=0;
function banner(a,b){const now=performance.now(),w=Math.max(0,bnext-now);if(w>7000)return;bnext=now+w+2900;
 setTimeout(()=>{const d=$('lvup');d.innerHTML=a+'<small>'+b+'</small>';d.classList.remove('show');void d.offsetWidth;d.classList.add('show');[523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,.15,.05),i*110));},w);}
const carry=[];
/* ===== goal text + pink 3D arrow + DESTINATION compass ===== */
const GOAL_PAD=i=>[ 'Create the '+B0.pn.toLowerCase()+'!','Create a counter!','Create a table!','Create a package table!','Build the drive-thru!','Create another table!','Upgrade the counter!','Upgrade the '+B0.pn.toLowerCase()+'!','Create a '+B0.dp.toLowerCase()+'!','Add more tables!','Upgrade the packing table!','Open the HR office!','Boost your staff!','Buy more upgrades!',BI<NB-1?'Unlock the next hotel!':'Place the Royal Crown!'][i]||'Build it!';
function goalInfo(){
 const q=pads.find(x=>x.chain),cap=CAP(),has=t=>carry.includes(t),D=S.drink,padG=q?{t:GOAL_PAD(+q.key.slice(1)),x:q.x,z:q.z}:null;
 const dirty=tables.find(t=>t.dirty&&!t.occ);
 if(has('w'))return{t:'Throw the plates in the bin!',x:trash.x,z:trash.z};
 if(dirty&&tables.every(x=>x.dirty||x.occ))return{t:'Pick up the dirty plates!',x:dirty.x,z:dirty.z};
 if(carry.length){
  if((has('k')||has('K'))&&S.win)return{t:'Hand it to the car!',x:S.win.px,z:S.win.pz};
  if(has('b')&&CT.on&&CT.shelf<8)return{t:'Put it on the counter',x:CT.x,z:CT.z-SCZ};
  if(has('d')&&CT.on&&CT.dk<6)return{t:'Put the drink on the counter',x:CT.x,z:CT.z-SCZ};
  if(has('s')&&CT.on&&CT.sk<6)return{t:'Put the side item on the counter',x:CT.x,z:CT.z-SCZ};
  if(has('b')&&S.pack&&S.pack.inb<MCAP('p'))return{t:'Pack the burgers!',x:S.pack.px,z:S.pack.pz};
 }
 if(!q){const nd=doors.next;if(nd&&nd.open&&BI<NB-1)return{t:'Go through the next hotel door!',x:nd.d.x,z:nd.d.z};}
 if(padG&&(q.cost<=0||cash+q.paid>=q.cost))return padG;
 if(pile>=1)return{t:'Collect the cash!',x:cashPad.x,z:cashPad.z};
 if(carry.length<cap){
  if(S.pack&&S.pack.out>0)return{t:'Pick up burger package!',x:S.pack.px,z:S.pack.pz};
  if(G0.on&&G0.stock>0)return{t:'Pick up burger!',x:G0.px,z:G0.pz};
  if(D&&D.stock>0&&CT.on)return{t:'Pick up a drink!',x:D.px,z:D.pz};
 }
 {const rm=step()>=12&&ROOMS.find(r=>!(SV.ro&r.bit));if(rm)return{t:rm.bit===2?'Open a HR Office!':'Open a Upgrade Office!',x:rm.px,z:rm.pz};}if(padG)return padG;
 const nd=doors.next;if(nd&&nd.open&&BI<NB-1)return{t:'Go through the next hotel door!',x:nd.d.x,z:nd.d.z};
 return{t:BI<NB-1?'Hotel complete!':'Royal Empire complete!',x:null,z:null};}
const goalArrow=new THREE.Group(),ping=new THREE.Group();let pingT=0,goal=null,_ang=1e9;
{const sh=new THREE.Shape();[[0,1.05],[.62,.25],[.26,.25],[.26,-.75],[-.26,-.75],[-.26,.25],[-.62,.25]].forEach(([x,y],i)=>i?sh.lineTo(x,y):sh.moveTo(x,y));sh.closePath();
 const g=new THREE.ExtrudeGeometry(sh,{depth:.3,bevelEnabled:true,bevelThickness:.06,bevelSize:.06,bevelSegments:2});g.rotateX(Math.PI/2);g.translate(0,.3,0);
 const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:0xff6fb5,emissive:0xff2f93,emissiveIntensity:.4,roughness:.45}));m.castShadow=false;goalArrow.add(m);goalArrow.visible=false;scene.add(goalArrow);
 const bm=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,7,16,1,true),new THREE.MeshBasicMaterial({color:0xff6fb5,transparent:true,opacity:.35,depthWrite:false,side:THREE.DoubleSide}));bm.position.y=3.5;ping.add(bm);
 const rm=new THREE.Mesh(new THREE.RingGeometry(.9,1.25,28),new THREE.MeshBasicMaterial({color:0xff6fb5,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}));rm.rotation.x=-Math.PI/2;rm.position.y=.1;ping.add(rm);ping.visible=false;scene.add(ping);}
const _gp=new THREE.Vector3(),_gq=new THREE.Vector3();
function goalTick(dt){
 if(!player)return;goal=goalInfo();const o=$('obj');if(o.textContent!==goal.t)o.textContent=goal.t;
 const p=player.position;
 if(goal.x===null||traveling||UP.open||CM.open||GM.open){goalArrow.visible=false;ping.visible=false;return;}
 const dx=goal.x-p.x,dz=goal.z-p.z,d=Math.hypot(dx,dz);
 if(d>2.8){const ux=dx/d,uz=dz/d,t=TM,pulse=pingT>0?1+.25*Math.abs(Math.sin(t*9)):1;
  goalArrow.visible=true;goalArrow.position.set(p.x+ux*1.9,1.15+Math.sin(t*4)*.12,p.z+uz*1.9);goalArrow.rotation.y=Math.atan2(ux,uz);goalArrow.scale.setScalar(pulse);}
 else goalArrow.visible=false;
 if(pingT>0){pingT-=dt;ping.visible=pingT>0;ping.position.set(goal.x,0,goal.z);ping.scale.set(1+.15*Math.sin(TM*8),1,1+.15*Math.sin(TM*8));}else ping.visible=false;
 // compass needle points toward the goal as seen on screen
 _gp.set(p.x,0,p.z).project(cam);_gq.set(goal.x,0,goal.z).project(cam);
 const ang=Math.round(Math.atan2((_gq.x-_gp.x)*innerWidth,-(_gq.y-_gp.y)*innerHeight)*180/Math.PI);
 if(ang!==_ang&&Number.isFinite(ang)){_ang=ang;$('destn').style.transform='rotate('+ang+'deg)';}}
$('dest').addEventListener('pointerdown',e=>e.stopPropagation());
$('dest').addEventListener('click',()=>{pingT=5;beep(760,.08,.04);const g=goalInfo();if(g.x!==null&&player){const o=$('obj');o.textContent=g.t;}});
function hud(){$('lvl').textContent='Step '+Math.min(step(),NS)+'/'+NS;$('shop').textContent=B0.n+'  -  Hotel '+(BI+1)+'/'+NB;goalTick(0);}
const earn=n=>{cash+=n;hud();};
/* ===== PLAYER LEVEL / XP / GEMS =====
   XP comes from: serving a customer (+5), serving a drive-thru car (+8), cleaning a table (+8), unlocking a pad (+30 chain step, +20 upgrade).
   Amounts grow 25% per hotel. XP needed per level = 50 + 35*(level-1). Level up gives gems (5 + 2*level) and a banner.
   Gems also come from: completing a hotel (20 + 10*hotel index) and a random "happy" customer (12% chance, +1 gem).
   Level / XP / gems live in SV (pl, px, gems) and are global across all hotels. Nothing is spent yet. */
const XPN=l=>50+35*(l-1);
function bumpEl(id){const e=$(id);e.classList.remove('bump');void e.offsetWidth;e.classList.add('bump');}
function lvHud(){const need=XPN(SV.pl);$('plv').textContent=SV.pl;$('xpf').style.width=Math.min(100,SV.px/need*100)+'%';$('xpt').textContent=Math.floor(SV.px)+'/'+need;$('gemv').textContent=fmt(SV.gems);}
function addGems(n){n=Math.floor(n);if(!(n>0))return;SV.gems+=n;dirty=true;lvHud();bumpEl('gems');beep(1200,.08,.04);}
function addXP(n){n=Math.max(1,Math.round(n*(1+BI*.25)));SV.px+=n;dirty=true;let g=0,up=false,guard=0;
 while(SV.px>=XPN(SV.pl)&&guard++<60){SV.px-=XPN(SV.pl);SV.pl++;g+=5+2*SV.pl;up=true;}
 if(up){try{refreshPads();}catch(e){}addGems(g);bumpEl('star');banner('LEVEL '+SV.pl+'!','Reward: +'+g+' gems');if(player){burst(player.position.x,2.2,player.position.z,[0xc77dff,0xffd23f,0xffffff],24,4,6,1.1);starBurst(player.position.x,1.8,player.position.z,9);}}
 lvHud();}
/* emoji reactions: shared sprite materials (persistent mood above a customer) + one-shot floating emoji */
const EMJ={heart:'\u2764\uFE0F',happy:'\u{1F60A}',mad:'\u{1F624}',angry:'\u{1F621}'},EMM={};
function emoMat(k){if(EMM[k])return EMM[k];const cv=document.createElement('canvas');cv.width=cv.height=96;const x=cv.getContext('2d');x.font='70px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(EMJ[k],48,52);
 return EMM[k]=new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthTest:false});}
function floatEmoji(c,k,dx=0){const m=emoMat(k).clone(),s=new THREE.Sprite(m);s.scale.set(1.3,1.3,1);s.renderOrder=11;const bx=c.g.position.x+dx,bz=c.g.position.z,y0=c.by+.9;s.position.set(bx,y0,bz);
 addFx(s,1.5,(t,o)=>{o.position.set(bx,y0+t*1.3,bz);o.material.opacity=t<.65?1:1-(t-.65)/.35;},()=>{m.dispose();});}
/* happy customer: floating smiley above their head, +1 gem */
function happy(c){const bx=c.g.position.x,bz=c.g.position.z;floatEmoji(c,'happy',.8);
 popText(new THREE.Vector3(bx,3.6,bz),'+1 \u{1F48E}','#d8a7ff');burst(bx,2.4,bz,[0xc77dff,0xe0aaff,0xffffff],10,2.2,3.5,.8);addGems(1);}
let dispCash=cash,lastDisp=-1;
function showCash(dt){if(dispCash>cash||cash-dispCash<.5)dispCash=cash;else dispCash+=(cash-dispCash)*Math.min(1,dt*5);const f=Math.floor(dispCash+.001);if(f!==lastDisp){lastDisp=f;$('cashv').textContent=fmt(f);}}
function bump(){bumpEl('cash');}
/* 3D banknotes toss to the cash pad when a customer pays; collected cash flies up into the HUD counter */
function tossBills(fx0,fz0,pay){const n=Math.min(4,1+Math.floor(pay/(PRICE*.6)));for(let i=0;i<n;i++)shoot(new THREE.Mesh(billGeo,billMat),{x:fx0,y:1.5,z:fz0},{x:cashPad.x+(Math.random()-.5)*.6,y:.6+Math.min(.8,pile/(40*M)),z:cashPad.z+(Math.random()-.5)*.5},.6,1.2,null,i*.09);}
function flyCash(wp,n){try{const v=wp.clone().project(cam),sx=(v.x*.5+.5)*innerWidth,sy=(-v.y*.5+.5)*innerHeight,tr=$('cash').getBoundingClientRect(),tx=tr.left+tr.width/2,ty=tr.top+tr.height/2,dx=tx-sx,dy=ty-sy;
 for(let i=0;i<n;i++){const d=document.createElement('div');d.className='fbill';d.style.left=sx+'px';d.style.top=sy+'px';document.body.appendChild(d);const r=(Math.random()-.5)*50,jx=(Math.random()-.5)*60;
  const an=d.animate([{transform:'translate(-50%,-50%) scale(.6) rotate(0deg)',opacity:1},{transform:'translate(calc(-50% + '+(dx*.25+jx)+'px),calc(-50% + '+(dy*.25-60)+'px)) scale(1.15) rotate('+r+'deg)',opacity:1,offset:.35},{transform:'translate(calc(-50% + '+dx+'px),calc(-50% + '+dy+'px)) scale(.55) rotate(0deg)',opacity:.9}],{duration:780,delay:i*55,easing:'cubic-bezier(.35,.1,.35,1)',fill:'backwards'});
  an.onfinish=()=>{d.remove();bump();};}}catch(e){}}
/* big yellow star sprites that burst up and fall (level up / pad unlock) + a short white screen flash */
const starTex=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.translate(64,66);x.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?26:60;x.lineTo(Math.cos(a)*r,Math.sin(a)*r);}x.closePath();x.fillStyle='#ffd23f';x.strokeStyle='#e08a00';x.lineWidth=8;x.lineJoin='round';x.fill();x.stroke();x.fillStyle='rgba(255,255,255,.65)';x.beginPath();x.arc(-14,-14,9,0,6.3);x.fill();return new THREE.CanvasTexture(c);})();
function starBurst(x,y,z,n=7){for(let i=0;i<n;i++){const m=new THREE.SpriteMaterial({map:starTex,transparent:true,depthTest:false}),s=new THREE.Sprite(m),a=Math.random()*6.283,sp=1.2+Math.random()*2.2,vy=3.5+Math.random()*2.5,sz=.9+Math.random()*.7;s.renderOrder=12;s.visible=false;
 addFx(s,1.1,(k,o)=>{o.visible=true;o.position.set(x+Math.cos(a)*sp*k,y+vy*k-4.2*k*k,z+Math.sin(a)*sp*k);o.scale.setScalar(sz*(k<.15?k/.15:1));o.material.opacity=k<.65?1:1-(k-.65)/.35;o.material.rotation=k*3;},()=>{m.dispose();},i*.04);}}
function flash(){const e=$('flash');e.style.transition='none';e.style.opacity=.35;void e.offsetWidth;e.style.transition='opacity .35s';e.style.opacity=0;}
function unlockFX(q){flash();starBurst(q.x,1.4,q.z,7);burst(q.x,.8,q.z,[0xffd23f,0x2ecc71,0xff7b00,0xffffff],28,4.8,6.5,1.1);shock(q.x,q.z,0xffd23f);shock(q.x,q.z,0x2ecc71);}
function confetti(){const cols=[0xffd23f,0xef476f,0x4cc9f0,0x2ecc71,0xff7b00,0xffffff];for(let i=0;i<9;i++)setTimeout(()=>burst(CX+(Math.random()-.5)*12,2.5+Math.random()*2.5,CZ+(Math.random()-.5)*8,cols,18,3.6,5,1.25),i*140);}
const doors={};
function mkDoor(kind,d){const g=new THREE.Group();g.position.set(d.x,0,d.z);scene.add(g);const e=d.a==='E'?1:-1;
 box(g,.5,2.7,.4,B0.t,0,1.35,-1.05);box(g,.5,2.7,.4,B0.t,0,1.35,1.05);box(g,.5,.4,2.5,B0.t,0,2.6,0);
 const panel=glow(g,.12,2.1,1.7,0xd62828,0,1.05,0),l=label(1.1);l.position.set(0,3.9,0);g.add(l);
 pockets.push({x0:e>0?d.x-.3:d.x-1.4,x1:e>0?d.x+1.4:d.x+.3,z0:d.z-1,z1:d.z+1});
 const o={d,panel,l,kind,open:false};doors[kind]=o;return o;}
function refreshDoors(){const n=doors.next,p=doors.prev;
 if(n){n.open=step()>=NS;n.panel.material=gmat(n.open?0x2ecc71:0xd62828);n.l.draw('NEXT HOTEL',n.open?'GO!':'LOCKED');}
 if(p){p.panel.material=gmat(0x4cc9f0);p.l.draw('PREVIOUS','HOTEL');}}
if(BI<NB-1)mkDoor('next',L.nd);if(L.pd&&BI>0)mkDoor('prev',L.pd);
function travel(n,arr){if(traveling)return;traveling=true;SV.br=n;SV.arr=arr;SV.pos=null;save();$('fade').style.opacity=1;setTimeout(()=>location.reload(),520);}

/* ================= player ================= */
player=new THREE.Group();scene.add(player);
{let sp=L.start;const a=SV.arr;
 if(a==='prev'&&L.arrP)sp=[L.arrP.x,L.arrP.z];else if(a==='next'&&L.arrN)sp=[L.arrN.x,L.arrN.z];
 else if(SV.pos&&SV.pos.br===BI&&walk(SV.pos.x,SV.pos.z))sp=[SV.pos.x,SV.pos.z];
 player.position.set(sp[0],0,sp[1]);SV.arr=null;}
const body=new THREE.Group();player.add(body);
box(body,.7,.8,.45,0xef476f,0,1,0);sph(body,.32,0xffd9b3,0,1.7,0);cyl(body,.3,.3,.3,0xffffff,0,2.1,0,10);cyl(body,.4,.34,.22,0xffffff,0,2.35,0,10);
box(body,.06,.08,.05,0x222222,-.12,1.72,.3);box(body,.06,.08,.05,0x222222,.12,1.72,.3);
const legL=limb(body,.26,.6,.26,0x2b2d42,-.18,.6,0),legR=limb(body,.26,.6,.26,0x2b2d42,.18,.6,0),armL=limb(body,.22,.6,.22,0xef476f,-.46,1.35,0),armR=limb(body,.22,.6,.22,0xef476f,.46,1.35,0);
const carryG=new THREE.Group();carryG.position.y=2.55;carryG.userData.pop=true;player.add(carryG);useCustom(body,'player');aoBlob(player,0,0,1.5,1.5,.9);const vel=new THREE.Vector3();let walkP=0;
const syncCarry=()=>{stack(carryG,carry);hud();};
function take(arr,type){const i=arr.lastIndexOf(type);if(i<0)return false;arr.splice(i,1);return true;}

/* ================= customers ================= */
const custs=[];
/* customer types: rarity = spawn weight (%), tip multiplier, body size, patience factor, walk speed, eating time */
const CTYPES=[
 {id:'normal',name:'Customer',rar:'COMMON',col:'#ffffff',w:72,tip:1,sc:1,pat:1,sp:3,eat:4},
 {id:'kid',name:'Kid',rar:'UNCOMMON',col:'#7CFC9A',w:20,tip:.6,sc:.7,pat:1.3,sp:3.5,eat:4.5},
 {id:'vip',name:'VIP',rar:'RARE',col:'#ffd23f',w:8,tip:3,sc:1.05,pat:.7,sp:2.8,eat:5}];
const pickType=()=>{let r=Math.random()*CTYPES.reduce((a,t)=>a+t.w,0);for(const t of CTYPES){if((r-=t.w)<0)return t;}return CTYPES[0];};
const TAGM={};
function tagMat(ty){return TAGM[ty.id]||(TAGM[ty.id]=(()=>{const c=document.createElement('canvas');c.width=256;c.height=96;const x=c.getContext('2d');x.textAlign='center';x.lineJoin='round';x.strokeStyle='#3b2200';
 x.lineWidth=9;x.font='800 50px "Baloo 2",Trebuchet MS,sans-serif';x.fillStyle=ty.col;x.strokeText(ty.name.toUpperCase(),128,50);x.fillText(ty.name.toUpperCase(),128,50);
 x.lineWidth=6;x.font='800 26px "Baloo 2",Trebuchet MS,sans-serif';x.fillStyle='#fff';x.strokeText(ty.rar,128,86);x.fillText(ty.rar,128,86);
 return new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false});})());}
/* VIP gold outline = inverted hull (slightly bigger gold copy of every mesh, back faces only) + a glowing gold disc on the floor */
const outMat=new THREE.MeshBasicMaterial({color:0xffd23f,side:THREE.BackSide}),vipRG=new THREE.CylinderGeometry(.78,.78,.03,20),vipRM=new THREE.MeshBasicMaterial({color:0xffd23f,transparent:true,opacity:.45});
function addOutline(root,k=1.18){const ms=[];root.traverse(m=>{if(m.isMesh&&!m.userData.hull)ms.push(m);});ms.forEach(m=>{const h=new THREE.Mesh(m.geometry,outMat);h.userData.hull=true;h.scale.setScalar(k);m.add(h);});}
const BBM={};
function bubMat(n){const kk=BI+'_'+n;return BBM[kk]||(BBM[kk]=(()=>{const c=document.createElement('canvas');c.width=192;c.height=112;const x=c.getContext('2d');x.fillStyle='#fff8e7';x.strokeStyle='#3b2200';x.lineWidth=7;x.beginPath();if(x.roundRect)x.roundRect(8,8,176,80,22);else x.rect(8,8,176,80);x.fill();x.stroke();
 x.beginPath();x.moveTo(82,86);x.lineTo(96,108);x.lineTo(112,86);x.closePath();x.fill();x.textBaseline='middle';x.textAlign='center';x.font='54px sans-serif';x.fillStyle='#000';x.fillText(BR[BI].ej,56,50);
 x.font='800 58px "Baloo 2",Trebuchet MS,sans-serif';x.fillStyle='#3b2200';x.fillText(String(n),138,52);return new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false});})());}
function spawnCust(){if(!CT.on||CT.q.length>=QMAX||custs.length>=QMAX+12)return;
 const ty=EV.kc?CTYPES[2]:pickType(),vip=ty.id==='vip',gb=!vip&&Math.random()<.25,g=new THREE.Group();g.position.set(CT.x,0,L.ent.z+3.2);scene.add(g);const bd=new THREE.Group();g.add(bd);
 box(bd,.6,.75,.4,vip?0x2b2d42:gb?0x7f9db3:pick([0xff6fb5,0x3ddc97,0xff9f1c,0xff4d6d,0xffb703,0x00b4d8,0x7cff6b,0xc77dff,0xff7b00,0xf72585,0x4cc9f0,0xffe14d,0x2ee6a6]),0,.95,0);sph(bd,.3,gb?0x93b0c2:pick([0xffd9b3,0xe0ac69,0x8d5524,0xf1c27d]),0,1.58,0);box(bd,.5,.14,.5,pick([0x222222,0x6f4e37,0xd4a017]),0,1.84,0);
 if(vip){box(bd,.12,.5,.05,0xffd23f,0,.98,.22);glow(bd,.34,.12,.34,0xffd23f,0,2.0,0);}
 const pnt=gb?0x6f8da3:pick([0x3a86ff,0x7b2cbf,0x1d4ed8,0xff6d00,0x0ea5a5,0xd00070]),lA=limb(bd,.24,.55,.24,pnt,-.16,.55,0),lB=limb(bd,.24,.55,.24,pnt,.16,.55,0);
 useCustom(bd,'customer');if(vip)addOutline(bd);bd.scale.setScalar(ty.sc);
 const hold=new THREE.Group();hold.position.set(0,1.0,.5);hold.scale.setScalar(.65);hold.visible=false;bd.add(hold); // the dish the customer carries from the counter to the table (or out, if takeaway)
 aoBlob(g,0,0,1.3,1.3,.8);if(vip){const rg=new THREE.Mesh(vipRG,vipRM);rg.position.y=.03;g.add(rg);}
 const by=ty.id==='kid'?1.85:2.3,hasTag=ty.id!=='normal',bub=new THREE.Group();bub.position.y=by;g.add(bub);const qn=vip?2:(Math.random()<.25?2:1),bsp=new THREE.Sprite(bubMat(qn));bsp.scale.set(1.75,1.02,1);bsp.position.y=.12;bsp.renderOrder=11;bub.add(bsp);
 const em=new THREE.Sprite(emoMat('happy'));em.scale.set(1.05,1.05,1);em.renderOrder=11;em.position.y=by+(hasTag?1.6:.95);em.visible=false;g.add(em);
 let tg=null;if(hasTag){tg=new THREE.Sprite(tagMat(ty));tg.scale.set(1.7,.64,1);tg.renderOrder=11;tg.position.y=by+.85;g.add(tg);}
 const c={g,bd,lA,lB,hold,bub,state:'queue',path:[],t:0,ph:Math.random()*6,arr:false,ty,wt:0,by,em,tg,mood:null,tip:TIP,n:qn,res:'fast',crit:EV.kc};EV.kc=0;CT.q.push(c);custs.push(c);}
function updCust(c,dt){
 if(c.em.visible){const an=c.mood==='angry',s=1.05+Math.sin(performance.now()/(an?90:170)+c.ph)*(an?.14:.07);c.em.scale.set(s,s,1);}
 if(c.state==='eat'){c.t+=dt;c.g.position.y=0;c.bd.position.y=-.2*c.ty.sc;c.lA.rotation.x=c.lB.rotation.x=-1.3;
  if(c.t>c.ty.eat){const b=c.tb,az=L.ex.z-1.6;b.sOcc[c.sd]=false;b.occ=b.sOcc.some(Boolean);if(!b.occ&&!b.sRes.some(Boolean)){b.dirty=true;b.plates.visible=true;}b.cash+=c.tip*evm()*TBM();refreshTable(b);c.lA.rotation.x=c.lB.rotation.x=0;c.bd.position.y=0;c.state='leave';
   {const ot=b.sl[c.sd].out.map(q=>({x:q.x,z:q.z})),lp=ot[ot.length-1];c.path=ot.concat([{x:lp.x,z:az},{x:L.ex.x,z:az},{x:L.ex.x,z:L.ex.z+4}]);}hud();}return;}
 let tx,tz;if(c.state==='queue'){tx=CT.x;tz=CT.z+1.9+CT.q.indexOf(c);}else{tx=c.path[0].x;tz=c.path[0].z;}
 const dx=tx-c.g.position.x,dz=tz-c.g.position.z,d=Math.hypot(dx,dz);let mv=false;
 if(d>.06){const s=Math.min(d,c.ty.sp*dt);c.g.position.x+=dx/d*s;c.g.position.z+=dz/d*s;c.bd.rotation.y=Math.atan2(dx,dz);mv=true;c.arr=false;}
 else if(c.state==='queue'){c.arr=true;c.bd.rotation.y=Math.PI;}
 else{c.path.shift();if(!c.path.length){if(c.state==='toTable'){c.state='eat';c.t=0;c.tb.sRes[c.sd]=false;c.tb.sOcc[c.sd]=true;c.tb.res=c.tb.sRes.some(Boolean);c.tb.occ=true;c.bd.rotation.y=c.tb.sl[c.sd].ry;
   {const tb=c.tb,hl=c.hl||[],o={x:c.g.position.x,y:1.3,z:c.g.position.z};c.hold.visible=false;if(!hl.length)tb.plates.visible=true; // dish flies from the customer's hands onto the table
    hl.forEach((t,i)=>flyItem(t,o,{x:tb.x+(i%2?.25:-.2),y:1.15,z:tb.z+(i%2?-.2:.1)},.35,.9,i===hl.length-1?()=>{if(tb.occ)tb.plates.visible=true;}:null,i*.06));}}else{scene.remove(c.g);c.dead=true;}}}
 c.ph+=mv?dt*10:0;const s=mv?Math.sin(c.ph)*.7:0;c.lA.rotation.x=s;c.lB.rotation.x=-s;c.g.position.y=mv?Math.abs(Math.sin(c.ph))*.07:0;c.bub.position.y=c.by+Math.sin(performance.now()/300+c.ph)*.06;
 /* waiting in line: after ~15s (x patience) they get impatient, after ~30s angry */
 if(c.state==='queue'&&c.arr){c.wt+=dt;const pt=c.ty.pat,m=c.wt>=30*pt?'angry':c.wt>=15*pt?'mad':null;
  if(m!==c.mood){c.mood=m;if(m){c.em.material=emoMat(m);c.em.visible=true;}else c.em.visible=false;}}}
const inCirc=(x,z)=>dist(x,z,CT.x,CT.z-SCZ)<=CRAD; // serving circle behind the counter
const srvAt=()=>inCirc(player.position.x,player.position.z)||workers.some(w=>inCirc(w.g.position.x,w.g.position.z));
function cirUpd(){CIRM.color.setHex(srvAt()?0x3dff70:0xffffff);}
function updCounter(dt){const f=CT.q[0];
 if(f&&f.state==='queue'&&f.arr&&CT.shelf>=f.n&&srvAt()){const tb=tables.find(t=>!t.dirty&&t.sOcc.some((o,k)=>!o&&!t.sRes[k])),tk=!tables.length; // no tables built yet -> takeaway
  if(tb||tk){CT.sv+=dt;if(CT.sv>=CSV()){CT.sv=0;CT.shelf-=f.n;st(CT.sg,CT.shelf,'b');CT.q.shift();f.bub.visible=false;
   {const pt=f.ty.pat,res=f.wt<15*pt?'fast':f.wt<30*pt?'mid':'slow';f.res=res;f.mood=res==='fast'?'heart':res==='mid'?'mad':'angry'; // quick service = heart + bigger tip, slow = angry + small tip
    f.tip=Math.max(1,Math.round(TIP*f.ty.tip*(res==='fast'?1.3:res==='mid'?.7:.35)));f.em.material=emoMat(f.mood);f.em.visible=true;f.em.position.y=f.by+(f.tg?.85:.2);if(f.tg)f.tg.position.y=f.by+.1;floatEmoji(f,f.mood);
    if(f.ty.id==='vip')burst(f.g.position.x,2.4,f.g.position.z,[0xffd23f,0xfff1a0,0xffffff],14,2.6,4,.9);}
   if(tb){const sd=tb.sOcc.findIndex((o,k)=>!o&&!tb.sRes[k]);tb.sRes[sd]=true;tb.res=true;f.tb=tb;f.sd=sd;f.state='toTable';f.path=tb.sl[sd].ent.map(q=>({x:q.x,z:q.z}));}
   else{f.state='leave';f.path=[{x:L.ent.x,z:L.ent.z-1.6},{x:L.ent.x,z:L.ent.z+4}];}
   let pay=PRICE*f.n*evm();const hl=Array(f.n).fill('b'),hp={x:f.g.position.x,y:1.3,z:f.g.position.z-.4};
   if(CT.dk>0){CT.dk--;pay+=DB;st(CT.dg,CT.dk,'d');hl.push('d');}
   if(CT.sk>0){CT.sk--;pay+=PRICE*.5;st(CT.sgk,CT.sk,'s');hl.push('s');} // side item served with the order: +0.5x PRICE extra
   f.hl=hl;
   hl.forEach((t,i)=>flyItem(t,t==='d'?spos.cd():t==='s'?{x:CT.x-.2,y:1.4,z:CT.z+.6}:{x:CT.x-.6,y:1.4+i*.2,z:CT.z},hp,.35,1.3,i===hl.length-1?()=>{if(!f.dead){stack(f.hold,hl);f.hold.visible=true;}}:null,i*.07)); // dishes fly from the counter into the customer's hands
   pile+=pay;refreshPile();tossBills(CT.x,CT.z+1,pay);burst(CT.x,1.8,CT.z+1.2,[0xffd23f,0xffffff,0x7CFC9A],10,2.5,3.8,.8);popText(new THREE.Vector3(CT.x,2.8,CT.z+1),'+$'+fmt(pay),'#7CFC9A');beep(740,.08);
   addXP(5);mis('serve');if(f.crit)critDone(f);if(f.res!=='slow'&&Math.random()<.12)happy(f);}}else CT.sv=0;} // XP per served customer + 12% chance of a happy customer (+1 gem)
 else CT.sv=0;}
function careAll(dt){const act=[player.position].concat(workers.filter(w=>w.role==='S'||w.role==='H').map(w=>w.g.position));
 for(const t of tables){if(t.sp.visible)t.sp.position.y=2.4+Math.sin(performance.now()/260+t.x)*.12;t.da=t.dirty?(t.da||0)+dt:0;if(!act.some(a=>dist(a.x,a.z,t.x,t.z)<2.1)){t.ct=0;continue;}
  if(t.cash>0){const c=t.cash;earn(c);flyCash(new THREE.Vector3(t.x,1.2,t.z),Math.min(8,2+Math.ceil(c/(PRICE*.8))));burst(t.x,1.2,t.z,[0xffd23f,0x7CFC9A],8,2,3.5,.8);popText(new THREE.Vector3(t.x,2,t.z),'+$'+fmt(c),'#ffd23f');t.cash=0;refreshTable(t);beep(900,.08,.04);}
  }} // tips are collected by walking up; dirty plates must be picked up by hand (see takeWaste)

/* dirty plates: picking them up clears the table (a new customer may sit); they ride in the carry stack as 'w' until thrown in the bin */
const dirtyAt=q=>tables.find(t=>t.dirty&&!t.occ&&dist(q.x,q.z,t.x,t.z)<2.1);
function takeWaste(t,who){if(who)flyItem('w',{x:t.x,y:1.15,z:t.z},hdp(who),.3,1.3);t.dirty=false;t.res=false;t.ct=0;t.plates.visible=false;burst(t.x,1.2,t.z,[0xffffff,0x9be8ff],9,2.2,3.2,.7);beep(500,.06,.04);hud();}
/* table waste: plates fly from the table (or from a carrier's head, y) into the trash bin */
function tossWaste(t,y=1.15){const m=new THREE.Group();cyl(m,.3,.3,.05,0xffffff,0,0,0,10);cyl(m,.12,.12,.06,0xd62828,0,.05,0,6);shoot(m,{x:t.x,y:y,z:t.z},{x:trash.x,y:1.25,z:trash.z},.8,1.7,()=>{trash.lid.position.y=1.38;burst(trash.x,1.3,trash.z,[0xced4da,0x9aa0a6,0xffffff],8,1.7,3,.7);beep(220,.05,.03);});}
/* ================= workers AI ================= */
function wMove(w,tx,tz,dt){const q=w.g.position,dx=tx-q.x,dz=tz-q.z,d=Math.hypot(dx,dz),mv=d>.5;
 if(mv){const sp=WSPD(w);w.vx=dx/d*sp;w.vz=dz/d*sp;q.x+=dx/d*sp*dt;q.z+=dz/d*sp*dt;w.bd.rotation.y=Math.atan2(dx,dz);w.ph+=dt*10;const s=Math.sin(w.ph)*.7;w.lA.rotation.x=s;w.lB.rotation.x=-s;w.bd.position.y=Math.abs(Math.sin(w.ph))*.07;}
 else{w.vx=w.vz=0;w.ph+=dt*2.5;w.lA.rotation.x=w.lB.rotation.x=0;w.bd.position.y=Math.sin(w.ph)*.03;}
 return !mv;}
const nd=()=>dtq.length&&S.pack&&S.win&&(S.pack.inb+S.pack.out+S.win.stock.k)<dtq.length;
function updWorker(w,dt){if(w.role==='H'){const n=Math.min(7,Math.max(1,T.hp[w.idx]|0));if(n!==w.lv){w.lv=n;hSkin(w);pop(w.g);}} // level changed: re-skin + pop animation
 const hc=w.carry,cap=WCAP(w),P=w.g.position;let tx=w.home.x,tz=w.home.z,mode=null,s=null,serving=false;
 const D=S.drink,dn=hc.filter(x=>x==='d').length,useD=D&&D.stock>0&&CT.dk+dn<3,wait=CT.q[0]&&CT.q[0].state==='queue';
 const dirty=tables.filter(t=>t.dirty&&!t.occ).sort((a,b)=>(b.da||0)-(a.da||0))[0]; // oldest dirty table first, so far tables never starve
 if(w.role==='C'||w.role==='H'){
  if(w.role==='H'&&(hc.includes('w')||(dirty&&!hc.length))){if(dirty&&hc.length<cap){mode='pickW';tx=dirty.x+.6;tz=dirty.z+1.2*(dirty.fz||1);}else{mode='toBin';tx=trash.x;tz=trash.z+1.2;}}
  else if(hc.length<cap&&(useD||G0.stock>0)){s=useD?D:G0;mode='pick';tx=s.px;tz=s.pz;}
  else if(hc.length){const t=hc[hc.length-1];if(t==='b'&&nd()&&S.pack.inb<MCAP('p')){mode='toPack';tx=S.pack.px;tz=S.pack.pz;}else if(t==='d'?CT.dk<6:CT.shelf<8){mode='toShelf';tx=CT.x;tz=CT.z-SCZ;}}
  }
 else if(w.role==='S'){ // Counter Helper (counter level 2+): ONLY stands in the serving circle and hands dishes to customers (the serve itself runs in updCounter); never fetches or cleans
  serving=CT.sv>.001&&dist(P.x,P.z,CT.x,CT.z-SCZ)<3.2;}
 else if(w.role==='D'){ // Window Helper (window level 2+): ONLY brings finished bags to the window and stands there to hand them to the cars (the hand-off itself runs in carsUpd)
  const needBag=dtq.length&&S.win.stock.k<dtq.length;
  if(hc.includes('k')||hc.includes('K')){mode='toWin';tx=S.win.px;tz=S.win.pz;}
  else if(needBag&&S.pack.out>0){mode='getBag';tx=S.pack.px;tz=S.pack.pz;}
  else if(dtq.length){tx=S.win.px;tz=S.win.pz;}}
 const arr=wMove(w,tx,tz,dt);
 if(arr&&mode&&mode!=='clean'&&(w.t+=dt)>.15){w.t=0;
  if(mode==='pick'&&s.stock>0&&hc.length<cap){hc.push(s.fk);s.stock--;st(s.sg,s.stock,s.fk);flyItem(s.fk,s===G0?spos.g():spos.d(),hdp(P),.25);}
  else if(mode==='toPack'&&hc.length&&S.pack.inb<MCAP('p')){hc.pop();flyItem('b',hdp(P),spos.pi(),.28);S.pack.inb++;refreshPack();}
  else if(mode==='toShelf'&&hc.length){const t=hc.pop();flyItem(t==='d'?'d':'b',hdp(P),t==='d'?spos.cd():spos.cb(),.28);if(t==='d'){CT.dk++;st(CT.dg,CT.dk,'d');}else{CT.shelf++;st(CT.sg,CT.shelf,'b');}}
  else if(mode==='getBag'&&S.pack.out>0&&hc.length<cap){{const ks=S.pack.oS>0;hc.push(ks?'K':'k');if(ks)S.pack.oS--;S.pack.out--;refreshPack();flyItem(ks?'K':'k',spos.po(),hdp(P),.25);}}
  else if(mode==='pickW'&&dirty&&dist(P.x,P.z,dirty.x,dirty.z)<2.1&&hc.length<cap){takeWaste(dirty,P);hc.push('w');}
  else if(mode==='toBin'&&hc.includes('w')){hc.splice(hc.lastIndexOf('w'),1);trash.lid.position.y=1.38;tossWaste(P,2.9);addXP(8);mis('clean');}
  else if(mode==='toWin'&&hc.length){const kt=hc.pop();flyItem(kt,hdp(P),spos.w(),.28);S.win.stock.k++;if(kt==='K')S.win.stock.ks++;winShow();}}
 const key=(serving&&!hc.length)?'s':hc.join('');if(w.shown!==key){w.shown=key;stack(w.cg,key==='s'?['b']:hc);}
 const pkg=w.role==='P'&&S.pack;if(pkg&&!hc.length)w.bd.rotation.y=Math.atan2(S.pack.x-P.x,S.pack.z-P.z); // Packing Helper faces the table
 w.aL.rotation.x=w.aR.rotation.x=(serving||hc.length||(pkg&&S.pack.prog>.001)||(w.role==='D'&&hand>.001))?-1.4:Math.sin(w.ph)*.15;}

/* ================= input ================= */
let jid=null,jx=0,jy=0;const jv={x:0,y:0},K={up:0,down:0,left:0,right:0},jb=$('jb'),jk=$('jk');
addEventListener('pointerdown',e=>{try{ac=ac||new AC();ac.resume();}catch(_){}
 if(jid!==null)return;jid=e.pointerId;jx=e.clientX;jy=e.clientY;jv.x=jv.y=0;jb.style.display='block';jb.style.left=jx+'px';jb.style.top=jy+'px';jk.style.transform='none';$('hint').style.opacity=0;});
addEventListener('pointermove',e=>{if(e.pointerId!==jid)return;let dx=e.clientX-jx,dy=e.clientY-jy;const R=55,l=Math.hypot(dx,dy);if(l>R){dx*=R/l;dy*=R/l;}jv.x=dx/R;jv.y=dy/R;jk.style.transform=`translate(${dx}px,${dy}px)`;});
const endJ=e=>{if(e.pointerId!==jid)return;jid=null;jv.x=jv.y=0;jb.style.display='none';};
addEventListener('pointerup',endJ);addEventListener('pointercancel',endJ);
const KM={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};
addEventListener('keydown',e=>{if(KM[e.code]){K[KM[e.code]]=1;$('hint').style.opacity=0;e.preventDefault();}});
addEventListener('keyup',e=>{if(KM[e.code])K[KM[e.code]]=0;});
addEventListener('contextmenu',e=>e.preventDefault());

/* ================= main loop ================= */
/* ================= MACHINE UPGRADE popup (grill / drinks / packing) =================
   Each machine has a level (SV.mu.g / .d / .p, saved, shared by all hotels). Every level = +25% speed and +2 stock capacity.
   Cards: +1 level (cash), +2 levels (cash), HOT +4 levels (gems). Speed is applied in GI()/DIV()/PIV(), capacity in MCAP(). */
const UP={open:false,k:'g',near:null,nt:0,fx:[]},MUN={g:['Grill','\u{1F354}'],d:['Drinks','\u{1F964}'],p:['Packing','\u{1F4E6}'],w:['Window','\u{1F697}'],c:['Counter','\u{1F6CE}️']},GK=k=>k==='g'||k==='p'||k==='w'||k==='c',GMX=k=>k==='w'||k==='c'?2:3; // GK = machines with the fixed level table (grill / packing / window)
const stOf=k=>k==='c'?CT:k==='g'?G0:k==='d'?S.drink:k==='w'?S.win:S.pack,stOn=k=>{const o=stOf(k);return !!(o&&o.on);};
const lvCost=(k,lv)=>nice(ECO.c0*Math.pow(ECO.g,3+lv*.8)*M*(k==='p'?.9:1));
function muCards(k){if(GK(k))return(k==='g'?GL:k==='p'?PL:k==='c'?CL:WL).slice(1).map((l,i)=>({lvl:i+1,t:l.t,cap:l.c,cost:k==='g'?GC(i):nice(GC(i)*(k==='w'||k==='c'?.8:.9))}));const lv=SV.mu[k],left=MAXLV-lv;if(left<=0)return[];const out=[];
 [[1,0],[2,0],[4,1]].forEach(([n0,gem])=>{const n=Math.min(n0,left);if(!gem&&out.some(c=>!c.gem&&c.n===n))return;
  let cost=0;if(gem)cost=Math.max(3,Math.round((10+6*lv)*n/4));else for(let i=0;i<n;i++)cost+=lvCost(k,lv+i);
  out.push({n,gem,cost,spd:Math.round((SMUL2(lv+n)/SMUL2(lv)-1)*100),cap:2*n});});
 return out;}
const muIcons=['\u2699\uFE0F','\u{1F527}','\u{1F525}'];
function muRender(){const k=UP.k,lv=SV.mu[k];
 $('musub').textContent='Level '+(lv+1)+(lv>=(GK(k)?GMX(k):MAXLV)?' (MAX)':'');
 $('mutabs').innerHTML=['g','d','p','w','c'].map(x=>{const on=stOn(x);return '<button type="button" class="mut'+(x===k?' on':'')+(on?'':' lock')+'" data-k="'+x+'">'+(on?MUN[x][1]:'\u{1F512}')+' '+MUN[x][0]+'</button>';}).join('');
 $('mustat').textContent=k==='c'?'Counter: 1 order every '+CSV().toFixed(2)+'s  |  '+(CLV()>=1?'Counter Helper serves customers for you':'you serve customers from the serving circle'):k==='w'?'Drive-thru: 1 bag every '+HTV().toFixed(2)+'s  |  '+(WLV()>=1?'Window Helper hands bags to cars for you':'you hand the bags over at the window'):k==='g'?'Grill: 1 item every '+GL[Math.min(3,lv)].t+'s  |  stock capacity '+GL[Math.min(3,lv)].c:k==='p'?'Packing: 1 box every '+PIV().toFixed(1)+'s  |  '+(PLV()>=1?'Packing Helper works for you':'you pack it yourself at the station')+'  |  capacity '+MCAP('p'):MUN[k][0]+': speed x'+SMUL(k).toFixed(2)+'  |  stock capacity '+MCAP(k);
 const cs=muCards(k),box=$('mucards');box.style.gridTemplateColumns='repeat('+Math.max(1,cs.length)+',1fr)';if(GK(k)){grRender(cs,box);return;}
 if(!cs.length){box.innerHTML='<div id="mumax">\u2B50 MAX LEVEL \u2B50<br><small>This machine is fully upgraded.</small></div>';}
 else box.innerHTML=cs.map((c,i)=>{const hot=c.gem,aff=hot?SV.gems>=c.cost:cash>=c.cost;
  return '<div class="muc'+(hot?' hot':'')+(aff?'':' no')+'" data-i="'+i+'">'+(hot?'<div class="hotb">HOT</div>':'')+'<div class="ic">'+(hot?muIcons[2]:muIcons[Math.min(i,1)])+'</div><div class="ln">SPEED<b>+'+c.spd+'%</b></div><div class="ln">CAPACITY<b>+'+c.cap+'</b></div><div class="pr'+(hot?' gem':'')+'">'+(hot?'\u{1F48E} '+fmt(c.cost):'$'+fmt(c.cost))+'</div><button type="button" class="sel" data-i="'+i+'">Select</button></div>';}).join('');
 UP.cs=cs;}
function grRender(cs,box){const pk=UP.k==='p',ck=UP.k==='c',wk=UP.k==='w'||ck,lv=Math.min(3,SV.mu[UP.k]);box.innerHTML=cs.map(c=>{const done=lv>=c.lvl,nxt=lv+1===c.lvl;return '<div class="muc'+(nxt&&cash>=c.cost?'':' no')+'"><div class="ic">'+(done?'\u2705':nxt?((pk||wk)&&c.lvl===1?'\u{1F9D1}\u200D\u{1F373}':'\u{1F527}'):'\u{1F512}')+'</div><div class="ln">LEVEL<b>'+(c.lvl+1)+'</b></div><div class="ln">'+(pk?'1 BOX / ':ck?'1 ORDER / ':wk?'1 BAG / ':'1 ITEM / ')+'<b>'+c.t+'s</b></div>'+(wk?'':'<div class="ln">CAPACITY<b>'+c.cap+'</b></div>')+((pk||wk)&&c.lvl===1?'<div class="ln">HELPER<b>HIRED</b></div>':'')+(done?'<div class="pr">DONE</div>':'<div class="pr">$'+fmt(c.cost)+'</div><button type="button" class="sel" data-i="'+(c.lvl-1)+'">'+(nxt?'Select':'Locked')+'</button>')+'</div>';}).join('');UP.cs=cs;}
function muMsg(t){const m=$('mumsg');m.textContent=t||'';clearTimeout(muMsg._t);if(t)muMsg._t=setTimeout(()=>{m.textContent='';},1800);}
function muBuy(i){const k=UP.k,c=UP.cs&&UP.cs[i];if(!c)return;if(GK(k)&&c.lvl!==SV.mu[k]+1){muMsg(SV.mu[k]>=c.lvl?'Already upgraded':'Buy the earlier upgrade first');beep(180,.1,.05);return;}const card=document.querySelector('.muc[data-i="'+i+'"]');
 if(c.gem?SV.gems<c.cost:cash<c.cost){muMsg(c.gem?'Not enough gems \u{1F48E}':'Not enough cash');beep(180,.1,.05);if(card){card.classList.remove('shake');void card.offsetWidth;card.classList.add('shake');}return;}
 if(c.gem){SV.gems-=c.cost;lvHud();}else{cash-=c.cost;hud();}
 SV.mu[k]=GK(k)?c.lvl:Math.min(MAXLV,SV.mu[k]+c.n);if(GK(k))reskin();if(k==='p'&&S.pack&&PLV()>=1)addWorker('P',true);if(k==='w'&&S.win&&WLV()>=1)addWorker('D',true);if(k==='c'&&CT.on&&CLV()>=1)addWorker('S',true);UP.fx.push(k);dirty=true;save();
 [523,659,784,1046].forEach((f,j)=>setTimeout(()=>beep(f,.1,.05),j*70));muMsg('');muRender();
 const s=$('musub');s.style.transition='none';s.style.transform='scale(1.25)';void s.offsetWidth;s.style.transition='transform .25s';s.style.transform='none';}
function muOpen(k){if(traveling)return;if(!k||!stOn(k))k=['g','d','p','w','c'].find(stOn);if(!k)return;UP.k=k;UP.open=true;
 jid=null;jv.x=jv.y=0;jb.style.display='none';$('upchip').style.display='none';$('mu').style.display='flex';muMsg('');muRender();}
function muClose(){if(!UP.open)return;UP.open=false;$('mu').style.display='none';UP.nt=-1.5;
 UP.fx.forEach(k=>{const o=stOf(k);if(!o)return;popText(new THREE.Vector3(o.x,3.4,o.z+1),MUN[k][0]+' LEVEL UP!','#7CFC9A');burst(o.x,2,o.z+1.5,[0xffd23f,0x7CFC9A,0xffffff],20,3,5,1);if(GK(k)){pop(o.g);starBurst(o.x,1.6,o.z+1.5,8);flash();}});UP.fx=[];}
['mu','upchip','upb'].forEach(id=>$(id).addEventListener('pointerdown',e=>e.stopPropagation()));
$('upb').addEventListener('click',()=>muOpen(UP.near||UP.k));
$('upchip').addEventListener('click',()=>{if(UP.near)muOpen(UP.near);else upTable();});
$('mux').addEventListener('click',muClose);
$('mu').addEventListener('click',e=>{if(e.target.id==='mu'){muClose();return;}const t=e.target.closest('.mut');if(t&&!t.classList.contains('lock')){UP.k=t.dataset.k;muMsg('');muRender();return;}const b=e.target.closest('.sel');if(b)muBuy(+b.dataset.i);});
addEventListener('keydown',e=>{if(e.key==='Escape')muClose();});
/* MAX badges (red, on top of a full stock) + "Upgrade" chip when you stand at a machine for a moment */
const MB={};['g','d','p','w','c'].forEach(k=>{const e=document.createElement('div');e.className='maxb';document.body.appendChild(e);MB[k]=e;});
const _bv=new THREE.Vector3();let _bt=performance.now();
function badgeTick(){const now=performance.now(),dt=Math.min(.1,(now-_bt)/1000);_bt=now;let near=null;
 for(const k of ['g','d','p','w','c']){const o=stOf(k),e=MB[k];if(!o||!o.on||UP.open||CM.open||GM.open||traveling){e.style.display='none';continue;}
  if(k==='w'||k==='c'){if(k==='w')e.style.display='none';const qx2=k==='c'?o.x:o.px,qz2=k==='c'?o.z-SCZ:o.pz;if(player&&dist(player.position.x,player.position.z,qx2,qz2)<2.2)near=k;continue;} // window: no stock badge, only the Upgrade chip
  const val=k==='p'?o.out:o.stock,full=k==='p'?(o.out>=MCAP('p')||o.inb>=MCAP('p')):o.stock>=MCAP(k),txt=full?'MAX':(val>8?String(val):'');
  if(!txt){e.style.display='none';}else{if(e.textContent!==txt)e.textContent=txt;e.className='maxb'+(full?'':' cnt');
   if(k==='p')_bv.set(o.x+.7,2.4,o.z);else _bv.set(o.x,2.9,o.z+2);_bv.project(cam);e.style.left=((_bv.x*.5+.5)*innerWidth)+'px';e.style.top=((-_bv.y*.5+.5)*innerHeight)+'px';e.style.display='block';}
  if(player&&dist(player.position.x,player.position.z,o.px,o.pz)<2.2)near=k;}
 {const e=MB.c;if(!player||carry.length<CAP()||!carry.length||UP.open||CM.open||GM.open||traveling)e.style.display='none';else{if(e.textContent!=='MAX')e.textContent='MAX';e.className='maxb';_bv.set(player.position.x,2.55+carry.reduce((a,t)=>a+(STEP[t]||.34),0)+.45,player.position.z).project(cam);e.style.left=((_bv.x*.5+.5)*innerWidth)+'px';e.style.top=((-_bv.y*.5+.5)*innerHeight)+'px';e.style.display='block';}}
 const ch=$('upchip');let nT=null;if(!near&&player&&(T.tl|0)<2)nT=tables.find(q=>dist(player.position.x,player.position.z,q.x,q.z)<2.3)||null;
 if(UP.open||CM.open||GM.open||traveling)ch.style.display='none';
 else if(near&&!(GK(near)&&SV.mu[near]>=GMX(near))){UP.tn=0;if(UP.near!==near){UP.near=near;UP.nt=0;}UP.nt+=dt;if(UP.nt>.8){const t='\u2B06 Upgrade '+MUN[near][0];if(ch.textContent!==t)ch.textContent=t;ch.style.display='block';}else ch.style.display='none';}
 else if(nT){UP.near=null;UP.nt=0;UP.tn=(UP.tn||0)+dt;if(UP.tn>.8){const t='\u2B06 Upgrade Table \u00B7 $'+fmt(tblCost());if(ch.textContent!==t)ch.textContent=t;ch.style.display='block';}else ch.style.display='none';}
 else{UP.near=null;UP.nt=0;UP.tn=0;ch.style.display='none';}}
/* ================= CITY MAP (opens when you walk through the open NEXT HOTEL door) =================
   Unlocked hotels (index <= SV.mx) can be tapped to travel there with the ORIGINAL travel(n,arr). Locked ones show a lock and the
   price of the previous hotel's "Hotel Door" step, which is the payment that unlocks them. */
const CM={open:false,cd:0};
const cmShade=(n,f)=>{const c=s=>Math.min(255,Math.round(s*f));return '#'+((c(n>>16&255)<<16)|(c(n>>8&255)<<8)|c(n&255)).toString(16).padStart(6,'0');};
const cmHex=n=>'#'+(n>>>0).toString(16).padStart(6,'0');
const CMY=i=>120+i*160,CMX=i=>i%2?70:30,CMH=CMY(NB-1)+130;
const cmUnlock=i=>i<=SV.mx,cmPrice=i=>nice(ECO.cost1(NS-1)*BR[i-1].m);
function cmBuilding(i){const b=BR[i],w=cmHex(b.w),ws=cmShade(b.w,.72),t=cmHex(b.t),ts=cmShade(b.t,1.18),ts2=cmShade(b.t,.8),S='stroke="#3b2200" stroke-width="2" stroke-linejoin="round"';
 return '<svg class="cmb" viewBox="0 0 100 78">'+
 '<path d="M4 50v11a46 14 0 0 0 92 0V50z" fill="#a8693a" '+S+'/>'+
 '<ellipse cx="50" cy="50" rx="46" ry="14" fill="#7bd35b" '+S+'/><ellipse cx="50" cy="52" rx="34" ry="8" fill="#98e377"/>'+
 '<rect x="13" y="44" width="3" height="7" fill="#7a4b2a"/><circle cx="14.5" cy="40" r="6.5" fill="#2d6a4f" '+S+'/>'+
 '<ellipse cx="50" cy="55" rx="28" ry="5" fill="rgba(0,0,0,.18)"/>'+
 '<polygon points="62,28 76,22 76,46 62,52" fill="'+ws+'" '+S+'/>'+
 '<rect x="26" y="28" width="36" height="24" fill="'+w+'" '+S+'/>'+
 '<rect x="41" y="38" width="10" height="14" fill="#5b3a1a" '+S+'/><circle cx="49" cy="46" r="1" fill="#ffd23f"/>'+
 '<rect x="30" y="33" width="8" height="8" fill="#bfe9ff" '+S+'/><rect x="53" y="33" width="7" height="8" fill="#bfe9ff" '+S+'/>'+
 '<polygon points="25,27 41,19 78,19 63,27" fill="'+ts+'" '+S+'/><rect x="25" y="27" width="38" height="4" fill="'+t+'" '+S+'/>'+
 '<polygon points="63,27 78,19 78,23 63,31" fill="'+ts2+'" '+S+'/>'+
 '</svg>';}
function cmRender(){let seg='',nodes='',deco='';
 for(let i=0;i<NB;i++){const x=CMX(i),y=CMY(i);
  if(i<NB-1){const x1=CMX(i+1),y1=CMY(i+1),d='M'+x+' '+(y-18)+' C'+x+' '+(y+70)+' '+x1+' '+(y1-106)+' '+x1+' '+(y1-18);
   seg+='<g class="'+(cmUnlock(i+1)?'':'lk')+'"><path class="r0" d="'+d+'"/><path class="r1" d="'+d+'"/><path class="r2" d="'+d+'"/></g>';}
  deco+='<div class="cmdeco" style="left:'+(i%2?16:84)+'%;top:'+(y+8)+'px">'+(i%3===0?'\u{1F333}':i%3===1?'\u{1F332}':'\u2601\uFE0F')+'</div>';
  const un=cmUnlock(i),cur=i===BI,st=Math.min(NS,SV.b[i].step|0);let stat;
  if(cur)stat='<div class="cmbar"><i style="width:'+(st/NS*100)+'%"></i></div><div class="cmtx">Step '+st+'/'+NS+'</div>';
  else if(un)stat='<div class="cmgo">Tap to go</div><div class="cmtx">'+(st>=NS?'\u2605 Complete':'Step '+st+'/'+NS)+'</div>';
  else stat='<div class="cmpr">$'+fmt(cmPrice(i))+'</div>';
  nodes+='<div class="cmn '+(cur?'cur':un?'ok':'lk')+'" data-i="'+i+'" style="left:'+x+'%;top:'+y+'px">'+(cur?'<div class="cmpin">YOU\'RE HERE</div>':'')+cmBuilding(i)+'<div class="cmnum">'+(i+1)+'</div>'+(un?'':'<div class="cmlock">\u{1F512}</div>')+'<div class="cmname">'+BR[i].n+'</div><div class="cmst">'+stat+'</div></div>';}
 $('cmmap').style.height=CMH+'px';
 $('cmmap').innerHTML='<svg class="cmroad" viewBox="0 0 100 '+CMH+'" preserveAspectRatio="none" style="height:'+CMH+'px">'+seg+'</svg>'+deco+nodes;
 $('cmcash').textContent='$'+fmt(cash);$('cmgem').textContent='\u{1F48E} '+fmt(SV.gems);}
function cmMsg(t){const m=$('cmmsg');m.textContent=t;m.style.display='block';clearTimeout(cmMsg._t);cmMsg._t=setTimeout(()=>{m.style.display='none';},2200);}
function cmOpen(o){if(traveling||CM.open||UP.open)return;CM.open=true;
 if(o){const d=o.d,e=d.a==='E'?1:-1,p=player.position;for(const k of [1.6,1.2,.8]){if(walk(d.x-e*k,p.z)){p.x=d.x-e*k;break;}}} // step back from the door so it does not re-trigger
 jid=null;jv.x=jv.y=0;jb.style.display='none';$('upchip').style.display='none';
 $('cmmsg').style.display='none';$('cm').style.display='block';cmRender();
 requestAnimationFrame(()=>{const sc=$('cmscroll');sc.scrollTop=Math.max(0,CMY(BI)-sc.clientHeight/2);});}
function cmClose(){if(!CM.open)return;CM.open=false;CM.cd=1.2;$('cm').style.display='none';}
$('cm').addEventListener('pointerdown',e=>e.stopPropagation());
$('cmx').addEventListener('click',cmClose);
$('cmmap').addEventListener('click',e=>{const n=e.target.closest('.cmn');if(!n)return;const i=+n.dataset.i;
 if(i===BI){cmClose();return;}
 if(!cmUnlock(i)){cmMsg(i===SV.mx+1?'Finish '+BR[i-1].n+' and open its door to unlock this hotel':'Unlock the earlier hotels first');beep(180,.1,.05);n.classList.remove('shake');void n.offsetWidth;n.classList.add('shake');return;}
 beep(660,.08,.05);travel(i,i>BI?'prev':'next');});
addEventListener('keydown',e=>{if(e.key==='Escape')cmClose();});
/* ================= LIVE-OPS: modal engine, HR panel, daily wheel, events, missions, offline earnings, settings ================= */
const GM={open:false,fn:null,lock:false,q:[],cd:0},dayKey=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();},fmtT=s=>{const h=Math.floor(s/3600),m=Math.floor(s%3600/60);return (h?h+'h ':'')+m+'m';};
function gmo(t,s,b,fn,lock){$('gm').classList.remove('sheet');GM.open=true;GM.fn=fn||null;GM.lock=!!lock;$('gmt').textContent=t;$('gms').textContent=s||'';$('gms').style.display=s?'inline-block':'none';$('gmb').innerHTML=b;$('gmx').style.display=lock?'none':'block';$('gm').style.display='flex';jid=null;jv.x=jv.y=0;jb.style.display='none';$('upchip').style.display='none';}
function gmClose(){if(!GM.open)return;GM.open=false;GM.fn=null;GM.cd=1.5;$('gm').style.display='none';setTimeout(()=>{if(!GM.open&&GM.q.length)GM.q.shift()();},200);}
$('gm').addEventListener('click',e=>{if(e.target.id==='gmx'||(e.target.id==='gm'&&!GM.lock)){gmClose();return;}const b=e.target.closest('[data-a]');if(b&&GM.fn)GM.fn(b.dataset.a,b);});
document.querySelectorAll('.ib,#gm').forEach(e=>e.addEventListener('pointerdown',ev=>ev.stopPropagation()));
addEventListener('keydown',e=>{if(e.key==='Escape'&&!GM.lock)gmClose();});
const gmFree=f=>()=>{if(!GM.open&&!UP.open&&!CM.open&&!traveling)f();};
$('ibm').onclick=gmFree(()=>msnOpen());$('ibh').onclick=gmFree(()=>hrOpen());$('ibs').onclick=gmFree(()=>setOpen());
/* ---- HR office: staff cards + hire / train ---- */
const HRB={ws:[6.2,7.4,8.6],wc:[6.5,7.7,8.9],rc:[6.8,8.2,9.6]},HRN={S:['Sam','Counter helper'],D:['Dev','Drive-thru helper']},HNM=['Riya','Arjun','Meera','Kabir','Isha','Rohan','Anaya'];
const wage=w=>nice(PRICE*(w.role==='S'?1.2:w.role==='D'?1.5:w.role==='P'?1.1:1)*(1+.25*(SV.ws+SV.wc)));
/* ---- bottom-sheet panels: PLAYER (speed / capacity / profits) and STAFF (worker speed / capacity / recruiter). Blue button = pay gems, green = pay cash. Levels live in T.ps, T.pc, T.pu (per hotel), SV.ws, SV.wc, T.hp (helper levels) ---- */
const sc18=(k,l)=>nice(ECO.c0*Math.pow(ECO.g,k)*M*Math.pow(1.8,l)); // player speed / capacity: level-0 price on the normal curve, then x1.8 per level
const UPG={ps:{n:'MOVE SPEED',ic:'\u{1F3C3}',mx:7,c:()=>sc18(SPB[0],T.ps)},pc:{n:'CAPACITY',ic:'\u{1F354}',mx:7,c:()=>sc18(PCB[0],T.pc)},pu:{n:'PROFITS UP',ic:'\u{1F4B5}',mx:7,c:()=>sc18(3,T.pu)},
 ws:{n:'WORKER SPEED',ic:'\u26A1',mx:3,c:()=>sc2(HRB.ws[SV.ws])},wc:{n:'WORKER CAPACITY',ic:'\u{1F4E6}',mx:3,c:()=>sc2(HRB.wc[SV.wc])},rc:{n:'RECRUITER',ic:'\u{1F9D1}\u200D\u{1F373}',mx:3,c:()=>sc2(HRB.rc[Math.min(2,T.hp.length)])}};
const upLv=k=>k==='rc'?T.hp.length:k==='ps'||k==='pc'||k==='pu'?T[k]|0:SV[k],upGem=k=>2+2*upLv(k);
function sheet(ttl,keys){const stf=ttl==='STAFF';if(stf)keys=['ws','wc'];gmo(ttl,'','<div class="cds">'+keys.map(k=>{const u=UPG[k],l=upLv(k),done=l>=u.mx,c=done?0:u.c();
 return '<div class="cd"><i class="clip"></i><b>'+u.n+'</b><span class="ic2">'+u.ic+'</span><div class="dots">'+Array.from({length:u.mx},(_,i)=>'<u'+(i<l?' class="on"':'')+'></u>').join('')+'</div>'+(done?'<div class="mxl">MAX</div>':'<button class="bg" data-a="g'+k+'">\u{1F48E} '+upGem(k)+'</button><button class="bc'+(cash<c?' no':'')+'" data-a="c'+k+'">$'+fmt(c)+'</button>')+'</div>';}).join('')+'</div>'+(stf?staffHtml():''),a=>stf&&a[0]==='h'?staffBuy(a):upBuy(a,ttl,keys));$('gm').classList.add('sheet');}
function upBuy(a,ttl,keys){const g=a[0]==='g',k=a.slice(1),u=UPG[k];if(!u||upLv(k)>=u.mx)return;const c=g?upGem(k):u.c();
 if(g?SV.gems<c:cash<c){beep(180,.1,.05);return;}
 if(g){SV.gems-=c;lvHud();}else{cash-=c;}
 if(k==='rc')T.hp.push(1);else if(k==='ps'||k==='pc'||k==='pu')T[k]=(T[k]|0)+1;else SV[k]=upLv(k)+1;
 if(k==='pu')econ();ensure(true);addXP(20);mis('build');hud();dirty=true;save();beep(784,.1,.05);sheet(ttl,keys);}
/* ---- STAFF sheet helper section: Hire Helper (max 7, one after another, each hire costs 1.8x the previous) + one scrolling card per helper with Level Up (cash / gems). Actions: 'hh' = hire, 'hc<i>' / 'hg<i>' = level up helper i with cash / gems ---- */
const HMAX=7,hireCost=()=>nice(sc2(HRB.rc[0])*Math.pow(1.8,T.hp.length)),hLvCost=l=>nice(sc2(HRB.wc[0])*Math.pow(1.8,l-1)),hLvGem=l=>2+2*l,hCap=()=>step()>=11?7:step()>=9?5:3; // helper level cap by hotel step (same for every helper): step <=8 -> L3, step 9-10 -> L5, step 11+ -> L7
function staffHtml(){const n=T.hp.length,full=n>=HMAX,hc=full?0:hireCost();
 let h='<div style="margin:10px 0 6px;text-align:center"><b>HELPERS '+n+'/'+HMAX+'</b></div>';
 h+=full?'<div class="mxl">ALL HELPERS HIRED</div>':'<button class="bc'+(cash<hc?' no':'')+'" data-a="hh" style="width:100%;margin-bottom:8px">\u{1F9D1}\u200D\u{1F373} Hire Helper #'+(n+1)+' \u00B7 $'+fmt(hc)+'</button>';
 h+='<div style="max-height:34vh;overflow-y:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y;padding-right:2px">'+T.hp.map((v,i)=>{const l=Math.min(7,Math.max(1,v|0)),mx=l>=7,lim=!mx&&l>=hCap(),c=mx?0:hLvCost(l),fw={role:'H',lv:l};
  return '<div class="cd" style="margin-bottom:8px;text-align:left"><b>'+HNM[i%HNM.length]+'</b> <span style="opacity:.8">Level '+l+'/7</span>'
   +'<div style="font-size:.85em;opacity:.9;margin:4px 0">\u26A1 Speed '+WSPD(fw).toFixed(1)+' \u00B7 \u{1F4E6} Capacity '+WCAP(fw)+'</div>'
   +(mx?'<div class="mxl">MAX</div>':lim?'<button class="bc no" disabled style="width:100%">MAX (step badhao)</button>':'<button class="bg" data-a="hg'+i+'">\u{1F48E} '+hLvGem(l)+'</button><button class="bc'+(cash<c?' no':'')+'" data-a="hc'+i+'">Level Up $'+fmt(c)+'</button>')+'</div>';}).join('')+'</div>';
 return h;}
function staffBuy(a){let ok=false;
 if(a==='hh'){const n=T.hp.length;if(n>=HMAX)return;const c=hireCost();if(cash<c){beep(180,.1,.05);return;}cash-=c;T.hp.push(1);ok=true;}
 else{const g=a[1]==='g',i=+a.slice(2),l=Math.min(7,Math.max(1,T.hp[i]|0));if(!(i>=0&&i<T.hp.length)||l>=7)return;if(l>=hCap()){beep(180,.1,.05);return;}const c=g?hLvGem(l):hLvCost(l);
  if(g?SV.gems<c:cash<c){beep(180,.1,.05);return;}if(g){SV.gems-=c;lvHud();}else cash-=c;T.hp[i]=l+1;ok=true;}
 if(ok){ensure(true);addXP(20);mis('build');hud();dirty=true;save();beep(784,.1,.05);sheet('STAFF');}}
function hrOpen(){if(step()>=12)sheet('STAFF',['ws','wc','rc']);}
/* ---- daily missions ---- */
const MD={build:{t:'Build or upgrade 2 things',n:2,g:4,s:0},serve:{t:'Serve 20 customers',n:20,g:6,s:2},clean:{t:'Clean 5 tables',n:5,g:5,s:3},car:{t:'Serve 3 drive-thru cars',n:3,g:6,s:5},time:{t:'Play for 5 minutes',n:300,g:3,s:0}};
const msnDot=()=>{$('ibm').lastElementChild.style.display=SV.ms.a.some((a,i)=>SV.ms.p[i]>=MD[a].n&&!SV.ms.c[i])?'block':'none';};
function msnRoll(){const t=dayKey();if(SV.ms.d===t&&SV.ms.a.length)return;const ks=Object.keys(MD).filter(k=>MD[k].s<=step()).sort(()=>Math.random()-.5).slice(0,3);SV.ms={d:t,a:ks,p:ks.map(()=>0),c:ks.map(()=>0)};dirty=true;msnDot();}
function mis(k,n=1){SV.ms.a.forEach((a,i)=>{if(a!==k||SV.ms.p[i]>=MD[a].n)return;SV.ms.p[i]=Math.min(MD[a].n,SV.ms.p[i]+n);if(SV.ms.p[i]>=MD[a].n){banner('MISSION DONE!',MD[a].t);msnDot();dirty=true;}});}
function msnOpen(){msnRoll();gmo('DAILY MISSIONS','Reward: gems | resets every day',SV.ms.a.map((a,i)=>{const d=MD[a],p=Math.floor(SV.ms.p[i]),ok=p>=d.n&&!SV.ms.c[i];return '<div class="rw"><div style="flex:1"><div class="t">'+d.t+'</div><div class="bar"><i style="width:'+Math.min(100,p/d.n*100)+'%"></i></div><small>'+Math.min(p,d.n)+' / '+d.n+'</small></div><div class="rwd">\u{1F48E} '+d.g+'<button class="gb sm'+(ok?'':' no')+'" data-a="'+i+'">'+(SV.ms.c[i]?'Done':'Claim')+'</button></div></div>';}).join('')||'<div class="rw">Build a bit more to unlock missions!</div>',a=>{const i=+a,d=MD[SV.ms.a[i]];if(!d||SV.ms.c[i]||SV.ms.p[i]<d.n)return;SV.ms.c[i]=1;addGems(d.g);msnDot();save();msnOpen();});}
/* ---- random events ---- */
const EV={k:null,t:0,nx:100+Math.random()*80,kc:0},EVD={rush:['\u{1F680}','RUSH HOUR','2x customers for 60s'],happy:['\u{1F389}','HAPPY HOUR','2x income for 60s'],critic:['\u{1F9D0}','FOOD CRITIC','a VIP critic is coming - serve fast!']},evm=()=>EV.k==='happy'?2:1;
function evStart(k){EV.k=k;EV.t=60;if(k==='critic')EV.kc=1;banner(EVD[k][1]+'!',EVD[k][2]);beep(880,.12,.05);}
function evEnd(){if(EV.k==='critic')EV.kc=0;banner('EVENT OVER','Back to normal');EV.k=null;}
function critDone(f){EV.k=null;const b=PRICE*15;pile+=b;refreshPile();addGems(5);popText(new THREE.Vector3(f.g.position.x,3.4,f.g.position.z),'CRITIC +$'+fmt(b),'#ffd23f');banner('CRITIC LOVED IT!','+$'+fmt(b)+' and 5 gems');}
function extras(dt,p){ACT=Date.now();
 if(EV.k){EV.t-=dt;if(EV.t<=0)evEnd();}else if(step()>=3&&(EV.nx-=dt)<=0){EV.nx=150+Math.random()*150;evStart(pick(['rush','happy','critic']));}
 const b=$('evb');if(EV.k){const s=Math.ceil(EV.t),tx=EVD[EV.k][0]+' '+EVD[EV.k][1]+'  '+Math.floor(s/60)+':'+String(s%60).padStart(2,'0');if(b.textContent!==tx)b.textContent=tx;b.style.display='block';}else b.style.display='none';
 mis('time',dt);
 if((HRP.wt+=dt)>=60){HRP.wt=0;const tot=workers.reduce((a,w)=>a+wage(w),0),pay=Math.min(cash,tot);if(pay>0){cash-=pay;hud();popText(new THREE.Vector3(HRP.x,3,HRP.z),'Wages -$'+fmt(pay),'#ffb3c6');}}
 if(GM.cd>0)GM.cd-=dt;if(step()>=12)for(const r of ROOMS){const d=dist(p.x,p.z,r.px,r.pz);if(d>1.8)r.arm=1;if(r.arm&&d<.9&&GM.cd<=0&&!GM.open&&!UP.open&&!CM.open){r.arm=0;r.open();}}}
/* ---- daily reward wheel ---- */
function dailyOpen(){const b=nice(Math.max(70,ECO.c0*M*.5)),W=[{c:b,w:30},{g:5,w:25},{c:b*2,w:20},{g:10,w:15},{c:b*4,w:7},{g:25,w:3}],lab=s=>s.c?'$'+fmt(s.c):'\u{1F48E}'+s.g,cols=['#ff8c1a','#7b2cbf','#22c55e','#e5232f','#4cc9f0','#ffd23f'];
 gmo('DAILY REWARD','Spin once every day!','<div id="wp"></div><div id="wh" style="background:conic-gradient('+cols.map((c,i)=>c+' '+i*60+'deg '+(i+1)*60+'deg').join(',')+')">'+W.map((s,i)=>'<span style="transform:rotate('+(i*60+30)+'deg) translateY(-68px)">'+lab(s)+'</span>').join('')+'</div><button class="gb" id="spin" data-a="spin">SPIN!</button>',a=>{
  if(a==='ok'){gmClose();return;}if(SV.dl===dayKey())return;SV.dl=dayKey();let r=Math.random()*100,i=0;for(;i<5&&(r-=W[i].w)>=0;i++);const s=W[i];if(s.c)earn(s.c);else addGems(s.g);save();
  $('wh').style.transform='rotate('+(1800+360-(i*60+30))+'deg)';$('spin').style.display='none';
  setTimeout(()=>{$('gmb').insertAdjacentHTML('beforeend','<div class="big">You won '+lab(s)+'!</div><button class="gb" data-a="ok">Awesome!</button>');beep(784,.1,.05);beep(1046,.15,.05);},3700);},true);}
/* ---- offline earnings + boot popups ---- */
function bootPopups(){msnRoll();msnDot();hrDraw();
 const away=Math.min(7200,OFF_AWAY),amt=step()>=3&&away>=120?Math.floor(PRICE*ECO.K(step())*away*.03):0;
 if(amt>0){earn(amt);GM.q.push(()=>gmo('WELCOME BACK!','Away for '+fmtT(OFF_AWAY)+(OFF_AWAY>7200?' (2h max counted)':''),'<div style="text-align:center;font-size:13px;font-weight:800">Your restaurant kept earning while you were gone</div><div class="big">+$'+fmt(amt)+'</div><button class="gb" data-a="ok">Collect</button>',()=>gmClose(),true));}
 if(SV.dl!==dayKey())GM.q.push(dailyOpen);
 setTimeout(()=>{if(!GM.open&&GM.q.length)GM.q.shift()();},900);}
/* ---- settings ---- */
function setOpen(){gmo('SETTINGS','','<div class="rw"><div class="t" style="flex:1">Sound</div><div style="width:80px"><button class="gb sm" data-a="snd">'+(SV.snd===0?'OFF':'ON')+'</button></div></div><div class="rw"><div class="t" style="flex:1">Reset all progress</div><div style="width:80px"><button class="gb sm red" data-a="rst">Reset</button></div></div>',(a,b)=>{
 if(a==='snd'){SV.snd=SV.snd===0?1:0;save();beep(660,.08,.05);setOpen();}
 else if(a==='rst'){if(!b._c){b._c=1;b.textContent='Sure?';return;}window.__wipe=1;try{[KEY,BAK,CKEY].concat(OLDKEYS).forEach(k=>localStorage.removeItem(k));}catch(e){}location.reload();}});}
const clock=new THREE.Clock();let tA=0,spawnT=1.5,TM=0;
function update(dt){
 const p=player.position;TM+=dt;GT+=dt;extras(dt,p);QL.visible=CT.on;qUpd();cirUpd();
 if(cash!==lastC||pile!==lastP){lastC=cash;lastP=pile;dirty=true;}saveT+=dt;if(dirty&&saveT>.25){dirty=false;saveT=0;save();}
 let ix=jv.x+K.right-K.left,iy=jv.y+K.down-K.up;const il=Math.hypot(ix,iy);if(il>1){ix/=il;iy/=il;}if(il<.12)ix=iy=0;
 const wx=.7071*(ix+iy),wz=.7071*(iy-ix),SPD=PS(),k=1-Math.exp(-dt*14),ox=p.x,oz=p.z;
 vel.x+=(wx*SPD-vel.x)*k;vel.z+=(wz*SPD-vel.z)*k;
 if(!traveling){const nx=p.x+vel.x*dt;if(walk(nx,p.z))p.x=nx;else vel.x=0;const nz=p.z+vel.z*dt;if(walk(p.x,nz))p.z=nz;else vel.z=0;
  for(let it=0;it<2;it++)for(const s of solids){const dx=p.x-s.x,dz=p.z-s.z,ox2=s.hw+.45-Math.abs(dx),oz2=s.hd+.45-Math.abs(dz);if(ox2>0&&oz2>0){if(ox2<oz2)p.x+=Math.sign(dx||1)*ox2;else p.z+=Math.sign(dz||1)*oz2;}}
  if(!walk(p.x,p.z)){p.x=ox;p.z=oz;}}
 const spd=Math.hypot(vel.x,vel.z);
 if(spd>.4){const a=Math.atan2(vel.x,vel.z);let d=((a-body.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;body.rotation.y+=d*Math.min(1,dt*14);}
 walkP+=spd*dt*2.4;const sw=Math.min(1,spd/3)*.8;legL.rotation.x=Math.sin(walkP)*sw;legR.rotation.x=-Math.sin(walkP)*sw;
 const ar=carry.length?-1.5:0;armL.rotation.x=ar+(carry.length?0:-Math.sin(walkP)*sw);armR.rotation.x=ar+(carry.length?0:Math.sin(walkP)*sw);
 body.position.y=Math.abs(Math.sin(walkP))*.08*Math.min(1,spd/3);carryG.rotation.z=Math.sin(walkP*.5)*.03*Math.min(1,spd/3);
 // production: grill and (once built) cold drink bar
 if(G0.on&&G0.stock<MCAP('g')){G0.t+=dt;if(G0.t>=GI()){G0.t=0;G0.stock++;st(G0.sg,G0.stock,'b');}}else G0.t=0;
 cookAnim(G0); // visual only: stage animation + progress bar driven by G0.t / GI()
 if(S.drink){const D=S.drink;if(D.stock<MCAP('d')){D.t+=dt;if(D.t>=DIV()){D.t=0;D.stock++;st(D.sg,D.stock,'d');}}else D.t=0;}
 if(S.side){const D=S.side;if(D.stock<8){D.t+=dt;if(D.t>=4){D.t=0;D.stock++;st(D.sg,D.stock,'s');}}else D.t=0;} // side item: 1 every 4s, stock up to 8
 // station interactions (every .11s, one action per tick)
 tA+=dt;if(tA>.11){tA=0;let ch=false;const cap=CAP(),D=S.drink;
  if(G0.on&&carry.length<cap&&G0.stock>0&&dist(p.x,p.z,G0.px,G0.pz)<1.7){carry.push('b');G0.stock--;st(G0.sg,G0.stock,'b');flyItem('b',spos.g(),hdp(p),.25);ch=true;beep(520+carry.length*40,.05,.03);$('hint').style.opacity=0;}
  else if(D&&carry.length<cap&&D.stock>0&&dist(p.x,p.z,D.px,D.pz)<1.7){carry.push('d');D.stock--;st(D.sg,D.stock,'d');flyItem('d',spos.d(),hdp(p),.25);ch=true;beep(660,.05,.03);}
  else if(S.side&&carry.length<cap&&S.side.stock>0&&dist(p.x,p.z,S.side.px,S.side.pz)<1.7){carry.push('s');S.side.stock--;st(S.side.sg,S.side.stock,'s');flyItem('s',{x:S.side.x,y:1.2,z:S.side.pz},hdp(p),.25);ch=true;beep(560,.05,.03);}
  else if(CT.on&&carry.includes('b')&&CT.shelf<8&&dist(p.x,p.z,CT.x,CT.z)<3.4){take(carry,'b');CT.shelf++;st(CT.sg,CT.shelf,'b');flyItem('b',hdp(p),spos.cb(),.28);ch=true;beep(400,.05,.03);}
  else if(CT.on&&carry.includes('d')&&CT.dk<6&&dist(p.x,p.z,CT.x,CT.z)<3.4){take(carry,'d');CT.dk++;st(CT.dg,CT.dk,'d');flyItem('d',hdp(p),spos.cd(),.28);ch=true;beep(430,.05,.03);}
  else if(CT.on&&carry.includes('s')&&CT.sk<6&&dist(p.x,p.z,CT.x,CT.z)<3.4){take(carry,'s');CT.sk++;st(CT.sgk,CT.sk,'s');flyItem('s',hdp(p),{x:CT.x-.2,y:1.4,z:CT.z+.6},.28);ch=true;beep(450,.05,.03);}
  else if(S.pack&&carry.includes('b')&&S.pack.inb<MCAP('p')&&dist(p.x,p.z,S.pack.px,S.pack.pz)<2.4){take(carry,'b');S.pack.inb++;refreshPack();flyItem('b',hdp(p),spos.pi(),.28);ch=true;beep(420,.05,.03);}
  else if(S.pack&&carry.includes('s')&&S.pack.sin<4&&dist(p.x,p.z,S.pack.px,S.pack.pz)<2.4){take(carry,'s');S.pack.sin++;refreshPack();flyItem('s',hdp(p),{x:S.pack.x,y:1.4,z:S.pack.z+.5},.28);ch=true;beep(430,.05,.03);} // side item goes into the packing station -> next boxes contain it
  else if(S.pack&&carry.length<cap&&S.pack.out>0&&dist(p.x,p.z,S.pack.px,S.pack.pz)<2){{const ks=S.pack.oS>0;carry.push(ks?'K':'k');if(ks)S.pack.oS--;S.pack.out--;refreshPack();flyItem(ks?'K':'k',spos.po(),hdp(p),.25);}ch=true;beep(600,.05,.03);}
  else if(S.win&&(carry.includes('k')||carry.includes('K'))&&dist(p.x,p.z,S.win.px,S.win.pz)<2.6){const kt=carry.includes('K')?'K':'k';take(carry,kt);S.win.stock.k++;if(kt==='K')S.win.stock.ks++;winShow();flyItem(kt,hdp(p),spos.w(),.28);ch=true;beep(450,.05,.03);}
  else if(carry.length<cap&&dirtyAt(p)){takeWaste(dirtyAt(p),p);carry.push('w');ch=true;}
  else if(carry.includes('w')&&dist(p.x,p.z,trash.x,trash.z)<2.2){take(carry,'w');ch=true;trash.lid.position.y=1.38;tossWaste(p,2.9);addXP(8);mis('clean');}
  else if(carry.length&&dist(p.x,p.z,trash.x,trash.z)<1.7){const tt=carry.pop();flyItem(tt,hdp(p),spos.tr(),.3,1.5);ch=true;trash.lid.position.y=1.3;burst(trash.x,1.3,trash.z,[0xced4da,0x9aa0a6],7,1.6,3,.7);beep(180,.06,.04);}
  if(ch)syncCarry();}
 trash.lid.position.y+=(1.06-trash.lid.position.y)*Math.min(1,dt*10);
 // packing only happens while someone stands at the station
 if(S.pack){const pk=S.pack,here=dist(p.x,p.z,pk.px,pk.pz)<2.4||workers.some(w=>w.role==='P'&&dist(w.g.position.x,w.g.position.z,pk.px,pk.pz)<2.4),iv=PIV();
  if(here&&pk.inb>0&&pk.out<MCAP('p')){pk.prog+=dt;if(pk.prog>=iv){pk.prog=0;pk.inb--;pk.out++;if(pk.sin>0){pk.sin--;pk.oS++;}refreshPack();beep(700,.05,.03);}}else if(!here)pk.prog=Math.max(0,pk.prog-dt);
  pk.bar.scale.x=Math.max(.001,pk.prog/iv);packAnim(pk,Math.min(1,pk.prog/iv));}
 if(pile>=1&&dist(p.x,p.z,cashPad.x,cashPad.z)<1.7){const c=Math.floor(pile);pile-=c;earn(c);flyCash(new THREE.Vector3(cashPad.x,.8,cashPad.z),Math.min(14,3+Math.ceil(c/(PRICE*1.2))));burst(cashPad.x,.6,cashPad.z,[0xffd23f,0x7CFC9A,0xffffff],16,2.8,4.2,.8);popText(new THREE.Vector3(cashPad.x,2,cashPad.z),'+$'+fmt(c),'#ffd23f');refreshPile();beep(880,.1,.05);beep(1180,.12,.04);}
 careAll(dt);
 let nr=null,nrd=.85;pads.forEach(q=>{const d=Math.hypot(p.x-q.x,(p.z-q.z)*.63)/(q.big?1.5:1);if(d<nrd&&(q.cost<=0||q.paid<q.cost)){nrd=d;nr=q;}});
 for(let i=pads.length-1;i>=0;i--){const q=pads[i],free=q.cost<=0;
  if(free){q.dw=q===nr?q.dw+dt:0;}else if(q===nr&&cash>=.01){const a=Math.min(cash,q.cost/1.2*dt,q.cost-q.paid);cash-=a;q.paid+=a;hud();}
  const f=Math.max(.001,free?q.dw/.7:q.paid/q.cost);q.f.scale.set(f,1,1);drawPad(q);
  if(free?q.dw>=.7:q.paid>=q.cost-.001){pads.splice(i,1);scene.remove(q.g);complete(q);}}
 // doors: walk through to travel between hotels (the NEXT HOTEL door opens the city map)
 if(CM.cd>0)CM.cd-=dt;
 for(const kd of ['next','prev']){const o=doors[kd];if(!o)continue;const d=o.d,e=d.a==='E';
  if((e?p.x>d.x+.4:p.x<d.x-.4)&&Math.abs(p.z-d.z)<1){if(kd==='next'&&o.open&&BI<NB-1){if(CM.cd<=0)cmOpen(o);}else if(kd==='prev')travel(BI-1,'next');}}
 spawnT+=dt;if(spawnT>=Math.max(1.8,4.2-step()*.2)/(EV.k==='rush'?2:1)){spawnT=0;spawnCust();}
 updCounter(dt);for(let i=custs.length-1;i>=0;i--){updCust(custs[i],dt);if(custs[i].dead)custs.splice(i,1);}
 carsUpd(dt);workers.forEach(w=>{updWorker(w,dt);animStack(w.cg,w.vx||0,w.vz||0,TM,dt);});
 animStack(carryG,vel.x,vel.z,TM,dt);updParts(dt);updFx(dt);showCash(dt);
 for(let i=pops.length-1;i>=0;i--){const q=pops[i];q.t+=dt;if(q.t<=0)continue;const kk=Math.min(q.t/.4,1),c3=2.70158,e=1+c3*Math.pow(kk-1,3)+1.70158*Math.pow(kk-1,2);q.o.scale.setScalar(Math.max(.001,e));if(kk>=1){q.o.scale.setScalar(1);pops.splice(i,1);}}
 const ck=1-Math.exp(-dt*6);camT.x+=(p.x-camT.x)*ck;camT.z+=(p.z-camT.z)*ck;goalTick(dt);cam.position.copy(camT).add(camOff);cam.lookAt(camT);}
function loop(){requestAnimationFrame(loop);if(UP.open||CM.open||GM.open)clock.getDelta();else update(Math.min(clock.getDelta(),.05));renderer.render(scene,cam);badgeTick();}

/* ================= boot ================= */
ecoReport();ensure(false);refreshPads();refreshPile();refreshDoors();syncCarry();hud();lvHud();showCash(9);save();
camT.set(player.position.x,0,player.position.z);cam.position.copy(camT).add(camOff);cam.lookAt(camT);cam.updateMatrixWorld();
if(step()>0)$('hint').style.opacity=0;
setTimeout(()=>{$('hint').style.opacity=0;},12000);
setTimeout(()=>{$('fade').style.opacity=0;},80);
loop();bootPopups();
})();
