# Relevo de turno (D-44)

Bandera entre estaciones, como la tarjeta kanban que dice cuándo pasa la pieza
a la siguiente. La lee el turno nocturno (¿puede arrancar?) y el inspector
(¿ya terminó el turno?). Solo cuenta la línea «Estado:».

Estados válidos:
- `Estado: EN SESIÓN` — Miguel trabaja; el turno no arranca.
- `Estado: ENTREGADO · AAAA-MM-DD HH:MM · para noche/AAAA-MM-DD` — la sesión
  del día cerró; el turno puede arrancar. La rama `noche/…` lleva la fecha de
  la hora de entrega + 6 horas (la mañana en que termina el turno).
- `Estado: TURNO TERMINADO · AAAA-MM-DD HH:MM · noche/AAAA-MM-DD` — el turno
  acabó con GitHub Actions en verde; el inspector puede revisar.

Horas en hora de México. La prueba `scripts/pruebas/relevo.test.mjs` revisa el
formato.

Estado: EN SESIÓN
