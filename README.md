# SapaGo AI × Vitalife — Enterprise Prototype

Demo frontend Next.js App Router, React, TypeScript, Tailwind CSS dan Lucide. Tanpa database, backend produksi, pembayaran, atau integrasi marketplace sungguhan.

## Menjalankan

Node.js >=22.13.0. Jalankan `npm ci`, lalu `npm run dev -- --port 3011`. Buka http://localhost:3011. `npm run build` menghasilkan static export `out/` yang bisa dilayani oleh server statis.

## Alur demo

1. Website: buka “Chat dengan Vitalife”, kirim “Untuk sehari-hari”. Buka kartu rekomendasi atau detail produk.
2. TikTok Shop: pilih Nadia, klik “Cek stok”. Status pengecekan muncul sebelum respons stok simulasi.
3. Shopee: klik “Cara Penggunaan”; tampilkan konteks produk. Klik “Tracking pesanan”, lalu kirim `VL-DEMO-1042`.
4. Instagram: buka rekomendasi produk, lalu “Hubungi CS”. Badge berubah menjadi Human Agent dan Maya (simulasi) menerima percakapan.
5. Gunakan “Reset demo” untuk mengulang presentasi. Semua pesan disimpan hanya dalam memori sesi; reload mereset sesi.

Pada mobile, pilih customer dari daftar dan gunakan panah kembali di header chat untuk kembali ke daftar. Semua channel punya 5 customer kecuali storefront (1 guest).

## Data dan respons

- `lib/demo/data.ts`: seluruh produk, customer, percakapan awal, quick replies.
- `lib/demo/responses.ts`: routing intent dan scripted responses. Tidak memanggil AI atau alat eksternal.
- `lib/demo/use-demo.ts`: state percakapan per customer, typing, simulasi handover dan reset.
- `components/demo/`: storefront, inbox, chat, dan product card yang reusable.

Semua nama produk, harga, stok, kemasan, manfaat konseptual dan status pesanan adalah contoh fiktif; bukan data resmi Vitalife. Dosis/kandungan/keamanan tidak direka-reka. Ilustrasi kemasan dibuat menggunakan image generation untuk prototype ini.

## SapaGo Widget

Tab Website memuat widget live chat resmi melalui `components/demo/sapago-livechat.tsx`, menggunakan public key dan endpoint yang diberikan untuk demo ini. Widget hanya terlihat saat tab Website aktif dan sesi visitor dipertahankan oleh loader SapaGo.

TikTok Shop, Shopee, dan Instagram tetap memakai simulator percakapan yang reusable dari `components/demo/chat.tsx`. Konfigurasi iframe placeholder di `lib/demo/widget-config.ts` masih tersedia bila masing-masing channel nantinya memiliki URL embed tersendiri.

## Verifikasi

TypeScript, build statis, dan browser flow: kirim pesan website, rekomendasi, stock TikTok, isolasi pesan saat berpindah customer, Shopee penggunaan/tracking, Instagram human handover, product dialog/keranjang, mobile list/detail/back, dan reset. WebMCP opsional `navigate_demo_channel` memakai state tab yang sama; browser tanpa dukungan tetap berfungsi.
