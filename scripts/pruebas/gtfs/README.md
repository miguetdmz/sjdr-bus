# Feeds GTFS de prueba

Solo sirven para comprobar que el validador de MobilityData funciona
(`scripts/pruebas/validar-gtfs.test.mjs`). **No son datos reales**: la agencia,
la ruta, los horarios y las paradas son de prueba. Las dos coordenadas son las
de Plaza Independencia y Pedregoso (HANDOFF §11.3), usadas solo para que el
feed caiga en San Juan del Río.

| Carpeta | Qué tiene | Resultado esperado |
|---|---|---|
| `feed-valido/` | Un feed mínimo completo | Pasa sin errores |
| `feed-con-error/` | El mismo feed, con un viaje que pasa por la parada `P-NO-EXISTE`, que no está en `stops.txt` | Falla con `foreign_key_violation` |
