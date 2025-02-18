# 3DMigoto GIMI Руководство по текстурным модам

> Автор: [SilentNightSound](https://github.com/SilentNightSound)

Этот учебник объяснит процесс моддинга текстур в Genshin Impact.

Это полезно, если вы хотите изменить такие элементы, как элементы интерфейса или баннеры (поскольку многие иконки рисуются с использованием одного и того же vb/ib, что означает, что плагины GIMI не могут быть использованы для создания модов) или просто хотите изменить текстуру без создания полного мода (например, если вы хотите изменить цвет на объекте или оружии, но не хотите менять форму).

В этом учебнике будут приведены два примера моддинга текстур: моддинг баннера желания и моддинг параплана персонажа. Моддинг текстур немного сложнее, чем базовые изменения сетки, но намного проще, чем импорт пользовательских моделей.

## Требования

Установите версию 3dmigoto GIMI Dev и настройте Paint.net или Photoshop для открытия файлов dds (см. учебник Mona Hat для подробностей).

Также настоятельно рекомендую не использовать активные моды в папке Mods и не иметь шейдеров в папке ShaderFixes, так как это может помешать процессу.

## Важное замечание

По умолчанию версия 3dmigoto Dev настроена на дамп ВСЕХ текстур и буферов при нажатии F8, что происходит из-за этой строки в d3dx.ini:

![image](https://user-images.githubusercontent.com/107697535/208988377-e4708ee9-ffed-4d33-a077-698332afae3f.png)

Это часто приводит к созданию больших дампов (5-10 ГБ+) – я настоятельно рекомендую закомментировать эту строку следующим образом:

![image](https://user-images.githubusercontent.com/107697535/208988409-3af15c43-b33c-475e-95b4-ae4577320c73.png)

И использовать секции [ShaderOverride] для указания, что вы ищете при анализе кадров. Если место и время не являются проблемой, или если вы не можете найти шейдер, который соответствует нужному объекту, можно раскомментировать эту строку и выполнить полный дамп.

## Баннер Желания

1. Первый шаг в моддинге текстур — это найти текстуру и её хэш в игре. Убедитесь, что вы используете версию разработчика и у вас отображается зеленый текст вверху и внизу, затем перейдите на экран желания:

 <img src="https://user-images.githubusercontent.com/107697535/208988430-bd1f834b-1aa4-442e-8887-d455308fb6e6.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

2. Нажмите 1 и 2 на цифровой клавиатуре, чтобы переключаться между PS (пиксельными шейдерами) — мы ищем шейдеры, которые заставляют текстуры баннера исчезать. Как только вы их найдете, нажмите 3 на цифровой клавиатуре, чтобы скопировать хэш.

    В данном случае хэши, которые нам нужны: `000d2ce199e12697` (который рисует персонажей на баннере, фон баннера, иконки сверху, полосу прокрутки и часть текста)

 <img src="https://user-images.githubusercontent.com/107697535/208988464-cd5d8ebf-bc97-4dbe-a3e4-7cc346b285a1.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

    И `dcf5ad8be031c5fc` (который рисует фоны карт, иконки и оставшийся текст)

 <img src="https://user-images.githubusercontent.com/107697535/208988482-9318495e-d89e-4f88-81b4-44977e44ec98.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

    Это хэши для версии 3.2 GI — хотя это редко, иногда хэши шейдеров могут изменяться между версиями.

3. После того как мы нашли эти хэши, создайте файл Banner.ini (можно любое имя, главное, чтобы расширение было .ini) где-то в папке Mods с следующим текстом:

    ```ini
    [ShaderOverrideBanner1]
    hash = 000d2ce199e12697
    analyse_options = dump_rt dump_tex dump_cb dump_vb dump_ib buf txt dds

    [ShaderOverrideBanner2]
    hash = dcf5ad8be031c5fc
    analyse_options = dump_rt dump_tex dump_cb dump_vb dump_ib buf txt dds
    ```

4. Нажмите F10 в игре, чтобы перезагрузить изменения. То, что сделает этот файл .ini, — это указать 3dmigoto, какие файлы дампить во время анализа кадра. Если вы не могли найти хэши шейдеров (например, если текстура появляется на экране всего на секунду), можно выполнить полный дамп, раскомментировав строку в d3dx.ini.

5. Теперь, находясь на экране желания, нажмите F8 — это выполнит дамп анализа кадра, который сбросит все буферы и текстуры в папку 3dmigoto, которая будет иметь название, например, FrameAnalysis-YYYY-MM-DD-HHMMSS.

 <img src="https://user-images.githubusercontent.com/107697535/208988606-6416661b-8ae6-4e46-9c1c-1a331a7c985e.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

 <img src="https://user-images.githubusercontent.com/107697535/208988677-94251b3d-8b18-4ca1-8ab3-9618c6f8487e.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

    Если папка пуста или содержит только log.txt и ShaderUsage.txt, убедитесь, что вы создали и сохранили файл .ini в правильном месте, нажали F10 для перезагрузки и находитесь на экране с нужной текстурой.

6. После того как у нас есть папка, мы можем искать в ней нужные текстуры. Вы можете либо просматривать основную папку, которая имеет файлы, отсортированные по ID рисования (строка из 6 цифр в начале имени файла, которая представляет порядок, в котором текстуры рисуются), либо в папке deduped, которая содержит все файлы, но с удалёнными дубликатами.

    ПОДСКАЗКА: Может быть полезно настроить вашу программу для редактирования dds файлов как программу по умолчанию для открытия .dds файлов, так как это позволит вам видеть превью в проводнике Windows.

7. После некоторых поисков, мы находим нужные текстуры:

    Фон карты (имена файлов были `000059-ps-t0=93073271-vs=8236b1752acd9b01-ps=dcf5ad8be031c5fc.dds` в основной папке и `93073271-BC7_UNORM.dds` в deduped — ID рисования может быть другим для вас):

 <img src="https://user-images.githubusercontent.com/107697535/208988828-9933ff3b-4137-4dc7-afb3-5e8821790be3.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

    Нахида (`000067-ps-t0=70a940c8-vs=28a248a16fa16289-ps=000d2ce199e12697.dds`, `70a940c8-BC7_UNORM.dds`):

 <img src="https://user-images.githubusercontent.com/107697535/208988902-3456044f-243c-43fc-a70d-307189a8cd42.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

    Персонажи (`000069-ps-t0=ad520043-vs=28a248a16fa16289-ps=000d2ce199e12697.dds`, `ad520043-BC7_UNORM.dds`):

 <img src="https://user-images.githubusercontent.com/107697535/208989027-5ac89c6b-e786-4e30-9f62-9d1962477a4c.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

    Подсказка: файлы o0 показывают, что рисуется с этим ID, так что вы можете использовать их для сужения поиска.

    Есть и несколько других связанных текстур, но на данный момент мы сосредоточимся на этих трех. Также обратите внимание, что изменение текста с использованием 3dmigoto очень сложно, если только этот текст не является иконкой (что в данном случае не так).

8. Теперь у нас есть текстуры, мы можем получить их хэши из их имен файлов.

9. Для файлов в основной папке структура такая: DrawID–BufferType–Hash–ShaderType-ShaderHash.Extension — например, для карты это `000059-ps-t0=93073271-vs=8236b1752acd9b01-ps=dcf5ad8be031c5fc.dds`, что означает, что у неё ID рисования `000059`, это буфер `ps-t0`, хэш `93073271`, и он используется вершинным шейдером `8236b1752acd9b01` и пиксельным шейдером `dcf5ad8be031c5fc`.

    Для файлов в папке deduped структура такая: Hash – FileType. Для карты имя файла `93073271-BC7_UNORM.dds`, что является хэшем `93073271` и типом `BC7_UNORM`.

    Самая важная информация — это хэш и тип, так как это то, что нам нужно использовать, — в данном случае это `93073271` и `BC7_UNORM` для карты, `70a940c8` и `BC7_UNORM` для Нахиды и `ad520043` и `BC7_UNORM` для персонажей 4 звезды.

10. Добавьте следующие строки в файл Banner.ini:

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

    Эти строки говорят программе, что при обнаружении хеша текстуры в игре она должна заменить его на новую текстуру (`DendroBannerCard.dds`, `NahidaBanner.dds` и `Nahida4StarBanner.dds` соответственно).

11. Теперь создадим эти текстуры и добавим их в ту же папку, что и Banner.ini. Обратите внимание, что все 3 текстуры имеют тип `BC7_UNORM`, что соответствует `BC7 Linear`.

    Для баннера я перекрашу его и сохраню как `DendroBannerCard.dds` (подробности о том, как открыть и сохранить файлы dds, смотрите в [уроке по удалению шляпы у Моны](./mona-hat.md)).

    <img src="https://user-images.githubusercontent.com/107697535/208989556-0a5b60a1-1396-4b38-94a9-35eec74bdeea.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

    Для Наиды я заменю текстуру на изображение кошачьего глаза из нефрита — для правильного размера я сравниваю с оригиналом (размер 2048x1024, оригинал хранится вверх ногами):

    <img src="https://user-images.githubusercontent.com/107697535/208989714-21590248-c57b-4ad6-b96d-486c9b9a7e28.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

    Наконец, для персонажей 4 звезды я добавлю настоящую звезду баннера (заметьте, что эта текстура имеет странный размер 560x512):

    <img src="https://user-images.githubusercontent.com/107697535/208989791-4e88703f-df9c-4613-af78-c616c636d5b4.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

12. Положив эти 3 файла в ту же папку, что и .ini, и нажав F10 в игре, мы получим следующее:

    <img src="https://user-images.githubusercontent.com/107697535/208989860-3d563399-708c-4976-9f18-cf16cf952904.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

    Успех! Первый мод текстуры завершён.

    (Если ничего не произошло после нажатия F10, убедитесь, что вы правильно добавили текст в .ini, новые dds изображения с правильными именами находятся в той же папке, что и .ini, и на экране не появилось сообщений об ошибках)

    (Ещё одна возможность — игра не проверяет текстуры на этом конкретном шейдере по какой-то причине — попробуйте очистить папку ShaderFixes и добавьте строку `checktextureoverride = ps-tx`, где `ps-tx` — это исходный буфер текстуры (в данном случае `ps-t0`), в раздел ShaderOverride, чтобы заставить 3dmigoto проверять текстуры на этом шейдере).

## Глайдеры

Для другого демонстрационного примера давайте заменим текстуры на крыльях глайдеров. В отличие от элементов интерфейса, планеры действительно имеют модель (хотя она выглядит как плоский прямоугольник), поэтому мы можем использовать инструменты GIMI для создания модов, но каждый планер использует одну и ту же сетку. Если мы хотим заменить только текстуру одного планера, нам нужно быть точнее в том, что именно мы заменяем.

1. Как и раньше, найдём хеш PS, который рисует крылья. Мы можем приостановить время во время полёта в мире и переключаться между ними с помощью 1/2 на цифровой клавиатуре, как раньше.

    <img src="https://user-images.githubusercontent.com/107697535/208989996-ee0dc0bc-dde2-473d-b1da-ea09f5c7e026.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

    В этом случае хеш — `f8143fa00dc241fe` (обратите внимание, что есть другие шейдеры, из-за которых крылья исчезают вместе с частями окружения, но нам нужно искать тот, который наиболее уникален для крыльев):

    <img src="https://user-images.githubusercontent.com/107697535/208990044-a43aa6e3-6f96-4fbc-b2b8-b3df0a08d9bc.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

2. Добавляем следующие строки в файл ini (например, wings.ini) в папке с модами:

    ```ini
    [ShaderOverrideGlider]
    hash = f8143fa00dc241fe
    analyse_options = dump_rt dump_tex dump_cb dump_vb dump_ib buf txt dds
    ```

3. Нажимаем F10 для перезагрузки и F8 для выполнения дампа кадра.

4. Ищем в файлах крылья (`000081-ps-t0=d27db883-vs=7494a6d4010b8dec-ps=f8143fa00dc241fe.dd` или `d27db883-BC7_UNORM_SRGB.dds`).

    <img src="https://user-images.githubusercontent.com/107697535/208990131-64b4dcc4-f29e-4664-a1a3-22259950bd12.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

5. Заменяем их на другие (ОТМЕЧЕНО: из имени файла видно, что тип текстуры — `BC7_UNORM_SRGB`, что означает, что эти текстуры хранятся как BC7 SRGB, а не Linear).

    <img src="https://user-images.githubusercontent.com/107697535/208990242-7ebdb294-3ba2-43bd-b1a3-3c4a0c8f0882.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

6. Создаём переопределения текстур и ресурсы следующим образом в .ini:

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

7. Нажимаем F10 для перезагрузки в игре:

    <img src="https://user-images.githubusercontent.com/107697535/208990331-8ee8125d-0dcb-4a46-87eb-fd3b9c4acfaa.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">

    <img src="https://user-images.githubusercontent.com/107697535/208990373-9c143e72-06c6-4592-93f6-13322a6df22e.png"  style="display:block;float:none;margin-left:auto;margin-right:auto">
