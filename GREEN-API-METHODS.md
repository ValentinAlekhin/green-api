# GREEN-API Методы

## Обзор

Этот документ описывает четыре основных метода GREEN-API для работы с WhatsApp API:
- `getSettings` - получение настроек инстанса
- `getStateInstance` - получение состояния инстанса  
- `sendMessage` - отправка текстовых сообщений
- `sendFileByUrl` - отправка файлов по URL

## 1. GetSettings

### Описание
Метод для получения текущих настроек инстанса WhatsApp API.

### Эндпоинт
```
GET {{apiUrl}}/waInstance{{idInstance}}/getSettings/{{apiTokenInstance}}
```

### Параметры запроса
- `idInstance` - ID инстанса
- `apiTokenInstance` - токен API инстанса

### Ответ
Возвращает объект с настройками:
- `wid` - идентификатор WhatsApp аккаунта
- `webhookUrl` - URL для уведомлений
- `delaySendMessagesMilliseconds` - интервал отправки сообщений
- `incomingWebhook` - включение входящих вебхуков
- `outgoingWebhook` - включение исходящих вебхуков
- И другие настройки уведомлений и обработки сообщений

## 2. GetStateInstance

### Описание
Метод для получения текущего состояния инстанса WhatsApp API.

### Эндпоинт
```
GET {{apiUrl}}/waInstance{{idInstance}}/getStateInstance/{{apiTokenInstance}}
```

### Параметры запроса
- `idInstance` - ID инстанса
- `apiTokenInstance` - токен API инстанса

### Возможные состояния
- `notAuthorized` - инстанс не авторизован
- `authorized` - инстанс авторизован и готов к работе
- `blocked` - инстанс заблокирован
- `starting` - инстанс запускается
- `yellowCard` - частичная приостановка из-за спам-активности

### Ответ
```json
{
  "stateInstance": "authorized"
}
```

## 3. SendMessage

### Описание
Метод для отправки текстовых сообщений в личные или групповые чаты.

### Эндпоинт
```
POST {{apiUrl}}/waInstance{{idInstance}}/sendMessage/{{apiTokenInstance}}
```

### Параметры запроса
- `idInstance` - ID инстанса
- `apiTokenInstance` - токен API инстанса

### Тело запроса
```json
{
  "chatId": "79876543210@c.us",
  "message": "Текст сообщения",
  "quotedMessageId": "optional_message_id_to_quote",
  "linkPreview": true
}
```

### Обязательные параметры
- `chatId` - идентификатор чата
- `message` - текст сообщения (до 20,000 символов)

### Ответ
Возвращает `idMessage` для отслеживания отправленного сообщения.

## 4. SendFileByUrl

### Описание
Метод для отправки файлов по URL в WhatsApp чаты.

### Эндпоинт
```
POST {{apiUrl}}/waInstance{{idInstance}}/sendFileByUrl/{{apiTokenInstance}}
```

### Параметры запроса
- `idInstance` - ID инстанса  
- `apiTokenInstance` - токен API инстанса

### Тело запроса
```json
{
  "chatId": "79876543210@c.us",
  "urlFile": "https://example.com/file.png",
  "fileName": "file.png", 
  "caption": "Описание файла"
}
```

### Обязательные параметры
- `chatId` - идентификатор чата
- `urlFile` - прямая ссылка на файл
- `fileName` - имя файла с расширением

### Ограничения
- Максимальный размер файла: 100 МБ
- Один файл на сообщение
- Поддерживаются видео, аудио, изображения и документы
- Тип файла определяется по расширению

### Ответ
Возвращает `idMessage` для отслеживания отправленного файла.

## Общие параметры

Для всех методов требуются:
- `idInstance` - уникальный идентификатор инстанса
- `apiTokenInstance` - токен для аутентификации API

## Базовый URL
```
https://api.green-api.com
```

## Обработка ошибок

Все методы возвращают соответствующие HTTP коды состояния и описания ошибок в формате JSON для обработки исключительных ситуаций.