#!/usr/bin/env node
// Prevención de la lección 7 (horas escritas sin reloj), causa raíz (20 nov 2026,
// 5.ª ocurrencia): Claude no tiene reloj en su contexto. Las horas que escribe
// casi siempre son «a qué hora decidió Miguel», un momento que nunca midió, así
// que la estimaba, y la estimación empeora mientras más dura la tarea. El hook
// hora-real.mjs solo DETECTA el error después de escribirlo.
// Este hook (UserPromptSubmit) PREVIENE: con cada mensaje de Miguel le entrega a
// Claude la hora real de México en ese instante. Esa es la fuente de «decidió
// Miguel a las…»; cualquier otra hora sale de `date` corrido en un paso aparte.
import { pathToFileURL } from 'node:url';
import { horaMexico } from './hora-real.mjs';

export function sello(ahora = new Date()) {
  const { hora, fecha } = horaMexico(ahora);
  return (
    `Reloj (lección 7): mensaje de Miguel recibido a las ${hora}, ${fecha} (hora de México). ` +
    'Usa esta hora para «Miguel decidió / pidió a las…». Para cualquier otra hora, corre ' +
    '`TZ=America/Mexico_City date` en un paso aparte ANTES de escribirla; nunca la escribas de memoria.'
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: sello() },
  }));
}
