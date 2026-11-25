import { chromium } from 'playwright';
const url='file:///Users/miguetdmz/Proyectos/SJDRbus-sjr/docs/maquetas/d66-gps/maqueta.html';
const b=await chromium.launch();
for (const [w,h] of [[390,844],[320,640],[1280,800]]){
  const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:2});
  const err=[];p.on('pageerror',e=>err.push(e.message));
  await p.goto(url);await p.waitForTimeout(300);
  const m=await p.evaluate(()=>({lado:document.documentElement.scrollWidth-innerWidth,cortados:[...document.querySelectorAll('.parada,.dist,.enfrente,.tres div,.si-b,.aqui,.cuenta div,.linea li,.toast,.barra,.metro')].filter(e=>e.scrollWidth>e.clientWidth+1).length}));
  console.log(w,JSON.stringify(m),err.length?'ERRORES '+err:'sin errores');
  if(w!==320) await p.screenshot({path:`docs/maquetas/d66-gps/capturas/flujo-${w}.jpg`,fullPage:true,type:'jpeg',quality:80});
}
await b.close();
