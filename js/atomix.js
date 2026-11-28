/* Atomix (beta): one monster for every element. Get any mutation on an element to unlock its Atomix and view it.
   Abilities come from the element's family on the periodic table, plus a signature move from its name. Viewing only for now. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const G=()=>window.PRGame;

/* ---------- families ---------- */
const FAM={
  alk:{t:'Alkali metal',c:'#F2711C',hp:46,atk:88,def:30,spd:84,
    ab:['Water Burst','Touches water and explodes. Its blasts hit harder against water-type foes.'],
    ab2:['Lone Electron','Gives its single outer electron to an ally, boosting their next hit.'],
    fl:'Soft enough to cut with a knife, and far too eager to react.'},
  ae:{t:'Alkaline earth',c:'#C99A4B',hp:66,atk:58,def:72,spd:52,
    ab:['Bedrock Shell','Hardens into mineral armor, raising defense every turn it stays still.'],
    ab2:['Double Charge','Gives up two electrons at once for a heavy two-hit strike.'],
    fl:'Born in rocks, bones and shells. Steady and hard to knock down.'},
  tm:{t:'Transition metal',c:'#4F7CAC',hp:70,atk:68,def:80,spd:46,
    ab:['Forge Armor','Plates itself in polished metal, cutting damage taken.'],
    ab2:['Shifting Charge','Switches its charge between turns, changing its weakness each time.'],
    fl:'A forged warrior from the middle of the table. Strong, shiny and stubborn.'},
  pt:{t:'Post-transition metal',c:'#8C7FA8',hp:62,atk:56,def:60,spd:50,
    ab:['Soft Metal','Bends instead of breaking, so heavy hits only do half damage.'],
    ab2:['Low Melt','Melts into a puddle to dodge, then reforms.'],
    fl:'Softer than its metal cousins, and much harder to pin down.'},
  md:{t:'Metalloid',c:'#1FA39A',hp:58,atk:60,def:62,spd:60,
    ab:['Semiconductor','Half metal, half not: switches between the two to counter any foe.'],
    ab2:['Signal Boost','Amplifies an ally’s weak move into a strong one.'],
    fl:'Stuck between two worlds, so it learned the tricks of both.'},
  nm:{t:'Reactive nonmetal',c:'#3FAE4F',hp:64,atk:54,def:48,spd:66,
    ab:['Covalent Link','Shares electrons with an ally and both heal a little.'],
    ab2:['Life Spark','Built from the stuff of life; recovers HP over time.'],
    fl:'One of the building blocks of everything alive.'},
  hal:{t:'Halogen',c:'#B8C21A',hp:50,atk:84,def:40,spd:76,
    ab:['Salt Maker','Steals an electron from the foe, turning their armor to salt.'],
    ab2:['Corrode','Its touch eats through metal, lowering defense.'],
    fl:'A salt-maker. One electron short, and it will take yours.'},
  ng:{t:'Noble gas',c:'#9B6BFF',hp:60,atk:40,def:76,spd:70,
    ab:['Full Shell','Its outer shell is complete, so it ignores status effects.'],
    ab2:['Neon Glow','Lights up under electricity, blinding foes.'],
    fl:'Calm, complete, and almost impossible to provoke.'},
  lan:{t:'Lanthanide',c:'#E2559E',hp:62,atk:64,def:58,spd:58,
    ab:['Rare Earth Magnet','Pulls metal foes in and pins them for a turn.'],
    ab2:['Phosphor Glow','Glows in bright colors that confuse the foe.'],
    fl:'A rare earth. Hidden in minerals, hiding in every phone screen.'},
  act:{t:'Actinide',c:'#7CCB2B',hp:68,atk:80,def:54,spd:46,
    ab:['Radioactive Decay','Every turn its radiation hurts all foes a little.'],
    ab2:['Half-life','Loses power over time, but starts extremely strong.'],
    fl:'Heavy, glowing and unstable. Handle with tongs.'}
};
const famOf=z=>{
  if([3,11,19,37,55,87].includes(z)) return 'alk';
  if([4,12,20,38,56,88].includes(z)) return 'ae';
  if([9,17,35,53,85,117].includes(z)) return 'hal';
  if([2,10,18,36,54,86,118].includes(z)) return 'ng';
  if([5,14,32,33,51,52].includes(z)) return 'md';
  if([1,6,7,8,15,16,34].includes(z)) return 'nm';
  if(z>=57&&z<=71) return 'lan';
  if(z>=89&&z<=103) return 'act';
  if([13,31,49,50,81,82,83,84,113,114,115,116].includes(z)) return 'pt';
  return 'tm';
};
const SYNTH=['Synthetic','Made one atom at a time in a lab and gone in a flash: huge first strike, then it fades.'];

