import Aurelia from 'aurelia';
import { MyApp } from './my-app';
import * as Plugin from "../src/index";

Aurelia
  // Register all exports of the plugin
  .register(Plugin)
  .app(MyApp)
  .start();
