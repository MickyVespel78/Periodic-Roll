(function(){
'use strict';

// <logic>
const SYM="H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og".split(" ");
const NAME="Hydrogen,Helium,Lithium,Beryllium,Boron,Carbon,Nitrogen,Oxygen,Fluorine,Neon,Sodium,Magnesium,Aluminium,Silicon,Phosphorus,Sulfur,Chlorine,Argon,Potassium,Calcium,Scandium,Titanium,Vanadium,Chromium,Manganese,Iron,Cobalt,Nickel,Copper,Zinc,Gallium,Germanium,Arsenic,Selenium,Bromine,Krypton,Rubidium,Strontium,Yttrium,Zirconium,Niobium,Molybdenum,Technetium,Ruthenium,Rhodium,Palladium,Silver,Cadmium,Indium,Tin,Antimony,Tellurium,Iodine,Xenon,Caesium,Barium,Lanthanum,Cerium,Praseodymium,Neodymium,Promethium,Samarium,Europium,Gadolinium,Terbium,Dysprosium,Holmium,Erbium,Thulium,Ytterbium,Lutetium,Hafnium,Tantalum,Tungsten,Rhenium,Osmium,Iridium,Platinum,Gold,Mercury,Thallium,Lead,Bismuth,Polonium,Astatine,Radon,Francium,Radium,Actinium,Thorium,Protactinium,Uranium,Neptunium,Plutonium,Americium,Curium,Berkelium,Californium,Einsteinium,Fermium,Mendelevium,Nobelium,Lawrencium,Rutherfordium,Dubnium,Seaborgium,Bohrium,Hassium,Meitnerium,Darmstadtium,Roentgenium,Copernicium,Nihonium,Flerovium,Moscovium,Livermorium,Tennessine,Oganesson".split(",");
const N=118;
const SYMIDX={}; SYM.forEach((s,i)=>{SYMIDX[s]=i+1;});
const WORDS=new Set("bacon banana bank bark barn base bash basic basin bath bay beach bear beat beer bench bend beta bin bind birth bison bite black blank blush boat bobs body bond bone bonny bonus bony book boon bore born boss bosun both bound bow bows boy brace brag brain brick brink brisk brook brown bruise brush buck bun bunch bunny bunsen buoy burn bus bush business busy buy byte cab cabin cage calf camp can candy cane cannon canon cap care cargo case cash cask cat catch chalk check chick chin chip chop clam clap class claw clay clerk click cliff clip clock close cloth clown club coach coal coat cob coin cone conic cook coop copper copy core corn cosine cosy couch cover cow cowboy coy crab cramp crane crash cream crew crib crisp crop cross crown crush cry cub cube cubic cubs cuckoo cuff cup curb cure cynic hiccup hiccups hobby honey hop horn house how hub hubby hubs huge hunch hush husk hymn hypo ibis ice icon info ink inn ion iris iron kiosk kiss kite kiwi knob know nacho nachos nap nation navy neon nib nice nick nicotine nine nobody noise none noon nose nosh notch oar oath once one onion onus opus ore osmosis ounce over own pace pack page pain pair palace pan panic pants paper park pass paste patch path pause paw pay phone pick pin pine pink pious place plain plan plate play plus pond pony pop pose pound power pray press price pub pubs puck pun punch punk pup puppy pure push sauna scab scan scar sconce scone scones scoop score scorn scrap screw seal seat second send sense shark sharp shin shine ship shock shop shore show shun sick silver since sine sink sir skin skip sky slice slip snack sniff snob snow snowy snub sob sobs sock son sonic soon sore sound soup south soy space span spare spice spin spoon spray spun spy stack staff stage stair stand state stay steal steam step stick sun sunk sunny sup super sure switch sync tab tack tan tank tap task taste teach team tear ten that thick thin think this thorn tick tin tiny tip tire under union upon use usual verb very vine violin voice vote vow wag walk war wash wasp waste watch water what wheat when where which whip white who why wife win wind wine wink wire wise wish with wow wrap yarn yes yoga you youth yup".split(" "));
const NAMES=new Set("ali amy ben beth bob cain cal cam cass cindy cody colin conan cora cosmo eric erin esther finn fran hal lacy lance lina lucy mona nan nancy nate neo nico nicola nikki nina nola nora ola oscar pam pat ruby rudy ruth sal sam seth tess tina una val vic vince".split(" "));

const w0=[0]; let W0=0;
for(let z=1;z<=N;z++){
  let w=1000*Math.pow(z,-1.1);
  if(z===43||z===61||z===85||z===87||z>=93) w*=0.15;
  else if(z===84||z===86||z===88||z===89||z===91) w*=0.5;
  w0[z]=w; W0+=w;
}
const elOdds=z=>W0/w0[z];

// 17 roll tiers. Odds at or above each threshold move up one tier.
const RT=[60,300,2000,2e4,2e5,2.5e6,4e7,7e8,1.5e10,4e11,1e16,1e28,1e46,1e60,1e80,1e100,1e150];
const TNAME=['Common','Uncommon','Rare','Epic','Legendary','Mythic','Transcendent','Celestial','Cosmic','Eternal','Omega','Infinite','Singularity','Genesis','Multiversal','Omniversal','Boundless','Primordial'];
const ET=[12,45,170,500,1500,4000];
const tierIdx=(o,a)=>{let i=0;while(i<a.length&&o>=a[i])i++;return i;};
const eTierIdx=z=>tierIdx(elOdds(z),ET);

const EL_M={2:4,3:40,4:600,5:15000,6:600000};
const TG_M={2:15,3:400,4:12000,5:500000,6:3e7};
const RZ_M={3:200,4:6000,5:3e5,6:2e7};
const RN_M={3:1500,4:1.5e5,5:1.7e7,6:2e9};
const RES_M=118, MIR_E=400, MIR_N=20000;
const WD_M={3:6,4:25,5:120,6:600,7:3000,8:15000,9:60000,10:200000};
const KIN_M={2:3,3:15,4:80};
const LINK_M=5;
const FAMS=[['Noble gas',[2,10,18,36,54,86,118]],['Halogen',[9,17,35,53,85,117]],['Alkali metal',[3,11,19,37,55,87]],['Alkaline earth',[4,12,20,38,56,88]],['Coinage metal',[29,47,79,111]]];
const FAM_M={4:400,5:30000,6:5e6}, SUM_N=118, SUM_M=8000;
const RX_M={2:3,3:20,4:150,5:800,6:4000};
const PAT_E={ABABAB:3000,AABBCC:2000,AAABBB:1500,ABCABC:4000};
const PAT_N={ABABAB:3e6,AABBCC:3e5,AAABBB:3e6,ABCABC:3e5};
const PAL_N=5000;
const PLAN_M=250000, STAR_M=100000, IMP_M=1e9, SYS_M=1e13, BH_M=1.5e6, BEY_M=1e18, UNI_M=1e21, MULTI_M=1e24, OMNI_M=1e32, ABS_M=1e40, ONE_M=1e45, DET_M=2e32, SEC_M=1e50;
const PLAN_P=2e-4, STAR_P=1e-4, RIP_P=0.14, BH_P=0.3, GRAV_P=0.4, SYS_P=0.25, UNI_P=0.6, MULTI_P=0.7, OMNI_P=0.3, ABS_P=0.35, ASC_P=0.6;
let mutBoost=1, detP=0;
/* Determination: only after a rebirth. 0.0001% a roll at Rebirth 1, 0.001% at 2, 0.01% at 5, 0.1% at 10, smooth in between */
const DET_ANCH=[[1,1e-6],[2,1e-5],[5,1e-4],[10,1e-3]];
function detChance(rb){
  if(rb<=0) return 0; if(rb>=10) return 1e-3;
  for(let i=0;i<DET_ANCH.length-1;i++){ const a=DET_ANCH[i], b=DET_ANCH[i+1]; if(rb>=a[0]&&rb<=b[0]) return a[1]*Math.pow(b[1]/a[1],(rb-a[0])/(b[0]-a[0])); }
  return 1e-6;
}
const mutChance=(p,L)=>Math.min(0.2,p*(1+0.15*L)*mutBoost);
const rndR={bern:p=>Math.random()<p, cat:w=>{let r=Math.random(),s=0;for(let i=0;i<w.length-1;i++){s+=w[i];if(r<s)return i;}return w.length-1;}};
/* every mutation decision lives here so the exact odds can be enumerated */
function mutate(L,R){
  const pc=mutChance(PLAN_P,L), sc=mutChance(STAR_P,L), m=[0,0,0,0,0,0];
  for(let i=0;i<6;i++) m[i]=R.cat([1-pc-sc,pc,sc]);
  /* ripple: once one tile mutates, the rest of the roll can be caught in it */
  if(m.some(x=>x)){ const rp=Math.min(0.5,RIP_P*(1+0.05*L)*Math.sqrt(mutBoost));
    for(let i=0;i<6;i++) if(m[i]===0) m[i]=R.cat([1-rp,rp/2,rp/2]); }
  for(let i=0;i<6;i++) if(m[i]===2&&R.bern(BH_P)) m[i]=5;
  const has=v=>m.some(x=>x===v), at=v=>{const a=[];m.forEach((x,i)=>{if(x===v)a.push(i);});return a;};
  const has9=()=>m.some(x=>x===9);
  const beyond=has(1)&&has(2)&&has(5);
  if(beyond){
    for(let i=0;i<6;i++) if(m[i]===1||m[i]===2||m[i]===5) m[i]=6;
    for(let i=0;i<6;i++) if(m[i]===0&&R.bern(GRAV_P)) m[i]=6;
    if(at(6).length>=2) for(const i of at(6)) if(R.bern(UNI_P)) m[i]=11;
    const un=at(11); for(let k=0;k+1<un.length;k+=2) if(R.bern(MULTI_P)){ m[un[k]]=7; m[un[k+1]]=7; }
    const mu=at(7); for(let k=0;k+1<mu.length;k+=2) if(R.bern(OMNI_P)){ m[mu[k]]=8; m[mu[k+1]]=8; }
    const om=at(8); for(let k=0;k+1<om.length;k+=2) if(R.bern(ABS_P)){ m[om[k]]=9; m[om[k+1]]=9; }
    if(has9()) for(let i=0;i<6;i++) if(m[i]!==9&&R.bern(ASC_P)) m[i]=9;
    if(m.every(x=>x===9)) for(let i=0;i<6;i++) m[i]=10;
  }
  if(has(1)&&has(2)) for(let i=0;i<6;i++) if(m[i]===1||m[i]===2) m[i]=3;
  if(!beyond&&has(3)&&R.bern(SYS_P)) for(let i=0;i<6;i++) if(m[i]===3) m[i]=4;
  /* Determination outranks everything up to Omniverse: every mutated tile becomes it, or one random tile if none mutated. Absolute and The One are never touched. */
  if(detP>0&&R.bern(detP)){
    if(m.every(x=>x===10)){ for(let i=0;i<6;i++) m[i]=13; return m; }
    let any=false; for(let i=0;i<6;i++) if(m[i]>0&&m[i]<9){ m[i]=12; any=true; }
    if(!any&&!m.some(x=>x>=9)) m[R.cat([1/6,1/6,1/6,1/6,1/6,1/6])]=12;
  }
  return m;
}

const MUTN={1:'Planetary',2:'Star',3:'Impact',4:'Solar System',5:'Black Hole',6:'Beyond Space',7:'Multiverse',8:'Omniverse',9:'Absolute',10:'The One Before All',11:'Universe',12:'Determination',13:'???'}, MUTB={1:'PLANETARY',2:'STAR',3:'IMPACT',4:'SOLAR',5:'HOLE',6:'BEYOND',7:'MULTI',8:'OMNI',9:'ABSOLUTE',10:'THE ONE',11:'UNIVERSE',12:'DETERMINED',13:'???'}, MUTC={1:'pl',2:'st',3:'im',4:'so',5:'bh',6:'by',7:'mv',8:'ov',9:'ab',10:'on',11:'un',12:'de',13:'se'}, MUTK={1:'planet',2:'star',3:'impact',4:'system',5:'hole',6:'beyond',7:'multi',8:'omni',9:'abs',10:'one',11:'uni',12:'det',13:'sec'}, MUTM={1:PLAN_M,2:STAR_M,3:IMP_M,4:SYS_M,5:BH_M,6:BEY_M,7:MULTI_M,8:OMNI_M,9:ABS_M,10:ONE_M,11:UNI_M,12:DET_M,13:SEC_M};
/* exact chance that a roll ends with at least one tile of each mutation, at base luck (every random outcome enumerated, checked by simulation) */
const ODDS={1:0.0009770913,2:0.0003215018,3:0.0002710323,4:0.0000903441,5:0.0002996517,6:0.0000369306,11:0.0000285662,7:0.0000199400,8:0.0000060180,9:0.0000028276,10:0.00000043964};
const pctOf=p=>{const x=p*100, d=Math.min(8,Math.max(0,2-Math.floor(Math.log10(x)))); let t=x.toFixed(d); if(t.indexOf('.')>=0) t=t.replace(/0+$/,'').replace(/\.$/,''); return t+'%';};
const CODES=[["1337",2000],["2718",2000],["1618",2000],["666",300],["777",300],["888",300],["007",60],["314",40],["123",40],["321",40],["404",40]];

const RX_SRC=("Carbon monoxide|CO,Table salt|NaCl,Hydrochloric acid|HCl,Lithium fluoride|LiF,Sodium fluoride|NaF,Potassium chloride|KCl,Magnesia|MgO,Quicklime|CaO,Zinc oxide|ZnO,Copper oxide|CuO,Iron sulfide|FeS,Silver chloride|AgCl,Hydrofluoric acid|HF,Nitric oxide|NO,Silicon carbide|SiC,Boron nitride|BN,Cinnabar|HgS,Galena|PbS,Tungsten carbide|WC,Titanium nitride|TiN,Aluminium nitride|AlN,Sodium bromide|NaBr,Potassium iodide|KI,"
+"Water|H2O,Carbon dioxide|CO2,Sulfur dioxide|SO2,Nitrogen dioxide|NO2,Laughing gas|N2O,Hydrogen sulfide|H2S,Ozone|O3,Calcium chloride|CaCl2,Magnesium chloride|MgCl2,Quartz|SiO2,Lye|NaOH,Caustic potash|KOH,Rutile|TiO2,Cuprite|Cu2O,Acanthite|Ag2S,Carbon disulfide|CS2,Hydrogen cyanide|HCN,Fluorite|CaF2,Fool's gold|FeS2,"
+"Ammonia|NH3,Hydrogen peroxide|H2O2,Sulfur trioxide|SO3,Boron trifluoride|BF3,Phosphine|PH3,Acetylene|C2H2,Boron trichloride|BCl3,Phosgene|COCl2,"
+"Methane|CH4,Rust|Fe2O3,Corundum|Al2O3,Chalk|CaCO3,Saltpetre|KNO3,Silane|SiH4,Carbon tetrachloride|CCl4,Nitric acid|HNO3,Slaked lime|CaO2H2,Milk of magnesia|MgO2H2,Chile saltpetre|NaNO3,"
+"Baking soda|NaHCO3,Soda ash|Na2CO3,Potash|K2CO3,Calcium sulfate|CaSO4,Copper sulfate|CuSO4,Methanol|CH4O,Ethylene|C2H4").split(",");
const RXS=RX_SRC.map(s=>{
  const p=s.split("|"), need={}; let atoms=0;
  p[1].replace(/([A-Z][a-z]?)(\d*)/g,(m,e,c)=>{
    const z=SYMIDX[e]; if(!z) throw new Error("bad symbol "+e);
    const k=c?+c:1; need[z]=(need[z]||0)+k; atoms+=k; return m;
  });
  return {name:p[0],f:p[1],need,atoms};
}).sort((a,b)=>b.atoms-a.atoms);
const SUBD="₀₁₂₃₄₅₆₇₈₉";
const sub=f=>f.replace(/\d/g,d=>SUBD[+d]);
const PRE=NAME.map(n=>n.slice(0,2).toLowerCase());

const cache={};
function table(L){
  if(cache[L]) return cache[L];
  const e=1/(1+0.05*L); const c=[0]; let s=0;
  for(let z=1;z<=N;z++){s+=Math.pow(w0[z],e);c[z]=s;}
  return cache[L]=c;
}
function pickZ(L){
  const c=table(L); const r=Math.random()*c[N];
  let lo=1,hi=N;
  while(lo<hi){const m=(lo+hi)>>1; if(c[m]>=r) hi=m; else lo=m+1;}
  return lo;
}
function pickTag(z,L){
  if(Math.random()<0.004*L) return z;
  return 1+Math.floor(Math.random()*N);
}
function drawSquares(L){
  const m=mutate(L,rndR), sq=[];
  for(let i=0;i<6;i++){ const z=pickZ(L); sq.push({z,n:pickTag(z,L),m:m[i]}); }
  return sq;
}
function longestRun(a){
  let best=1;
  for(const d of [1,-1]){
    let run=1;
    for(let i=1;i<a.length;i++){
      if(a[i]-a[i-1]===d){run++; if(run>best) best=run;} else run=1;
    }
  }
  return best;
}
function canon(a){
  const m=new Map(); let s="";
  for(const v of a){ if(!m.has(v)) m.set(v,String.fromCharCode(65+m.size)); s+=m.get(v); }
  return s;
}
const BAD=new Set("cuss suck sucks nip nips coon spic homo fag dyke kike gook chink wop paki slut whore hoe hoes rape raped nazi nazis sex porn cock cocks cum tit tits anus dick damn hell shit piss crap twat cunt negro nig pimp rapist kill kills".split(" "));
function findWord(sq){
  let best=null;
  for(let i=0;i<sq.length;i++){
    let s="";
    for(let j=i;j<sq.length;j++){
      s+=SYM[sq[j].z-1].toLowerCase();
      if(j>i&&s.length>=3&&!BAD.has(s)){
        const isW=WORDS.has(s), isN=NAMES.has(s);
        if((isW||isN)&&(!best||s.length>best.w.length)) best={w:s,i,j,name:!isW&&isN};
      }
    }
  }
  return best;
}
function findReactions(sq){
  const pool={};
  sq.forEach((s,i)=>{(pool[s.z]=pool[s.z]||[]).push(i);});
  const out=[]; let again=true;
  while(again){
    again=false;
    for(const r of RXS){
      if(out.some(o=>o.r===r)) continue;
      let ok=true;
      for(const z in r.need){ if((pool[z]||[]).length<r.need[z]){ok=false;break;} }
      if(!ok) continue;
      const idx=[];
      for(const z in r.need){ for(let k=0;k<r.need[z];k++) idx.push(pool[z].pop()); }
      out.push({r,idx}); again=true; break;
    }
  }
  return out;
}
function evaluate(sq){
  const zs=sq.map(s=>s.z), ns=sq.map(s=>s.n);
  let prod=1; for(const z of zs) prod*=elOdds(z);
  let odds=Math.pow(prod,0.16);
  const bonus=[], hw=[], hx=[], rx=[]; let word=null;
  const add=(k,label,mult)=>{bonus.push([label,mult,k]); odds*=mult;};

  const ec={}, tc={};
  for(const s of sq){ec[s.z]=(ec[s.z]||0)+1; tc[s.n]=(tc[s.n]||0)+1;}
  for(const z in ec) if(ec[z]>=2) add('el',ec[z]+"× "+SYM[z-1],EL_M[ec[z]]);
  for(const n in tc) if(tc[n]>=2) add('num',tc[n]+"× №"+n,TG_M[tc[n]]);
  for(const s of sq) if(s.n===s.z) add('el',"Resonance "+SYM[s.z-1],RES_M);
  for(const s of sq) if(s.m) add(MUTK[s.m],MUTN[s.m]+" "+SYM[s.z-1],MUTM[s.m]);

  const rz=longestRun(zs); if(rz>=3) add('el',"Element run ×"+rz,RZ_M[rz]);
  const rn=longestRun(ns); if(rn>=3) add('num',"Number run ×"+rn,RN_M[rn]);

  const cz=canon(zs), cn=canon(ns);
  if(PAT_E[cz]) add('pat',"Pattern "+cz,PAT_E[cz]);
  if(PAT_N[cn]) add('pat',"Number pattern "+cn,PAT_N[cn]);
  const rev=a=>a.slice().reverse();
  if(cz!=="AAAAAA"&&zs.every((z,i)=>z===zs[5-i])) add('pat',"Mirror",MIR_E);
  if(cn!=="AAAAAA"&&ns.every((n,i)=>n===ns[5-i])) add('pat',"Number mirror",MIR_N);

  for(const fm of FAMS){ const c=zs.filter(z=>fm[1].indexOf(z)>=0).length; if(c>=4) add('el',fm[0]+' family ×'+c,FAM_M[c]); }
  if(ns.reduce((a,b)=>a+b,0)===SUM_N) add('num','Lucky sum '+SUM_N,SUM_M);

  const w=findWord(sq);
  if(w){
    word=w.w;
    add('word',(w.name?"Name":"Word")+' "'+w.w+'"',WD_M[Math.min(w.w.length,10)]);
    for(let i=w.i;i<=w.j;i++) hw.push(i);
  }
  for(const o of findReactions(sq)){
    rx.push(o.r.name);
    add('rx',o.r.name+" "+sub(o.r.f),RX_M[o.r.atoms]);
    for(const i of o.idx) hx.push(i);
  }

  const seen=new Set(), grp={};
  for(const z of zs){ if(seen.has(z)) continue; seen.add(z); (grp[PRE[z-1]]=grp[PRE[z-1]]||[]).push(z); }
  for(const p in grp) if(grp[p].length>=2){
    add('kin',"Name kin: "+grp[p].map(z=>NAME[z-1]).join(" & "),KIN_M[Math.min(grp[p].length,4)]);
  }

  for(let i=0;i<6;i++){
    if(ns[i]===zs[i]) continue;
    if(zs.some((z,j)=>j!==i&&z===ns[i])) add('num',"№"+ns[i]+" joins "+SYM[ns[i]-1],LINK_M);
  }
  const digits=ns.join("");
  const code=CODES.find(c=>digits.indexOf(c[0])>=0);
  if(code) add('num',"Joined digits "+code[0],code[1]);
  if(digits.length>=6&&digits===digits.split("").reverse().join("")) add('num',"Palindrome digits",PAL_N);

  return {odds:Math.min(odds,1e290),bonus,hw,hx,word,rx};
}
function rollOnce(L){
  const sq=drawSquares(L), ev=evaluate(sq);
  return {sq,odds:ev.odds,bonus:ev.bonus,hw:ev.hw,hx:ev.hx,word:ev.word,rx:ev.rx};
}
// </logic>

const $=id=>document.getElementById(id);
const KEY='periodic-roll-v2', OLDKEY='periodic-roll-v1';

function fmt(n){
  if(!isFinite(n)) return 'max';
  if(n<1e6) return Math.round(n).toLocaleString('en-US');
  if(n>=1e15) return n.toExponential(1).replace('e+','e');
  const p=n>=1e12?[1e12,'T']:n>=1e9?[1e9,'B']:[1e6,'M'];
  const v=n/p[0];
  return (v<100?v.toFixed(1):String(Math.round(v)))+p[1];
}
const interval=l=>Math.round(3000*Math.pow(1/3,Math.min(10,Math.max(0,l))/10));
const levelOf=life=>Math.floor(2*Math.log10(life+1))+1;
const RB_MAX=10;
function rbCost(r){return 2.5e10*Math.pow(6,r);}
const BOOST_LUCK=5, BOOST_MS=10000, REC_MIN=300;
let boostUntil=0, boostT=null, pendingBoost=false;
/* spin milestones: lifetime rolls (kept across rebirth) give a little permanent luck and mutation chance */
const MS=[1000,10000,50000,250000,1000000];
const MS_LUCK=0.15, MS_MUT=0.03;
const msCount=()=>{let c=0; for(const t of MS) if((S.tot||0)>=t) c++; return c;};
const effL=()=>S.up.luck+0.5*S.rebirths+MS_LUCK*msCount()+(Date.now()<boostUntil?BOOST_LUCK:0);
const expMult=()=>1+0.5*S.rebirths;

const DEFS=[
  {k:'auto',name:'Auto-roller',max:1,cost:()=>6000000,desc:l=>l?'Rolls by itself while this page is open':'Manual rolls only'},
  {k:'speed',name:'Quick hands',max:10,cost:l=>Math.round(40000*Math.pow(2,l)),desc:l=>(interval(l)/1000).toFixed(2)+' s between auto-rolls'+(l>=10?' (1 per second, the cap)':'')},
  {k:'luck',name:'Lucky isotopes',max:20,cost:l=>Math.round(150*Math.pow(1.9,l)),desc:l=>l?('Rarer elements favoured, '+(l*0.4).toFixed(1)+'% forced resonance'):'Base element odds'}
];

const fresh=()=>({exp:0,life:0,rolls:0,tot:0,up:{auto:0,speed:0,luck:0},autoOn:false,found:{},words:{},rx:{},best:null,top:[],recent:[],last:null,rebirths:0,dets:{},secs:{},outers:{},stars:{},impacts:{},systems:{},holes:{},beyonds:{},multis:{},unis:{},omnis:{},absolutes:{},ones:{}});
const S=fresh();
const mutMap=m=>m===1?S.outers:m===2?S.stars:m===3?S.impacts:m===4?S.systems:m===5?S.holes:m===6?S.beyonds:m===7?S.multis:m===11?S.unis:m===12?S.dets:m===13?S.secs:m===8?S.omnis:m===9?S.absolutes:S.ones;
function merge(d){
  if(!d||typeof d!=='object') return;
  for(const k of Object.keys(S)){
    if(!(k in d)) continue;
    if(k==='up'&&d.up&&typeof d.up==='object'){
      for(const u of Object.keys(S.up)) if(typeof d.up[u]==='number') S.up[u]=d.up[u];
    } else S[k]=d[k];
  }
}
let saveT=null;
function save(){
  clearTimeout(saveT);
  saveT=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}},400);
}
function load(){
  try{
    const raw=localStorage.getItem(KEY);
    if(raw){ merge(JSON.parse(raw)); return; }
    const old=localStorage.getItem(OLDKEY);
    if(old){
      const o=JSON.parse(old);
      if(o&&typeof o==='object'){
        const j=+o.j||0;
        S.exp=j; S.life=j; S.rolls=+o.rolls||0;
        if(o.found&&typeof o.found==='object') S.found=o.found;
        if(o.up&&typeof o.up==='object') for(const u of Object.keys(S.up)) if(typeof o.up[u]==='number') S.up[u]=o.up[u];
        S.autoOn=!!o.autoOn;
      }
    }
  }catch(e){}
}

/* periodic table geometry */
function pos(z){
  if(z===1) return [2,1];
  if(z===2) return [2,18];
  if(z<=4) return [3,z-2];
  if(z<=10) return [3,z+8];
  if(z<=12) return [4,z-10];
  if(z<=18) return [4,z];
  if(z<=36) return [5,z-18];
  if(z<=54) return [6,z-36];
  if(z<=56) return [7,z-54];
  if(z<=71) return [10,z-54];
  if(z<=86) return [7,z-68];
  if(z<=88) return [8,z-86];
  if(z<=103) return [11,z-86];
  return [8,z-100];
}

const cells=[];
function buildTable(){
  const t=$('ptable'); let h='';
  for(let c=1;c<=18;c++) h+='<div class="gh" style="grid-column:'+c+'">'+c+'</div>';
  h+='<div class="ph" style="grid-row:7;grid-column:3">57–71</div>';
  h+='<div class="ph" style="grid-row:8;grid-column:3">89–103</div>';
  h+='<div class="sp"></div>';
  for(let z=1;z<=N;z++){
    const p=pos(z);
    h+='<button type="button" class="cell t'+eTierIdx(z)+'" data-z="'+z+'" style="grid-row:'+p[0]+';grid-column:'+p[1]+'" aria-label="'+NAME[z-1]+', atomic number '+z+'"><span class="zz">'+z+'</span><span class="sy">'+SYM[z-1]+'</span></button>';
  }
  t.innerHTML=h;
  t.querySelectorAll('.cell').forEach(el=>{cells[+el.dataset.z]=el;});
  t.addEventListener('click',e=>{
    const b=e.target.closest('.cell'); if(!b) return;
    const z=+b.dataset.z;
    t.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));
    b.classList.add('sel');
    const o='about 1 in '+fmt(elOdds(z))+' tiles at base luck';
    $('dexInfo').textContent=S.found[z]
      ? NAME[z-1]+' ('+SYM[z-1]+'), No. '+z+'. Found '+S.found[z]+' time'+(S.found[z]===1?'':'s')+'. '+o+'.'
      : NAME[z-1]+' ('+SYM[z-1]+'), No. '+z+'. Not found yet. '+o+'.';
  });
}
function paintCell(z){
  const el=cells[z]; if(!el) return;
  el.classList.toggle('found',!!S.found[z]);
  el.classList.remove('m1','m2','m3','m4','m5','m6','m7','m8','m9','m10','m11','m12','m13');
  const mm=S.ones[z]?10:S.absolutes[z]?9:S.omnis[z]?8:S.multis[z]?7:S.unis[z]?11:S.beyonds[z]?6:S.holes[z]?5:S.systems[z]?4:S.impacts[z]?3:S.stars[z]?2:S.outers[z]?1:0;
  if(mm) el.classList.add('m'+mm);
}
function paintAll(){
  for(let z=1;z<=N;z++) paintCell(z);
  const sel=$('ptable').querySelector('.sel'); if(sel) sel.classList.remove('sel');
}

/* upgrades */
const upEls={};
function buildUps(){
  const g=$('upgrid'); g.innerHTML='';
  for(const d of DEFS){
    const a=document.createElement('article'); a.className='up'; a.dataset.k=d.k;
    let pips=''; for(let i=0;i<d.max;i++) pips+='<i></i>';
    a.innerHTML='<h3>'+d.name+'</h3><p class="lv"></p><div class="pips">'+pips+'</div><p class="now"></p><p class="nxt"></p><button type="button" class="buy"></button>';
    g.appendChild(a);
    upEls[d.k]={root:a,lv:a.querySelector('.lv'),now:a.querySelector('.now'),nxt:a.querySelector('.nxt'),btn:a.querySelector('.buy'),pips:a.querySelectorAll('.pips i')};
  }
  g.addEventListener('click',e=>{
    const b=e.target.closest('.buy'); if(!b||b.disabled) return;
    const d=DEFS.find(x=>x.k===b.closest('.up').dataset.k);
    const l=S.up[d.k]; if(l>=d.max) return;
    const c=d.cost(l); if(S.exp<c) return;
    S.exp-=c; S.up[d.k]=l+1;
    if(d.k==='auto'){S.autoOn=true;}
    syncAuto(); renderWallet(); updateUps(); schedule(); save();
  });
}
function updateUps(){
  for(const d of DEFS){
    const l=S.up[d.k], u=upEls[d.k];
    u.lv.textContent='Level '+l+' of '+d.max;
    u.pips.forEach((p,i)=>p.classList.toggle('on',i<l));
    u.now.textContent=d.desc(l);
    u.nxt.textContent=l<d.max?('Next: '+d.desc(l+1)):'Fully upgraded';
    if(l>=d.max){u.btn.textContent=d.max===1?'Owned':'Maxed';u.btn.disabled=true;}
    else{const c=d.cost(l); u.btn.textContent='Buy · '+fmt(c)+' EXP'; u.btn.disabled=S.exp<c;}
  }
}
function syncAuto(){
  const has=S.up.auto>0;
  $('autoChk').disabled=!has;
  $('autoChk').checked=has&&S.autoOn;
  $('autoBox').classList.toggle('locked',!has);
  $('autoInfo').textContent=has?('One roll every '+(interval(S.up.speed)/1000).toFixed(2)+' s'):'Buy the Auto-roller below';
}

/* rendering */
function tileHTML(z,n,i,anim,hw,hx,m){
  const res=n===z;
  return '<div class="sq t'+eTierIdx(z)+(m?' mut '+MUTC[m]:'')+(res?' res':'')+(hw?' hw':'')+(hx?' hx':'')+(anim?' in':'')+'" style="--i:'+i+'" title="'+NAME[z-1]+'">'
    +'<div class="tp"><span class="z">'+z+'</span>'+(m?'<span class="ob">'+MUTB[m]+'</span>':'<span class="td"></span>')+'</div>'
    +'<div class="sym">'+SYM[z-1]+'</div><div class="nm">'+(m?MUTN[m]+' ':'')+NAME[z-1]+'</div>'
    +'<div class="tag">№ '+n+(res?' = Z':'')+'</div></div>';
}
function renderTray(p,anim,st){
  const t=$('tray'), hw=p.hw||[], hx=p.hx||[];
  t.style.setProperty('--st',(st==null?45:st)+'ms');
  t.innerHTML=p.sq.map((s,i)=>tileHTML(s[0],s[1],i,anim,hw.indexOf(i)>=0,hx.indexOf(i)>=0,s[2])).join('');
}
function renderResult(p,notes,pulse){
  const ti=tierIdx(p.odds,RT), r=$('result');
  r.className='result t'+ti;
  $('rTier').textContent=TNAME[ti];
  $('rOdds').textContent=fmt(p.odds);
  $('rGain').textContent=p.gain?('+'+fmt(p.gain)+' EXP'):'';
  $('chips').innerHTML=p.bonus.length
    ? p.bonus.map(b=>'<li class="chip k-'+b[2]+'">'+b[0]+' <b>×'+fmt(b[1])+'</b></li>').join('')
    : '<li class="chip none">No combos this roll</li>';
  const isRec=notes.indexOf('NEW RECORD')>=0, others=notes.filter(x=>x!=='NEW RECORD');
  $('newEl').textContent=(isRec?'NEW RECORD':'')+(isRec&&others.length?'. ':'')+(others.length?('New: '+others.join(' · ')):'');
  if(pulse&&ti>=4){r.classList.remove('pulse');void r.offsetWidth;r.classList.add('pulse');}
}
function renderWallet(){
  $('exp').textContent=fmt(S.exp);
  $('lvl').textContent=String(levelOf(S.life));
  $('rolls').textContent=fmt(S.rolls);
  $('found').textContent=Object.keys(S.found).length+' / '+N;
  $('best').textContent=S.best?('1 in '+fmt(S.best.odds)):'none yet';
  $('luck').textContent=effL().toFixed(2).replace(/0$/,'');
  renderMs();
  $('xm').textContent='×'+expMult().toFixed(1);
  renderRebirth();
}
function miniHTML(sq){
  return sq.map(s=>'<span class="'+(s[0]===s[1]?'r ':'')+(s[2]?'m'+s[2]:'')+'">'+SYM[s[0]-1]+'<sub>'+s[1]+'</sub></span>').join('');
}
function listHTML(arr){
  if(!arr.length) return '<li class="empty" style="display:block;border:0;background:none;padding:0">Nothing here yet. Roll to fill this in.</li>';
  return arr.map(p=>{
    return '<li class="t'+tierIdx(p.odds,RT)+'"><span class="mini">'+miniHTML(p.sq)+'</span><span class="od gt">1 in '+fmt(p.odds)+'</span></li>';
  }).join('');
}
function renderLists(){
  $('topList').innerHTML=listHTML(S.top);
  $('recList').innerHTML=listHTML(S.recent);
}
function renderDisc(){
  const ws=Object.keys(S.words).sort(), rs=RXS.filter(r=>S.rx[r.name]);
  $('discInfo').textContent=ws.length+' of '+(WORDS.size+NAMES.size)+' words and names, '+rs.length+' of '+RXS.length+' compounds';
  $('wordList').innerHTML=ws.length?ws.map(w=>'<li>'+w+'<small>×'+S.words[w]+'</small></li>').join(''):'<li style="border:0;background:none;padding:0;color:var(--muted)">None yet. Tiles read left to right, so Ba + Y spells bay.</li>';
  $('rxList').innerHTML=rs.length?rs.map(r=>'<li>'+sub(r.f)+' '+r.name+'<small>×'+S.rx[r.name]+'</small></li>').join(''):'<li style="border:0;background:none;padding:0;color:var(--muted)">None yet. Roll two H and an O to make water.</li>';
  const mk=[];
  for(const m of [1,2,3,4,5,6,11,7,8,12,9,10,13]){
    const map=mutMap(m);
    Object.keys(map).map(Number).sort((a,b)=>a-b).forEach(z=>mk.push('<li class="mk'+m+'">'+MUTN[m]+' '+NAME[z-1]+'<small>×'+map[z]+'</small></li>'));
  }
  const G=[
    [1,'Any single tile has a 1 in '+fmt(1/PLAN_P)+' chance. Once one tile in a roll mutates, the others can get caught in the ripple.',PLAN_M],
    [2,'Any single tile has a 1 in '+fmt(1/STAR_P)+' chance, and the ripple can create Stars too.',STAR_M],
    [5,'3 in 10 Star tiles collapse into a Black Hole.',BH_M],
    [3,'A Planetary and a Star in the same roll collide and every one of them becomes Impact.',IMP_M],
    [4,'When an Impact forms, 1 time in 4 it becomes a Solar System instead.',SYS_M],
    [6,'A Planetary, a Star and a Black Hole in the same roll, each on its own tile. All of them are pulled Beyond Space, and each other tile has a 2 in 5 chance to be dragged in too.',BEY_M],
    [11,'The roll needs 2 or more Beyond Space tiles. Each one then has a 3 in 5 chance to become a Universe.',UNI_M],
    [7,'2 Universe tiles in one roll. Each pair has a 7 in 10 chance to merge into a Multiverse.',MULTI_M],
    [8,'2 Multiverse tiles in one roll. Each pair has a 3 in 10 chance to fuse into an Omniverse.',OMNI_M],
    [12,'Needs at least one rebirth. Every roll has a small chance, higher with each rebirth. All mutated tiles in the roll become Determination (one random tile if none were mutated), and it outranks Omniverse. Never part of The One Before All.',DET_M],
    [9,'2 Omniverse tiles in one roll. Each pair has a 7 in 20 chance to collide into an Absolute.',ABS_M],
    [10,'Once an Absolute forms, every other tile has a 3 in 5 chance to be pulled into it. All six tiles Absolute makes The One Before All.',ONE_M],
    [13,'Determination and The One Before All in the same roll. It came from you, and so did the other. Together it clicks.',SEC_M]];
  $('mutGuide').innerHTML=G.map(r=>{const sec=r[0]===13, found=sec&&Object.keys(S.secs).length>0; if(sec&&!found) return '<li><b>???</b> A secret. Nobody told you how. Find it.</li>'; const p=r[0]===12?detChance(S.rebirths):sec?ODDS[10]*detChance(Math.max(1,S.rebirths)):ODDS[r[0]]; return '<li'+(Object.keys(mutMap(r[0])).length?' class="got"':'')+'><b>'+MUTN[r[0]]+'</b> '+r[1]+'<span class="mgp">'+(sec?('<strong>about 1 in '+fmt(Math.round(1/p))+' rolls at your rebirth level</strong> · pays'):r[0]===12?('<strong>'+(p?pctOf(p)+' per roll now':'Locked until Rebirth 1')+'</strong> (Rebirth 1: 0.0001%, 2: 0.001%, 5: 0.01%, 10: 0.1%) · pays'):('<strong>'+pctOf(p)+' per roll</strong>, about 1 in '+fmt(Math.round(1/p))+' rolls · pays'))+' ×'+fmt(r[2])+' per tile</span></li>';}).join('')
    +'<li class="note">Chances are per roll at base luck. Luck, rebirths and spin milestones all raise them.</li>';
  $('outList').innerHTML=mk.length?mk.join(''):'<li style="border:0;background:none;padding:0;color:var(--muted)">None yet. Any tile can turn Planetary (1 in 5,000) or Star (1 in 10,000), and one mutation can ripple onto the other tiles. A Planetary and a Star in one roll collide into an Impact, and one collision in four forms a Solar System. 3 in 10 Stars collapse into a Black Hole, and all three together become Beyond Space.</li>';
}

