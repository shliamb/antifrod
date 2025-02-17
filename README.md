## RU • Anti-Fraud: Fingerprint Collector & Bot Detector

**Описание:**

Этот скрипт предназначен для сбора отпечатков браузеров и выявления ботов с последующей переадресацией подозрительных пользователей на страницу с капчей. На данный момент основной функционал – сбор данных для анализа сложных ботов.

**Возможности:**

*   **Сбор отпечатков:** Собирает данные о браузере пользователя для создания уникального "отпечатка".
*   **Обход ботов Яндекс.Метрики:** Эффективно скрывает код счетчика Яндекс.Метрики и подгружает его только после выполнения скрипта, что значительно снижает количество ботов.
*   **Блокировка индексации:** Предотвращает индексацию собранных данных поисковыми системами.

**Установка:**

1.  Скрипт создает файл `fingers.json` в корневой директории, который содержит собранные данные.
2.  Рекомендуется добавить следующие строки в файл `robots.txt`, чтобы запретить индексацию файла с отпечатками:

```
User-agent: *
Disallow: /fingers.json
```

3.  Для дополнительной защиты можно добавить в файл `.htaccess` (если используется PHP) перенаправление, чтобы никто не мог просмотреть файл напрямую, но вы могли бы его получить по FTP:

```
RewriteEngine On
php_flag register_globals off
Options +FollowSymLinks
Redirect 301 /fingers.json /
```

**Текущее состояние:**

*   Скрипт собирает данные об отпечатках браузеров и отправляет их в JSON-файл на сервере.
*   После открытия страницы выполняется скрипт сбора данных и подгружается счетчик Яндекс.Метрики.

**Планы на будущее (после декабря):**

*   Разработка универсального API для сбора отпечатков с фронтенда и отправки на сервер.
*   Анализ отпечатков на сервере для определения "новых" и "повторных" пользователей.
*   Оценка поведения пользователя (отказы, время на сайте) и перенаправление подозрительных пользователей на страницу с капчей.

**Преимущества:**

*   Простой и эффективный способ защиты от ботов.
*   Универсальный подход, который можно адаптировать под различные проекты.
*   Легкая интеграция с существующей инфраструктурой.

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
