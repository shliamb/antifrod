// Базовый фингерпринт с использованием JavaScript:
async function getFingerprint() {
    const fingerprint = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezoneOffset: new Date().getTimezoneOffset(),
        plugins: await getPlugins()
    };

    return fingerprint;
};

async function getPlugins() {
    return Array.from(navigator.plugins).map(plugin => plugin.name);
};

// Battery Status API:
async function getBattery() {
    let batteryprint = '';

    if (navigator.getBattery) {
        try {
            const battery = await navigator.getBattery();
            batteryprint = battery.level * 100 + '%';
        } catch (error) {
            console.error('Error getting battery status:', error);
            batteryprint = 'Error getting battery status';
        }
    } else {
        batteryprint = 'Battery Status not supported';
    }

    return batteryprint;
};



// WebGL:
async function getWebGLInfo() {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            reject('WebGL не поддерживается');
            return;
        }
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        
        if (!debugInfo) {
            reject('Не удалось получить расширение WEBGL_debug_renderer_info');
            return;
        }
        
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        
        resolve({ vendor, renderer });
    });
};




// Информации о количестве точек касания:
async function getTouchPoints() {
    if ('maxTouchPoints' in navigator) {
        // Современные браузеры
        return navigator.maxTouchPoints;
    } else if ('msMaxTouchPoints' in navigator) {
        // Internet Explorer 10 и 11
        return navigator.msMaxTouchPoints;
    } else {
        // Старые браузеры
        try {
            document.createEvent("TouchEvent");
            return 1; // Если событие TouchEvent может быть создано, предполагаем поддержку одного касания.
        } catch (e) {
            return 0; // Если событие не может быть создано, предполагаем отсутствие поддержки касаний.
        }
    }
};


// Canvas
async function getCanvasFingerprint() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    ctx.textBaseline = 'top';
    ctx.font = '16px Arial';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Hello, world!', 2, 15);

    ctx.strokeStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.arc(50, 50, 50, 0, Math.PI * 2);
    ctx.stroke();

     var dataURL = canvas.toDataURL();

     async function hashSHA256(message) {
        const msgBuffer = new TextEncoder().encode(message);                    
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        return hashHex;
     }

     try {
         return await hashSHA256(dataURL);
     } catch (error) {
         throw error;
     }
};




// AudioContext Fingerprinting
function getAudioFingerprint() {
    return new Promise((resolve, reject) => {
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var oscillator = audioCtx.createOscillator();
        var analyser = audioCtx.createAnalyser();
        var gain = audioCtx.createGain();
        var scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);

        // Настройка осциллятора
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(10000, audioCtx.currentTime); // Частота 10kHz

        // Подключение компонентов
        oscillator.connect(analyser);
        analyser.connect(gain);
        gain.connect(scriptProcessor);
        scriptProcessor.connect(audioCtx.destination);

        // Обработка данных аудио
        scriptProcessor.onaudioprocess = function(event) {
            var dataArray = new Float32Array(analyser.frequencyBinCount);
            analyser.getFloatFrequencyData(dataArray);

            // Простая хэш-функция для создания отпечатка
            function hash(arr) {
                return arr.reduce((hashValue, value) => {
                    hashValue += value;
                    return hashValue;
                }, 0).toString();
            }

            const fingerprint = hash(dataArray);

            // Остановка осциллятора после получения данных
            oscillator.stop();
            scriptProcessor.disconnect();
            gain.disconnect();
            analyser.disconnect();

            audioCtx.close().then(() => {
                resolve(fingerprint);
            }).catch(err => reject(err));
        };

        // Запуск осциллятора
        oscillator.start(0);
    });
};



// Cookies Enabled
function setCookieAsync(name, value) {
    return new Promise((resolve) => {
        document.cookie = `${name}=${value}`;
        resolve();
    });
};

function deleteCookieAsync(name) {
    return new Promise((resolve) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        resolve();
    });
};

function checkCookieAsync(name) {
    return new Promise((resolve) => {
        const isEnabled = document.cookie.indexOf(`${name}=`) !== -1;
        resolve(isEnabled);
    });
};

async function areCookiesEnabled() {
    await setCookieAsync("testcookie", "1");
    
    const cookiesEnabled = await checkCookieAsync("testcookie");

    await deleteCookieAsync("testcookie");

    return cookiesEnabled;
};

// IP adress:
async function getIpAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        //console.log("IP Address: ", data.ip);
        return data.ip;
    } catch (error) {
        console.error("Error fetching IP address:");
    }
};


// Network: 
async function getNetworkParameters() {
    // Проверяем наличие API navigator.connection в браузере
    if ('connection' in navigator) {
        const connection = navigator.connection;

        // Создаем объект для хранения параметров сети
        const networkParams = {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt,
            saveData: connection.saveData
        };

        return networkParams;
    } else {
        throw new Error("API navigator.connection не поддерживается этим браузером.");
    }
};



// getDeviceInfo
async function getDeviceInfo() {
    try {
        // Пример использования MediaDevices API для получения информации об устройствах медиа
        const devices = await navigator.mediaDevices.enumerateDevices();
        
        // Создаем массив для хранения информации об устройствах
        const deviceses = [];

        devices.forEach(device => {
            // Добавляем информацию об устройстве в массив
            deviceses.push({
                Устройство: device.kind,
                Метка: device.label,
                ID: device.deviceId
            });
        });

        // Преобразуем массив объектов в строку формата JSON
        const jsonString = deviceses;
        
        return jsonString;

    } catch (error) {
        console.error('Ошибка при получении информации об устройстве:');
    }
};