/* rolling */
function doRoll(auto){
  if(busy) return;
  mutBoost=1+MS_MUT*msCount(); detP=detChance(S.rebirths);
  const r=rollOnce(effL());
  const gain=Math.max(1,Math.round(Math.pow(r.odds,0.7)*expMult()));
  const p={odds:r.odds,gain:gain,sq:r.sq.map(s=>s.m?[s.z,s.n,s.m]:[s.z,s.n]),bonus:r.bonus,hw:r.hw,hx:r.hx};
  S.exp+=gain; S.life+=gain; S.rolls++; S.tot=(S.tot||0)+1;
  if(MS.indexOf(S.tot)>=0) msToast();
  const notes=[], outs=[];
  for(const s of r.sq) if(s.m){
    outs.push({z:s.z,m:s.m});
    const mp=mutMap(s.m); mp[s.z]=(mp[s.z]||0)+1;
    const nm=MUTN[s.m].toUpperCase()+' '+NAME[s.z-1];
    if(notes.indexOf(nm)<0) notes.push(nm);
  }
  for(const s of p.sq){
    if(!S.found[s[0]]){S.found[s[0]]=0;notes.push(NAME[s[0]-1]);}
    S.found[s[0]]++;
  }
  if(r.word){ if(!S.words[r.word]) notes.push('word "'+r.word+'"'); S.words[r.word]=(S.words[r.word]||0)+1; }
  for(const n of r.rx){ if(!S.rx[n]) notes.push(n); S.rx[n]=(S.rx[n]||0)+1; }
  const rec=!!(S.best&&p.odds>S.best.odds&&p.odds>=REC_MIN);
  if(rec) notes.unshift('NEW RECORD');
  if(!S.best||p.odds>S.best.odds) S.best=p;
  S.top.push(p); S.top.sort((a,b)=>b.odds-a.odds); S.top=S.top.slice(0,5);
  S.recent.unshift(p); S.recent=S.recent.slice(0,6);
  S.last=p;
  const st=(!auto||interval(S.up.speed)>=600)?45:0;
  renderTray(p,true,st);
  renderResult(p,notes,true);
  p.sq.forEach(s=>paintCell(s[0]));
  renderWallet(); renderLists(); renderDisc(); updateUps(); save();
  markDirty();
  if(outs.length) playCutscene(p,outs,outs.some(o=>o.m===13)?'secret':outs.some(o=>o.m===10)?'one':outs.some(o=>o.m===9)?'absolute':outs.some(o=>o.m===12)?'determination':outs.some(o=>o.m===8)?'omniverse':outs.some(o=>o.m===7)?'multiverse':outs.some(o=>o.m===11)?'universe':outs.some(o=>o.m===6)?'beyond':outs.some(o=>o.m===4)?'system':outs.some(o=>o.m===3)?'impact':outs.some(o=>o.m===5)?'blackhole':outs.some(o=>o.m===2)?'star':'planetary',false);
  if(rec){ if(outs.length) pendingBoost=true; else startBoost(); }
}

let timer=null, busy=false;
function schedule(){
  clearTimeout(timer);
  if(!busy&&S.autoOn&&S.up.auto>0){
    timer=setTimeout(()=>{doRoll(true);schedule();},interval(S.up.speed));
  }
}

/* odds sheet */
function buildSheet(){
  const rows=[];
  const grp=(label,m)=>{for(const k of Object.keys(m)) rows.push([label.replace('#',k),'×'+fmt(m[k])]);};
  grp('# of the same element',EL_M);
  grp('# of the same number',TG_M);
  rows.push(['Resonance (number equals atomic number), each','×'+RES_M]);
  grp('Run of # consecutive atomic numbers',RZ_M);
  grp('Run of # consecutive numbers',RN_M);
  rows.push(['Element mirror (reads the same both ways)','×'+MIR_E]);
  rows.push(['Number mirror','×'+fmt(MIR_N)]);
  for(const k of Object.keys(PAT_E)) rows.push(['Element pattern '+k,'×'+fmt(PAT_E[k])]);
  for(const k of Object.keys(PAT_N)) rows.push(['Number pattern '+k,'×'+fmt(PAT_N[k])]);
  grp('Word or name spelled by tile symbols, # letters',WD_M);
  grp('Name kin: # elements whose names start with the same two letters',KIN_M);
  rows.push(['Number joins: a tile\'s number equals another tile\'s atomic number, each','×'+LINK_M]);
  for(const c of CODES) rows.push(['Joined digits contain '+c[0],'×'+fmt(c[1])]);
  rows.push(['Family: 4, 5 or 6 tiles from one family (noble gas, halogen, alkali metal, alkaline earth, coinage metal)','×'+FAM_M[4]+', ×'+fmt(FAM_M[5])+', ×'+fmt(FAM_M[6])]);
  rows.push(['Lucky sum: the six numbers add up to '+SUM_N,'×'+fmt(SUM_M)]);
  rows.push(['Palindrome joined digits','×'+fmt(PAL_N)]);
  grp('Compound using # atoms',RX_M);
  rows.push(['Planetary tile (base 1 in '+fmt(1/PLAN_P)+' per tile, luck raises it), each','×'+fmt(PLAN_M)]);
  rows.push(['Star tile (base 1 in '+fmt(1/STAR_P)+' per tile, luck raises it), each','×'+fmt(STAR_M)]);
  rows.push(['Impact tile (a Planetary and a Star in the same roll collide), each','×'+fmt(IMP_M)]);
  rows.push(['Solar System tile (one collision in four becomes this instead of an Impact), each','×'+fmt(SYS_M)]);
  rows.push(['Black Hole tile (3 in 10 Star tiles collapse into one), each','×'+fmt(BH_M)]);
  rows.push(['Beyond Space tile (a Planetary, a Star and a Black Hole in one roll), each','×'+fmt(BEY_M)]);
  rows.push(['Universe tile (with 2 or more Beyond Space tiles, each one has a 3 in 5 chance), each','×'+fmt(UNI_M)]);
  rows.push(['Multiverse tile (2 Universe tiles merge, 7 in 10 chance per pair), each','×'+fmt(MULTI_M)]);
  rows.push(['Omniverse tile (2 Multiverse tiles fuse, 3 in 10 chance per pair), each','×'+fmt(OMNI_M)]);
  rows.push(['Determination tile (after a rebirth: 0.0001% a roll at Rebirth 1 up to 0.1% at Rebirth 10; outranks Omniverse), each','×'+fmt(DET_M)]);
  if(Object.keys(S.secs).length) rows.push(['??? tile (Determination and The One Before All in one roll), each','×'+fmt(SEC_M)]);
  rows.push(['Absolute tile (2 Omniverse tiles collide, 7 in 20 chance per pair), each','×'+fmt(ABS_M)]);
  rows.push(['The One Before All tile (all six tiles end up Absolute), each','×'+fmt(ONE_M)]);
  const tiers=TNAME.map((n,i)=>'<li class="t'+i+'"><span class="gt">'+n+(i<RT.length?' under '+fmt(RT[i]):' from '+fmt(RT[RT.length-1]))+'</span></li>').join('');
  $('sheetBody').innerHTML=
    '<p>Each tile draws an element weighted by how common it is: hydrogen turns up about 1 in '+fmt(elOdds(1))+' tiles, oganesson about 1 in '+fmt(elOdds(N))+'. It also draws a number from 1 to '+N+'. The six element odds are multiplied, then raised to the power 0.16. Every combo below then multiplies the result.</p>'
    +'<p>Words and names read the tile symbols left to right, so Co + Dy spells cody. Compounds need the right count of each element anywhere in the tray, so H, O, H makes water. Joined digits glue the six numbers together in order.</p>'
    +'<div class="scroll"><table><thead><tr><th>Combo</th><th>Bonus</th></tr></thead><tbody>'
    +rows.map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>').join('')
    +'</tbody></table></div>'
    +'<p>Seventeen roll tiers:</p><ul class="tierlist">'+tiers+'</ul>'
    +'<p>Each roll pays EXP equal to its odds raised to the power 0.7. Level rises with lifetime EXP.</p>'
    +'<p>Planetary, Star, Impact and Solar System tiles are rare mutations of any element. One collision in four forms a Solar System instead of an Impact, so it is four times rarer and pays far more. Three Stars in ten collapse into a Black Hole instead. If a Planetary, a Star and a Black Hole all show up in the same roll, they are pulled together into Beyond Space. From there a roll can climb to Universe, Multiverse, Omniverse and Absolute, and when all six tiles are Absolute they become The One Before All, the rarest mutation of all. Spin milestones (100 rolls up to 1,000,000, kept through rebirths) each add a little luck and mutation chance. When a cutscene ends the game carries on by itself after 10 seconds if you have not pressed Continue. Each has its own cutscene before a six reel slot machine, and none can be skipped. Rebirth costs start at '+fmt(rbCost(0))+' EXP and grow 3 times with each rebirth, up to '+RB_MAX+'. Each rebirth resets all upgrades, Lucky isotopes included, but adds 0.5 luck and a 0.5 EXP bonus for good. The third rebirth gives a free Auto-roller. A new best roll of at least 1 in '+fmt(REC_MIN)+' gives +'+BOOST_LUCK+' luck for '+(BOOST_MS/1000)+' seconds.</p>';
}

/* leaderboard */
let DB=null, USER=null, myId=null, canPost=false, postBlocked=false, boardReady=false, gotSnap=false;
let boardRows=[], lbMode='life', lbTok=0, lbTimer=null;
let dirty=false, writing=false;

function markDirty(){dirty=true;}
function payload(){
  return {
    life:S.life, level:levelOf(S.life), rolls:S.rolls, found:Object.keys(S.found).length, rebirths:S.rebirths,
    bestOdds:S.best?S.best.odds:0, bestSq:S.best?S.best.sq:[], at:Date.now()
  };
}
async function flush(){
  if(!dirty||writing||!canPost||postBlocked||!DB||!myId) return;
  writing=true; dirty=false;
  try{
    await DB.doc('board/'+myId).set(payload());
  }catch(e){
    if(e&&e.code==='invalid_argument'){postBlocked=true;}
    else dirty=true;
    setNote();
  }
  writing=false;
}
function cleanRow(id,d){
  if(!d||typeof d!=='object') return null;
  const num=v=>(typeof v==='number'&&isFinite(v)&&v>=0&&v<1e300)?v:0;
  let sq=null;
  if(Array.isArray(d.bestSq)&&d.bestSq.length===6){
    const ok=d.bestSq.every(s=>Array.isArray(s)&&(s.length===2||s.length===3)&&Number.isInteger(s[0])&&Number.isInteger(s[1])&&s[0]>=1&&s[0]<=N&&s[1]>=1&&s[1]<=N);
    if(ok) sq=d.bestSq.map(s=>[s[0],s[1],(s[2]>=1&&s[2]<=13)?s[2]:0]);
  }
  return {id:String(id),life:num(d.life),bestOdds:num(d.bestOdds),level:Math.floor(num(d.level)),rolls:Math.floor(num(d.rolls)),found:Math.floor(num(d.found)),rebirths:Math.min(RB_MAX,Math.floor(num(d.rebirths))),sq:sq};
}
function setNote(){
  const n=$('lbNote');
  if(!boardReady){n.textContent='Connecting to the leaderboard…';return;}
  if(!DB){n.textContent='The shared leaderboard is not available in this view, so your best rolls on this device are shown instead.';return;}
  if(!myId){n.textContent='Your account has no identity on this page, so your score cannot be posted. You can still view the board.';return;}
  if(canPost===false||postBlocked){n.textContent='You can view the leaderboard. Posting a score needs Contributor access to this page.';return;}
  if(!gotSnap){n.textContent='Connecting to the leaderboard…';return;}
  n.textContent='Your score posts automatically every few seconds while you play.';
}
function miniEl(sq){
  const box=document.createElement('span'); box.className='sub';
  for(const s of sq){
    const sp=document.createElement('span');
    if(s[2]>=1&&s[2]<=13) sp.className='m'+s[2];
    sp.appendChild(document.createTextNode(SYM[s[0]-1]));
    const sb=document.createElement('sub'); sb.textContent=String(s[1]); sp.appendChild(sb);
    box.appendChild(sp);
  }
  return box;
}
function renderLocalBoard(){
  const ol=$('lbList'), o2=$('lbList2'); ol.textContent=''; o2.textContent='';
  const li0=document.createElement('li'); li0.className='me';
  const rk0=document.createElement('span'); rk0.className='rk'; rk0.textContent='1';
  const w0=document.createElement('div'); w0.className='who'; const n0=document.createElement('span'); n0.className='nmx'; n0.textContent='Your record'; w0.appendChild(n0);
  const v0=document.createElement('span'); v0.className='val'; v0.textContent=fmt(S.life)+' EXP'; li0.appendChild(rk0); li0.appendChild(w0); li0.appendChild(v0); ol.appendChild(li0);
  if(!S.top.length){ const li=document.createElement('li'); li.className='empty'; li.textContent='Roll to set your first record.'; o2.appendChild(li); return; }
  S.top.forEach((p,i)=>{
    const li=document.createElement('li'); li.className='me';
    const rk=document.createElement('span'); rk.className='rk'; rk.textContent=String(i+1);
    const who=document.createElement('div'); who.className='who';
    const nm=document.createElement('span'); nm.className='nmx'; nm.textContent='Your record';
    who.appendChild(nm); who.appendChild(miniEl(p.sq));
    const val=document.createElement('span'); val.className='val'; val.textContent='1 in '+fmt(p.odds);
    li.appendChild(rk); li.appendChild(who); li.appendChild(val); o2.appendChild(li);
  });
}
async function renderBoard(){
  const tok=++lbTok;
  if(boardReady&&!DB){ renderLocalBoard(); return; }
  const lifeRows=boardRows.filter(r=>r.life>0).sort((a,b)=>b.life-a.life).slice(0,15), bestRows=boardRows.filter(r=>r.bestOdds>0).sort((a,b)=>b.bestOdds-a.bestOdds).slice(0,15);
  const ids=[...new Set(lifeRows.concat(bestRows).map(r=>r.id))]; let ps={};
  if(USER&&ids.length){ try{ ps=await USER.profiles(ids); }catch(e){ ps={}; } }
  if(tok!==lbTok) return;
  const fill=(ol,rows,mode)=>{
    ol.textContent='';
    if(!rows.length){ const li=document.createElement('li'); li.className='empty'; li.textContent=boardReady&&DB?'No scores yet. Roll a few times to be the first on the board.':''; ol.appendChild(li); return; }
    rows.forEach((r,i)=>{
      const li=document.createElement('li'); if(r.id===myId) li.className='me';
      const rk=document.createElement('span'); rk.className='rk'; rk.textContent=String(i+1);
      const who=document.createElement('div'); who.className='who';
      const nm=document.createElement('span'); nm.className='nmx'; const p=ps[r.id]; nm.textContent=(p&&p.name)||'Player';
      if(r.id===myId){ const em=document.createElement('em'); em.textContent='you'; nm.appendChild(em); }
      who.appendChild(nm);
      if(mode==='best'&&r.sq){ who.appendChild(miniEl(r.sq)); }
      else{ const sb=document.createElement('span'); sb.className='sub'; sb.textContent=(r.rebirths?('Rebirth '+r.rebirths+' · '):'')+'Level '+r.level+' · '+fmt(r.rolls)+' rolls · '+r.found+' elements'; who.appendChild(sb); }
      const val=document.createElement('span'); val.className='val'; val.textContent=mode==='life'?(fmt(r.life)+' EXP'):('1 in '+fmt(r.bestOdds));
      li.appendChild(rk); li.appendChild(who); li.appendChild(val); ol.appendChild(li);
    });
  };
  fill($('lbList'),lifeRows,'life'); fill($('lbList2'),bestRows,'best');
}
async function initBoard(){
  try{
    const c=window.claude;
    if(c&&typeof c.use==='function'){
      USER=await c.use('user');
      DB=await c.use('db');
    }
  }catch(e){ USER=null; DB=null; }
  boardReady=true;
  if(USER){
    try{ myId=await USER.id(); }catch(e){ myId=null; }
    try{ canPost=(await USER.can('data.write'))!==false; }catch(e){ canPost=true; }
  }
  setNote();
  if(!DB){ renderBoard(); return; }
  lbTimer=setTimeout(()=>{ if(!gotSnap) $('lbNote').textContent='The leaderboard is slow to answer. Your progress is still saved on this device.'; },10000);
  try{
    DB.collection('board').limit(200).onSnapshot(snap=>{
      gotSnap=true; clearTimeout(lbTimer);
      boardRows=snap.docs.map(d=>cleanRow(d.id,d.data())).filter(Boolean);
      setNote(); renderBoard();
    },err=>{
      clearTimeout(lbTimer);
      $('lbNote').textContent='The leaderboard is unavailable right now.';
    });
  }catch(e){ $('lbNote').textContent='The leaderboard is unavailable right now.'; }
  if(S.rolls>0) markDirty();
  setInterval(flush,8000);
  document.addEventListener('visibilitychange',()=>{ if(document.hidden) flush(); });
}

