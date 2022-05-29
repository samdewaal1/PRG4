const logicalWidth = 320;
const logicalHeight = 240;
const stats = new Stats();
let renderer = null;
let stage = null;
let mainContainer = null;
let bunny = null;

const animate = () => {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);
  
    stats.begin(); 
    bunny.rotation += 0.05;
    renderer.render(stage);
    stats.end();
};

const resizeHandler = () => {
  const scaleFactor = Math.min(
    window.innerWidth / logicalWidth,
    window.innerHeight / logicalHeight
  );
  const newWidth = Math.ceil(logicalWidth * scaleFactor);
  const newHeight = Math.ceil(logicalHeight * scaleFactor);
  
  renderer.view.style.width = `${newWidth}px`;
  renderer.view.style.height = `${newHeight}px`;

  renderer.resize(newWidth, newHeight);
  mainContainer.scale.set(scaleFactor); 
};

const init = () => {
  renderer = PIXI.autoDetectRenderer(logicalWidth, logicalHeight, {
    roundPixels: true,
    resolution: window.devicePixelRatio || 1
  });
  renderer.view.id = 'pixi-canvas';
  
  PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
  
  stage = new PIXI.Container();
  mainContainer = new PIXI.Container();
  stage.addChild(mainContainer);
  
  document.body.appendChild(renderer.view);
  window.addEventListener('resize', resizeHandler, false);
  document.body.appendChild(stats.domElement);
  stats.domElement.id = 'stats';
  resizeHandler();
  
  renderer.backgroundColor = 0xFFFFFF;
  
  PIXI.loader.add('bunny', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/169700/bunny.png').load((loader, resources) => {
      bunny = new PIXI.Sprite(resources.bunny.texture);

      bunny.position.x = logicalWidth / 2;
      bunny.position.y = logicalHeight / 2;
      bunny.anchor.set(0.5);
      mainContainer.addChild(bunny);

      // kick off the animation loop (defined below)
      animate();
  });
};

init();