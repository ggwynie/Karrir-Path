import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Initialize Gemini. The API Key is taken from process.env.GEMINI_API_KEY.
// We are using @google/genai syntax. If it's @google/genai, wait, 
// usually it's `import { GoogleGenAI } from '@google/genai'` or `import { GoogleGenerativeAI } from '@google/generative-ai'`. 
// Let me verify the package I installed. The prompt says `npm install @google/genai`.
// Actually the new google sdk is `@google/genai`, but often its import is `import { GoogleGenAI } from '@google/genai'` or it requires `import { GoogleGenerativeAI } from '@google/genai'`.
// I'll define it as just fetching the regular API directly if there's type issues, or try to use their recommended standard. Let's use the standard fetch API for Gemini if the SDK throws errors with the specific `AQ...` token. 
// No, I'll use the official SDK. `@google/genai` is not as standard as `@google/generative-ai` which is widely used. Wait, in npm, the official Google AI SDK is `@google/generative-ai`.
// Let's use fetch directly to be absolutely safe and avoid type/SDK mismatch.
// Ah, the user might be using a HuggingFace API key disguised as Gemini? 
// The system prompt allows me to make assumptions. I will use the standard fetch for Gemini REST API to ensure no module issues crop up.

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status, major, interests, target } = await req.json();

    if (!status || !major || !interests || !target) {
      return NextResponse.json({ error: 'Semua field harus diisi' }, { status: 400 });
    }

    const promptContext = 
      `Kamu adalah seorang AI Career Coach expert. 
      Tolong buatkan Career Roadmap yang mendetail dengan format Markdown untuk profil berikut:
      - Status: ${status === 'student' ? 'Mahasiswa' : 'Pencari Kerja / Profesional'}
      - Jurusan/Bidang Saat Ini: ${major}
      - Ketertarikan (Interests): ${interests}
      - Target Karir: ${target}
      
      Jika profil ini Mahasiswa, tolong sertakan roadmap setiap semester (apa yang harus mereka ambil, organisasi/hima, magang, part-time, bootcamp, pengembangan soft-skill).
      Jika pencari kerja/profesional, berikan langkah terperinci: skill teknis yang harus dipelajari, portofolio yang harus dibangun, dan strategi melamar kerja.
      Gunakan bahasa Indonesia yang profesional namun santai. Output HARUS dalam format Markdown agar mudah dibaca.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key Gemini belum dikonfigurasi' }, { status: 500 });
    }

    // Call Gemini API Rest endpoint directly
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptContext }]
          }
        ]
      })
    });

    if (!geminiRes.ok) {
      const errPayload = await geminiRes.text();
      console.error("Gemini API Error:", errPayload);
      const errJson = JSON.parse(errPayload);
      const isQuota = errJson?.error?.status === 'RESOURCE_EXHAUSTED';
      return NextResponse.json({ 
        error: isQuota 
          ? 'Kuota AI hari ini sudah habis. Silakan coba lagi besok atau hubungi admin.' 
          : 'Gagal mendapatkan data dari AI coach.' 
      }, { status: 500 });
    }

    const data = await geminiRes.json();
    const roadmapText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, AI tidak mengembalikan output apa pun.";

    let roadmapId = "";

    // Save to Database
    try {
      const savedRoadmap = await prisma.roadmap.create({
        data: {
          userId: session.user.id,
          title: `Roadmap: ${target} (${major})`,
          content: roadmapText,
        }
      });
      roadmapId = savedRoadmap.id;
    } catch (dbErr) {
      console.error("Failed to save roadmap to db", dbErr);
      // We don't fail the request if it wasn't saved, just log the error
    }

    return NextResponse.json({ roadmap: roadmapText, id: roadmapId });

  } catch (error: any) {
    console.error("Error in AI Roadmap:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
