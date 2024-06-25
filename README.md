#### RU • АНТИФРОД:


Скрипт для снятия данных отпечатка брауера, для определения бота и пересылки его на страницу капчи. На данный момент скрипт собирает отпечатки, для дальнейшего анализа сложных ботов, а таких оказалось пока не много. Глобально отбиться от ботов, которых учитывала яндекс метрика, удалось, просто спрятав код счетчика яндекс метрики. Счетчик подгружается, после срабатывания скрипта, пока что безусловно, так как это отсекло 98% ботов.


Собирается файл fingers.json в корень. В нем собранные данныее. Его лучше объявить в robots.txt:

_User-agent: *_

_Disallow: /fingers.json_



Что бы данные не индексировались, так же немешало бы, в файле .htaccess (если сервер на php) объявить 301 редирект например на главную страницу, что бы никто не мог посмотреть фал, но вы по ftp могли его забрать:

_RewriteEngine On_

_php_flag register_globals off_

_Options +FollowSymLinks_

_Redirect 301 /fingers.json /_



Готовность: Собирает данные. При открытии страницы, собирается фингерпринт и отсылается в json на сервер, там переписывается файлик в корень. Так же, после открытия страницы, срабатывает скрипт сбора и подгружает счетчик яндекс метрики. Сначало, я делал так, что бы весь код страницы блокировался, пока за 150мс не выполниться скрипт джава. Но оказалось, что яндекс боты собирают для индексации страницы без использования скрипта, что привело к индексации пустых страниц. Сейчас я решил, все таки отдавать html, без кода счетчика. 


После декабря (занят) хочу запилить универсальный API. Будет собираться на фронте отпечаток и по API отсылаться на сервер, там, если отпечаток новый - добавляется, вместе с временем посещения. Повторное посещение сайта - проверит, сколько раз данный отпечаток заходил на этот сайт, сколько раз выполнинл отказ. Если приносил отказы - на страницу проверки капчей. Кажется идеальным и униваерсальным вариантом антифрод, а главное простым.

__________________________________________________________________________________________



#### EN • ANTI-FRAUD:


A script for taking the browser's fingerprint data, to identify the bot and forward it to the captcha page. At the moment, the script collects fingerprints for further analysis of complex bots, and there are not many of them yet. Globally, it was possible to fend off bots that Yandex Metrica took into account by simply hiding the Yandex metrica counter code. The counter is loaded after the script is triggered, for now, of course, since this has cut off 98% of bots.



The fingers file is being collected.json at the root. It contains collected data. It is better to declare it in robots.txt:


_User-agent: *_

_Disallow: /fingers.json_



Whatever the data is indexed, it would also not be in the file.htaccess (if the server is in php) declare 301 redirects, for example, to the main page, so that no one could see the file, but you could pick it up via ftp:


_RewriteEngine On_

_php_flag register_globals off_

_Options +FollowSymLinks_

_Redirect 301 /fingers.json /_



Readiness: Collects data. When the page is opened, a fingerprint is collected and sent to the server in json, where the file is rewritten to the root. Also, after opening the page, the collection script is triggered and the yandex.metrica counter is loaded. Initially, I did it so that the entire page code was blocked until the java script was executed in 150ms. But it turned out that Yandex bots collect pages for indexing without using a script, which led to the indexing of empty pages. Now I've decided to give html anyway, without the counter code. 



After December (busy) I want to file a universal API. The fingerprint will be collected at the front and sent via API to the server, where, if the fingerprint is new, it will be added along with the time of the visit. A repeat visit to the site will check how many times this fingerprint has visited this site, how many times it has been rejected. If you brought refusals, go to the captcha verification page. It seems to be an ideal and universal anti-fraud option, and most importantly simple.