/* ---------- names and signature moves (from each element's name and story) ---------- */
const SIG=('Hydrax|Fusion Flare|Fuses with itself into helium and blasts starlight.\n'
+'Heliope|Float Away|Rises out of reach and squeaks foes into confusion.\n'
+'Lithix|Battery Dump|Stores charge like a battery and releases it all at once.\n'
+'Berylla|Emerald Guard|Grows a beryl gem shield that lets X-rays straight through.\n'
+'Borax|Boron Fiber|Fires stiff fibers stronger than steel.\n'
+'Carbyte|Diamond Form|Crushes its own body into diamond armor.\n'
+'Nitrax|Cold Air|Floods the field with liquid nitrogen fog that freezes speed.\n'
+'Oxyra|Feed the Flame|Every fire move on the field burns twice as hot.\n'
+'Fluorix|Etch|The most reactive bite of all; dissolves even glass.\n'
+'Neolux|Neon Sign|Glows red-orange and dazzles every foe.\n'
+'Sodion|Salt Splash|Drops into water and goes off like a firework.\n'
+'Magnix|White Flash|Burns with a blinding white flame.\n'
+'Alumina|Foil Wrap|Wraps foes in light, rust-proof foil.\n'
+'Silicor|Chip Mind|Computes the foe’s next move before it happens.\n'
+'Phosphor|Glow Light|Name means light-bringer; glows in the dark and bursts into flame.\n'
+'Sulfura|Brimstone|Belches stinking yellow smoke that lowers attack.\n'
+'Chlorax|Bleach Wave|Disinfects the field and washes away foe buffs.\n'
+'Argona|Idle Shield|Name means the lazy one; wraps allies so nothing reacts with them.\n'
+'Potassor|Banana Boost|Heals itself with potassium, then bursts purple in water.\n'
+'Calcix|Bone Wall|Raises a wall of bone and chalk.\n'
+'Scandia|Light Alloy|Makes allied metals lighter and faster.\n'
+'Titanox|Titan Frame|Light as a feather, almost impossible to break.\n'
+'Vanadis|Spring Steel|Named after the goddess Vanadis; springs back from every hit.\n'
+'Chromia|Chrome Mirror|A polished shine that reflects attacks.\n'
+'Mangar|Hardening|Toughens every allied metal.\n'
+'Ferrok|Iron Will|Cannot be knocked back, and rusts whatever hits it.\n'
+'Cobalto|Goblin Blue|Named after mine goblins; stains the field deep blue.\n'
+'Nickelo|Coin Flip|Flips a coin: double damage or nothing.\n'
+'Cuprix|Live Wire|Conducts lightning to every foe at once.\n'
+'Zincor|Galvanize|Coats allies in zinc so rust cannot touch them.\n'
+'Gallix|Melt in Hand|Melts at body heat and slips past attacks.\n'
+'Germax|Transistor|Turns a whisper of energy into a roar.\n'
+'Arsenox|Poison Dart|The old poisoner’s strike.\n'
+'Selena|Moonlight|Named after the Moon; grows stronger in the light.\n'
+'Bromux|Stench Fume|Name means stench; floods the field with red-brown fumes.\n'
+'Kryptos|Hidden One|Name means hidden; turns invisible for a turn.\n'
+'Rubidex|Ruby Flame|Burns red-violet and erupts in water.\n'
+'Strontix|Crimson Firework|Paints the sky red with fireworks.\n'
+'Yttra|Ytterby Call|Summons help from its village: three cousins share its name.\n'
+'Zircon|False Diamond|Sparkles like a diamond to bait foes.\n'
+'Niobra|Superconductor|Loses all resistance when frozen, then strikes at full power.\n'
+'Molybda|Armor Pierce|Makes steel hard enough to punch through armor.\n'
+'Technix|Made by Hand|The first made-by-hand element; copies the foe’s move.\n'
+'Ruthena|Catalyst|Speeds up every ally’s reaction.\n'
+'Rhodia|Rose Shine|Name means rose; the rarest shine reflects light.\n'
+'Palladox|Hydrogen Sponge|Soaks up hydrogen to heal.\n'
+'Silvex|Silver Bullet|A germ-killing strike that beats any monster.\n'
+'Cadmor|Yellow Paint|Splashes toxic yellow pigment.\n'
+'Indra|Indigo Cry|Glows indigo and screams when bent.\n'
+'Stannor|Tin Army|Summons a squad of tin soldiers.\n'
+'Antimon|Kohl Mark|Ancient eyeliner that marks its target.\n'
+'Tellura|Earth Bond|Name means Earth; draws power from the ground.\n'
+'Iodex|Violet Cloud|Name means violet; turns to purple vapor and heals wounds.\n'
+'Xenor|Stranger Drive|Name means stranger; ion-thruster dash.\n'
+'Caesor|Atomic Clock|Keeps perfect time, so it always moves first.\n'
+'Barion|Heavy Barrier|Name means heavy; a green-flamed wall.\n'
+'Lanthos|Lying Hidden|Name means to lie hidden; ambush strike.\n'
+'Ceria|Flint Spark|Strikes sparks like a lighter flint.\n'
+'Praseo|Green Twin|Name means green twin; a green glass shield.\n'
+'Neodym|Super Magnet|The strongest magnet pull there is.\n'
+'Promethos|Stolen Fire|Named after Prometheus; steals the foe’s fire.\n'
+'Samara|Cold Magnet|A magnet that works even when frozen.\n'
+'Europa|Banknote Glow|Glows red to spot fakes and illusions.\n'
+'Gadolin|Scan|Lights up the foe’s weak spots, like a scan.\n'
+'Terbix|Green Phosphor|Bright green glow that dazzles.\n'
+'Dyspros|Hard to Get|Name means hard to get; dodges almost anything.\n'
+'Holmix|Peak Field|The strongest magnetic field of any atom.\n'
+'Erbia|Pink Laser|A fiber-optic laser beam.\n'
+'Thulix|Far North|Named after mythical Thule; freezing gale.\n'
+'Ytterbix|Pressure Gauge|Senses earthquakes before they hit.\n'
+'Lutex|Last Lantern|Named after Paris; closes the lanthanide line.\n'
+'Hafnix|Neutron Trap|Swallows radiation attacks whole.\n'
+'Tantalor|Tantalus Curse|Named after Tantalus; acid can never touch it.\n'
+'Wolfrax|Wolf Stone|Highest melting point of all; immune to fire.\n'
+'Rhenix|Jet Blade|Turbine blades that never melt.\n'
+'Osmor|Dense Slam|Name means smell; the densest body slam.\n'
+'Iridia|Rainbow|Name means rainbow; colorful burst from a fallen asteroid.\n'
+'Platinor|Little Silver|Name means little silver; never tarnishes.\n'
+'Aurix|Golden Touch|Never rusts, and turns hits into gold.\n'
+'Mercurio|Quicksilver|Liquid metal; named after the swift messenger.\n'
+'Thallox|Green Twig|Name means green shoot; a quiet poison.\n'
+'Plumbor|Lead Wall|Blocks every ray and beam.\n'
+'Bismora|Rainbow Stairs|Grows staircase crystals in rainbow colors.\n'
+'Polonix|Alpha Strike|Named after Poland; fierce radiation burst.\n'
+'Astatos|Unstable|Name means unstable; the rarest natural element.\n'
+'Radonix|Ghost Seep|Seeps through floors and walls.\n'
+'Frenchium|Baguette Barrage|Hurls a volley of hot baguettes. Named after France.\n'
+'Radior|Glow Paint|Glows green like old watch dials.\n'
+'Actinos|Ray Beam|Name means ray; a beam of blue light.\n'
+'Thorix|Thunder Hammer|Named after Thor; brings down a thunder hammer.\n'
+'Protax|Parent Decay|Decays into actinium, summoning it as an ally.\n'
+'Uranox|Fission|Splits atoms for massive damage.\n'
+'Neptor|Next Planet|Named after Neptune; deep cold pressure.\n'
+'Plutor|Core Power|Powers space probes for decades; never runs out.\n'
+'Libertalon|Freedom Blast|Screams and fires a red, white and blue beam full of stars. Named after the Americas.\n'
+'Curix|Curie Glow|Named after Marie and Pierre Curie; pulses with heat.\n'
+'Berkel|Lab Shield|Named after Berkeley; summons lab walls.\n'
+'Californ|Gold Rush|Named after California; fires a neutron stream.\n'
+'Einstix|E = mc²|Turns its own mass into pure energy.\n'
+'Fermion|Chain Reaction|Each hit triggers another hit.\n'
+'Mendel|Table Maker|Named after Mendeleev; rearranges the battlefield.\n'
+'Nobelix|Prize Winner|Named after Alfred Nobel; explosive award.\n'
+'Lawrenx|Cyclotron|Spins faster and faster, gaining speed each turn.\n'
+'Rutherfix|Gold Foil|Bounces attacks back like alpha particles off gold.\n'
+'Dubnor|Dubna Twin|Named after Dubna; strikes twice.\n'
+'Seaborgian|Tidal Coil|Wraps the foe in serpent coils and drags them under the waves.\n'
+'Bohrix|Electron Orbit|Circles foes in shells like electrons.\n'
+'Hassor|Hesse Fortress|Named after Hesse; a castle-strong wall.\n'
+'Meitner|Fission Insight|Named after Lise Meitner; splits one attack into two.\n'
+'Darmstix|Darmstadt Spark|Named after Darmstadt; a flash of pure energy.\n'
+'Roentgen|X-Ray Eyes|Named after Röntgen; sees straight through armor.\n'
+'Copernix|Sun at the Center|Named after Copernicus; everything orbits it.\n'
+'Nihonix|Rising Sun|Named after Japan; a dawn burst of light.\n'
+'Flerovix|Island of Stability|Briefly becomes stable and shrugs off damage.\n'
+'Moscovix|Moscow Frost|Named after Moscow; winter wind.\n'
+'Livermor|Livermore Lab|Named after Livermore; heavy science strike.\n'
+'Tennessix|Tennessee Storm|The heaviest halogen; a thunderstorm of salt.\n'
+'Oganix|Final Shell|The last and heaviest element; the end of the table.').split('\n').map(l=>l.split('|'));

