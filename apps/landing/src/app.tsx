const APP_STORE_URL = '#unduh';
const PLAY_STORE_URL = '#unduh';

const features = [
  {
    title: 'Pesan dari outlet terdekat',
    body: 'Pilih layanan, jumlah, dan outlet. Tidak perlu telepon atau antre.',
  },
  {
    title: 'Pantau status cucian',
    body: 'Dari diterima, dicuci, sampai siap diambil. Kabar masuk langsung ke ponsel Anda.',
  },
  {
    title: 'Chat dengan outlet & support',
    body: 'Ada yang perlu ditanyakan? Tanya langsung ke outlet atau tim support, balasannya realtime.',
  },
  {
    title: 'Poin, streak, dan XP',
    body: 'Makin sering pakai Wuzz, makin banyak poin yang bisa ditukar potongan harga.',
  },
];

const steps = [
  { n: '1', title: 'Pilih layanan', body: 'Cuci lipat, cuci setrika, dry clean, atau bedcover.' },
  { n: '2', title: 'Serahkan ke outlet', body: 'Antar sendiri atau minta dijemput, lalu kami yang mengerjakan.' },
  { n: '3', title: 'Ambil saat siap', body: 'Anda diberi tahu begitu cucian selesai dan harum.' },
];

function StoreButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
    >
      {label}
    </a>
  );
}

export function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <a href="/" className="text-xl font-bold tracking-tight text-brand">
          Wuzz
        </a>
        <nav className="flex items-center gap-5 text-sm text-muted-foreground">
          <a href="#fitur" className="hover:text-foreground">Fitur</a>
          <a href="#cara-kerja" className="hover:text-foreground">Cara kerja</a>
          <a
            href="#unduh"
            className="rounded-md bg-brand px-3 py-1.5 font-medium text-white hover:opacity-90"
          >
            Unduh
          </a>
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-4 pb-16 pt-12 text-center sm:pt-20">
          <p className="mb-4 inline-block rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            Laundry & jasa kebersihan
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Cucian beres, <span className="text-brand">waktu Anda kembali</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Pesan laundry dari outlet terdekat lewat aplikasi, pantau prosesnya, dan kumpulkan poin di setiap pesanan.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <StoreButton href={APP_STORE_URL} label="Unduh di App Store" />
            <StoreButton href={PLAY_STORE_URL} label="Dapatkan di Google Play" />
          </div>
        </section>

        <section id="fitur" className="border-y border-border bg-secondary/50">
          <div className="mx-auto max-w-5xl px-4 py-16">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Semua yang Anda butuhkan</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map((f) => (
                <div key={f.title} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="cara-kerja" className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Cara kerja</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand font-semibold text-white">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="unduh" className="mx-auto max-w-5xl px-4 pb-20">
          <div className="rounded-2xl bg-brand px-6 py-12 text-center text-white">
            <h2 className="text-2xl font-bold sm:text-3xl">Mulai pesan hari ini</h2>
            <p className="mx-auto mt-2 max-w-md text-white/85">
              Daftar cukup dengan nomor ponsel. Tanpa password, cukup kode SMS.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={APP_STORE_URL} className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-brand hover:opacity-90">
                App Store
              </a>
              <a href={PLAY_STORE_URL} className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-brand hover:opacity-90">
                Google Play
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Wuzz. wuzz.care</span>
          <a href="mailto:hello@wuzz.care" className="hover:text-foreground">hello@wuzz.care</a>
        </div>
      </footer>
    </div>
  );
}