/* sound */
let AC=null, muted=false;
try{ muted=localStorage.getItem('periodic-roll-mute')==='1'; }catch(e){}
function actx(){
  if(AC) return AC;
  try{ const C=window.AudioContext||window.webkitAudioContext; if(C) AC=new C(); }catch(e){}
  return AC;
}
function unlock(){
  const a=actx();
  if(a&&a.state==='suspended'){ try{ a.resume(); }catch(e){} }
}
document.addEventListener('pointerdown',unlock,{passive:true});
document.addEventListener('keydown',unlock,{passive:true});
function beep(freq,at,dur,type,vol,det){
  const a=AC; if(!a||muted||a.state!=='running') return;
  try{
    const t=a.currentTime+at, o=a.createOscillator(), g=a.createGain();
    o.type=type; o.frequency.setValueAtTime(freq,t); if(det) o.detune.value=det;
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(vol,t+0.012);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t+dur+0.05);
  }catch(e){}
}
function sndTick(){ beep(1100+Math.random()*350,0,0.035,'square',0.022); }
function sndReel(i){ beep(120+i*26,0,0.2,'triangle',0.15); beep(60+i*13,0,0.26,'sine',0.13); beep(700+i*90,0,0.05,'square',0.025); }
function noiseBuf(a){
  const len=a.sampleRate*2, b=a.createBuffer(1,len,a.sampleRate), d=b.getChannelData(0);
  for(let i=0;i<len;i++) d[i]=Math.random()*2-1;
  return b;
}
function sndWarp(){
  const a=AC; if(!a||muted||a.state!=='running') return;
  try{
    const src=a.createBufferSource(); src.buffer=noiseBuf(a); src.loop=true;
    const bp=a.createBiquadFilter(), g=a.createGain(), t=a.currentTime;
    bp.type='bandpass'; bp.Q.value=1.2;
    bp.frequency.setValueAtTime(200,t); bp.frequency.exponentialRampToValueAtTime(4200,t+1.5); bp.frequency.exponentialRampToValueAtTime(300,t+2.6);
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.15,t+1.4); g.gain.exponentialRampToValueAtTime(0.0001,t+2.7);
    src.connect(bp); bp.connect(g); g.connect(a.destination); src.start(t); src.stop(t+2.8);
  }catch(e){}
}
let amb=null;
function startAmb(f1,f2){
  stopAmb();
  const a=AC; if(!a||muted||a.state!=='running') return;
  try{
    const t=a.currentTime, g=a.createGain(), f=a.createBiquadFilter(), lfo=a.createOscillator(), lg=a.createGain();
    const o1=a.createOscillator(), o2=a.createOscillator();
    o1.type='sine'; o1.frequency.value=f1||55; o2.type='sine'; o2.frequency.value=f2||82.41; o2.detune.value=7;
    f.type='lowpass'; f.frequency.value=420; lfo.frequency.value=0.18; lg.gain.value=220;
    lfo.connect(lg); lg.connect(f.frequency);
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.09,t+1.4);
    o1.connect(f); o2.connect(f); f.connect(g); g.connect(a.destination);
    o1.start(t); o2.start(t); lfo.start(t);
    amb={g:g,o1:o1,o2:o2,lfo:lfo};
  }catch(e){ amb=null; }
}
function stopAmb(){
  if(!amb) return;
  try{
    const t=AC.currentTime;
    amb.g.gain.cancelScheduledValues(t);
    amb.g.gain.setValueAtTime(Math.max(0.0001,amb.g.gain.value),t);
    amb.g.gain.exponentialRampToValueAtTime(0.0001,t+1.2);
    amb.o1.stop(t+1.3); amb.o2.stop(t+1.3); amb.lfo.stop(t+1.3);
  }catch(e){}
  amb=null;
}
function echoPing(freq,at,dur,vol){ beep(freq,at,dur,'sine',vol); beep(freq,at+0.25,dur,'sine',vol*0.5); beep(freq,at+0.5,dur,'sine',vol*0.25); }
function sndWin(kind){
  const bass=kind==='star'?[98,146.83,196,293.66]:kind==='impact'?[82.41,123.47,164.81,246.94]:kind==='system'?[130.81,196,261.63,392]:kind==='blackhole'?[55,82.41,110,164.81]:kind==='beyond'?[87.31,130.81,174.61,261.63]:kind==='multiverse'?[73.42,110,146.83,220]:kind==='omniverse'?[55,82.41,110,164.81]:kind==='absolute'?[65.41,98,130.81,196]:kind==='one'?[32.7,49,65.41,98]:[110,164.81,220,329.63];
  bass.forEach(f=>{ beep(f,0,2.6,'triangle',0.06,-6); beep(f,0,2.6,'triangle',0.06,6); });
  const arp=kind==='star'?[392,493.88,587.33,783.99,987.77,1174.66]:kind==='impact'?[440,554.37,659.25,880,1108.73,1318.51]:kind==='system'?[392,587.33,783.99,1174.66,1567.98,2349.32]:kind==='blackhole'?[293.66,349.23,440,523.25,659.25,880]:kind==='beyond'?[523.25,659.25,783.99,1046.5,1318.5,1567.98,2093]:kind==='multiverse'?[587.33,739.99,880,1174.66,1479.98,1760]:kind==='omniverse'?[440,659.25,880,1318.5,1760,2637]:kind==='absolute'?[523.25,783.99,1046.5,1568,2093,3136]:kind==='one'?[261.63,523.25,1046.5,2093,4186,523.25]:[523.25,659.25,783.99,987.77,1174.66,1318.5];
  arp.forEach((f,i)=>echoPing(f,0.15+i*0.14,0.5,0.045));
  for(let i=0;i<8;i++) beep(2200+Math.random()*2600,0.9+i*0.08,0.14,'sine',0.018);
}
function sndRumble(secs,peak){
  const a=AC; if(!a||muted||a.state!=='running') return;
  try{
    const t=a.currentTime, src=a.createBufferSource(); src.buffer=noiseBuf(a); src.loop=true;
    const lp=a.createBiquadFilter(), g=a.createGain(), o=a.createOscillator(), og=a.createGain();
    lp.type='lowpass'; lp.frequency.setValueAtTime(70,t); lp.frequency.exponentialRampToValueAtTime(520,t+secs);
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(peak,t+secs); g.gain.exponentialRampToValueAtTime(0.0001,t+secs+0.15);
    o.type='sine'; o.frequency.setValueAtTime(36,t); o.frequency.exponentialRampToValueAtTime(78,t+secs);
    og.gain.setValueAtTime(0.0001,t); og.gain.exponentialRampToValueAtTime(peak*0.7,t+secs); og.gain.exponentialRampToValueAtTime(0.0001,t+secs+0.15);
    src.connect(lp); lp.connect(g); g.connect(a.destination); o.connect(og); og.connect(a.destination);
    src.start(t); src.stop(t+secs+0.25); o.start(t); o.stop(t+secs+0.25);
  }catch(e){}
}
function sndWhoosh(secs,peak){
  const a=AC; if(!a||muted||a.state!=='running') return;
  try{
    const t=a.currentTime, src=a.createBufferSource(); src.buffer=noiseBuf(a); src.loop=true;
    const bp=a.createBiquadFilter(), g=a.createGain();
    bp.type='bandpass'; bp.Q.value=0.9;
    bp.frequency.setValueAtTime(250,t); bp.frequency.exponentialRampToValueAtTime(2600,t+secs);
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(peak,t+secs*0.85); g.gain.exponentialRampToValueAtTime(0.0001,t+secs+0.1);
    src.connect(bp); bp.connect(g); g.connect(a.destination); src.start(t); src.stop(t+secs+0.2);
  }catch(e){}
}
function sndBoom(){
  const a=AC; if(!a||muted||a.state!=='running') return;
  try{
    const t=a.currentTime, src=a.createBufferSource(); src.buffer=noiseBuf(a); src.loop=true;
    const lp=a.createBiquadFilter(), g=a.createGain(), o=a.createOscillator(), og=a.createGain();
    lp.type='lowpass'; lp.frequency.setValueAtTime(5200,t); lp.frequency.exponentialRampToValueAtTime(60,t+1.4);
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.42,t+0.015); g.gain.exponentialRampToValueAtTime(0.0001,t+1.5);
    o.type='sine'; o.frequency.setValueAtTime(160,t); o.frequency.exponentialRampToValueAtTime(28,t+1.3);
    og.gain.setValueAtTime(0.0001,t); og.gain.exponentialRampToValueAtTime(0.45,t+0.02); og.gain.exponentialRampToValueAtTime(0.0001,t+1.5);
    src.connect(lp); lp.connect(g); g.connect(a.destination); o.connect(og); og.connect(a.destination);
    src.start(t); src.stop(t+1.6); o.start(t); o.stop(t+1.6);
  }catch(e){}
}
function sndSystem(){
  sndBoom();
  [261.63,329.63,392,523.25,659.25,783.99].forEach((f,i)=>{ beep(f,0.05+i*0.07,1.7,'sine',0.05); beep(f*2,0.07+i*0.07,1.2,'triangle',0.022); });
}
function sndHole(){
  const a=AC; if(!a||muted||a.state!=='running') return;
  try{
    const t=a.currentTime, src=a.createBufferSource(); src.buffer=noiseBuf(a); src.loop=true;
    const bp=a.createBiquadFilter(), g=a.createGain(), o=a.createOscillator(), og=a.createGain();
    bp.type='bandpass'; bp.Q.value=1.4;
    bp.frequency.setValueAtTime(3200,t); bp.frequency.exponentialRampToValueAtTime(70,t+1.6);
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.2,t+0.15); g.gain.exponentialRampToValueAtTime(0.0001,t+1.8);
    o.type='sine'; o.frequency.setValueAtTime(220,t); o.frequency.exponentialRampToValueAtTime(24,t+1.7);
    og.gain.setValueAtTime(0.0001,t); og.gain.exponentialRampToValueAtTime(0.35,t+0.2); og.gain.exponentialRampToValueAtTime(0.0001,t+1.9);
    src.connect(bp); bp.connect(g); g.connect(a.destination); o.connect(og); og.connect(a.destination);
    src.start(t); src.stop(t+1.9); o.start(t); o.stop(t+2);
  }catch(e){}
}
function sndBeyond(){
  sndBoom();
  [196,246.94,329.63,392,493.88,659.25,783.99,987.77].forEach((f,i)=>{ beep(f,0.05+i*0.05,2.2,'sine',0.045); beep(f*1.5,0.1+i*0.05,1.6,'triangle',0.02,i*3); });
  for(let i=0;i<10;i++) beep(1800+i*380,0.4+i*0.05,0.3,'sine',0.02);
}
function sndMulti(){
  sndBoom();
  for(let i=0;i<14;i++) beep(500+Math.random()*1800,0.05+i*0.06,0.18,'sine',0.04);
  [261.63,329.63,392,523.25,659.25,783.99,1046.5].forEach((f,i)=>{ beep(f,0.1+i*0.05,2.0,'triangle',0.035,i*4); });
}
function sndUni(){
  sndBoom();
  for(let i=0;i<10;i++) beep(400+i*180,0.04+i*0.07,0.4,'sine',0.03);
  [196,246.94,293.66,392,493.88,587.33,783.99].forEach((f,i)=>{ beep(f,0.1+i*0.06,2.4,'triangle',0.035,i*3); });
}
function sndOmni(){
  sndBoom(); sndRumble(1.2,0.18);
  [110,165,220,330,440,660,880,1320].forEach((f,i)=>{ beep(f,0.0+i*0.06,2.8,'sine',0.045); beep(f*1.005,0.0+i*0.06,2.8,'sine',0.03); });
  for(let i=0;i<12;i++) beep(1500+i*260,0.3+i*0.07,0.5,'sine',0.02);
}
function sndAbsolute(){
  sndCrash(); setTimeout(sndCrash,160);
  beep(55,0.1,3.2,'sine',0.12); beep(110,0.1,3.2,'sine',0.07);
  [440,554.37,659.25,880].forEach((f,i)=>beep(f,0.9+i*0.01,3.0,'sine',0.035));
}
function sndOne(){
  beep(41.2,0,0.5,'sine',0.2); beep(41.2,0.7,0.5,'sine',0.2); beep(41.2,1.3,0.5,'sine',0.2);
  sndBoom(); sndCrash();
  [65.41,98,130.81,196,261.63,392,523.25,784,1046.5,1568].forEach((f,i)=>{ beep(f,0.2+i*0.08,3.6,'sine',0.04); beep(f*1.003,0.2+i*0.08,3.6,'triangle',0.02); });
}
/* ===== "The One Before All": an original tragic orchestral score, synthesised live (D minor) ===== */
let score=null;
function noiseOne(a,secs){ const len=Math.floor(a.sampleRate*secs), b=a.createBuffer(1,len,a.sampleRate), d=b.getChannelData(0); for(let i=0;i<len;i++) d[i]=Math.random()*2-1; return b; }
function whenRunning(fn){ const a=actx(); if(!a||muted) return; if(a.state==='running'){ fn(); return; } try{ const p=a.resume(); if(p&&p.then) p.then(()=>{ if(a.state==='running') fn(); }).catch(()=>{}); }catch(e){} }
function playScore(){ whenRunning(playScoreInner); }
function playScoreInner(){
  const a=AC; if(!a||muted||a.state!=='running') return; stopScore();
  const T0=a.currentTime+0.05, m=a.createGain(), dry=a.createGain(), wet=a.createGain(), cv=a.createConvolver();
  m.gain.value=0.0001; m.gain.setTargetAtTime(1,T0,0.6); dry.gain.value=0.62; wet.gain.value=0.7;
  const len=Math.floor(a.sampleRate*3.6), ib=a.createBuffer(2,len,a.sampleRate);
  for(let c=0;c<2;c++){ const d=ib.getChannelData(c); for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.4); }
  cv.buffer=ib; m.connect(dry); m.connect(cv); cv.connect(wet); dry.connect(a.destination); wet.connect(a.destination);
  const nodes=[]; score={m:m,nodes:nodes,wet:wet,dry:dry};
  const env=(gn,t,att,dur,rel,vol)=>{ gn.gain.setValueAtTime(0.0001,t); gn.gain.linearRampToValueAtTime(vol,t+att); gn.gain.setValueAtTime(vol,t+Math.max(att,dur-rel)); gn.gain.linearRampToValueAtTime(0.0001,t+dur+rel*0.2); };
  const strings=(f,at,dur,vol,att)=>{
    const t=T0+at, g=a.createGain(), lp=a.createBiquadFilter(), lfo=a.createOscillator(), lg=a.createGain();
    lp.type='lowpass'; lp.frequency.value=Math.min(3200,f*5+700); lp.Q.value=0.4;
    lfo.frequency.value=5.1; lg.gain.setValueAtTime(0,t); lg.gain.linearRampToValueAtTime(7,t+Math.min(1.2,dur*0.6));
    lfo.connect(lg);
    env(g,t,att||0.7,dur,1.1,vol);
    for(const dt of [-8,8]){ const o=a.createOscillator(); o.type='sawtooth'; o.frequency.value=f; o.detune.value=dt; lg.connect(o.detune); o.connect(lp); o.start(t); o.stop(t+dur+1.4); nodes.push(o); }
    lp.connect(g); g.connect(m); lfo.start(t); lfo.stop(t+dur+1.4); nodes.push(lfo);
  };
  const brass=(f,at,dur,vol)=>{
    const t=T0+at, g=a.createGain(), lp=a.createBiquadFilter(), o=a.createOscillator(), o2=a.createOscillator();
    o.type='sawtooth'; o.frequency.value=f; o2.type='square'; o2.frequency.value=f; o2.detune.value=5;
    lp.type='lowpass'; lp.Q.value=1.2; lp.frequency.setValueAtTime(300,t); lp.frequency.linearRampToValueAtTime(1900,t+0.9); lp.frequency.linearRampToValueAtTime(700,t+dur);
    env(g,t,0.35,dur,1.0,vol); o.connect(lp); o2.connect(lp); lp.connect(g); g.connect(m); o.start(t); o2.start(t); o.stop(t+dur+1.3); o2.stop(t+dur+1.3); nodes.push(o,o2);
  };
  const choir=(f,at,dur,vol)=>{
    const t=T0+at, g=a.createGain(); env(g,t,1.0,dur,1.4,vol); g.connect(m);
    const src=a.createGain(); src.gain.value=1;
    for(const dt of [-10,0,11]){ const o=a.createOscillator(); o.type='sawtooth'; o.frequency.value=f; o.detune.value=dt; o.connect(src); o.start(t); o.stop(t+dur+1.6); nodes.push(o); }
    [[720,0.9],[1150,0.6],[2700,0.25]].forEach(fm=>{ const b=a.createBiquadFilter(); b.type='bandpass'; b.frequency.value=fm[0]; b.Q.value=7; const q=a.createGain(); q.gain.value=fm[1]; src.connect(b); b.connect(q); q.connect(g); });
  };
  const pluck=(f,at,vol)=>{
    const t=T0+at, g=a.createGain(), o=a.createOscillator(), o2=a.createOscillator();
    o.type='triangle'; o.frequency.value=f; o2.type='sine'; o2.frequency.value=f*2;
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+0.01); g.gain.exponentialRampToValueAtTime(0.0001,t+2.2);
    o.connect(g); o2.connect(g); g.connect(m); o.start(t); o2.start(t); o.stop(t+2.3); o2.stop(t+2.3); nodes.push(o,o2);
  };
  const timp=(f,at,vol)=>{
    const t=T0+at, g=a.createGain(), o=a.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(f*1.9,t); o.frequency.exponentialRampToValueAtTime(f,t+0.16);
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+0.01); g.gain.exponentialRampToValueAtTime(0.0001,t+1.6);
    o.connect(g); g.connect(m); o.start(t); o.stop(t+1.7); nodes.push(o);
    const n=a.createBufferSource(), nf=a.createBiquadFilter(), ng=a.createGain(); n.buffer=noiseOne(a,0.3); nf.type='lowpass'; nf.frequency.value=700; ng.gain.setValueAtTime(vol*0.8,t); ng.gain.exponentialRampToValueAtTime(0.0001,t+0.18); n.connect(nf); nf.connect(ng); ng.connect(m); n.start(t); nodes.push(n);
  };
  const swell=(at,dur,peak)=>{
    const t=T0+at, n=a.createBufferSource(), hp=a.createBiquadFilter(), g=a.createGain(); n.buffer=noiseOne(a,dur+3.2); hp.type='highpass'; hp.frequency.value=4200;
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(peak,t+dur); g.gain.exponentialRampToValueAtTime(0.0001,t+dur+3);
    n.connect(hp); hp.connect(g); g.connect(m); n.start(t); nodes.push(n);
  };
  /* harmony: Dm, Bb, A7 tension, then the full orchestra at the crack (7.6 s), and a slow fall back to Dm */
  const chord=(list,at,dur,vol)=>list.forEach(f=>strings(f,at,dur,vol));
  const Dm=[73.42,110,146.83,174.61,220], Bb=[58.27,87.31,116.54,146.83,174.61], Gm=[49,73.42,98,116.54,146.83], A7=[55,110,138.59,164.81,196];
  strings(73.42,0,7.4,0.05,1.8); strings(110,0.4,7,0.03,1.8);
  chord(Dm,0.8,3.4,0.016); chord(Bb,3.6,3.0,0.017); chord(A7,6.1,1.8,0.02);
  chord([73.42,146.83,220,293.66,349.23,440],7.6,4.6,0.026); brass(73.42,7.6,3.6,0.05); brass(146.83,7.6,3.4,0.04); brass(220,7.7,3.2,0.03);
  choir(146.83,7.6,4.6,0.04); choir(220,7.6,4.6,0.035); choir(293.66,7.6,4.6,0.03); choir(349.23,7.6,4.6,0.03);
  chord([58.27,116.54,174.61,233.08,293.66,349.23],12.0,3.6,0.022); choir(233.08,12.0,3.6,0.028); choir(293.66,12.0,3.6,0.026);
  chord([49,98,146.83,196,233.08,293.66],15.4,3.4,0.02);
  chord(A7,18.7,1.9,0.02); chord([73.42,146.83,220,293.66,349.23],20.6,6.5,0.02); choir(293.66,20.6,6.5,0.024); choir(349.23,20.6,6.5,0.02);
  /* the lonely violin line */
  [[1.0,440,2.4,0.03],[3.5,466.16,1.2,0.03],[4.7,440,1.0,0.03],[5.7,392,1.4,0.032],[7.0,554.37,0.8,0.034],[7.6,587.33,2.6,0.05],[10.3,698.46,1.2,0.045],[11.5,659.25,1.0,0.042],[12.5,587.33,1.7,0.045],[14.2,466.16,1.4,0.04],[15.6,440,1.4,0.038],[17.1,392,1.6,0.036],[18.8,329.63,1.6,0.034],[20.7,293.66,5.5,0.04]].forEach(n=>strings(n[1],n[0],n[2],n[3],0.45));
  /* harp-like plucks while the nine mutations appear */
  [293.66,349.23,392,440,523.25,587.33,698.46,783.99,880,1046.5].forEach((f,i)=>pluck(f,1.66+i*0.4,0.05));
  /* timpani roll into the crack */
  for(let k=0;k<9;k++) timp(73.42,5.7+k*0.22,0.05+k*0.018);
  timp(55,7.6,0.34); timp(73.42,7.62,0.26); timp(55,12.0,0.16); timp(55,15.4,0.14); timp(73.42,20.6,0.1);
  swell(5.6,2.0,0.05);
  nodes.push({stop:function(){}});
}
function stopScore(){
  if(!score) return; const a=AC, s=score; score=null;
  try{ const t=a.currentTime; s.m.gain.cancelScheduledValues(t); s.m.gain.setValueAtTime(Math.max(0.0001,s.m.gain.value),t); s.m.gain.exponentialRampToValueAtTime(0.0001,t+1.2);
    setTimeout(()=>{ s.nodes.forEach(o=>{ try{ o.stop(); }catch(e){} }); try{ s.m.disconnect(); }catch(e){} },1500); }catch(e){}
}
/* ===== one original soundtrack per cutscene, synthesised live and timed to its picture ===== */
function playTheme(kind){ whenRunning(()=>{ try{ playThemeInner(kind); }catch(e){ console.warn('theme',kind,e&&e.message); } }); }
function playThemeInner(kind){
  const a=AC; if(!a||muted||a.state!=='running') return; stopScore();
  const T0=a.currentTime+0.04, m=a.createGain(), dry=a.createGain(), wet=a.createGain(), cv=a.createConvolver();
  m.gain.value=0.0001; m.gain.setTargetAtTime(kind==='secret'?1.8:kind==='determination'?1.7:0.8,T0,0.15); dry.gain.value=0.75; wet.gain.value=0.45;
  const len=Math.floor(a.sampleRate*2.6), ib=a.createBuffer(2,len,a.sampleRate);
  for(let c=0;c<2;c++){ const d=ib.getChannelData(c); for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6); }
  cv.buffer=ib; m.connect(dry); m.connect(cv); cv.connect(wet); let bus=a.destination; if(kind==='secret'||kind==='determination'){ try{ const lim=a.createDynamicsCompressor(); lim.threshold.value=-12; lim.knee.value=10; lim.ratio.value=4; lim.attack.value=0.001; lim.release.value=0.25; const pg2=a.createGain(); pg2.gain.value=1.0; const ws=a.createWaveShaper(), cv2=new Float32Array(1024); for(let i=0;i<1024;i++){ cv2[i]=Math.tanh((i/511.5-1)*1.1); } ws.curve=cv2; lim.connect(pg2); pg2.connect(ws); ws.connect(a.destination); bus=lim; }catch(e){} } dry.connect(bus); wet.connect(bus);
  const nodes=[]; score={m:m,nodes:nodes,wet:wet,dry:dry};
  const out=(src,o,t,dur)=>{ let n=src; if(a.createStereoPanner&&(o.pan!==undefined)){ const p=a.createStereoPanner(); p.pan.setValueAtTime(o.pan,t); if(o.pan2!==undefined) p.pan.linearRampToValueAtTime(o.pan2,t+dur); n.connect(p); n=p; } n.connect(m); };
  /* V: a tone. o: type, to (glide target), glide, att, sus (hold, then fade), lp, pan, pan2, det */
  const V=(f,at,dur,vol,o)=>{ o=o||{}; const t=T0+at, os=a.createOscillator(), g=a.createGain(), att=o.att||0.015;
    os.type=o.type||'sine'; os.frequency.setValueAtTime(f,t); if(o.to) os.frequency.exponentialRampToValueAtTime(o.to,t+(o.glide||dur)); if(o.det) os.detune.value=o.det;
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(vol,t+att);
    if(o.sus){ g.gain.setValueAtTime(vol,t+Math.max(att,dur-(o.rel||dur*0.35))); g.gain.linearRampToValueAtTime(0.0001,t+dur); } else g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    let n=os; if(o.lp){ const lp=a.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=o.lp; os.connect(lp); n=lp; }
    n.connect(g); out(g,o,t,dur); os.start(t); os.stop(t+dur+0.05); nodes.push(os); };
  /* N: filtered noise sweeping f1 to f2; swell rises to its peak, otherwise it hits and fades */
  const N=(at,dur,vol,f1,f2,type,q,o)=>{ o=o||{}; const t=T0+at, src=a.createBufferSource(), fl=a.createBiquadFilter(), g=a.createGain();
    src.buffer=noiseOne(a,dur+0.3); fl.type=type||'bandpass'; fl.Q.value=q||1; fl.frequency.setValueAtTime(f1,t); fl.frequency.exponentialRampToValueAtTime(f2,t+dur);
    g.gain.setValueAtTime(0.0001,t); if(o.swell){ g.gain.exponentialRampToValueAtTime(vol,t+dur*0.88); g.gain.exponentialRampToValueAtTime(0.0001,t+dur); } else { g.gain.exponentialRampToValueAtTime(vol,t+0.015); g.gain.exponentialRampToValueAtTime(0.0001,t+dur); }
    src.connect(fl); fl.connect(g); out(g,o,t,dur); src.start(t); nodes.push(src); };
  const boom=(at,vol)=>{ N(at,1.7,vol,5200,60,'lowpass',0.7); V(160,at,1.5,vol*1.1,{to:26}); };
  const pad=(list,at,dur,vol,lp)=>list.forEach((f,i)=>{ V(f,at,dur,vol,{type:'triangle',sus:1,att:Math.min(1.4,dur*0.4),lp:lp||1600,det:i%2?7:-7}); });
  const bell=(f,at,vol,dur)=>{ V(f,at,dur||2,vol); V(f*2.76,at,(dur||2)*0.5,vol*0.35); };
  /* ===== the two hero tracks: an original melodic electro build and drop with a heroic 8-bit lead (in the spirit of big festival anthems, not copied from any song) ===== */
  /* ===== ??? : its own cinematic orchestral score (strings, choir, brass, taiko, piano). Original, and different from the Determination track. ===== */
  const _V=V,_N=N,_boom=boom,_bell=bell;
  /* ===== ??? prologue (first 29.5 s): the void, the One, the first cracks. Then the main score begins. ===== */
  if(kind==='secret'){
    const lub2=(t,v)=>{ V(60,t,0.22,v,{to:34}); V(60,t+0.17,0.2,v*0.65,{to:34}); };
    V(41.2,0,29.5,0.05,{type:'sine',sus:1,att:6,rel:4}); V(82.4,2,27,0.035,{type:'triangle',sus:1,att:8,rel:4,lp:420});
    N(0,12,0.025,200,1400,'bandpass',0.8,{swell:1}); N(12,14,0.035,300,3200,'bandpass',0.9,{swell:1});
    for(let t=1.2;t<27;t+=3.4){ bell(164.8,t,0.03,4.2); V(55,t,2.2,0.06,{to:38}); }
    [329.63,392,493.88,587.33,659.26,783.99].forEach((f,i)=>{ bell(f,7.5+i*1.2,0.045,2.6); bell(f*2,7.5+i*1.2+0.05,0.015,1.4); });
    { let t=15.2, iv=1.25; while(t<28.4){ lub2(t,0.03+0.07*(t-15)/13); t+=iv; iv=Math.max(0.42,iv*0.965); } }
    [[10,[164.8,196,246.9]],[16,[130.8,164.8,196]],[22,[146.8,185,220]]].forEach(x=>x[1].forEach((f,i)=>{ V(f,x[0],6.4,0.008,{type:'sawtooth',sus:1,att:3,rel:2.4,lp:900,det:i*5-5}); V(f/2,x[0],6.4,0.01,{type:'triangle',sus:1,att:3,rel:2.4,lp:500}); }));
    N(23,5.8,0.07,300,9000,'bandpass',1.2,{swell:1});
    [24,25.4,26.6,27.6,28.3].forEach((t,i)=>{ V(100,t,0.7,0.07+0.03*i,{to:42,glide:0.3}); N(t,0.3,0.06,2200,120,'lowpass',0.8); });
  }
  if(kind==='secret'){
    const OFFS=29.5, V=(f,at,d,vol,o)=>_V(f,at+OFFS,d,vol,o), N=(at,d,vol,f1,f2,ty,q,o)=>_N(at+OFFS,d,vol,f1,f2,ty,q,o), boom=(at,vol)=>_boom(at+OFFS,vol), bell=(f,at,vol,d)=>_bell(f,at+OFFS,vol,d);
    const hz=(n)=>440*Math.pow(2,(n-69)/12);
    const strings=(f,at,d,v,lp)=>{ for(const dt of [-8,8]) V(f,at,d,v*1.4,{type:'sawtooth',att:Math.min(0.9,d*0.4),sus:1,rel:d*0.35,lp:lp||1500,det:dt}); };
    const brass=(f,at,d,v)=>{ for(const dt of [-5,5]) V(f,at,d,v*1.2,{type:'sawtooth',att:0.22,sus:1,rel:d*0.3,lp:1250,det:dt}); };
    const choir=(f,at,d,v)=>{ const t=T0+OFFS+at, g=a.createGain(); g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v*1.5,t+Math.min(1.1,d*0.4)); g.gain.setValueAtTime(v*1.5,t+Math.max(0.5,d-d*0.35)); g.gain.linearRampToValueAtTime(0.0001,t+d);
      const b1=a.createBiquadFilter(), b2=a.createBiquadFilter(); b1.type=b2.type='bandpass'; b1.frequency.value=700; b1.Q.value=5; b2.frequency.value=1150; b2.Q.value=7; b1.connect(g); b2.connect(g);
      for(const dt of [-11,11]){ const os=a.createOscillator(); os.type='sawtooth'; os.frequency.setValueAtTime(f,t); os.detune.value=dt; os.connect(b1); os.connect(b2); os.start(t); os.stop(t+d+0.05); nodes.push(os); }
      g.connect(m); };
    const piano=(f,at,v,d)=>{ V(f,at,d||2.2,v,{type:'triangle',lp:3200}); V(f*2,at,0.9,v*0.35); N(at,0.03,v*0.25,4000,1500,'bandpass',1); };
    const music=(f,at,v)=>{ V(f,at,1.8,v); V(f*4,at,0.5,v*0.3); V(f*5.4,at,0.25,v*0.12); };
    const taiko=(at,v)=>{ V(110,at,0.7,v,{to:42,glide:0.25}); N(at,0.25,v*0.7,2500,120,'lowpass',0.8); };
    const lub=(at,v)=>{ V(62,at,0.22,v,{to:34}); V(62,at+0.16,0.2,v*0.65,{to:34}); };
    const EM=[40,47,52,55,59,64], CM=[36,43,48,52,55,60], GM=[43,50,55,59,62,67], DM=[38,45,50,54,57,62], PROG=[EM,CM,GM,DM];
    const MOT=[76,71,67,69,71,74,72,69,67,64,67,71,76,79,78,76]; // theme (E minor) 
    /* 0-4.2 : a lone piano and a drone, a faint heartbeat */
    V(hz(28),0,4.6,0.05,{type:'sine',sus:1,att:2,rel:1.2});
    [[0.4,76],[1.1,71],[1.8,67],[2.6,69],[3.3,71]].forEach(x=>piano(hz(x[1]),x[0],0.05,2.6));
    for(let t=0.3;t<4;t+=1.0) lub(t,0.1);
    /* 4.2-9 : strings rise, timpani roll accelerates, a brass call */
    boom(4.2,0.4);
    { let t=4.6, iv=0.5; while(t<8.7){ taiko(t,0.08+0.2*(t-4.6)/4.1); t+=iv; iv=Math.max(0.09,iv*0.88); }
      for(let k=0,t=4.6;t<8.7;t+=0.33,k++) strings(hz(52+[0,3,7,10,12,10,7,3][k%8]+Math.floor(k/16)*2),t,0.3,0.011+0.012*(t-4.6)/4.1,1200+(t-4.6)*500);
      N(4.6,4.1,0.1,200,8000,'bandpass',1.2,{swell:1});
      brass(hz(52),6.4,2.3,0.03); brass(hz(59),6.4,2.3,0.025); brass(hz(64),8.0,1,0.035); }
    /* 9-14 : the choir enters over a vast chord */
    boom(9,0.5); N(9,2.4,0.12,8000,400,'highpass',0.6);
    [EM,CM].forEach((c,i)=>{ const t=9+i*2.5; c.forEach((n,j)=>{ strings(hz(n+12),t,2.8,0.012,1100); if(j>1) choir(hz(n+12),t,2.8,0.014); }); brass(hz(c[0]+12),t,2.6,0.025); });
    for(let k=0;k<5;k++) taiko(9+k*1.0,0.18);
    /* 14-19.5 : it was not luck: a music box lullaby, then a gentle choir */
    [79,76,74,76,79,83,81,79,76,74,71,74,76].forEach((n,i)=>music(hz(n+(i>9?-5:0)),14+i*0.42,0.04));
    GM.forEach((n,i)=>{ if(i<4) strings(hz(n+12),14.3,5,0.008,900); }); V(hz(31),14.2,5,0.06,{type:'sine',sus:1,att:1,rel:1});
    [[17.6,71],[18.1,74],[18.6,79]].forEach(x=>choir(hz(x[1]),x[0],1.9,0.012));
    /* 19.5-24.5 : the heart races */
    { let t=19.7, iv=0.9, k=0; while(t<24.3){ const p=(t-19.5)/5; lub(t,0.2+0.25*p); if(k%2) taiko(t,0.12+0.2*p); t+=iv; iv=Math.max(0.2,iv*0.9); k++; }
      for(let k2=0,t2=19.7;t2<24.3;k2++){ const p=(t2-19.5)/5; strings(hz(59+[0,2,3,5][k2%4]+Math.floor(k2/8)),t2,0.14,0.01+0.015*p,1400+2200*p); t2+=Math.max(0.1,0.22-0.12*p); }
      choir(hz(83),21.5,3,0.016); choir(hz(88),22.8,1.8,0.02); N(19.5,5,0.14,300,9000,'bandpass',1.2,{swell:1}); }
    /* 24.5-30.5 : the hearts burst; full orchestra, the theme sung by the choir */
    boom(24.5,0.75); N(24.5,2,0.22,9000,500,'highpass',0.6);
    PROG.forEach((c,i)=>{ const t=24.5+i*1.5; c.forEach((n,j)=>{ strings(hz(n+12+(j>3?0:0)),t,1.6,0.014,2200); if(j>=2) brass(hz(n+12),t,1.5,0.02); if(j>=2) choir(hz(n+24),t,1.55,0.015); });
      piano(hz(c[0]),t,0.16,1.6); piano(hz(c[0]+12),t+0.75,0.1,1.2); taiko(t,0.4); taiko(t+0.75,0.22); taiko(t+1.1,0.18); V(hz(c[0]),t,1.55,0.14,{type:'sine',sus:1,att:0.05,rel:0.4});
      for(let k=0;k<3;k++) strings(hz(c[2+k%3]+24),t+k*0.5,0.5,0.01,2800); });
    { let tt=24.5; [[76,.75],[71,.75],[72,.75],[74,.75],[79,1.5],[76,.75],[74,.75],[72,.75],[71,.75],[74,1.5],[76,.75],[79,.75],[83,1.5]].forEach(n=>{ choir(hz(n[0]+12>88?hz(88)&&n[0]:n[0]+12),tt,n[1]*0.98,0.02); brass(hz(n[0]),tt,n[1]*0.95,0.02); tt+=n[1]; }); }
    /* 30.5 : the reveal, held in E major */
    boom(30.5,0.7); N(30.5,2.6,0.25,9000,500,'highpass',0.6); taiko(30.5,0.5);
    [40,52,59,64,68,71,76].forEach((n,i)=>{ strings(hz(n),30.5,6,0.014,1800); if(i>2) choir(hz(n+12),30.5,6,0.016); });
    [88,92,95,100].forEach((n,i)=>bell(hz(n),31+i*0.5,0.025,3));
    nodes.push({stop:function(){}}); return;
  }
  if(kind==='determination'||kind==='secret'){
    const SEC=kind==='secret', BPM=128, bt=60/BPM, R0=146.83, MIN=[0,2,3,5,7,8,10];
    const fe=(d,b)=>(b||R0)*Math.pow(2,MIN[((d%7)+7)%7]/12+Math.floor(d/7));
    const kick=(t,v)=>{ V(160,t,0.38,v,{to:44,glide:0.1}); N(t,0.05,v*0.4,3000,800,'lowpass',0.7); };
    const clap=(t,v)=>{ N(t,0.2,v,1500,2600,'bandpass',0.9); N(t+0.012,0.14,v*0.7,2200,1800,'bandpass',1.2); };
    const hat=(t,v)=>N(t,0.05,v,9000,9500,'highpass',0.6);
    const snr=(t,v)=>{ N(t,0.16,v,2200,1800,'bandpass',0.8); V(210,t,0.1,v*0.6,{to:120}); };
    const pluck=(f,t,v,d)=>{ V(f,t,d||0.8,v,{type:'triangle',lp:2600}); V(f*2,t,(d||0.8)*0.4,v*0.3); };
    const saw=(f,t,d,v,lp,att)=>{ for(const dt of [-13,0,13]) V(f,t,d,v,{type:'sawtooth',att:att||0.015,sus:1,rel:d*0.3,lp:lp||2600,det:dt}); };
    const chip=(f,t,d,v)=>V(f,t,d,v,{type:'square',lp:3800,sus:1,rel:Math.min(0.06,d*0.4),att:0.005});
    const heartB=(t,v)=>{ V(60,t,0.22,v,{to:36}); V(60,t+0.17,0.2,v*0.65,{to:36}); };
    const CH=[[0,2,4],[5,7,9],[2,4,6],[6,8,10]];
    const MEL=[[7,1],[6,.5],[4,.5],[2,1],[4,1],[5,1.5],[4,.5],[2,1],[1,1],[2,1],[4,.5],[5,.5],[7,1.5],[8,.5],[9,2],[7,1],[4,1]];
    const intro=(t0,t1)=>{ let k=0; for(let t=t0;t<t1-0.05;t+=bt/2){ const c=CH[Math.floor((t-t0)/(bt*4))%4]; pluck(fe(c[k%3]+7,R0*2),t,0.04,1.0); k++; }
      for(let i=0;i<4;i++){ const t=t0+i*bt*4; if(t<t1) CH[i].forEach(d=>V(fe(d,R0),t,bt*4,0.016,{type:'triangle',sus:1,att:1.2,lp:1300,rel:1.2})); }
      for(let t=t0+0.2;t<t1-0.2;t+=0.95) heartB(t,0.12); };
    const build=(t0,t1,kicksToo)=>{ const L=t1-t0;
      let t=t0, iv=0.8; while(t<t1-0.2){ (kicksToo?(tt=>kick(tt,0.22)):(tt=>heartB(tt,0.16)))(t); t+=iv; iv=Math.max(0.11,iv*0.9); }
      N(t0,L,0.1,300,9000,'bandpass',1.2,{swell:1,pan:-0.4,pan2:0.4});
      V(fe(0,R0),t0,L,0.045,{type:'sawtooth',to:fe(0,R0*8),sus:1,att:L*0.9,lp:2600,rel:0.05});
      let ts=t0+L*0.42, ivs=bt/2; while(ts<t1-0.04){ const p=(ts-t0)/L; snr(ts,0.05+0.13*p); ts+=ivs; ivs=Math.max(0.045,ivs*0.9); }
      let k=0; for(let ta=t0+L*0.15;ta<t1-0.1;ta+=Math.max(0.06,bt/4*(1-0.5*(ta-t0)/L))){ pluck(fe((k%8)+Math.floor(k/5),R0*2),ta,0.03+0.03*(ta-t0)/L,0.4); k++; } };
    const drop=(t0,bars,big)=>{
      for(let b=0;b<bars*4;b++){ const t=t0+b*bt, bar=Math.floor(b/4)%4;
        kick(t,0.42); if(b%2===1) clap(t,0.12); hat(t+bt/2,0.03); if(b%4===3) hat(t+bt*0.75,0.02);
        CH[bar].forEach(d=>saw(fe(d,R0*2),t,bt*0.97,0.012*(big?1.25:1),2400,0.16));
        V(fe(CH[bar][0],R0/2),t+bt/2,bt*0.45,0.2,{type:'sine',lp:240});
        if(big) CH[bar].forEach(d=>V(fe(d,R0),t,bt*0.97,0.014,{type:'sawtooth',att:0.2,sus:1,rel:0.1,lp:1500,pan:(d%2?0.5:-0.5)}));
        for(let k=0;k<4;k++) chip(fe(CH[bar][[0,1,2,1][k]]+7,R0*2),t+k*bt/4,bt/4*0.8,0.01); }
      for(let rep=0;rep*16<bars*4;rep++){ let tt=t0+rep*16*bt; for(const n of MEL){ const f=fe(n[0]+(rep%2?7:0),R0*2), d=n[1]*bt*0.96; saw(f,tt,d,0.016*(big?1.3:1),3400,0.01); chip(f,tt,d,0.012); if(big) V(f*0.5,tt,d,0.01,{type:'triangle'}); tt+=n[1]*bt; } }
    };
    const pads=(t0,dur,v)=>CH.forEach((c,i)=>{ const t=t0+i*dur/4; c.forEach(d=>{ V(fe(d,R0),t,dur/4+0.4,v,{type:'triangle',sus:1,att:0.5,lp:1700,rel:dur/8}); V(fe(d,R0*2),t,dur/4+0.4,v*0.6,{type:'sawtooth',sus:1,att:0.5,lp:1100,rel:dur/8,det:9}); }); });
    intro(0,4.2); boom(4.2,0.5); N(4.2,1.2,0.12,9000,400,'highpass',0.6);
    build(4.6,8.75,false);
    if(!SEC){ boom(9,0.55); drop(9,4,false); pads(9,bt*16,0.014); boom(9+bt*16,0.3); [987.77,880,739.99,587.33,493.88].forEach((f,i)=>bell(f,9+bt*16+0.2+i*0.3,0.03,2.4)); }
    else{
      boom(9,0.4); pads(9,5,0.02); for(let k=0;k<9;k++) boom(9+k*0.55,0.06+0.02*k);
      [392,493.88,587.33,739.99,880,987.77,1174.66,987.77,880,739.99,587.33,493.88].forEach((f,i)=>bell(f,14+i*0.42,0.04,2.4)); V(98,14,5,0.03,{type:'triangle',sus:1,att:1.5,lp:300});
      build(19.5,24.2,true); N(24.2,0.3,0.0001,100,200,'lowpass',1);
      boom(24.5,0.7); N(24.5,2,0.2,9000,500,'highpass',0.6); drop(24.5,8,true); pads(24.5,bt*32,0.018);
      boom(30.5,0.6); N(30.5,2.2,0.25,9000,500,'highpass',0.6); [1,1.25,1.5,2,2.5].forEach((f,i)=>V(293.66*f,30.5,6,0.03,{type:'sawtooth',sus:1,att:0.2,lp:2000,rel:3,det:i*4-8}));
    }
    nodes.push({stop:function(){}}); return;
  }
  /* every mutation has its own theme (key, mode, melody, voice). The build-up before the reveal and the length of the release both grow with rarity r. */
  const MODE={maj:[0,2,4,5,7,9,11],lyd:[0,2,4,6,7,9,11],min:[0,2,3,5,7,8,10],dor:[0,2,3,5,7,9,10],phr:[0,1,3,5,7,8,10],hm:[0,2,3,5,7,8,11],wt:[0,2,4,6,8,10,11]};
  const TH={
    planetary:{r:0,tb:1.5,root:261.63,mode:'maj',bpm:100,lead:'bell',prog:[0,4,5,3],m:[[0,.5],[2,.5],[4,.5],[7,1.5],[6,.5],[4,1.5]]},
    star:{r:1,tb:1.95,root:293.66,mode:'lyd',bpm:112,lead:'brass',prog:[0,1,4,0],m:[[4,.5],[4,.5],[7,1],[6,.5],[4,.5],[2,1.5],[4,1.5]]},
    impact:{r:2,tb:2.05,root:164.81,mode:'phr',bpm:120,lead:'brass',prog:[0,5,2,6],m:[[0,.5],[0,.5],[1,.5],[0,.5],[3,1],[2,.5],[1,.5],[0,2]]},
    system:{r:3,tb:2.05,tb2:4.5,root:196,mode:'dor',bpm:100,lead:'pluck',prog:[0,3,6,0],m:[[0,1],[2,.5],[4,.5],[5,1],[4,.5],[2,.5],[4,1],[7,2]]},
    blackhole:{r:3,tb:2.3,root:110,mode:'min',bpm:70,lead:'choir',prog:[0,5,3,4],m:[[4,2],[3,1],[2,1],[1,2],[0,3]]},
    beyond:{r:4,tb:3.3,root:174.61,mode:'lyd',bpm:96,lead:'strings',prog:[0,4,5,1],m:[[0,1],[4,1],[6,1],[9,1],[7,1],[4,1],[6,2],[11,2]]},
    universe:{r:5,tb:3.8,root:196,mode:'maj',bpm:80,lead:'bell',prog:[0,5,3,4],m:[[0,1],[4,1],[8,2],[7,1],[4,1],[2,1],[4,3]]},
    multiverse:{r:6,tb:4.2,root:146.83,mode:'wt',bpm:90,lead:'bell',prog:[0,3,1,4],m:[[0,1],[2,1],[4,1],[6,1],[5,1],[3,1],[1,1],[7,3]]},
    omniverse:{r:7,tb:4.6,root:110,mode:'hm',bpm:108,lead:'strings',prog:[0,5,3,4],canon:1,m:[[0,.5],[2,.5],[4,.5],[7,.5],[6,.5],[4,.5],[2,.5],[4,.5],[7,1],[9,2]]},
    secret:{r:9,tb:30,tbs:[8,13,17,25,30],len:46,reps:6,root:73.42,mode:'min',bpm:60,lead:'choir',prog:[0,5,2,6],canon:1,m:[[0,2],[4,1],[7,1],[9,2],[11,1],[9,1],[7,2],[4,1],[7,1],[12,4]]},
    determination:{r:8,tb:9,tbs:[4.2,9],len:22,reps:5,root:146.83,mode:'phr',bpm:92,lead:'choir',prog:[0,6,5,4],m:[[0,.5],[1,.5],[0,.5],[4,1],[3,.5],[4,.5],[7,1.5],[8,.5],[7,.5],[4,1],[0,2.5]]},
    rebirth:{r:7,tb:4.4,root:98,mode:'dor',bpm:72,lead:'strings',prog:[0,3,4,0],m:[[0,1.5],[4,1],[7,1.5],[9,.5],[7,1],[4,1],[7,2.5]]},
    absolute:{r:8,tb:4.4,root:73.42,mode:'min',bpm:66,lead:'choir',prog:[0,5,2,6],m:[[0,2],[4,1],[7,1],[9,2],[8,1],[7,1],[4,2],[7,4]]}
  };
  const th=TH[kind]; if(th){
    const r=th.r, sc=MODE[th.mode], beat=60/th.bpm, tb=th.tb, len=th.len||4.5+r*1.2;
    const fq=(d,base)=>{ const o=Math.floor(d/7), i=((d%7)+7)%7; return (base||th.root)*Math.pow(2,sc[i]/12+o); };
    const tri=(d,base)=>[fq(d,base),fq(d+2,base),fq(d+4,base)];
    const voice=(f,at,dur,vol,pan,kindV)=>{ const k=kindV||th.lead;
      if(k==='bell') bell(f,at,vol,Math.min(2.6,dur+0.8));
      else if(k==='pluck'){ V(f,at,Math.min(1.6,dur+0.4),vol,{type:'triangle',pan:pan}); V(f*2,at,0.5,vol*0.3,{pan:pan}); }
      else if(k==='brass'){ V(f,at,dur,vol*1.1,{type:'sawtooth',lp:1500,att:0.05,sus:1,rel:dur*0.5,pan:pan}); V(f,at,dur,vol*0.6,{type:'square',lp:900,att:0.06,sus:1,rel:dur*0.5,det:6,pan:pan}); }
      else if(k==='strings'){ V(f,at,dur+0.3,vol,{type:'sawtooth',lp:2200,att:0.22,sus:1,rel:dur*0.5,det:-8,pan:pan}); V(f,at,dur+0.3,vol,{type:'sawtooth',lp:2200,att:0.22,sus:1,rel:dur*0.5,det:8,pan:pan}); }
      else { V(f,at,dur+0.4,vol,{type:'triangle',lp:1300,att:0.45,sus:1,rel:dur*0.6,pan:pan}); V(f*2,at,dur+0.4,vol*0.4,{type:'sine',att:0.45,sus:1,rel:dur*0.6,pan:pan}); }
    };
    const climb=(from,to,t0,t1,lvl)=>{
      /* tension: heartbeat that speeds up and swells, a rising riser, and an arpeggio that climbs and quickens */
      let t=from, iv=0.95-0.12*r, k=0;
      while(t<to-0.12){ const p=(t-from)/Math.max(0.1,to-from), vol=(0.05+0.11*p)*(0.7+0.09*r)*lvl; V(58,t,0.24,vol,{to:34}); V(58,t+0.15,0.2,vol*0.6,{to:34}); t+=Math.max(0.17,iv*(1-0.8*p)); k++; }
      N(from,to-from,(0.05+0.025*r)*lvl,260,3000+r*650,'bandpass',1.1+r*0.1,{swell:1,pan:-0.6,pan2:0.6});
      if(r>=3) N(from+(to-from)*0.35,(to-from)*0.65,(0.04+0.02*r)*lvl,4000,9000,'highpass',0.7,{swell:1});
      V(th.root/2,from,to-from+0.05,0.05+0.012*r,{type:'sawtooth',sus:1,att:(to-from)*0.9,lp:260+r*60,rel:0.05,to:th.root*1.0,glide:to-from});
      const layers=1+Math.floor(r/3);
      for(let L=0;L<layers;L++){ let ta=from+(to-from)*(0.25+0.12*L), step=0.42-0.025*r, n=0; while(ta<to-0.1){ const p=(ta-from)/Math.max(0.1,to-from), d=(n%4)*2+Math.floor(n/4)*(2+L)+L*2; V(fq(d+7*(L%2)),ta,0.22,(0.014+0.02*p)*lvl,{type:'triangle',pan:Math.sin(n+L)*0.6}); ta+=Math.max(0.07,step*(1-0.7*p)); n++; } }
    };
    const hit=(t,lvl)=>{
      boom(t,(0.3+0.05*r)*lvl);
      if(r>=2) N(t,1.4+r*0.15,0.1*lvl,9000,500,'highpass',0.6);
      tri(0).concat(tri(0).map(f=>f*2)).forEach((f,i)=>voice(f,t,Math.min(2.5,1+r*0.25),0.022*lvl,(i%2?0.5:-0.5),r>=5?'strings':th.lead==='bell'?'strings':th.lead));
      V(th.root/2,t,len-t,0.07+0.01*r,{sus:1,att:0.6,lp:260,rel:2});
    };
    const ST=th.tbs||(th.tb2?[tb,th.tb2]:[tb]); let from0=0; ST.forEach((tt,ix)=>{ climb(from0,tt,0,0,ix?0.9:1); hit(tt,ix?0.8+0.05*ix:1); from0=tt+0.5; });
    const last=ST[ST.length-1];
    /* the theme itself: first statement after the hit, then harmonised and answered, growing with rarity */
    const t1=last+0.3; let mt=0; for(const n of th.m){ voice(fq(n[0]+7),t1+mt,n[1]*beat,0.05,0,th.lead); if(r>=4) voice(fq(n[0]+2+7),t1+mt,n[1]*beat,0.022,0.5,th.lead); mt+=n[1]*beat; }
    const stLen=mt+0.5; let st=1;
    while(t1+st*stLen<len-1.2&&st<(th.reps||4)){ const T=t1+st*stLen; let q=0; const up=st%2?7:14;
      for(const n of th.m){ voice(fq(n[0]+up),T+q,n[1]*beat,0.045,0.2*(st%2?1:-1),r>=3?'strings':th.lead); if(r>=5) voice(fq(n[0]+up-7),T+q,n[1]*beat,0.03,-0.3,'choir'); if(r>=6&&th.canon) voice(fq(n[0]+up+4),T+q+beat*2,n[1]*beat,0.025,0.6,'bell'); q+=n[1]*beat; }
      st++; }
    /* the harmony underneath: four chords, sustained, with timpani on every change for the big ones */
    const cd=Math.max(1.6,(len-last)/4);
    th.prog.forEach((d,i)=>{ const T=last+0.2+i*cd; if(T>len-0.8) return; tri(d,th.root/2).concat(tri(d,th.root)).forEach((f,j)=>V(f,T,cd+0.5,0.017+0.002*r,{type:'triangle',sus:1,att:Math.min(0.9,cd*0.4),lp:1500+r*150,det:j%2?7:-7,rel:cd*0.5}));
      if(r>=3) V(fq(d,th.root/2),T,0.5,0.22,{to:th.root/4}); if(r>=5) V(55,T,1.2,0.2,{to:30}); });
    if(r>=6){ [0,1,2,3,4].forEach(i=>voice(fq(i*2+14),len-3.2+i*0.35,1.8,0.03,(i%2?0.6:-0.6),'bell')); }
    V(th.root/2,len-1.5,1.5,0.04,{sus:1,att:0.3,lp:300,rel:1});
  }
  nodes.push({stop:function(){}});
}
function sndCrash(){
  sndBoom();
  const a=AC; if(!a||muted||a.state!=='running') return;
  try{
    const t=a.currentTime, src=a.createBufferSource(); src.buffer=noiseBuf(a); src.loop=true;
    const hp=a.createBiquadFilter(), g=a.createGain();
    hp.type='highpass'; hp.frequency.value=2800;
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.22,t+0.01); g.gain.exponentialRampToValueAtTime(0.0001,t+0.55);
    src.connect(hp); hp.connect(g); g.connect(a.destination); src.start(t); src.stop(t+0.6);
  }catch(e){}
  [1830,2790,4130,5710].forEach((f,i)=>beep(f,0,0.9-i*0.12,'square',0.022));
}
function sndRecord(){
  [523.25,659.25,783.99,1046.5].forEach((f,i)=>{ beep(f,i*0.07,0.3,'triangle',0.06); beep(f*2,i*0.07+0.02,0.2,'sine',0.03); });
}

