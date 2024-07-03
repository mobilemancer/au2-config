import assert from "assert";
import { DI } from "aurelia";

export class ConfigService {
    private readonly DEFINITIONS = "environmentDefinitions";
    private readonly ENVIRONMENTS = "environments";
    private readonly PROPERTIES = "properties";

    private hostBasedConfigDefinition: object;
    private commonConfigDefinition: object;

    constructor() { }

    public init(configuration: object) {
        assert(configuration);

        const currentHost = this.getHost();
        this.commonConfigDefinition = configuration;

        const envDefinitions = this.commonConfigDefinition[this.DEFINITIONS].filter((element: EnvironmentDefinition) => element.hosts.includes(currentHost));

        if (!envDefinitions[0] || !envDefinitions[0].environmentName) {
            throw new Error(`No Environment defined for host: ${currentHost}`);
        }

        this.hostBasedConfigDefinition = this.commonConfigDefinition[this.ENVIRONMENTS].filter((env) => envDefinitions[0].environmentName === env.name)[0];

        assert(this.hostBasedConfigDefinition);
    }

    public getProperty(key: string): string | number | boolean | object | object[] {
        const keyParts = key.split(".");

        let scopedConfig = this.hostBasedConfigDefinition?.[this.PROPERTIES]?.[keyParts[0]]
            ? this.hostBasedConfigDefinition[this.PROPERTIES][keyParts[0]]
            : this.commonConfigDefinition?.[this.PROPERTIES]?.[keyParts[0]];

        if (!scopedConfig) {
            throw new Error(`Could not find ${key} in host based or common configuration!`);
        }

        for (let i = 1; i < keyParts.length; i++) {
            if (scopedConfig === undefined) {
                throw new Error(`Could not find ${key} in configuration!`);
            }
            scopedConfig = scopedConfig[keyParts[i]];
        }

        if (scopedConfig === undefined) {
            throw new Error(`Could not find ${key} in configuration!`);
        }

        return scopedConfig;
    }

    private getHost(): string {
        return window.location.hostname;
    }
}

interface EnvironmentDefinition {
    environmentName: string;
    hosts: string[];
}

export const IConfigService = DI.createInterface<ConfigService>("IConfigService", (x) => x.singleton(ConfigService));
