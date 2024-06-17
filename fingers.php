<?php
// Функция для добавления новых данных в JSON-файл как часть массива
function addDataToJsonFile($newData, $file) {
    // Проверяем, существует ли файл и не пустой ли он
    if (file_exists($file) && filesize($file) > 0) {
        // Читаем текущие данные из файла
        $json = file_get_contents($file);
        $dataArray = json_decode($json, true);

        // Если декодирование прошло успешно и это массив
        if (is_array($dataArray)) {
            // Добавляем новые данные в массив
            $dataArray[] = $newData;
        } else {
            // Если что-то пошло не так при чтении/декодировании данных,
            // создаем новый массив с новыми данными
            $dataArray = array($newData);
        }
    } else {
        // Если файл не существует или пустой, создаем новый массив с новыми данными
        $dataArray = array($newData);
    }

    // Кодируем обновленный массив обратно в JSON
    $json = json_encode($dataArray, JSON_PRETTY_PRINT);

    // Сохраняем обновленные данные обратно в файл
    file_put_contents($file, $json . PHP_EOL);
}

// Получаем входные данные (JSON строку)
$data = file_get_contents('php://input');

// Декодируем входные данные из JSON строки в ассоциативный массив PHP
$newData = json_decode($data, true);

// Имя файла для хранения данных
$file = 'fingers.json';

// Добавляем новые данные в файл как часть массива JSON объектов
addDataToJsonFile($newData, $file);

echo "Data saved successfully";
?>