/* record luck surge */
function renderMs(){
  const el=$('msLine'); if(!el) return;
  const c=msCount(), nx=MS[c];
  el.innerHTML='Spin milestones <b>'+c+' / '+MS.length+'</b> · +'+(c*MS_LUCK).toFixed(2).replace(/0$/,'')+' luck, +'+Math.round(c*MS_MUT*100)+'% mutation chance'+(nx?' · next at '+fmt(nx)+' rolls ('+fmt(Math.max(0,nx-(S.tot||0)))+' to go)':' · all reached');
}
let msT=null;
function msToast(){
  let el=$('msToast');
  if(!el){ el=document.createElement('div'); el.id='msToast'; el.className='mstoast'; document.body.appendChild(el); }
  el.textContent='Milestone: '+fmt(S.tot)+' rolls. +'+MS_LUCK+' luck and +'+Math.round(MS_MUT*100)+'% mutation chance, kept forever';
  el.classList.add('on'); clearTimeout(msT); msT=setTimeout(()=>el.classList.remove('on'),4500);
}
function startBoost(){
  boostUntil=Date.now()+BOOST_MS;
  const fl=$('flash'); fl.classList.remove('go'); void fl.offsetWidth; fl.classList.add('go');
  sndRecord();
  $('surge').hidden=false;
  clearInterval(boostT); boostT=setInterval(tickBoost,100);
  tickBoost(); renderWallet();
}
function tickBoost(){
  const left=boostUntil-Date.now();
  if(left<=0){
    clearInterval(boostT); boostT=null;
    $('surge').hidden=true; $('luck').classList.remove('surge');
    renderWallet(); return;
  }
  $('surgeTxt').textContent='New record. Luck +'+BOOST_LUCK+' for '+Math.ceil(left/1000)+' s';
  $('surgeBar').style.width=(100*left/BOOST_MS)+'%';
  $('luck').classList.add('surge');
}

