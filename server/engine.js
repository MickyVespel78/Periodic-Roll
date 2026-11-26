/* Periodic Roll engine, shared with the server. Generated from js/game.js (the // <logic> block). */
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

export {rollOnce,detChance,evaluate,NAME,MUTN,N};
export function setMods(a,b){mutBoost=a;detP=b;}