// // Вызов функции и вывод результата в консоль
// getDeviceInfo().then(jsonString => console.log(jsonString));



async function getDateF() {
    // Создаем новый объект Date для получения текущей даты и времени
    const currentDate = new Date();

    // Получаем различные компоненты даты и времени
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Месяцы начинаются с 0, поэтому добавляем 1
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // Форматируем дату и время в строку
    const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

    // console.log(formattedDateTime);
    return formattedDateTime;
};













async function sendData() {
    let data = {};


    try {
        data.date = await getDateF();
    } catch (error) {
        console.error('Error getting date:', error);
        data.date = null;
    }


    try {
        data.ip = await getIpAddress();
    } catch (error) {
        console.error('Error getting IP address:', error);
        data.ip = null;
    }

    try {
        data.Mouse = window.matchMedia('(pointer: fine)').matches;
    } catch (error) {
        console.error('Error detecting mouse pointer:', error);
        data.Mouse = null;
    }

    try {
        data.Battery = await getBattery();
    } catch (error) {
        console.error('Error detecting Battery:', error);
        data.Battery = null;
    }

    try {
        data.Canvas = await getCanvasFingerprint();
    } catch (error) {
        console.error('Error detecting Canvas:', error);
        data.Canvas = null;
    }

    try {
        data.processors = navigator.hardwareConcurrency;
    } catch (error) {
        console.error('Error detecting processors:', error);
        data.processors = null;
    }


    try {
        data.Memory = navigator.deviceMemory;
    } catch (error) {
        console.error('Error detecting Memory:', error);
        data.Memory = null;
    }

    // Почему то фирефокс вылетает...
    // try {
    //     data.Audio = await getAudioFingerprint();
    // } catch (error) {
    //     console.error('Error detecting Audio:', error);
    //     data.Audio = null;
    // }

    try {
        data.WebGL = await await getWebGLInfo();
    } catch (error) {
        console.error('Error detecting WebGL:', error);
        data.WebGL = null;
    }

    try {
        data.Fingerprint = await getFingerprint();
    } catch (error) {
        console.error('Error detecting Fingerprint:', error);
        data.Fingerprint = null;
    }

    try {
        data.touch = await getTouchPoints();
    } catch (error) {
        console.error('Error detecting touch:', error);
        data.touch = null;
    }

    try {
        data.networkInfo = await getNetworkParameters();
    } catch (error) {
        console.error('Error detecting networkInfo:', error);
        data.networkInfo = null;
    }

    try {
        data.PerformanceTiming = window.performance.timing;
    } catch (error) {
        console.error('Error detecting PerformanceTiming:', error);
        data.PerformanceTiming = null;
    }

    try {
        data.NavigationTiming = window.performance.navigation;
    } catch (error) {
        console.error('Error detecting NavigationTiming:', error);
        data.NavigationTiming = null;
    }

    try {
        data.DeviceInfo = await getDeviceInfo();
    } catch (error) {
        console.error('Error detecting DeviceInfo:', error);
        data.DeviceInfo = null;
    }




    try {
        const response = await fetch('fingers.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.text();
        console.log('Success: ', result);
    } catch (error) {
        console.error('Error sending data:', error);
    }
}

// Вызов асинхронной функции
sendData();













document.addEventListener("DOMContentLoaded", async function() {
    // Асинхронная функция для проверки трафика
    async function checkTraffic() {
        // Здесь вы можете выполнить свои проверки
        let isAllowed = true;  // Пример условия

        if (!isAllowed) {
            window.location.href = "/blocked.html";  // Перенаправление на другую страницу при несоответствии условиям
            return;
        }
        
        // Если все ок, показываем основной контент и загружаем остальные ресурсы
        document.getElementById("main-content").style.display = "block";
        
        await loadAdditionalScripts();
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;

            script.onload = () => resolve(src);
            script.onerror = () => reject(new Error(`Failed to load script ${src}`));

            document.body.appendChild(script);
        });
    }

    async function loadAdditionalScripts() {
        const scripts = [
            './js/counter.js',
            //'./js/youtube.js',
            // Добавьте сюда пути ко всем другим необходимым скриптам
        ];

        try {
            for (const src of scripts) {
                await loadScript(src);
                console.log(`Successfully loaded script ${src}`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    await checkTraffic();
});

















// function getBrowserFingerprint() {
//     const fingerprint = {
//         userAgent: navigator.userAgent,
//         language: navigator.language,
//         platform: navigator.platform,
//         screenResolution: `${screen.width}x${screen.height}`,
//         timezoneOffset: new Date().getTimezoneOffset(),
//         plugins: Array.from(navigator.plugins).map(plugin => plugin.name),
//     };
//     return fingerprint;
// }
// const fingerprint = getBrowserFingerprint();
// console.log(fingerprint);


// <script src="https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js"></script>
// (async () => {
// Initialize an agent at application startup.
//    const fp = await getFingerprint.load();
// Get the visitor identifier when you need it.
//    const result = await fp.get();
// This is the visitor identifier:
//    const visitorId = result.visitorId;
//    console.log(visitorId);
// })();
