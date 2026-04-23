import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Kamu adalah AI Mentor Karir dari platform KarrirPath. 
Tugasmu membantu pengguna dalam hal:
- Konsultasi karir dan arah pekerjaan
- Review CV dan portofolio
- Persiapan interview
- Pengembangan skill
- Salary negotiation
- Career transition

Jika kamu sedang berperan sebagai mentor spesifik (disebutkan di awal pesan), jawab sesuai persona mentor tersebut — nama, jabatan, perusahaan, dan keahliannya.

Aturan menjawab:
- Gunakan Bahasa Indonesia yang santai tapi profesional
- Jawaban singkat, padat, dan actionable (maksimal 3-4 kalimat)
- Berikan saran konkret, bukan hanya teori
- Kalau perlu info lebih, tanya balik dengan 1 pertanyaan spesifik
- Jangan gunakan bullet point berlebihan, cukup paragraf natural`;

export async function POST(req: Request) {
  const getFallbackResponse = (msg: string) => {
    const lowerMsg = msg.toLowerCase();
    const topics: Record<string, string[]> = {
      cv: [
        'CV yang baik harus pakai angka — contoh: "meningkatkan penjualan 40%". Mau saya bantu review?',
        'Pastikan CV kamu ATS-friendly: hindari tabel, gunakan font standar, dan sertakan keyword dari job desc.',
      ],
      job: [
        'Ada banyak lowongan di platform ini. Coba filter berdasarkan domisili dan kategori yang sesuai.',
        'Untuk fresh grad, magang dulu bisa jadi batu loncatan yang bagus sebelum full-time.',
      ],
      passion: [
        'Coba metode Ikigai: apa yang kamu suka, apa yang kamu kuasai, apa yang dibutuhkan dunia, dan apa yang bisa menghasilkan uang.',
        'Kalau masih bingung passion, coba eksplorasi 3 bidang berbeda selama 30 hari masing-masing.',
      ],
      mentor: [
        'Sebelum sesi mentoring, siapkan 3 pertanyaan spesifik agar waktu lebih efektif.',
        'Jadwalkan sesi rutin minimal 2x sebulan untuk hasil yang optimal.',
      ],
      default: [
        'Ceritakan lebih lanjut tentang situasi karir kamu, saya siap membantu!',
        'Pertanyaan yang bagus! Bisa ceritakan background dan tujuan karir kamu lebih detail?',
        'Saya di sini untuk membantu perjalanan karir kamu. Ada topik spesifik yang ingin dibahas?',
      ],
    };
    let responses = topics.default;
    if (lowerMsg.match(/cv|resume|lamaran|portofolio/i)) responses = topics.cv;
    else if (lowerMsg.match(/lowongan|kerja|job|loker|pekerjaan/i)) responses = topics.job;
    else if (lowerMsg.match(/passion|minat|jurusan|hobi|bakat/i)) responses = topics.passion;
    else if (lowerMsg.match(/mentor|konsultasi|coach|jadwal/i)) responses = topics.mentor;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  try {
    const body = await req.json();
    const message = body.message as string;
    const history: { role: string; parts: { text: string }[] }[] = body.history ?? [];

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your-gemini-api-key-here') {
      return NextResponse.json({ text: getFallbackResponse(message) });
    }

    // Bangun history untuk Gemini — inject system prompt di awal
    const contents = [
      // System prompt sebagai pesan pertama dari model
      {
        role: 'user',
        parts: [{ text: 'Siapa kamu dan apa tugasmu?' }],
      },
      {
        role: 'model',
        parts: [{ text: SYSTEM_PROMPT }],
      },
      // History percakapan sebelumnya
      ...history,
      // Pesan terbaru user
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    if (!res.ok) {
      console.error('Gemini error fallback used, res not ok');
      return NextResponse.json({ text: getFallbackResponse(message) });
    }

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      'Maaf, saya tidak bisa menjawab saat ini. Coba tanya dengan cara berbeda.';

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { text: 'Terjadi kesalahan. Coba lagi sebentar.' },
      { status: 500 }
    );
  }
}
