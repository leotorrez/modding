# Arreglando mods

Con el tiempo y las actualizaciones de los juegos, hay momentos en que los mods se rompen debido a actualizaciones de recursos y todo tipo de problemas técnicos. Por lo general, los creadores de herramientas convergerán para crear soluciones fáciles de usar que actualicen los mods a la versión actual del juego. Al menos para los elementos más populares del juego.

::: danger
No te apresures a descargar el primer archivo que encuentres en línea, los actores maliciosos tienden a aprovechar la situación y subir soluciones falsas que dañarán tu computadora. Siempre asegúrate de descargar de fuentes confiables.
:::

Aquí hay una lista de desarrolladores confiables que proporcionan soluciones para mods:

- [SilentNightSound](https://gamebanana.com/members/2176153)
- [Petrascyll](https://gamebanana.com/members/2644630)
- [Gustav0](https://gamebanana.com/members/2890460)
- [SpectrumQT](https://gamebanana.com/members/2837527) - Especializado en soluciones para WW
- [sora_](https://gamebanana.com/members/1367828) - Especializado en soluciones para HSR
- [Thoronium](https://gamebanana.com/members/3210319) - Especializado en soluciones "reversas" para servidores privados

## El método de mitades

Cuando tienes un problema y no sabes qué mod lo está causando, puedes usar el "método de mitades" para rastrear el mod problemático. Así es como funciona:

    1. Mueve la mitad de tus mods a una carpeta diferente
    2. Inicia el juego
    3. Si funciona, mueve la mitad de los mods restantes de vuelta
    4. Si no funciona, mueve la otra mitad de los mods de vuelta
    5. Repite hasta que encuentres el mod problemático

Matemáticamente hablando, este método es la forma más eficiente de encontrar un mod problemático (no más de 7 iteraciones).
A veces no hay mods que estén causando problemas y, en cambio, el conflicto es causado por algún archivo en `/ShaderFixes`. Si eliminar todos los mods de tu carpeta `/Mods` no soluciona el problema, entonces usar este método en `/ShaderFixes` es el camino a seguir.

## El mod no se carga en absoluto

Asegúrate de que 3dmigoto esté realmente funcionando y que hayas colocado el mod en la carpeta correcta de Mods. También asegúrate de presionar F10 en el juego para recargar cualquier mod cambiado. Finalmente, si todo lo demás falla, intenta vaciar tus carpetas ShaderCache y ShaderFixes, ya que a veces pueden causar problemas al cargar mods.

## Gran número de advertencias (texto naranja) sobre conflictos de mods

Esto es causado por el juego intentando cargar más de un archivo con el mismo hash. Esto generalmente es el resultado de usar dos mods para el mismo personaje al mismo tiempo.

Para solucionarlo, elimina cualquier carpeta de mod duplicada. Si estás seguro de que las has eliminado todas y las advertencias aún aparecen, entra en el archivo .ini que menciona la advertencia y elimina o comenta las líneas.

## El juego se bloquea cuando intento iniciarlo

Asegúrate de tener la última versión del lanzador, el juego y los mods instalados. Si todo lo demás falla, puedes intentar el "método de mitades" para rastrear el mod problemático. Una vez identificado, puedes diagnosticar su problema o pedir ayuda en el [canal de ayuda de mods del servidor de Discord](https://discord.com/channels/971945032552697897/995556765179596890), los usuarios más avanzados estarán encantados de echar una mano. Alternativamente, puedes simplemente deshacerte del mod y esperar a que se lance una actualización o solución.

## El mod se renderiza parcialmente o se colapsa sobre sí mismo

Debido a limitaciones técnicas cuando un mod se carga por primera vez, es mejor evitar tener el personaje en pantalla.

Este es un problema conocido y estamos trabajando en una solución más sofisticada.

Para solucionarlo, simplemente necesitas recargar tu personaje/objeto en la memoria, la forma más segura de lograr esto es reiniciar el juego. Alternativamente, puedes intentar ocultar el personaje/objeto en cuestión de la cámara y teletransportarte o cargar una nueva etapa. Debería liberar suficiente memoria para forzar la recarga de tu personaje/objeto.

## El mod se carga, pero no aparece en el juego / Errores al cargar el mod (texto amarillo)

A diferencia de las advertencias, los errores generalmente indican que el programa no ha podido cargar el mod. La causa puede variar, pero algunas comunes son:

- Nombres incorrectos (el nombre en el archivo .ini no coincide con el archivo en la carpeta, como una extensión diferente)
- Las texturas tienen el formato incorrecto (mira el original para ver qué formato, generalmente dds y deben tener alturas/anchos que sean potencias de 2 y tengan proporciones enteras como 1024x1024, 2048x2048, 1024x2048, etc.)
- No pintaste/transferiste ningún grupo de vértices en el nuevo modelo, cuando el modelo antiguo tenía grupos de vértices

## Los objetos se cargan con la orientación incorrecta

Esto se debe a que el objeto en blender importado por 3dmigoto y el que estás reemplazando están usando diferentes espacios de coordenadas. Incluso si parecen alinearse en blender, es posible que necesites rotar y trasladar en relación con el modelo de 3dmigoto para obtener la orientación correcta. Lo más común es rotar los modelos de personajes 90 grados para que estén mirando hacia arriba, luego seleccionar todo y aplicar todas las transformaciones.

Ejemplo de orientación correcta entre el original (Kazuha) y el nuevo (Noelle)

## El modelo está completamente FUBAR
  
Muy probablemente debido a problemas con los grupos de vértices. El número, orden y posiciones de los grupos de vértices deben coincidir entre el nuevo modelo y el antiguo. Confirma que todos los grupos de vértices están en el nuevo modelo, que están en el orden correcto (por ejemplo, 4 6 7 8 5 debería ser 4 5 6 7 8) y que no hay huecos (por ejemplo, 4 7 8 9 -> 4 5 6 7 8 9), si hay huecos, llénalos con nuevos grupos de vértices vacíos.

## El modelo está ligeramente FUBAR

Aún problemas con los grupos de vértices - verifica nuevamente lo anterior, así como asegúrate de que el peso para el nuevo modelo en esa sección coincida con el del modelo original

## Texturas incorrectas

Esto puede deberse a una gran variedad de razones. Las más comunes son:

- No nombrar el mapa uv como TEXCOORD.xy
- Normales invertidas
- ObjectTexcoord.buf dañado o incorrecto
- Olvidaste reemplazar las texturas con las nuevas, por lo que aún está cargando las antiguas del modelo original
- Texturas muy brillantes/resplandecientes

Esto es más probable debido a que el mapa de texturas que estás usando no tiene un canal alfa. Consulta las guías en este repositorio para obtener detalles, pero básicamente asegúrate de tener una capa transparente encima de cualquier archivo de textura (la capa superior se usa para controlar la emisión y hacer que las cosas brillen, la capa inferior se usa para dibujar los colores y patrones del modelo).

## Servidores privados y versiones del juego

Si estás usando un servidor privado, es probable que el mod que descargaste no se haya hecho para una versión antigua como la que estás usando. Por lo tanto, necesitarás "desarreglar"/degradar el mod a la versión en la que estás. Hay "soluciones reversas" que logran esto, pero no son tan comunes como las soluciones regulares. Puedes pedir ayuda en el [canal de ayuda de mods del servidor de Discord](https://discord.com/channels/971945032552697897/995556765179596890) para obtener detalles específicos.

## [GI] El mod se renderiza como un desorden de geometría

En la versión 4.1 se introdujo DCR (Resolución Dinámica de Personajes) y rompe la renderización de mods cuando está habilitado. Para solucionar el problema, simplemente desactívalo en la configuración gráfica de tu juego. Algunas actualizaciones de controladores de tarjetas de video o software como Nvidia Geforce Experience pueden forzarlo a habilitarse, así que asegúrate de verificarlo cada vez que veas que este problema ocurre.
![DCR](./img/dcr.png)

## [GI] La malla debería ser transparente pero aún es opaca

El método moderno para hacer una malla transparente consiste en usar una biblioteca llamada `TexFX`, que viene instalada por defecto con el lanzador XXMI. Si estás usando una instalación tradicional de 3dmigoto, es posible que necesites instalar `TexFX` manualmente. Para una guía actualizada sobre el tema [léelo aquí](https://gamebanana.com/mods/485763)

## [GI] El reflejo/contorno del personaje tiene el color incorrecto

Esto es causado por el pipeline de renderización del juego. Afortunadamente, hay una solución universal. Si estás usando el lanzador XXMI para modificar el juego, dicha solución viene instalada por defecto. Si estás usando 3dmigoto, puedes [descargar la solución desde aquí](https://github.com/leotorrez/LeoTools/blob/main/releases/ORFix.ini) y [leer más sobre ella aquí](https://github.com/leotorrez/LeoTools/blob/main/guides/ORFixGuide.md).
Después de la instalación, presiona F10 para recargar los mods.

## [GI] El personaje o su contorno está hundido en el suelo

Similar al último problema, esto se soluciona instalando algunos archivos necesarios en tu carpeta de 3dmigoto. Puedes [descargar la solución desde aquí](https://github.com/leotorrez/LeoTools/releases/tag/offset-scaleChangerV3). Para instalarlo, descomprime los archivos en tu carpeta de 3dmigoto y presiona F10 para recargar los mods.

## [HSR] Cuando mi personaje deja de correr, su modelo se rompe

<!-- TODO: Encontrar buenos recursos sobre esto xD -->

## [ZZZ] V-Sync activado retrasa la entrada del usuario hasta un segundo o más

Este es nuevo para mí y es el menos investigado de todos. Estaré investigando e intentando replicarlo, por el momento puedes intentar configurar los fps a 60 o desactivar vsync para superarlo.

## [ZZZ] Los modelos desaparecen cuando me alejo un poco de ellos

Eso es LOD activándose y no hay nada que las herramientas de modding puedan hacer para evitar que suceda. Lo que hace es cargar una versión de menor calidad del modelo y sus texturas a medida que te alejas. Para combatir esto, "podrías" obtener los hashes del modelo LOD y hacer un nuevo ini para tu mod para que también se aplique sobre ese modelo, sin embargo, este proceso es muy tedioso de hacer manualmente y tedioso de automatizar.

## [ZZZ] Las texturas/modelo del mod no se cargan

Los dispositivos con menos de 6GB de VRAM se ven obligados a usar texturas de 1K y los mods están diseñados para funcionar con texturas de 2K, por lo tanto, algunas texturas de mods se ven rotas. Los scripts de solución actuales parchean los mods para resolver este problema por ti, así como actualizarlos a la versión actual.

## [ZZZ] La cara de Jane Doe está rota

Este problema es causado por un conflicto con los mods de Lucy. Para solucionarlo, el autor del mod tendrá que actualizarlo para evitar dicho conflicto. Sin embargo, si te sientes cómodo editando archivos ini, puedes actualizarlo tú mismo.

Rastrea la anulación de textura `LucyHairPosition` en el archivo ini del mod. Debería verse algo así:
```ini
...

[TextureOverrideLucyHairPosition]
hash = ...
handling = skip
vb0 = ResourceLucyHairPosition
vb2 = ResourceLucyHairBlend
draw = 3079,0

...
```
Debes reemplazarlo por una anulación de textura `LucyHairBlend`, ten en cuenta que su hash se actualizará en el proceso a `5315f036`

```ini
...

[TextureOverrideLucyHairPosition]
hash = 5315f036
handling = skip
vb2 = ResourceLucyHairBlend
if DRAW_TYPE == 1
    vb0 = ResourceLucyHairPosition
    draw = 3079,0
endif

...
```
