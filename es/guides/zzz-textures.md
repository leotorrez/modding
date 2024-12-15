# Texturas y propiedades de ZZZ

El tutorial actual asume que ya sabes cómo modificar el juego y todos los conceptos básicos de modelado 3D. Conceptos como UV, texturizado, modelado, kit-bashing, importación y exportación no se cubrirán aquí. Siéntete libre de aprender más conceptos básicos en mi guía de modding.

- [Cómo modificar ZZZ](https://drive.google.com/file/d/11CSjnhNc0kPGuspM152a_uJLS4IJAM-Q/view?usp=sharing)

Los modelos de ZZZ tienen algunos tipos de información codificada en sus mallas además de la mera posición de sus vértices. Eso incluiría sus normales, tangentes, UVs, color de vértice y pesos.

Las normales, tangentes y pesos son necesarios para la renderización adecuada de un modelo 3D y no se cubrirán aquí. Los dos primeros tienen alguna incidencia en la forma del contorno, pero los plugins deberían manejarlos automáticamente por ti.

## Tabla de Contenidos
[[toc]]

## Color de Vértice

![Color de Vértice](https://images.gamebanana.com/img/ss/tuts/669ed8191ffe3.jpg)
He configurado un material personalizado para visualizar cómodamente el color de vértice mientras trabajo en él y, por supuesto, para fines de ilustración en esta guía. Siéntete libre de copiar la configuración del nodo.

### Canal Rojo

![Canal Rojo](https://images.gamebanana.com/img/ss/tuts/669ed81b9c36f.jpg)

Es difícil decir al principio cuál es el propósito de este canal, así que permíteme explicártelo. El juego lo usa como una forma de engrosar o adelgazar el contorno alrededor del personaje. Por ejemplo, al final de un mechón de cabello, el contorno se vuelve más delgado para obtener ese efecto de línea dibujada a mano. Es por eso que ves algunas manchas oscuras en todo el cabello de Nicole. También se usa alrededor de algunos bordes de su ropa para un efecto similar. No hay un patrón específico que un creador de mods deba seguir al tratar con estos, es simplemente una herramienta que da más control sobre lo que se muestra en la pantalla. Por defecto, podrías querer hacerlo de un gris plano como la mayor parte de su cuerpo.

### Canal Verde
![Canal Verde](https://images.gamebanana.com/img/ss/tuts/669ed81b608b5.jpg)

Este es el que menos confianza me da. Tengo mis teorías sobre su uso, pero el patrón varía de un personaje a otro. Así que siéntete libre de enviarme información sobre él si llegas a probarlo en algún momento. Para evitar que cause problemas, configurarlo por defecto a un tono medio nuevamente es la apuesta segura.

### Canal Azul
![Canal Azul](https://images.gamebanana.com/img/ss/tuts/669ed81b6539c.jpg)

Este parece ser usado exclusivamente en peinados. Y mi suposición es que se usa como una guía para decirle al juego qué parte del cabello debe proyectar una sombra más fuerte sobre el cuerpo. También es útil para identificar qué parte de la malla es cabello. Así que el juego podría estar usándolo para dar a los peinados una sombra diferente en general también. Se requiere más pruebas para confirmar estas sospechas. Configurarlo por defecto a 0 absoluto o negro parece estar bien para el cuerpo en general.

### Canal Alfa
![Canal Alfa](https://images.gamebanana.com/img/ss/tuts/669ed81b7b181.jpg)

Parece estar relacionado con el cuello del personaje, pero no he tenido tiempo ni necesidad de modificarlo hasta ahora. Tiendo a simplemente mantener el cuello original del personaje, evitando tener que lidiar con esto. Sin embargo, podría ser útil para algunos casos especiales de sombreado.

## Ranuras de Textura y su propósito
![Ranuras de Textura](https://images.gamebanana.com/img/ss/tuts/669ed81be6cce.jpg)

Las imágenes son: arriba a la izquierda Difusa, arriba a la derecha Mapa de Normales, abajo a la izquierda Mapa de Luz, abajo a la derecha Mapa de Material.

Los nombres son algo técnicamente incorrectos, pero son lo suficientemente buenos como para identificar cuál es el propósito general de cada imagen.

La textura `difusa` es simplemente la coloración de la malla y está codificada en BC7 sRGB, mientras que el resto está en BC7 Lineal.

El `mapa de normales` en los canales rojo y verde mantiene la información normal vertical y horizontal para la malla. Mientras que su canal azul es una máscara de oclusión.

El `Mapa de Luz` y el mapa de material tienden a parecerse y pueden ser confusos, como regla general el mapa de material tiende a ser mayormente rosa o mayormente naranja en general. Mientras que el mapa de luz parece ser generalmente rojo. No hay garantía en esto, por supuesto, pero es una buena guía.

El canal rojo del `Mapa de Luz` codifica la información de contorno y rampa de sombra para cada parte de la malla en lo que parece ser hasta 5 umbrales de intensidad. Esto es bastante similar al canal alfa en el LM de Genshin.

El canal verde es metálico y el azul es una forma de brillo.

El canal rojo del `Mapa de Material` parece ser usado en algunos modelos para codificar qué parte de la malla debe ser transparente y cuán intensa debe ser esa transparencia. Ten en cuenta que esto no se usa en todos los personajes. Buenos ejemplos son la caja de vidrio en la mochila de Anby o las gafas en algunos personajes.

El canal verde es otra forma de metalicidad, pero es difícil describirlo en una sola palabra.

El canal azul parece ser información especular, pero nuevamente no es exactamente eso en el sentido tradicional de PBR.

## UVs

### TEXCOORD.xy
![TEXCOORD.xy](https://images.gamebanana.com/img/ss/tuts/669ed81c5c95c.jpg)

Este es un mapeo clásico de malla que asigna tu textura 2D al espacio 3D

### TEXCOORD1.xy
![TEXCOORD1.xy](https://images.gamebanana.com/img/ss/tuts/669ed81c3c2fd.jpg)

Este es bastante extraño, ¿no? Elaboraré más sobre él más adelante. Tiene sus usos, pero es bastante nicho.

### TEXCOORD2.xy
![TEXCOORD2.xy](https://images.gamebanana.com/img/ss/tuts/669ed81ae8f21.jpg)

Este es simplemente una proyección isométrica de tu malla, es probable que el juego lo use para algunos efectos visuales. Si agregas malla a tu modelo, necesitarás generar este.

### TEXCOORD3.xy
![TEXCOORD3.xy](https://images.gamebanana.com/img/ss/tuts/669ed81be26c9.jpg)

Por último, pero no menos importante. Este es casi el mismo que TEXCOORD.XY, pero puede usarse para mapear el lado interno de una malla a una parte diferente de la textura, por ejemplo, la parte inferior de una falda. Hay métodos alternativos para lograr este efecto, así que no te preocupes si se vuelve problemático de usar.

### Una nota sobre TEXCOORD1.xy

Este es usado por el juego para alguna operación sobre el contorno del personaje. No puedo decir exactamente qué hace, pero puede hacer que una nueva malla añadida se vea diferente de la original. Cuando se colocan una al lado de la otra, se volverá muy evidente. Así que he hecho un par de configuraciones de nodo que facilitan su visualización. Sus valores van de -1 a 1, por lo tanto, una bola gigante termina mostrándolo en su UV.

Si tu malla se ve extraña y no tienes idea de cómo arreglarla, podría estar relacionado con estos. La solución fácil es desempaquetar UV tu malla para este UV y escalar el UV a 0. Luego mueve el resultado a la esquina superior izquierda del UV. Eso equivaldrá a 0 en ambos ejes.

Todos estos necesitarán ser actualizados a medida que se hagan más mods y se tenga una mejor comprensión de estos valores, así que por favor házmelo saber cualquier cosa que descubras sobre estos.

## TL;DL

### Mapa de Material

- R: Transparencia (cuando está habilitada)
- G: Dios sabe
- B: Especular-ish

### Mapa de Luz

- R: Configuración de rampa de sombra / contorno (Puede ser color preestablecido o difuso oscurecido)
- G: Metálico
- B: Brillo

### Mapa de Normales

- R: Normal Map Vertical
- G: Normal Map Horizontal
- B: Oclusión

### Pintura de Vértice

- R: Contorno Grueso
- G: Dios sabe, pero tal vez profundidad Z del contorno
- B: Intensidad de sombra de contacto - TAL VEZ
- Alfa: Algo sobre el cuello, hombre
