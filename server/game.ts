// Supabase Edge Function "game": the server rolls, buys and rebirths. The browser can only ask.
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as GE from "./engine.js";
const eng = async () => GE as any;
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Content-Type": "application/json" };
const j = (o: unknown, st = 200) => new Response(JSON.stringify(o), { status: st, headers: CORS });
const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const interval = (l: number) => Math.round(3000 * Math.pow(1 / 3, Math.min(10, Math.max(0, l)) / 10));
const levelOf = (life: number) => Math.floor(2 * Math.log10(life + 1)) + 1;
const RB_MAX = 10, BOOST_LUCK = 5, BOOST_MS = 10000, REC_MIN = 300, MIN_GAP = 150;
const rbCost = (r: number) => 2.5e10 * Math.pow(6, r);
const MS = [1000, 10000, 50000, 250000, 1000000], MS_LUCK = 0.15, MS_MUT = 0.03;
const DEFS: Record<string, { max: number; cost: (l: number) => number }> = {
  auto: { max: 1, cost: () => 6000000 },
  speed: { max: 10, cost: (l) => Math.round(40000 * Math.pow(2, l)) },
  luck: { max: 20, cost: (l) => Math.round(150 * Math.pow(1.9, l)) },
};
const fresh = (): any => ({ exp: 0, life: 0, rolls: 0, tot: 0, up: { auto: 0, speed: 0, luck: 0 }, autoOn: false, found: {}, words: {}, rx: {}, best: null, top: [], recent: [], last: null, rebirths: 0, shards: 0, ach: {}, qs: {}, dets: {}, secs: {}, outers: {}, stars: {}, impacts: {}, systems: {}, holes: {}, beyonds: {}, multis: {}, unis: {}, omnis: {}, absolutes: {}, ones: {} });
const KEEP = ["shards", "ach", "qs", "rolls", "found", "words", "rx", "top", "recent", "secs", "dets", "tot", "life", "best", "outers", "stars", "impacts", "systems", "holes", "beyonds", "multis", "unis", "omnis", "absolutes", "ones"];
function merge(S: any, d: any) {
  if (!d || typeof d !== "object") return;
  for (const k of Object.keys(S)) {
    if (!(k in d)) continue;
    if (k === "up" && d.up) { for (const u of Object.keys(S.up)) if (typeof d.up[u] === "number") S.up[u] = d.up[u]; }
    else S[k] = d[k];
  }
}
const msCount = (S: any) => MS.filter((t) => (S.tot || 0) >= t).length;
const expMult = (S: any) => 1 + 0.5 * S.rebirths;
const effL = (S: any, bu: number, now: number) => S.up.luck + 0.5 * S.rebirths + MS_LUCK * msCount(S) + (now < bu ? BOOST_LUCK : 0);
const mutMap = (S: any, m: number) => m === 1 ? S.outers : m === 2 ? S.stars : m === 3 ? S.impacts : m === 4 ? S.systems : m === 5 ? S.holes : m === 6 ? S.beyonds : m === 7 ? S.multis : m === 11 ? S.unis : m === 12 ? S.dets : m === 13 ? S.secs : m === 8 ? S.omnis : m === 9 ? S.absolutes : S.ones;