/* ---------- custom designs: Seaborgium, Francium, Americium ---------- */
const CUSTOM={106:'serpent',87:'french',95:'eagle'};
const EXTRA={
  106:{t:'Sea serpent',special:'Abyss Surge',ab:[['Abyss Surge','Summons a tidal wave from the deep. Stronger the longer the battle runs.'],['Scale Plating','Transition-metal scales: takes less damage from every physical hit.']],fl:'Sea-borg, the serpent of the deep. It coils in the trenches where no light reaches, and its metal scales never rust.',st:[90,82,78,64]},
  87:{t:'French alkali',special:'Baguette Barrage',ab:[['Baguette Barrage','Hurls a volley of fresh baguettes. Crumbs everywhere.'],['Splash de Paris','The most reactive alkali of all: hits water and explodes like fireworks over the Seine.'],['Fresh from the Oven','Eats a baguette to heal, then throws the crust.']],fl:'Francium, the element named after France. It lasts only 22 minutes before it decays, so it lives fast: beret on, baguettes ready.',st:[40,96,26,98]},
  95:{t:'Bald eagle',special:'Freedom Blast',ab:[['Freedom Blast','Its main move: a screaming red, white and blue beam that bursts into stars.'],['Eagle Eye','Spots every hidden attack from miles away, like the smoke alarms Americium powers.'],['Star-Spangled Wings','Shields allies under its stars-and-stripes wings.']],fl:'Americium, named after the Americas. A bald eagle in stars and stripes that soars over the battlefield and never backs down.',st:[72,94,62,90]}
};
const MUT_ORDER=[13,10,9,12,8,7,11,6,4,3,5,2,1];
const MUT_COL={1:'#5B8CFF',2:'#FFB547',3:'#FF6A3D',4:'#FFD76A',5:'#8F86FF',6:'#3FD9D2',7:'#B48CFF',8:'#FF6AD5',9:'#FF5C9A',10:'#FFFFFF',11:'#5CC8FF',12:'#FF2E2E',13:'#FFE98A'};
const mname=m=>m===6?'Rift':G().MUTN[m];

