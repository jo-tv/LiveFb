const { spawn } = require("child_process");

const streams = [
 {
  url: "https://very-fina-josef-b3438143.koyeb.app/stream/5",
  fbKey: "FB-9340574805980999-1-Ab0DWaPTBywnEYZ5-fXpyMG4"
 },
 // أضف المزيد من الروابط هنا
];

function startStreaming(stream) {
 const fbRTMP = `rtmps://live-api-s.facebook.com:443/rtmp/${stream.fbKey}`;
 console.log(`🔴 بدء البث إلى فيسبوك للرابط: ${stream.url}`);

 const ffmpeg = spawn("ffmpeg", [
  "-re",
  "-user_agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "-referer", "http://mutant.arrox.top/",
  "-i", stream.url,
  "-c:v", "libx264",
  "-preset", "fast",
  "-b:v", "2000k",
  "-maxrate", "2000k",
  "-bufsize", "4000k",
  "-pix_fmt", "yuv420p",
  "-g", "50",
  "-c:a", "aac",
  "-b:a", "128k",
  "-ar", "44100",
  "-f", "flv", fbRTMP
 ]);

 ffmpeg.stdout.on("data", data => console.log(`📺 [${stream.url}] FFmpeg: ${data}`));
 ffmpeg.stderr.on("data", data => console.error(`⚠️ [${stream.url}] FFmpeg Error: ${data.toString()}`));
 ffmpeg.on("close", code => {
  console.log(`🚫 [${stream.url}] FFmpeg انتهى برمز ${code}`);
  console.log("🔄 إعادة تشغيل البث خلال 5 ثوانٍ...");
  setTimeout(() => startStreaming(stream), 5000);
 });
 ffmpeg.on("error", err => console.error(`❌ [${stream.url}] خطأ أثناء تشغيل FFmpeg: ${err.message}`));
}

// بدء البث لجميع الروابط
streams.forEach(stream => startStreaming(stream));