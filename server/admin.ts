// Supabase Edge Function "admin": owner-only commands. The server checks the owners table; the browser cannot grant itself anything.
// The owner can act on their own save or on any player by username. Gift rolls wait in pending_rolls until the player's next roll.
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as G from "./engine.js";
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Content-Type": "application/json" };
const j = (o: unknown, st = 200) => new Response(JSON.stringify(o), { status: st, headers: CORS });
const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const MAPS: Record<number, string> = { 1: "outers", 2: "stars", 3: "impacts", 4: "systems", 5: "holes", 6: "beyonds", 7: "multis", 8: "omnis", 9: "absolutes", 10: "ones", 11: "unis", 12: "dets", 13: "secs" };
const levelOf = (life: number) => Math.floor(2 * Math.log10(life + 1)) + 1;
// Owner limits are far beyond anything a normal player can reach (players: 10 rebirths, luck 20, speed 10).
// "inf" means the limit (1 billion); real infinity cannot be stored in a save.
const LIM = 1e9; // owner limit: 1 billion
const UPMAX: Record<string, number> = { auto: 1, speed: LIM, luck: LIM };
const RBMAX = LIM;
const clean = (D: any) => { const S: any = { ...D }; delete S._t; delete S._bu; delete S._pb; return S; };
const num = (v: unknown, max: number) => { if (typeof v === "string" && /^\s*(inf|infinity|∞)\s*$/i.test(v)) return max; const x = Number(v); return Number.isFinite(x) && x >= 0 && x <= max ? x : null; };
const KEYS = ["found", "words", "rx", "dets", "secs", "outers", "stars", "impacts", "systems", "holes", "beyonds", "multis", "unis", "omnis", "absolutes", "ones"];
const stats = (D: any, pending: number) => ({ exp: D.exp || 0, life: D.life || 0, rolls: D.rolls || 0, rebirths: D.rebirths || 0, shards: D.shards || 0, luck: D.up?.luck || 0, speed: D.up?.speed || 0, auto: D.up?.auto || 0, best: D.best ? D.best.odds : 0, pending });

