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
const fresh = (): any => ({ exp: 0, life: 0, rolls: 0, tot: 0, up: { auto: 0, speed: 0, luck: 0 }, autoOn: false, found: {}, words: {}, rx: {}, best: null, top: [], recent: [], last: null, rebirths: 0, dets: {}, secs: {}, outers: {}, stars: {}, impacts: {}, systems: {}, holes: {}, beyonds: {}, multis: {}, unis: {}, omnis: {}, absolutes: {}, ones: {} });
const KEEP = ["rolls", "found", "words", "rx", "top", "recent", "secs", "dets", "tot", "life", "best", "outers", "stars", "impacts", "systems", "holes", "beyonds", "multis", "unis", "omnis", "absolutes", "ones"];
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

    if (act === "state") { dirty = !row; }
    else if (act === "roll") {
      if (now - t < MIN_GAP) return j({ error: "slow" }, 429);
      t = now;
      G.setMods(1 + MS_MUT * msCount(S), G.detChance(S.rebirths));
      const r = G.rollOnce(effL(S, bu, now));
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
      if (!S.best || p.odds > S.best.odds) S.best = p;
      S.top.push(p); S.top.sort((a: any, b: any) => b.odds - a.odds); S.top = S.top.slice(0, 5);
      S.recent.unshift(p); S.recent = S.recent.slice(0, 6);
      S.last = p;
      if (typeof body.autoOn === "boolean" && S.up.auto > 0) S.autoOn = body.autoOn;
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
    else if (act === "reset") { Object.assign(S, fresh()); bu = 0; pb = false; }
    else return j({ error: "unknown action" }, 400);

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
    return j({ S, bl: Math.max(0, bu - now), ...out });
  } catch (e) {
    return j({ error: String((e as Error)?.message || e) }, 500);
  }
});
