#!/usr/bin/env python3
# D-53 (lección 3): arma, para cada pantalla, la captura de la maqueta aprobada y
# la de la app construida, lado a lado, para compararlas a simple vista.
# Uso: python3 scripts/comparar-capturas.py <carpeta-maqueta> <carpeta-app> <salida>
import sys
from pathlib import Path
from PIL import Image, ImageDraw

maqueta, app, salida = (Path(a) for a in sys.argv[1:4])
salida.mkdir(parents=True, exist_ok=True)
for m in sorted(maqueta.glob('*.jpg')):
    a = app / m.name
    if not a.exists():
        print(f'FALTA en la app: {m.name}')
        continue
    im, ia = Image.open(m), Image.open(a)
    alto = 60
    lienzo = Image.new('RGB', (im.width + ia.width + 40, max(im.height, ia.height) + alto), 'white')
    d = ImageDraw.Draw(lienzo)
    escala = 2 if im.width > 1000 or im.width == 780 else 1
    d.text((10, 10), 'MAQUETA APROBADA', fill=(13, 122, 114), font_size=22 * escala // 2 + 10)
    d.text((im.width + 50, 10), 'APP CONSTRUIDA', fill=(168, 67, 42), font_size=22 * escala // 2 + 10)
    lienzo.paste(im, (0, alto))
    lienzo.paste(ia, (im.width + 40, alto))
    # A la mitad: las dos capturas vienen al doble de resolución y el
    # repositorio no necesita la copia a tamaño completo (están al lado).
    lienzo = lienzo.resize((lienzo.width // 2, lienzo.height // 2), Image.LANCZOS)
    lienzo.save(salida / m.name, quality=78)
    print(f'ok {m.name}')
