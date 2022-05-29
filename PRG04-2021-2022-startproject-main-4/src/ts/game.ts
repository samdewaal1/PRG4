import * as PIXI from "pixi.js";
import fishImage from "../images/fish.png";
import waterImage from "../images/water.jpg";
import turtleImage from "../../src/images/turtle2.png";
import { Fish } from "./fish";
import { Turtle } from "./turtle";

export class Game {
  pixi: PIXI.Application;
  fishes: Fish[] = [];
  loader: PIXI.Loader;
  turtle: Turtle;
  constructor() {
    console.log("Game created");
    //
    // STAP 1 - maak een pixi canvas
    //
    this.pixi = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      forceCanvas: true
    });
    document.body.appendChild(this.pixi.view);

    //
    // STAP 2 - preload alle afbeeldingen
    //
    this.loader = new PIXI.Loader();
    this.loader
      .add("fishTexture", fishImage)
      .add("waterTexture", waterImage)
      .add("sharkTexture", turtleImage);
    this.loader.load(() => this.loadCompleted());
  }
  //
  // STAP 3 - maak een sprite als de afbeeldingen zijn geladen
  //
  loadCompleted() {
    // first load background
    let background = new PIXI.Sprite(
      this.loader.resources["waterTexture"].texture!
    );
    background.scale.set(
      window.innerWidth / background.getBounds().width,
      window.innerHeight / background.getBounds().height
    );
    this.pixi.stage.addChild(background);

    for (let i = 0; i < 10; i++) {
      let fish = new Fish(this.loader.resources["fishTexture"].texture!, this);
      this.fishes.push(fish);
      this.pixi.stage.addChild(fish);
    }

    // create Turtle
    this.turtle = new Turtle(
      this.loader.resources["turtleTexture"].texture!,
      this
    );
    this.pixi.stage.addChild(this.turtle);

    this.pixi.ticker.add((delta: number) => this.update(delta));
  }
  update(delta: number) {
    this.turtle.update();
    for (const fish of this.fishes) {
      fish.update(delta);
      if (this.collision(this.turtle, fish)) {
        this.pixi.stage.removeChild(fish);
      }
    }
    // when the shark is the only survivor
  }

  collision(sprite1: PIXI.Sprite, sprite2: PIXI.Sprite) {
    const bounds1 = sprite1.getBounds();
    const bounds2 = sprite2.getBounds();

    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
    );
  }
}
