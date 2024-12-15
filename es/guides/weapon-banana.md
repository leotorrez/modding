# Tutorial de Modding de Armas Personalizadas

> Escrito por: [SilentNightSound](https://github.com/SilentNightSound)

Este es un tutorial para importar modelos de armas personalizadas en Genshin Impact.

Para este tutorial, asumo que estás familiarizado con los conceptos básicos de usar GIMI (cómo configurarlo/importar/exportar/cargar); si no, por favor lee [Eliminación del Sombrero de Mona](./mona-hat). También asumo conocimientos básicos de Blender – para preguntas sobre conceptos básicos de Blender como cambiar modos, seleccionar vértices y abrir ciertos menús, por favor busca el conocimiento que necesitas en Google/Youtube.

Los mods de armas son más complicados que las ediciones básicas de mallas, pero menos complicados que importar personajes personalizados. ~90% de los pasos siguen siendo los mismos para personajes personalizados, pero los personajes implican estructuras de grupos de vértices/huesos mucho más complicadas que las armas.

Demostraré tres modelos de armas diferentes, ordenados por complejidad. En general, para las armas, el orden de dificultad de más fácil a más difícil es Espadas/Lanzas/Mandobles sin borlas → Espadas/Lanzas/Mandobles con borlas → Arcos → Catalizadores. Cada arma se basa en la anterior en términos de complejidad, así que por favor lee en orden.

Usaré [este](https://sketchfab.com/3d-models/banana-6d99c6c1a8bc4b3e97cebbc49d62115d) modelo de un Plátano para los tres mods (créditos a Marc Ed).

## Tabla de Contenidos

[[toc]]

## Espada de Plátano

Comencemos con uno de los tipos más simples de armas, un mandoble sin borlas - voy a reemplazar la Espina del Dragón con un plátano gigante

<img src="https://user-images.githubusercontent.com/107697535/183231401-711a0bd9-b89a-4a54-aa55-9f35c12ac966.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

1. Comienza importando los datos de 3dmigoto de la Espina del Dragón desde el repositorio GI-Model-Importer-Asset

    <img src="https://user-images.githubusercontent.com/107697535/183231676-a73470a7-0cc4-4977-a17a-0ba1165485a8.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

2. Como una verificación de cordura para asegurarte de que estamos en la categoría más simple de armas, verifica que el arma no tenga grupos de vértices. Si los tiene, puedes continuar siguiendo pero necesitarás también referirte a las siguientes dos secciones sobre cómo manejar los grupos

    <img src="https://user-images.githubusercontent.com/107697535/183231678-1cd4d30b-274a-4a13-8deb-8da7b7ca5cf4.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

3. Importa el plátano usando Archivo→Importar→FBX. Elegí un modelo simple con solo una textura y componente a propósito para demostrar cómo funciona el proceso – los modelos más complicados pueden requerir que combines múltiples texturas y componentes, y requiere conocimientos más avanzados de Blender

    <img src="https://user-images.githubusercontent.com/107697535/183231693-6007de52-ecdb-4fb7-8301-07af38e1f336.png" style="display:block;float:none;margin-left:auto;margin-right:auto"> <img src="https://user-images.githubusercontent.com/107697535/183231698-8e0ab1e3-e07e-4fd3-bdc8-c31d8b2c1b05.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

4. Como puedes ver, el modelo del plátano y los modelos de espada están desalineados tanto en ubicación como en tamaño. Traduce, rota y escala el plátano hasta que los dos modelos se superpongan. Las partes más importantes a considerar son las empuñaduras (ya que es donde el personaje sostendrá el arma) y asegurarte de que el nuevo arma no sea significativamente más grande/pequeña que la anterior (ya que podrías terminar con recortes o desalineación con el hitbox real).

    <img src="https://user-images.githubusercontent.com/107697535/183231783-eb1f397a-c017-4398-950f-15a9d8dc66c9.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

5. Aunque esto funcionará, realmente queremos que los modelos se superpongan un poco más para que coincida más con el movimiento de la espada – podemos activar la edición proporcional y arrastrar y rotar la punta del plátano para enderezarlo un poco y mejorar el resultado

    <img src="https://user-images.githubusercontent.com/107697535/183231793-4f6c5365-8b45-4cb8-9543-8256a1440b25.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    <img src="https://user-images.githubusercontent.com/107697535/183231811-c4b37248-dae3-42e2-9865-6554e41931da.png" style="display:block;float:none;margin-left:auto;margin-right:auto"><img src="https://user-images.githubusercontent.com/107697535/183231814-55c7de2d-1d01-46c2-9da1-0deb9e5b108f.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    Ten en cuenta que para este tipo de armas, el nuevo objeto no necesita superponerse exactamente con el anterior.

6. Ahora, necesitamos agregar las propiedades personalizadas de 3dmigoto al nuevo objeto. Hay dos formas de hacer esto: podrías eliminar todos los vértices del modelo antiguo y luego fusionar el nuevo en él, o podrías usar el [script de transferencia de propiedades personalizadas](/Tools/blender_custom_property_transfer_script.txt). Voy a usar el último método en este tutorial

7. Abre la pestaña de scripting y copia el script de transferencia en el cuadro de texto. Haz clic en el objeto al que estás transfiriendo propiedades PRIMERO, luego CTRL+Clic en el objeto del que estás transfiriendo las propiedades SEGUNDO. Haz clic en el botón de reproducción/triángulo en la barra superior para ejecutar el script (MÉTODO ANTIGUO: Descomenta la sección USO ORIGINAL, luego reemplaza “transfer_to” y “transfer_from” con los objetos a los que estás transfiriendo (nuevo objeto) y desde (objeto original de 3dmigoto) respectivamente)

8. Verifica que las propiedades aparezcan en la sección de Propiedades Personalizadas del nuevo objeto

    <img src="https://user-images.githubusercontent.com/107697535/183231907-d9c8dd16-f9b5-4806-8671-f211f865d783.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

9. Ahora, necesitamos asegurarnos de que los mapas UV y los datos de color del nuevo objeto se exporten correctamente. Usa el objeto original como guía – SerpentSpine tiene dos mapas UV TEXCOORD.xy y TEXCOORD1.xy, junto con un color de vértice llamado COLOR

    <img src="https://user-images.githubusercontent.com/107697535/183231917-2db88099-f9c9-4967-a8b5-c5fe194cc288.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    Para las armas, el primer TEXCOORD es para las texturas:

    <img src="https://user-images.githubusercontent.com/107697535/183231961-15a8ec7c-df73-4c68-ab81-b07a61419718.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    Mientras que el segundo controla cómo aparece y desaparece el arma:

    <img src="https://user-images.githubusercontent.com/107697535/183232042-e06c3613-cadc-4026-bba8-11d6eef1635a.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    El COLOR de vértice tiene cuatro componentes: RGB y A. Qué controla exactamente cada componente está fuera del alcance de este tutorial, pero en resumen A se usa principalmente para el grosor del contorno mientras que RGB se usa para la oclusión ambiental, especular y metálico.

    NOTA: Si tu modelo tiene múltiples mapas UV y texturas, necesitarás fusionarlos en uno antes de continuar. Puedes hacer esto alineando las texturas una al lado de la otra y luego escalando los mapas UV para que coincidan con cada componente. Asegúrate de que el ancho y la altura de la textura final sean potencias de 2 (es decir, 1024 x 1024 o 1024x2048 o 2048x2048, etc.)

10. El modelo de plátano que estamos usando solo tiene 1 mapa UV, que renombramos a TEXCOORD.xy para que coincida con el modelo de Serpent Spine

    <img src="https://user-images.githubusercontent.com/107697535/183232096-f47f73af-77ad-4a4b-8ee4-d608c81279d1.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

11. Para el segundo TEXCOORD, creamos un nuevo mapa UV llamado TEXCOORD1.xy, vamos a la vista superior presionando 7 en el teclado numérico, seleccionamos toda la malla y luego presionamos UV→Proyectar desde Vista

    <img src="https://user-images.githubusercontent.com/107697535/183232109-8a88e9ac-5f87-42c4-b4ed-ff5c988dbdfe.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    <img src="https://user-images.githubusercontent.com/107697535/183232115-ae7d3b9f-c924-4883-afdd-f18cf7618212.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    Luego escalamos y rotamos el plátano para que coincida con cómo se veía originalmente el TEXCOORD1 de SerpentSpine. Esto hará que el arma se desplace desde el tallo del plátano

    <img src="https://user-images.githubusercontent.com/107697535/183232139-6003d62f-5a15-4e1d-834f-03a0acc2f0e5.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    (Nota: Las versiones anteriores del complemento tienen un problema relacionado con TEXCOORD1 donde el contorno del modelo desaparece. Aunque hay varias causas para esto, la más común se debe a que el juego reutiliza una ranura de textura tanto para desvanecerse como para contornos. Intenta eliminar las líneas ps-t2 y ps-t3 en el archivo .ini y ver si eso resuelve el problema).

12. Finalmente, tratamos con el color. Si tu modelo ya venía con colores de vértice, puedes renombrarlos a COLOR y listo (aunque ten en cuenta que de donde obtuviste el modelo puede que no esté usando los mismos valores para COLOR que Genshin, por lo que aún podría ser más seguro eliminarlos y transferir los de una malla de 3dmigoto).

    Este modelo de plátano no tiene colores de vértice, por lo que primero necesitamos agregar una variable de color. Hazlo yendo a la pestaña de propiedades de datos y presionando el botón +. Queremos que el nombre sea COLOR, el dominio sea Esquina de Cara y el Tipo de Datos sea Color de Byte. Puedes dejar el color como negro por ahora, lo transferiremos del objeto original en el siguiente paso.

    <img src="https://user-images.githubusercontent.com/107697535/183232163-f9abc26d-3cb0-4fa7-8ef8-1ff0d89e1de3.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

13. Ahora que tenemos un COLOR, necesitamos transferir los valores correctos de la Espina del Dragón. Selecciona el plátano, ve a la pestaña de modificadores, selecciona agregar modificador→transferencia de datos

    <img src="https://user-images.githubusercontent.com/107697535/183232193-d04a6d50-4493-431d-8be7-3bd3e243ab3f.png" style="display:block;float:none;margin-left:auto;margin-right:auto"> <img src="https://user-images.githubusercontent.com/107697535/183232201-d2802655-944c-4ceb-b694-25546ff64cc8.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    Establece la fuente como SerpentSpine, marca la casilla de Datos de Esquina de Cara y la pestaña de Colores y asegúrate de que las opciones sean Todas las Capas y Por Nombre para Colores:

    <img src="https://user-images.githubusercontent.com/107697535/183232208-bd3a2147-8f59-4050-9518-b3388dfea2f1.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    (Nota: para modelos más complicados con múltiples colores de vértice, puedes usar el cuentagotas para copiar los datos de color de una parte específica del componente en lugar de seleccionar todo el objeto)

    Finalmente, presiona la flecha hacia abajo y haz clic en Aplicar

    <img src="https://user-images.githubusercontent.com/107697535/183232216-70505fa2-dd30-435a-9468-a1be2e984db0.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    Puedes verificar que funcionó correctamente entrando en el modo de pintura de vértices y verificando que los colores coincidan:

    <img src="https://user-images.githubusercontent.com/107697535/183232222-ec49ff63-d7dc-40d3-bc81-ca9317df2b20.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

14. A continuación, necesitamos rotar el modelo en relación con el original y aplicar transformaciones. Aunque los modelos parecen superponerse, Genshin los rota durante el proceso de dibujo en la pantalla, por lo que también necesitamos hacerlo en Blender para contrarrestar el efecto. Selecciona el objeto y rota 90 grados en relación con el original así:

    <img src="https://user-images.githubusercontent.com/107697535/183232236-4369c7ff-3638-4a97-a1a7-e113702b86fa.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    Y selecciona el objeto y aplica todas las transformaciones (¡IMPORTANTE! Si no aplicas las transformaciones, el arma aparecerá en una orientación y escala completamente diferentes a las que podrías esperar)

    <img src="https://user-images.githubusercontent.com/107697535/183232251-83682dd2-bde9-470e-9081-1b4af92b6dd2.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    (Nota: La orientación puede ser confusa, así que cuando tengas dudas sobre qué dirección es la correcta, simplemente intenta rotar en ambas direcciones para ver cuál funciona)

15. ¡Casi hemos terminado! La última parte es cambiar el nombre para que tenga “SerpentSpineHead” y eliminar ese texto del objeto original para que el complemento sepa qué objeto exportar. Una vez que hayas nombrado las cosas correctamente, exporta usando la Carpeta de Mod de Exportación de Genshin de nuevo a la carpeta de datos de SerpentSpine (consulta el tutorial de Mona para los pasos completos)

    Si tienes algún problema con la exportación, consulta la [Guía de Solución de Problemas](./troubleshooting) para ver si tu problema aparece.

16. En este punto, es una buena idea confirmar que tu modelo se está cargando correctamente en el juego antes de comenzar a trabajar en las texturas. Copia la carpeta del Mod y recarga:

    <img src="https://user-images.githubusercontent.com/107697535/183232283-3de96889-ec67-41ea-8595-a0ef20d9c654.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    Parece que la forma y la posición son correctas, así que ahora pasamos a arreglar las texturas.

17. Comenzamos con la textura difusa. Las texturas difusas en Genshin son .dds con tipo BC7 SRGB que usan la capa alfa para la emisión. Ejemplo de la textura original de SerpentSpine (parte superior sobre la capa alfa a la izquierda, parte inferior a la derecha):

    <img src="https://user-images.githubusercontent.com/107697535/183232304-34589d61-5654-42ed-9dbc-29aab182fbf5.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    Ahora queremos reemplazar esta textura con la textura del plátano:

    <img src="https://user-images.githubusercontent.com/107697535/189494245-17f20a5a-3974-498c-8c96-8c5ce66c1100.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    Para esta parte, no haremos nada demasiado sofisticado con la textura del plátano: simplemente invertimos el canal alfa, guardamos como .dds y reemplazamos el SerpentSpineHeadDiffuse.dds original (consulta el tutorial de Mona para más detalles sobre la edición básica de texturas de Genshin).

    <img src="https://user-images.githubusercontent.com/107697535/183232314-ca0a08ea-34dd-4902-84c4-ea62268a1997.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    Nota1: Asegúrate de que el ancho y la altura sean potencias de 2 (1024x1024, 2048x2048, 1024x2048, etc.), o podrías tener problemas

    Nota2: No todas las texturas difusas tienen emisión – algunas no tienen un canal alfa en absoluto. En esos casos, no necesitas invertir el canal y puedes usar la textura tal como está. Cuando tengas dudas, verifica la textura original para ver cómo se ve y mírala

18. Reemplazando la textura difusa y recargando:

    <img src="https://user-images.githubusercontent.com/107697535/183232327-74079c8d-9f5a-44e9-bbe7-01b7e3aa250f.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    Se ve mucho mejor, pero aún podemos ver algunos problemas de reflexión y sombra. Estos están siendo causados por el mapa de luz, que también necesitaremos editar.

19. Si tu modelo venía con un mapa de luz, puedes simplemente repetir lo anterior y guardarlo como BC7 Linear y reemplazar el original. Este modelo no venía con uno, sin embargo, así que necesitamos crear un mapa de luz básico. El mapa de luz original se veía así arriba y abajo de la capa alfa:

    <img src="https://user-images.githubusercontent.com/107697535/183232355-06724fe1-619e-44f8-be5d-d39474f61497.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    Los detalles de cómo funcionan exactamente los mapas de luz están fuera del alcance de este tutorial y se cubrirán en otros posteriores – por ahora, comparando con las texturas difusas podemos ver que el mapa parece estar usando púrpura sobre la capa alfa para la parte beige de la espada, que es la más similar a nuestro modelo. Así que podemos simplemente pintar toda la textura de ese color para obtener un resultado razonable:

    <img src="https://user-images.githubusercontent.com/107697535/183232372-a244d012-b35a-446b-b729-6f8ec4bab2bb.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

20. Después de reemplazar la textura del mapa de luz, recarga el juego. ¡Espada de plátano completa!

    <img src="https://user-images.githubusercontent.com/107697535/183232383-1b97ed85-7965-4299-91bc-a233c5bfaa49.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

## El Bownana

Pasando a modelos más complejos, voy a demostrar cómo crear un Bownana reemplazando el Prototipo de Media Luna. Este método también se aplica a cualquier espada/lanza/mandoble con grupos de vértices (por ejemplo, borlas generalmente). La mayoría de los pasos siguen siendo los mismos que en la Espada de Plátano, pero hay algunas complejidades adicionales que necesitamos tener en cuenta.

<img src="https://user-images.githubusercontent.com/107697535/183232781-149695c9-19ae-40d5-983d-bde544e4ceaa.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

1. Importa el arco y el modelo de plátano de la misma manera que en la sección anterior (pasos 1-3). Podemos confirmar que el modelo original que estamos reemplazando cae en esta sección verificando si tiene grupos de vértices

    <img src="https://user-images.githubusercontent.com/107697535/183233096-e6e169e3-eef4-4318-afb7-96d117216182.png" style="display:block;float:none;margin-left:auto;margin-right:auto">
    <img src="https://user-images.githubusercontent.com/107697535/183233106-6fa7122a-a0cd-44fc-873e-5ad550a56ea5.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

2. Dado que la forma que estamos reemplazando es diferente, también necesitamos cambiar cómo modificamos el modelo para que se coloque correctamente:

    <img src="https://user-images.githubusercontent.com/107697535/183233186-4f23dec9-1fed-4ca5-8737-4d83948922e6.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

3. Establecer las propiedades personalizadas de 3dmigoto, TEXCOORDs y COLORs sigue siendo lo mismo que en la sección anterior (pasos 6-13)

4. La primera diferencia importante ocurre cuando necesitamos manejar los grupos de vértices del original. Estos son responsables de cosas como la cuerda del arco siendo tirada y cómo se deforma el arco. El arco tiene un total de cinco grupos (nota: el grupo 0 no tiene peso en absoluto pero aún debe incluirse para exportar correctamente; en la práctica, solo hay cuatro grupos de los que necesitas preocuparte)

    <img src="https://user-images.githubusercontent.com/107697535/183233193-cd119af9-9bdc-4d34-b975-aaeaf62f85ac.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

5. Si el modelo que estamos usando no necesita la animación de tirar de la cuerda del arco, podemos usar un solo grupo de vértices y pintar completamente solo en el grupo 1. Para hacer esto, vamos a las propiedades de datos del objeto y agregamos 5 grupos de vértices llamados 0,1,2,3,4 y luego vamos a la pintura de peso para pintar completamente el objeto en el grupo 1:

    <img src="https://user-images.githubusercontent.com/107697535/183233231-a80f39b3-3ff4-4637-9c98-6849ea35ecea.png" style="display:block;float:none;margin-left:auto;margin-right:auto"> <img src="https://user-images.githubusercontent.com/107697535/183233232-d2ca7009-018b-473e-ad66-7c45bfd4ddef.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    <img src="https://user-images.githubusercontent.com/107697535/183233268-381443f0-4286-489d-919f-0bed57056871.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    (Nota: aún necesitas incluir los cinco grupos para que el nuevo objeto se exporte correctamente)

6. Aunque esto funciona, no es ideal a menos que estés reemplazando el modelo con algo como una pistola – idealmente, aún queremos que el bownana tenga una cuerda y se deforme correctamente. Si el modelo que estás usando ya venía con grupos de vértices similares a los que usa Genshin, puedes fusionarlos y renombrarlos hasta que coincidan con el original. Este modelo de plátano no tiene ninguno, por lo que necesitamos realizar una transferencia de peso automática

7. Necesitamos darle al plátano una cuerda de arco. Podemos hacer una nueva, o reutilizar la cuerda original – haré lo último en este tutorial. Copia el arco original y elimina todo excepto la cuerda:

    <img src="https://user-images.githubusercontent.com/107697535/183233287-92ad4e09-e0de-4340-bc18-4c06788c7935.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

8. Asegúrate de que el nombre del mapa UV de la cuerda y el objeto del plátano coincidan (TEXCOORD.xy, para que los mapas UV se fusionen también), luego fusiona los dos objetos juntos haciendo CTRL+clic en ambos y usando CTRL+J. También asegúrate de que el mapa UV de la cuerda esté sobre una región de la textura que tenga los colores correctos. Si previamente creaste TEXCOORD1.xy, necesitarás recrearlo o mover la cuerda a la posición correcta.

    <img src="https://user-images.githubusercontent.com/107697535/183233320-b0958745-27ea-4e7c-bcd4-d1d96c65d55c.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    <img src="https://user-images.githubusercontent.com/107697535/183233326-2555eb32-0cfb-42f3-8901-c21175a99b34.png" style="display:block;float:none;margin-left:auto;margin-right:auto"><img src="https://user-images.githubusercontent.com/107697535/183233328-d7b8e9e0-c657-4f94-8f23-7502c5e55844.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

9. Ahora que tenemos nuestra cuerda de arco, es hora de asignar los pesos. Asegúrate de que el plátano tenga 5 grupos de vértices llamados 0, 1, 2, 3, 4, luego crea un modificador de Transferencia de Datos. Selecciona el Prototipo de Media Luna como la fuente y selecciona el objeto de Datos de Vértice y la pestaña de Grupos de Vértices:

    <img src="https://user-images.githubusercontent.com/107697535/183233355-c230a973-86d9-4126-a227-d14d752af18d.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    Haz clic en la flecha y presiona Aplicar.

    <img src="https://user-images.githubusercontent.com/107697535/183233365-ebd690c7-e63b-40a8-bca6-043d20f23557.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    Si todo se hizo correctamente, el bownana ahora debería tener aproximadamente los mismos pesos que el original:

    <img src="https://user-images.githubusercontent.com/107697535/183233373-46d4c532-5cb5-45c3-8a0c-0f0d4d43b1c2.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    Y verificando, parece que la cuerda tiene física adecuada en el juego:

    <img src="https://user-images.githubusercontent.com/107697535/183234166-b5a0bf83-f8e9-4168-a5c4-5be4bcb54742.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    (Nota: hay un método alternativo de transferencia de pesos usando la opción Transferir Pesos en el modo de pintura de peso – ambos métodos deberían dar resultados similares)

10. A partir de este punto, el resto de los pasos son los mismos que en la espada de plátano (pasos 14-20 en la sección anterior): rota y aplica transformaciones, renombra, exporta, arregla las texturas y carga en el juego:

    <img src="https://user-images.githubusercontent.com/107697535/183233408-75bba365-d62a-478f-b934-1cda4b4beb7d.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    <img src="https://user-images.githubusercontent.com/107697535/183233419-5c1616e1-767f-40e0-870d-7bc6d3b68b36.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

## Catalizador Maduro

Finalmente, voy a demostrar cómo reemplazar un arma catalizadora (Ojo de la Percepción) que tiene movimiento continuo. Esto es fundamentalmente muy similar a cómo funcionan los arcos, pero los catalizadores usan grupos de vértices de diferentes maneras. También voy a demostrar algunas técnicas más avanzadas durante el proceso.

Asumo que has leído las dos secciones anteriores, así que omitiré la mayoría de los pasos básicos y me centraré en lo que hace que los catalizadores sean diferentes de los arcos y las espadas.

<img src="https://user-images.githubusercontent.com/107697535/183234781-4b859e82-a59f-4a4f-836d-af8118883d0b.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

1. Los catalizadores tienen grupos de vértices como los arcos, pero a diferencia de los arcos, los catalizadores los usan para controlar el movimiento. El Ojo de la Percepción tiene 5 grupos en total, pero solo 2 de ellos están vacíos: el grupo de vértices 1, que se asigna a la bola interior, y el grupo de vértices 4 que tiene el anillo exterior:

    <img src="https://user-images.githubusercontent.com/107697535/183234795-b19d8e83-8c7e-4313-8b07-3d29e10e43d7.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    Ambos giran en sentido antihorario cuando se ven desde arriba. Cualquier cosa que se pinte con el grupo de vértices 1 girará rápidamente alrededor de su centro, mientras que cualquier cosa pintada con el grupo de vértices 4 girará más lentamente.

2. Como antes, importamos y posicionamos el plátano. Esta vez, quiero que gire en el centro:

    <img src="https://user-images.githubusercontent.com/107697535/183234810-88b522ba-2ff0-41c8-919c-57430c95be3b.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

3. Establece las propiedades personalizadas de 3dmigoto, TEXCOORDs y COLORs.

4. Dado que queremos que gire rápidamente, pintamos todo el plátano con el grupo de vértices 1:

    <img src="https://user-images.githubusercontent.com/107697535/183234827-655f9ca6-e086-4ac9-87fd-80729f72a4d8.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

5. Rota, aplica transformaciones, renombra y exporta (aumenté ligeramente el tamaño del plátano para que tenga más impacto). Reemplaza la textura difusa y el mapa de luz con las texturas del plátano de las partes anteriores

    <img src="https://user-images.githubusercontent.com/107697535/183234840-b24d52fb-69f8-49e0-9985-8e245d2f7762.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    <img src="https://user-images.githubusercontent.com/107697535/183234863-c72cbbcc-dcdd-478a-9915-cc597fabf0d0.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    El plátano ahora debería cargarse y girar a la misma velocidad que la parte central original del catalizador.

6. Aunque ahora técnicamente hemos terminado, juguemos con algunos efectos para demostrar lo que puedes hacer con las texturas. Comencemos haciendo un plátano arcoíris.

7. Obtén una imagen de arcoíris de algún lugar, luego crea una nueva capa en la textura del plátano. Coloca la imagen del arcoíris sobre el plátano, aplicando un 50% de transparencia. Ten cuidado con la costura y asegúrate de que el color sea consistente a lo largo de la longitud

    <img src="https://user-images.githubusercontent.com/107697535/183234887-23d862de-6a96-460b-b8b0-dc95c6d9072a.png" style="display:block;float:none;margin-left:auto;margin-right:auto"><img src="https://user-images.githubusercontent.com/107697535/183234899-d34c87f6-b616-42b1-b5f9-3cb054f3497f.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    <img src="https://user-images.githubusercontent.com/107697535/183234916-3c4ab414-16e7-4985-924c-5505f1a4ce5a.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    (El plátano haciéndose más grande es solo tu imaginación)

8. Ahora, podemos jugar con la emisión también. Voy a usar esta imagen del patrón estrellado:

    <img src="https://user-images.githubusercontent.com/107697535/183234930-73da1c1a-2a3b-4332-bd7a-46d4c8248543.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    Al superponer esto en la capa alfa, obtienes un patrón de estrellas brillantes en el plátano:

    <img src="https://user-images.githubusercontent.com/107697535/183234947-6a609268-653c-402c-beab-732dc4c1becd.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    <img src="https://user-images.githubusercontent.com/107697535/183234952-1ccd69ca-a9f9-46c7-9563-f2b2943f4d4e.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

9. Finalmente, juguemos con el patrón de desvanecimiento. Anteriormente, simplemente configuramos TEXCOORD1.xy a lo largo de la longitud del arma para que se desvanezca linealmente, pero en realidad no estamos limitados a hacer eso.

    Si configuramos el TEXCOORD1 a algo como esto, el arma se desvanecerá en tres partes:

    <img src="https://user-images.githubusercontent.com/107697535/183234976-e5102f50-cd99-4ddc-9a15-7855f0318f0b.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    Si lo configuramos así, se desvanecerá todo a la vez aproximadamente a la mitad:

    <img src="https://user-images.githubusercontent.com/107697535/183234987-91f6cc37-1b83-4981-bac1-8cbfa96bb7f8.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

    Y por último, pero no menos importante, si lo configuramos así, se desvanecerá caóticamente:

    <img src="https://user-images.githubusercontent.com/107697535/183235067-549af5b7-7c2b-48c7-b223-7f7002d460d8.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

### Bono por llegar al final: plátano galáctico

<img src="https://user-images.githubusercontent.com/107697535/183235110-054ecd2a-0b60-4dc6-8a02-1d4db826d13d.png" style="display:block;float:none;margin-left:auto;margin-right:auto">

<img src="https://user-images.githubusercontent.com/107697535/183235121-7b745a4d-328d-4d1c-8622-c2f2f71010e5.png" style="display:block;float:none;margin-left:auto;margin-right:auto">
