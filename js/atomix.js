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
+'Americannon|Stars and Stripes Volley|Twin blasters fire red, white and blue rounds. Named after the Americas.\n'
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
const CUSTOM={106:'serpent',87:'french',95:'usa'};
const EXTRA={
  106:{t:'Sea serpent',ab:[['Abyss Surge','Summons a tidal wave from the deep. Stronger the longer the battle runs.'],['Scale Plating','Transition-metal scales: takes less damage from every physical hit.']],fl:'Sea-borg, the serpent of the deep. It coils in the trenches where no light reaches, and its metal scales never rust.',st:[90,82,78,64]},
  87:{t:'French alkali',ab:[['Splash de Paris','The most reactive alkali of all: hits water and explodes like fireworks over the Seine.'],['Fresh from the Oven','Eats a baguette to heal, then throws the crust.']],fl:'Francium, the element named after France. It lasts only 22 minutes before it decays, so it lives fast: beret on, baguettes ready.',st:[40,96,26,98]},
  95:{t:'Patriot actinide',ab:[['Smoke Alarm','Americium powers smoke detectors: it senses every hidden attack.'],['Radioactive Rounds','Its blaster shots keep burning for three turns.']],fl:'Americium, named after the Americas. Built like a walking flag with twin blasters, it never backs down from a fight.',st:[72,94,62,58]}
};