async function write(uid: string, D: any) {
  const best = D.best;
  const { error } = await admin.from("saves").update({
    data: D, life: D.life || 0, best_odds: best ? best.odds : 0, best_sq: best ? best.sq : null,
    level: levelOf(D.life || 0), rolls: D.rolls || 0, found: Object.keys(D.found || {}).length, rebirths: D.rebirths || 0,
    updated_at: new Date().toISOString(),
  }).eq("user_id", uid);
  return error;
}
async function pendingCount(uid: string) {
  const { count } = await admin.from("pending_rolls").select("id", { count: "exact", head: true }).eq("user_id", uid);
  return count || 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const jwt = (req.headers.get("Authorization") || "").replace(/^Bearer /i, "");
    const { data: u, error: ae } = await admin.auth.getUser(jwt);
    if (ae || !u?.user) return j({ error: "Please log in again." }, 401);
    const uid = u.user.id;
    const { data: own } = await admin.from("owners").select("user_id").eq("user_id", uid).maybeSingle();
    const isOwner = !!own;
    const body = await req.json().catch(() => ({}));
    const act = String(body.action || "");
    if (act === "whoami") return j({ owner: isOwner });
    if (!isOwner) return j({ error: "Owner only." }, 403);

    // The saved list of players the owner has already entered
    if (act === "targets") {
      const { data: rows } = await admin.from("owner_targets").select("target_id,last_used").eq("owner_id", uid).order("last_used", { ascending: false }).limit(60);
      const ids = (rows || []).map((r: any) => r.target_id);
      const names: Record<string, string> = {};
      if (ids.length) { const { data: ps } = await admin.from("profiles").select("id,username").in("id", ids); for (const p of ps || []) names[p.id] = p.username; }
      return j({ targets: (rows || []).filter((r: any) => names[r.target_id]).map((r: any) => names[r.target_id]) });
    }

    // Who is this command for? Empty = the owner. Otherwise any player, found by username (not case sensitive).
    const tname = String(body.target || "").trim().slice(0, 32);
    let tuid = uid, tlabel = "you";
    if (tname) {
      const { data: prof } = await admin.from("profiles").select("id,username").ilike("username", tname.replace(/[%_\\]/g, (c) => "\\" + c)).maybeSingle();
      if (!prof) return j({ error: 'No player called "' + tname + '".' }, 404);
      tlabel = prof.username;
      if (prof.id !== uid) tuid = prof.id;
    }
    const other = tuid !== uid;
    if (act === "forget") {
      if (other) await admin.from("owner_targets").delete().eq("owner_id", uid).eq("target_id", tuid);
      return j({ ok: true });
    }
    if (other) await admin.from("owner_targets").upsert({ owner_id: uid, target_id: tuid, last_used: new Date().toISOString() });

    const { data: row } = await admin.from("saves").select("data").eq("user_id", tuid).maybeSingle();

    // A gift roll can be queued even if the player has never opened the game
    if (act === "forceroll" || act === "queue") {
      const tiles = Array.isArray(body.tiles) ? body.tiles : [];
      if (tiles.length !== 6) return j({ error: "Need six tiles." }, 400);
      const sq: any[] = [];
      for (const t of tiles) {
        const z = Math.floor(Number(t.z)), m = Math.floor(Number(t.m) || 0);
        let n = Math.floor(Number(t.n));
        if (!(z >= 1 && z <= 118) || (m !== 0 && !MAPS[m])) return j({ error: "Bad tile." }, 400);
        if (!(n >= 1 && n <= 118)) n = 1 + Math.floor(Math.random() * 118);
        sq.push({ z, n, m });
      }
      if (other || act === "queue") {
        if ((await pendingCount(tuid)) >= 20) return j({ error: tlabel + " already has 20 gift rolls waiting." }, 400);
        const { error } = await admin.from("pending_rolls").insert({ user_id: tuid, tiles: sq });
        if (error) return j({ error: "Could not queue: " + error.message }, 500);
        return j({ queued: true, target: tlabel, pending: await pendingCount(tuid) });
      }
    }

    if (!row?.data) return j({ error: other ? tlabel + " has not opened the game yet. You can still send a gift roll." : "Roll once first." }, 400);
    const D = row.data;
    for (const k of KEYS) D[k] = D[k] || {};
    D.up = D.up || { auto: 0, speed: 0, luck: 0 }; D.top = D.top || []; D.recent = D.recent || [];
    const done = async () => {
      const e = await write(tuid, D); if (e) return j({ error: "Could not save: " + e.message }, 500);
      if (other) return j({ ok: true, target: tlabel, stats: stats(D, await pendingCount(tuid)) });
      return j({ S: clean(D), bl: 0, stats: stats(D, 0) });
    };

    if (act === "lookup") return j({ target: tlabel, me: !other, stats: stats(D, await pendingCount(tuid)) });

    if (act === "give") {
      const z = Math.floor(Number(body.z)), m = Math.floor(Number(body.m)), n = Math.min(50, Math.max(1, Math.floor(Number(body.n) || 1)));
      if (!(z >= 1 && z <= 118) || !MAPS[m]) return j({ error: "Bad element or mutation." }, 400);
      D.found[z] = (D.found[z] || 0) + n;
      const key = MAPS[m]; D[key][z] = (D[key][z] || 0) + n;
      return done();
    }

    if (act === "forceroll") { // own account only (others returned above)
      const sq: any[] = body.tiles.map((t: any) => ({ z: Math.floor(Number(t.z)), n: (Math.floor(Number(t.n)) >= 1 && Math.floor(Number(t.n)) <= 118) ? Math.floor(Number(t.n)) : 1 + Math.floor(Math.random() * 118), m: Math.floor(Number(t.m) || 0) }));
      const ev = G.evaluate(sq);
      const expMult = 1 + 0.5 * (D.rebirths || 0);
      const gain = Math.max(1, Math.round(Math.pow(ev.odds, 0.7) * expMult));
      const p = { odds: ev.odds, gain, sq: sq.map((s) => s.m ? [s.z, s.n, s.m] : [s.z, s.n]), bonus: ev.bonus, hw: ev.hw, hx: ev.hx };
      D.exp = (D.exp || 0) + gain; D.life = (D.life || 0) + gain; D.rolls = (D.rolls || 0) + 1; D.tot = (D.tot || 0) + 1;
      const notes: string[] = [], outs: any[] = [];
      for (const s of sq) if (s.m) {
        outs.push({ z: s.z, m: s.m });
        const mp = D[MAPS[s.m]]; mp[s.z] = (mp[s.z] || 0) + 1;
        const nm = G.MUTN[s.m].toUpperCase() + " " + G.NAME[s.z - 1];
        if (notes.indexOf(nm) < 0) notes.push(nm);
      }
      for (const s of p.sq) { if (!D.found[s[0]]) { D.found[s[0]] = 0; notes.push(G.NAME[s[0] - 1]); } D.found[s[0]]++; }
      if (ev.word) { if (!D.words[ev.word]) notes.push('word "' + ev.word + '"'); D.words[ev.word] = (D.words[ev.word] || 0) + 1; }
      for (const n of ev.rx) { if (!D.rx[n]) notes.push(n); D.rx[n] = (D.rx[n] || 0) + 1; }
      const rec = !!(D.best && p.odds > D.best.odds && p.odds >= 300);
      if (rec) notes.unshift("NEW RECORD");
      if (!D.best || p.odds > D.best.odds) D.best = p;
      D.top.push(p); D.top.sort((a: any, b: any) => b.odds - a.odds); D.top = D.top.slice(0, 5);
      D.recent.unshift(p); D.recent = D.recent.slice(0, 6);
      D.last = p;
      const e = await write(uid, D); if (e) return j({ error: "Could not save: " + e.message }, 500);
      return j({ S: clean(D), bl: 0, p, notes, outs, rec: false, ms: false });
    }

    if (act === "set") {
      const v = body.values || {};
      if (v.exp !== undefined) { const x = num(v.exp, LIM); if (x === null) return j({ error: "Bad EXP." }, 400); D.exp = x; if ((D.life || 0) < x) D.life = x; }
      if (v.life !== undefined) { const x = num(v.life, LIM); if (x === null) return j({ error: "Bad lifetime EXP." }, 400); D.life = x; }
      if (v.level !== undefined) { const x = num(v.level, 19); if (x === null || x < 1) return j({ error: "Level is 1 to 19." }, 400); D.life = Math.ceil(Math.pow(10, (Math.floor(x) - 1) / 2)); if ((D.exp || 0) > D.life) D.exp = D.life; }
      if (v.rolls !== undefined) { const x = num(v.rolls, LIM); if (x === null) return j({ error: "Bad rolls." }, 400); D.rolls = x; if ((D.tot || 0) < D.rolls) D.tot = D.rolls; }
      if (v.rebirths !== undefined) { const x = num(v.rebirths, RBMAX); if (x === null) return j({ error: "Rebirths are 0 to 1,000,000,000 (or inf)." }, 400); D.rebirths = Math.floor(x); if (D.rebirths >= 3) { D.up.auto = 1; } }
      if (v.shards !== undefined) { const x = num(v.shards, LIM); if (x === null) return j({ error: "Bad shards." }, 400); D.shards = Math.floor(x); }
      if (v.bestodds !== undefined) {
        const x = num(v.bestodds, LIM); if (x === null || x < 1) return j({ error: "Best roll is 1 or more." }, 400);
        const base = D.best || D.last || { sq: [[1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1]], gain: 1, bonus: [], hw: [], hx: [] };
        D.best = { ...base, odds: x };
        D.top = [D.best, ...D.top.filter((t: any) => t.odds < x)].slice(0, 5);
      }
      for (const k of ["auto", "speed", "luck"]) if (v[k] !== undefined) { const x = num(v[k], UPMAX[k]); if (x === null) return j({ error: "Bad " + k + " level (0 to 1,000,000,000 or inf)." }, 400); D.up[k] = Math.floor(x); if (k === "auto" && D.up.auto > 0) D.autoOn = true; }
      return done();
    }
    return j({ error: "unknown action" }, 400);
  } catch (e) {
    return j({ error: String((e as Error)?.message || e) }, 500);
  }
});
