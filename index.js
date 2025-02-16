const express = require('express');
const { spawn } = require('child_process');

const app = express();
const PORT = 3000;

// قائمة القنوات
const streamSources = [
 "http://mo3ad.xyz/5aF5xKechP/kWtQu4CKpx/",
 "http://mutant.arrox.top:80/live/oWg8mm2z2/C1LwyPEFOj/",
 "http://asterix-iptv.club:25461/24SuadViberRazmjena50/SPfbtyeepaup/",
 "http://173.212.193.243:8080/wAfWlqYhLp/vDIyvgtHHf/"
];

// دالة لتشغيل FFmpeg وإعادة البث


const fs = require('fs');
const path = require('path');

const startStream = (sourceUrl, channel, res) => {
  console.log(`🔄 بدء إعادة بث القناة: ${channel}`);

  // إنشاء مجلد لحفظ ملفات HLS
  const outputDir = path.join(__dirname, `hls/${channel}`);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const ffmpeg = spawn('ffmpeg', [
  '-loglevel', 'debug',          // إضافة لتسجيل التفاصيل
  '-i', sourceUrl,               // إدخال الرابط الأصلي
  '-preset', 'veryfast',         // تحسين الأداء
  '-tune', 'zerolatency',        // تقليل التأخير
  '-c:v', 'libx264',             // ترميز الفيديو
  '-c:a', 'aac',                 // ترميز الصوت
  '-f', 'flv',                   // إخراج البيانات بتنسيق FLV
  'pipe:1'                       // إرسال البيانات إلى المخرج القياسي
]);

  ffmpeg.stderr.on('data', (data) => {
    console.error(`⚠️ خطأ FFmpeg: ${data.toString()}`);
  });

  ffmpeg.on('close', (code) => {
    console.log(`⏹️ انتهى البث للقناة ${channel} مع كود الخروج: ${code}`);
  });

  res.sendFile(`${outputDir}/master.m3u8`);
};

module.exports = startStream;

// مسار البث
app.get('/stream/:channel', async (req, res) => {
 const channel = req.params.channel;

 for (const source of streamSources) {
  const sourceUrl = `${source}${channel}`;
  try {
   console.log(`🔍 تجربة المصدر: ${sourceUrl}`);
   res.setHeader('Content-Type', 'video/mp4');
   startStream(sourceUrl, channel, res);
   return;
  } catch (error) {
   console.error(`❌ فشل المصدر: ${source}`);
  }
 }

 res.status(500).send("❌ لا يوجد بث متاح.");
});

// تشغيل السيرفر
app.listen(PORT, () => {
 console.log(`🚀 السيرفر يعمل على http://localhost:${PORT}`);
});