const { spawn } = require("child_process");

const stream = {
 url: "https://very-fina-josef-b3438143.koyeb.app/stream/5",  // رابط M3U8
 fbKey: "FB-9390277574344055-1-Ab3fz8zN762RjaRAx8gzFhdx"  // مفتاح بث فيسبوك
};

function startStreaming() {
 const fbRTMP = `rtmps://live-api-s.facebook.com:443/rtmp/${stream.fbKey}`;
 console.log(`🔴 بدء البث إلى فيسبوك للرابط: ${stream.url}`);

 const gst = spawn("gst-launch-1.0", [
  "souphttpsrc", `location=${stream.url}`,  // جلب الفيديو من M3U8
  "!", "decodebin",  // فك تشفير الفيديو تلقائيًا
  "!", "videoconvert",  // تحويل الفيديو إلى تنسيق متوافق مع x264
  "!", "x264enc", "bitrate=2000",  // ترميز الفيديو إلى H.264 مع تحديد معدل البت
  "!", "flvmux",  // تحويل الإخراج إلى تنسيق FLV
  "!", "rtmpsink", `location=${fbRTMP}`  // إرسال البث إلى فيسبوك
 ]);

 gst.stderr.on("data", (data) => console.error(`⚠️ GStreamer Error: ${data.toString()}`));
 gst.on("close", (code) => {
  console.log(`🚫 GStreamer انتهى برمز ${code}`);
  console.log("🔄 إعادة تشغيل البث خلال 5 ثوانٍ...");
  setTimeout(startStreaming, 5000);
 });
}

startStreaming();