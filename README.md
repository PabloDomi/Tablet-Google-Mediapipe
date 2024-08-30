# 🚀 Tablet Google Mediapipe 🚀

## Descripción

Tablet Google Mediapipe es una aplicación de React Native desarrollada con Expo que se conecta con Health Connect utilizando un plugin de expo y además usa Google Mediapipe para analizar poses y movimientos de los usuarios, enviando los "landmarks" a un módulo de Inteligencia Artificial que se encarga de analizar los landmarks y crear información facilmente visible por el usuario. 
Además, la aplicación permite a los usuarios obtener información sobre los pasos, distancia recorrida y pisos subidos de sus pacientes.

## Características

- **Inicialización y conexión con Health Connect**: La aplicación se inicializa y solicita permisos para acceder a los datos de Health Connect
- **Obtención de datos de Health Connect**: Recupera información sobre los pasos dados, distancia recorrida y pisos subidos.
- **Interfaz de usuario simple y efectiva**: Muestra los datos de fitness de una manera clara y concisa.

## Requisitos

- Node.js
- Expo CLI
- Android Device o Emulador con Health Connect instalado (minSdk => 31)
- Health Connect descargado en el dispositivo (en algunos ya vendrá descargado por defecto).

### Clonar el repositorio

```sh
git clone https://github.com/PabloDomi/Tablet-Google-Mediapipe
cd Tablet-Google-Mediapipe
```

## Instalación
```sh
npm install
``` 

## Ejecución
### En caso de querer correrlo en local (probablemente necesitarás descargar la apk de Health Connect Toolbox para poder testearlo correctamente):
```sh
npm run android
```

### En caso de querer buildearlo en EAS (necesitas una cuenta de Expo creada):
```sh
npm install -g eas-cli
eas login
eas build:configure
eas build --profile development --platform android
```

### Después de usar el código BIDI que te proporcionarán e instalar la aplicación en el dispositivo se debe ejecutar el siguiente comando:
```sh
npx expo start
```
Para más información sobre el EAS Build y Submit (subirlo a la AppStore), vea este link: [EAS Introduction](https://docs.expo.dev/build/introduction/)