/* mutation cutscenes. Planetary: a warp to a planet. Star: a star goes supernova. Impact: a planet and a star collide. None can be skipped. */
let cutT=[], cutTick=null, cutOpen=false, cutDone=false, cutRaf=0, cutCtx=null, cutStart=0, starCx=null, stars=[], starLast=0, fx=null, cutCd=null;
const REEL_H=72, REEL_SPIN=22, T_BOOM=1950, T_HIT=2050, T_SYS=4500, T_BH=2300, T_BEY=3300, T_UNI=3800, T_MULTI=4200, T_OMNI=4600, T_ABS=4400, T_ONE=7600, T_DET=9000, T_REB=4400, T_SEC=30500, OFF_SEC=29500;
const CUT_KIND={
  planetary:{kick:'Planetary roll',first:'Travelling to a Planetary world',arrive:1700},
  star:{kick:'Star roll',first:'A star is collapsing',arrive:3300},
  impact:{kick:'Impact roll',first:'A planet and a star are on a collision course',arrive:3800},
  system:{kick:'Solar System roll',first:'A planet and a star are on a collision course',arrive:5600},
  blackhole:{kick:'Black Hole roll',first:'A dying star begins to collapse',arrive:4500},
  beyond:{kick:'Beyond Space roll',first:'A planet, a star and a black hole are aligned',arrive:6700},
  universe:{kick:'Universe roll',first:'Zooming out from a single world',arrive:6300},
  multiverse:{kick:'Multiverse roll',first:'One universe splits into many',arrive:6000},
  omniverse:{kick:'Omniverse roll',first:'Every universe branches',arrive:6700},
  determination:{kick:'Determination roll',first:'It was not created by The One Before All',arrive:11800},
  secret:{kick:'???',first:'Before the stars',arrive:62800},
  rebirth:{kick:'Rebirth',first:'Everything you built falls away',arrive:8000},
  absolute:{kick:'Absolute roll',first:'Two omniverses are on a collision course',arrive:6500},
  one:{kick:'The One Before All roll',first:'Before every mutation, there was one',arrive:10800}
};
function clearCutTimers(){ cutT.forEach(clearTimeout); cutT=[]; clearInterval(cutTick); cutTick=null; clearInterval(cutCd); cutCd=null; }
let HIQ=false;
function sizeStars(){
  const cv=$('stars'), d0=window.devicePixelRatio||1, dpr=HIQ?Math.min(3,Math.max(2,d0)):Math.min(2,d0);
  cv.width=Math.max(1,Math.floor(cv.clientWidth*dpr)); cv.height=Math.max(1,Math.floor(cv.clientHeight*dpr));
  starCx=cv.getContext('2d'); if(starCx) starCx.setTransform(dpr,0,0,dpr,0,0);
}
/* ===== cinematic painted engine: lit spheres, plasma, fireballs, lens flares, film grain, letterbox ===== */
const FRAME_MS=1000/30, TAU=6.2832;
const clamp01=v=>v<0?0:v>1?1:v;
const prog=(t,a,b)=>clamp01((t-a)/(b-a));
const ease=p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
const eo=p=>1-Math.pow(1-clamp01(p),3);
const lerp=(a,b,t)=>a+(b-a)*t;
function mulb(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const TEXC={};
function tex(key,size,seed,fn){
  if(TEXC[key]) return TEXC[key];
  const c=document.createElement('canvas'); c.width=c.height=size;
  const x=c.getContext('2d'); if(!x) return c;
  const id=x.createImageData(size,size), d=id.data, r=mulb(seed), oct=5, grids=[];
  for(let o=0;o<oct;o++){ const P=4<<o, gr=new Float32Array(P*P); for(let i=0;i<gr.length;i++) gr[i]=r(); grids.push(gr); }
  const sm=t=>t*t*(3-2*t);
  const vn=(o,u,v)=>{ const P=4<<o, gr=grids[o], X=u*P, Y=v*P, xi=Math.floor(X), yi=Math.floor(Y), xf=sm(X-xi), yf=sm(Y-yi);
    const x0=((xi%P)+P)%P, x1=(x0+1)%P, y0=((yi%P)+P)%P, y1=(y0+1)%P;
    const a=gr[y0*P+x0], b=gr[y0*P+x1], c2=gr[y1*P+x0], d2=gr[y1*P+x1];
    return a+(b-a)*xf+(c2-a)*yf+(a-b-c2+d2)*xf*yf; };
  for(let py=0;py<size;py++) for(let px=0;px<size;px++){
    let n=0,amp=0.5,tot=0; for(let o=0;o<oct;o++){ n+=vn(o,px/size,py/size)*amp; tot+=amp; amp*=0.5; } n/=tot;
    const col=fn(n,px/size,py/size), i=(py*size+px)*4;
    d[i]=col[0]; d[i+1]=col[1]; d[i+2]=col[2]; d[i+3]=col[3]===undefined?255:col[3];
  }
  x.putImageData(id,0,0); return TEXC[key]=c;
}
const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const NEB={planetary:'60,110,220',star:'255,90,40',impact:'230,80,160',system:'60,200,200',blackhole:'140,80,255',beyond:'200,90,255',multiverse:'70,220,170',omniverse:'255,190,80',absolute:'255,255,255',one:'255,200,120',determination:'210,16,28',rebirth:'200,30,30',secret:'255,150,70'};
const DEEP={planetary:'4,9,26',star:'18,5,3',impact:'16,5,14',system:'3,14,20',blackhole:'8,4,18',beyond:'10,4,24',multiverse:'3,16,16',omniverse:'18,12,4',absolute:'0,0,0',one:'6,4,2',determination:'16,0,2',rebirth:'12,2,2',secret:'14,2,2'};
function buildTex(kind){
  tex('earth',192,11,(n,u,v)=>{ const pole=Math.abs(v-0.5)*2; if(n<0.5) return mix([6,24,70],[28,96,170],n*2).concat(255); const l=(n-0.5)*2; const c=l<0.35?mix([60,110,50],[40,80,40],l/0.35):mix([120,100,70],[225,215,200],(l-0.35)/0.65); return pole>0.88?[240,246,255,255]:c.concat(255); });
  tex('cloud',192,23,(n)=>[255,255,255,Math.max(0,Math.min(255,(n-0.52)*900))]);
  tex('sun',192,5,(n)=>{ const c=n<0.4?mix([140,30,0],[255,100,10],n/0.4):mix([255,140,20],[255,236,150],(n-0.4)/0.6); return c.concat(255); });
  tex('lava',192,31,(n)=>{ const c=n<0.5?mix([14,6,6],[60,16,8],n*2):mix([200,50,10],[255,200,60],(n-0.5)*2); return c.concat(255); });
  const nc=(NEB[kind]||'120,120,200').split(',').map(Number);
  tex('neb-'+kind,192,47,(n)=>[nc[0],nc[1],nc[2],Math.max(0,Math.min(255,(n-0.42)*520))]);
  fx.neb=TEXC['neb-'+kind];
}
function fxInit(kind){
  const cv=$('stars'), w=cv.clientWidth, h=cv.clientHeight;
  const rc=document.querySelector('#cut .cab').getBoundingClientRect();
  const r0=mulb(4242), st=[];
  for(let i=0;i<170;i++){ const L=i%3; st.push({x:r0(),y:r0(),s:0.5+r0()*(0.7+L*0.5),L:L,tw:r0()*6,c:r0()<0.18?'180,210,255':r0()<0.3?'255,220,180':'255,255,255'}); }
  fx={kind:kind,w:w,h:h,R:Math.min(w,h),cx:w/2,cy:Math.max(h*0.42,Math.min(h*0.62,rc.top+rc.height/2)),frame:-1,rng:Math.random,st:st,flash:0,flashCol:'255,255,255',clean:false,deep:DEEP[kind]||'4,6,16',neb:null};
  buildTex(kind);
}
const J=a=>(fx.rng()-0.5)*2*a;
function glow(g,x,y,r,c,a,mode){
  if(r<0.6||a<=0.003) return;
  const gr=g.createRadialGradient(x,y,0,x,y,r);
  gr.addColorStop(0,'rgba('+c+','+a+')'); gr.addColorStop(0.35,'rgba('+c+','+(a*0.38)+')'); gr.addColorStop(1,'rgba('+c+',0)');
  g.globalCompositeOperation=mode||'lighter'; g.fillStyle=gr; g.fillRect(x-r,y-r,r*2,r*2); g.globalCompositeOperation='source-over';
}
function streak(g,x,y,len,c,a,th){
  g.save(); g.translate(x,y); g.scale(1,th||0.035); glow(g,0,0,len,c,a); g.restore();
}
function bgSpace(g,ct,nebA){
  const {w,h}=fx;
  const gr=g.createRadialGradient(w*0.5,h*0.5,0,w*0.5,h*0.5,Math.max(w,h)*0.78); gr.addColorStop(0,'rgb('+fx.deep+')'); gr.addColorStop(1,'#010207');
  g.fillStyle=gr; g.fillRect(-80,-80,w+160,h+160);
  if(fx.neb&&nebA!==0){
    g.globalAlpha=nebA===undefined?0.5:nebA; const S=Math.max(w,h)*1.45, off=(ct*0.000012)%1*S;
    for(let k=-1;k<=1;k++) g.drawImage(fx.neb,-S*0.15+k*S-off,h*0.5-S*0.5,S,S);
    g.globalAlpha=1;
  }
  const f=Math.floor(ct/90);
  for(let i=0;i<fx.st.length;i++){
    const s=fx.st[i], dx=(ct*0.004*(s.L+1))%w, X=((s.x*w-dx)%w+w)%w, Y=s.y*h, al=0.45+0.4*Math.sin(ct*0.002+s.tw)+(((f+i)%53===0)?0.3:0);
    g.fillStyle='rgba('+s.c+','+Math.max(0.1,Math.min(1,al))+')';
    if(s.s>1.3){ g.beginPath(); g.arc(X,Y,s.s,0,TAU); g.fill(); } else g.fillRect(X,Y,s.s*1.4,s.s*1.4);
  }
}
function texDisc(g,t,x,y,r,off,st){
  const S=r*2*(st||1.7), sh=((off%1)+1)%1*S, yy=y-S/2;
  g.drawImage(t,x-S/2+sh,yy,S,S); g.drawImage(t,x-S/2+sh-S,yy,S,S); g.drawImage(t,x-S/2+sh+S,yy,S,S);
}
function planet(g,x,y,r,o){
  if(r<1) return;
  const lx=o.lx===undefined?-0.75:o.lx, ly=o.ly===undefined?-0.45:o.ly, atm=o.atm||'110,175,255', t=o.t||0;
  glow(g,x,y,r*1.4,atm,0.5*(o.atmA===undefined?1:o.atmA));
  g.save(); g.beginPath(); g.arc(x,y,r,0,TAU); g.clip();
  texDisc(g,TEXC[o.tex||'earth'],x,y,r,(o.rot||0),1.7);
  if(o.cloud){ g.globalAlpha=0.9; texDisc(g,TEXC.cloud,x,y,r,(o.rot||0)*1.3+0.31,1.7); g.globalAlpha=1; }
  const gx=x+lx*r*0.5, gy=y+ly*r*0.5, sh=g.createRadialGradient(gx,gy,r*0.12,gx,gy,r*1.55);
  sh.addColorStop(0,'rgba(0,0,0,0)'); sh.addColorStop(0.5,'rgba(0,2,10,0.22)'); sh.addColorStop(1,'rgba(0,0,8,0.97)');
  g.fillStyle=sh; g.fillRect(x-r,y-r,r*2,r*2);
  const rim=g.createRadialGradient(x,y,r*0.78,x,y,r); rim.addColorStop(0,'rgba('+atm+',0)'); rim.addColorStop(1,'rgba('+atm+','+(0.7*(o.atmA===undefined?1:o.atmA))+')');
  g.globalCompositeOperation='lighter'; g.fillStyle=rim; g.fillRect(x-r,y-r,r*2,r*2); g.globalCompositeOperation='source-over';
  if(o.glowSide){ const hg=g.createRadialGradient(x-lx*r,y-ly*r,0,x-lx*r,y-ly*r,r*1.2); hg.addColorStop(0,'rgba('+o.glowSide+',0.75)'); hg.addColorStop(1,'rgba('+o.glowSide+',0)'); g.globalCompositeOperation='lighter'; g.fillStyle=hg; g.fillRect(x-r,y-r,r*2,r*2); g.globalCompositeOperation='source-over'; }
  g.restore();
}
function sun(g,x,y,r,o){
  if(r<1) return;
  const heat=o.heat||0, t=o.t||0, col=heat<0.45?'255,222,150':heat<0.8?'255,150,60':'255,70,30';
  glow(g,x,y,r*4.6,col,0.32+0.12*Math.sin(t/260)); glow(g,x,y,r*2.3,col,0.6);
  g.save(); g.translate(x,y); g.globalCompositeOperation='lighter'; const rr=mulb(7);
  for(let i=0;i<22;i++){
    const a=i/22*TAU+t*0.00009+rr()*0.2, L=r*(1.35+rr()*1.7)*(0.82+0.18*Math.sin(t/150+i*3)), ca=Math.cos(a), sa=Math.sin(a);
    const gr=g.createLinearGradient(ca*r*0.9,sa*r*0.9,ca*L,sa*L); gr.addColorStop(0,'rgba('+col+',0.55)'); gr.addColorStop(1,'rgba('+col+',0)');
    g.strokeStyle=gr; g.lineWidth=Math.max(1,r*(0.03+rr()*0.05)); g.beginPath(); g.moveTo(ca*r*0.9,sa*r*0.9); g.lineTo(ca*L,sa*L); g.stroke();
  }
  g.restore();
  g.save(); g.beginPath(); g.arc(x,y,r,0,TAU); g.clip();
  texDisc(g,TEXC.sun,x,y,r,t*0.00006,1.5);
  if(heat>0){ g.globalCompositeOperation='multiply'; g.fillStyle='rgba(255,'+Math.round(120-heat*100)+',0,'+(0.25+0.6*heat)+')'; g.fillRect(x-r,y-r,r*2,r*2); g.globalCompositeOperation='source-over'; }
  const lb=g.createRadialGradient(x,y,r*0.35,x,y,r); lb.addColorStop(0,'rgba(60,8,0,0)'); lb.addColorStop(1,'rgba(70,10,0,0.8)'); g.fillStyle=lb; g.fillRect(x-r,y-r,r*2,r*2);
  glow(g,x-r*0.15,y-r*0.15,r*0.9,'255,250,225',0.5*(1-heat*0.7));
  g.restore();
}
function fireball(g,x,y,t,R,pal,sz){
  const S=sz||1, p=clamp01(t/2600), e=eo(p), idle=t>2600, fade=idle?0.5+0.08*Math.sin(t/260):1-p*0.5;
  glow(g,x,y,R*S*(0.3+1.7*e),'255,250,236',Math.max(0,1-p*1.6)*0.7);
  const rr=mulb(99);
  for(let i=0;i<64;i++){
    const a=rr()*TAU, sp=0.3+rr()*0.8, r0=R*S*(0.05+rr()*0.12), d=R*S*sp*0.6*e*(1+0.25*rr());
    const age=clamp01(p*1.25-rr()*0.2), rad=r0*(1+age*3.2)+R*S*0.05*e, col=age<0.25?pal[0]:age<0.6?pal[1]:pal[2];
    glow(g,x+Math.cos(a)*d,y+Math.sin(a)*d*0.85,rad,col,Math.max(0,(0.3-age*0.19)*fade));
  }
  if(p>0.35) for(let i=0;i<26;i++){
    const a=rr()*TAU, d=R*S*(0.1+rr()*0.5)*e, rad=R*S*(0.14+rr()*0.18)*(0.6+e*0.6);
    glow(g,x+Math.cos(a)*d,y+Math.sin(a)*d*0.85,rad,'14,8,8',0.32*Math.min(1,(p-0.35)*2),'source-over');
  }
  g.save(); g.globalCompositeOperation='lighter';
  for(let k=0;k<2;k++){ const rp=clamp01(p*1.3-k*0.14); if(rp<=0||rp>=1) continue; g.strokeStyle='rgba(255,255,255,'+(1-rp)*0.8+')'; g.lineWidth=1+(1-rp)*6; g.beginPath(); g.arc(x,y,R*S*(0.12+1.75*eo(rp)),0,TAU); g.stroke(); g.strokeStyle='rgba('+pal[1]+','+(1-rp)*0.4+')'; g.lineWidth=1+(1-rp)*14; g.stroke(); }
  for(let i=0;i<44;i++){
    const a=rr()*TAU, sp=0.4+rr()*1.1, d=R*S*(0.12+sp*1.2*e), L=R*S*0.1*(1-p*0.8)*(0.4+rr()), ca=Math.cos(a), sa=Math.sin(a);
    const gr=g.createLinearGradient(x+ca*d,y+sa*d,x+ca*(d-L),y+sa*(d-L)); gr.addColorStop(0,'rgba('+pal[0]+',0.9)'); gr.addColorStop(1,'rgba('+pal[1]+',0)');
    g.strokeStyle=gr; g.lineWidth=1+rr()*1.8; g.beginPath(); g.moveTo(x+ca*d,y+sa*d); g.lineTo(x+ca*(d-L),y+sa*(d-L)); g.stroke();
  }
  for(let i=0;i<56;i++){
    const a=rr()*TAU, sp=0.3+rr(), d=R*S*(0.1+sp*0.9*e)+(p>0.5?(t-1300)*0.01*rr():0), fl=0.4+0.6*Math.abs(Math.sin(t*0.01+i));
    g.fillStyle='rgba(255,'+Math.round(150+rr()*80)+',80,'+(0.8*fl*(1-p*0.6))+')'; const q=1+rr()*2; g.fillRect(x+Math.cos(a)*d,y+Math.sin(a)*d*0.9-(p>0.4?(t-1000)*0.012*rr():0),q,q);
  }
  g.restore();
}
function hole(g,x,y,r,t,o){
  if(r<1) return; o=o||{}; const k=o.k===undefined?1:o.k, tilt=-0.2, c=Math.cos(tilt), s=Math.sin(tilt), hue=o.hue||'255,170,80';
  glow(g,x,y,r*6.5,'150,110,255',0.13*k); glow(g,x,y,r*3.4,hue,0.24*k);
  const rr=mulb(5), dots=[];
  for(let i=0;i<190;i++){ const kk=1.25+rr()*2.3, a=rr()*TAU+t*0.0022/Math.pow(kk,1.4); dots.push([kk,a,rr()]); }
  const pt=(kk,a)=>{ const ex=Math.cos(a)*r*kk, ey=Math.sin(a)*r*kk*0.27; return [x+ex*c-ey*s,y+ex*s+ey*c]; };
  const drawDots=(front)=>{
    g.globalCompositeOperation='lighter';
    for(const d of dots){ const sn=Math.sin(d[1]); if((sn>=0)!==front) continue; const q=pt(d[0],d[1]), dop=0.3+0.7*(0.5+0.5*Math.cos(d[1])), heat=clamp01((d[0]-1.25)/2.3), al=(0.85-heat*0.5)*dop*k;
      g.fillStyle='rgba(255,'+Math.round(250-heat*130)+','+Math.round(220-heat*170)+','+al+')'; const z=Math.max(1.1,r*0.03*(1.3-heat*0.5)); g.beginPath(); g.arc(q[0],q[1],z*(0.7+d[2]*0.5),0,TAU); g.fill(); }
    g.globalCompositeOperation='source-over';
  };
  const band=(half)=>{ g.globalCompositeOperation='lighter'; for(const kk of [1.55,2.1,2.75]){ g.strokeStyle='rgba('+hue+','+(0.16*k)+')'; g.lineWidth=r*(0.5-kk*0.06); g.beginPath(); g.ellipse(x,y,r*kk,r*kk*0.27,tilt,half?0:Math.PI,half?Math.PI:TAU); g.stroke(); } g.globalCompositeOperation='source-over'; };
  band(false); drawDots(false);
  g.globalCompositeOperation='lighter'; g.strokeStyle='rgba('+hue+','+(0.5*k)+')'; g.lineWidth=r*0.2; g.beginPath(); g.ellipse(x,y,r*1.5,r*1.28,0,Math.PI*1.04,Math.PI*1.96); g.stroke();
  g.strokeStyle='rgba('+hue+','+(0.3*k)+')'; g.lineWidth=r*0.14; g.beginPath(); g.ellipse(x,y,r*1.5,r*1.2,0,Math.PI*0.08,Math.PI*0.92); g.stroke(); g.globalCompositeOperation='source-over';
  g.fillStyle='#000'; g.beginPath(); g.arc(x,y,r,0,TAU); g.fill();
  g.globalCompositeOperation='lighter'; g.strokeStyle='rgba(255,246,225,'+(0.85*k)+')'; g.lineWidth=Math.max(1.5,r*0.045); g.beginPath(); g.arc(x,y,r*1.045,0,TAU); g.stroke(); g.globalCompositeOperation='source-over';
  band(true); drawDots(true);
  streak(g,x,y,r*7,hue,0.28*k,0.03);
}
function bubble(g,x,y,r,k,t,full){
  if(r<1.5) return;
  const P=[['120,170,255','200,120,255'],['255,190,110','255,110,150'],['120,255,220','110,160,255']][((k%3)+3)%3];
  g.save(); g.beginPath(); g.arc(x,y,r,0,TAU); g.clip();
  g.fillStyle='#03040c'; g.fillRect(x-r,y-r,r*2,r*2);
  const bg=g.createRadialGradient(x-r*0.25,y-r*0.2,0,x,y,r); bg.addColorStop(0,'rgba('+P[0]+',0.55)'); bg.addColorStop(0.6,'rgba('+P[1]+',0.22)'); bg.addColorStop(1,'rgba(2,3,10,0.9)');
  g.fillStyle=bg; g.fillRect(x-r,y-r,r*2,r*2);
  if(full&&fx.neb&&r>10){ g.globalAlpha=0.55; g.globalCompositeOperation='lighter'; texDisc(g,fx.neb,x,y,r,t*0.00004+k*0.2,1.4); g.globalAlpha=1; g.globalCompositeOperation='source-over'; }
  if(full&&r>20){ const rr=mulb(k*17+3); g.globalCompositeOperation='lighter'; for(let i=0;i<5+r/6;i++){ g.fillStyle='rgba(255,255,255,'+(0.4+rr()*0.5)+')'; g.fillRect(x+(rr()-0.5)*r*1.7,y+(rr()-0.5)*r*1.7,1.4,1.4); } gal(g,x+(k%2?r*0.15:-r*0.15),y,r*0.45,t*0.0004+k,P[0],r>34?70:30); g.globalCompositeOperation='source-over'; }
  const sh=g.createRadialGradient(x,y,r*0.7,x,y,r); sh.addColorStop(0,'rgba(0,0,0,0)'); sh.addColorStop(1,'rgba(0,0,0,0.5)'); g.fillStyle=sh; g.fillRect(x-r,y-r,r*2,r*2);
  g.restore();
  g.save(); g.lineWidth=Math.max(1,r*0.035);
  g.strokeStyle='rgba(255,140,220,0.5)'; g.beginPath(); g.arc(x,y,r*0.97,2.1,3.9); g.stroke();
  g.strokeStyle='rgba(120,230,255,0.5)'; g.beginPath(); g.arc(x,y,r*0.97,5.2,7.0); g.stroke();
  g.strokeStyle='rgba(255,255,255,0.22)'; g.beginPath(); g.arc(x,y,r,0,TAU); g.stroke();
  g.strokeStyle='rgba(255,255,255,0.75)'; g.lineWidth=Math.max(1,r*0.05); g.beginPath(); g.arc(x,y,r*0.84,3.55,4.45); g.stroke();
  g.fillStyle='rgba(255,255,255,0.7)'; g.beginPath(); g.arc(x-r*0.45,y-r*0.5,Math.max(1,r*0.05),0,TAU); g.fill();
  g.restore();
}
function gal(g,x,y,r,rot,col,n){
  const rr=mulb(77); glow(g,x,y,r*0.6,'255,240,210',0.5);
  for(let i=0;i<(n||60);i++){ const arm=i%2, u=rr(), a=u*7+arm*3.1416+rot, d=r*(0.1+u*0.95), jx=(rr()-0.5)*r*0.2, jy=(rr()-0.5)*r*0.2;
    g.fillStyle='rgba('+(u<0.4?'255,230,190':col)+','+(0.8-u*0.5)+')'; g.fillRect(x+Math.cos(a)*d+jx,y+Math.sin(a)*d*0.5+jy,1.4,1.4); }
}
function eye(g,x,y,w,open,t){
  const h=w*0.5*open;
  const lens=()=>{ g.beginPath(); g.moveTo(x-w,y); g.quadraticCurveTo(x,y-h*2,x+w,y); g.quadraticCurveTo(x,y+h*2,x-w,y); g.closePath(); };
  glow(g,x,y,w*1.5,'255,200,110',0.35);
  g.save(); lens(); g.clip();
  const sc=g.createRadialGradient(x,y,0,x,y,w); sc.addColorStop(0,'#fbf6ea'); sc.addColorStop(0.7,'#c9c7d6'); sc.addColorStop(1,'#4a4764'); g.fillStyle=sc; g.fillRect(x-w,y-w,w*2,w*2);
  const ir=Math.min(w*0.46,h*1.9)+1, ix=x+Math.sin(t*0.0007)*w*0.05;
  const ig=g.createRadialGradient(ix,y,ir*0.3,ix,y,ir); ig.addColorStop(0,'#ffe08a'); ig.addColorStop(0.45,'#e0902a'); ig.addColorStop(0.75,'#2a6fd8'); ig.addColorStop(1,'#07102e'); g.fillStyle=ig; g.beginPath(); g.arc(ix,y,ir,0,TAU); g.fill();
  const rr=mulb(13); g.save(); g.beginPath(); g.arc(ix,y,ir,0,TAU); g.clip(); g.translate(ix,y); g.rotate(t*0.00015);
  for(let i=0;i<110;i++){ const a=rr()*TAU, r1=ir*(0.3+rr()*0.15), r2=ir*(0.7+rr()*0.3); g.strokeStyle='rgba('+(rr()<0.5?'255,220,140':'120,180,255')+','+(0.1+rr()*0.3)+')'; g.lineWidth=0.8+rr()*1.2; g.beginPath(); g.moveTo(Math.cos(a)*r1,Math.sin(a)*r1); g.lineTo(Math.cos(a)*r2,Math.sin(a)*r2); g.stroke(); }
  g.globalCompositeOperation='lighter'; gal(g,0,0,ir*0.85,t*0.0005,'160,200,255',120); g.restore();
  g.fillStyle='#000'; g.beginPath(); g.arc(ix,y,ir*0.33,0,TAU); g.fill();
  glow(g,ix,y,ir*0.5,'255,170,70',0.5);
  g.fillStyle='rgba(255,255,255,0.85)'; g.beginPath(); g.arc(ix-ir*0.32,y-ir*0.34,Math.max(1,ir*0.08),0,TAU); g.fill();
  const lid=g.createLinearGradient(0,y-h,0,y+h); lid.addColorStop(0,'rgba(0,0,0,0.65)'); lid.addColorStop(0.28,'rgba(0,0,0,0)'); lid.addColorStop(0.75,'rgba(0,0,0,0)'); lid.addColorStop(1,'rgba(0,0,0,0.55)'); g.fillStyle=lid; g.fillRect(x-w,y-h*2,w*2,h*4);
  g.restore();
  g.save(); lens(); g.lineJoin='round'; g.strokeStyle='#0a0608'; g.lineWidth=Math.max(3,w*0.02); g.stroke(); g.strokeStyle='rgba(255,210,150,0.55)'; g.lineWidth=1.2; g.stroke(); g.restore();
}
/* camera, post and flash */
function cam(g,z,shake){ g.translate(fx.cx,fx.cy); g.scale(z,z); g.translate(-fx.cx+(shake?J(shake):0),-fx.cy+(shake?J(shake):0)); }
function setFlash(ct,t0,dur,col){ if(ct<t0) return; const p=prog(ct,t0,t0+dur), a=Math.pow(1-p,1.6); if(a>fx.flash){ fx.flash=a; fx.flashCol=col||'255,255,255'; } }
function post(g,ct){
  const {w,h}=fx;
  if(!fx.clean){
    const v=g.createRadialGradient(w/2,h/2,Math.min(w,h)*0.35,w/2,h/2,Math.max(w,h)*0.75); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(0,0,0,0.62)'); g.fillStyle=v; g.fillRect(0,0,w,h);
    g.fillStyle='rgba(255,255,255,0.05)'; for(let i=0;i<110;i++) g.fillRect(fx.rng()*w,fx.rng()*h,1.3,1.3);
    g.fillStyle='rgba(0,0,0,0.05)'; for(let i=0;i<110;i++) g.fillRect(fx.rng()*w,fx.rng()*h,1.3,1.3);
    if(fx.rng()<0.1){ g.strokeStyle='rgba(255,255,255,0.14)'; g.lineWidth=1; const sx=fx.rng()*w; g.beginPath(); g.moveTo(sx,0); g.lineTo(sx+J(5),h); g.stroke(); }
    if(fx.rng()<0.07){ g.fillStyle='rgba(255,255,255,0.18)'; g.beginPath(); g.arc(fx.rng()*w,fx.rng()*h,1+fx.rng()*2,0,TAU); g.fill(); }
  }
  if(fx.flash>0.01){ g.fillStyle='rgba('+fx.flashCol+','+Math.min(1,fx.flash)+')'; g.fillRect(0,0,w,h); }
  const bar=h*0.075*ease(prog(ct,0,900)); g.fillStyle='#000'; g.fillRect(0,0,w,bar); g.fillRect(0,h-bar,w,bar);
  const fi=1-prog(ct,0,600); if(fi>0){ g.fillStyle='rgba(0,0,0,'+fi+')'; g.fillRect(0,0,w,h); }
}
/* ---- fractal trees: the branching omniverse ---- */
let TREE=null;
function treeGeo(){
  if(TREE) return TREE;
  const D=7, byD=[]; for(let d=0;d<=D;d++) byD.push([]);
  const r=mulb(321);
  (function br(x,y,a,L,d){
    if(d>D) return;
    const x2=x+Math.cos(a)*L, y2=y+Math.sin(a)*L; byD[d].push([x,y,x2,y2]);
    const n=d<2?3:2, spread=0.42+r()*0.2;
    for(let k=0;k<n;k++){ const off=(k-(n-1)/2)*spread*(1+r()*0.3); br(x2,y2,a+off+(r()-0.5)*0.15,L*(0.7+r()*0.06),d+1); }
  })(0,0,-Math.PI/2,1,0);
  return TREE={byD:byD,D:D};
}
function drawTree(g,x,y,S,rot,grow,col,al,depthMax,glowPass){
  const G=treeGeo(), c=Math.cos(rot), s=Math.sin(rot), DM=Math.min(depthMax===undefined?G.D:depthMax,G.D);
  g.globalCompositeOperation='lighter'; g.lineCap='round';
  for(let d=0;d<=DM;d++){
    const f=clamp01(grow*(G.D+1)-d); if(f<=0) break;
    const arr=G.byD[d]; g.beginPath();
    for(let i=0;i<arr.length;i++){ const a=arr[i], x1=a[0]*S, y1=a[1]*S, x2=x1+(a[2]-a[0])*S*f, y2=y1+(a[3]-a[1])*S*f;
      g.moveTo(x+x1*c-y1*s,y+x1*s+y1*c); g.lineTo(x+x2*c-y2*s,y+x2*s+y2*c); }
    const w=Math.max(0.7,S*0.05*Math.pow(0.66,d));
    if(glowPass){ g.strokeStyle='rgba('+col+','+(al*0.12)+')'; g.lineWidth=w*4+2; g.stroke(); }
    g.strokeStyle='rgba('+(d>=DM-1?'255,250,232':col)+','+(al*(0.5+0.45*d/Math.max(1,DM)))+')'; g.lineWidth=w; g.stroke();
  }
  g.globalCompositeOperation='source-over';
}
function flower(g,x,y,S,rot,n,col,al,grow,depthMax,glowPass){
  for(let k=0;k<n;k++) drawTree(g,x,y,S,rot+k*TAU/n,grow,col,al,depthMax,glowPass&&k===0);
  glow(g,x,y,S*1.1,col,0.3*al);
}
/* ---- universe cards: one parallel reality per card ---- */
const CTINT=[['70,140,255','200,120,255'],['255,170,80','255,90,120'],['70,230,190','80,160,255'],['255,110,200','150,100,255']];
function card(k){
  const key='card'+(k%4); if(TEXC[key]) return TEXC[key];
  const W=300,H=190, c=document.createElement('canvas'); c.width=W; c.height=H; const x=c.getContext('2d'); if(!x) return c;
  const T=CTINT[k%4], nc=T[0].split(',').map(Number);
  const bg=x.createLinearGradient(0,0,W,H); bg.addColorStop(0,'#02030c'); bg.addColorStop(1,'rgb(10,6,24)'); x.fillStyle=bg; x.fillRect(0,0,W,H);
  const nb=tex('cn'+(k%4),128,60+(k%4)*7,(n)=>[nc[0],nc[1],nc[2],Math.max(0,Math.min(255,(n-0.4)*560))]);
  x.drawImage(nb,0,0,W,H);
  const rr=mulb((k%4)*31+5); x.fillStyle='#fff';
  for(let i=0;i<120;i++){ x.globalAlpha=0.3+rr()*0.7; x.fillRect(rr()*W,rr()*H,1+rr()*1.2,1+rr()*1.2); } x.globalAlpha=1;
  gal(x,W*(0.3+rr()*0.4),H*(0.35+rr()*0.3),H*0.4,rr()*6,T[0],300);
  gal(x,W*(0.15+rr()*0.7),H*(0.2+rr()*0.6),H*0.14,rr()*6,T[1],70);
  return TEXC[key]=c;
}
function pane(g,x,y,w,a,k,al){
  const h=w*0.63, sx=Math.max(0.2,Math.cos(a*0.95)), sk=a*0.2;
  g.save(); g.translate(x,y); g.transform(sx,sk,0,1,0,0);
  g.globalAlpha=al; g.drawImage(card(k),-w/2,-h/2,w,h);
  const sh=g.createLinearGradient(-w/2,-h/2,w/2,h/2); sh.addColorStop(0,'rgba(255,255,255,0.16)'); sh.addColorStop(0.35,'rgba(255,255,255,0)'); g.fillStyle=sh; g.fillRect(-w/2,-h/2,w,h);
  g.strokeStyle='rgba(225,238,255,0.8)'; g.lineWidth=1.5; g.strokeRect(-w/2,-h/2,w,h);
  g.globalCompositeOperation='lighter'; g.strokeStyle='rgba('+CTINT[k%4][0]+',0.35)'; g.lineWidth=7; g.strokeRect(-w/2,-h/2,w,h); g.globalCompositeOperation='source-over';
  g.restore();
}
/* ---- zoom-out layers for Universe: planet, system, galaxy, cosmic web ---- */
let GALX=null, WEB=null;
function galStars(){ if(GALX) return GALX; const r=mulb(1234), a=[]; for(let i=0;i<950;i++){ const arm=i%3, u=Math.pow(r(),0.75), th=u*6.4+arm*2.094+(r()-0.5)*0.5*(1-u*0.4); a.push([Math.cos(th)*u+(r()-0.5)*0.05,Math.sin(th)*u+(r()-0.5)*0.05,u,r()]); } return GALX=a; }
function webData(){ if(WEB) return WEB; const r=mulb(777), n=[]; while(n.length<90){ const x=r()*2-1, y=r()*2-1; if(x*x+y*y<1) n.push([x,y,r()]); }
  const e=[]; for(let i=0;i<n.length;i++){ const d=n.map((q,j)=>[(q[0]-n[i][0])**2+(q[1]-n[i][1])**2,j]).sort((a,b)=>a[0]-b[0]); for(let k=1;k<=2;k++) e.push([i,d[k][1]]); } return WEB={n:n,e:e}; }
function layerPlanet(g,ct,a,S){ const {cx,cy,R}=fx; g.save(); g.globalAlpha=a; planet(g,cx,cy,R*0.4*S,{tex:'earth',cloud:true,rot:ct*0.00003,lx:0.6,ly:-0.6}); g.restore(); }
function layerSystem(g,ct,a,S){ const {cx,cy,R}=fx; g.save(); g.globalAlpha=a; g.strokeStyle='rgba(255,255,255,0.16)'; g.lineWidth=1;
  const ors=[0.14,0.23,0.33,0.45]; for(let i=0;i<4;i++){ g.beginPath(); g.ellipse(cx,cy,R*ors[i]*S*2.4,R*ors[i]*S*2.4*0.42,-0.2,0,TAU); g.stroke(); }
  sun(g,cx,cy,Math.max(1,R*0.05*S*2.4),{t:ct});
  for(let i=0;i<4;i++){ const an=ct*0.0009*(1.6-0.3*i)+i*1.7, ex=Math.cos(an)*R*ors[i]*S*2.4, ey=Math.sin(an)*R*ors[i]*S*2.4*0.42, c=Math.cos(-0.2), s=Math.sin(-0.2); glow(g,cx+ex*c-ey*s,cy+ex*s+ey*c,R*0.03*S*2.4,'150,200,255',0.9); }
  g.restore(); }
function layerGalaxy(g,ct,a,S){ const {cx,cy,R}=fx, A=galStars(), rot=ct*0.00007, c=Math.cos(rot), s=Math.sin(rot), rad=R*0.62*S;
  g.save(); g.globalAlpha=a; glow(g,cx,cy,rad*0.45,'255,230,180',0.7); glow(g,cx,cy,rad*1.2,'110,140,255',0.18);
  g.translate(cx,cy); g.rotate(-0.45); g.scale(1,0.52); g.globalCompositeOperation='lighter';
  for(let i=0;i<A.length;i++){ const q=A[i], x=(q[0]*c-q[1]*s)*rad, y=(q[0]*s+q[1]*c)*rad, u=q[2];
    g.fillStyle=u<0.3?'rgba(255,236,190,'+(0.9-u)+')':q[3]<0.25?'rgba(255,140,190,0.7)':'rgba(150,190,255,'+(0.85-u*0.5)+')'; const z=1.2+q[3]*1.8; g.fillRect(x,y,z,z); }
  g.restore(); }
function layerWeb(g,ct,a,S){ const {cx,cy,R}=fx, W=webData(), rot=ct*0.00004, c=Math.cos(rot), s=Math.sin(rot), rad=R*1.0*S;
  g.save(); g.globalAlpha=a; g.globalCompositeOperation='lighter'; g.strokeStyle='rgba(120,150,255,0.22)'; g.lineWidth=1; g.beginPath();
  const P=W.n.map(q=>[cx+(q[0]*c-q[1]*s)*rad,cy+(q[0]*s+q[1]*c)*rad*0.8]);
  for(const e of W.e){ g.moveTo(P[e[0]][0],P[e[0]][1]); g.lineTo(P[e[1]][0],P[e[1]][1]); } g.stroke();
  for(let i=0;i<P.length;i++){ const q=W.n[i], big=q[2]>0.8; g.fillStyle='rgba(255,'+(220+Math.round(q[2]*30))+',200,'+(0.5+0.5*q[2])+')'; const z=1.6+q[2]*2.6; g.fillRect(P[i][0]-z/2,P[i][1]-z/2,z,z); if(big) glow(g,P[i][0],P[i][1],R*0.03,'255,230,190',0.5); }
  g.restore(); }
/* ---- Determination: a red heart, chains, and a will that does not break ---- */
const hh=(i,k)=>{const x=Math.sin(i*127.1+k*311.7)*43758.5453;return x-Math.floor(x);};
/* the Ember Heart: an original emblem, a faceted heart with a molten crack and a crown of flame */
/* an anatomical human heart: ventricles, atria, aorta, pulmonary artery, vena cava, coronary vessels, with divine light leaking through the groove */
const HSEG=[[[-0.62,-0.30],[-0.95,0.05],[-0.85,0.65],[-0.45,0.98]],[[-0.45,0.98],[-0.30,1.12],[-0.18,1.08],[-0.05,0.9]],[[-0.05,0.9],[0.35,0.55],[0.75,0.2],[0.62,-0.22]],[[0.62,-0.22],[0.5,-0.5],[0.1,-0.55],[-0.15,-0.5]],[[-0.15,-0.5],[-0.35,-0.48],[-0.55,-0.45],[-0.62,-0.30]]];
function heartPath(g,x,y,s){ g.beginPath(); g.moveTo(x+HSEG[0][0][0]*s,y+HSEG[0][0][1]*s); for(const q of HSEG) g.bezierCurveTo(x+q[1][0]*s,y+q[1][1]*s,x+q[2][0]*s,y+q[2][1]*s,x+q[3][0]*s,y+q[3][1]*s); g.closePath(); }
function bez(p0,c1,c2,p1,t){ const u=1-t; return [u*u*u*p0[0]+3*u*u*t*c1[0]+3*u*t*t*c2[0]+t*t*t*p1[0],u*u*u*p0[1]+3*u*u*t*c1[1]+3*u*t*t*c2[1]+t*t*t*p1[1]]; }
function heartPts(n,x,y,s){ const out=[]; for(let i=0;i<n;i++){ const f=i/n*HSEG.length, q=HSEG[Math.floor(f)%HSEG.length], p=bez(q[0],q[1],q[2],q[3],f-Math.floor(f)); out.push([x+p[0]*s,y+p[1]*s]); } return out; }
function tube(g,x,y,s,pts,wd,c,hi){
  const P=pts.map(p=>[x+p[0]*s,y+p[1]*s]), path=()=>{ g.beginPath(); g.moveTo(P[0][0],P[0][1]); for(let i=1;i<P.length-1;i++){ const mx=(P[i][0]+P[i+1][0])/2, my=(P[i][1]+P[i+1][1])/2; g.quadraticCurveTo(P[i][0],P[i][1],mx,my); } g.lineTo(P[P.length-1][0],P[P.length-1][1]); };
  g.lineCap='round'; g.lineJoin='round'; path(); g.strokeStyle='rgba(30,4,8,0.95)'; g.lineWidth=wd*s+2.5; g.stroke(); path(); g.strokeStyle=c; g.lineWidth=wd*s; g.stroke(); path(); g.strokeStyle=hi; g.lineWidth=wd*s*0.28; g.save(); g.translate(-wd*s*0.16,-wd*s*0.1); g.stroke(); g.restore();
}
function heartBody(g,x,y,s,heat){
  s*=1.25; g.save();
  /* great vessels first, so the muscle overlaps their roots */
  tube(g,x,y,s,[[0.38,-0.3],[0.46,-0.7],[0.43,-1.2]],0.15,'rgb(66,78,138)','rgba(150,165,225,0.55)');
  tube(g,x,y,s,[[-0.3,-0.4],[-0.46,-0.78],[-0.7,-0.98]],0.16,'rgb(88,98,150)','rgba(170,180,230,0.55)');
  tube(g,x,y,s,[[-0.08,-0.4],[-0.13,-0.85],[0.02,-1.13],[0.3,-1.0]],0.2,'rgb(176,38,44)','rgba(255,150,140,0.6)');
  tube(g,x,y,s,[[-0.1,-1.02],[-0.17,-1.3]],0.085,'rgb(170,36,42)','rgba(255,150,140,0.5)'); tube(g,x,y,s,[[0.02,-1.1],[0.02,-1.38]],0.085,'rgb(170,36,42)','rgba(255,150,140,0.5)');
  tube(g,x,y,s,[[-0.55,-0.32],[-0.8,-0.5]],0.08,'rgb(120,50,70)','rgba(220,150,170,0.4)');
  /* muscle */
  heartPath(g,x,y,s);
  const gr=g.createRadialGradient(x-0.4*s,y+0.05*s,0.05*s,x-0.05*s,y+0.15*s,1.25*s); gr.addColorStop(0,'rgb('+Math.round(205+40*heat)+','+Math.round(66+70*heat)+','+Math.round(62+40*heat)+')'); gr.addColorStop(0.45,'rgb(150,26,36)'); gr.addColorStop(1,'rgb(74,8,18)'); g.fillStyle=gr; g.fill(); g.save(); g.clip();
  g.fillStyle='rgba(104,28,62,0.75)'; g.beginPath(); g.ellipse(x+0.45*s,y-0.22*s,0.3*s,0.27*s,0.3,0,TAU); g.fill();
  g.fillStyle='rgba(90,24,54,0.55)'; g.beginPath(); g.ellipse(x-0.52*s,y-0.33*s,0.22*s,0.16*s,-0.5,0,TAU); g.fill();
  const groove=[[0.08,-0.5],[0.02,-0.12],[-0.08,0.28],[-0.2,0.64],[-0.17,0.95]], gp=()=>{ g.beginPath(); groove.forEach((p,i)=>i?g.lineTo(x+p[0]*s,y+p[1]*s):g.moveTo(x+p[0]*s,y+p[1]*s)); };
  g.lineJoin='round'; g.lineCap='round'; gp(); g.strokeStyle='rgba(222,186,104,0.7)'; g.lineWidth=s*0.1; g.stroke();
  g.strokeStyle='rgba(188,42,40,0.95)'; g.lineWidth=s*0.03; for(const b of [[[0.04,-0.3],[-0.22,-0.22]],[[-0.04,0.05],[-0.38,0.2]],[[-0.14,0.45],[-0.52,0.55]],[[0.0,-0.1],[0.3,0.05]],[[-0.1,0.3],[0.22,0.42]]]){ g.beginPath(); g.moveTo(x+b[0][0]*s,y+b[0][1]*s); g.lineTo(x+b[1][0]*s,y+b[1][1]*s); g.stroke(); }
  g.strokeStyle='rgba(92,96,170,0.55)'; g.lineWidth=s*0.022; for(const b of [[[0.3,-0.4],[0.5,0.0]],[[0.4,-0.05],[0.18,0.45]],[[-0.3,-0.3],[-0.6,0.1]]]){ g.beginPath(); g.moveTo(x+b[0][0]*s,y+b[0][1]*s); g.lineTo(x+b[1][0]*s,y+b[1][1]*s); g.stroke(); }
  /* light leaking through the groove */
  g.globalCompositeOperation='lighter'; gp(); g.strokeStyle='rgba(255,'+Math.round(170+60*heat)+',90,'+(0.35+0.5*heat)+')'; g.lineWidth=s*0.05; g.stroke(); gp(); g.strokeStyle='rgba(255,210,120,'+(0.1+0.22*heat)+')'; g.lineWidth=s*0.24; g.stroke(); g.globalCompositeOperation='source-over';
  const sh=g.createRadialGradient(x-0.2*s,y+0.1*s,0.3*s,x,y+0.1*s,1.2*s); sh.addColorStop(0,'rgba(20,0,6,0)'); sh.addColorStop(1,'rgba(20,0,6,0.6)'); g.fillStyle=sh; g.fillRect(x-2*s,y-2*s,4*s,4*s);
  g.fillStyle='rgba(255,236,226,0.5)'; g.beginPath(); g.ellipse(x-0.58*s,y+0.2*s,0.06*s,0.34*s,0.32,0,TAU); g.fill(); g.fillStyle='rgba(255,246,240,0.65)'; g.beginPath(); g.arc(x-0.5*s,y-0.12*s,0.045*s,0,TAU); g.fill(); g.fillStyle='rgba(255,236,226,0.28)'; g.beginPath(); g.ellipse(x+0.45*s,y-0.3*s,0.1*s,0.05*s,-0.5,0,TAU); g.fill();
  g.restore();
  g.save(); g.globalCompositeOperation='lighter'; heartPath(g,x,y,s); g.strokeStyle='rgba(255,170,150,'+(0.2+0.25*heat)+')'; g.lineWidth=Math.max(1,s*0.02); g.stroke(); g.restore();
  g.restore();
}
function heartDraw(g,x,y,s,al,heat){
  g.save(); g.globalAlpha=al;
  glow(g,x,y,s*3.4,'255,40,40',0.25+0.22*heat); glow(g,x,y,s*1.8,'255,200,140',0.18+0.2*heat);
  heartBody(g,x,y,s,heat); g.restore();
}
function cloverDraw(g,x,y,s,rot,al){
  if(al<=0.01) return; g.save(); g.globalAlpha=al; glow(g,x,y,s*2.4,'90,230,130',0.35); glow(g,x,y,s*1.3,'255,226,140',0.2);
  g.translate(x,y); g.rotate(rot);
  g.strokeStyle='rgb(40,120,60)'; g.lineWidth=s*0.09; g.lineCap='round'; g.beginPath(); g.moveTo(0,0); g.quadraticCurveTo(s*0.25,s*0.7,s*0.1,s*1.5); g.stroke();
  for(let k=0;k<4;k++){ g.save(); g.rotate(k*Math.PI/2+Math.PI/4); g.beginPath(); g.moveTo(0,-s*0.06); g.bezierCurveTo(-s*0.85,-s*0.2,-s*0.9,-s*1.1,0,-s*0.82); g.bezierCurveTo(s*0.9,-s*1.1,s*0.85,-s*0.2,0,-s*0.06); g.closePath();
    const gr=g.createLinearGradient(0,0,0,-s); gr.addColorStop(0,'rgb(24,110,52)'); gr.addColorStop(0.6,'rgb(70,190,100)'); gr.addColorStop(1,'rgb(170,240,150)'); g.fillStyle=gr; g.fill(); g.strokeStyle='rgba(255,236,160,0.75)'; g.lineWidth=Math.max(1.2,s*0.03); g.stroke();
    g.strokeStyle='rgba(220,255,200,0.5)'; g.lineWidth=Math.max(1,s*0.025); g.beginPath(); g.moveTo(0,-s*0.08); g.lineTo(0,-s*0.7); g.stroke(); g.restore(); }
  g.fillStyle='rgba(255,236,160,0.9)'; g.beginPath(); g.arc(0,0,s*0.07,0,TAU); g.fill();
  for(let i=0;i<9;i++){ const an=hh(i,91)*TAU, d=s*(0.25+0.55*hh(i,92)), px=Math.cos(an)*d, py=Math.sin(an)*d, r=s*(0.025+0.03*hh(i,93)); const dg=g.createRadialGradient(px-r*0.3,py-r*0.3,0,px,py,r); dg.addColorStop(0,'rgba(255,255,255,0.95)'); dg.addColorStop(0.5,'rgba(190,240,230,0.35)'); dg.addColorStop(1,'rgba(20,70,50,0.45)'); g.fillStyle=dg; g.beginPath(); g.arc(px,py,r,0,TAU); g.fill(); }
  g.restore();
}
const PRO_T=[[400,'Before the stars...'],[3200,'before the first light...'],[5600,'there was nothing.'],[7600,'Then there was One.'],[10200,'It gave itself, again and again,'],[12800,'so everything else could exist.'],[15500,'But something else was beginning.'],[18200,'Not made by the One.'],[20400,'Not made by the gods.'],[22600,'It grew in you.'],[25600,'And the sky began to break.'],[28200,'']];
function SHIFTT(a){ return PRO_T.concat(a.map(x=>[x[0]+OFF_SEC,x[1]])); }
function cine(g,ct,gt){ gt=gt===undefined?ct:gt;
  const {w,h,cx,cy,R}=fx; g.save(); g.setTransform(1,0,0,1,0,0);
  const W=g.canvas.width, H=g.canvas.height, bar=Math.round(H*0.095*eo(prog(gt,0,1400))*(1-0.85*prog(ct,T_SEC,T_SEC+1800)));
  const vg=g.createRadialGradient(W/2,H/2,Math.min(W,H)*0.32,W/2,H/2,Math.max(W,H)*0.75); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,0.62)'); g.fillStyle=vg; g.fillRect(0,0,W,H);
  g.globalCompositeOperation='soft-light'; const cg=g.createLinearGradient(0,0,0,H); cg.addColorStop(0,'rgba(40,120,150,0.30)'); cg.addColorStop(1,'rgba(255,140,60,0.30)'); g.fillStyle=cg; g.fillRect(0,0,W,H);
  g.globalCompositeOperation='lighter'; const fr=Math.floor(gt/55);
  for(let i=0;i<90;i++){ g.fillStyle='rgba(255,255,255,'+(0.04+0.05*hh(i+fr,81))+')'; g.fillRect(hh(i+fr*3,82)*W,hh(i+fr*5,83)*H,1.4,1.4); }
  for(let i=0;i<14;i++){ const ph=(gt*0.00004*(0.5+hh(i,84))+hh(i,85))%1, x=W*hh(i,86)+Math.sin(gt*0.0006+i)*30, y=H*(1-ph), r=Math.min(W,H)*(0.018+0.04*hh(i,87)); const gr=g.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,'rgba(255,225,170,0.10)'); gr.addColorStop(1,'rgba(255,225,170,0)'); g.fillStyle=gr; g.beginPath(); g.arc(x,y,r,0,TAU); g.fill(); }
  const pk=Math.max(prog(ct,24500,24700)*(1-prog(ct,24700,26000)),prog(ct,T_SEC,T_SEC+150)*(1-prog(ct,T_SEC+150,T_SEC+2200)));
  if(pk>0){ const gr=g.createLinearGradient(0,0,W,0); gr.addColorStop(0,'rgba(255,200,140,0)'); gr.addColorStop(0.5,'rgba(255,235,200,'+(0.55*pk)+')'); gr.addColorStop(1,'rgba(160,190,255,0)'); g.fillStyle=gr; g.fillRect(0,H*(cy/h)-3-6*pk,W,6+12*pk); }
  if(pk>0){ const fx0=W*(cx/w), fy0=H*(cy/h); for(let k=1;k<=4;k++){ const gx=fx0+(W/2-fx0)*(k*0.55-0.3)*-1.0+(W/2-fx0)*k*0.4, gy=fy0+(H/2-fy0)*k*0.4, rr=Math.min(W,H)*(0.03+0.025*k); g.strokeStyle='rgba('+(k%2?'255,190,120':'140,190,255')+','+(0.22*pk)+')'; g.lineWidth=2+k; g.beginPath(); g.arc(gx,gy,rr,0,TAU); g.stroke(); } }
  g.globalCompositeOperation='source-over'; g.fillStyle='#000'; g.fillRect(0,0,W,bar); g.fillRect(0,H-bar,W,bar); g.restore();
}
function oneOrb(g,x,y,r,t,a,core){
  glow(g,x,y,r*3,'255,235,180',0.3*a); if(core) glow(g,x,y,r*1.5,'255,250,230',0.5*a);
  g.save(); g.translate(x,y); g.globalCompositeOperation='lighter';
  for(let k=0;k<5;k++){ g.rotate(t*0.0004*(k%2?-1:1)+k*0.35); const rr=r*(0.5+0.2*k); g.strokeStyle='rgba(255,240,200,'+(0.75*a/(1+k*0.25))+')'; g.lineWidth=Math.max(1.2,r*0.035); const sd=k%2?3:6; g.beginPath(); for(let i=0;i<=sd;i++){ const an=i*TAU/sd; g.lineTo(Math.cos(an)*rr,Math.sin(an)*rr); } g.stroke(); }
  g.restore();
  if(core){ const gr=g.createRadialGradient(x,y,0,x,y,r*0.55); gr.addColorStop(0,'rgba(255,255,255,'+a+')'); gr.addColorStop(0.5,'rgba(255,236,170,'+(0.85*a)+')'); gr.addColorStop(1,'rgba(255,200,110,0)'); g.fillStyle=gr; g.beginPath(); g.arc(x,y,r*0.55,0,TAU); g.fill(); }
}
function secIcon(g,k,x,y,r,a,t){
  g.save(); g.globalAlpha=a; t=t||0;
  if(k===0) planet(g,x,y,r*0.9,{tex:'earth',cloud:true,rot:t*0.0002,lx:0.8,ly:-0.3});
  else if(k===1) sun(g,x,y,r*0.85,{t:t});
  else if(k===2) hole(g,x,y,r*0.8,t,{});
  else if(k===3){ glow(g,x,y,r*1.2,'170,120,255',0.3); riftDraw(g,x,y,r*1.5,r*0.42,t,-0.3,false); }
  else if(k===4) pane(g,x,y,r*2.4,0.3,2,1);
  else { flower(g,x-r*0.2,y,r*0.75,t*0.0007,10,'255,205,110',1,1,6,true); flower(g,x+r*0.2,y,r*0.75,-t*0.0007,10,'255,110,200',1,1,6,true); }
  g.restore();
}
function youFigure(g,bx,by,s,a,up){
  g.save(); g.globalAlpha=a; g.lineCap='round'; g.fillStyle='#050308'; g.strokeStyle='#050308';
  const ln=(x1,y1,x2,y2,wd)=>{ g.lineWidth=wd*s; g.beginPath(); g.moveTo(bx+x1*s,by+y1*s); g.lineTo(bx+x2*s,by+y2*s); g.stroke(); };
  ln(-0.06,-0.3,-0.1,0,0.085); ln(0.06,-0.3,0.1,0,0.085); ln(-0.19,-0.6,-0.19-0.12*up,-0.6-0.4*up,0.07); ln(0.19,-0.6,0.19+0.12*up,-0.6-0.4*up,0.07);
  g.beginPath(); g.moveTo(bx-0.2*s,by-0.64*s); g.lineTo(bx+0.2*s,by-0.64*s); g.lineTo(bx+0.12*s,by-0.28*s); g.lineTo(bx-0.12*s,by-0.28*s); g.closePath(); g.fill(); g.beginPath(); g.arc(bx,by-0.76*s,s*0.1,0,TAU); g.fill();
  g.strokeStyle='rgba(255,120,100,0.55)'; g.lineWidth=2; g.beginPath(); g.arc(bx,by-0.76*s,s*0.1,Math.PI*1.1,Math.PI*1.9); g.stroke(); g.restore();
}
function riftDraw(g,cx,cy,len,wr,t,ang,big){
  g.save(); g.translate(cx,cy); g.rotate(ang); const n=big?60:14;
  const path=()=>{ g.beginPath(); for(let i=0;i<=n;i++){ const y=-len+2*len*i/n, env=Math.pow(Math.max(0,1-Math.pow(y/len,2)),0.75), x=-wr*env*(0.75+0.5*hh(i,101)*0.7+0.1*Math.sin(t*0.002+i)); if(i) g.lineTo(x,y); else g.moveTo(x,y); } for(let i=n;i>=0;i--){ const y=-len+2*len*i/n, env=Math.pow(Math.max(0,1-Math.pow(y/len,2)),0.75); g.lineTo(wr*env*(0.75+0.5*hh(i,102)*0.7+0.1*Math.sin(t*0.0023+i)),y); } g.closePath(); };
  path(); g.save(); g.clip();
  const gr=g.createLinearGradient(-wr,0,wr,0); gr.addColorStop(0,'#08031a'); gr.addColorStop(0.5,'#3a1070'); gr.addColorStop(1,'#08031a'); g.fillStyle=gr; g.fillRect(-wr*2,-len,wr*4,len*2);
  g.globalCompositeOperation='lighter'; const cols=['120,60,255','255,70,190','60,200,255','255,170,90','150,90,255'];
  for(let j=0;j<5;j++) glow(g,Math.sin(t*0.0004+j*1.7)*wr*0.5,(j-2)*len*0.38,wr*1.3,cols[j],0.4);
  const ns=big?70:16; for(let i=0;i<ns;i++){ const z=((t*0.0004*(0.5+hh(i,103))+hh(i,104))%1), px=(hh(i,105)-0.5)*2*wr*z, py=(hh(i,106)-0.5)*1.4*len*z; g.strokeStyle='rgba(255,245,255,'+z+')'; g.lineWidth=0.5+2*z*(big?1:0.5); g.beginPath(); g.moveTo(px*0.82,py*0.82); g.lineTo(px,py); g.stroke(); }
  g.restore(); g.globalCompositeOperation='lighter'; path(); g.shadowColor='#b48cff'; g.shadowBlur=wr*0.45; g.strokeStyle='rgba(235,220,255,0.9)'; g.lineWidth=Math.max(1.2,wr*0.028); g.stroke(); g.shadowBlur=0; g.strokeStyle='#fff'; g.lineWidth=Math.max(0.6,wr*0.01); g.stroke();
  g.restore();
}
function realExplosion(g,cx,cy,R,t){
  if(t<0||t>9000) return; const e=1-Math.exp(-t/650), tt=t/1000;
  const ramp=a=>{ const S=[[0,255,250,235],[0.15,255,190,90],[0.32,255,110,35],[0.55,120,36,20],[1,30,24,26]]; for(let i=1;i<S.length;i++) if(a<=S[i][0]){ const k=(a-S[i-1][0])/(S[i][0]-S[i-1][0]); return [lerp(S[i-1][1],S[i][1],k),lerp(S[i-1][2],S[i][2],k),lerp(S[i-1][3],S[i][3],k)]; } return [30,24,26]; };
  const puff=(i,smoke)=>{ const a=hh(i,201)*TAU, d=R*(0.25+0.95*hh(i,202)*hh(i,202))*e*(0.35+0.65*hh(i,203)), x=cx+Math.cos(a)*d, y=cy+Math.sin(a)*d*0.85-R*0.3*(t/3500)*hh(i,204), age=t/(2300+2900*hh(i,205)); if(age>=1) return; const hot=age<0.5; if(smoke===hot) return;
    const r=R*(0.07+0.17*hh(i,206))*(0.5+1.7*Math.pow(age,0.55)), c=ramp(age), al=Math.pow(1-age,1.25)*(smoke?0.6:0.15), gr=g.createRadialGradient(x,y,0,x,y,r); const cs=Math.round(c[0])+','+Math.round(c[1])+','+Math.round(c[2]); gr.addColorStop(0,'rgba('+cs+','+al+')'); gr.addColorStop(0.55,'rgba('+cs+','+(al*0.55)+')'); gr.addColorStop(1,'rgba('+cs+',0)'); g.fillStyle=gr; g.beginPath(); g.arc(x,y,r,0,TAU); g.fill(); };
  g.globalCompositeOperation='source-over'; for(let i=0;i<110;i++) puff(i,true);
  g.globalCompositeOperation='lighter'; for(let i=0;i<110;i++) puff(i,false);
  glow(g,cx,cy,R*(0.3+1.2*e),'255,225,170',0.22*Math.exp(-t/350));
  const q=prog(t,0,2600); if(q<1){ const rr=R*(0.1+2.2*eo(q)); g.strokeStyle='rgba(255,245,230,'+(0.8*(1-q))+')'; g.lineWidth=2+10*(1-q); g.beginPath(); g.arc(cx,cy,rr,0,TAU); g.stroke(); g.strokeStyle='rgba(255,170,100,'+(0.08*(1-q))+')'; g.lineWidth=6+24*(1-q); g.beginPath(); g.arc(cx,cy,rr*0.96,0,TAU); g.stroke(); }
  const sp=(v,u)=>v*(1-Math.exp(-1.4*u))/1.4;
  for(let i=0;i<150;i++){ const life=1.2+2.2*hh(i,209); if(tt>life) continue; const a=hh(i,207)*TAU, v=R*(0.8+2.4*hh(i,208)), p=u=>[cx+Math.cos(a)*sp(v,u),cy+Math.sin(a)*sp(v,u)*0.9+R*0.55*u*u], A=p(tt), B=p(Math.max(0,tt-0.045)), f=1-tt/life; g.strokeStyle='rgba(255,'+Math.round(210-120*(1-f))+',90,'+(0.95*f)+')'; g.lineWidth=0.8+1.8*hh(i,210)*f; g.beginPath(); g.moveTo(B[0],B[1]); g.lineTo(A[0],A[1]); g.stroke(); }
  g.globalCompositeOperation='source-over';
}
let MHC=null;
function miniHeart(g,x,y,sz,rot,al){
  if(!MHC){ MHC=document.createElement('canvas'); MHC.width=MHC.height=160; const c=MHC.getContext('2d'); if(c) heartBody(c,80,84,43,0.5); }
  g.save(); g.globalAlpha=al; g.translate(x,y); g.rotate(rot); g.drawImage(MHC,-sz/2,-sz*0.52,sz,sz); g.restore();
}
let QP=null, QPR=0;
function qTargets(){
  const {cx,cy,R}=fx; if(QP&&QPR===Math.round(R)) return QP; QPR=Math.round(R);
  const fs=Math.round(R*0.62), W=Math.round(R*0.85), H=Math.round(R*0.95), c=document.createElement('canvas'); c.width=W; c.height=H; const x=c.getContext('2d'), pts=[];
  if(x){ x.fillStyle='#fff'; x.font='800 '+fs+'px Georgia,"Times New Roman",serif'; x.textAlign='center'; x.textBaseline='middle'; x.lineWidth=fs*0.1; x.strokeStyle='#fff'; x.lineJoin='round'; x.strokeText('?',W/2,H/2); x.fillText('?',W/2,H/2);
    const d=x.getImageData(0,0,W,H).data, st=Math.max(9,Math.round(R*0.05)); for(let yy=0;yy<H;yy+=st) for(let xx=0;xx<W;xx+=st) if(d[(yy*W+xx)*4+3]>140) pts.push([cx-W/2+xx,cy-H/2+yy]); }
  if(!pts.length) pts.push([cx,cy]);
  return QP=pts;
}
const HSP={};
function heartSprite(s){
  s=Math.round(s); if(HSP[s]) return HSP[s];
  const half=Math.ceil(s*2.1), Z=half*2, cv=document.createElement('canvas'); cv.width=cv.height=Z; const x=cv.getContext('2d'), tris=[];
  if(x){ heartBody(x,half,half,s,0.6); const cs=Math.max(8,Math.round(s*0.22)), id=x.getImageData(0,0,Z,Z).data;
    for(let gy=0;gy<Z;gy+=cs) for(let gx=0;gx<Z;gx+=cs){ const a=id[(Math.min(Z-1,gy+(cs>>1))*Z+Math.min(Z-1,gx+(cs>>1)))*4+3]; if(a<40) continue; tris.push([gx,gy,gx+cs,gy,gx,gy+cs]); tris.push([gx+cs,gy,gx+cs,gy+cs,gx,gy+cs]); } }
  return HSP[s]={cv:cv,half:half,tris:tris};
}
/* heaven: shafts of light, a turning halo of gold, drifting cloud banks */
function godRays(g,cx,ct,R,al){
  const {w,h}=fx; g.globalCompositeOperation='lighter';
  for(let k=0;k<11;k++){ const tx=cx+(k-5)*R*0.045+Math.sin(ct*0.0004+k)*R*0.02, bx=cx+(k-5)*R*0.22+Math.sin(ct*0.0003+k*2)*R*0.05, wd=R*(0.05+0.05*hh(k,51)), gr=g.createLinearGradient(0,0,0,h);
    gr.addColorStop(0,'rgba(255,236,190,'+(al*(0.2+0.14*hh(k,52)))+')'); gr.addColorStop(1,'rgba(255,200,120,0)'); g.fillStyle=gr; g.beginPath(); g.moveTo(tx-3,-10); g.lineTo(tx+3,-10); g.lineTo(bx+wd,h); g.lineTo(bx-wd,h); g.closePath(); g.fill(); }
  g.globalCompositeOperation='source-over';
}
function halo(g,cx,cy,r,ct,al){
  if(r<4||al<=0.01) return; g.save(); g.globalCompositeOperation='lighter'; g.translate(cx,cy);
  g.strokeStyle='rgba(255,226,150,'+(0.8*al)+')'; g.lineWidth=2; g.beginPath(); g.arc(0,0,r,0,TAU); g.stroke(); g.strokeStyle='rgba(255,200,110,'+(0.35*al)+')'; g.lineWidth=9; g.beginPath(); g.arc(0,0,r,0,TAU); g.stroke();
  g.rotate(ct*0.00006); g.strokeStyle='rgba(255,236,190,'+(0.8*al)+')'; g.lineWidth=1.4; g.beginPath(); for(let i=0;i<120;i++){ const a=i/120*TAU, l=i%5===0?r*0.07:r*0.035; g.moveTo(Math.cos(a)*r*1.06,Math.sin(a)*r*1.06); g.lineTo(Math.cos(a)*(r*1.06+l),Math.sin(a)*(r*1.06+l)); } g.stroke();
  g.rotate(-ct*0.00014); g.setLineDash([r*0.06,r*0.035]); g.strokeStyle='rgba(255,210,130,'+(0.6*al)+')'; g.lineWidth=2; g.beginPath(); g.arc(0,0,r*0.9,0,TAU); g.stroke(); g.setLineDash([]);
  g.strokeStyle='rgba(255,226,170,'+(0.4*al)+')'; g.lineWidth=1; g.beginPath(); g.arc(0,0,r*1.22,0,TAU); g.stroke(); g.restore();
}
function heavenClouds(g,ct,al,tint){
  const {w,h,R}=fx; for(let i=0;i<14;i++){ const x=((hh(i,41)*w*1.5+ct*0.012*(0.3+hh(i,42)))%(w*1.5))-w*0.25, y=h*(0.72+0.35*hh(i,43)), r=R*(0.35+0.45*hh(i,44)); glow(g,x,y,r,tint||'255,214,170',0.07*al); }
}
function shardDraw(g,SP,cx,cy,fn,alpha){
  for(let i=0;i<SP.tris.length;i++){ const t=SP.tris[i], mx=(t[0]+t[2]+t[4])/3, my=(t[1]+t[3]+t[5])/3, o=fn(i,mx-SP.half,my-SP.half); if(o[3]<=0.01) continue;
    g.save(); g.globalAlpha=alpha*o[3]; g.translate(cx+mx-SP.half+o[0],cy+my-SP.half+o[1]); g.rotate(o[2]); g.translate(-mx,-my); g.beginPath(); g.moveTo(t[0],t[1]); g.lineTo(t[2],t[3]); g.lineTo(t[4],t[5]); g.closePath(); g.clip(); g.drawImage(SP.cv,0,0); g.restore(); }
}
function embersRise(g,ct,n,al,sp){
  const {w,h}=fx; g.globalCompositeOperation='lighter';
  for(let i=0;i<n;i++){ const ph=((ct*0.00012*(sp||1)*(0.5+hh(i,1))+hh(i,2))%1), x=w*(0.05+0.9*hh(i,3))+Math.sin(ct*0.0012+i)*w*0.02, y=h*(1.05-ph*1.15), a=al*Math.sin(ph*3.1416)*(0.4+0.6*hh(i,4)), z=0.8+hh(i,5)*1.8;
    g.fillStyle='rgba(255,'+Math.round(70+hh(i,6)*120)+',40,'+a+')'; g.beginPath(); g.arc(x,y,z,0,TAU); g.fill(); }
  g.globalCompositeOperation='source-over';
}
function redRays(g,cx,cy,R,t,al,n){
  g.globalCompositeOperation='lighter';
  for(let i=0;i<n;i++){ const a=i/n*TAU+t*0.00015, L=R*(0.5+0.9*hh(i,7)), gr=g.createLinearGradient(cx,cy,cx+Math.cos(a)*L,cy+Math.sin(a)*L); gr.addColorStop(0,'rgba(255,60,50,'+(0.4*al)+')'); gr.addColorStop(1,'rgba(255,60,50,0)'); g.strokeStyle=gr; g.lineWidth=1+hh(i,8)*3; g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+Math.cos(a)*L,cy+Math.sin(a)*L); g.stroke(); }
  g.globalCompositeOperation='source-over';
}
function rings(g,cx,cy,R,t,n,al,speed){
  g.globalCompositeOperation='lighter';
  for(let k=0;k<n;k++){ const q=((t*speed+k/n)%1), rr=R*(0.08+1.4*eo(q)); g.strokeStyle='rgba(255,70,60,'+(al*(1-q))+')'; g.lineWidth=2+(1-q)*5; g.beginPath(); g.arc(cx,cy,rr,0,TAU); g.stroke(); }
  g.globalCompositeOperation='source-over';
}
/* steel chain: alternating face-on and edge-on links, shaded, with a sag and the heart's red light catching the metal */
function linkDraw(g,x,y,ang,l,face,red,al){
  const w=l*0.58, th=Math.max(2.2,l*0.2);
  g.save(); g.translate(x,y); g.rotate(ang); g.globalAlpha=al; g.lineCap='round';
  if(face){
    g.strokeStyle='rgba(8,8,12,0.9)'; g.lineWidth=th+2.4; g.beginPath(); g.ellipse(0,0,l*0.5-th*0.3,w*0.5,0,0,TAU); g.stroke();
    const gr=g.createLinearGradient(0,-w/2,0,w/2); gr.addColorStop(0,'rgb(214,216,226)'); gr.addColorStop(0.45,'rgb(112,114,126)'); gr.addColorStop(1,'rgb(34,34,44)');
    g.strokeStyle=gr; g.lineWidth=th; g.beginPath(); g.ellipse(0,0,l*0.5-th*0.3,w*0.5,0,0,TAU); g.stroke();
    g.strokeStyle='rgba(255,255,255,0.65)'; g.lineWidth=Math.max(1,th*0.22); g.beginPath(); g.ellipse(0,-th*0.14,l*0.5-th*0.3,w*0.5,0,Math.PI*1.12,Math.PI*1.78); g.stroke();
  }else{
    const L=l*0.78;
    g.strokeStyle='rgba(8,8,12,0.9)'; g.lineWidth=th*0.95+2.2; g.beginPath(); g.moveTo(-L/2,0); g.lineTo(L/2,0); g.stroke();
    const gr=g.createLinearGradient(0,-th/2,0,th/2); gr.addColorStop(0,'rgb(200,202,212)'); gr.addColorStop(0.5,'rgb(100,102,114)'); gr.addColorStop(1,'rgb(30,30,40)');
    g.strokeStyle=gr; g.lineWidth=th*0.95; g.beginPath(); g.moveTo(-L/2,0); g.lineTo(L/2,0); g.stroke();
  }
  if(red>0){ g.globalCompositeOperation='lighter'; g.strokeStyle='rgba(255,50,40,'+(0.5*red)+')'; g.lineWidth=Math.max(1,th*0.5); g.beginPath(); if(face) g.ellipse(0,0,l*0.5-th*0.3,w*0.5,0,-0.5,1.1); else { g.moveTo(-l*0.3,0); g.lineTo(l*0.3,0); } g.stroke(); }
  g.restore();
}
function chainPt(x1,y1,x2,y2,t,sag){ const mx=(x1+x2)/2, my=(y1+y2)/2+sag, u=1-t; return [u*u*x1+2*u*t*mx+t*t*x2, u*u*y1+2*u*t*my+t*t*y2]; }
function realChain(g,x1,y1,x2,y2,n,al,sag,heartX,heartY,R){
  const dist=Math.hypot(x2-x1,y2-y1), l=dist/n*1.32;
  for(let i=0;i<n;i++){ const t=(i+0.5)/n, p=chainPt(x1,y1,x2,y2,t,sag), q=chainPt(x1,y1,x2,y2,Math.min(1,t+0.02),sag), ang=Math.atan2(q[1]-p[1],q[0]-p[0]), red=Math.max(0,1-Math.hypot(p[0]-heartX,p[1]-heartY)/(R*0.55));
    linkDraw(g,p[0],p[1],ang,l,i%2===0,red,al); }
}
/* ---- screen shatter for The One Before All ---- */
let SHARD=null;
function shardData(){
  if(SHARD) return SHARD;
  const RN=[0,0.16,0.38,0.7,1.25], NS=16, r=mulb(909), V=[], K=[], M=[];
  for(let q=0;q<RN.length;q++){ V.push([]); for(let k=0;k<NS;k++){ const a=(k+(q%2?0.4:0)+(r()-0.5)*0.4)/NS*TAU, rr=q===0?0:RN[q]*(0.9+r()*0.2); V[q].push([Math.cos(a)*rr,Math.sin(a)*rr]); } }
  const mid=(p,q,j)=>[(p[0]+q[0])/2+(r()-0.5)*j,(p[1]+q[1])/2+(r()-0.5)*j];
  for(let q=0;q<RN.length-1;q++){ K.push([]); for(let k=0;k<NS;k++) K[q].push(mid(V[q][k],V[q+1][k],0.07)); }
  for(let q=0;q<RN.length;q++){ M.push([]); for(let k=0;k<NS;k++) M[q].push(mid(V[q][k],V[q][(k+1)%NS],q?0.06:0)); }
  const S=[];
  for(let q=0;q<RN.length-1;q++) for(let k=0;k<NS;k++){
    const k2=(k+1)%NS, poly=[V[q][k],M[q][k],V[q][k2],K[q][k2],V[q+1][k2],M[q+1][k],V[q+1][k],K[q][k]];
    let mx=0,my=0; poly.forEach(p=>{mx+=p[0];my+=p[1];}); mx/=poly.length; my/=poly.length;
    S.push({poly:poly,mx:mx,my:my,q:q,sp:0.5+r()*0.7,rot:(r()-0.5)*0.7,ts:380+q*140+r()*160});
  }
  return SHARD={S:S,V:V,RN:RN};
}
const PAL={fire:['255,246,210','255,150,50','180,40,20'],hit:['255,240,220','120,180,255','255,110,40'],gold:['255,250,230','255,200,90','200,90,30']};
function trail(g,x,y,dx,len,c,th){ const gr=g.createLinearGradient(x,y,x+dx*len,y); gr.addColorStop(0,'rgba('+c+',0.6)'); gr.addColorStop(1,'rgba('+c+',0)'); g.globalCompositeOperation='lighter'; g.fillStyle=gr; g.beginPath(); g.moveTo(x,y-th/2); g.lineTo(x+dx*len,y); g.lineTo(x,y+th/2); g.closePath(); g.fill(); g.globalCompositeOperation='source-over'; }
function collide(g,ct,tb,star){
  const {cx,cy,R,w}=fx, p=prog(ct,0,tb), e=p*p, px=lerp(-R*0.3,cx-R*0.13,e), sx=lerp(w+R*0.3,cx+R*0.13,e);
  glow(g,cx,cy,R*(0.1+0.6*p),'255,190,140',0.18*p);
  const pr=R*0.11, sr=R*0.095;
  trail(g,px-pr,cy,-1,R*(0.2+0.5*p),'140,190,255',pr*0.9); trail(g,sx+sr,cy,1,R*(0.2+0.5*p),'255,170,80',sr*0.9);
  planet(g,px,cy,pr,{tex:'earth',cloud:true,rot:ct*0.00004,lx:0.8,ly:-0.3});
  sun(g,sx,cy,sr,{heat:p*0.5,t:ct});
}
/* Absolute: a flawless black-glass crystal with prismatic light, born where two omniverses collided */
function crystalAt(g,cx,cy,S,rot,tilt,ct,full){
  const V=[[1,0,0],[-1,0,0],[0,1.55,0],[0,-1.55,0],[0,0,1],[0,0,-1]], F=[[0,2,4],[4,2,1],[1,2,5],[5,2,0],[4,3,0],[1,3,4],[5,3,1],[0,3,5]];
  const cr=Math.cos(rot), sr=Math.sin(rot), ct2=Math.cos(tilt), st2=Math.sin(tilt);
  const P=V.map(v=>{ let x=v[0]*cr+v[2]*sr, z=-v[0]*sr+v[2]*cr, y=v[1]; const y2=y*ct2-z*st2, z2=y*st2+z*ct2, k=1/(1+z2*0.12); return {x:cx+x*S*k,y:cy+y2*S*k,z:z2}; });
  const fs=F.map(f=>{ const a=P[f[0]],b=P[f[1]],c=P[f[2]], nx=(b.y-a.y)*(c.z-a.z)-(b.z-a.z)*(c.y-a.y), ny=(b.z-a.z)*(c.x-a.x)-(b.x-a.x)*(c.z-a.z), nz=(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x), L=Math.hypot(nx,ny,nz)||1; return {f:f,z:(a.z+b.z+c.z)/3,sh:(-nx*0.4-ny*0.7+nz*0.6)/L}; }).sort((p,q)=>q.z-p.z);
  fs.forEach(o=>{ const a=P[o.f[0]],b=P[o.f[1]],c=P[o.f[2]], sh=Math.max(0,Math.min(1,0.5+0.5*o.sh)), cl=Math.round(8+sh*sh*190);
    const gr=g.createLinearGradient(a.x,a.y,(b.x+c.x)/2,(b.y+c.y)/2); gr.addColorStop(0,'rgba('+cl+','+cl+','+Math.round(cl*1.12+14)+',0.93)'); gr.addColorStop(1,'rgba(6,7,14,0.93)');
    g.fillStyle=gr; g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.lineTo(c.x,c.y); g.closePath(); g.fill(); });
  g.globalCompositeOperation='lighter'; g.lineJoin='round';
  fs.forEach((o,i)=>{ const a=P[o.f[0]],b=P[o.f[1]],c=P[o.f[2]]; g.strokeStyle='hsla('+((i*45+ct*0.05)%360)+',85%,72%,'+(0.35+0.45*Math.max(0,o.sh))+')'; g.lineWidth=full?1.6:1.2; g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(b.x,b.y); g.lineTo(c.x,c.y); g.closePath(); g.stroke(); });
  g.globalCompositeOperation='source-over'; glow(g,cx,cy,S*0.5,'255,255,255',0.35);
  g.globalCompositeOperation='lighter';
  for(let k=0;k<3;k++){ const a=ct*0.0004*(k+1)+k*2.1, rx=S*(1.5+k*0.3), ry=rx*(0.18+0.08*Math.sin(a)); g.strokeStyle='hsla('+((k*80+ct*0.04)%360)+',70%,78%,0.55)'; g.lineWidth=1.2; g.beginPath(); g.ellipse(cx,cy,rx,ry,0.5*k-0.3+Math.sin(ct*0.0003+k)*0.15,0,TAU); g.stroke(); }
  g.globalCompositeOperation='source-over';
}
/* Absolute: a flawless black-glass crystal with prismatic light, born where two omniverses collided */
function absCrystal(g,ct,t){
  const {cx,cy,R}=fx, grow=eo(prog(t,150,1700)), S=R*0.27*grow, rot=ct*0.00055, tilt=0.38+0.08*Math.sin(ct*0.0004);
  glow(g,cx,cy,R*(0.5+0.7*grow),'200,215,255',0.22*grow);
  g.globalCompositeOperation='lighter';
  for(let i=0;i<36;i++){ const a=i/36*TAU+ct*0.00012, L=R*(0.6+0.5*((i*7)%5)/5)*grow, ca=Math.cos(a), sa=Math.sin(a), gr=g.createLinearGradient(cx+ca*S*0.9,cy+sa*S*0.9,cx+ca*L,cy+sa*L); gr.addColorStop(0,'hsla('+((i*10+ct*0.03)%360)+',80%,75%,0.3)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.strokeStyle=gr; g.lineWidth=1+(i%3); g.beginPath(); g.moveTo(cx+ca*S*0.9,cy+sa*S*0.9); g.lineTo(cx+ca*L,cy+sa*L); g.stroke(); }
  g.globalCompositeOperation='source-over';
  g.globalAlpha=Math.min(1,grow*1.4); crystalAt(g,cx,cy,S,rot,tilt,ct,true); g.globalAlpha=1;
  streak(g,cx,cy,R*0.9*grow,'220,230,255',0.4,0.014);
}
/* pre-rendered tree flowers: the Omniverse is hundreds of branches, so each ring of trees is painted once and then stamped as one image */
const TSPR={};
function flowerSprite(n,from,dm,c0,c1){
  const key=n+'|'+from+'|'+dm; if(TSPR[key]) return TSPR[key];
  const Z=384, c=document.createElement('canvas'); c.width=c.height=Z*2; const x=c.getContext('2d');
  if(x) for(let k=from;k<n;k++) drawTree(x,Z,Z,Z/3.4,k*TAU/n,1,k%2?c1:c0,1,dm,k===0);
  return TSPR[key]={c:c,Z:Z};
}
function flowerS(g,x,y,S,rot,al,n,from,dm,c0,c1){
  const sp=flowerSprite(n,from,dm,c0,c1); if(!sp.c.getContext) return;
  g.save(); g.globalCompositeOperation='lighter'; g.globalAlpha=al; g.translate(x,y); g.rotate(rot); const k=S/(sp.Z/3.4); g.scale(k,k); g.drawImage(sp.c,-sp.Z,-sp.Z); g.restore();
}
const SCENE={
  planetary(g,ct){
    const {cx,cy,R,w,h}=fx, p=ct<1500?ct/1500:ct<2400?1-(ct-1500)/900:0;
    cam(g,1+0.04*prog(ct,0,5000),p*1.5); bgSpace(g,ct,0.35);
    if(p>0.02){ g.globalCompositeOperation='lighter'; for(let i=0;i<110;i++){ const ph=((ct*0.0011*(0.5+p*2.4)+i*0.1618)%1), a=i*2.399+Math.sin(i)*0.3, r1=R*0.04+Math.pow(ph,1.6)*R*1.25, l=R*(0.03+p*0.55)*ph, ca=Math.cos(a), sa=Math.sin(a);
      const gr=g.createLinearGradient(cx+ca*r1,cy+sa*r1,cx+ca*(r1+l),cy+sa*(r1+l)); gr.addColorStop(0,'rgba(170,200,255,0)'); gr.addColorStop(1,'rgba(235,245,255,'+(0.25+0.6*ph)+')');
      g.strokeStyle=gr; g.lineWidth=0.8+ph*2.4; g.beginPath(); g.moveTo(cx+ca*r1,cy+sa*r1); g.lineTo(cx+ca*(r1+l),cy+sa*(r1+l)); g.stroke(); }
      g.globalCompositeOperation='source-over'; glow(g,cx,cy,R*0.5,'200,225,255',0.35*p); }
    const pr=ease(prog(ct,1300,2800)), py=h+R*0.95-pr*R*0.53;
    if(pr>0){ g.save(); g.translate(0,Math.sin(ct/900)*2);
      glow(g,cx+R*0.55,py-R*0.82,R*0.9,'255,190,110',0.55*pr); streak(g,cx+R*0.55,py-R*0.86,R*1.6,'255,210,150',0.55*pr,0.03);
      planet(g,cx,py,R*0.9,{tex:'earth',cloud:true,rot:ct*0.000025,lx:0.5,ly:-0.85,atm:'110,175,255'}); g.restore(); }
  },
  star(g,ct){
    const {cx,cy,R}=fx, tb=T_BOOM;
    if(ct<tb){
      const p=prog(ct,0,tb), q=p*p; cam(g,1+0.3*q,q*9); bgSpace(g,ct,0.4);
      const r=R*0.15*(1+0.1*Math.sin(ct/(150-90*p)))*(p>0.8?1-(p-0.8)*3:1);
      sun(g,cx,cy,r,{heat:p,t:ct});
      g.globalCompositeOperation='lighter';
      for(let i=0,c=Math.floor(p*14);i<c;i++){ const a=i*2.7+1, d0=r*0.3, d1=r*(0.9+0.9*((i*7)%5)/5)*(0.5+p); const gr=g.createLinearGradient(cx+Math.cos(a)*d0,cy+Math.sin(a)*d0,cx+Math.cos(a)*d1,cy+Math.sin(a)*d1); gr.addColorStop(0,'rgba(255,255,230,0.9)'); gr.addColorStop(1,'rgba(255,200,120,0)'); g.strokeStyle=gr; g.lineWidth=1+((i*3)%3); g.beginPath(); g.moveTo(cx+Math.cos(a)*d0,cy+Math.sin(a)*d0); g.lineTo(cx+Math.cos(a)*d1,cy+Math.sin(a)*d1); g.stroke(); }
      g.globalCompositeOperation='source-over'; streak(g,cx,cy,R*(0.5+p*0.9),'255,220,160',0.35+0.4*p,0.025);
      if(p>0.85) setFlash(ct,tb-150,150);
    }else{
      const t=ct-tb; cam(g,1.08-0.05*prog(t,0,3000),Math.max(0,7*(1-t/900))); bgSpace(g,ct,0.45);
      glow(g,cx,cy,R*(0.8+0.5*prog(t,0,2800)),'255,90,40',0.16+0.06*Math.sin(t/400));
      fireball(g,cx,cy,t,R,PAL.fire); streak(g,cx,cy,R*1.3,'255,230,190',Math.max(0,0.6-t/2500),0.02);
      setFlash(ct,tb,650);
    }
  },
  impact(g,ct){
    const {cx,cy,R}=fx, tb=T_HIT;
    if(ct<tb){ const p=prog(ct,0,tb); cam(g,1+0.12*p,prog(ct,tb-600,tb)*8); bgSpace(g,ct,0.35); collide(g,ct,tb); if(p>0.9) setFlash(ct,tb-80,80); }
    else{ const t=ct-tb; cam(g,1.06-0.03*prog(t,0,3000),Math.max(0,9*(1-t/900))); bgSpace(g,ct,0.4); fireball(g,cx,cy,t,R,PAL.hit); setFlash(ct,tb,600); }
  },
  system(g,ct){
    const {cx,cy,R}=fx, tb=T_HIT;
    if(ct<tb){ const p=prog(ct,0,tb); cam(g,1+0.12*p,prog(ct,tb-600,tb)*8); bgSpace(g,ct,0.35); collide(g,ct,tb); if(p>0.9) setFlash(ct,tb-80,80); }
    else if(ct<3000){ const t=ct-tb; cam(g,1.06,Math.max(0,9*(1-t/900))); bgSpace(g,ct,0.4); fireball(g,cx,cy,t,R,PAL.hit); setFlash(ct,tb,600); }
    else if(ct<T_SYS){
      cam(g,1.06-0.06*prog(ct,3000,T_SYS),0); bgSpace(g,ct,0.4);
      const p=prog(ct,3000,T_SYS), e=ease(p), rr=mulb(21);
      glow(g,cx,cy,R*(0.2+0.5*e),'255,200,120',0.25+0.3*e);
      g.globalCompositeOperation='lighter';
      for(let i=0;i<90;i++){ const a0=rr()*TAU, d0=R*(0.25+rr()*0.55), a=a0+ct*0.0022*(1+p*3)*(1.2-d0/R*0.6), d=d0*(1-0.85*e*(0.6+rr()*0.4));
        g.fillStyle='rgba(255,'+Math.round(170+rr()*70)+',110,'+(0.4+0.5*rr())+')'; g.fillRect(cx+Math.cos(a)*d,cy+Math.sin(a)*d*0.82,1.5+rr()*2,1.5+rr()*2); }
      g.globalCompositeOperation='source-over';
      sun(g,cx,cy,R*(0.012+0.07*e),{heat:0.1,t:ct});
      if(p>0.94) setFlash(ct,T_SYS-80,80);
    }else{
      const t=ct-T_SYS; cam(g,1+0.04*prog(t,0,3000),0); bgSpace(g,ct,0.4); setFlash(ct,T_SYS,700,'255,240,200');
      const ors=[0.17,0.26,0.36,0.48], tx=['earth','lava','earth','lava'], sz=[0.026,0.02,0.034,0.03];
      g.strokeStyle='rgba(255,255,255,0.11)'; g.lineWidth=1;
      for(let i=0;i<4;i++){ g.beginPath(); g.ellipse(cx,cy,R*ors[i],R*ors[i]*0.4,-0.2,0,TAU); g.stroke(); }
      const list=[]; for(let i=0;i<4;i++){ const a=ct*0.0011*(1.7-0.3*i)+i*1.7, ex=Math.cos(a)*R*ors[i], ey=Math.sin(a)*R*ors[i]*0.4, c=Math.cos(-0.2), s=Math.sin(-0.2); list.push({x:cx+ex*c-ey*s,y:cy+ex*s+ey*c,i:i,back:Math.sin(a)<0}); }
      const dr=b=>{ const lx=cx-b.x, ly=cy-b.y, L=Math.hypot(lx,ly)||1; planet(g,b.x,b.y,R*sz[b.i],{tex:tx[b.i],cloud:b.i%2===0,rot:ct*0.0001*(b.i+1),lx:lx/L,ly:ly/L,atm:b.i%2?'255,150,90':'110,175,255'}); };
      list.filter(b=>b.back).forEach(dr); sun(g,cx,cy,R*0.075,{heat:0.1,t:ct}); list.filter(b=>!b.back).forEach(dr);
    }
  },
  blackhole(g,ct){
    const {cx,cy,R}=fx, tb=T_BH;
    if(ct<tb){
      const p=prog(ct,0,tb); cam(g,1+0.2*p*p,p*p*7); bgSpace(g,ct,0.4);
      const r=R*0.16*(1-0.6*ease(prog(p,0.05,0.88)))*(p>0.88?1-(p-0.88)*7:1);
      sun(g,cx,cy,Math.max(R*0.01,r),{heat:Math.min(1,p*1.6),t:ct});
      if(p>0.3){ g.globalCompositeOperation='lighter'; const rr=mulb(8); for(let i=0;i<70;i++){ const a0=rr()*TAU, ph=((ct*0.0012+rr())%1), d=R*(0.62-0.55*ph), a=a0+ph*3.2, al=(0.2+0.6*ph)*prog(p,0.3,0.5);
        g.fillStyle='rgba(255,'+Math.round(140+rr()*80)+',80,'+al+')'; g.fillRect(cx+Math.cos(a)*d,cy+Math.sin(a)*d*0.85,1.6+rr()*2,1.6+rr()*2); } g.globalCompositeOperation='source-over'; }
      if(p>0.9) setFlash(ct,tb-100,100);
    }else{
      const t=ct-tb, e=ease(prog(t,0,1100)); cam(g,1.12-0.05*prog(t,0,3000),Math.max(0,8*(1-t/700))); bgSpace(g,ct,0.35); setFlash(ct,tb,500,'255,235,210');
      hole(g,cx,cy,R*0.13*e+R*0.004,ct,{k:e});
    }
  },
  beyond(g,ct){
    const {cx,cy,R}=fx, tb=T_BEY;
    if(ct<tb){
      if(ct<1500){
        cam(g,1.02,0); bgSpace(g,ct,0.4); const bob=Math.sin(ct/420)*3;
        g.globalCompositeOperation='lighter'; g.strokeStyle='rgba(200,170,255,0.2)'; g.lineWidth=1; g.beginPath(); g.moveTo(cx-R*0.3,cy+bob); g.lineTo(cx+R*0.3,cy+bob); g.stroke(); g.globalCompositeOperation='source-over';
        planet(g,cx-R*0.32,cy+bob,R*0.09,{tex:'earth',cloud:true,rot:ct*0.00004,lx:0.8,ly:-0.3});
        sun(g,cx,cy-bob,R*0.075,{t:ct}); hole(g,cx+R*0.32,cy+bob,R*0.055,ct,{});
      }else{
        const p=prog(ct,1500,tb), e=ease(p), base=ct*0.0035*(1+3*p); cam(g,1+0.2*p,p*p*9); bgSpace(g,ct,0.4);
        glow(g,cx,cy,R*(0.1+0.8*e),'200,140,255',0.2+0.5*e);
        for(let i=0;i<3;i++){ const a0=base+i*2.0944, d=R*0.32*(1-e*0.93);
          g.globalCompositeOperation='lighter'; for(let k=1;k<=14;k++){ const a=a0-k*0.07, dd=d*(1+k*0.004), x=cx+Math.cos(a)*dd, y=cy+Math.sin(a)*dd*0.82; g.fillStyle='rgba('+(i===0?'140,190,255':i===1?'255,200,120':'200,140,255')+','+(0.5*(1-k/14))+')'; const z=R*0.03*(1-k/14)*(1-e*0.6)+1; g.fillRect(x-z/2,y-z/2,z,z); } g.globalCompositeOperation='source-over';
          const x=cx+Math.cos(a0)*d, y=cy+Math.sin(a0)*d*0.82, s=1-e*0.75;
          if(i===0) planet(g,x,y,R*0.085*s,{tex:'earth',cloud:true,rot:ct*0.0002,lx:(cx-x)/R,ly:(cy-y)/R}); else if(i===1) sun(g,x,y,R*0.075*s,{heat:e*0.5,t:ct}); else hole(g,x,y,R*0.055*s,ct,{}); }
        if(p>0.92) setFlash(ct,tb-80,80);
      }
    }else{
      const t=ct-tb; cam(g,1+0.04*prog(t,0,6000),0); g.fillStyle='#02010a'; g.fillRect(-60,-60,fx.w+120,fx.h+120); setFlash(ct,tb,700,'240,225,255');
      bgSpace(g,ct,0.5); const wr=R*(0.03+0.3*eo(prog(t,0,3200)))*(1+0.03*Math.sin(t*0.002));
      glow(g,cx,cy,R*(0.5+0.6*eo(prog(t,0,3200))),'170,120,255',0.28);
      riftDraw(g,cx,cy,R*2.1,wr,t,-0.3,true);
      g.globalCompositeOperation='lighter'; for(let i=0;i<26;i++){ const f=((t*0.00012*(0.6+hh(i,107))+hh(i,108))%1), yy=(hh(i,109)-0.5)*2*R*1.4, side=i%2?1:-1, d=wr*0.9+f*R*0.9, x=Math.cos(-0.3)*side*d-Math.sin(-0.3)*yy, y=Math.sin(-0.3)*side*d+Math.cos(-0.3)*yy, sz=R*(0.012+0.02*hh(i,110))*(1-f*0.6); g.save(); g.translate(cx+x,cy+y); g.rotate(t*0.001*side+i); g.fillStyle='rgba(215,200,255,'+(0.8*(1-f))+')'; g.beginPath(); g.moveTo(0,-sz); g.lineTo(sz*0.8,sz*0.7); g.lineTo(-sz*0.8,sz*0.7); g.closePath(); g.fill(); g.restore(); }
      g.globalCompositeOperation='source-over'; streak(g,cx,cy,R*1.1,'210,190,255',0.5,0.02);
    }
  },
  universe(g,ct){
    const {cx,cy,R}=fx, tb=T_UNI, u=prog(ct,0,tb), z=ct<tb?ease(u)*3.3:3.3+(ct-tb)*0.00003;
    cam(g,1+(ct<tb?0:0.03*prog(ct-tb,0,4000)),ct<tb?u*u*3:0); bgSpace(g,ct,0.22);
    const vis=n=>{ const S=Math.pow(6.5,n-z); return {S:S,a:clamp01((S-0.03)/0.05)*clamp01((3.8-S)/2.4)}; };
    let v=vis(3); if(v.a>0.01) layerWeb(g,ct,v.a,v.S);
    v=vis(2); if(v.a>0.01) layerGalaxy(g,ct,v.a,v.S);
    v=vis(1); if(v.a>0.01) layerSystem(g,ct,v.a,v.S);
    v=vis(0); if(v.a>0.01) layerPlanet(g,ct,v.a,v.S);
    if(ct<tb&&u>0.93) setFlash(ct,tb-100,100);
    if(ct>=tb){ setFlash(ct,tb,800,'215,225,255'); glow(g,cx,cy,R*0.9,'140,170,255',0.16+0.05*Math.sin(ct/500)); }
  },
  multiverse(g,ct){
    const {cx,cy,R,w}=fx, tb=T_MULTI; cam(g,1+0.05*prog(ct,0,5000),ct>2600&&ct<tb?prog(ct,2600,tb)*5:0); bgSpace(g,ct,0.3);
    const ST=[0,700,1500,2300,3100], NN=[1,2,4,8,16];
    const place=(i,n)=>{ const sp=Math.min(R*0.5,w*0.9/Math.max(1,n)), t=i-(n-1)/2; return {x:cx+t*sp*0.82,y:cy+t*R*0.012,a:clamp01(Math.abs(t)/(n/2+0.01))*Math.sign(t)*0.95,w:Math.min(R*0.64,sp*1.75),z:Math.abs(t)}; };
    if(ct<tb){
      let k=0; for(let i=0;i<ST.length;i++) if(ct>=ST[i]) k=i;
      const n=NN[k], s=ease(prog(ct,ST[k],ST[k]+520)), pn=k>0?NN[k-1]:n, list=[];
      for(let i=0;i<n;i++){ const to=place(i,n), from=i<pn?place(i,pn):place(i-pn,pn); list.push({x:lerp(from.x,to.x,s),y:lerp(from.y,to.y,s),a:lerp(from.a,to.a,s),w:lerp(from.w,to.w,s),z:to.z,i:i}); }
      list.sort((a,b)=>b.z-a.z);
      glow(g,cx,cy,R*0.8,'120,170,255',0.16);
      list.forEach(b=>{ glow(g,b.x,b.y,b.w*0.9,CTINT[b.i%4][0],0.18); pane(g,b.x,b.y+Math.sin(ct/500+b.i)*3,b.w,b.a,b.i,0.96); });
      if(ct>tb-90) setFlash(ct,tb-90,90);
    }else{
      setFlash(ct,tb,700); const N=14, list=[];
      for(let i=0;i<N;i++){ const th=i/N*TAU+ct*0.0005; list.push({x:cx+Math.sin(th)*R*0.82,y:cy+Math.sin(th*2+i)*R*0.03,d:Math.cos(th),a:-Math.sin(th)*0.9,i:i}); }
      list.sort((a,b)=>a.d-b.d); glow(g,cx,cy,R*0.8,'140,170,255',0.22);
      list.forEach(b=>{ const dd=(b.d+1)/2; pane(g,b.x,b.y,R*(0.22+0.3*dd),b.a,b.i,0.25+0.75*dd); });
    }
  },
  omniverse(g,ct){
    const {cx,cy,R}=fx, tb=T_OMNI, S0=R*0.17;
    if(ct<tb){
      cam(g,1,0); bgSpace(g,ct,0.22);
      const grow=prog(ct,0,2600), zo=1-0.25*ease(prog(ct,2400,tb));
      if(grow<1) drawTree(g,cx,cy,S0*zo,ct*0.00008,grow,'255,215,140',1,7,true); else flowerS(g,cx,cy,S0*zo,ct*0.00008,1,12,0,7,'255,215,140','255,170,200');
      flowerS(g,cx,cy,S0*zo,ct*0.00008,ease(prog(ct,1500,2600)),12,1,7,'255,215,140','255,170,200');
      glow(g,cx,cy,R*(0.05+0.25*prog(ct,2000,tb)),'255,240,210',0.5+0.4*prog(ct,2000,tb));
      if(ct>tb-90) setFlash(ct,tb-90,90);
    }else{
      const t=ct-tb; cam(g,1,0); bgSpace(g,ct,0.18); setFlash(ct,tb,700,'255,240,210');
      const ph=(t*0.00022)%1, NT=[10,8,6,5], DD=[7,6,5,4];
      for(let q=3;q>=0;q--){ const sc=Math.pow(2.7,q-ph), a=clamp01((sc-0.3)/0.25)*clamp01((3.6-sc)/1.6); if(a<0.02) continue;
        flowerS(g,cx,cy,S0*0.78*sc,(q%2?-1:1)*t*0.00012+q,a,NT[q],0,DD[q],'255,215,140','255,170,200'); }
      glow(g,cx,cy,R*0.16,'255,248,230',0.95); glow(g,cx,cy,R*0.5,'255,215,140',0.22+0.06*Math.sin(t/400));
    }
  },
  determination(g,ct){
    const {cx,cy,R,w,h}=fx, tb=T_DET, tC=4200, tR=6400, tU=8300, sH=R*0.17, SP=heartSprite(sH);
    const rise=prog(ct,900,2600);
    const beat=Math.pow(Math.max(0,Math.sin(ct*(0.0045+0.011*prog(ct,8300,9000)))),6);
    /* where each shard of glass-red heart is while it is broken */
    const brk=(i,mx,my,tau)=>{ const a=Math.atan2(my,mx)+(hh(i,21)-0.5)*1.2, sp=R*(0.25+0.9*hh(i,22)), e=1-Math.exp(-tau*2.2);
      return [Math.cos(a)*sp*e*0.5, Math.sin(a)*sp*e*0.5-R*0.12*e+R*0.16*tau*tau, (hh(i,24)-0.5)*4*e]; };
    if(ct<tb){
      const shake=ct>=tC&&ct<tC+700?10*(1-(ct-tC)/700):0;
      cam(g,1+0.05*prog(ct,0,tb),shake); bgSpace(g,ct,0.18); heavenClouds(g,ct,0.5+0.5*prog(ct,tU,tb),ct<tR?'200,70,60':'255,214,170'); if(ct<tC) godRays(g,cx,ct,R,rise*0.9); embersRise(g,ct,40,0.35,0.6);
      if(ct<tC){
        /* it was made in you: a small light, then a heart that beats calmly */
        glow(g,cx,cy,R*(0.05+0.3*prog(ct,300,2600)),'255,40,40',0.1+0.25*prog(ct,300,3000));
        const a=eo(prog(ct,2200,3600)); if(a>0) heartDraw(g,cx,cy,sH*(1+0.03*beat),a,0.25+0.35*beat);
      }else{
        const tau=(ct-tC)/1000; setFlash(ct,tC,500,'255,200,180');
        const back=ct>=tR, dim=back?1:Math.max(0.3,1-tau*0.35);
        if(!back) glow(g,cx,cy,R*0.25,'120,10,20',0.18);
        if(ct<tU){
          shardDraw(g,SP,cx,cy,(i,mx,my)=>{ let o;
            if(!back){ o=brk(i,mx,my,tau); return [o[0],o[1],o[2],dim]; }
            const st=tR+hh(i,23)*700, q=eo(prog(ct,st,st+1300)), o0=brk(i,mx,my,(tR-tC)/1000);
            if(q>0&&q<1){ g.globalCompositeOperation='lighter'; g.fillStyle='rgba(255,90,50,'+(0.4*(1-q))+')'; g.beginPath(); g.arc(cx+mx+lerp(o0[0],0,q*0.8),cy+my+lerp(o0[1],0,q*0.8),2.2,0,TAU); g.fill(); g.globalCompositeOperation='source-over'; }
            return [lerp(o0[0],0,q),lerp(o0[1],0,q),lerp(o0[2],0,q),1]; },1);
          if(back){ const e=prog(ct,tR,tU); glow(g,cx,cy,R*0.45*e,'255,50,40',0.3*e); rings(g,cx,cy,R,(ct-tR)*0.0005,2,0.4*e,1); }
        }else{ const e=prog(ct,tU,tb); godRays(g,cx,ct,R,e); halo(g,cx,cy,R*0.5*eo(e),ct,e); glow(g,cx,cy,R*(0.3+0.5*e),'255,40,40',0.25+0.35*e); heartDraw(g,cx,cy,sH*(1+0.04*beat),1,0.5+0.5*beat+e*0.4); }
        /* the chains it breaks free of: they lash out from the heart and go taut */
        if(ct>=tU){ const ext=eo(prog(ct,tU,tb-120));
          for(let k=0;k<9;k++){ const a=k/9*TAU+0.2, d1=sH*1.15, d2=d1+(R*1.25-d1)*ext; realChain(g,cx+Math.cos(a)*d1,cy+Math.sin(a)*d1,cx+Math.cos(a)*d2,cy+Math.sin(a)*d2,Math.max(2,Math.round(16*ext)),0.95,0,cx,cy,R); } }
      }
      if(ct>tb-130) setFlash(ct,tb-130,130,'255,235,225');
    }else{
      const t=ct-tb, tau=t/1000; cam(g,1.05,Math.max(0,14*(1-t/900))); bgSpace(g,ct,0.3); setFlash(ct,tb,1000,'255,205,190');
      heavenClouds(g,ct,1,'255,200,150'); godRays(g,cx,ct,R,1); redRays(g,cx,cy,R*1.6,ct,0.8,44); glow(g,cx,cy,R*(0.7+0.3*prog(t,0,1500)),'255,20,30',0.22+0.1*(0.5+0.5*Math.sin(ct*0.0065)));
      halo(g,cx,cy,R*0.55*eo(prog(t,0,1200)),ct,1);
      rings(g,cx,cy,R,t*0.0004,4,0.6,1);
      for(let k=0;k<9;k++){ const a=k/9*TAU+0.2; for(let i=0;i<16;i++){ const d0=sH*1.15+i*(R*1.25-sH*1.15)/16, sp=R*(0.5+0.9*hh(i+k*20,12)), jitter=(hh(i,13)-0.5)*R*0.6,
          x=cx+Math.cos(a)*d0+Math.cos(a)*sp*tau+Math.cos(a+1.57)*jitter*tau, y=cy+Math.sin(a)*d0+Math.sin(a)*sp*tau+Math.sin(a+1.57)*jitter*tau+R*1.1*tau*tau;
          linkDraw(g,x,y,hh(i,15)*6+tau*(3+hh(i,16)*9),R*0.07,i%2===0,0.25,Math.max(0,1-tau/1.8)); } }
      heartDraw(g,cx,cy,sH*(1.05+0.04*Math.sin(ct*0.0065)),1,0.8);
      embersRise(g,ct,120,0.9,2.2);
    }
  },
  click(g,ct){
    /* the red heart and the golden light, both made from you, rush together */
    const {cx,cy,R,w,h}=fx, tc=4000, p=prog(ct,0,tc), e=p*p*p, sH=R*0.12;
    cam(g,1+0.1*e,e*9*(ct<tc?1:0)); bgSpace(g,ct,0.15);
    const lx=lerp(cx-R*0.8,cx-R*0.06,e), rx=lerp(cx+R*0.8,cx+R*0.06,e);
    if(ct<tc){
      redRays(g,lx,cy,R*0.9,ct,0.6,18);
      heartDraw(g,lx,cy,sH,1,0.5+0.5*p);
      glow(g,rx,cy,R*(0.25+0.3*p),'255,226,150',0.5+0.3*p); glow(g,rx,cy,R*0.08,'255,255,240',0.9);
      g.globalCompositeOperation='lighter'; for(let i=0;i<10;i++){ const a=i/10*TAU+ct*0.003, rr=R*0.09*(1+0.3*p); g.fillStyle='rgba(255,236,190,0.85)'; g.beginPath(); g.arc(rx+Math.cos(a)*rr,cy+Math.sin(a)*rr,3,0,TAU); g.fill(); } g.globalCompositeOperation='source-over';
      g.globalCompositeOperation='lighter'; const gr=g.createLinearGradient(lx,cy,rx,cy); gr.addColorStop(0,'rgba(255,60,40,'+(0.5*p)+')'); gr.addColorStop(1,'rgba(255,226,150,'+(0.5*p)+')'); g.strokeStyle=gr; g.lineWidth=2+6*p; g.beginPath(); g.moveTo(lx,cy); g.lineTo(rx,cy); g.stroke(); g.globalCompositeOperation='source-over';
      if(p>0.94) setFlash(ct,tc-120,120,'255,255,255');
    }else{
      /* the click: a held breath, one thin line of light, then a ring */
      const t=ct-tc, hold=prog(t,0,900), ring=prog(t,900,2200);
      g.fillStyle='#000'; g.fillRect(-60,-60,w+120,h+120);
      if(t<900){ g.fillStyle='rgba(255,255,255,'+(1-hold)+')'; g.fillRect(0,0,w,h); }
      g.globalCompositeOperation='lighter'; g.fillStyle='rgba(255,240,215,'+(0.9*eo(prog(t,300,900)))+')'; g.fillRect(cx-R*0.5*eo(prog(t,300,1100)),cy-1,R*eo(prog(t,300,1100)),2);
      if(ring>0){ g.strokeStyle='rgba(255,226,170,'+(1-ring)+')'; g.lineWidth=2+8*(1-ring); g.beginPath(); g.arc(cx,cy,R*(0.05+1.2*eo(ring)),0,TAU); g.stroke(); g.strokeStyle='rgba(255,70,50,'+(0.7*(1-ring))+')'; g.beginPath(); g.arc(cx,cy,R*(0.02+0.8*eo(ring)),0,TAU); g.stroke(); }
      g.globalCompositeOperation='source-over'; glow(g,cx,cy,R*(0.1+0.4*ring),'255,230,190',0.5*(1-ring)+0.2); if(ring>0.2&&ring<0.3) fx.flash=Math.max(fx.flash,0.5);
    }
  },
  finale(g,ct){
    /* heart and light fused: a pixel heart with a golden crack inside a gold-red storm */
    const {cx,cy,R}=fx, p=prog(ct,0,4500), beat=0.5+0.5*Math.sin(ct*(0.006+0.012*p));
    cam(g,1+0.1*p*p,p*p*10); bgSpace(g,ct,0.2); redRays(g,cx,cy,R*1.5,ct,0.5+0.5*p,34);
    g.globalCompositeOperation='lighter'; for(let i=0;i<26;i++){ const a=i/26*TAU-ct*0.0002, L=R*(0.5+0.9*hh(i,31)), gr=g.createLinearGradient(cx,cy,cx+Math.cos(a)*L,cy+Math.sin(a)*L); gr.addColorStop(0,'rgba(255,226,150,'+(0.35*p)+')'); gr.addColorStop(1,'rgba(255,226,150,0)'); g.strokeStyle=gr; g.lineWidth=1+hh(i,32)*3; g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+Math.cos(a)*L,cy+Math.sin(a)*L); g.stroke(); } g.globalCompositeOperation='source-over';
    heavenClouds(g,ct,0.6+0.4*p); godRays(g,cx,ct,R,0.4+0.6*p); halo(g,cx,cy,R*0.42*eo(p),ct,p);
    glow(g,cx,cy,R*(0.3+0.7*p),'255,200,120',0.2+0.3*p); heartDraw(g,cx,cy,R*(0.12+0.08*p)*(1+0.05*beat),1,0.6+0.4*p);
    rings(g,cx,cy,R,ct*0.0005,3+Math.floor(p*3),0.5,1.2); embersRise(g,ct,90,0.8,1.5+p*2);
    if(p>0.95) setFlash(ct,4380,120,'255,255,255');
  },
  secret(g,gt){ const lc=gt-OFF_SEC; g.save(); g.translate(Math.sin(gt*0.0007)*fx.R*0.007,Math.cos(gt*0.0009)*fx.R*0.006);
    if(lc<0) SCENE.prologue(g,gt); else { SCENE.secretCore(g,lc); if(lc<700){ g.fillStyle='rgba(0,0,0,'+(1-prog(lc,0,700))+')'; g.fillRect(-60,-60,fx.w+120,fx.h+120); } }
    g.restore(); cine(g,lc,gt); },
  prologue(g,t){
    const {cx,cy,R,w,h}=fx, hb=Math.pow(Math.max(0,Math.sin(t<15200?0:(15.2+(t-15200)/1000*1.0)*TAU*0.9)),8);
    cam(g,1+0.1*prog(t,0,29000),t>22000?Math.min(1,(t-22000)/5000)*(1.5+4*hb):0);
    g.fillStyle='#010103'; g.fillRect(-60,-60,w+120,h+120);
    bgSpace(g,t,0.15+0.35*prog(t,1500,5500)*(1-0.6*prog(t,23000,28000)));
    const ox=t>15500?Math.sin(t*0.05)*R*0.002*prog(t,15500,23000)*6:0;
    /* the One awakens */
    const oa=eo(prog(t,4600,8200)), os=lerp(0.02,0.14,eo(prog(t,5200,9500)))*(1-0.5*prog(t,23000,28500));
    if(t>4400){ if(t<7000){ glow(g,cx,cy,R*0.1*oa,'255,245,220',0.8*oa); } oneOrb(g,cx+ox,cy-R*0.05,R*os,t,oa*(1-0.6*prog(t,24000,28500)),true); }
    /* each mutation gives itself up to the One */
    for(let i=0;i<6;i++){ const tb=7600+i*1250, life=prog(t,tb,tb+1100), ab=prog(t,tb+1500,tb+2500);
      if(life>0&&ab<1){ const an=i*TAU/6-1.2+t*0.00012, rr=R*(0.62*(1-eo(ab))), x=cx+Math.cos(an)*R*0.7*(1-eo(ab)), y=cy-R*0.05+Math.sin(an)*R*0.4*(1-eo(ab)); secIcon(g,i,x,y,R*0.11*(0.4+0.6*eo(life))*(1-0.6*ab),eo(life)*(1-ab*0.7),t); }
      if(ab>0&&ab<1){ g.globalCompositeOperation='lighter'; g.strokeStyle='rgba(255,240,200,'+(0.7*(1-ab))+')'; g.lineWidth=2+5*(1-ab); g.beginPath(); g.arc(cx,cy-R*0.05,R*(0.2+0.8*ab),0,TAU); g.stroke(); g.globalCompositeOperation='source-over'; } }
    /* the first crack: something else is born, outside the One */
    const ck=prog(t,15500,24500);
    if(ck>0){ glow(g,cx,cy+R*1.15,R*(0.7+0.9*ck),'255,30,40',0.12+0.35*ck+0.1*hb);
      g.globalCompositeOperation='lighter'; for(let c=0;c<11;c++){ const base=-Math.PI/2+(hh(c,95)-0.5)*1.7, grow=Math.max(0,Math.min(1,(t-15500-c*380)/(7500+2000*hh(c,96)))); if(grow<=0) continue; let x=cx,y=cy+R*1.1; g.strokeStyle='rgba(255,'+(30+70*grow)+',50,'+(0.5+0.5*grow)+')'; g.lineWidth=1.5+3.5*(1-hh(c,97))*(0.5+grow); g.beginPath(); g.moveTo(x,y); const segs=Math.floor(18*grow)+1; for(let k=1;k<=segs;k++){ const jit=(hh(c*40+k,98)-0.5)*0.7; x+=Math.cos(base+jit)*R*0.085; y+=Math.sin(base+jit)*R*0.085; g.lineTo(x,y);} g.stroke(); }
      g.globalCompositeOperation='source-over'; }
    /* you, watching the sky break */
    if(t>20400){ const fa=eo(prog(t,20400,22600)); youFigure(g,cx,cy+R*0.6,R*0.5,fa*(1-prog(t,28200,29000)),eo(prog(t,25500,28000))); glow(g,cx,cy+R*0.3,R*0.3*fa,'255,50,60',0.3*fa*(0.5+hb)); }
    if(t>27000){ g.fillStyle='rgba(255,70,60,'+(0.45*prog(t,27000,28400))+')'; g.fillRect(-60,-60,w+120,h+120); }
    if(t>28300){ g.fillStyle='rgba(0,0,0,'+prog(t,28300,29300)+')'; g.fillRect(-60,-60,w+120,h+120); }
  },
  secretCore(g,ct){
    const {cx,cy,R,w,h}=fx, TS=T_SEC, S=ct/1000;
    const beatPh=ct<19500?S:(ct<24500?19.5+1.2*((ct-19500)/1000)+0.12*Math.pow((ct-19500)/1000,3):30+S*1.3);
    const beat=Math.pow(Math.max(0,Math.sin(beatPh*TAU)),8);
    const P=(c)=>{ let hx=cx,hy=cy,ox=cx,oy=cy,sc=1,oa=0,ha=1;
      if(c<4600){ oa=0; }
      else if(c<9000){ const e=eo(prog(c,4600,7400)); hx=cx-R*0.55*e; ox=cx+R*0.55*e; oa=eo(prog(c,4600,7000)); }
      else if(c<14000){ const an=(c-9000)*0.00045, rr=R*0.55; hx=cx-Math.cos(an)*rr; hy=cy-Math.sin(an)*rr*0.35; ox=cx+Math.cos(an)*rr; oy=cy+Math.sin(an)*rr*0.35; oa=1; }
      else if(c<19500){ const an=(c-9000)*0.00045, k=eo(prog(c,14000,15200)), rr=lerp(R*0.55,R*0.36,k), mY=lerp(cy,cy-R*0.3,k); sc=lerp(1,0.5,k); hx=cx-Math.cos(an)*rr; hy=mY-Math.sin(an)*rr*0.2; ox=cx+Math.cos(an)*rr; oy=mY+Math.sin(an)*rr*0.2; oa=1; }
      else if(c<24500){ const u=(c-19500)/1000, an=(19500-9000)*0.00045+u*1.5+0.35*u*u*u, k=eo(prog(c,19500,20500)), rr=lerp(R*0.42,R*0.04,Math.pow(prog(c,19800,24400),1.6)), mY=lerp(cy-R*0.3,cy,k); sc=lerp(0.5,1,k); hx=cx-Math.cos(an)*rr; hy=mY-Math.sin(an)*rr*0.6; ox=cx+Math.cos(an)*rr; oy=mY+Math.sin(an)*rr*0.6; oa=1; }
      else { ha=0; oa=0; }
      return {hx,hy,ox,oy,sc,oa,ha}; };
    if(ct>=14000&&ct<18700){ g.save(); SCENE.luck(g,ct-14000); g.restore(); const fo=Math.max(1-prog(ct,14000,14400),prog(ct,18300,18700)); if(fo>0){ g.fillStyle='rgba(0,0,0,'+fo+')'; g.fillRect(-60,-60,w+120,h+120); } return; }
    cam(g,1+0.08*prog(ct,0,9000)*(1-prog(ct,9000,10000))+0.12*prog(ct,19500,24400),ct>19500&&ct<24500?1.5+7*prog(ct,19500,24400)*beat:(ct>24500&&ct<25800?10*(1-prog(ct,24500,25800)):0));
    g.fillStyle='#020104'; g.fillRect(-60,-60,w+120,h+120);
    if(ct<9000){ glow(g,cx,cy,R*0.9,'255,20,30',0.1+0.1*beat+0.12*prog(ct,4200,9000)); if(ct>4400) bgSpace(g,ct,0.25*prog(ct,4400,6000)); embersRise(g,ct,60,0.5,1.3); }
    else if(ct<14000){ const a=prog(ct,9000,10500); heavenClouds(g,ct,0.8*a,'255,200,150'); godRays(g,cx,ct,R,0.45*a); glow(g,cx,cy,R*0.9,'255,170,110',0.18*a); }
    else if(ct<19500){ bgSpace(g,ct,0.5); glow(g,cx,cy-R*0.4,R*0.9,'90,110,200',0.12*prog(ct,14000,15500)); }
    else if(ct<24500){ const p=prog(ct,19500,24500); bgSpace(g,ct,0.3+0.5*p); redRays(g,cx,cy,R*1.3,ct,0.3+0.6*p,30); glow(g,cx,cy,R*(0.4+0.7*p),'255,70,60',0.15+0.3*p); }
    else { const a=prog(ct,24800,27000), rv=prog(ct,TS,TS+2200); heavenClouds(g,ct,Math.max(a*0.9,rv),'255,200,150'); godRays(g,cx,ct,R,0.5*a+0.5*rv); redRays(g,cx,cy,R*1.7,ct,0.5*a+0.4*rv,50); glow(g,cx,cy,R*(0.9+0.15*Math.sin(ct*0.004)),'255,160,90',0.25*a+0.15*rv); }
    /* the figure that is you (rises between the two lights) */
    if(ct>=14000&&ct<19800){ const fa=eo(prog(ct,18700,19100))*(1-prog(ct,19200,19800)), s=R*0.5, bx=cx, by=cy+R*0.4, up=eo(prog(ct,18800,19400));
      g.save(); g.globalAlpha=fa; g.fillStyle='#050308'; g.strokeStyle='rgba(255,215,170,0.55)'; g.lineCap='round'; g.lineWidth=s*0.06;
      const ln=(x1,y1,x2,y2,wd)=>{ g.lineWidth=wd; g.beginPath(); g.moveTo(bx+x1*s,by+y1*s); g.lineTo(bx+x2*s,by+y2*s); g.stroke(); };
      g.strokeStyle='#050308'; ln(-0.06,-0.3,-0.1,0,0.085); ln(0.06,-0.3,0.1,0,0.085); ln(-0.19,-0.6,-0.19-0.12*up,-0.6-0.4*up-0.0,0.07); ln(0.19,-0.6,0.19+0.12*up,-0.6-0.4*up,0.07);
      g.beginPath(); g.moveTo(bx-0.2*s,by-0.64*s); g.lineTo(bx+0.2*s,by-0.64*s); g.lineTo(bx+0.12*s,by-0.28*s); g.lineTo(bx-0.12*s,by-0.28*s); g.closePath(); g.fill(); g.beginPath(); g.arc(bx,by-0.76*s,s*0.1,0,TAU); g.fill();
      g.strokeStyle='rgba(255,215,170,0.45)'; g.lineWidth=2; g.beginPath(); g.arc(bx,by-0.76*s,s*0.1,Math.PI*1.1,Math.PI*1.9); g.stroke();
      g.restore();
      const hc=prog(ct,18900,19350); if(hc>0){ glow(g,bx,by-0.5*s,s*0.5*hc,'255,40,50',0.5*hc*fa); heartDraw(g,bx,by-0.5*s,R*0.03*(1+0.3*beat),hc*fa,0.5+0.5*hc); } }
    /* trails while they spiral in */
    const p0=P(ct);
    if(ct>=19500&&ct<24500){ g.globalCompositeOperation='lighter'; for(let j=1;j<=26;j++){ const q=P(ct-j*26), f=1-j/27; g.fillStyle='rgba(255,60,50,'+(0.35*f)+')'; g.beginPath(); g.arc(q.hx,q.hy,R*0.03*f*q.sc,0,TAU); g.fill(); g.fillStyle='rgba(255,236,180,'+(0.4*f)+')'; g.beginPath(); g.arc(q.ox,q.oy,R*0.03*f*q.sc,0,TAU); g.fill(); } g.globalCompositeOperation='source-over'; }
    if(ct<24500){
      if(p0.oa>0.01){ g.globalCompositeOperation='lighter'; const ta=p0.oa*(ct<9000?0.5:0.3); g.strokeStyle='rgba(255,210,170,'+ta+')'; g.lineWidth=2; g.beginPath(); g.moveTo(p0.hx,p0.hy); for(let s2=1;s2<=24;s2++){ const f=s2/24; g.lineTo(lerp(p0.hx,p0.ox,f),lerp(p0.hy,p0.oy,f)+Math.sin(f*9+ct*0.004)*R*0.02*Math.sin(f*Math.PI)); } g.stroke(); g.globalCompositeOperation='source-over'; }
      if(ct>1200&&ct<9000){ const ext=eo(prog(ct,1200,3800)), brk=ct>=7400, al=brk?1-prog(ct,7400,8800):1, fl=brk?prog(ct,7400,8800):0, hs0=R*0.095, d1=hs0*2.2+fl*R*0.5, shk=brk?0:Math.sin(ct*0.09)*R*0.004*prog(ct,5200,7400);
        for(let k=0;k<9;k++){ const a=k/9*TAU+0.2+fl*0.3*(k%2?1:-1), d2=d1+(R*1.2-d1)*ext+fl*R*0.8; realChain(g,p0.hx+Math.cos(a)*d1+shk,p0.hy+Math.sin(a)*d1,p0.hx+Math.cos(a)*d2,p0.hy+Math.sin(a)*d2,Math.max(2,Math.round(16*ext)),0.95*al,fl*0.4,p0.hx,p0.hy,R); }
        if(ct>=7400&&ct<8600){ g.globalCompositeOperation='lighter'; for(let i=0;i<46;i++){ const q=prog(ct,7400,8600), an=hh(i,111)*TAU, d=R*(0.15+0.9*q*(0.4+hh(i,112))); g.strokeStyle='rgba(255,'+(160+60*hh(i,113))+',90,'+(1-q)+')'; g.lineWidth=1.5; g.beginPath(); g.moveTo(p0.hx+Math.cos(an)*d*0.8,p0.hy+Math.sin(an)*d*0.8); g.lineTo(p0.hx+Math.cos(an)*d,p0.hy+Math.sin(an)*d); g.stroke(); } g.globalCompositeOperation='source-over'; setFlash(ct,7400,500,'255,225,200'); } }
      const hs=R*0.095*p0.sc*(1+0.1*beat); glow(g,p0.hx,p0.hy,hs*2.4,'255,20,30',0.22+0.25*beat);
      heartDraw(g,p0.hx,p0.hy,hs,1,0.35+0.5*beat);
      if(p0.oa>0.01) oneOrb(g,p0.ox,p0.oy,R*0.12*p0.sc*(1+0.05*beat),ct,p0.oa,true);
    }else{
      /* the two become one */
      const t=ct-24500, fz=eo(prog(ct,25200,27200)), rv=prog(ct,TS,TS+2000);
      g.globalCompositeOperation='lighter';
      realExplosion(g,cx,cy,R,t); g.globalCompositeOperation='lighter';
      const ha=prog(ct,26200,27400);
      if(ha>0) for(let s2=0;s2<2;s2++) for(let j=0;j<70;j++){ const y=cy+(j-35)*R*0.032, ph=j*0.33+ct*0.003+s2*Math.PI, x=cx+Math.sin(ph)*R*(0.2+0.05*Math.sin(j*0.2)), dz=Math.cos(ph), fade=Math.max(0,1-Math.abs(j-35)/36); g.fillStyle=s2?'rgba(255,225,150,'+(0.75*ha*fade)+')':'rgba(255,50,60,'+(0.75*ha*fade)+')'; g.beginPath(); g.arc(x,y,R*(0.009+0.005*dz),0,TAU); g.fill(); }
      g.globalCompositeOperation='source-over';
      glow(g,cx,cy,R*(0.55+0.2*fz),'255,235,190',0.35*fz+0.2*rv);
      heartDraw(g,cx,cy,R*(0.11+0.04*prog(ct,25000,29500))*(1+0.1*beat),fz,0.6+0.4*fz);
      oneOrb(g,cx,cy,R*(0.3+0.04*Math.sin(ct*0.002)),ct,0.85*prog(ct,26200,28200),false);
      if(rv>0){ halo(g,cx,cy,R*0.8*eo(rv),ct,1); rings(g,cx,cy,R,(ct-TS)*0.0004,5,0.55*rv,1); }
      if(ct>=TS){ fx.clean=true; embersRise(g,ct,150,1,2.4); streak(g,cx,cy,R*1.2,'255,220,160',0.5,0.014); }
      setFlash(ct,24500,450,'255,240,220'); setFlash(ct,TS,1400,'255,255,255');
    }
    if(ct>=4150&&ct<4800) setFlash(ct,4200,600,'255,225,200'); if(ct>=8950&&ct<9500) setFlash(ct,9000,500,'255,235,210');
    if(ct>19400&&ct<19800){ g.fillStyle='rgba(0,0,0,'+(1-prog(ct,19400,19800)*0)+')'; }
    if(ct>24200&&ct<24500){ g.fillStyle='rgba(255,250,235,'+prog(ct,24200,24500)+')'; g.fillRect(-60,-60,w+120,h+120); }
  },
  luck(g,t){
    const {cx,cy,R,w,h}=fx; g.fillStyle='#02070a'; g.fillRect(-60,-60,w+120,h+120);
    glow(g,cx,cy,R*0.95,'40,170,100',0.12+0.05*Math.sin(t*0.002));
    g.globalCompositeOperation='lighter';
    for(let i=0;i<80;i++){ const ph=((t*0.00018*(0.5+hh(i,61))+hh(i,62))%1), x=w*hh(i,63)+Math.sin(t*0.001+i)*8, y=h*(1.05-ph*1.1), a=Math.sin(ph*3.14)*0.7; g.fillStyle=i%3?'rgba(170,255,150,'+a+')':'rgba(255,226,140,'+a+')'; g.beginPath(); g.arc(x,y,1+hh(i,64)*2,0,TAU); g.fill(); }
    g.globalCompositeOperation='source-over';
    if(t<2750){ const a=eo(prog(t,0,800))*(1-prog(t,2350,2750)); cloverDraw(g,cx,cy,R*0.2*(1+0.02*Math.sin(t*0.003)),t*0.00018,a);
      if(t>2350){ g.globalCompositeOperation='lighter'; for(let i=0;i<40;i++){ const q=prog(t,2350,2900), an=hh(i,65)*TAU, d=R*0.5*eo(q)*(0.4+hh(i,66)); g.fillStyle='rgba(255,226,140,'+(1-q)+')'; g.beginPath(); g.arc(cx+Math.cos(an)*d,cy+Math.sin(an)*d,2,0,TAU); g.fill(); } g.globalCompositeOperation='source-over'; } }
    else if(t<4700){ const u=t-2750, a=eo(prog(u,0,400))*(1-prog(u,1650,1950)), sz=R*0.2, ang=u*0.006*(1-prog(u,0,1500)*0.85), v=u<1300?1+Math.floor(u/70)%6:6;
      g.save(); g.globalAlpha=a; g.translate(cx,cy+Math.sin(u*0.006)*R*0.02*(1-prog(u,0,1400))); g.rotate(ang); g.scale(1+0.15*Math.sin(u*0.004),1); const r=sz*0.18;
      g.beginPath(); g.moveTo(-sz/2+r,-sz/2); g.arcTo(sz/2,-sz/2,sz/2,sz/2,r); g.arcTo(sz/2,sz/2,-sz/2,sz/2,r); g.arcTo(-sz/2,sz/2,-sz/2,-sz/2,r); g.arcTo(-sz/2,-sz/2,sz/2,-sz/2,r); g.closePath();
      const gr=g.createLinearGradient(-sz/2,-sz/2,sz/2,sz/2); gr.addColorStop(0,'rgb(250,246,232)'); gr.addColorStop(1,'rgb(176,166,146)'); g.fillStyle=gr; g.fill(); g.strokeStyle='rgba(60,50,40,0.8)'; g.lineWidth=3; g.stroke();
      const PP={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]};
      g.fillStyle='#1a1010'; for(const p of PP[v]){ g.beginPath(); g.arc(p[0]*sz*0.26,p[1]*sz*0.26,sz*0.07,0,TAU); g.fill(); } g.restore();
      if(u>1650){ g.globalCompositeOperation='lighter'; for(let i=0;i<46;i++){ const q=prog(u,1650,2250), an=hh(i,67)*TAU, d=R*0.55*eo(q)*(0.3+hh(i,68)); g.fillStyle='rgba(235,225,200,'+(1-q)+')'; g.beginPath(); g.arc(cx+Math.cos(an)*d,cy+Math.sin(an)*d+R*0.15*q*q,1.8,0,TAU); g.fill(); } g.globalCompositeOperation='source-over'; } }
    else{ const u=t-4700, a=eo(prog(u,0,700)), b=Math.pow(Math.max(0,Math.sin(u*0.0055)),8); glow(g,cx,cy,R*0.5*a,'255,30,40',0.25*a); heartDraw(g,cx,cy,R*0.06*(1+0.25*b),a,0.3+0.4*b); }
  },
  racing(g,t){
    const {cx,cy,R,w,h}=fx, b=t/1000, ph=1.2*b+0.12*b*b*b, q=ph%1, beat=Math.pow(Math.max(0,Math.sin(ph*TAU)),8), p=t/5000;
    cam(g,1+0.1*p*p,1.5+7*p*beat); bgSpace(g,t,0.15); redRays(g,cx,cy,R*1.3,t,0.5+0.5*p,30);
    glow(g,cx,cy,R*(0.5+0.5*p),'255,20,30',0.18+0.25*p);
    g.globalCompositeOperation='lighter'; for(let k=0;k<2;k++){ const qq=(q+k*0.5)%1; g.strokeStyle='rgba(255,70,50,'+(0.5*(1-qq))+')'; g.lineWidth=2+6*(1-qq); g.beginPath(); g.arc(cx,cy,R*(0.1+1.1*eo(qq)),0,TAU); g.stroke(); } g.globalCompositeOperation='source-over';
    heartDraw(g,cx,cy,R*(0.17+0.03*p)*(1+0.12*beat),1,0.4+0.6*p);
    const u=prog(t,3200,4900); if(u>0){
      glow(g,cx,cy,R*(0.2+1.0*u),'255,236,190',0.25+0.6*u);
      g.globalCompositeOperation='lighter'; for(let i=0;i<10;i++){ const a=i/10*TAU+u*3, d=R*0.55*(1-eo(u)); g.fillStyle='rgba(255,236,190,0.9)'; g.beginPath(); g.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d*0.92,3+3*u,0,TAU); g.fill(); }
      for(let i=0;i<18;i++){ const a=i/18*TAU+hh(i,69), L=R*(0.2+1.1*u)*(0.5+hh(i,70)); g.strokeStyle='rgba(255,226,150,'+(0.6*u)+')'; g.lineWidth=1.5; g.beginPath(); g.moveTo(cx,cy); let x=cx,y=cy; for(let s=1;s<=8;s++){ x=cx+Math.cos(a)*L*s/8+Math.sin(s*2+i)*R*0.012; y=cy+Math.sin(a)*L*s/8+Math.cos(s*2+i)*R*0.012; g.lineTo(x,y); } g.stroke(); }
      g.globalCompositeOperation='source-over'; }
    if(t>4700){ g.fillStyle='rgba(255,250,235,'+prog(t,4700,5000)+')'; g.fillRect(-60,-60,w+120,h+120); }
  },
  burst(g,t){
    const {cx,cy,R,w,h}=fx, P=qTargets(), N=Math.min(P.length,340), tc=2400, tau0=tc/1000;
    g.fillStyle='#030204'; g.fillRect(-60,-60,w+120,h+120); cam(g,1+0.05*prog(t,0,6000),Math.max(0,16*(1-t/900)));
    heavenClouds(g,t,0.7,'255,200,150'); godRays(g,cx,t,R,0.5*prog(t,300,1500)); glow(g,cx,cy,R*(0.5+0.4*prog(t,0,1500)),'255,150,90',0.2+0.15*prog(t,2400,5200));
    if(t<900){ g.fillStyle='rgba(255,250,235,'+(1-t/900)+')'; g.fillRect(-60,-60,w+120,h+120); }
    g.globalCompositeOperation='lighter'; for(let k=0;k<3;k++){ const qq=prog(t,k*250,k*250+1500); if(qq>0&&qq<1){ g.strokeStyle='rgba(255,'+(k?170:226)+',130,'+(0.8*(1-qq))+')'; g.lineWidth=2+8*(1-qq); g.beginPath(); g.arc(cx,cy,R*(0.05+1.3*eo(qq)),0,TAU); g.stroke(); } } g.globalCompositeOperation='source-over';
    const pos=(i,tau)=>{ const a=hh(i,71)*TAU+tau*0.18, sp=R*(0.45+1.2*hh(i,72)), e=1-Math.exp(-tau*1.7); return [cx+Math.cos(a)*sp*e,cy+Math.sin(a)*sp*e*0.8]; };
    for(let i=0;i<N;i++){ const T=P[i], st=tc+hh(i,74)*600, q=eo(prog(t,st,st+1700)), p0=pos(i,Math.min(t,tc)/1000), p1=pos(i,t/1000), X=t<st?p1[0]:lerp(pos(i,st/1000)[0],T[0],q), Y=t<st?p1[1]:lerp(pos(i,st/1000)[1],T[1],q);
      const sz=lerp(R*(0.1+0.1*hh(i,73)),R*0.07,q), rot=lerp(Math.sin(t*0.002+i)*0.9+hh(i,75)*3,0,q), tw=1+0.1*Math.sin(t*0.006+i*0.3)*q; if(t>600&&q<1){ const bx=t<st?pos(i,Math.max(0,t/1000-0.06))[0]:lerp(pos(i,st/1000)[0],T[0],eo(prog(t-70,st,st+1700))), by=t<st?pos(i,Math.max(0,t/1000-0.06))[1]:lerp(pos(i,st/1000)[1],T[1],eo(prog(t-70,st,st+1700))); miniHeart(g,bx,by,sz*tw*0.9,rot,0.3); } miniHeart(g,X,Y,sz*tw,rot,Math.min(1,t/250)); }
  },
  rebirth(g,ct){
    const {cx,R,w,h}=fx, cy=fx.cy-R*0.1, tb=T_REB, hs=R*0.1, pts=70;
    const HP=heartPts(pts,cx,cy,hs*1.6), hp=i=>HP[i%pts];
    if(ct<tb){
      const p=prog(ct,0,tb); cam(g,1+0.06*p,p>0.8?(p-0.8)*20:0); bgSpace(g,ct,0.2);
      /* the old run falls away as ash, then embers gather from every side into one heart */
      g.fillStyle='rgba(150,140,140,0.5)'; for(let i=0;i<90;i++){ const ph=((ct*0.00018*(0.4+hh(i,1))+hh(i,2))%1); g.fillRect(w*hh(i,3),h*ph,1.6,1.6); }
      g.globalCompositeOperation='lighter';
      for(let i=0;i<pts*3;i++){ const j=i%pts, T=hp(j), a0=hh(i,4)*TAU, D0=R*(0.7+0.9*hh(i,5)), sx=cx+Math.cos(a0)*D0, sy=cy+Math.sin(a0)*D0, st=300+hh(i,6)*2200, q=eo(prog(ct,st,st+1300+hh(i,7)*500)), curl=(1-q)*Math.sin(q*3+i)*R*0.12;
        const x=lerp(sx,T[0],q)+curl, y=lerp(sy,T[1],q)-curl; g.fillStyle='rgba(255,'+Math.round(60+hh(i,8)*130)+',50,'+(0.35+0.55*q)+')'; g.beginPath(); g.arc(x,y,1.2+q*1.3,0,TAU); g.fill(); }
      g.globalCompositeOperation='source-over';
      const fill=prog(ct,2600,tb-200); if(fill>0) heartDraw(g,cx,cy,hs*1.6*(0.9+0.1*fill),fill*0.9,fill*0.5+0.5*Math.max(0,Math.sin(ct*(0.004+0.01*fill)))**6);
      glow(g,cx,cy,R*(0.1+0.5*p*p),'255,40,40',0.1+0.3*p*p);
      if(p>0.96) setFlash(ct,tb-100,100,'255,220,210');
    }else{
      const t=ct-tb, beat=0.5+0.5*Math.sin(ct*0.006); cam(g,1.03,Math.max(0,12*(1-t/800))); bgSpace(g,ct,0.3); setFlash(ct,tb,900,'255,210,200');
      redRays(g,cx,cy,R*1.5,ct,1,34); glow(g,cx,cy,R*(0.7+0.3*prog(t,0,1500)),'255,20,30',0.2+0.08*beat);
      rings(g,cx,cy,R,t*0.00035,4,0.5,1);
      /* wings of fire unfurl from the heart */
      const wg=eo(prog(t,0,1600)); g.globalCompositeOperation='lighter'; g.lineCap='round';
      for(const sd of [-1,1]) for(let k=0;k<11;k++){ const a=-0.35+k*0.2-0.1*wg, L=R*(0.25+0.7*wg)*(1-k*0.035), cxp=cx+sd*Math.cos(a)*L*0.5, cyp=cy-Math.sin(a)*L*0.9-L*0.12, ex=cx+sd*Math.cos(a*0.55)*L*1.15, ey=cy-Math.sin(a)*L*0.55+L*0.12*k/11;
        g.strokeStyle='rgba(255,'+Math.round(80+k*11)+',50,'+(0.6*wg*(1-k*0.04))+')'; g.lineWidth=3.2-k*0.18; g.beginPath(); g.moveTo(cx+sd*hs*0.5,cy-hs*0.2); g.quadraticCurveTo(cxp,cyp,ex,ey); g.stroke();
        g.strokeStyle='rgba(255,60,40,'+(0.12*wg)+')'; g.lineWidth=10-k*0.5; g.stroke(); }
      g.globalCompositeOperation='source-over';
      heartDraw(g,cx,cy,hs*1.6*(1+0.05*beat),1,0.6+0.4*beat); halo(g,cx,cy,R*0.38*eo(prog(t,0,1400)),ct,1);
      embersRise(g,ct,120,0.9,2.4);
    }
  },
  absolute(g,ct){
    const {cx,cy,R,w}=fx, tb=T_ABS, S=R*0.13;
    if(ct<tb){
      const p=prog(ct,0,tb), e=p*p; cam(g,1+0.1*e,e*12); bgSpace(g,ct,0.22);
      const lx=lerp(-R*0.22,cx-R*0.16,e), rx=lerp(w+R*0.22,cx+R*0.16,e);
      glow(g,cx,cy,R*(0.1+0.9*e),'255,255,255',0.25*e);
      flower(g,lx,cy,S*(1+0.3*p),ct*0.0007,10,'255,205,110',1,1,6,true); flower(g,rx,cy,S*(1+0.3*p),-ct*0.0007,10,'255,110,200',1,1,6,true);
      if(ct>3300&&Math.floor(ct/FRAME_MS)%6===0) setFlash(ct,ct-1,60);
    }else{
      fx.clean=true; const t=ct-tb; cam(g,1,0); g.fillStyle='#000'; g.fillRect(-60,-60,fx.w+120,fx.h+120);
      setFlash(ct,tb,900); if(t<400&&Math.floor(t/FRAME_MS)%4===0) fx.flash=Math.max(fx.flash,0.7);
      g.strokeStyle='rgba(255,255,255,'+(1-prog(t,0,900))*0.9+')'; g.lineWidth=3; for(let k=0;k<3;k++){ const q=prog(t,k*160,k*160+900); if(q>0&&q<1){ g.globalAlpha=1-q; g.beginPath(); g.arc(cx,cy,R*(0.1+1.3*eo(q)),0,TAU); g.stroke(); } } g.globalAlpha=1;
      absCrystal(g,ct,t);
    }
  },
  one(g,ct){
    const {cx,cy,R,w,h}=fx, tb=T_ONE, N=10, RING=R*0.34, ang=i=>-Math.PI/2+i*TAU/N;
    const em=(i,x,y,s,al)=>{ if(al<=0.01) return; g.save(); g.globalAlpha=al; glow(g,x,y,s*2.2,'255,225,170',0.22);
      if(i===0) planet(g,x,y,s,{tex:'earth',cloud:true,rot:ct*0.0001,lx:-0.6,ly:-0.5});
      else if(i===1) sun(g,x,y,s*0.8,{t:ct});
      else if(i===2) fireball(g,x,y,700+Math.sin(ct/300)*80,s*1.2,PAL.fire,0.9);
      else if(i===3){ g.strokeStyle='rgba(255,255,255,0.22)'; g.beginPath(); g.ellipse(x,y,s*1.4,s*0.55,-0.2,0,TAU); g.stroke(); sun(g,x,y,s*0.4,{t:ct}); planet(g,x+s*1.15,y-s*0.15,s*0.2,{tex:'earth',rot:ct*0.0002}); }
      else if(i===4) hole(g,x,y,s*0.5,ct,{});
      else if(i===5){ g.globalCompositeOperation='lighter'; for(let q=0;q<4;q++){ g.strokeStyle='hsla('+(q*60+ct*0.05)+',90%,65%,0.75)'; g.lineWidth=2; g.beginPath(); g.arc(x,y,s*(1.1-q*0.26),0,TAU); g.stroke(); } g.globalCompositeOperation='source-over'; }
      else if(i===6){ gal(g,x,y,s*1.15,ct*0.0005,'160,200,255',110); }
      else if(i===7){ pane(g,x-s*0.8,y,s*1.1,-0.8,0,0.9); pane(g,x+s*0.8,y,s*1.1,0.8,2,0.9); pane(g,x,y,s*1.3,0,1,1); }
      else if(i===8){ flower(g,x,y,s*0.55,ct*0.0004,6,'255,215,140',0.95,1,4,false); }
      else{ glow(g,x,y,s*1.6,'200,215,255',0.3); crystalAt(g,x,y,s*0.78,ct*0.00055,0.38+0.08*Math.sin(ct*0.0004),ct,false); }
      g.restore(); };
    if(ct<tb){
      const uni=prog(ct,5400,tb), conv=ease(uni);
      cam(g,1+0.14*prog(ct,0,tb),uni*uni*12); g.fillStyle='#010101'; g.fillRect(-80,-80,fx.w+160,fx.h+160);
      g.globalCompositeOperation='lighter'; const rr=mulb(55); for(let i=0;i<40;i++){ g.fillStyle='rgba(255,230,190,'+(0.06+rr()*0.12)+')'; g.fillRect(((rr()*fx.w+ct*0.01*(0.3+rr()))%fx.w),((rr()*fx.h-ct*0.006*(0.3+rr())+fx.h)%fx.h),1.4,1.4); } g.globalCompositeOperation='source-over';
      const beat=0.5+0.5*Math.max(0,Math.sin(ct/170));
      glow(g,cx,cy,R*(0.05+0.03*beat+0.7*conv*conv),'255,236,200',0.5+0.35*beat+0.3*conv);
      for(let i=0;i<N;i++){
        const t0=1400+i*400; if(ct<t0) continue; const q=ct-t0, P={x:cx+Math.cos(ang(i))*RING,y:cy+Math.sin(ang(i))*RING*0.92};
        let ex=P.x, ey=P.y, es=R*0.062;
        if(conv>0){ const a=ang(i)+conv*5.5, d=RING*(1-conv); ex=cx+Math.cos(a)*d; ey=cy+Math.sin(a)*d*0.92; es=R*0.062*(1-conv*0.85); }
        g.globalCompositeOperation='lighter'; g.strokeStyle='rgba(255,220,150,'+(0.24*Math.min(1,q/500))+')'; g.lineWidth=1; g.beginPath(); g.moveTo(cx,cy); g.lineTo(ex,ey); g.stroke(); g.globalCompositeOperation='source-over';
        if(q<260){ const p=ease(q/260);
          for(let k=0;k<7;k++){ const pp=Math.max(0,p-k*0.05); glow(g,lerp(cx,P.x,pp)+Math.sin(pp*3.14)*R*0.05,lerp(cy,P.y,pp)-Math.sin(pp*3.14)*R*0.05,R*(0.05-k*0.005),'255,232,185',0.9*(1-k/7)); } }
        else{ const b=q-260;
          if(b<520){ const bp=b/520; g.globalCompositeOperation='lighter'; g.strokeStyle='rgba(255,240,200,'+(1-bp)*0.9+')'; g.lineWidth=1+(1-bp)*4; g.beginPath(); g.arc(ex,ey,R*(0.02+0.13*eo(bp)),0,TAU); g.stroke();
            for(let k=0;k<16;k++){ const a=k*0.3927+i, d=R*(0.02+0.11*eo(bp))*(0.6+((k*7)%5)/5); g.fillStyle='rgba(255,230,170,'+(1-bp)+')'; g.fillRect(ex+Math.cos(a)*d,ey+Math.sin(a)*d,2,2); } g.globalCompositeOperation='source-over'; }
          em(i,ex,ey,es,ease(Math.min(1,b/500))); }
      }
      if(conv>0){ g.globalCompositeOperation='lighter'; for(let i=0;i<30;i++){ const a=i/30*TAU+conv*3, gr=g.createLinearGradient(cx,cy,cx+Math.cos(a)*R*1.3,cy+Math.sin(a)*R*1.3); gr.addColorStop(0,'rgba(255,230,180,'+0.45*conv+')'); gr.addColorStop(1,'rgba(255,230,180,0)'); g.strokeStyle=gr; g.lineWidth=1.5; g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+Math.cos(a)*R*1.3,cy+Math.sin(a)*R*1.3); g.stroke(); } g.globalCompositeOperation='source-over'; }
      /* hairline cracks appear in the glass just before it breaks */
      const cr=prog(ct,tb-1000,tb); if(cr>0){ const D=shardData(); g.strokeStyle='rgba(255,250,235,0.85)'; g.lineWidth=1; g.beginPath();
        for(const s of D.S){ if(s.q>1) continue; const lim=cr*0.75; for(let i=0;i<s.poly.length;i++){ const a=s.poly[i], b=s.poly[(i+1)%s.poly.length]; if(Math.hypot(a[0],a[1])>lim||Math.hypot(b[0],b[1])>lim) continue; g.moveTo(cx+a[0]*R*0.7,cy+a[1]*R*0.7); g.lineTo(cx+b[0]*R*0.7,cy+b[1]*R*0.7); } } g.stroke(); }
      if(ct>=tb-70) fx.snapReq=true;
      if(uni>0.93) setFlash(ct,tb-80,80);
    }else{
      const t=ct-tb, D=shardData(), RM=Math.hypot(w,h)*0.55, snap=fx.snap;
      cam(g,1,Math.max(0,16*(1-t/900))); g.fillStyle='#000'; g.fillRect(-80,-80,fx.w+160,fx.h+160);
      const lt=clamp01((t-250)/800)*(1-0.72*prog(t,2300,3800)); glow(g,cx,cy,R*(0.7+1.3*lt),'255,240,205',Math.min(1,lt*1.1));
      if(t<350){ setFlash(ct,tb,500); if(Math.floor(t/FRAME_MS)%3===0) fx.flash=Math.max(fx.flash,0.8); }
      const reveal=prog(t,0,520)*1.35;
      if(snap) for(const s of D.S){
        const tau=t-s.ts, X=cx+s.mx*RM, Y=cy+s.my*RM, L=Math.hypot(s.mx,s.my)||1, mv=tau>0?Math.pow(tau/1000,1.6)*R*s.sp*0.9:0;
        const dx=(s.mx/L)*mv+(s.mx/L)*(t>150&&tau<=0?J(1.5):0), dy=(s.my/L)*mv+(tau>0?Math.pow(tau/1000,2)*R*0.35:0), al=tau>0?1-prog(tau,350,1700):1;
        if(al<=0.01) continue;
        g.save(); g.globalAlpha=al; g.translate(X+dx,Y+dy); g.rotate(s.rot*(tau>0?tau/1000:0)); const sc=1+(tau>0?0.16*tau/1000:0); g.scale(sc,sc); g.translate(-X,-Y);
        g.beginPath(); s.poly.forEach((p,i)=>{ const px=cx+p[0]*RM, py=cy+p[1]*RM; if(i) g.lineTo(px,py); else g.moveTo(px,py); }); g.closePath(); g.save(); g.clip(); g.drawImage(snap,0,0,fx.w,fx.h); g.restore();
        if(s.q<=Math.ceil(reveal*4)){ g.globalCompositeOperation='lighter'; g.strokeStyle='rgba(255,250,232,'+0.9*al+')'; g.lineWidth=1.4; g.stroke(); g.strokeStyle='rgba(255,220,150,'+0.25*al+')'; g.lineWidth=6; g.stroke(); g.globalCompositeOperation='source-over'; }
        g.restore();
      }
      /* the veins left behind, and the One itself */
      const gr=prog(t,500,3400), pulse=1+0.2*Math.sin(ct/260), rr=mulb(9); g.globalCompositeOperation='lighter';
      for(let i=0;i<16;i++){ const a=i*0.3927+0.3, len=R*1.3*ease(gr)*(0.55+0.45*((i*7)%5)/4), segs=10; g.beginPath(); g.strokeStyle='rgba(255,226,150,'+(0.3+0.25*(i%3)/2)*prog(t,1500,2600)+')'; g.lineWidth=1+(i%3)*0.8;
        for(let s=0;s<=segs;s++){ const d=R*0.03+len*s/segs, off=Math.sin(i*5.1+s*2.3)*R*0.02, x=cx+Math.cos(a)*d-Math.sin(a)*off, y=cy+Math.sin(a)*d+Math.cos(a)*off; if(s) g.lineTo(x,y); else g.moveTo(x,y); } g.stroke(); }
      for(let i=0;i<70;i++){ const a=rr()*TAU, d=R*(0.05+rr()*0.9)*ease(gr), tw=0.4+0.6*Math.abs(Math.sin(ct*0.002+i)); g.fillStyle='rgba(255,230,170,'+(0.5*tw*prog(t,1800,2800))+')'; g.fillRect(cx+Math.cos(a)*d,cy+Math.sin(a)*d*0.9-t*0.004*rr(),1.6,1.6); }
      g.globalCompositeOperation='source-over';
      const core=prog(t,1800,3000); glow(g,cx,cy,R*(0.2+0.08*pulse),'255,226,150',0.75*core); glow(g,cx,cy,R*0.07*pulse,'255,255,240',core); streak(g,cx,cy,R*(0.9*ease(prog(t,1200,3400))),'255,226,150',0.65*core,0.016);
      g.fillStyle='rgba(255,255,255,'+core+')'; g.beginPath(); g.arc(cx,cy,R*0.012*pulse,0,TAU); g.fill();
    }
  }
};
function fxLoop(ts){
  if(!cutOpen||!fx||!cutCtx) return;
  fxDraw(Math.max(0,ts-cutStart));
  cutRaf=requestAnimationFrame(fxLoop);
}
function fxDraw(ct){
  const g=starCx; if(!g||!fx) return;
  const fr=Math.floor(ct/FRAME_MS); if(fr===fx.frame) return; fx.frame=fr;
  fx.ct=ct; fx.rng=mulb((fr+1)*2654435761); fx.flash=0; fx.clean=false; fx.snapReq=false;
  g.save(); g.globalCompositeOperation='source-over'; g.globalAlpha=1; g.fillStyle='#000'; g.fillRect(0,0,fx.w,fx.h);
  g.save();
  try{ SCENE[fx.kind](g,ct); }catch(e){ console.error('fx',fx.kind,e); }
  g.restore();
  if(fx.snapReq){ try{ const cv=g.canvas; if(!fx.snap){ fx.snap=document.createElement('canvas'); } fx.snap.width=cv.width; fx.snap.height=cv.height; fx.snap.getContext('2d').drawImage(cv,0,0); }catch(e){} }
  post(g,ct);
  g.restore();
}

