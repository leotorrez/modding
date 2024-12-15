# Tutorial de Efectos y Shaders de 3DMigoto GIMI

> Escrito por: [SilentNightSound](https://github.com/SilentNightSound)

Este tutorial cubrirá el proceso de cambiar los efectos de Genshin, como los efectos de habilidades, efectos de iluminación y cualquier objeto en el juego que no esté controlado a través de texturas o buffers. Aprender cómo funcionan los shaders aumentará significativamente el rango de lo que puedes modificar.

Este tutorial de modificación de efectos es más difícil que mis anteriores sobre edición/importación básica de mallas y edición de texturas, pero leer esos no es un requisito previo para entender este tutorial.

He organizado este tutorial aproximadamente en orden de dificultad creciente, por lo que incluso leer la primera sección debería ser suficiente para hacer ediciones simples. Las secciones posteriores requerirán conocimientos básicos de programación.

Voy a recorrer tres ejemplos de complejidad creciente:

- Cambiar el color del ataque/habilidad de un personaje (ver <https://gamebanana.com/mods/409181> para un ejemplo de recolorear los ataques de hielo de Ganyu)
- Crear un efecto que cambia entre múltiples colores con el tiempo (ver <https://gamebanana.com/mods/418434> para un ejemplo de un árbol de Navidad que cambia el color de las luces)
- Demostrar cómo crear animaciones de efectos básicas (ver <https://gamebanana.com/mods/420434> para un ejemplo de líneas animadas en el traje cibernético de Raiden)

## Requisitos Previos

Tener instalada la versión de desarrollo de 3dmigoto GIMI (el texto verde debe ser visible).

## Nota Importante

Por defecto, he deshabilitado la capacidad de GIMI para volcar shaders ya que pueden interferir con los mods. Puedes reactivarlos asegurándote de que la línea `marking_actions` en d3dx.ini contenga `hlsl` y `asm` en la lista.

<img src="https://user-images.githubusercontent.com/107697535/211983955-7a13e1a0-542e-435f-ab67-aa5e78031bd7.PNG"  style="display:block;float:none;margin-left:auto;margin-right:auto">

Además, si tienes problemas con los mods después de probar cosas en este tutorial, intenta vaciar la carpeta ShaderFixes; a veces, un shader volcado puede causar que ciertos mods funcionen mal.

¡Comencemos!

## Cambiar los Colores de Ataque de un Personaje (Llamas de Diluc)

Para la primera sección, demostraré cómo recolorear las llamas de Diluc. Esta sección es de dificultad básica/intermedia y no requiere conocimientos previos de codificación/shaders.

1. Primero, recomiendo viajar a un lugar donde haya la menor cantidad de objetos en pantalla posible, pero el efecto que estás buscando aún se mostrará. Verás por qué en breve, pero cuantos más objetos haya en pantalla, más tiempo llevará buscar los shaders que estamos buscando. El área de la playa inicial siempre es una buena opción.

    <img src="https://user-images.githubusercontent.com/107697535/211985874-1e3a43e6-bb5e-48e1-9b8c-c99a199595a0.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

2. Una vez que tengas una buena ubicación, activa el efecto que estás buscando y entra en el menú de pausa. En este caso, estamos interesados en el efecto de llama de la habilidad de Diluc, así que presionamos e y luego pausamos (nota: para efectos que solo aparecen cuando el juego no está en pausa, aún es posible obtenerlos, solo un poco más difícil; explicaré cómo más adelante).

  <img src="https://user-images.githubusercontent.com/107697535/211986006-20e3e92b-29c4-4f3e-8808-bf151fb72e97.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

3. Ahora, vamos a presionar `1` y `2` en el teclado numérico para recorrer los Pixel Shaders (`PS`). Hay dos tipos de shaders: Vertex Shaders (`VS`) que controlan dónde se dibujan las cosas en pantalla y Pixel Shaders (`PS`) que deciden cómo se ven y dibujan texturas/colores. Como estamos interesados en el color, queremos el PS.

4. Cuando encuentres el `PS` correcto, el efecto desaparecerá en el juego. Por ejemplo, aquí está el shader que controla la llama central del golpe:

  <img src="https://user-images.githubusercontent.com/107697535/211986075-16734f42-e46b-46ab-a46f-b2a8ac8c0821.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

  Mientras que este controla las nubes de llamas circundantes:

  <img src="https://user-images.githubusercontent.com/107697535/211986124-523e0fe5-f134-4fcd-b8ad-588bcf158f06.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

  Comenzaremos con estos dos.

5. Presionar `3` en el teclado numérico copiará el hash del PS en tu portapapeles y guardará el shader en la carpeta ShaderFixes. Los hashes de los dos shaders anteriores son `e75b3ffb93a1d268` y `dd0757868249aaa5` (Nota: puedes presionar `+` en el teclado numérico para restablecer los buffers a 0 si necesitas volver rápidamente al punto de partida). Ten en cuenta que los hashes de los shaders pueden cambiar entre versiones, por lo que tus hashes pueden no ser los mismos valores.

6. Los shaders ahora deberían aparecer en ShaderFixes con un nombre como `hash-ps_replace.txt`.

  <img src="https://user-images.githubusercontent.com/107697535/211986246-48a6ccdb-e779-4e13-8b1e-ce02bcb1b044.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

  Si no aparecen después de presionar `3` en el teclado numérico, asegúrate de haber puesto `hlsl` y `asm` en `marking_actions` como se mencionó en la Nota Importante al principio y haber actualizado con `F10`.

  También ten en cuenta que un pequeño número de shaders no se descompilarán correctamente en `hlsl` (lenguaje de alto nivel de shaders) y, en su lugar, volverán a `asm` (ensamblador). Estos shaders seguirán funcionando, pero serán más difíciles de editar. No cubriré asm en este tutorial, pero los conceptos son los mismos: la sintaxis de los shaders es simplemente más difícil de leer.

7. Ábrelos con tu editor de texto preferido (Notepad/Notepad++/Sublime Text/lo que sea). El archivo parecerá intimidante al principio, pero no te preocupes: no necesitas entender los detalles para hacer cambios básicos (entraré más en detalles sobre cómo funciona este archivo en las secciones posteriores).

  <img src="https://user-images.githubusercontent.com/107697535/211986377-e2fd3418-f673-4cf8-9ff1-938faf945c76.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

8. Por ahora, estamos más interesados en jugar con las entradas y salidas. Estas se enumeran justo debajo de main: este archivo toma 9 entradas (numeradas `v0`, `v1`, `v2`,…`v8`) y tiene una salida (`o0`).

  <img src="https://user-images.githubusercontent.com/107697535/211986455-0a5ca895-c3a7-4066-a59f-be71fe2634e6.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

9. Por lo general, es más simple comenzar con la salida. Tiene un tipo de `float4`, lo que significa que tiene un componente `x`, `y`, `z` y `w` y toma un número de punto flotante (es decir, decimal) como entrada. Podemos experimentar para ver qué hace poniendo una línea al final del código para establecer el valor en una constante:

  <img src="https://user-images.githubusercontent.com/107697535/211986560-b25728ae-e24a-4fe1-929e-0d49bf02dadf.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

  (`//` y `/* */` indican comentarios en el código y son ignorados por el programa. 3dmigoto también exporta el código `asm` debajo del código `hlsl`: cuando digo el “final”, me refiero justo antes del `return`, no después. Todo lo que esté después de ese punto está comentado y no se ejecutará por defecto. Si ves cosas como `div`, `mul` y `mov`, has ido demasiado lejos).

  Básicamente, lo que estamos haciendo es sobrescribir lo que el juego está calculando para el valor y sustituyéndolo por el nuestro.

10. Guarda el archivo y luego presiona `F10` en el juego para recargar (¡asegúrate de también presionar `+` para restablecer los buffers!). 3dmigoto cargará automáticamente el shader desde la carpeta ShaderFixes. Esto es lo que sucede:

  <img src="https://user-images.githubusercontent.com/107697535/211986773-ee66b8c6-2d80-44fc-b1cf-fa8e41f4f9db.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

  La línea central se ha vuelto negra, mientras que las chispas se han vuelto verdes. Si estás familiarizado con cómo se almacenan los colores, podrías tener una idea de lo que representa `o0.x`, pero podemos seguir comprobando para estar seguros:

  Estableciendo los componentes `x` y `z` en 0 y `y` en 1:

  <img src="https://user-images.githubusercontent.com/107697535/211986865-67fb5c91-3c25-4df7-8821-c5b11c3531fa.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

  Establece todo en verde:

  <img src="https://user-images.githubusercontent.com/107697535/211986940-01ebfc18-ef72-4c60-b7e2-91985bf9c2b1.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

  Mientras que establecer `x` y `y` en 0 y `z` en 1

  <img src="https://user-images.githubusercontent.com/107697535/211986994-c3070f3f-9eb5-480a-b8ed-13ab90076c80.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

  Establece el color en azul:

  <img src="https://user-images.githubusercontent.com/107697535/211987033-f9a1b299-9676-4687-9ae9-808db2b84b3d.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

  O en otras palabras, `o0.xyz` corresponde a los colores RGB del efecto. No siempre es el caso que `o0` sea el color: algunos shaders tienen múltiples salidas, por lo que el color podría estar en `o1` o `o2`, etc.; afortunadamente, este shader es bastante simple y solo tiene una salida `o0`.

  (Si te preguntas qué representa `w`, parece estar relacionado con la amplitud/emisión del efecto:)

  <img src="https://user-images.githubusercontent.com/107697535/211987161-edd09e67-99e8-42ff-9653-9aafadda4531.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

11. Ahora que sabemos a qué corresponden los valores, podemos hacer cambios básicos en los colores. Por ejemplo, establecer los tres `o0.xyz` en 0 hace que las llamas de Diluc se vuelvan negras:

  <img src="https://user-images.githubusercontent.com/107697535/211987214-bc9c7a29-1bf0-483d-bb9d-7cba39afd1da.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

  <img src="https://user-images.githubusercontent.com/107697535/211987253-b4480e4e-b3f3-4726-b66d-cb8e5c698815.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

  O podemos convertirlas en púrpura estableciendo `r` y `b` en 1 y dejando `g` en 0:

  <img src="https://user-images.githubusercontent.com/107697535/211987317-f0237be8-da62-43d1-8d0f-7f6447872f09.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

  Y ten en cuenta que no estamos limitados a solo establecer constantes: también podemos cambiar el tono del color. Esto reduce la cantidad de rojo en los ataques mientras da más verde y mucho más azul para crear un color rosa salmón:

  <img src="https://user-images.githubusercontent.com/107697535/211987374-be4661b0-46aa-4829-82c0-2274175a8b6e.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

  <img src="https://user-images.githubusercontent.com/107697535/211987415-bf5057ee-1c20-4e19-8195-0c3ace4fd26f.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

  Ten en cuenta que, a diferencia de los casos en los que establecemos un valor constante, la textura de la llama aún es visible aquí.

  Incluso podemos hacer cosas más elegantes como establecer los valores en expresiones matemáticas, pero lo cubriré en la sección final.

  En lugar de cambiar la salida, también es posible cambiar los efectos cambiando la entrada usando un método similar (poniendo las líneas justo después de cuando se cargan normalmente y sobrescribiendo los valores del juego), aunque necesitarás experimentar para deducir qué variable cambia qué.

12. Este es el proceso básico para cambiar los colores de los efectos: encontrar el hash, volcarlo y luego modificar la entrada o la salida. Sin embargo, si has estado siguiendo, es posible que hayas notado que no todas las texturas de llamas han sido reemplazadas: aún hay más que necesitamos volcar:

  `0fa220b5adced192` son las chispas:

  <img src="https://user-images.githubusercontent.com/107697535/211987510-3d411b42-0e3a-4d69-8081-e8b2ebf8707f.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

  `bf7eb60b256538c7` son las llamas a lo largo de la espada:

  <img src="https://user-images.githubusercontent.com/107697535/211987559-c100eec0-4a7f-4039-8873-bfb3b2d9308e.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

  `439c03865c4ce77e` es el pájaro:

  <img src="https://user-images.githubusercontent.com/107697535/211987610-6a3362cf-bcb9-4d9f-b1a7-a47feb245bc4.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

  `7690cf4aa6647c6c` es el resplandor de la espada durante el ult:

  <img src="https://user-images.githubusercontent.com/107697535/211987673-309f0467-ba0f-40ae-94cc-256912c056c0.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

  Recopilar todos los diferentes shaders es lo que lleva la mayor parte del tiempo al editar efectos.

13. Incluso volviendo todas las anteriores negras, es posible que hayas notado que aún hay efectos de llamas que aparecen durante el ult donde no podemos pausar el juego:

  <img src="https://user-images.githubusercontent.com/107697535/211987723-01d3c4ba-f86d-4139-a0d2-468af27e8229.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

  Obtener estos shaders es más molesto, pero no imposible. El primer método es habilitar algo como energía infinita de ráfaga en grasscutter y lanzar el ult una y otra vez mientras recorres. Esto tomará algo de tiempo, pero debería funcionar para cualquier cosa que sea repetible.

  (ACTUALIZACIÓN: He recibido recomendaciones de dos formas más de obtener información de shaders de ráfagas: una es pararse en agua poco profunda o con la espalda contra una pared para desactivar la cámara de ráfaga. Esto te permitirá pausar normalmente durante las ráfagas y darte tiempo para recorrer los hashes:

  <img src="https://user-images.githubusercontent.com/107697535/212235277-b8d9de11-78d7-4f97-8c09-dc220be72980.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

  La segunda es usar un software de trampas como Akebi para reducir la velocidad del juego a menos de 1, lo que te permite ver los efectos en cámara lenta. Ten en cuenta que usar software de trampas puede resultar en prohibiciones si se usa en servidores oficiales, por lo que recomiendo usar solo servidores privados si decides usar este método.

  ¡Muchas gracias a ComplexSignal31#5778 y NK#1321 por las recomendaciones!)

  Para efectos que solo aparecen en escenas de corte o son difíciles de reproducir, sin embargo, el método más rápido es hacer un volcado de fotogramas. Consulta el tutorial de modificación de texturas para obtener más detalles sobre cómo realizar volcados de fotogramas, pero esencialmente presionas `F8` mientras el efecto está en pantalla para realizar el volcado al mismo tiempo que el efecto es visible.

  Desafortunadamente, como no conocemos el hash del shader, tendrá que ser un volcado completo, así que asegúrate de tener 5-10GB de espacio libre y la menor cantidad de objetos en pantalla posible.

  <img src="https://user-images.githubusercontent.com/107697535/211987810-78fc6d7f-1f98-4474-8e59-86d155378fda.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

  Cuando tengas la carpeta de análisis de fotogramas que se crea después de presionar `F8`, puedes revisarla para ver cuándo se dibuja el efecto. Los archivos `o0` y `o1` muestran lo que se está dibujando en cada ID y son muy útiles para aislar el ID exacto en el que se dibuja un efecto en pantalla.

  Ejemplo: `000351-o0=3315d2b5-vs=eb65cb4eba57132b-ps=7690cf4aa6647c6c.dds` se ve así en mi volcado de fotogramas:

  <img src="https://user-images.githubusercontent.com/107697535/211987902-faaa47f5-db4e-42b6-96c4-ea3629da0480.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

  Mientras que `000352-o0=3315d2b5-vs=f6a1f24f9c9b28c2-ps=a69e25f25a6c8e04.dds` se ve así:

  <img src="https://user-images.githubusercontent.com/107697535/211987954-5e042475-bddd-4168-a834-0cfb55578c49.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

  Así que sabemos que en este fotograma, la llamada de dibujo `000352` es responsable del efecto de resplandor en el suelo. También podemos obtener el hash del nombre del archivo, `ps=a69e25f25a6c8e04`.

  Usando este método, podemos encontrar los hashes restantes:

  `000353-o0=3315d2b5-vs=f50ce30bb0caf55c-ps=4d4da8a4cbe1149a.dds`

  <img src="https://user-images.githubusercontent.com/107697535/211988024-d44e4331-8232-43d7-b536-9784b0fb6ee4.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

  Y `000365-o0=3315d2b5-vs=72ce1e39ede0982f-ps=622a52d3edcf0363.dds`

  <img src="https://user-images.githubusercontent.com/107697535/211988083-9efb97a2-9d6d-48fc-8faa-878dc85f48c7.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

14. Ahora que tenemos los hashes restantes, necesitamos volcarlos. Presiona `+` en el teclado numérico para restablecer los buffers, lanza el ult y luego comienza a recorrer con `1`/`2` en el teclado numérico mientras el efecto está en pantalla. Aunque el efecto haya desaparecido de la pantalla para cuando lleguemos al hash, siempre que hayamos comenzado a recorrer cuando el efecto estaba en pantalla, aparecerá en la lista y estará disponible para volcar:

  Ejemplo de PS `4d4da8a4cbe1149a` apareciendo aunque el ult no esté activo:

  <img src="https://user-images.githubusercontent.com/107697535/211988198-9a6ddd0e-e55b-4783-8602-d21bca4d61c0.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

  Usando esta técnica, podemos volcar los shaders restantes `a69e25f25a6c8e04`, `4d4da8a4cbe1149a` y `622a52d3edcf0363`:

  <img src="https://user-images.githubusercontent.com/107697535/211988253-5f67709e-62b5-4a17-ad21-3dd99de90bd3.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

15. ¡Modificación completa! O…tal vez no. Si cambias a otro personaje pyro como Hu Tao, es posible que notes un problema:

  <img src="https://user-images.githubusercontent.com/107697535/211988307-de6a26dd-a26a-45ea-a760-4c694ed82dca.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

  Hemos establecido TODAS las llamas en negro, no solo las de Diluc. Además, si alguien más creó un mod que cambió las llamas de otro personaje como Hu Tao o Klee, también se superpondría con el de Diluc.

16. Queremos una forma de limitar el efecto para que solo aparezca cuando Diluc esté en el campo. Hay un par de formas de hacer esto, pero todas siguen el mismo principio básico: identificamos alguna condición que se produce siempre que Diluc esté en el campo y solo aplicamos los efectos si esa condición es verdadera.

Este es un tema algo más avanzado que tendrá más sentido después de que juegues con los shaders y leas las secciones posteriores; si tienes problemas para entender esto, intenta leer las siguientes secciones y volver más tarde.

Primero, necesitamos identificar un hash que sea único para Diluc. Para simplificar, voy a usar el hash `VB` de Diluc `56159d74` (`VB` se puede recorrer con `/` y `*` en el teclado numérico y copiar con `-` en el teclado numérico):

  <img src="https://user-images.githubusercontent.com/107697535/211988418-a6af34f5-b9dc-4446-aa84-44ddf93a435c.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

17. A continuación, construimos un `.ini` que usaremos para aplicar selectivamente los efectos. Definimos una variable llamada `$ActiveCharacter` y la establecemos en 0 al comienzo de cada fotograma (`[Present]` se ejecuta una vez por fotograma al inicio). Solo establecemos el valor en 1 siempre que Diluc esté en el campo, indicado por el hash `VB` coincidente:

```
[Constants]
global $ActiveCharacter

[Present]
post $ActiveCharacter = 0

[TextureOverrideDilucVB]
hash = 56159d74
match_priority = 1
$ActiveCharacter = 1
```
La `match_priority` aquí es solo para asegurar que este efecto no interfiera con ningún mod de Diluc cargado; si estás agregando este efecto como parte de un mod y no por separado, no necesitarás incluirlo.

18. Ahora, hay dos formas de aislar el shader. La más fácil de las dos es simplemente definir un shader personalizado y realizar el reemplazo, luego crear un `shaderoverride` y ejecutar el shader personalizado solo cuando Diluc sea el personaje activo:

```
[ShaderOverrideDilucFlame]
hash = 4d4da8a4cbe1149a
if $ActiveCharacter == 1
 run = CustomShaderDilucFlame
endif

[CustomShaderDilucFlame]
ps = 4d4da8a4cbe1149a-ps_replace.txt
handling = skip
drawindexed = auto
```

Esto generalmente funcionará, pero 3dmigoto a veces no compila correctamente el `hlsl` si se hace de esta manera, lo que lleva a errores. Además, no funcionará con `asm`. Pero las ventajas son que el shader se puede agrupar junto con el resto del mod en la carpeta del mod y no interferirá si otro mod intenta modificar el mismo shader.

El otro método es pasar una variable personalizada al shader y realizar el efecto solo si la variable coincide. La siguiente sección cubrirá esto con más detalle, pero esencialmente quieres una sección como esta para cada shader:

```
[ShaderOverrideDilucFlame]
hash = 0fa220b5adced192
x160 = $ActiveCharacter
```

Luego, definir una nueva constante en el shader:

<img src="https://user-images.githubusercontent.com/107697535/211988660-d2ffb89b-67bc-4583-afc3-3b5bd6270230.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

Y realizar el efecto solo si esa constante es igual a 1 (por ejemplo, el personaje está en pantalla):

<img src="https://user-images.githubusercontent.com/107697535/211988744-da6a9f46-aa2c-4dc9-8050-7d225adb241e.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

Con esto, Diluc mantiene el efecto:

<img src="https://user-images.githubusercontent.com/107697535/211988793-72e1a43c-25e5-4b4a-b024-2a2aae0d99ee.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

Mientras que los de Hu Tao son normales:

<img src="https://user-images.githubusercontent.com/107697535/211988856-0cb0690a-b65f-4db7-96e3-75e0f04dfde5.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

En movimiento (dejé algunos de los efectos en rojo para contrastar):

https://user-images.githubusercontent.com/107697535/212006132-08528c9c-2069-451c-9d78-bd1737768bb4.mp4


## Pasar Valores Personalizados a Shaders (Cambiando Colores)

En esta sección, demostraré cómo cargar valores personalizados desde los archivos `.ini` a los shaders y cómo puedes usar esto para hacer efectos que cambian entre múltiples colores. También demostraré cómo encontrar las partes del shader que controlan la emisión, algo que es más desafiante que solo los colores de los efectos.

Esta sección es de dificultad media-avanzada: asumiré que has leído la mayor parte de la sección anterior y tienes al menos una familiaridad básica con los archivos `.ini` y shaders (por ejemplo, saber cómo abrirlos y entender al menos vagamente las diferentes partes). El conocimiento básico de programación será útil.

1. Como antes, comenzamos recopilando los hashes de los shaders, esta vez para el pilar de Zhongli:

<img src="https://user-images.githubusercontent.com/107697535/211990319-6809dcff-aa24-46de-8d50-56e21511f384.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

A diferencia de Diluc, este hash no hará que todo el pilar desaparezca, solo las texturas. Esto se debe a que se dibuja usando múltiples shaders, por lo que incluso si omitimos uno, partes del objeto aún se dibujarán (en este caso, el contorno del pilar permanece).

El hash en este caso es `4c99fec14dca7797`: presiona `3` para volcar el shader a ShaderFixes.

Nuestro objetivo final aquí es cambiar el color del efecto geo amarillo mientras dejamos las otras partes iguales.

<img src="https://user-images.githubusercontent.com/107697535/211990446-34c57fcf-fb0a-495a-adf0-4c3834236f0f.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

2. Al abrir el shader, podemos ver que es más complicado que el anterior, con 9 entradas y 6 salidas. Esto se debe a que el shader es responsable de hacer múltiples cosas como dibujar la textura, manejar la emisión, calcular el sombreado, etc.

<img src="https://user-images.githubusercontent.com/107697535/211990505-a83e9b5d-e53f-4d81-8bf1-4b88224c4b3f.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

Comenzamos intentando el mismo método que antes: establecer cada una de las salidas en constantes para aprender sobre lo que controlan.

3. `o0` parece tener algo que ver con los contornos, haciéndolos más gruesos y delgados (un poco difícil de ver, pero se puede usar `F9` para alternar entre modificado y no modificado):

<img src="https://user-images.githubusercontent.com/107697535/211990621-0a6ae9bb-00d8-4da2-b533-bc49e373b2d4.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

`o1.xyz` parecen corresponder a los colores RGB como antes, y `w` parece controlar el brillo.

<img src="https://user-images.githubusercontent.com/107697535/211990706-ae3443bf-e591-49a0-a071-6725d806bb0e.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

<img src="https://user-images.githubusercontent.com/107697535/211990739-c4ebdbbe-de56-4f48-a223-6f3dba5c59ce.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

`o2` también parece controlar el color:

<img src="https://user-images.githubusercontent.com/107697535/211990811-c07390a1-2d01-4d98-b220-8914a03b2b34.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

`o3`-`o5` no están claros, pero parecen afectar el grosor de la línea.

Sin embargo, es posible que hayas notado un problema: todas estas opciones cambian el color de todo el pilar, no solo la línea geo amarilla. Tenemos que profundizar un poco más para encontrar dónde se maneja eso.

4. Antes de continuar, permíteme explicar los símbolos más importantes en el shader con más detalle:

- `v0`, `v1`, `v2`... etc. son los datos de entrada en los archivos vb que se cargan, es decir, datos relacionados con cosas como la posición del vértice, colores del vértice (diferentes de los colores de la textura), mapas UV, pesos de mezcla, etc.
- `o0`, `o1`, `o2`... son los objetivos de salida y son lo que realmente se dibuja en la pantalla (o en el caso de los shaders de vértices `VS`, lo que se pasa al shader de píxeles `PS`).
- `t0`, `t1`, `t2`... son las texturas, cosas como texturas dds típicamente, aunque también pueden ser buffers en algunos casos. Siempre que veas `ps-t0`, `vs-t0`, `ps-t1`, `vs-t1`, etc. en archivos .ini, esto es a lo que corresponden.
- `r0`, `r1`, `r2`... son los registros, estas son variables temporales que el shader usa para almacenar los resultados de los cálculos.
- `cb0`, `cb1`, `cb2`... son los buffers constantes, estos son valores pasados por el juego al shader que representan valores del estado actual del juego, como la ubicación global de los objetos o el tiempo transcurrido desde que comenzó el juego.

Con esto en mente, podemos centrarnos en la parte del código que nos interesa en lugar de tratar de entender todas las 200+ líneas.

Estamos interesados en el resplandor del pilar de Zhongli. Al mirar las texturas del pilar, podemos ver que la textura difusa contiene la parte resplandeciente sobre la capa alfa y se carga en la ranura 0 (es el primer hash del hash.json del pilar, o mirando en un mod creado y viendo que la difusa se carga como `ps-t0`):

<img src="https://user-images.githubusercontent.com/107697535/211991323-68087da3-c621-4238-a994-50e3859837a5.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

<img src="https://user-images.githubusercontent.com/107697535/211991357-5a0c0cee-eb64-410c-875f-db1576e107b9.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

Por lo tanto, estamos interesados en cualquier parte del código que involucre la variable `t0`, que corresponde a la textura difusa. Específicamente, estamos más interesados en cualquier cosa que involucre el componente w, ya que eso es lo que representa la parte resplandeciente.

5. `t0` se carga dos veces en el shader: una vez alrededor de la línea 100 en la variable `r2`:

<img src="https://user-images.githubusercontent.com/107697535/211991507-ed958308-a38f-40dc-a056-5d663f389052.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

Y una vez alrededor de la línea 235 en la variable `r0`:

<img src="https://user-images.githubusercontent.com/107697535/211991578-04bb9823-8bb5-4523-a0f5-2b81e4f32502.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

Hay formas de saber cuál es correcto leyendo el código, pero experimentar con cada uno también funcionará:

Establecer `r2.x` como una constante en el primer bloque:

<img src="https://user-images.githubusercontent.com/107697535/211991690-68c079f5-5111-4b09-90ae-e7120338b791.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

Vuelve el pilar verde, pero deja el efecto geo normal:

<img src="https://user-images.githubusercontent.com/107697535/211991731-c2bbb878-2a7b-401d-8d79-0020e46e92e5.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

Así que probablemente deberíamos mirar cerca del segundo bloque en su lugar. El color es más probable que esté representado por una variable con 3 componentes (uno para cada canal de color), y la más cercana a ese bloque es el `r1` que aparece 3 líneas abajo:

<img src="https://user-images.githubusercontent.com/107697535/211991835-9983b92e-4ee2-4541-b546-2a5a9a560ed8.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

Si establecemos `r1.x` en 1 aquí:

<img src="https://user-images.githubusercontent.com/107697535/211991910-4e13e1e6-ac7c-4b7d-879e-305903c5632a.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

Obtenemos:

<img src="https://user-images.githubusercontent.com/107697535/211991957-54261de6-263f-491b-bfa9-e1cdd4bf7ffd.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

¡Éxito! Este valor `r1` es lo que controla el RGB del resplandor del pilar (establecimos el componente rojo en 0).

(Nota: esto no significa que `r1` siempre sea responsable del color del resplandor del pilar en todas partes del código, solo que contiene el resplandor del pilar en este punto específico en el tiempo. Los valores de los registros son reutilizados por el shader al realizar cálculos, por lo que el “significado” de lo que representa cada uno puede cambiar de línea a línea, a diferencia de las entradas y salidas).

Este mismo principio básico se puede usar en otras situaciones para encontrar qué parte del shader controla qué salida: comienza con algún componente que sabes que está relacionado con lo que estás buscando (como una textura o un valor vb específico), luego busca en el código del shader circundante y experimenta para encontrarlo.

6. Un color es aburrido, sin embargo: ¿qué tal si pudiéramos establecer el color que quisiéramos? En realidad, es posible pasar valores personalizados desde los archivos `.ini` al shader.

Primero, define las variables que quieres usar cerca de la parte superior del archivo bajo las declaraciones de 3dmigoto (180 se eligió arbitrariamente, aunque idealmente deberías elegir números superiores a 100 para que no interfieran accidentalmente con los que usa el juego).

<img src="https://user-images.githubusercontent.com/107697535/211992100-bce019e7-bf54-442e-a4b3-52f856352fb4.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

A continuación, establecemos el R, G y B debajo de la línea t0 que encontramos en la parte anterior.

<img src="https://user-images.githubusercontent.com/107697535/211992193-e24ab261-b997-4cb7-9a9c-59e02a9bff5f.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

(NOTA: el `r1` tiene un componente `x`, `z` y `w`, no un componente `x`, `y` y `z`. Sin embargo, aún corresponden a RGB, solo que las letras son diferentes).

Finalmente, en el .ini vamos a establecer los tres valores siempre que veamos el `IB` para el pilar:

<img src="https://user-images.githubusercontent.com/107697535/211992258-b40caa68-9a4e-4d16-bfd6-63b60ad8e7b5.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

(Puedes encontrar el `IB` del pilar usando `7`/`8` en el teclado numérico para recorrer hasta encontrar el que hace que el pilar desaparezca, o mirando en hash.json):

<img src="https://user-images.githubusercontent.com/107697535/211992424-ddbab70d-4fdd-42e8-996b-4c8cde2337f3.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

¡Éxito! Hemos establecido las líneas en rojo:

<img src="https://user-images.githubusercontent.com/107697535/211992488-bc79ec9e-2155-4142-8b00-89cd264c6308.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

Y podemos establecerlas en otros colores simplemente cambiando los valores del .ini; esto las establecerá en púrpura:

<img src="https://user-images.githubusercontent.com/107697535/211992526-3ad6084c-60b6-402d-b265-d59e9aa09757.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

<img src="https://user-images.githubusercontent.com/107697535/211992599-f58f70da-1ebb-41c5-8f1f-bf0f690a1c5d.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

Sin embargo, ten en cuenta que esto no es perfecto: hemos perdido algunos de los efectos animados a cambio de colores personalizados. Cubriré formas de implementar animaciones en la sección final de este tutorial.

7. Aún podemos hacer más con esto. Un color es genial, pero ¿qué tal si pudiéramos hacer que cambie automáticamente entre ellos? 3dmigoto tiene una variable especial llamada `time` que representa el número de segundos que han pasado desde que comenzó el juego. Podemos usar esto para cambiar automáticamente entre colores con el tiempo:

```
[TextureOverridePillarIB]
hash = 34e18b4f
if time % 3 <= 1
 x180 = 1
 y180 = 0
 z180 = 0
else if time % 3 <= 2
 x180 = 0
 y180 = 1
 z180 = 0
else
 x180 = 0
 y180 = 0
 z180 = 1
endif
```

Lo que esto hace es tomar el tiempo actual y ponerlo en 1 de 3 cubos, luego establecer el pilar en rojo, verde o azul dependiendo del tiempo actual (cambiando cada 3 segundos). Al cambiar los números, puedes hacer que cambie más rápido o más lento, o agregar/eliminar colores, etc.

https://user-images.githubusercontent.com/107697535/212007147-b94b5eda-ca1d-40ee-938e-25d5e7b1f913.mp4

8. Finalmente, similar a antes, podemos cargar el shader en el `.ini` en lugar de ponerlo en ShaderFixes:

```
[TextureOverridePillarIB]
hash = 34e18b4f
run = CustomShaderPillarColor

[CustomShaderPillarColor]
if time % 3 <= 1
 x180 = 1
 y180 = 0
 z180 = 0
else if time % 3 <= 2
 x180 = 0
 y180 = 1
 z180 = 0
else
 x180 = 0
 y180 = 0
 z180 = 1
endif
ps = 4c99fec14dca7797-ps_replace.txt
handling = skip
drawindexed = auto
```

Esto funcionará en su mayoría, pero hay un error en la compilación aquí que hará que el pilar deje un residuo durante ~1 segundo después de desaparecer:

<img src="https://user-images.githubusercontent.com/107697535/211992799-823cb1d7-cb97-469a-b1d0-6d80affed8a8.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

También es posible restringir este shader específicamente a cuando Zhongli esté en el campo, aunque en este caso no conozco ningún otro objeto que comparta este shader, por lo que no es tan importante como lo fue para las llamas de Diluc.


## Efectos Animados

En esta sección final, demostraré cómo podemos usar los principios de las dos secciones anteriores para crear efectos animados simples: recorreré el proceso de crear las líneas animadas en el traje cibernético de Raiden (https://gamebanana.com/mods/420434). Esta sección es avanzada: asumiré que entiendes las dos secciones anteriores, sabes cómo hacer mods y tienes algunos conocimientos básicos de programación.

1. Para comenzar, encontramos el shader que controla el dibujo de las texturas en Raiden Shogun:

<img src="https://user-images.githubusercontent.com/107697535/211994076-18855a3d-7400-4315-9c86-34320c9c1393.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

Raiden en realidad usa al menos dos: uno para el objeto del cuerpo y otro para el objeto del vestido, pero estamos interesados en el objeto del cuerpo, ya que es el que tiene el efecto de emisión que necesitamos (encontrado a través de prueba y error previamente).

El hash es `7d2763cf91813333` y lo volcamos a ShaderFixes.

2. Ahora, buscamos la parte del shader responsable de la emisión. La emisión está sobre la capa alfa en la textura difusa, que está en la ranura 0, por lo que estamos buscando cosas relacionadas con `t0.w`. Solo hay una línea relevante en el shader:

<img src="https://user-images.githubusercontent.com/107697535/211994193-4a061233-20e7-4817-871d-499d04b209be.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

Y al probarlo, encontramos que es responsable del resplandor:

<img src="https://user-images.githubusercontent.com/107697535/211994259-272abaad-7bb2-452a-ab81-b28a3c97c8ed.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

<img src="https://user-images.githubusercontent.com/107697535/211994318-7846346e-6614-4dfc-a793-32ac6af1d173.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

Y podemos modificar las partes resplandecientes de su textura solo agregando una condicional que solo se activa en píxeles que tienen un valor alfa mayor que algún número arbitrario:

<img src="https://user-images.githubusercontent.com/107697535/211994369-a97f22ad-3d00-4aa0-846a-a69596874609.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

<img src="https://user-images.githubusercontent.com/107697535/211994415-6582a59d-8ac1-464a-a245-b55ea3c4c28b.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

3. Ahora, voy a demostrar el proceso de agregar líneas a mi mod de traje cibernético de Raiden:

<img src="https://user-images.githubusercontent.com/107697535/211994483-bf30fc5b-248a-44ea-84b4-6d3bb867b502.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

Primero, dibujo las líneas:

<img src="https://user-images.githubusercontent.com/107697535/211994549-4268e3f1-0f26-462f-a8c9-598f5295aa3a.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

Hice esto a través de la pestaña de pintura de texturas de Blender, pero también podrías pintar directamente en la textura usando paint.net/photoshop. Ten en cuenta que la salida final debe ser `BC7 SRGB` `dds` para la textura difusa. Además, no seas como yo: pinta estas en una capa separada para que puedas separarlas fácilmente más tarde ;-;.

4. La textura final se ve así después de mover las líneas sobre la capa alfa (nota: es ancha porque fusioné algunos modelos y puse sus texturas una al lado de la otra):

<img src="https://user-images.githubusercontent.com/107697535/211994700-5f1401f1-a7cb-4f7a-82bf-057638c2e6d3.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

Lo que nos da líneas resplandecientes en el juego.

<img src="https://user-images.githubusercontent.com/107697535/211994819-843f583b-91d2-4de3-b4ef-153c6199f540.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

5. Ahora, es hora de implementar algunas animaciones básicas. Separo las líneas de la textura difusa en otra textura vacía que voy a llamar la textura de “control”:

<img src="https://user-images.githubusercontent.com/107697535/211994886-0ead61d0-d16d-4029-8e43-376599f51806.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

Esta textura será esencialmente lo que vamos a usar para decirle al shader qué partes de la textura tendrán efectos animados (ya que todos los cuatro canales de la difusa/mapa de luz ya están en uso). El tipo para esta textura debe ser `BC7 Linear`, ya que queremos que los valores de color estén uniformemente espaciados.

También la he recoloreado a negro por simplicidad: no usaremos colores específicos en este ejemplo para mantener las cosas más simples, por lo que establecemos todos los canales de color iguales; si quisieras, podrías usar cada canal de color para controlar diferentes cosas. Asegúrate de que el color sea mayor que 0, ya que queremos poder diferenciarlo del fondo sin depender del canal alfa.

Ten en cuenta que he eliminado las líneas de la textura difusa original ahora, por lo que volvemos al traje de cibernético de Raiden original:

<img src="https://user-images.githubusercontent.com/107697535/211995020-f2d1f4ce-e7ba-4391-a2c1-6ad4f8f2a7f4.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

6. A continuación, agregamos una sección en el `BodyOverride` en el `.ini` del mod para pasar la nueva textura al shader:

```
[TextureOverrideRaidenShogunBody]
hash = 428c56cd
match_first_index = 17769
ib = ResourceRaidenShogunBodyIBZipped
ps-t0 = ResourceRaidenShogunBodyDiffuseRed
ps-t1 = ResourceRaidenShogunBodyLightMap
ps-t26 = ResourceRaidenShogunBodyControl

[ResourceRaidenShogunBodyControl]
filename = RaidenShogunBodyControl.dds
```

Elegí cargarlo en la ranura 26 arbitrariamente: no recomiendo ir más bajo que 20, ya que he visto algunos casos donde llegan tan alto (la gran mayoría de las cosas usan <10 y es raro que algo por encima de 5 sea importante).

7. También necesitamos agregar la variable en el shader cerca de la parte superior:

<img src="https://user-images.githubusercontent.com/107697535/211995132-b3a2b48c-e562-4ae8-af43-157ccc0e87b6.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

Ahora podemos cargar esta textura de manera similar a cómo cargamos las otras texturas:

`r2.xyzw = t26.SampleBias(s0_s, v2.xy, r0.x).xyzw;`

(Si te preguntas cómo obtuvimos esta línea, fue al mirar cómo se cargan las texturas `t0` y `t1` y mimetizar el formato. Elegí `r2` ya que sé que será reemplazado por lo que carguemos desde la difusa, por lo que no romperá ninguna otra línea de código: otra opción sería crear una variable de registro adicional).

8. Ahora, podemos agregar una condicional que solo se activa en píxeles de la textura de control que tienen un valor de canal rojo mayor que 0. Cuando veamos eso, establecemos el color del píxel en verde; de lo contrario, simplemente cargamos el valor del píxel desde la textura difusa original:

```
  r2.xyzw = t26.SampleBias(s0_s, v2.xy, r0.x).xyzw;
  if (r2.x > 0){
    r2.xyz = float3(0,1,0);
    r2.w = 0.6;
  }
  else{
    r2.xyzw = t0.SampleBias(s0_s, v2.xy, r0.x).xyzw;
  }
```
(Nota: estoy siendo un poco perezoso al establecer los valores aquí, ya que deberían estar normalizados, pero no hará mucha diferencia).

Lo que nos lleva de vuelta a nuestro punto de partida original:

<img src="https://user-images.githubusercontent.com/107697535/211995286-4e89fdea-a027-4c25-bdcb-15807d890ee5.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

Sin embargo, ahora hay una diferencia clave: los colores y ubicaciones de las líneas están siendo controlados completamente a través de la textura de control y los cálculos del shader, y no se están leyendo desde la textura original.

Esto nos permite cambiar fácilmente el color simplemente cambiando el valor de `r2.xyz = float3(R,G,B)`:

<img src="https://user-images.githubusercontent.com/107697535/211995384-8e650f7b-697f-495f-b058-186d67083141.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

<img src="https://user-images.githubusercontent.com/107697535/211995416-ee01bbe2-ded5-4aaa-9f85-8fe2d87a1846.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

O incluso establecerlos en el `.ini` como lo hicimos en la sección anterior. ¡Incluso podemos hacer que cambien entre colores usando esto también!

9. Ahora que las líneas están siendo controladas a través del shader y la textura de control, tenemos mucha más flexibilidad en lo que podemos hacer. Comencemos animándolas. En lugar de usar un negro constante en todas las líneas de la textura de control, voy a usar un degradado de negro a blanco:

<img src="https://user-images.githubusercontent.com/107697535/211995487-2705e187-b9c7-4d7a-8885-e09c690db396.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

Ahora, el valor de `r2.x` aumentará linealmente de 0 a 1 a medida que viajes por las líneas (por eso guardamos como `BC7 linear`: de lo contrario, los valores estarían sesgados, lo que llevaría a problemas). Luego podemos pasar la variable de tiempo desde el `.ini` al shader:

```
[TextureOverrideRaidenShogunBody]
hash = 428c56cd
match_first_index = 17769
ib = ResourceRaidenShogunBodyIBZipped
ps-t0 = ResourceRaidenShogunBodyDiffuseRed
ps-t1 = ResourceRaidenShogunBodyLightMap
ps-t26 = ResourceRaidenShogunBodyControl
x180 = time
```

Define una nueva variable en el shader:

`#define TIME IniParams[180].x`

Ahora, podemos comparar el valor de `r2.x` con `TIME` para averiguar qué parte del modelo queremos dibujar. `r2.x` está en el rango de 0 a 1, por lo que necesitamos cambiar el `TIME` a este rango también: podemos dividir `TIME` en cubos repetitivos usando el operador módulo y luego dividir por el valor máximo para poner en el rango de 0 a 1. Así que la ecuación sería `TIME%2/2` para que cambie entre 0 y 1 cada dos segundos.

```
if (r2.x > TIME%2/2){
    r2.xyz = float3(0,1,0);
    r2.w = 0.6;
  }
  else{
    r2.xyzw = t0.SampleBias(s0_s, v2.xy, r0.x).xyzw;
  }
```

Resultado:

https://user-images.githubusercontent.com/107697535/212007218-4d9aea37-e98a-4a6c-8098-f5e9bcb2bada.mp4

Alternativamente, para cambiar la dirección, podemos usar `1- TIME%2/2` en su lugar:

```
  if (r2.x > 1-TIME%2/2){
    r2.xyz = float3(0,1,0);
    r2.w = 0.6;
  }
  else{
    r2.xyzw = t0.SampleBias(s0_s, v2.xy, r0.x).xyzw;
  }
```

https://user-images.githubusercontent.com/107697535/212006027-a20bf56e-7b36-43f9-bfd3-91e0e286e863.mp4

10. El resultado de esto no está mal, pero no es exactamente lo que estaba buscando: no me gusta cómo las líneas aparecen/desaparecen gradualmente y esperaba un efecto más “tipo matrix” donde la línea viaja a lo largo del cuerpo.

En lugar de usar una sola condición, podemos definir un rango donde las líneas aparecerán. Esto solo permitirá valores que estén a lo sumo a 0.2 de `TIME%2/2`:

```
  r2.xyzw = t26.SampleBias(s0_s, v2.xy, r0.x).xyzw;
  if (r2.x > TIME%2/2 && r2.x < TIME%2/2+0.2){
    r2.xyz = float3(0,1,0);
    r2.w = 0.6;
  }
  else{
    r2.xyzw = t0.SampleBias(s0_s, v2.xy, r0.x).xyzw;
  }
```

https://user-images.githubusercontent.com/107697535/212007252-4550a581-3ef7-48ed-865c-f3c516361224.mp4

Mucho mejor, pero se mueve un poco rápido. Además, las líneas aún aparecen todas a la vez al comienzo del ciclo, haciendo que los puntos de inicio y parada sean obvios. La ecuación final que decidí fue:

```
  if (r2.x > 0 && (TIME % 3)/2.5 > r2.x && (TIME % 3)/2.5-0.2 < r2.x){
    r2.xyz = float3(0,1,0);
    r2.w = 0.6;
  }
  else{
    r2.xyzw = t0.SampleBias(s0_s, v2.xy, r0.x).xyzw;
  }
```

https://user-images.githubusercontent.com/107697535/212007300-9ef429fc-14ae-4057-8c35-90ebc53476e8.mp4

Esto se repite cada 3 segundos y en realidad ponemos el tiempo en el rango de 0 a 1.2 en lugar de 0 a 1 dividiendo por 2.5 en lugar de 3: el extra 0.2 permite que las líneas aparezcan y desaparezcan gradualmente al final del ciclo.

11. Ahora, agreguemos algunos efectos más geniales. Solo estamos usando un color verde constante, pero no tenemos que hacerlo: podemos usar matemáticas para hacer que los colores cambien. Explicar cómo funciona esto está más allá del alcance de este tutorial, pero básicamente estamos usando ondas sinusoidales desincronizadas para viajar alrededor de la rueda de colores. Para más detalles, mira aquí: https://krazydad.com/tutorials/makecolors.php

```
if (r2.x > 0 && (TIME % 3)/2.5 > r2.x && (TIME % 3)/2.5-0.2 < r2.x){
    r2.xyz = float3((sin(TIME)+1)/2, (sin(TIME+2)+1)/2, (sin(TIME+4)+1)/2);
    r2.w = 0.6;
  }
  else{
    r2.xyzw = t0.SampleBias(s0_s, v2.xy, r0.x).xyzw;
  }
```

https://user-images.githubusercontent.com/107697535/212008474-dd57332e-6b00-4fef-9d95-b9b585dd37e5.mp4

12. En este punto, he terminado en su mayoría de explicar cómo crear el efecto. El mod de Raiden cibernético real también tiene algunos interruptores adicionales para activar y desactivar los efectos, para limitarlos a cuando Raiden esté en pantalla y para permitir que el usuario elija colores personalizados, pero todos esos ya se han cubierto en secciones anteriores.

Lo único adicional que señalaría es que no estás limitado solo a usar colores con esta técnica: en lugar de establecer `r2` como un color constante, podrías usar esto para elegir entre diferentes texturas. También puedes usar los canales separados en la textura de control para diferentes efectos o usar diferentes variables para interruptores: ¡las posibilidades son infinitas! (no realmente, pero aún puedes hacer mucho).

13. Aunque hemos terminado en su mayoría, señalaré algunos problemas:

- Las líneas no aparecen durante ~1-2 segundos después del cambio de personaje. Esto se debe a que los personajes en realidad usan un shader diferente cuando se están cargando en el juego durante unos segundos: puedes buscar este shader y reemplazarlo también para eliminar este problema.
- Las reflexiones no tienen las líneas. Esto también se debe a que las reflexiones usan un shader diferente y se puede solucionar buscando y reemplazando el shader.

<img src="https://user-images.githubusercontent.com/107697535/211996519-bbb1ce32-70dd-4e53-8708-646f50ecc7cf.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

- El filtro de transparencia se aplica. Aunque esto no es un error, significa que alguien que use el mod de eliminar el filtro de transparencia tendrá ese sobrescrito para Raiden. Si quieres solucionar esto, haz un dif en el archivo del shader con el del filtro de transparencia para ver cuáles son las diferencias y aplicarlas a tu archivo.

<img src="https://user-images.githubusercontent.com/107697535/211996611-a550eddc-a7e1-44a0-8e9f-9246a8fa8411.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

- Algunos personajes se rompen mientras Raiden está en pantalla por un momento al usar el menú de la fiesta. No sé por qué sucede esto: la parte que se rompe ni siquiera usa el mismo shader y no pude aislar el problema. Si alguien lo sabe, por favor envíame un mensaje.

<img src="https://user-images.githubusercontent.com/107697535/211996685-a4c68680-57b7-40c7-8036-ffc0fc5a27e4.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

- El efecto de color arcoíris es genial, pero no es 100% matemáticamente correcto: la textura difusa usa un espacio de color `SRGB`, no uno `lineal`, lo que significa que necesitarías un paso adicional para convertir los colores (puedes ver que las líneas nunca se vuelven completamente rojas/verdes/azules como esperarías). Consulta algo como https://lettier.github.io/3d-game-shaders-for-beginners/gamma-correction.html para obtener detalles.

- Los shaders pueden cambiar de hash entre versiones y tienden a hacerlo más comúnmente que los hashes de personajes, por lo que es posible que necesites actualizar los mods de efectos más a menudo que los de personajes.

Si has llegado a este punto, ¡felicidades! Conoces la mayoría de los conceptos básicos de cómo se pueden usar los shaders para cambiar efectos o incluso crear efectos personalizados. ¡Gracias por leer y espero ver lo que creas!

https://user-images.githubusercontent.com/107697535/212008927-9afe13ef-28ff-49b6-804e-847aa039daff.mp4