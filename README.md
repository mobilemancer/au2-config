# au2-config

Config for Aurelia 2 apps.

Based loosely on the thoughts of Dwayne Charrington's Aurelia 1 config plugin 💜

This plugin is designed to to use with a config file that you ship with your frontend (or fetch). The plugin includes an initialization method (`init`) that sets up the plugin correctly based on the provided config file.

## Installation

npm install @mobilemancer/au2-config

## Usage

To register it into the DI container, import and register it in for example main.ts

```typescript
 import { ConfigService } from '@mobilemancer/au2-config'; 
 ```

then on a DI container of choise

```typescript
.register(ConfigService)
```

### Using only one config

If you just have one config that you want to use, you can make sure that the `ConfigService` uses it for init, by inheriting from the config service and injecting the inherited class into the DI container.

```typescript
import Aurelia, { Registration } from 'aurelia';

import { ConfigService, IConfigService } from '@mobilemancer/au2-config';

import * as config from "./config/config.json";

import { MyApp } from './my-app';

class InitializedConfigService extends ConfigService {
  constructor() {
    super();
    this.init(config);
  }
}

Aurelia
  .register(Registration.singleton(IConfigService, InitializedConfigService))
  .app(MyApp)
  .start();
```

## The config file

The config file is a JSON object, and it needs to have three properties:

* environmentDefinitions
* environments
* properties

*Environment definitions* defines different sets of environments, and the plugin will patern match to what url the app is being served from, so as a user of the plugin, you don't have to toggle what settings you want to use.

*Environments* defines the an environment's properties. Matching key here is `environmentDefinitions.environmentName` and `environments.name`. Then under `properties` define all the properties that needs to be environment specific.

*Properties* can hold all properties that are common for all your environments. For example you can have all the routes defined in this block.

```json
{
    "environmentDefinitions": [
        {
            "environmentName": "development",
            "hosts": [
                "127.0.0.1",
                "localhost"
            ]
        },
         {
            "environmentName": "staging",
            "hosts": [
                "my.staging.com"
            ]
        }
    ],
    "environments": [
        {
            "name": "development",
            "properties": {
                "baseAPIUrl": "https://localhost:7492/v1/",
                "someOtherProperties": {
                    "scopes": [
                        "openid",
                        "email"
                    ]
                }
            }
        },
        {
            "name": "development",
            "properties": {
                "baseAPIUrl": "https://my.staging.com/api/v1/",
                "someOtherProperties": {
                    "scopes": [
                        "openid",
                        "email"
                    ]
                }
            }
        }
    ],
    "properties": {
        "routes": [
            {
                "id": "createObject",
                "route": "object",
                "method": "POST",
                "authorize": true,
                "payload": {
                    "body": true,
                    "bodyFormat": "json"
                }
            },
            {
                "id": "updateObject",
                "route": "object",
                "method": "PUT",
                "authorize": true,
                "payload": {
                    "body": true,
                    "bodyFormat": "json"
                }
            },
            {
                "id": "readObject",
                "route": "object",
                "method": "GET",
                "authorize": false,
            },
        ]
    }
}
```
