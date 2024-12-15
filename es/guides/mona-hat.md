# Guía para Eliminar el Sombrero de Mona

> Escrito por: [SilentNightSound](https://github.com/SilentNightSound)

Este es un tutorial que recorre el proceso de eliminar un objeto (el sombrero de Mona) del modelo del personaje de principio a fin.

Antes de 3Dmigoto, no había forma de eliminar su sombrero de manera limpia: no tiene un shader único, por lo que no se puede eliminar en Special K; no es un objeto único en la jerarquía de objetos de Unity, por lo que no se puede eliminar usando Melon; y los huesos que están conectados a él también están conectados al cabello de Mona, lo que significa que cualquier intento de cambiar la estructura ósea resultaría en dañar el cabello de Mona también.

Estas instrucciones se pueden aplicar en general para eliminar cualquier parte del modelo, aunque en algunos casos habrá un agujero en el modelo debajo (especialmente para objetos más grandes) - un tutorial sobre cómo parchear agujeros en la malla vendrá más adelante.

1. Asegúrate de que 3DMigoto y el plugin de Blender para 3DMigoto estén instalados.
2. Descarga los archivos del personaje de Mona desde la carpeta CharacterData de https://github.com/SilentNightSound/GI-Model-Importer-Assets. Tu carpeta debería verse así:

<img src="https://user-images.githubusercontent.com/107697535/178895141-ba8572ba-091c-4c49-85e6-841634747211.png" width="600"/>

3. Ahora vamos a cargar el modelo en Blender. En Archivo->Importar hay una opción para importar Dumps de Análisis de Frame de 3DMigoto. Si no ves esta opción, asegúrate de que el plugin de 3DMigoto esté instalado y activado.

<img src="https://user-images.githubusercontent.com/107697535/174457627-5b52357a-0983-4dd5-bf64-301ada192a07.png" width="800"/>

4. Navega a la carpeta del personaje y selecciona todos los archivos .txt. Deja todas las configuraciones por defecto y presiona importar.

<img src="https://user-images.githubusercontent.com/107697535/174457693-c5fa6ef1-799a-471a-ba2d-7ecc55decc8f.png" width="800"/>

5. Si todo se ha configurado correctamente, deberías ver el modelo de Mona importado en la vista. Consiste en dos objetos, la cabeza y el cuerpo.

<img src="https://user-images.githubusercontent.com/107697535/174457712-3499f864-50cb-4b18-b01e-bf88a5d8fd5e.png" width="800"/>

6. Queremos eliminar el sombrero, así que selecciona la malla de la cabeza y entra en modo de edición. Resalta todos los vértices del sombrero y luego elimínalos.

<img src="https://user-images.githubusercontent.com/107697535/174457736-387f6a53-1d33-4a5b-88c5-972d52e05304.png" width="800"/>

<img src="https://user-images.githubusercontent.com/107697535/174457765-c59e3e10-0187-4578-9b0b-21dd47d316e7.png" width="800"/>

7. Ahora que Mona está sin sombrero, queremos exportar los modelos. Asegúrate de que haya un solo objeto llamado "MonaHead" y uno llamado "MonaBody" (y opcionalmente uno llamado "CharDress"/"CharExtra" para personajes que tienen una tercera/cuarta parte - Mona solo tiene dos). La opción para exportar está en Archivo->Exportar->Exportar carpeta de Mod de Genshin. Navega a la carpeta del personaje desde la que cargaste los datos originales y exporta el modelo como "Mona.vb".

<img src="https://user-images.githubusercontent.com/107697535/175569818-4d150043-555c-41a7-90ca-3d0e05c1c3f5.png" width="800"/>

<img src="https://user-images.githubusercontent.com/107697535/175570101-9717b9eb-7ef9-4e1c-82e2-f6871497f5f6.png" width="800"/>

8. Ahora debería generarse una carpeta MonaMod justo al lado de la carpeta del personaje original que se ve así (si la carpeta del mod no se genera, verifica que la carpeta a la que estás exportando tenga hash.json):

<img src="https://user-images.githubusercontent.com/107697535/178895073-201685fb-d4a0-40e2-9e74-5d80b8d16938.png" width="800"/>

   - (Nota: otra forma de generar la carpeta del Mod es exportar cada componente por separado como MonaHead y MonaBody con la opción de buffers en bruto de 3DMigoto, luego usar el script genshin_3dmigoto_generate.py con `python .\genshin_3dmigoto_generate.py -n "Mona"`)

9. Copia la carpeta MonaMod en la carpeta de Mods de 3DMigoto creada durante la configuración:

<img src="https://user-images.githubusercontent.com/107697535/174458172-01751459-13a5-4e11-9827-f039dc762066.png" width="800"/>

<img src="https://user-images.githubusercontent.com/107697535/174458178-e09637de-7149-463e-bd7a-499e986cba1d.png" width="800"/>

10. Presiona "F10" en Genshin para recargar todos los archivos .ini y aplicar el mod. Si todo ha salido según lo planeado, ¡tu Mona ahora estará sin sombrero!

<img src="https://user-images.githubusercontent.com/107697535/174458194-426f8602-31d5-416a-96ed-d58ecdcee39d.png" width="800"/>

Podemos hacer un poco más para mejorar esto. Nota que el cabello de Mona está descolorido donde solía estar el sombrero: esto se controla mediante la textura del mapa de luz de su cabeza. La carpeta del personaje incluye este archivo como MonaHeadLightMap.dds, y podemos modificarlo para mejorar el resultado aún más.

11. Para editar las texturas dds, usamos Paint.net con la [extensión DDS](https://forums.getpaint.net/topic/111731-dds-filetype-plus-04-11-2022/) y cualquier extensión que nos permita editar la capa alfa [Alpha Mask Import](https://forums.getpaint.net/topic/1854-alpha-mask-import-plugin-20/) o [Modify Channels](https://forums.getpaint.net/topic/110805-modify-channels-v111-2022-03-07/) - usaré la primera en este tutorial, y para un ejemplo con la segunda, consulta [GI_Assets](https://github.com/zeroruka/GI_Assets/wiki/Creating-Skins).

12. Al abrir MonaHeadLightMap.dds, podemos eliminar la capa alfa haciendo clic en Efectos->Máscara Alfa y asegurándonos de que todas las opciones estén deseleccionadas y presionando OK:

<img src="https://user-images.githubusercontent.com/107697535/175790813-24c1e522-41d1-42f5-a661-f25f7787dd4a.png" width="800"/>

<img src="https://user-images.githubusercontent.com/107697535/175790898-f26b3f1d-6ed2-4f71-b186-c94ddf44174b.png" width="800"/>

13. Ahora podemos ver que partes de la textura del cabello de Mona son más oscuras. Podemos suavizarlas para eliminar las sombras del cabello de Mona:

<img src="https://user-images.githubusercontent.com/107697535/174458242-75283d3c-72d5-4043-b75d-6273dce32671.png" width="800"/>

<img src="https://user-images.githubusercontent.com/107697535/174458258-1c92a244-40e9-45c5-9a50-da3bfaa2bca4.png" width="800"/>

14. Luego podemos volver a aplicar la capa alfa haciendo clic en Efectos->Máscara Alfa con toda la imagen seleccionada y marcando la opción "Invertir Máscara":

<img src="https://user-images.githubusercontent.com/107697535/175790958-5530e001-655b-4966-9e03-23be7dd93c7d.png" width="800"/>

   - Nota: Se ha perdido una pequeña cantidad de información relacionada con las emisiones y el rubor en comparación con el original porque estamos invirtiendo el canal alfa de toda la imagen; si deseas mantener los efectos de emisión al volver a aplicar, consulta https://www.youtube.com/watch?v=1y8oZ1TFZtg para un ejemplo de uso de máscaras para aplicar selectivamente la inversión solo a partes de la imagen (el tutorial es para Special K, pero 3dmigoto funciona de la misma manera). Alternativamente, también puedes usar el plugin [Modify Channels](https://forums.getpaint.net/topic/110805-modify-channels-v111-2022-03-07/) para evitar perder cualquier dato de emisiones y rubor.

15. Exporta la imagen guardándola como .dds, asegurándote de usar "BC7 (Linear, DX 11+)" y configurando Generar Mip Maps (Nota: Los mapas de luz usan BC7 Linear al exportar, los mapas difusos usan BC7 SRGB).

<img src="https://user-images.githubusercontent.com/107697535/175790979-3f20d159-0eec-4fc0-947d-0cd6b02c95c9.png" width="800"/>

16. Finalmente, podemos reemplazar el MonaHeadLightMap.dds que el mod está usando actualmente ya sea sobrescribiéndolo directamente en la carpeta MonaMod o volviéndolo a colocar en la carpeta del personaje de Mona y recreando la carpeta del mod nuevamente (el plugin extraerá la textura .dds de la carpeta del personaje cada vez que se ejecute).

<img src="https://user-images.githubusercontent.com/107697535/174458283-1bec92ab-5008-4ae6-a6f8-110d7a0dee49.png" width="800"/>