function playRebirthCut(n,preview,after){
  const sq=[]; for(let i=0;i<6;i++) sq.push([1,1]);
  playCutscene({odds:1,gain:0,sq:sq,bonus:[],hw:[],hx:[]},[],'rebirth',preview,{rb:n,after:after});
}
function playCutscene(p,outs,kind,preview,extra){
  busy=true; cutOpen=true; cutDone=false; cutCtx={p:p,outs:outs,kind:kind,preview:!!preview,rb:extra&&extra.rb,after:extra&&extra.after};
  clearTimeout(timer); clearCutTimers(); cancelAnimationFrame(cutRaf); if(AC) unlock();
  const cut=$('cut'), ti=tierIdx(p.odds,RT), K=CUT_KIND[kind];
  cut.classList.remove('arrived','k-planetary','k-star','k-impact','k-system','k-blackhole','k-beyond','k-universe','k-multiverse','k-omniverse','k-absolute','k-one','k-determination','k-rebirth','k-secret'); cut.classList.add('k-'+kind);
  $('cutCard').classList.remove('win');
  $('cutTop').className='cut-top t'+ti;
  $('cutKicker').textContent=K.kick+(preview?' (preview)':'');
  $('cutOdds').textContent=fmt(p.odds);
  $('cutTier').textContent=TNAME[ti];
  $('cutTitle').textContent=K.first;
  $('cutSub').textContent='';
  $('cutOk').hidden=true;
  document.querySelector('.wrap').inert=true;
  cut.hidden=false;
  const reduce=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const rnd=()=>SYM[Math.floor(Math.random()*N)];
  const rn=()=>1+Math.floor(Math.random()*N);
  const reels=[].slice.call(cut.querySelectorAll('.reel'));
  reels.forEach((rl,i)=>{
    const st=rl.firstElementChild, s=p.sq[i], items=[];
    for(let k=0;k<REEL_SPIN;k++) items.push('<div class="it"><b>'+rnd()+'</b><small>№'+rn()+'</small></div>');
    items.push('<div class="it fin'+(s[2]?' o':'')+'"><b>'+SYM[s[0]-1]+'</b><small>№'+s[1]+'</small></div>');
    items.push('<div class="it"><b>'+rnd()+'</b><small>№'+rn()+'</small></div>');
    items.push('<div class="it"><b>'+rnd()+'</b><small>№'+rn()+'</small></div>');
    st.innerHTML=items.join('');
    st.style.transition='none'; st.style.transform='translateY(0px)';
    rl.classList.remove('landed','hit');
  });
  HIQ=(kind==='secret'); sizeStars(); cutStart=performance.now(); fx=null;
  fxInit(kind);
  if(reduce){ fxDraw(K.arrive+2500); if(kind==='planetary') startAmb(55,82.41); }
  else{
    cutRaf=requestAnimationFrame(fxLoop);
    if(kind==='one') playScore(); else playTheme(kind);
    if(kind==='planetary') startAmb(55,82.41);
  }
  if(kind==='rebirth'){
    const n=cutCtx.rb||1;
    cut.classList.add('arrived');
    if(!reduce){
      cutT.push(setTimeout(()=>{ $('cutTitle').textContent='Everything you built falls away'; },300));
      cutT.push(setTimeout(()=>{ $('cutTitle').textContent='But you are still here'; },2300));
      cutT.push(setTimeout(()=>{ $('cutTitle').textContent='REBIRTH '+n; },T_REB));
      cutT.push(setTimeout(()=>startAmb(49,73.42),T_REB+400));
    }
    cutT.push(setTimeout(finishCut,reduce?0:8200));
    return;
  }
  if(!reduce&&kind==='determination'){
    [[200,'They will say the gods made it.'],[1700,'It was not created by The One Before All.'],[3050,'It was created in you.'],[4350,'And it broke.'],[5400,'But you never gave up.'],[6500,'Piece by piece, it came back.'],[8400,'And it broke its chains.'],[T_DET,'DETERMINATION']].forEach(x=>cutT.push(setTimeout(()=>{ $('cutTitle').textContent=x[1]; },x[0])));
    cutT.push(setTimeout(()=>startAmb(55,82.41),T_DET+400));
  }
  if(!reduce&&kind==='secret'){
    SHIFTT([[300,'Determination.'],[1700,'Bound in chains,'],[3100,'it was born in you.'],[6900,'and it broke them all.'],[5000,'Before all things, there was One.'],[7700,'Two lights. Two beginnings.'],[9400,'Neither was enough alone.'],[11900,'One was made for the world.'],[13000,'One was made in you.'],[14400,'It was never luck.'],[16800,'Nor chance.'],[18700,'It was you.'],[19600,''],[24400,''],[26400,'Every ending'],[28000,'and every beginning'],[29300,'become one.'],[T_SEC,'???']]).forEach(x=>cutT.push(setTimeout(()=>{ $('cutTitle').textContent=x[1]; },x[0])));
    cutT.push(setTimeout(()=>{ startAmb(36.71,55); sndCrash(); },T_SEC+OFF_SEC));
  }
  const endY=-(REEL_SPIN-1)*REEL_H;
  const t0=reduce?0:K.arrive, spinAt=t0+200;
  cutT.push(setTimeout(()=>{ cut.classList.add('arrived'); $('cutTitle').textContent='Six reels, one roll'; },t0));
  if(!reduce&&kind==='star'){
    cutT.push(setTimeout(()=>{ $('cutTitle').textContent='Supernova'; },T_BOOM));
    cutT.push(setTimeout(()=>startAmb(65.41,98),T_BOOM+350));
  }
  if(!reduce&&(kind==='impact'||kind==='system')){
    cutT.push(setTimeout(()=>{ $('cutTitle').textContent='IMPACT'; },T_HIT));
    cutT.push(setTimeout(()=>startAmb(49,73.42),T_HIT+400));
  }
  if(!reduce&&kind==='blackhole'){
    cutT.push(setTimeout(()=>{ $('cutTitle').textContent='BLACK HOLE'; },T_BH));
    cutT.push(setTimeout(()=>startAmb(41.2,61.74),T_BH+400));
  }
  if(!reduce&&kind==='beyond'){
    cutT.push(setTimeout(()=>{ $('cutTitle').textContent='Everything is falling in'; },1400));
    cutT.push(setTimeout(()=>{ $('cutTitle').textContent='BEYOND SPACE'; },T_BEY));
    cutT.push(setTimeout(()=>startAmb(36.71,55),T_BEY+400));
  }
  if(!reduce&&kind==='universe'){
    cutT.push(setTimeout(()=>{ $('cutTitle').textContent='Past the stars'; },1800));
    cutT.push(setTimeout(()=>{ $('cutTitle').textContent='UNIVERSE'; },T_UNI));
    cutT.push(setTimeout(()=>startAmb(65.41,98),T_UNI+400));
  }
  if(!reduce&&kind==='multiverse'){
    cutT.push(setTimeout(()=>{ $('cutTitle').textContent='Parallel worlds'; },2000));
    cutT.push(setTimeout(()=>{ $('cutTitle').textContent='MULTIVERSE'; },T_MULTI));
    cutT.push(setTimeout(()=>startAmb(73.42,110),T_MULTI+400));
  }
  if(!reduce&&kind==='omniverse'){
    cutT.push(setTimeout(()=>{ $('cutTitle').textContent='Branches of branches'; },2400));
    cutT.push(setTimeout(()=>{ $('cutTitle').textContent='OMNIVERSE'; },T_OMNI));
    cutT.push(setTimeout(()=>startAmb(55,82.41),T_OMNI+400));
  }
  if(!reduce&&kind==='absolute'){
    cutT.push(setTimeout(()=>{ $('cutTitle').textContent='They will not stop'; },2600));
    cutT.push(setTimeout(()=>{ $('cutTitle').textContent='ABSOLUTE'; },T_ABS));
    cutT.push(setTimeout(()=>startAmb(65.41,98),T_ABS+500));
  }
  if(!reduce&&kind==='one'){
    cutT.push(setTimeout(()=>{ $('cutTitle').textContent='Each one gave itself up'; },3000));
    cutT.push(setTimeout(()=>{ $('cutTitle').textContent='So the others could exist'; },4800));
    cutT.push(setTimeout(()=>{ $('cutTitle').textContent='Now they all return'; },5600));
    cutT.push(setTimeout(()=>{ $('cutTitle').textContent='THE ONE BEFORE ALL'; sndCrash(); setTimeout(sndCrash,220); },T_ONE));
  }
  if(!reduce&&kind==='system'){
    cutT.push(setTimeout(()=>{ $('cutTitle').textContent='The debris is pulling together'; },3000));
    cutT.push(setTimeout(()=>{ $('cutTitle').textContent='SOLAR SYSTEM'; },T_SYS));
    cutT.push(setTimeout(()=>startAmb(65.41,98),T_SYS+400));
  }
  reels.forEach((rl,i)=>{
    const d=reduce?0:1300+i*420, st=rl.firstElementChild;
    cutT.push(setTimeout(()=>{
      st.style.transition=reduce?'none':'transform '+d+'ms cubic-bezier(.12,.7,.15,1)';
      st.style.transform='translateY('+endY+'px)';
    },spinAt));
    cutT.push(setTimeout(()=>{
      rl.classList.add('landed'); if(p.sq[i][2]) rl.classList.add('hit'); sndReel(i);
    },spinAt+d));
  });
  if(!reduce) cutT.push(setTimeout(()=>{ cutTick=setInterval(sndTick,80); },spinAt));
  cutT.push(setTimeout(finishCut,spinAt+(reduce?0:1300+5*420)+450));
}
function finishCut(){
  if(cutDone||!cutCtx) return;
  clearCutTimers(); cutDone=true;
  const p=cutCtx.p, outs=cutCtx.outs, kind=cutCtx.kind, og={};
  if(kind==='rebirth'){
    const n=cutCtx.rb||1;
    $('cutTitle').textContent='REBIRTH '+n;
    $('cutSub').textContent=(cutCtx.preview?'Preview only. ':'')+'Stay determined. Luck +'+(0.5*n).toFixed(1)+', EXP ×'+(1+0.5*n).toFixed(1)+', Determination chance '+pctOf(detChance(n))+' a roll.';
    $('cutOk').hidden=false; $('cutOk').focus(); sndWin('determination');
    let left=10; const okb=$('cutOk'); okb.textContent='Continue ('+left+')';
    cutCd=setInterval(()=>{ left--; if(left<=0){ clearInterval(cutCd); cutCd=null; closeCut(); } else okb.textContent='Continue ('+left+')'; },1000);
    return;
  }
  outs.forEach(o=>{ const k=MUTN[o.m]+' '+NAME[o.z-1]; og[k]=(og[k]||0)+1; });
  document.querySelectorAll('#cut .reel').forEach(rl=>rl.classList.add('landed'));
  $('cutCard').classList.add('win');
  $('cutTitle').textContent=Object.keys(og).map(k=>k+(og[k]>1?' x'+og[k]:'')).join(', ');
  $('cutSub').textContent=p.sq.map(s=>SYM[s[0]-1]+' №'+s[1]).join('  ·  ')+(cutCtx.preview?'. Preview only. Nothing is awarded.':('. +'+fmt(p.gain)+' EXP.'+((S.autoOn&&S.up.auto>0)?' Auto-roll resumes when you continue or after 10 seconds.':'')));
  $('cutOk').hidden=false; $('cutOk').focus();
  sndWin(kind);
  let left=10; const okb=$('cutOk'); okb.textContent='Continue ('+left+')';
  cutCd=setInterval(()=>{
    left--;
    if(left<=0){ clearInterval(cutCd); cutCd=null; closeCut(); }
    else okb.textContent='Continue ('+left+')';
  },1000);
}
function closeCut(){
  if(!cutOpen||!cutDone) return;
  clearCutTimers(); cancelAnimationFrame(cutRaf); stopAmb(); stopScore();
  cutOpen=false; cutDone=false;
  $('cut').hidden=true;
  document.querySelector('.wrap').inert=false;
  busy=false; schedule();
  try{ $('rollBtn').focus(); }catch(e){}
  const af=cutCtx&&cutCtx.after; cutCtx=null; if(af) af();
  if(pendingBoost){ pendingBoost=false; startBoost(); }
}
function previewCut(kind){
  if(busy) return;
  if(kind==='rebirth'){ playRebirthCut(Math.min(RB_MAX,S.rebirths+1),true,null); return; }
  const sq=[];
  for(let i=0;i<6;i++) sq.push({z:pickZ(0),n:1+Math.floor(Math.random()*N),m:0});
  const pl=kind==='planetary'?[1]:kind==='star'?[2]:kind==='system'?[4,4]:kind==='blackhole'?[5]:kind==='beyond'?[6,6,6]:kind==='universe'?[11,6,6]:kind==='multiverse'?[7,7,6]:kind==='omniverse'?[8,8,6]:kind==='secret'?[13,13,13,13,13,13]:kind==='determination'?[12,12,12]:kind==='absolute'?[9,9,6]:kind==='one'?[10,10,10,10,10,10]:[3,3];
  [1,4,2,0,3,5].slice(0,pl.length).forEach((idx,i)=>{ sq[idx].m=pl[i]; });
  const ev=evaluate(sq);
  const p={odds:ev.odds,gain:Math.max(1,Math.round(Math.pow(ev.odds,0.7)*expMult())),sq:sq.map(s=>s.m?[s.z,s.n,s.m]:[s.z,s.n]),bonus:ev.bonus,hw:ev.hw,hx:ev.hx};
  playCutscene(p,sq.filter(s=>s.m).map(s=>({z:s.z,m:s.m})),kind,true);
}