/* ---------- drawing helpers ---------- */
const rng=s=>()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; };
function shade(hex,amt){ const n=parseInt(hex.slice(1),16); let r=n>>16,g=n>>8&255,b=n&255;
  r=Math.max(0,Math.min(255,Math.round(r+amt*255))); g=Math.max(0,Math.min(255,Math.round(g+amt*255))); b=Math.max(0,Math.min(255,Math.round(b+amt*255)));
  return '#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1); }
const eyes=(x1,x2,y,r,R,ink)=>{ const style=Math.floor(R()*3);
  const one=x=>style===0?'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#fff"/><circle cx="'+(x+r*.25)+'" cy="'+(y+r*.1)+'" r="'+(r*.55)+'" fill="'+ink+'"/><circle cx="'+(x+r*.45)+'" cy="'+(y-r*.25)+'" r="'+(r*.2)+'" fill="#fff"/>'
    :style===1?'<ellipse cx="'+x+'" cy="'+y+'" rx="'+r+'" ry="'+(r*1.25)+'" fill="#fff"/><ellipse cx="'+x+'" cy="'+(y+r*.15)+'" rx="'+(r*.42)+'" ry="'+(r*.85)+'" fill="'+ink+'"/><circle cx="'+(x+r*.2)+'" cy="'+(y-r*.35)+'" r="'+(r*.2)+'" fill="#fff"/>'
    :'<path d="M'+(x-r)+' '+y+'q'+r+' '+(-r*1.3)+' '+(2*r)+' 0q'+(-r)+' '+(r*.9)+' '+(-2*r)+' 0Z" fill="#fff"/><circle cx="'+x+'" cy="'+(y-r*.12)+'" r="'+(r*.45)+'" fill="'+ink+'"/>';
  return one(x1)+one(x2); };
const badge=(x,y,sym,col)=>'<g><circle cx="'+x+'" cy="'+y+'" r="15" fill="#fff" fill-opacity=".9" stroke="'+col+'" stroke-width="2.5"/><text x="'+x+'" y="'+(y+5)+'" text-anchor="middle" font-family="Bricolage Grotesque,Arial,sans-serif" font-weight="800" font-size="'+(sym.length>1?13:15)+'" fill="'+shade(col,-.3)+'">'+sym+'</text></g>';

function generic(z,sym){
  const f=famOf(z), F=FAM[f], R=rng(z*7919+13);
  const c=shade(F.c,(R()-.5)*.14), d=shade(c,-.22), l=shade(c,.2), ink='#1B1530';
  const id='g'+z; let s='<defs><radialGradient id="'+id+'" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="'+l+'"/><stop offset=".7" stop-color="'+c+'"/><stop offset="1" stop-color="'+d+'"/></radialGradient></defs>';
  s+='<ellipse cx="100" cy="182" rx="56" ry="9" fill="#000" opacity=".16"/>';
  const fill='url(#'+id+')';
  if(f==='alk'){ // round, crackling with sparks
    for(let i=0;i<7;i++){ const a=R()*6.28, r1=62+R()*10; s+='<path d="M'+(100+Math.cos(a)*r1)+' '+(108+Math.sin(a)*r1)+'l'+(R()*14-7)+' '+(R()*14-7)+'l'+(R()*10-5)+' '+(R()*10-5)+'" stroke="#FFD24A" stroke-width="3" fill="none" stroke-linecap="round"/>'; }
    s+='<circle cx="100" cy="112" r="56" fill="'+fill+'"/><path d="M62 70q-8-26 6-34q4 18 14 26" fill="'+c+'"/><path d="M138 70q8-26-6-34q-4 18-14 26" fill="'+c+'"/>';
    s+=eyes(80,120,104,11,R,ink)+'<path d="M84 132q16 14 32 0" stroke="'+ink+'" stroke-width="4" fill="none" stroke-linecap="round"/>'+badge(100,152,sym,d);
  } else if(f==='ae'){ // rocky dome turtle
    s+='<rect x="58" y="146" width="22" height="30" rx="9" fill="'+d+'"/><rect x="120" y="146" width="22" height="30" rx="9" fill="'+d+'"/>';
    s+='<path d="M36 140q0-80 64-80t64 80q-64 18-128 0Z" fill="'+fill+'"/>';
    for(let i=0;i<5;i++) s+='<path d="M'+(52+i*24)+' '+(122-Math.abs(2-i)*16)+'l12-10l12 10l-4 14h-16Z" fill="'+l+'" opacity=".55"/>';
    s+='<ellipse cx="100" cy="150" rx="58" ry="20" fill="'+shade(c,.28)+'"/>'+eyes(82,118,148,9,R,ink)+'<path d="M90 164q10 6 20 0" stroke="'+ink+'" stroke-width="3.5" fill="none" stroke-linecap="round"/>'+badge(100,100,sym,d);
  } else if(f==='tm'){ // armored knight body
    s+='<rect x="66" y="150" width="22" height="30" rx="5" fill="'+d+'"/><rect x="112" y="150" width="22" height="30" rx="5" fill="'+d+'"/>';
    s+='<rect x="34" y="92" width="20" height="54" rx="8" fill="'+d+'"/><rect x="146" y="92" width="20" height="54" rx="8" fill="'+d+'"/>';
    s+='<rect x="50" y="56" width="100" height="104" rx="18" fill="'+fill+'"/><path d="M50 98h100" stroke="'+d+'" stroke-width="3"/><path d="M100 40v18" stroke="'+d+'" stroke-width="5"/><circle cx="100" cy="38" r="7" fill="'+l+'"/>';
    s+='<rect x="64" y="66" width="72" height="26" rx="10" fill="'+ink+'"/><rect x="72" y="74" width="20" height="9" rx="4" fill="#7DF0E6"/><rect x="108" y="74" width="20" height="9" rx="4" fill="#7DF0E6"/>';
    for(let i=0;i<4;i++) s+='<circle cx="'+(58+i*28)+'" cy="152" r="3" fill="'+l+'"/>';
    s+=badge(100,124,sym,d);
  } else if(f==='pt'){ // soft droplet
    s+='<path d="M100 36q46 58 46 92a46 46 0 0 1-92 0q0-34 46-92Z" fill="'+fill+'"/><path d="M60 160q-14 10-6 20h20Z" fill="'+c+'"/><path d="M140 160q14 10 6 20h-20Z" fill="'+c+'"/>';
    s+='<ellipse cx="84" cy="88" rx="8" ry="14" fill="#fff" opacity=".35"/>'+eyes(84,116,116,10,R,ink)+'<ellipse cx="100" cy="140" rx="9" ry="6" fill="'+ink+'"/>'+badge(100,164,sym,d);
  } else if(f==='md'){ // crystal hex creature
    s+='<path d="M100 32l52 30v62l-52 30l-52-30V62Z" fill="'+fill+'"/><path d="M100 32v122M48 62l104 62M152 62L48 124" stroke="'+l+'" stroke-width="1.5" opacity=".45"/>';
    s+='<path d="M70 150l-8 28h18zM130 150l8 28h-18z" fill="'+d+'"/><path d="M48 70l-22-16l6 26zM152 70l22-16l-6 26z" fill="'+l+'"/>';
    s+=eyes(82,118,88,10,R,ink)+'<path d="M88 112h24" stroke="'+ink+'" stroke-width="4" stroke-linecap="round"/>'+badge(100,138,sym,d);
  } else if(f==='nm'){ // leafy spirit cloud
    s+='<path d="M52 140a28 28 0 0 1 4-56a40 40 0 0 1 76-12a30 30 0 0 1 20 52a24 24 0 0 1-22 34H72a24 24 0 0 1-20-18Z" fill="'+fill+'"/>';
    s+='<path d="M100 54q-6-22 10-30q4 18-10 30Z" fill="'+shade(c,-.1)+'"/><path d="M100 54q14-14 28-6q-14 12-28 6Z" fill="'+l+'"/>';
    s+='<path d="M70 158q-4 16 6 20M130 158q4 16-6 20" stroke="'+d+'" stroke-width="7" stroke-linecap="round" fill="none"/>';
    s+=eyes(82,118,104,11,R,ink)+'<path d="M88 128q12 10 24 0" stroke="'+ink+'" stroke-width="4" fill="none" stroke-linecap="round"/>'+badge(100,150,sym,d);
  } else if(f==='hal'){ // spiky horned
    let sp=''; for(let i=0;i<9;i++){ const a=-2.6+i*.65; sp+='M'+(100+Math.cos(a)*44)+' '+(110+Math.sin(a)*44)+'L'+(100+Math.cos(a+.16)*76)+' '+(110+Math.sin(a+.16)*76)+'L'+(100+Math.cos(a+.33)*44)+' '+(110+Math.sin(a+.33)*44)+'Z'; }
    s+='<path d="'+sp+'" fill="'+d+'"/><circle cx="100" cy="112" r="52" fill="'+fill+'"/>';
    s+='<path d="M66 72q-14-34 4-46q0 26 12 36M134 72q14-34-4-46q0 26-12 36" fill="'+shade(c,-.35)+'"/>';
    s+='<path d="M78 96l18 8M122 96l-18 8" stroke="'+ink+'" stroke-width="4" stroke-linecap="round"/>'+eyes(84,116,110,8,R,ink);
    s+='<path d="M80 134h40l-6 8l-6-8l-6 8l-6-8l-6 8l-6-8Z" fill="#fff" stroke="'+ink+'" stroke-width="2"/>';
    s+='<path d="M70 160q0 10 4 14q4-4 4-14Z M128 156q0 10 4 14q4-4 4-14Z" fill="#D7F542"/>'+badge(100,78,sym,d);
  } else if(f==='ng'){ // glowing ghost with halo
    s+='<ellipse cx="100" cy="44" rx="30" ry="8" fill="none" stroke="'+l+'" stroke-width="5" opacity=".9"/>';
    s+='<path d="M50 112a50 50 0 0 1 100 0v58l-12-10l-13 12l-12-12l-13 12l-12-12l-13 12l-13-12l-12 10Z" fill="'+fill+'" opacity=".95"/>';
    s+='<circle cx="100" cy="104" r="62" fill="'+l+'" opacity=".12"/>'+eyes(82,118,104,11,R,ink)+'<ellipse cx="100" cy="128" rx="7" ry="9" fill="'+ink+'"/>'+badge(100,150,sym,d);
  } else if(f==='lan'){ // magnetic orb with rings
    s+='<ellipse cx="100" cy="110" rx="82" ry="20" fill="none" stroke="'+l+'" stroke-width="4" transform="rotate(-18 100 110)" opacity=".8"/>';
    s+='<circle cx="100" cy="110" r="50" fill="'+fill+'"/><path d="M70 64l-12-24l26 14M130 64l12-24l-26 14" fill="'+d+'"/>';
    s+='<path d="M18 110a82 20 -18 0 0 164 0" fill="none" stroke="'+shade(c,.3)+'" stroke-width="4" transform="rotate(-18 100 110)"/>';
    s+=eyes(82,118,100,10,R,ink)+'<path d="M90 124q10 8 20 0" stroke="'+ink+'" stroke-width="3.5" fill="none" stroke-linecap="round"/>'+badge(100,146,sym,d);
  } else { // actinide: glowing core with trefoil
    s+='<circle cx="100" cy="110" r="70" fill="'+l+'" opacity=".18"/><circle cx="100" cy="110" r="54" fill="'+fill+'"/>';
    for(let i=0;i<3;i++){ const a=i*2.094-1.57; s+='<path d="M100 110L'+(100+Math.cos(a-.5)*48)+' '+(110+Math.sin(a-.5)*48)+'A48 48 0 0 1 '+(100+Math.cos(a+.5)*48)+' '+(110+Math.sin(a+.5)*48)+'Z" fill="'+d+'" opacity=".35"/>'; }
    s+='<path d="M64 158l-6 20h16zM136 158l6 20h-16z" fill="'+d+'"/><path d="M50 96q-24-6-28 14M150 96q24-6 28 14" stroke="'+d+'" stroke-width="8" fill="none" stroke-linecap="round"/>';
    s+=eyes(84,116,100,10,R,ink)+'<path d="M86 124q14 10 28 0" stroke="'+ink+'" stroke-width="4" fill="none" stroke-linecap="round"/>'+badge(100,140,sym,d);
  }
  if(z>=104) s='<circle cx="100" cy="108" r="86" fill="none" stroke="'+l+'" stroke-width="2" stroke-dasharray="4 7" opacity=".7"/>'+s;
  return s;
}

function serpent(){
  return '<defs><linearGradient id="sgS" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5EE6D0"/><stop offset=".55" stop-color="#14857A"/><stop offset="1" stop-color="#0B4A55"/></linearGradient>'
  +'<linearGradient id="sgW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A8FD6"/><stop offset="1" stop-color="#0B2E5E"/></linearGradient>'
  +'<pattern id="sgP" width="10" height="8" patternUnits="userSpaceOnUse"><path d="M0 8q5-9 10 0" fill="none" stroke="#0B4A55" stroke-opacity=".35" stroke-width="1.2"/></pattern></defs>'
  +'<path d="M0 150q25-12 50 0t50 0t50 0t50 0V200H0Z" fill="url(#sgW)"/>'
  +'<path d="M30 168q20-60 70-40t50-30" fill="none" stroke="url(#sgS)" stroke-width="26" stroke-linecap="round"/>'
  +'<path d="M30 168q20-60 70-40t50-30" fill="none" stroke="url(#sgP)" stroke-width="26" stroke-linecap="round"/>'
  +'<path d="M14 182q14-8 18-20" fill="none" stroke="#14857A" stroke-width="12" stroke-linecap="round"/><path d="M8 186l-6 6l10 0Z" fill="#5EE6D0"/>'
  +'<path d="M54 132l6-20l8 16M84 124l10-20l6 18M116 116l12-18l2 18" fill="#F2C14E" stroke="#B37A12" stroke-width="1.5"/>'
  +'<path d="M150 98q6-40 22-52q16 6 16 24q-2 18-20 30Z" fill="url(#sgS)"/>'
  +'<path d="M164 48l-10-22l16 14l4-20l6 22l12-12l-6 22Z" fill="#F2C14E" stroke="#B37A12" stroke-width="1.5"/>'
  +'<path d="M150 70q-22-2-28 12q16 2 28-4Z" fill="#7FF0DD"/>'
  +'<path d="M186 74q14 4 12 14q-10 2-20-6" fill="#0E6B63"/><path d="M186 82l3 7l3-6M180 84l2 6l3-5" fill="#fff"/>'
  +'<ellipse cx="176" cy="62" rx="6" ry="7" fill="#FFF6C9"/><ellipse cx="177" cy="62" rx="2" ry="5.5" fill="#1B1530"/>'
  +'<path d="M0 158q25-10 50 2t50-2t50 2t50-4" fill="none" stroke="#BDE6FF" stroke-width="3" stroke-opacity=".8"/>'
  +'<circle cx="40" cy="120" r="4" fill="none" stroke="#BDE6FF" stroke-width="1.5"/><circle cx="26" cy="104" r="2.5" fill="none" stroke="#BDE6FF" stroke-width="1.5"/><circle cx="130" cy="140" r="3" fill="none" stroke="#BDE6FF" stroke-width="1.5"/>'
  +badge(100,128,'Sg','#0B4A55');
}
function french(){
  return '<defs><radialGradient id="frB" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#FFC08A"/><stop offset=".7" stop-color="#F2711C"/><stop offset="1" stop-color="#B9480A"/></radialGradient>'
  +'<linearGradient id="frBg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E9B871"/><stop offset=".5" stop-color="#C98A3C"/><stop offset="1" stop-color="#E9B871"/></linearGradient>'
  +'<clipPath id="frC"><circle cx="100" cy="112" r="54"/></clipPath></defs>'
  +'<ellipse cx="100" cy="182" rx="56" ry="9" fill="#000" opacity=".16"/>'
  +'<g transform="rotate(-38 100 110)"><rect x="18" y="100" width="164" height="18" rx="9" fill="url(#frBg)" stroke="#8A5520" stroke-width="1.5"/>'+[40,62,84,106,128,150].map(x=>'<path d="M'+x+' 103l10 12" stroke="#8A5520" stroke-width="2" stroke-linecap="round"/>').join('')+'</g>'
  +'<g transform="rotate(38 100 110)"><rect x="18" y="100" width="164" height="18" rx="9" fill="url(#frBg)" stroke="#8A5520" stroke-width="1.5"/>'+[40,62,84,106,128,150].map(x=>'<path d="M'+x+' 103l10 12" stroke="#8A5520" stroke-width="2" stroke-linecap="round"/>').join('')+'</g>'
  +'<circle cx="100" cy="112" r="54" fill="url(#frB)"/>'
  +'<g clip-path="url(#frC)"><rect x="40" y="128" width="120" height="60" fill="#fff"/>'+[132,144,156,168,180].map(y=>'<rect x="40" y="'+y+'" width="120" height="6" fill="#1E3A8A"/>').join('')+'</g>'
  +'<path d="M50 72q2-30 50-30q46 0 50 26q-14 8-50 8q-34 0-50-4Z" fill="#141414"/><path d="M98 42q2-10 8-10" stroke="#141414" stroke-width="4" stroke-linecap="round" fill="none"/>'
  +'<ellipse cx="82" cy="98" rx="10" ry="11" fill="#fff"/><ellipse cx="118" cy="98" rx="10" ry="11" fill="#fff"/><circle cx="84" cy="100" r="5.5" fill="#1B1530"/><circle cx="120" cy="100" r="5.5" fill="#1B1530"/>'
  +'<path d="M72 84l18 4M128 84l-18 4" stroke="#7A3A0A" stroke-width="3" stroke-linecap="round"/>'
  +'<path d="M100 114q-10 -2-18 4q-10 8-18-2q4 10 16 8q12-2 20-6q8 4 20 6q12 2 16-8q-8 10-18 2q-8-6-18-4Z" fill="#3A1F0A"/>'
  +'<path d="M92 122q8 6 16 0" stroke="#7A2A0A" stroke-width="3" fill="none" stroke-linecap="round"/>'
  +'<g transform="translate(130 134)"><rect width="8" height="12" fill="#1E3A8A"/><rect x="8" width="8" height="12" fill="#fff"/><rect x="16" width="8" height="12" fill="#E5484D"/></g>'
  +'<path d="M30 60l6-10l2 12M168 58l-4-12l-4 12" stroke="#FFD24A" stroke-width="3" fill="none" stroke-linecap="round"/>'
  +badge(62,146,'Fr','#B9480A');
}
function usa(){
  return '<defs><linearGradient id="amM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9D2DE"/><stop offset="1" stop-color="#6B7787"/></linearGradient><clipPath id="amC"><rect x="56" y="66" width="88" height="96" rx="20"/></clipPath></defs>'
  +'<ellipse cx="100" cy="184" rx="60" ry="9" fill="#000" opacity=".16"/>'
  +'<rect x="68" y="154" width="22" height="28" rx="6" fill="#1E3A8A"/><rect x="110" y="154" width="22" height="28" rx="6" fill="#1E3A8A"/>'
  +'<path d="M100 22l8 16l-8-4l-8 4Z M86 30l10 14l-12-2Z M114 30l-10 14l12-2Z" fill="#F4F1EA" stroke="#9AA3AE" stroke-width="1"/>'
  +'<g clip-path="url(#amC)"><rect x="56" y="66" width="88" height="96" fill="#fff"/>'+[66,82,98,114,130,146].map(y=>'<rect x="56" y="'+y+'" width="88" height="8" fill="#D62839"/>').join('')
  +'<rect x="56" y="66" width="46" height="48" fill="#1E3A8A"/>'+[[66,76],[80,76],[94,76],[73,88],[87,88],[66,100],[80,100],[94,100]].map(p=>'<path d="M'+p[0]+' '+(p[1]-5)+'l1.5 3.4l3.7.4l-2.8 2.5l.8 3.7l-3.2-1.9l-3.2 1.9l.8-3.7l-2.8-2.5l3.7-.4Z" fill="#fff"/>').join('')+'</g>'
  +'<rect x="56" y="66" width="88" height="96" rx="20" fill="none" stroke="#14213D" stroke-width="3"/>'
  +'<rect x="68" y="40" width="64" height="34" rx="14" fill="url(#amM)" stroke="#14213D" stroke-width="3"/><rect x="76" y="50" width="48" height="12" rx="6" fill="#14213D"/><rect x="80" y="53" width="16" height="6" rx="3" fill="#FF4D4D"/><rect x="104" y="53" width="16" height="6" rx="3" fill="#FF4D4D"/>'
  +'<g><rect x="16" y="100" width="44" height="18" rx="5" fill="url(#amM)" stroke="#14213D" stroke-width="2.5"/><rect x="2" y="104" width="18" height="10" rx="3" fill="#3A4552"/><rect x="34" y="116" width="10" height="16" rx="3" fill="#3A4552"/><rect x="22" y="96" width="22" height="5" rx="2" fill="#D62839"/></g>'
  +'<g><rect x="140" y="100" width="44" height="18" rx="5" fill="url(#amM)" stroke="#14213D" stroke-width="2.5"/><rect x="180" y="104" width="18" height="10" rx="3" fill="#3A4552"/><rect x="156" y="116" width="10" height="16" rx="3" fill="#3A4552"/><rect x="156" y="96" width="22" height="5" rx="2" fill="#1E3A8A"/></g>'
  +'<path d="M-2 109l-8-6l2 6l-6 3l7 1l-2 6Z M202 109l8-6l-2 6l6 3l-7 1l2 6Z" fill="#FFD24A"/>'
  +badge(122,140,'Am','#14213D');
}

/* ---------- unlock state ---------- */
const MUT_ORDER=[13,10,9,12,8,7,11,6,4,3,5,2,1];
const MUT_COL={1:'#5B8CFF',2:'#FFB547',3:'#FF6A3D',4:'#FFD76A',5:'#8F86FF',6:'#3FD9D2',7:'#B48CFF',8:'#FF6AD5',9:'#FF5C9A',10:'#FFFFFF',11:'#5CC8FF',12:'#FF2E2E',13:'#FFE98A'};
function mutsOn(z){ const g=G(); if(!g) return []; const out=[]; for(const m of MUT_ORDER){ const mp=g.mutMap(m); if(mp&&mp[z]) out.push([m,mp[z]]); } return out; }
const unlocked=z=>mutsOn(z).length>0;

function art(z,locked){
  const g=G(), sym=g.SYM[z-1];
  let inner=CUSTOM[z]==='serpent'?serpent():CUSTOM[z]==='french'?french():CUSTOM[z]==='usa'?usa():generic(z,sym);
  if(locked) return '<svg viewBox="0 0 200 200" role="img" aria-label="Locked Atomix"><g filter="url(#axSil)" opacity=".85">'+inner+'</g><defs><filter id="axSil"><feColorMatrix type="matrix" values="0 0 0 0 .35 0 0 0 0 .37 0 0 0 0 .45 0 0 0 1 0"/></filter></defs><text x="100" y="118" text-anchor="middle" font-family="Bricolage Grotesque,Arial" font-weight="800" font-size="54" fill="#fff" opacity=".85">?</text></svg>';
  return '<svg viewBox="0 0 200 200" role="img" aria-label="'+SIG[z-1][0]+'">'+inner+'</svg>';
}
function statsOf(z){
  if(EXTRA[z]) return EXTRA[z].st;
  const F=FAM[famOf(z)], R=rng(z*31+7), w=z/118;
  const v=(b,k)=>Math.max(8,Math.min(99,Math.round(b+(R()-.5)*16+k)));
  return [v(F.hp,w*22),v(F.atk,w*8),v(F.def,w*14),v(F.spd,-w*14)];
}

/* ---------- UI ---------- */
let sel=0, filt='all';
function grid(){
  const g=G(); if(!g) return; let h='', n=0;
  for(let z=1;z<=118;z++){ const u=unlocked(z); if(u) n++; if(filt==='got'&&!u) continue;
    h+='<button type="button" class="ax'+(u?'':' lock')+(sel===z?' sel':'')+(CUSTOM[z]?' star':'')+'" data-z="'+z+'"'+(u?'':' aria-disabled="true"')+' aria-label="'+(u?SIG[z-1][0]+', '+g.NAME[z-1]:'Locked: '+g.NAME[z-1])+'"><span class="axz">'+z+'</span>'+art(z,!u)+'<span class="axn">'+(u?SIG[z-1][0]:g.SYM[z-1])+'</span></button>'; }
  $('atxGrid').innerHTML=h||'<p class="atx-empty">No Atomix unlocked yet. Get a mutation on any element to unlock its Atomix.</p>';
  $('atxCount').textContent=n+' / 118 unlocked';
}
function view(z){
  const g=G(), box=$('atxView');
  if(!z){ box.innerHTML='<p class="atx-empty">'+(filt==='got'||document.querySelector('.ax:not(.lock)')?'Select an unlocked Atomix to view it.':'Every Atomix is locked for now. A Planetary or Star mutation on an element unlocks it. The three starred ones (Francium, Americium, Seaborgium) have special designs.')+'</p>'; return; }
  const f=famOf(z), F=FAM[f], X=EXTRA[z], st=statsOf(z), ms=mutsOn(z), top=ms[0]&&ms[0][0];
  const abs=[[SIG[z-1][1],SIG[z-1][2],'Signature']].concat(X?X.ab.map(a=>[a[0],a[1],'Special']):[]).concat([[F.ab[0],F.ab[1],F.t],[F.ab2[0],F.ab2[1],F.t]]);
  if(z>=104) abs.push([SYNTH[0],SYNTH[1],'Superheavy']);
  const L=['HP','ATK','DEF','SPD'];
  box.innerHTML='<div class="atx-art'+(top?' aura':'')+'" style="--gc:'+F.c+';--ac:'+(MUT_COL[top]||F.c)+'">'+art(z,false)+'</div>'
   +'<div class="atx-h"><h3>'+SIG[z-1][0]+'</h3><span class="sym">'+z+' · '+g.SYM[z-1]+' · '+g.NAME[z-1]+'</span></div>'
   +'<span class="atx-type" style="--gc:'+F.c+'">'+(X?X.t+' · ':'')+F.t+'</span>'
   +'<p class="atx-flavor">'+(X?X.fl:F.fl)+'</p>'
   +'<div class="atx-stats" style="--gc:'+F.c+'">'+st.map((v,i)=>'<div><span>'+L[i]+'</span><i><b style="width:'+v+'%"></b></i><span>'+v+'</span></div>').join('')+'</div>'
   +'<ul class="atx-ab">'+abs.map(a=>'<li><small>'+a[2]+'</small><b>'+a[0]+'</b>'+a[1]+'</li>').join('')+'</ul>'
   +'<div class="atx-muts">'+ms.map(m=>'<span style="border-color:'+MUT_COL[m[0]]+'">'+g.MUTN[m[0]].replace('Beyond Space','Rift')+' ×'+m[1]+'</span>').join('')+'</div>';
}
function open(o){
  const pn=$('atxPanel'), b=$('atxBtn'); pn.hidden=!o; b.setAttribute('aria-expanded',String(o));
  if(o){ if(sel&&!unlocked(sel)) sel=0; grid(); view(sel); }
}
function init(){
  const pn=$('atxPanel'); if(!pn) return;
  $('atxBtn').addEventListener('click',()=>open(pn.hidden));
  $('atxClose').addEventListener('click',()=>open(false));
  pn.addEventListener('click',e=>{ if(e.target===pn) open(false); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!pn.hidden) open(false); });
  document.querySelectorAll('.atx-filter .gbtn').forEach(b=>b.addEventListener('click',()=>{ filt=b.dataset.f; document.querySelectorAll('.atx-filter .gbtn').forEach(x=>x.classList.toggle('on',x===b)); grid(); view(sel); }));
  $('atxGrid').addEventListener('click',e=>{ const b=e.target.closest('.ax'); if(!b||b.classList.contains('lock')) return; sel=+b.dataset.z; grid(); view(sel);
    if(window.matchMedia('(max-width:859px)').matches) $('atxView').scrollIntoView({behavior:'smooth',block:'start'}); });
}
window.PRAtomix={art,SIG,famOf,unlocked};
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