/* ---------- unlock state: a mutation on that element, or an Atomix the owner gave ---------- */
function given(z){ const g=G(); const a=g&&g.S&&g.S.atx&&g.S.atx[z]; return Array.isArray(a)?a:[]; }
function mutsOn(z){ const g=G(); if(!g) return []; const out=[]; for(const m of MUT_ORDER){ const mp=g.mutMap(m); if(mp&&mp[z]) out.push([m,mp[z]]); } return out; }
const unlocked=z=>mutsOn(z).length>0||given(z).length>0;
function formsOf(z){ const f=[0]; const have=new Set(mutsOn(z).map(x=>x[0]).concat(given(z))); for(const m of [1,2,3,4,5,6,11,7,8,12,9,10,13]) if(have.has(m)) f.push(m); return f; }
function infoOf(z){ const g=G(), f=famOf(z); return {fam:f,famColor:FAM[f].c,sym:g.SYM[z-1],name:g.NAME[z-1],custom:CUSTOM[z]||null,special:(EXTRA[z]&&EXTRA[z].special)||SIG[z-1][1]}; }
function statsOf(z){
  if(EXTRA[z]) return EXTRA[z].st;
  const F=FAM[famOf(z)]; let s=z*31+7; const R=()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; const w=z/118;
  const v=(b,k)=>Math.max(8,Math.min(99,Math.round(b+(R()-.5)*16+k)));
  return [v(F.hp,w*22),v(F.atk,w*8),v(F.def,w*14),v(F.spd,-w*14)];
}

