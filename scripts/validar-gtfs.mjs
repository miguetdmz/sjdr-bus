#!/usr/bin/env node
// Validador oficial de GTFS de MobilityData (Apache-2.0) para la puerta de calidad (N-02, D-11).
// Es el "laboratorio de metrología" del feed: ninguna versión se publica con errores
// (HANDOFF §11.1).
//
// Uso:
//   node scripts/validar-gtfs.mjs <carpeta-o-zip> [--fecha=AAAA-MM-DD]
//
// Sale con 0 si el validador no encuentra ningún aviso de severidad ERROR,
// y con 1 si encuentra alguno, si falta Java o si el validador no pudo correr.
// Las advertencias (WARNING / INFO) se listan, pero no hacen fallar.
//
// El validador es un archivo .jar de ~40 MB. No se sube al repositorio: se descarga
// una sola vez de la página oficial de versiones de MobilityData en GitHub a
// `.cache/` (ignorada por git) y se comprueba su huella SHA-256 antes de usarlo.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const VERSION = '8.0.1';
const SHA256 = '19293ddd9b6f954f216d4f12054bd8a3232921751c4484339e339764a91000e2';
const URL_JAR = `https://github.com/MobilityData/gtfs-validator/releases/download/v${VERSION}/gtfs-validator-${VERSION}-cli.jar`;

const raiz = new URL('..', import.meta.url).pathname;
const carpetaCache = join(raiz, '.cache', 'gtfs-validator');
const jar = join(carpetaCache, `gtfs-validator-${VERSION}-cli.jar`);

const args = process.argv.slice(2);
const entrada = args.find((a) => !a.startsWith('--'));
const fecha = args.find((a) => a.startsWith('--fecha='))?.slice(8);

function salir(mensaje) {
  console.error(`VALIDADOR GTFS: ${mensaje}`);
  process.exit(1);
}

if (!entrada) salir('falta la carpeta o el ZIP del feed. Uso: node scripts/validar-gtfs.mjs <carpeta-o-zip>');
if (!existsSync(entrada)) salir(`no existe ${entrada}`);
if (fecha && !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) salir(`fecha inválida «${fecha}» (debe ser AAAA-MM-DD)`);

// 1. Java (gratuito). Sin Java no hay validación: se falla y se dice cómo instalarlo.
// Se busca primero el «java» del sistema y después donde lo deja Homebrew en macOS,
// que no lo enlaza solo (así no hace falta teclear la contraseña para enlazarlo).
const CANDIDATOS_JAVA = ['java', '/opt/homebrew/opt/openjdk/bin/java', '/usr/local/opt/openjdk/bin/java'];
const javaBin = CANDIDATOS_JAVA.find((candidato) => {
  const r = spawnSync(candidato, ['-version'], { encoding: 'utf8' });
  return !r.error && r.status === 0;
});
if (!javaBin) {
  salir(
    'falta Java, que el validador necesita para correr. Instálalo gratis:\n' +
      '  macOS:  brew install openjdk\n' +
      '  Linux:  sudo apt install openjdk-21-jre-headless\n' +
      'y vuelve a correr npm run verificar.',
  );
}

// 2. El validador, descargado una vez y comprobado con su huella.
const huella = (ruta) => createHash('sha256').update(readFileSync(ruta)).digest('hex');

if (!existsSync(jar) || huella(jar) !== SHA256) {
  mkdirSync(carpetaCache, { recursive: true });
  console.log(`Descargando el validador de MobilityData v${VERSION} (una sola vez)…`);
  let respuesta;
  try {
    respuesta = await fetch(URL_JAR);
  } catch (e) {
    salir(`no se pudo descargar el validador (${e.message}). Revisa la conexión y vuelve a intentar.`);
  }
  if (!respuesta.ok) salir(`no se pudo descargar el validador: HTTP ${respuesta.status} en ${URL_JAR}`);
  // Se escribe a un archivo temporal y se renombra: dos validaciones al mismo tiempo
  // nunca leen un .jar a medio escribir.
  const temporal = `${jar}.${process.pid}.parcial`;
  writeFileSync(temporal, Buffer.from(await respuesta.arrayBuffer()));
  if (huella(temporal) !== SHA256) {
    rmSync(temporal, { force: true });
    salir('la huella SHA-256 del validador descargado no coincide con la esperada. No se usa.');
  }
  renameSync(temporal, jar);
}

// 3. Correr el validador. Escribe su reporte en una carpeta temporal.
const salida = mkdtempSync(join(tmpdir(), 'validar-gtfs-'));
try {
  const opciones = ['-jar', jar, '--skip_validator_update', '--country_code', 'mx', '--input', resolve(entrada), '--output_base', salida];
  if (fecha) opciones.push('--date', fecha);
  const r = spawnSync(javaBin, opciones, { encoding: 'utf8' });
  const reporte = join(salida, 'report.json');
  if (r.status !== 0 || !existsSync(reporte)) {
    salir(`el validador no pudo correr (código ${r.status}).\n${r.stderr || r.stdout}`);
  }

  // Errores del propio sistema (archivo ilegible, falla interna): también hacen fallar.
  const sistema = join(salida, 'system_errors.json');
  const erroresSistema = existsSync(sistema) ? JSON.parse(readFileSync(sistema, 'utf8')).notices ?? [] : [];

  const avisos = JSON.parse(readFileSync(reporte, 'utf8')).notices ?? [];
  const errores = avisos.filter((n) => n.severity === 'ERROR');
  const otros = avisos.filter((n) => n.severity !== 'ERROR');

  for (const n of otros) console.log(`  · ${n.severity} ${n.code} (${n.totalNotices})`);

  if (errores.length || erroresSistema.length) {
    console.error(`VALIDADOR GTFS: ${entrada} tiene errores`);
    for (const n of errores) {
      console.error(`  ✗ ERROR ${n.code} (${n.totalNotices})`);
      for (const ej of (n.sampleNotices ?? []).slice(0, 3)) console.error(`      ${JSON.stringify(ej)}`);
    }
    for (const n of erroresSistema) console.error(`  ✗ ERROR DEL SISTEMA ${n.code} (${n.totalNotices})`);
    process.exit(1);
  }
  console.log(`VALIDADOR GTFS: ${entrada} sin errores (MobilityData v${VERSION}; ${otros.length} tipo(s) de advertencia)`);
} finally {
  rmSync(salida, { recursive: true, force: true });
}
