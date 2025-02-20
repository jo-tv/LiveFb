const { spawn } = require("child_process");

const streamURL = "https://very-fina-josef-b3438143.koyeb.app/stream/5";
const fbStreamKey = "FB-9390277574344055-1-Ab3fz8zN762RjaRAx8gzFhdx";
const fbRTMP = `rtmps://live-api-s.facebook.com:443/rtmp/${fbStreamKey}`;

function startStreaming() {
 console.log("🔴 بدء البث إلى فيسبوك...");

 const ffmpeg = spawn("ffmpeg", [
  "-re", // إعادة التوقيت بنفس سرعة المصدر
  "-user_agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "-referer", "http://mutant.arrox.top/",
  "-i", streamURL, // إدخال الرابط

  // إعدادات الفيديو
  "-c:v", "libx264",
  "-preset", "fast", // توازن بين الأداء والجودة
  "-b:v", "2000k", // معدل البت
  "-maxrate", "2000k",
  "-bufsize", "4000k",
  "-pix_fmt", "yuv420p", // توافق أفضل مع RTMP
  "-g", "50", // مفتاح إطار كل 2 ثانية (25fps)

  // إعدادات الصوت
  "-c:a", "aac",
  "-b:a", "128k",
  "-ar", "44100", // معدل العينة للصوت

  "-f", "flv", fbRTMP // البث إلى RTMP
 ]);

 ffmpeg.stdout.on("data", data => console.log(`📺 FFmpeg: ${data}`));
 ffmpeg.stderr.on("data", data => console.error(`⚠️ FFmpeg Error: ${data.toString()}`));

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

// بدء البث
startStreaming();