/* ---------- 3D (loaded only when the Atomix panel opens) ---------- */
let X3=null, x3p=null, viewer=null, thumbs={}, thumbQ=[], thumbBusy=false, glOK=true;
function load3d(){ if(!x3p) x3p=import('./atomix3d.mjs').then(m=>{ X3=m; return m; }).catch(e=>{ glOK=false; console.error(e); throw e; }); return x3p; }
function pumpThumbs(){
  if(thumbBusy||!X3||!thumbQ.length) return; thumbBusy=true;
  const step=()=>{ const z=thumbQ.shift(); if(z==null){ thumbBusy=false; return; }
    if(!thumbs[z]){ try{ thumbs[z]=X3.thumb(z,infoOf(z),0); const im=document.querySelector('.ax[data-z="'+z+'"] img'); if(im){ im.src=thumbs[z]; im.classList.add('on'); } }catch(e){ glOK=false; thumbQ=[]; thumbBusy=false; return; } }
    (window.requestIdleCallback||((f)=>setTimeout(f,16)))(step); };
  step();
}

/* ---------- UI ---------- */
let sel=0, filt='all', form=0, ult=false;
function grid(){
  const g=G(); if(!g) return; let h='', n=0; thumbQ=[];
  for(let z=1;z<=118;z++){ const u=unlocked(z); if(u) n++; if(filt==='got'&&!u) continue;
    h+='<button type="button" class="ax'+(u?'':' lock')+(sel===z?' sel':'')+(CUSTOM[z]?' star':'')+'" data-z="'+z+'"'+(u?'':' aria-disabled="true"')+' aria-label="'+(u?SIG[z-1][0]+', '+g.NAME[z-1]:'Locked: '+g.NAME[z-1])+'" style="--gc:'+FAM[famOf(z)].c+'">'
      +'<span class="axz">'+z+'</span>'+(u?'<img alt="" class="'+(thumbs[z]?'on':'')+'" src="'+(thumbs[z]||'data:image/gif;base64,R0lGODlhAQABAAAAACw=')+'"><span class="axs">'+g.SYM[z-1]+'</span>':'<span class="axq">?</span><span class="axs">'+g.SYM[z-1]+'</span>')
      +'<span class="axn">'+(u?SIG[z-1][0]:g.NAME[z-1])+'</span></button>';
    if(u&&!thumbs[z]) thumbQ.push(z);
  }
  $('atxGrid').innerHTML=h||'<p class="atx-empty">No Atomix unlocked yet. Get a mutation on any element to unlock its Atomix.</p>';
  $('atxCount').textContent=n+' / 118 unlocked';
  if(thumbQ.length) load3d().then(pumpThumbs,()=>{});
}
const KEYS={attack:'Z',block:'X',special:'F',ult:'E'};
function view(z){
  const g=G(), box=$('atxView');
  if(viewer){ viewer.dispose(); viewer=null; }
  if(!z){ box.innerHTML='<p class="atx-empty">'+(document.querySelector('.ax:not(.lock)')?'Select an unlocked Atomix to view it in 3D.':'Every Atomix is locked for now. Any mutation on an element unlocks its Atomix. The starred ones (Francium, Americium, Seaborgium) have special designs.')+'</p>'; return; }
  const f=famOf(z), F=FAM[f], Xt=EXTRA[z], st=statsOf(z), ms=mutsOn(z), fs=formsOf(z), inf=infoOf(z);
  if(fs.indexOf(form)<0) form=0;
  const abs=[[SIG[z-1][1],SIG[z-1][2],'Signature']].concat(Xt?Xt.ab.filter(a=>a[0]!==SIG[z-1][1]).map(a=>[a[0],a[1],'Special']):[]).concat([[F.ab[0],F.ab[1],F.t],[F.ab2[0],F.ab2[1],F.t]]);
  if(z>=104) abs.push([SYNTH[0],SYNTH[1],'Superheavy']);
  const L=['HP','ATK','DEF','SPD'];
  box.innerHTML='<div class="atx-stage" style="--gc:'+F.c+'"><div class="atx-3d" id="atx3d"><p class="atx-load">Loading 3D…</p></div>'
   +'<div class="atx-toast" id="atxToast" aria-live="polite"></div>'
   +'<div class="atx-forms" role="group" aria-label="View in a mutation">'+fs.map(m=>'<button type="button" class="af'+(m===form?' on':'')+'" data-m="'+m+'" style="--mc:'+(MUT_COL[m]||F.c)+'">'+(m?mname(m):'Normal')+'</button>').join('')+'</div>'
   +'<div class="atx-moves" role="group" aria-label="Moves">'
     +'<button type="button" class="mv" data-a="attack"><b>Attack</b><kbd>Z</kbd></button>'
     +'<button type="button" class="mv" data-a="block"><b>Block</b><kbd>X</kbd></button>'
     +'<button type="button" class="mv mvs" data-a="special"><b>'+inf.special+'</b><kbd>F</kbd></button>'
     +'<button type="button" class="mv ul'+(ult?' on':'')+'" data-a="ult" aria-pressed="'+ult+'"><b>Ultimate</b><kbd>E</kbd></button>'
   +'</div><p class="atx-hint">Drag to spin · scroll or pinch to zoom</p></div>'
   +'<div class="atx-h"><h3>'+SIG[z-1][0]+'</h3><span class="sym">'+z+' · '+g.SYM[z-1]+' · '+g.NAME[z-1]+'</span></div>'
   +'<span class="atx-type" style="--gc:'+F.c+'">'+(Xt?Xt.t+' · ':'')+F.t+'</span>'
   +'<p class="atx-flavor">'+(Xt?Xt.fl:F.fl)+'</p>'
   +'<div class="atx-stats" style="--gc:'+F.c+'">'+st.map((v,i)=>'<div><span>'+L[i]+'</span><i><b style="width:'+v+'%"></b></i><span>'+v+'</span></div>').join('')+'</div>'
   +'<ul class="atx-ab">'+abs.map(a=>'<li><small>'+a[2]+'</small><b>'+a[0]+'</b>'+a[1]+'</li>').join('')+'</ul>'
   +'<div class="atx-muts">'+ms.map(m=>'<span style="border-color:'+MUT_COL[m[0]]+'">'+mname(m[0])+' ×'+m[1]+'</span>').join('')+(given(z).length?'<span class="gift">Gift from the owner</span>':'')+'</div>';
  load3d().then(M=>{ if(sel!==z) return; const host=$('atx3d'); host.innerHTML=''; try{ viewer=M.createViewer(host); viewer.show(z,inf,form,ult); }catch(e){ console.error(e); host.innerHTML='<p class="atx-load">3D is not available on this device.</p>'; } },()=>{ const h=$('atx3d'); if(h) h.innerHTML='<p class="atx-load">Could not load 3D.</p>'; });
}
let toastT=null;
function toast(t){ const el=$('atxToast'); if(!el||!t) return; el.textContent=t; el.classList.remove('go'); void el.offsetWidth; el.classList.add('go'); clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove('go'),1400); }
function doMove(a){
  if(!viewer) return; const lbl=viewer.act(a);
  const b=document.querySelector('.mv[data-a="'+a+'"]'); if(b){ b.classList.remove('hit'); void b.offsetWidth; b.classList.add('hit'); }
  if(a==='ult'){ ult=viewer.isUlt(); const u=document.querySelector('.mv.ul'); if(u){ u.classList.toggle('on',ult); u.setAttribute('aria-pressed',String(ult)); } }
  toast(lbl);
}
function open(o){
  const pn=$('atxPanel'), b=$('atxBtn'); pn.hidden=!o; b.setAttribute('aria-expanded',String(o));
  if(o){ if(sel&&!unlocked(sel)) sel=0; grid(); view(sel); }
  else if(viewer){ viewer.dispose(); viewer=null; }
}
function init(){
  const pn=$('atxPanel'); if(!pn) return;
  $('atxBtn').addEventListener('click',()=>open(pn.hidden));
  $('atxClose').addEventListener('click',()=>open(false));
  pn.addEventListener('click',e=>{ if(e.target===pn) open(false); });
  document.addEventListener('keydown',e=>{
    if(pn.hidden) return;
    if(e.key==='Escape'){ open(false); return; }
    const t=document.activeElement&&document.activeElement.tagName; if(t==='INPUT'||t==='SELECT'||t==='TEXTAREA'||e.ctrlKey||e.metaKey||e.altKey||e.repeat) return;
    const k=e.key.toLowerCase(), a=k==='z'?'attack':k==='x'?'block':k==='f'?'special':k==='e'?'ult':null;
    if(a&&viewer){ e.preventDefault(); e.stopPropagation(); doMove(a); }
  },true);
  document.querySelectorAll('.atx-filter .gbtn').forEach(b=>b.addEventListener('click',()=>{ filt=b.dataset.f; document.querySelectorAll('.atx-filter .gbtn').forEach(x=>x.classList.toggle('on',x===b)); grid(); }));
  $('atxGrid').addEventListener('click',e=>{ const b=e.target.closest('.ax'); if(!b||b.classList.contains('lock')) return; const z=+b.dataset.z; if(z!==sel){ sel=z; form=0; ult=false; } document.querySelectorAll('.ax.sel').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); view(sel);
    if(window.matchMedia('(max-width:859px)').matches) $('atxView').scrollIntoView({behavior:'smooth',block:'start'}); });
  $('atxView').addEventListener('click',e=>{
    const f=e.target.closest('.af'); if(f&&viewer){ form=+f.dataset.m; document.querySelectorAll('.af').forEach(x=>x.classList.toggle('on',x===f)); viewer.show(sel,infoOf(sel),form,ult); toast(form?mname(form)+' form':'Normal form'); return; }
    const m=e.target.closest('.mv'); if(m) doMove(m.dataset.a);
  });
}
window.PRAtomix={SIG,famOf,unlocked,formsOf,open};
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
