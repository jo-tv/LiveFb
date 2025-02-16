const { spawn } = require("child_process");

const streamURL = "https://google-com-globle.koyeb.app/stream/5";
const fbStreamKey = "FB-2370335636636760-1-Ab0Ygqcxr6V4hoLfbKOfopHz";
const fbRTMP = `rtmps://live-api-s.facebook.com:443/rtmp/${fbStreamKey}`;

function startStreaming() {
 console.log("🔴 بدء البث إلى فيسبوك...");

 const ffmpeg = spawn("ffmpeg", [
  "-re",
  "-user_agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "-referer", "http://mutant.arrox.top/",
  "-i", streamURL,
  "-c:v", "libx264", "-b:v", "2500k", "-preset", "ultrafast",
  "-maxrate", "2500k", "-bufsize", "5000k",
  "-c:a", "aac", "-b:a", "128k",
  "-f", "flv", fbRTMP
 ]);

 ffmpeg.stdout.on("data", data => console.log(`📺 FFmpeg: ${data}`));
 ffmpeg.stderr.on("data", data => console.error(`⚠️ FFmpeg Error: ${data}`));

 ffmpeg.on("close", code => {
  console.log(`🚫 FFmpeg انتهى برمز ${code}`);
  console.log("🔄 إعادة تشغيل البث خلال 5 ثوانٍ...");
  setTimeout(startStreaming, 5000);
 });

 ffmpeg.on("error", err => {
  console.error(`❌ خطأ أثناء تشغيل FFmpeg: ${err.message}`);
 });

 return ffmpeg;
}

// تشغيل البث
startStreaming();