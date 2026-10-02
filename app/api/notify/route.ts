import { NextRequest, NextResponse } from 'next/server';
import { NAMES, PROFILES, partnerOf, sendToProfile, PushPayload } from '@/lib/push';
import { logActivity } from '@/lib/activity';

// Feed entry for each event: [profile ('both' = shared moment), emoji, text without the subject].
function feedEntry(from: string, type: string, city: string, count: number): [string, string, string] | null {
  switch (type) {
    case 'city_added': return [from, '', 'agregó ' + city];
    case 'city_cut': return [from, '', 'eliminó ' + city];
    case 'round': return ['both', '', 'Empieza la ronda ' + city + ' — quedan ' + count + ' destinos'];
    case 'winner': return ['both', '', '¡Ya se decidió — van a ' + city + '!'];
    case 'trip_dates': return [from, '', 'puso las fechas del viaje'];
    case 'availability': return [from, '', 'marcó nuevos días libres'];
    default: return null;
  }
}

// Messages are composed here from a fixed set of event types, so the client
// only supplies who did it and which city.
function compose(from: string, type: string, city: string, count: number): PushPayload | null {
  const who = NAMES[from];
  switch (type) {
    case 'city_added':
      return { title: 'Nuevo destino', body: who + ' agregó ' + city + ' — ¡ve a deslizar!', tag: 'city' };
    case 'city_cut':
      return {
        title: city + ' quedó fuera',
        body: who + ' lo eliminó — quedan ' + count + ' destino' + (count === 1 ? '' : 's') + '.',
        tag: 'swipes',
      };
    case 'round':
      return { title: 'Ronda ' + city + '!', body: 'Los dos dijeron que sí a ' + count + ' lugares — sigue deslizando para elegir.', tag: 'round' };
    case 'winner':
      return { title: '¡Ya se decidió!', body: 'Van a ' + city + '. Abre la app para la gran revelación.', tag: 'winner' };
    case 'availability':
      return { title: 'Días libres actualizados', body: who + ' marcó los días en que puede viajar — mira dónde se cruzan.', tag: 'availability' };
    case 'trip_dates':
      return { title: 'Fechas del viaje definidas', body: who + ' puso las fechas — ya empezó la cuenta regresiva.', tag: 'dates' };
    default:
      return null;
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) ?? {};
  const { from, type } = body;
  if (!PROFILES.includes(from)) {
    return NextResponse.json({ error: 'invalid profile' }, { status: 400 });
  }
  const city = typeof body.city === 'string' ? body.city.slice(0, 60) : '';
  const count = Number.isFinite(body.count) ? body.count : 0;
  const payload = compose(from, type, city, count);
  if (!payload) return NextResponse.json({ error: 'invalid type' }, { status: 400 });

  const entry = feedEntry(from, type, city, count);
  if (entry) await logActivity(entry[0], entry[1], entry[2], typeof body.destId === 'string' ? body.destId : null);
  try {
    await sendToProfile(partnerOf(from), payload);
  } catch (e) { /* notifications are best-effort */ }
  return NextResponse.json({ ok: true });
}
