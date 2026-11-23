/* Periodic Roll accounts: Guest (this browser only) or Account (Supabase cloud save + worldwide leaderboard) */
(function(){
'use strict';
const C=window.PR_CONFIG||{};
const MODE_KEY='periodic-roll-mode', GUEST_KEY='periodic-roll-v2', ACCT_KEY='periodic-roll-acct';
const enabled=!!(C.url&&C.key&&window.supabase&&window.supabase.createClient);
const A={enabled,mode:'guest',user:null,name:'',client:null};
window.PRAuth=A;
const $=id=>document.getElementById(id);
const ls={get(k){try{return localStorage.getItem(k);}catch(e){return null;}},set(k,v){try{localStorage.setItem(k,v);}catch(e){}},del(k){try{localStorage.removeItem(k);}catch(e){}}};
A.key=()=>A.mode==='account'&&A.user?ACCT_KEY+'-'+A.user.id:GUEST_KEY;
const lifeOf=s=>{try{const o=JSON.parse(s);return +o.life||0;}catch(e){return -1;}};

A.boot=async function(){
  const m=ls.get(MODE_KEY);
  A.mode=m==='account'?'account':'guest';
  if(!enabled){ A.mode='guest'; return; }
  A.client=window.supabase.createClient(C.url,C.key,{auth:{persistSession:true,autoRefreshToken:true}});
  if(A.mode!=='account') return;
  try{
    const {data}=await A.client.auth.getSession();
    const u=data&&data.session&&data.session.user;
    if(!u){ A.mode='guest'; ls.set(MODE_KEY,'guest'); return; }
    A.user=u;
    const pr=await A.client.from('profiles').select('username').eq('id',u.id).maybeSingle();
    A.name=(pr.data&&pr.data.username)||(u.user_metadata&&u.user_metadata.username)||'Player';
    const r=await A.client.from('saves').select('data').eq('user_id',u.id).maybeSingle();
    const AK=ACCT_KEY+'-'+u.id, local=ls.get(AK);
    if(r.data&&r.data.data){
      const cloud=JSON.stringify(r.data.data);
      /* keep whichever has more lifetime EXP, so offline progress is never lost */
      if(local&&lifeOf(local)>lifeOf(cloud)) A.seedCloud=true; else ls.set(AK,cloud);
    }else A.seedCloud=true;
  }catch(e){ if(!A.user){A.mode='guest';} }
};

A.push=async function(row){
  if(!A.enabled||!A.user) return false;
  const {error}=await A.client.from('saves').upsert(Object.assign({user_id:A.user.id,updated_at:new Date().toISOString()},row));
  return !error;
};
A.fetchBoard=async function(){
  if(!A.enabled) return null;
  const q=col=>A.client.from('leaderboard').select('*').order(col,{ascending:false}).limit(15);
  const [a,b]=await Promise.all([q('life'),q('best_odds')]);
  if(a.error||b.error) return null;
  const seen={}, rows=[];
  for(const r of (a.data||[]).concat(b.data||[])){ if(seen[r.user_id]) continue; seen[r.user_id]=1; rows.push(r); }
  return rows;
};
A.signOut=async function(){
  try{await A.client.auth.signOut();}catch(e){}
  ls.set(MODE_KEY,'guest'); location.reload();
};

/* ---------- UI ---------- */
function el(t,c,x){const e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e;}
function bar(){
  const host=$('acctBar'); if(!host) return; host.textContent='';
  if(!A.enabled){ return; }
  if(A.mode==='account'&&A.user){
    host.appendChild(el('span','acct-who','Account: '+A.name));
    const b=el('button','reset','Log out'); b.type='button'; b.addEventListener('click',A.signOut); host.appendChild(b);
  }else{
    host.appendChild(el('span','acct-who','Guest (saved in this browser only)'));
    const b=el('button','reset','Log in / Create account'); b.type='button'; b.addEventListener('click',()=>modal('choice')); host.appendChild(b);
  }
}
let box=null;
function close(){ if(box){box.remove(); box=null;} }
function modal(view){
  close();
  box=el('div','acct-ov'); box.setAttribute('role','dialog'); box.setAttribute('aria-modal','true');
  const card=el('div','acct-card'); box.appendChild(card);
  const x=el('button','acct-x','×'); x.type='button'; x.setAttribute('aria-label','Close'); x.addEventListener('click',()=>{ if(!ls.get(MODE_KEY)) ls.set(MODE_KEY,'guest'); close(); bar(); }); card.appendChild(x);
  if(view==='choice'){
    card.appendChild(el('h2',null,'Create an account?'));
    card.appendChild(el('p',null,'Yes: your progress is saved online, works on any device, and you appear on the worldwide leaderboard.'));
    card.appendChild(el('p',null,'No: play as a guest. Progress stays in this browser only, does not move to other devices, and is not on the leaderboard.'));
    const row=el('div','acct-row');
    const y=el('button','buy','Yes, sign me in'); y.type='button'; y.addEventListener('click',()=>modal('signup'));
    const n=el('button','reset','No, play as guest'); n.type='button'; n.addEventListener('click',()=>{ls.set(MODE_KEY,'guest'); close(); bar();});
    row.appendChild(y); row.appendChild(n); card.appendChild(row);
  }else{
    const up=view==='signup';
    card.appendChild(el('h2',null,up?'Create account':'Log in'));
    const f=el('form'); f.noValidate=true;
    const mk=(lab,type,ac)=>{const l=el('label',null,lab); const i=el('input'); i.type=type; i.autocomplete=ac; l.appendChild(i); f.appendChild(l); return i;};
    const em=mk('Email (this is your login)','email','email');
    const un=up?mk('Username (shown on the leaderboard)','text','nickname'):null;
    const pw=mk('Password','password',up?'new-password':'current-password');
    if(un){ un.maxLength=16; }
    const msg=el('p','acct-msg',''); msg.setAttribute('aria-live','polite'); f.appendChild(msg);
    const go=el('button','buy',up?'Create account':'Log in'); go.type='submit'; f.appendChild(go);
    const sw=el('button','reset',up?'I already have an account':'I need an account'); sw.type='button'; sw.addEventListener('click',()=>modal(up?'login':'signup'));
    const gu=el('button','reset','Play as guest instead'); gu.type='button'; gu.addEventListener('click',()=>{ls.set(MODE_KEY,'guest'); close(); bar();});
    const row=el('div','acct-row'); row.appendChild(sw); row.appendChild(gu); f.appendChild(row);
    f.addEventListener('submit',async e=>{
      e.preventDefault(); msg.textContent='';
      const email=em.value.trim(), pass=pw.value, name=un?un.value.trim():'';
      if(!/^\S+@\S+\.\S+$/.test(email)){msg.textContent='Enter a valid email.';return;}
      if(pass.length<6){msg.textContent='Password needs at least 6 characters.';return;}
      if(up&&!/^[A-Za-z0-9_.-]{3,16}$/.test(name)){msg.textContent='Username: 3 to 16 letters, numbers, _ . -';return;}
      go.disabled=true; msg.textContent='Working…';
      try{
        if(up){
          const t=await A.client.from('profiles').select('id').ilike('username',name).limit(1);
          if(t.data&&t.data.length){msg.textContent='That username is taken.';go.disabled=false;return;}
          const r=await A.client.auth.signUp({email,password:pass,options:{data:{username:name}}});
          if(r.error){msg.textContent=r.error.message;go.disabled=false;return;}
          if(!r.data.session){
            const r2=await A.client.auth.signInWithPassword({email,password:pass});
            if(r2.error){msg.textContent='Account created. Check your email to confirm it, then log in.';go.disabled=false;return;}
          }
        }else{
          const r=await A.client.auth.signInWithPassword({email,password:pass});
          if(r.error){msg.textContent=r.error.message;go.disabled=false;return;}
        }
        ls.set(MODE_KEY,'account'); location.reload();
      }catch(err){ msg.textContent='Could not reach the server. Try again.'; go.disabled=false; }
    });
    card.appendChild(f);
    setTimeout(()=>em.focus(),30);
  }
  document.body.appendChild(box);
}
A.start=function(){
  bar();
  if(A.enabled&&!ls.get(MODE_KEY)) modal('choice');
};
})();
