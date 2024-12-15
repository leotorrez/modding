# Tutorial de Modificación de Texturas de 3DMigoto GIMI

> Escrito por: [SilentNightSound](https://github.com/SilentNightSound)

Este tutorial cubrirá el proceso de modificación de las texturas de GI.

Esto es útil si deseas cambiar elementos de la interfaz de usuario o banners (ya que muchos íconos se dibujan usando el mismo vb/ib, lo que significa que los plugins de GIMI no se pueden usar para crear mods) o simplemente deseas cambiar una textura sin hacer un mod completo (por ejemplo, cambiar el color de un objeto o arma sin cambiar la forma).

Este tutorial recorrerá dos ejemplos de modificación de texturas: modificar un banner de deseos y modificar un planeador de personaje. Modificar texturas es un poco más difícil que hacer ediciones básicas de mallas, pero mucho más fácil que importar modelos personalizados.

## Requisitos Previos

Tener instalada la versión de desarrollo de 3dmigoto GIMI y configurar paint.net o photoshop para poder abrir archivos dds (ver el tutorial de Mona Hat para más detalles).

También recomiendo encarecidamente no tener mods activos en Mods y no tener shaders en ShaderFixes, ya que a veces pueden interferir con el proceso.

## Nota Importante

Por defecto, la versión de desarrollo de 3dmigoto está configurada para volcar TODAS las texturas y buffers cada vez que presionas F8, causado por esta línea en el d3dx.ini:

![image](https://user-images.githubusercontent.com/107697535/208988377-e4708ee9-ffed-4d33-a077-698332afae3f.png)

Esto a menudo resultará en volcados de cuadros masivos (5-10 GB+): recomiendo encarecidamente comentar esta línea así:

![image](https://user-images.githubusercontent.com/107697535/208988409-3af15c43-b33c-475e-95b4-ae4577320c73.png)

Y en su lugar usar secciones [ShaderOverride] para especificar lo que estás buscando al hacer volcados de cuadros. Sin embargo, si el espacio y el tiempo no son un problema, o no puedes encontrar el shader que corresponde al objeto que estás buscando, descomentar esto y hacer un volcado completo también funcionará.

## Banner de Deseos

1. El primer paso en la modificación de texturas es buscar la textura y su hash en el juego. Asegúrate de estar usando la versión de desarrollo y tener el texto verde en la parte superior e inferior, luego ve a la pantalla de deseos:

 <img src="https://user-images.githubusercontent.com/107697535/208988430-bd1f834b-1aa4-442e-8887-d455308fb6e6.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

2. Presionamos 1 y 2 en el teclado numérico para recorrer los PS (shaders de píxeles): estamos buscando los shaders que hacen que las texturas del banner desaparezcan. Una vez que los hayas encontrado, presiona 3 en el teclado numérico para copiar el hash.

    En este caso, los hashes que estamos buscando son: `000d2ce199e12697` (que dibuja los personajes en el banner, el fondo del banner, los íconos en la parte superior, la barra de desplazamiento y parte del texto)

 <img src="https://user-images.githubusercontent.com/107697535/208988464-cd5d8ebf-bc97-4dbe-a3e4-7cc346b285a1.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

    Y `dcf5ad8be031c5fc` (que dibuja los fondos de las cartas, íconos y el texto restante)

 <img src="https://user-images.githubusercontent.com/107697535/208988482-9318495e-d89e-4f88-81b4-44977e44ec98.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

    Estos son los hashes para la versión 3.2 de GI: aunque es raro, a veces los hashes de los shaders pueden cambiar entre versiones.

3. Una vez que tengamos estos hashes, crea un archivo Banner.ini (puede ser cualquier nombre siempre que la extensión sea .ini) en algún lugar de la carpeta Mods con el siguiente texto:

    ```ini
    [ShaderOverrideBanner1]
    hash = 000d2ce199e12697
    analyse_options = dump_rt dump_tex dump_cb dump_vb dump_ib buf txt dds

    [ShaderOverrideBanner2]
    hash = dcf5ad8be031c5fc
    analyse_options = dump_rt dump_tex dump_cb dump_vb dump_ib buf txt dds
    ```

4. Presiona F10 en el juego para recargar los cambios. Lo que hará el archivo .ini que acabamos de crear es decirle a 3dmigoto qué archivos volcar durante un análisis de cuadros: si no pudiste encontrar los hashes de los shaders (porque la textura solo está en pantalla por un segundo, por ejemplo), hacer un volcado completo descomentando la línea en d3dx.ini es una alternativa.

5. Ahora, mientras permaneces en la pantalla de deseos, presiona F8: esto realiza un volcado de análisis de cuadros, que vuelca todos los buffers y texturas en la carpeta 3dmigoto, una que se llama algo así como FrameAnalysis-YYYY-MM-DD-HHMMSS.

 <img src="https://user-images.githubusercontent.com/107697535/208988606-6416661b-8ae6-4e46-9c1c-1a331a7c985e.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

 <img src="https://user-images.githubusercontent.com/107697535/208988677-94251b3d-8b18-4ca1-8ab3-9618c6f8487e.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

    Si la carpeta está vacía o solo contiene un log.txt y ShaderUsage.txt, asegúrate de haber creado y guardado el .ini en la ubicación correcta, haber presionado F10 para recargar y estar en la pantalla con la textura que estás buscando.

6. Una vez que tengamos la carpeta, podemos buscar en ella las texturas que necesitamos. Puedes buscar en la carpeta principal que tiene los archivos ordenados por ID de dibujo (la cadena de 6 dígitos al principio de los nombres de archivo que representa el orden en que se dibujan las texturas), o en la carpeta deduplicada que contiene todos los archivos pero sin duplicados.

    CONSEJO: Puede ser útil tener tu software de edición de dds configurado como predeterminado para abrir archivos .dds, ya que te permitirá ver vistas previas en el explorador de Windows.

7. Después de un poco de búsqueda, podemos encontrar las texturas que estamos buscando:

    Fondo de la carta (los nombres de archivo eran `000059-ps-t0=93073271-vs=8236b1752acd9b01-ps=dcf5ad8be031c5fc.dds` en la carpeta principal y `93073271-BC7_UNORM.dds` en deduplicados: el ID de dibujo puede ser diferente para ti):

 <img src="https://user-images.githubusercontent.com/107697535/208988828-9933ff3b-4137-4dc7-afb3-5e8821790be3.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

    Nahida (`000067-ps-t0=70a940c8-vs=28a248a16fa16289-ps=000d2ce199e12697.dds`, `70a940c8-BC7_UNORM.dds`):

 <img src="https://user-images.githubusercontent.com/107697535/208988902-3456044f-243c-43fc-a70d-307189a8cd42.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

    Los personajes secundarios (`000069-ps-t0=ad520043-vs=28a248a16fa16289-ps=000d2ce199e12697.dds`, `ad520043-BC7_UNORM.dds`)

 <img src="https://user-images.githubusercontent.com/107697535/208989027-5ac89c6b-e786-4e30-9f62-9d1962477a4c.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

    Consejo: los archivos o0 muestran lo que se está dibujando en ese ID, por lo que puedes usarlos para reducir tu búsqueda.

    Hay un par de otras texturas relacionadas también, pero por ahora nos centraremos en estas tres. También ten en cuenta que cambiar el texto usando 3dmigoto es muy difícil a menos que ese texto sea un ícono (lo cual no es el caso aquí).

8. Ahora que tenemos las texturas, podemos obtener sus hashes de sus nombres de archivo.

9. Para los archivos en la carpeta principal, la estructura es DrawID–BufferType–Hash–ShaderType-ShaderHash.Extension: por ejemplo, la carta es `000059-ps-t0=93073271-vs=8236b1752acd9b01-ps=dcf5ad8be031c5fc.dds`, lo que significa que tiene un DrawID de `000059`, es un buffer `ps-t0`, tiene un hash de `93073271` y es usado por el shader de vértices `8236b1752acd9b01` y el shader de píxeles `dcf5ad8be031c5fc`.

    Para los archivos en deduplicados, la estructura es Hash – FileType. Para la carta, el nombre es `93073271-BC7_UNORM.dds`, que es un hash de `93073271` y un tipo de `BC7_UNORM`.

    La información más importante es el hash y el tipo, ya que eso es lo que usaremos: así que en este caso es `93073271` y `BC7_UNORM` para la carta, `70a940c8` y `BC7_UNORM` para Nahida y `ad520043` y `BC7_UNORM` para los personajes de 4 estrellas.

10. Agrega las siguientes líneas al Banner.ini:

    ```ini
    [TextureOverrideDendroBannerCard]
    hash = 93073271
    this = ResourceDendroBannerCard

    [TextureOverrideBannerNahidaBanner]
    hash = 70a940c8
    this = ResourceNahidaBanner

    [TextureOverrideNahida4StarBanner]
    hash = ad520043
    this = ResourceNahida4StarBanner

    [ResourceDendroBannerCard]
    filename = DendroBannerCard.dds

    [ResourceNahidaBanner]
    filename = NahidaBanner.dds

    [ResourceNahida4StarBanner]
    filename = Nahida4StarBanner.dds
    ```

    Lo que estas líneas le dicen al programa es que cada vez que vea el hash de la textura en el juego, lo reemplaza con una nueva textura (`DendroBannerCard.dds`, `NahidaBanner.dds` y `Nahida4StarBanner.dds` respectivamente).

11. Ahora, vamos a crear esas texturas y agregarlas a la misma carpeta que el Banner.ini. Ten en cuenta que las 3 texturas tienen `BC7_UNORM` como su tipo, lo que corresponde a `BC7 Linear`.

    Para el banner, le daré un recolor y lo guardaré como `DendroBannerCard.dds` (detalles sobre cómo abrir y guardar archivos dds en el tutorial de [Eliminación del Sombrero de Mona](./mona-hat.md)).

 <img src="https://user-images.githubusercontent.com/107697535/208989556-0a5b60a1-1396-4b38-94a9-35eec74bdeea.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

    Para Nahida, reemplazaré la textura con un gato de ojo de jade: para obtener el tamaño correcto, me aseguro de comparar con el original (tiene un tamaño de 2048x1024 y el original se almacena al revés).

 <img src="https://user-images.githubusercontent.com/107697535/208989714-21590248-c57b-4ad6-b96d-486c9b9a7e28.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

Finalmente, para los personajes de 4 estrellas agregaré la verdadera estrella del banner (ten en cuenta que esta textura tiene un tamaño extraño de 560x512).

 <img src="https://user-images.githubusercontent.com/107697535/208989791-4e88703f-df9c-4613-af78-c616c636d5b4.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

12. Poner esos 3 archivos en la misma carpeta que el .ini y presionar F10 en el juego da como resultado lo siguiente:

 <img src="https://user-images.githubusercontent.com/107697535/208989860-3d563399-708c-4976-9f18-cf16cf952904.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

¡Éxito! Primer mod de textura completado.

(Si no pasó nada después de presionar F10, asegúrate de haber puesto el texto en el .ini, las nuevas imágenes dds con los nombres correctos en la misma carpeta que el .ini y que no aparecieron mensajes de error en la pantalla).

(Otra posibilidad es que el juego no esté verificando las texturas en ese shader específico por alguna razón: intenta vaciar la carpeta ShaderFixes y agregar la línea `checktextureoverride = ps-tx` donde `ps-tx` es el buffer original de la textura (en este caso, `ps-t0`) a las secciones ShaderOverride para forzar a 3dmigoto a verificar las texturas en ese shader).

## Planeadores

Para otra demostración, vamos a reemplazar las texturas en los planeadores de alas. A diferencia de los elementos de la interfaz de usuario, los planeadores sí tienen un modelo (aunque parece un rectángulo plano), por lo que podemos usar las herramientas de GIMI para hacer mods, pero cada planeador comparte la misma malla. Si queremos modificar solo un planeador, necesitamos ser más precisos en lo que estamos reemplazando.

1. Similar a antes, encuentra el hash del PS que dibuja las alas. Podemos pausar mientras planeamos en el mundo abierto y recorrerlos con 1/2 en el teclado numérico como antes.

    <img src="https://user-images.githubusercontent.com/107697535/208989996-ee0dc0bc-dde2-473d-b1da-ea09f5c7e026.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

    En este caso, el hash es `f8143fa00dc241fe` (ten en cuenta que hay otros shaders que hacen que las alas desaparezcan junto con partes del entorno, pero queremos buscar el que sea más único para las alas).

    <img src="https://user-images.githubusercontent.com/107697535/208990044-a43aa6e3-6f96-4fbc-b2b8-b3df0a08d9bc.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

2. Ponemos las siguientes líneas en un archivo ini (por ejemplo, wings.ini) en la carpeta Mod:

    ```ini
    [ShaderOverrideGlider]
    hash = f8143fa00dc241fe
    analyse_options = dump_rt dump_tex dump_cb dump_vb dump_ib buf txt dds
    ```

3. Y presionamos F10 para recargar, seguido de F8 para realizar el volcado de cuadros.

4. Buscando en los archivos, podemos encontrar las alas (`000081-ps-t0=d27db883-vs=7494a6d4010b8dec-ps=f8143fa00dc241fe.dd` o `d27db883-BC7_UNORM_SRGB.dds`).

    <img src="https://user-images.githubusercontent.com/107697535/208990131-64b4dcc4-f29e-4664-a1a3-22259950bd12.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

5. Y reemplazarlas con otra cosa (NOTA: podemos ver por el nombre del archivo que el tipo es `BC7_UNORM_SRGB` ahora, lo que significa que estas se almacenan como BC7 SRGB en lugar de Lineal).

    <img src="https://user-images.githubusercontent.com/107697535/208990242-7ebdb294-3ba2-43bd-b1a3-3c4a0c8f0882.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

6. Creamos las anulaciones de texturas y recursos así en un .ini:

    ```ini
    [ShaderOverrideGlider]
    hash = f8143fa00dc241fe
    analyse_options = dump_rt dump_tex dump_cb dump_vb dump_ib buf txt dds

    [TextureOverrideFirstFlight]
    hash = d27db883
    this = ResourceFirstFlight

    [ResourceFirstFlight]
    filename = WingsOfFirstFlight.dds
    ```

7. Y presionamos F10 para recargar en el juego:

<img src="https://user-images.githubusercontent.com/107697535/208990331-8ee8125d-0dcb-4a46-87eb-fd3b9c4acfaa.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

<img src="https://user-images.githubusercontent.com/107697535/208990373-9c143e72-06c6-4592-93f6-13322a6df22e.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">