// ---- Achievements (pay shards, unlock by themselves) and quests (pay EXP, press Claim) ----
// metric keys: tot found words rx rb mutk mutn best level det sec luck auto
const ACH: [string, string, string, string, number, number][] = [
  ["r1", "First roll", "Roll once", "tot", 1, 15], ["r100", "Warming up", "Roll 100 times", "tot", 100, 15], ["r1k", "Getting hooked", "Roll 1,000 times", "tot", 1000, 20],
  ["r10k", "Dedicated", "Roll 10,000 times", "tot", 10000, 30], ["r100k", "No life", "Roll 100,000 times", "tot", 100000, 50],
  ["e20", "Collector", "Find 20 elements", "found", 20, 15], ["e60", "Chemist", "Find 60 elements", "found", 60, 25], ["e118", "Whole table", "Find all 118 elements", "found", 118, 50],
  ["w10", "Wordsmith", "Find 10 different words or names", "words", 10, 15], ["w50", "Dictionary", "Find 50 different words or names", "words", 50, 25],
  ["x10", "Lab work", "Form 10 different compounds", "rx", 10, 15], ["x40", "Master chemist", "Form 40 different compounds", "rx", 40, 25],
  ["m1", "Something changed", "Get your first mutation", "mutk", 1, 20], ["m5", "Mutant", "Find 5 different mutations", "mutk", 5, 30], ["m9", "Cosmic", "Find 9 different mutations", "mutk", 9, 45],
  ["rb1", "Born again", "Rebirth once", "rb", 1, 25], ["rb5", "Reborn", "Reach 5 rebirths", "rb", 5, 35], ["rb10", "Fully reborn", "Reach 10 rebirths", "rb", 10, 50],
  ["det", "Stay determined", "Find a Determination", "det", 1, 40], ["sec", "It was you", "Find the ???", "sec", 1, 50],
  ["b1k", "Lucky", "Best roll of 1 in 1,000", "best", 1e3, 15], ["b1m", "Very lucky", "Best roll of 1 in 1,000,000", "best", 1e6, 25], ["b1t", "Absurdly lucky", "Best roll of 1 in 1e12", "best", 1e12, 35], ["b30", "Impossible", "Best roll of 1 in 1e30", "best", 1e30, 50],
  ["l10", "Level 10", "Reach level 10", "level", 10, 15], ["l30", "Level 30", "Reach level 30", "level", 30, 30],
  ["auto", "Hands free", "Own the Auto-roller", "auto", 1, 20], ["lk20", "Max luck", "Lucky isotopes level 20", "luck", 20, 30],
];
const QD: Record<string, [string, string, string, number][]> = {
  d: [["d_n", "Roll 150 times", "n", 150], ["d_x", "Form 30 compounds", "rx", 30], ["d_w", "Find 6 words or names", "wd", 6], ["d_o", "Land 20 rolls of 1 in 5,000 or rarer", "o5k", 20]],
  w: [["w_n", "Roll 1,500 times", "n", 1500], ["w_x", "Form 300 compounds", "rx", 300], ["w_o", "Land 100 rolls of 1 in 100,000 or rarer", "o1e5", 100], ["w_m", "Get a mutation", "mut", 1]],
  a: [["a_t1", "Roll 5,000 times", "tot", 5000], ["a_t2", "Roll 50,000 times", "tot", 50000], ["a_t3", "Roll 500,000 times", "tot", 500000], ["a_e", "Find 100 elements", "found", 100], ["a_w", "Find 40 different words or names", "words", 40],
      ["a_k", "Find 4 different mutations", "mutk", 4], ["a_r1", "Rebirth once", "rb", 1], ["a_r5", "Reach 5 rebirths", "rb", 5], ["a_b", "Best roll of 1 in 1e15", "best", 1e15]],
};
const MKEYS = ["outers", "stars", "impacts", "systems", "holes", "beyonds", "multis", "unis", "omnis", "absolutes", "ones", "dets", "secs"];
const cnt = (o: any) => Object.keys(o || {}).length;
const metric = (k: string, S: any): number => {
  switch (k) {
    case "tot": return S.tot || 0; case "found": return cnt(S.found); case "words": return cnt(S.words); case "rx": return cnt(S.rx); case "rb": return S.rebirths || 0;
    case "mutk": return MKEYS.filter((m) => cnt(S[m]) > 0).length; case "best": return S.best ? S.best.odds : 0; case "level": return levelOf(S.life || 0);
    case "det": return cnt(S.dets) > 0 ? 1 : 0; case "sec": return cnt(S.secs) > 0 ? 1 : 0; case "luck": return S.up.luck || 0; case "auto": return S.up.auto || 0;
  }
  return 0;
};
const dayId = (now: number) => Math.floor(now / 864e5), weekId = (now: number) => Math.floor((now / 864e5 + 3) / 7);
function syncQ(S: any, now: number) {
  if (!S.qs || typeof S.qs !== "object") S.qs = {};
  if (!S.ach || typeof S.ach !== "object") S.ach = {};
  if (!S.qs.d || S.qs.d.id !== dayId(now)) S.qs.d = { id: dayId(now), p: {}, c: {} };
  if (!S.qs.w || S.qs.w.id !== weekId(now)) S.qs.w = { id: weekId(now), p: {}, c: {} };
  if (!S.qs.a) S.qs.a = { p: {}, c: {} };
  if (typeof S.shards !== "number") S.shards = 0;
}
function bump(S: any, ev: Record<string, number>) { for (const sc of ["d", "w"]) for (const k in ev) S.qs[sc].p[k] = (S.qs[sc].p[k] || 0) + ev[k]; }
function checkAch(S: any, now: number) {
  const got: any[] = [];
  for (const [id, name, , key, goal, sh] of ACH) if (!S.ach[id] && metric(key, S) >= goal) { S.ach[id] = now; S.shards += sh; got.push({ name, shards: sh }); }
  return got;
}
const QR: Record<string, number> = { d_n: 1e8, d_x: 1.5e8, d_w: 2e8, d_o: 3e8, w_n: 1e9, w_x: 1.5e9, w_o: 3e9, w_m: 5e9,
  a_t1: 1e10, a_e: 1.5e10, a_w: 2.5e10, a_k: 3e10, a_t2: 5e10, a_r1: 1e11, a_t3: 2.5e11, a_r5: 5e11, a_b: 1e12 };
