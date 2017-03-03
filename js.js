

var obj = {
    init:function(){
            var myMap = new ymaps.Map('map', {
            center: [54.83, 37.11],
            zoom: 7,
            controls: ['geolocationControl']
        }, {
            searchControlProvider: 'yandex#search'
        });
        // Создаем кластеризатор c красной иконкой (по умолчанию используются синяя).
        var clusterer = new ymaps.Clusterer({preset: 'islands#redClusterIcons'}),
        // Создаем коллекцию геообъектов.
            collection = new ymaps.GeoObjectCollection(),
        // Дополнительное поле ввода при включенном режиме кластеризации.
            gridSizeField = $('<div class="field" style="display: none">Размер ячейки кластера в пикселях: <input type="text" size="6" id ="gridSize" value="64"/></div>')
                .appendTo('.inputs');

        // Добавляем кластеризатор на карту.
        myMap.geoObjects.add(clusterer);

        // Добавляем коллекцию геообъектов на карту.
        myMap.geoObjects.add(collection);

        $('#useClusterer').bind('click', toggleGridSizeField);
        $('#addMarkers').bind('click', addMarkers);
        $('#removeMarkers').bind('click', removeMarkers);

        // Добавление меток с произвольными координатами.
        function addMarkers () {
            // Количество меток, которое нужно добавить на карту.
            //var placemarksNumber = $('#count').val(),
            var placemarksNumber = 1;
                bounds = myMap.getBounds(),
                // Флаг, показывающий, нужно ли кластеризовать объекты.
                useClusterer = $('#useClusterer').is(':checked'),
                // Размер ячейки кластеризатора, заданный пользователем.
                //gridSize = parseInt($('#gridSize').val()),
                gridSize = 64;
                // Генерируем нужное количество новых объектов.
                newPlacemarks = createGeoObjects(placemarksNumber, bounds);

            if (gridSize > 0) {
                clusterer.options.set({
                    gridSize: gridSize
                });
            }

            // Если используется кластеризатор, то добавляем кластер на карту,
            // если не используется - добавляем на карту коллекцию геообъектов.
            if (useClusterer) {
                // Добавлеяем массив меток в кластеризатор.
                clusterer.add(newPlacemarks);
            } else {
                for (var i = 0, l = newPlacemarks.length; i < l; i++) {
                    collection.add(newPlacemarks[i]);
                }
            }
        }

        // Функция, создающая необходимое количество геообъектов внутри указанной области.
        function createGeoObjects (number, bounds) {
            var placemarks = [];
            var title = document.querySelector('#title').value;
            var message = document.querySelector('#message').value;
            // Создаем нужное количество меток
            for (var i = 0; i < number; i++) {
                // Генерируем координаты метки случайным образом.
                //coordinates = getRandomCoordinates(bounds);
                coordinates = ymaps.geolocation.get({
                    provider: 'browser',
                    mapStateAutoApply: true
                });
                // Создаем метку со случайными координатами.
              
                myPlacemark = new ymaps.Placemark(coordinates,{
                    balloonContentHeader: title,
                    balloonContentBody: message,
                    balloonContentFooter: "Подвал",
                    hintContent: "Хинт метки"
                });

                placemarks.push(myPlacemark);
            }
            return placemarks;
        }

        // Функция, генерирующая случайные координаты
        // в пределах области просмотра карты.
        function getRandomCoordinates (bounds) {
            var size = [bounds[1][0] - bounds[0][0], bounds[1][1] - bounds[0][1]];
            return [Math.random() * size[0] + bounds[0][0], Math.random() * size[1] + bounds[0][1]];
        }

        // Показывать/скрывать дополнительное поле ввода.
        function toggleGridSizeField () {
            // Если пользователь включил режим кластеризации, то появляется дополнительное поле
            // для ввода опции кластеризатора - размер ячейки кластеризации в пикселях.
            // По умолчанию размер ячейки сетки равен 64.
            // При отключении режима кластеризации дополнительное поле ввода скрывается.
            gridSizeField.toggle();
        }

        // Удаление всех меток с карты
        function removeMarkers () {
            // Удаляем все  метки из кластеризатора.
            clusterer.removeAll();
            // Удаляем все метки из коллекции.
            collection.removeAll();
        }     
    }
}
ymaps.ready(obj.init);    