/* rebirth */
let rbArmed=false, rbT=null;
function renderRebirth(){
  const r=S.rebirths, max=r>=RB_MAX, cost=max?0:rbCost(r), b=$('rbBtn');
  $('rbCount').textContent=r+' / '+RB_MAX;
  $('rbLuck').textContent='+'+(0.5*r).toFixed(1);
  $('rbExp').textContent='×'+expMult().toFixed(1);
  $('rbCost').textContent=max?'Maxed':(fmt(cost)+' EXP');
  $('rbProg').value=max?1:Math.min(1,S.exp/cost);
  b.disabled=max||S.exp<cost;
  if(b.disabled) rbArmed=false;
  if(!rbArmed) b.textContent=max?'Fully reborn':('Rebirth '+(r+1));
  $('rbNext').textContent=r>=3?'The Auto-roller is free and stays on.':(r===2?'Your next rebirth gives a free Auto-roller.':'Rebirth 3 gives a free Auto-roller.');
}
function doRebirth(){
  const r=S.rebirths; if(r>=RB_MAX||S.exp<rbCost(r)) return;
  const keep={found:S.found,words:S.words,rx:S.rx,top:S.top,recent:S.recent,secs:S.secs,dets:S.dets,tot:S.tot,life:S.life,best:S.best,outers:S.outers,stars:S.stars,impacts:S.impacts,systems:S.systems,holes:S.holes,beyonds:S.beyonds,multis:S.multis,unis:S.unis,omnis:S.omnis,absolutes:S.absolutes,ones:S.ones};
  clearTimeout(timer);
  Object.assign(S,fresh());
  S.found=keep.found; S.words=keep.words; S.rx=keep.rx; S.top=keep.top; S.recent=keep.recent;
  S.tot=keep.tot; S.life=keep.life; S.best=keep.best; S.outers=keep.outers; S.stars=keep.stars; S.impacts=keep.impacts; S.systems=keep.systems; S.holes=keep.holes; S.beyonds=keep.beyonds; S.multis=keep.multis; S.unis=keep.unis; S.omnis=keep.omnis; S.absolutes=keep.absolutes; S.ones=keep.ones; S.dets=keep.dets; S.secs=keep.secs; S.rebirths=r+1;
  if(S.rebirths>=3){ S.up.auto=1; S.autoOn=true; }
  paintAll(); renderWallet(); renderLists(); renderDisc(); updateUps(); syncAuto();
  save(); markDirty();
  playRebirthCut(S.rebirths,false,()=>{ doRoll(false); schedule(); save(); markDirty(); });
}