const reward = (id: string) => QR[id] || 1e8;
const qprog = (sc: string, key: string, S: any) => sc === "a" ? metric(key, S) : (S.qs[sc].p[key] || 0);
function view(S: any, now: number) {
  const q: any = {};
  for (const sc of ["d", "w", "a"]) q[sc] = QD[sc].map(([id, title, key, goal]) => { const pr = qprog(sc, key, S); return { id, title, prog: Math.min(pr, goal), goal, done: pr >= goal, claimed: !!S.qs[sc].c[id], reward: reward(id) }; });
  const ach = ACH.map(([id, name, desc, key, goal, sh]) => ({ id, name, desc, prog: Math.min(metric(key, S), goal), goal, shards: sh, done: !!S.ach[id] }));
  return { shards: S.shards, q, ach, resetD: (dayId(now) + 1) * 864e5 - now, resetW: (weekId(now) * 7 - 3 + 7) * 864e5 - now };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const jwt = (req.headers.get("Authorization") || "").replace(/^Bearer /i, "");
    const { data: u, error: ae } = await admin.auth.getUser(jwt);
    if (ae || !u?.user) return j({ error: "Please log in again." }, 401);
    const uid = u.user.id;
    const body = await req.json().catch(() => ({}));
    const act = String(body.action || "");
    const G = await eng();
    const { data: row } = await admin.from("saves").select("data").eq("user_id", uid).maybeSingle();
    const S = fresh(); let t = 0, bu = 0, pb = false;
    if (row?.data) { merge(S, row.data); t = +row.data._t || 0; bu = +row.data._bu || 0; pb = !!row.data._pb; }
    const now = Date.now(); const out: any = {}; let dirty = true;
    syncQ(S, now);

    if (act === "state") { dirty = !row; }
    else if (act === "roll") {
      if (now - t < MIN_GAP) return j({ error: "slow" }, 429);
      t = now;
      G.setMods(1 + MS_MUT * msCount(S), G.detChance(S.rebirths));
      // A roll the owner queued for this player is used first, even if they were offline when it was sent.
      let gift: any[] | null = null;
      const { data: pg } = await admin.from("pending_rolls").select("id,tiles").eq("user_id", uid).order("id").limit(1).maybeSingle();
      if (pg) {
        const { data: del } = await admin.from("pending_rolls").delete().eq("id", pg.id).select("id");
        if (del && del.length) gift = pg.tiles;
      }
      let r: any;
      if (gift) { const gsq = gift.map((s: any) => ({ z: s.z, n: s.n, m: s.m || 0 })); r = { sq: gsq, ...G.evaluate(gsq) }; }
      else r = G.rollOnce(effL(S, bu, now));
      const gain = Math.max(1, Math.round(Math.pow(r.odds, 0.7) * expMult(S)));
      const p = { odds: r.odds, gain, sq: r.sq.map((s: any) => s.m ? [s.z, s.n, s.m] : [s.z, s.n]), bonus: r.bonus, hw: r.hw, hx: r.hx };
      S.exp += gain; S.life += gain; S.rolls++; S.tot = (S.tot || 0) + 1;
      out.ms = MS.indexOf(S.tot) >= 0;
      const notes: string[] = [], outs: any[] = [];
      for (const s of r.sq) if (s.m) {
        outs.push({ z: s.z, m: s.m });
        const mp = mutMap(S, s.m); mp[s.z] = (mp[s.z] || 0) + 1;
        const nm = G.MUTN[s.m].toUpperCase() + " " + G.NAME[s.z - 1];
        if (notes.indexOf(nm) < 0) notes.push(nm);
      }
      for (const s of p.sq) { if (!S.found[s[0]]) { S.found[s[0]] = 0; notes.push(G.NAME[s[0] - 1]); } S.found[s[0]]++; }
      if (r.word) { if (!S.words[r.word]) notes.push('word "' + r.word + '"'); S.words[r.word] = (S.words[r.word] || 0) + 1; }
      for (const n of r.rx) { if (!S.rx[n]) notes.push(n); S.rx[n] = (S.rx[n] || 0) + 1; }
      const rec = !!(S.best && p.odds > S.best.odds && p.odds >= REC_MIN);
      if (rec) { notes.unshift("NEW RECORD"); pb = true; }
      if (gift) notes.unshift("GIFT ROLL FROM THE OWNER");
      if (!S.best || p.odds > S.best.odds) S.best = p;
      S.top.push(p); S.top.sort((a: any, b: any) => b.odds - a.odds); S.top = S.top.slice(0, 5);
      S.recent.unshift(p); S.recent = S.recent.slice(0, 6);
      S.last = p;
      if (typeof body.autoOn === "boolean" && S.up.auto > 0) S.autoOn = body.autoOn;
      bump(S, { n: 1, rx: r.rx.length, wd: r.word ? 1 : 0, o5k: p.odds >= 5000 ? 1 : 0, o1e5: p.odds >= 1e5 ? 1 : 0, mut: outs.length });
      Object.assign(out, { p, notes, outs, rec });
    }
    else if (act === "boost") { if (pb) { pb = false; bu = now + BOOST_MS; } }
    else if (act === "auto") { if (S.up.auto > 0) S.autoOn = !!body.on; }
    else if (act === "buy") {
      const d = DEFS[String(body.k)]; if (!d) return j({ error: "bad item" }, 400);
      const k = String(body.k), l = S.up[k];
      if (l >= d.max) return j({ error: "maxed" }, 400);
      const c = d.cost(l); if (S.exp < c) return j({ error: "Not enough EXP." }, 400);
      S.exp -= c; S.up[k] = l + 1; if (k === "auto") S.autoOn = true;
    }
    else if (act === "rebirth") {
      const r = S.rebirths;
      if (r >= RB_MAX || S.exp < rbCost(r)) return j({ error: "Not enough EXP to rebirth." }, 400);
      const keep: any = {}; for (const k of KEEP) keep[k] = S[k];
      Object.assign(S, fresh()); for (const k of KEEP) S[k] = keep[k];
      S.rebirths = r + 1; bu = 0; pb = false;
      if (S.rebirths >= 3) { S.up.auto = 1; S.autoOn = true; }
    }
    else if (act === "claim") {
      const id = String(body.q || ""); const sc = id.charAt(0);
      const def = (QD[sc] || []).find((d) => d[0] === id);
      if (!def) return j({ error: "No such quest." }, 400);
      if (S.qs[sc].c[id]) return j({ error: "Already claimed." }, 400);
      if (qprog(sc, def[2], S) < def[3]) return j({ error: "Not finished yet." }, 400);
      const rw = reward(id); S.qs[sc].c[id] = 1; S.exp += rw; S.life += rw; out.claimed = rw;
    }
    else if (act === "reset") { const k = { shards: S.shards, ach: S.ach, qs: S.qs }; Object.assign(S, fresh(), k); bu = 0; pb = false; }
    else return j({ error: "unknown action" }, 400);

    out.newAch = checkAch(S, now);
    if (out.newAch.length) dirty = true;
    if (dirty) {
      const best = S.best;
      const { error: we } = await admin.from("saves").upsert({
        user_id: uid, data: { ...S, _t: t, _bu: bu, _pb: pb },
        life: S.life, best_odds: best ? best.odds : 0, best_sq: best ? best.sq : null,
        level: levelOf(S.life), rolls: S.rolls, found: Object.keys(S.found).length, rebirths: S.rebirths,
        updated_at: new Date().toISOString(),
      });
      if (we) return j({ error: "Could not save: " + we.message }, 500);
    }
    return j({ S, bl: Math.max(0, bu - now), Q: view(S, now), ...out });
  } catch (e) {
    return j({ error: String((e as Error)?.message || e) }, 500);
  }
});
