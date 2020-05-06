const stream = require("youtube-audio-stream");
const decoder = require("lame").Decoder;
const Speaker = require("speaker");
const readline = require("readline");

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const speaker = new Speaker({
  channels: 2, // 2 channels
  bitDepth: 16, // 16-bit samples
  sampleRate: 44100, // 44,100 Hz sample rate
});

var s = stream(process.argv[2], {
  quality: "highestaudio",
});

var dec = s.pipe(decoder());

var play = true;

process.stdin.on("keypress", (str, key) => {
  if (key.ctrl && key.name === "c") {
    process.exit();
  } else {
    keymap = str.toLowerCase();

    switch (keymap) {
      case " ":
        play = !play;
        if (!play) {
            dec.pause();
            process.stdout.write("\r||          ");
        }
        else {
            dec.resume();
            process.stdout.write("\r>           ");
        }
        break;
    }
  }
});

dec.on("data", (chunk) => {
  speaker.write(chunk);
});