/* boot */
let inited=false;
function init(){
  if(inited) return; inited=true;
  S.tot=Math.max(S.tot||0,S.rolls); mutBoost=1+MS_MUT*msCount();
  buildTable(); buildUps(); buildSheet();
  paintAll(); renderWallet(); renderLists(); renderDisc(); updateUps(); syncAuto();
  if(S.last){renderTray(S.last,false); renderResult(S.last,[],false);} else {doRoll(false);}
  schedule();

  const rp=$('rarPanel'), rb2=$('rarBtn'), setRar=o=>{ rp.hidden=!o; rb2.setAttribute('aria-expanded',String(o)); };
  rb2.addEventListener('click',()=>setRar(rp.hidden));
  $('rarClose').addEventListener('click',()=>setRar(false));
  rp.addEventListener('click',e=>{ if(e.target===rp) setRar(false); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!rp.hidden) setRar(false); });
  $('rollBtn').addEventListener('click',()=>doRoll(false));
  $('autoChk').addEventListener('change',e=>{S.autoOn=e.target.checked;schedule();save();});
  document.addEventListener('keydown',e=>{
    if(e.code!=='Space'||e.repeat) return;
    const t=document.activeElement&&document.activeElement.tagName;
    if(t==='INPUT'||t==='BUTTON'||t==='SUMMARY') return;
    e.preventDefault(); doRoll(false);
  });


  let armed=false, armT=null;
  $('resetBtn').addEventListener('click',()=>{
    const b=$('resetBtn');
    if(!armed){
      armed=true; b.classList.add('armed'); b.textContent='Tap again to erase everything';
      armT=setTimeout(()=>{armed=false;b.classList.remove('armed');b.textContent='Reset progress';},4000);
      return;
    }
    clearTimeout(armT); armed=false; b.classList.remove('armed'); b.textContent='Reset progress';
    clearTimeout(timer); clearTimeout(saveT);
    Object.assign(S,fresh());
    try{localStorage.removeItem(KEY);localStorage.removeItem(OLDKEY);}catch(e){}
    paintAll(); renderWallet(); renderLists(); renderDisc(); updateUps(); syncAuto();
    $('dexInfo').textContent='Select an element to see its odds.';
    doRoll(false);
  });
  $('rbBtn').addEventListener('click',()=>{
    if(S.rebirths>=RB_MAX||S.exp<rbCost(S.rebirths)) return;
    if(!rbArmed){ rbArmed=true; $('rbBtn').textContent='Tap again to rebirth'; rbT=setTimeout(()=>{rbArmed=false;renderRebirth();},5000); return; }
    clearTimeout(rbT); rbArmed=false; doRebirth();
  });
  const sb=$('sndBtn');
  const paintSnd=()=>{ sb.textContent='Sound: '+(muted?'off':'on'); sb.setAttribute('aria-pressed',String(!muted)); };
  sb.addEventListener('click',()=>{
    muted=!muted;
    try{ localStorage.setItem('periodic-roll-mute',muted?'1':'0'); }catch(e){}
    paintSnd();
    if(!muted){ unlock(); setTimeout(()=>beep(880,0,0.12,'sine',0.05),60); }
  });
  paintSnd();
  $('cutOk').addEventListener('click',closeCut);
  document.querySelectorAll('.pv').forEach(b=>b.addEventListener('click',()=>previewCut(b.dataset.k)));
  window.addEventListener('resize',()=>{
    if(!cutOpen) return;
    sizeStars();
    if(fx){ const cv=$('stars'); fx.w=cv.clientWidth; fx.h=cv.clientHeight; fx.R=Math.min(fx.w,fx.h); fx.cx=fx.w/2; }
  });
  document.addEventListener('keydown',e=>{
    if(!cutOpen||e.key!=='Escape') return;
    if(cutDone) closeCut();
  });
  renderRebirth();
  setNote(); renderBoard();
  initBoard();
}
try{
  window.claude&&window.claude.hot&&window.claude.hot.snapshot&&window.claude.hot.snapshot(function(){return {S:S};});
}catch(e){}
const start=function(data){
  load();
  if(data&&data.S) merge(data.S);
  S.up.speed=Math.min(10,Math.max(0,S.up.speed|0));
  init();
};
try{
  if(window.claude&&window.claude.hot&&window.claude.hot.ready) window.claude.hot.ready(start);
  else start(window.claude&&window.claude.hot?window.claude.hot.data:null);
}catch(e){try{console.error(e&&e.stack?e.stack:e);}catch(_){} init();}
})();
