export class PoemRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(private width = 480, private height = 480) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      alert("Error while trying to draw the poem :(");
      throw new Error("Could not initialize canvas context");
    }

    // Setup
    const dpi = Math.min(window.devicePixelRatio, 1);
    canvas.width = this.width * dpi;
    canvas.height = this.height * dpi;
    canvas.style.width = `${this.width}px`;
    canvas.style.height = `${this.height}px`;
    ctx.scale(dpi, dpi);
    ctx.textRendering = "optimizeLegibility";

    this.canvas = canvas;
    this.ctx = ctx;
  }

  public drawBorder() {
    this.ctx.fillStyle = "#646cff";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "#ffffff";
    this.ctx.roundRect(50, 50, this.width - 100, this.height - 100, 20);
    this.ctx.fill();

    this.ctx.font = "71px Space Mono";
    this.ctx.fillText("MAGNET POEM", 10, 50);
  }

  public drawWords(
    inputWords: Array<{ word: string; x: number; y: number }>,
    offsetX: number,
    offsetY: number
  ) {
    // 50px border
    this.drawBorder();

    this.ctx.font = "15px Space Mono";
    const words = this.processWords(inputWords, offsetX - 60, offsetY - 55);

    this.ctx.fillStyle = "#000000";
    for (const word of words) {
      this.ctx.fillText(word.value, word.x, word.y + 15);
    }

    this.ctx.beginPath();
    this.ctx.strokeStyle = "#abb4c0";
    for (const word of words) {
      this.ctx.roundRect(word.x - 10, word.y - 7, word.w + 20, word.h, 5);
    }
    this.ctx.stroke();
  }

  private processWords(
    words: Array<{ word: string; x: number; y: number }>,
    offsetX: number,
    offsetY: number
  ) {
    return words
      .filter((word) => word.x !== 0 && word.y !== 0)
      .map((item) => ({
        value: item.word,
        x: item.x - offsetX,
        y: item.y - offsetY,
        w: this.ctx.measureText(item.word).width,
        h: 34,
      }));
  }

  public async saveOrShare() {
    this.share().catch(() => this.download());
  }

  public async share() {
    if (!("share" in navigator)) {
      throw new Error("Share not supported");
    }

    const blob = await new Promise<Blob>((resolve, reject) => {
      this.canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Could not create blob"));
        } else {
          resolve(blob);
        }
      });
    });

    navigator.share({
      files: [new File([blob], "magnet-poem.png", { type: "image/png" })],
    });
  }

  public download() {
    const image = this.canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "magnet-poem.png";
    link.click();
  }
}
