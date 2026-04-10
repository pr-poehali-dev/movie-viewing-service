import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const MOVIES = [
  {
    id: 1,
    title: "Тёмный горизонт",
    year: 2024,
    genre: ["Триллер", "Драма"],
    rating: 8.4,
    duration: "2ч 18м",
    description: "Детектив расследует серию загадочных исчезновений в мегаполисе, погружаясь в мир теней и предательств.",
    poster: "https://cdn.poehali.dev/projects/792937f6-082e-423e-b9be-bab5c7c6072f/files/d2fc31fa-d09b-4ccd-a932-3e1d46930b3d.jpg",
    featured: true,
    new: false,
  },
  {
    id: 2,
    title: "За горизонтом",
    year: 2024,
    genre: ["Фантастика", "Приключения"],
    rating: 9.1,
    duration: "2ч 45м",
    description: "Команда астронавтов отправляется к далёкой планете — и находит там нечто, изменившее всё представление о вселенной.",
    poster: "https://cdn.poehali.dev/projects/792937f6-082e-423e-b9be-bab5c7c6072f/files/fb82d9b5-9395-42c3-92c8-bcbd0a6097fe.jpg",
    featured: true,
    new: true,
  },
  {
    id: 3,
    title: "Последний вокзал",
    year: 2023,
    genre: ["Мелодрама", "Драма"],
    rating: 7.8,
    duration: "1ч 58м",
    description: "История любви, разлуки и встречи через 20 лет. Судьбы двух людей пересекаются на перроне старого вокзала.",
    poster: "https://cdn.poehali.dev/projects/792937f6-082e-423e-b9be-bab5c7c6072f/files/5b02f2f3-6eda-431a-a160-84ae55d25f99.jpg",
    featured: false,
    new: false,
  },
  {
    id: 4,
    title: "Неоновый огонь",
    year: 2024,
    genre: ["Боевик", "Фантастика"],
    rating: 8.0,
    duration: "2ч 05м",
    description: "В мегаполисе будущего агент-нелегал охотится за корпоративным шпионом, владеющим опасными секретами.",
    poster: "https://cdn.poehali.dev/projects/792937f6-082e-423e-b9be-bab5c7c6072f/files/236f221c-e726-4a6b-876a-1f5645c36812.jpg",
    featured: false,
    new: true,
  },
  {
    id: 5,
    title: "Тихий дом",
    year: 2023,
    genre: ["Ужасы", "Мистика"],
    rating: 7.5,
    duration: "1ч 42м",
    description: "Семья переезжает в старинный особняк и обнаруживает, что дом хранит мрачные секреты прежних жильцов.",
    poster: "https://cdn.poehali.dev/projects/792937f6-082e-423e-b9be-bab5c7c6072f/files/cb894410-906f-4294-8489-cedda796db91.jpg",
    featured: false,
    new: false,
  },
  {
    id: 6,
    title: "Параллельный мир",
    year: 2024,
    genre: ["Фантастика", "Триллер"],
    rating: 8.7,
    duration: "2ч 22м",
    description: "Физик обнаруживает портал в параллельную реальность, где история пошла по-другому. Но возвращение может стоить всего.",
    poster: "https://cdn.poehali.dev/projects/792937f6-082e-423e-b9be-bab5c7c6072f/files/fb82d9b5-9395-42c3-92c8-bcbd0a6097fe.jpg",
    featured: false,
    new: true,
  },
];

const GENRES = ["Все", "Триллер", "Драма", "Фантастика", "Боевик", "Мелодрама", "Ужасы", "Мистика", "Приключения"];

type Page = "home" | "catalog" | "search" | "saved" | "profile";

interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string[];
  rating: number;
  duration: string;
  description: string;
  poster: string;
  featured: boolean;
  new: boolean;
}

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [activeGenre, setActiveGenre] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedMovies, setSavedMovies] = useState<number[]>([2, 4]);
  const [watchHistory] = useState<number[]>([1, 3, 5]);
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [progress, setProgress] = useState(34);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quality, setQuality] = useState("1080p");
  const [heroIndex, setHeroIndex] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const featuredMovies = MOVIES.filter((m) => m.featured);
  const heroMovie = featuredMovies[heroIndex];

  useEffect(() => {
    const t = setInterval(() => {
      setHeroIndex((i) => (i + 1) % featuredMovies.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      progressRef.current = setInterval(() => {
        setProgress((p) => (p >= 100 ? 100 : p + 0.1));
      }, 200);
    } else {
      if (progressRef.current) clearInterval(progressRef.current);
    }
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isPlaying]);

  const toggleSave = (id: number) => {
    setSavedMovies((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const openPlayer = (movie: Movie) => {
    setActiveMovie(movie);
    setPlayerOpen(true);
    setProgress(34);
    setIsPlaying(false);
  };

  const filteredMovies = MOVIES.filter((m) => {
    const matchGenre = activeGenre === "Все" || m.genre.includes(activeGenre);
    const matchSearch =
      searchQuery === "" ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGenre && matchSearch;
  });

  const savedList = MOVIES.filter((m) => savedMovies.includes(m.id));
  const historyList = MOVIES.filter((m) => watchHistory.includes(m.id));

  return (
    <div className="min-h-screen bg-cinema-bg text-cinema-text font-body">
      {/* Player Modal */}
      {playerOpen && activeMovie && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in">
          <div className="w-full max-w-4xl mx-4">
            <div className="flex items-center justify-between mb-4 px-1">
              <div>
                <h2 className="font-display text-xl text-white">{activeMovie.title}</h2>
                <p className="text-cinema-muted text-sm">{activeMovie.year} · {activeMovie.duration}</p>
              </div>
              <button
                onClick={() => { setPlayerOpen(false); setIsPlaying(false); }}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <Icon name="X" size={20} className="text-white" />
              </button>
            </div>

            <div className="relative aspect-video bg-cinema-surface rounded-lg overflow-hidden mb-4">
              <img
                src={activeMovie.poster}
                alt={activeMovie.title}
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-cinema-gold/90 hover:bg-cinema-gold flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-cinema-gold/30"
                >
                  <Icon name={isPlaying ? "Pause" : "Play"} size={28} className="text-black" />
                </button>
              </div>
              <div className="absolute top-3 right-3">
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="bg-black/60 text-white text-xs border border-white/20 rounded px-2 py-1 outline-none cursor-pointer"
                >
                  <option>1080p</option>
                  <option>720p</option>
                  <option>480p</option>
                </select>
              </div>
              {isPlaying && (
                <div className="absolute bottom-3 left-3 flex gap-1 items-end">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-1 bg-cinema-gold rounded-full animate-pulse"
                      style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                  <span className="text-cinema-gold text-xs ml-1">Воспроизведение</span>
                </div>
              )}
            </div>

            <div className="px-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-cinema-muted text-xs tabular-nums">
                  {Math.floor(progress * 1.38)}м
                </span>
                <div
                  className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer relative overflow-hidden"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = ((e.clientX - rect.left) / rect.width) * 100;
                    setProgress(Math.min(100, Math.max(0, pct)));
                  }}
                >
                  <div
                    className="h-full bg-cinema-gold rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-cinema-muted text-xs tabular-nums">{activeMovie.duration}</span>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-cinema-gold transition-colors">
                  <Icon name={isPlaying ? "Pause" : "Play"} size={18} />
                </button>
                <button className="text-cinema-muted hover:text-white transition-colors">
                  <Icon name="Volume2" size={18} />
                </button>
                <button className="text-cinema-muted hover:text-white transition-colors">
                  <Icon name="MessageSquare" size={18} />
                </button>
                <button
                  onClick={() => toggleSave(activeMovie.id)}
                  className={`ml-auto transition-colors ${savedMovies.includes(activeMovie.id) ? "text-cinema-gold" : "text-cinema-muted hover:text-white"}`}
                >
                  <Icon name="Bookmark" size={18} />
                </button>
                <button className="text-cinema-muted hover:text-white transition-colors">
                  <Icon name="Maximize2" size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-cinema-bg/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-cinema-gold flex items-center justify-center">
              <Icon name="Film" size={14} className="text-black" />
            </div>
            <span className="font-display text-lg tracking-wide text-white">СИНЕМА</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {([
              { id: "home", label: "Главная", icon: "Home" },
              { id: "catalog", label: "Каталог", icon: "Grid3X3" },
              { id: "search", label: "Поиск", icon: "Search" },
              { id: "saved", label: "Сохранённое", icon: "Bookmark" },
              { id: "profile", label: "Профиль", icon: "User" },
            ] as { id: Page; label: string; icon: string }[]).map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  page === item.id
                    ? "text-cinema-gold bg-cinema-gold/10"
                    : "text-cinema-muted hover:text-white"
                }`}
              >
                <Icon name={item.icon} size={15} />
                {item.label}
              </button>
            ))}
          </nav>

          <button className="w-8 h-8 rounded-full bg-cinema-surface border border-white/10 flex items-center justify-center">
            <span className="text-xs text-cinema-gold font-medium">АК</span>
          </button>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cinema-bg/95 backdrop-blur-md border-t border-white/5 flex">
        {([
          { id: "home", icon: "Home" },
          { id: "catalog", icon: "Grid3X3" },
          { id: "search", icon: "Search" },
          { id: "saved", icon: "Bookmark" },
          { id: "profile", icon: "User" },
        ] as { id: Page; icon: string }[]).map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`flex-1 py-3 flex items-center justify-center transition-colors ${
              page === item.id ? "text-cinema-gold" : "text-cinema-muted"
            }`}
          >
            <Icon name={item.icon} size={20} />
          </button>
        ))}
      </nav>

      <main className="max-w-6xl mx-auto px-4 pb-24 md:pb-8">
        {/* HOME */}
        {page === "home" && (
          <div>
            <div className="relative -mx-4 h-[70vh] min-h-[500px] overflow-hidden mb-10">
              <img
                key={heroMovie.id}
                src={heroMovie.poster}
                alt={heroMovie.title}
                className="w-full h-full object-cover animate-fade-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-cinema-bg/70 to-transparent" />

              <div className="absolute bottom-0 left-0 p-8 max-w-lg">
                {heroMovie.new && (
                  <span className="inline-block px-2 py-0.5 bg-cinema-gold text-black text-xs font-medium rounded mb-3 tracking-wider uppercase">
                    Новинка
                  </span>
                )}
                <h1 className="font-display text-4xl md:text-5xl text-white mb-3 leading-tight">
                  {heroMovie.title}
                </h1>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Icon name="Star" size={14} className="text-cinema-gold fill-cinema-gold" />
                    <span className="text-cinema-gold font-medium text-sm">{heroMovie.rating}</span>
                  </div>
                  <span className="text-cinema-muted text-sm">{heroMovie.year}</span>
                  <span className="text-cinema-muted text-sm">{heroMovie.duration}</span>
                  {heroMovie.genre.slice(0, 2).map((g) => (
                    <span key={g} className="text-cinema-muted text-sm border border-white/20 rounded px-2 py-0.5 text-xs">
                      {g}
                    </span>
                  ))}
                </div>
                <p className="text-cinema-muted text-sm mb-6 line-clamp-2 leading-relaxed">
                  {heroMovie.description}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openPlayer(heroMovie)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-cinema-gold text-black font-medium rounded-lg hover:bg-cinema-gold/90 transition-all hover:scale-105"
                  >
                    <Icon name="Play" size={16} />
                    Смотреть
                  </button>
                  <button
                    onClick={() => toggleSave(heroMovie.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-all ${
                      savedMovies.includes(heroMovie.id)
                        ? "border-cinema-gold text-cinema-gold bg-cinema-gold/10"
                        : "border-white/20 text-white hover:border-white/40"
                    }`}
                  >
                    <Icon name="Bookmark" size={16} />
                    {savedMovies.includes(heroMovie.id) ? "Сохранено" : "Сохранить"}
                  </button>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 flex gap-2">
                {featuredMovies.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroIndex(i)}
                    className={`transition-all rounded-full ${
                      i === heroIndex ? "w-6 h-2 bg-cinema-gold" : "w-2 h-2 bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            <section className="mb-10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-2xl text-white">Новинки</h2>
                <button
                  onClick={() => setPage("catalog")}
                  className="text-cinema-muted hover:text-cinema-gold text-sm transition-colors flex items-center gap-1"
                >
                  Все фильмы <Icon name="ChevronRight" size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {MOVIES.filter((m) => m.new).map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    saved={savedMovies.includes(movie.id)}
                    onSave={() => toggleSave(movie.id)}
                    onPlay={() => openPlayer(movie)}
                  />
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl text-white mb-5">Рекомендуем</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {MOVIES.slice(0, 4).map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    saved={savedMovies.includes(movie.id)}
                    onSave={() => toggleSave(movie.id)}
                    onPlay={() => openPlayer(movie)}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* CATALOG */}
        {page === "catalog" && (
          <div className="pt-8">
            <h1 className="font-display text-3xl text-white mb-6">Каталог</h1>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => setActiveGenre(g)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm border transition-all ${
                    activeGenre === g
                      ? "bg-cinema-gold border-cinema-gold text-black font-medium"
                      : "border-white/15 text-cinema-muted hover:text-white hover:border-white/30"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between mb-6 text-sm text-cinema-muted">
              <span>{filteredMovies.length} фильмов</span>
              <div className="flex items-center gap-2">
                <span>Сортировка:</span>
                <select className="bg-transparent border border-white/15 rounded px-2 py-1 text-white outline-none cursor-pointer text-xs">
                  <option>По рейтингу</option>
                  <option>По году</option>
                  <option>По названию</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  saved={savedMovies.includes(movie.id)}
                  onSave={() => toggleSave(movie.id)}
                  onPlay={() => openPlayer(movie)}
                />
              ))}
            </div>
            {filteredMovies.length === 0 && (
              <div className="text-center py-20 text-cinema-muted">
                <Icon name="Film" size={40} className="mx-auto mb-3 opacity-30" />
                <p>Фильмы не найдены</p>
              </div>
            )}
          </div>
        )}

        {/* SEARCH */}
        {page === "search" && (
          <div className="pt-8">
            <h1 className="font-display text-3xl text-white mb-6">Поиск</h1>
            <div className="relative mb-8">
              <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cinema-muted" />
              <input
                type="text"
                placeholder="Фильм, актёр, режиссёр..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-cinema-surface border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-cinema-muted outline-none focus:border-cinema-gold/50 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cinema-muted hover:text-white transition-colors"
                >
                  <Icon name="X" size={16} />
                </button>
              )}
            </div>

            {searchQuery === "" ? (
              <div>
                <h3 className="text-cinema-muted text-xs mb-4 uppercase tracking-wider">Популярные жанры</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {GENRES.slice(1).map((g) => (
                    <button
                      key={g}
                      onClick={() => { setActiveGenre(g); setPage("catalog"); }}
                      className="px-4 py-2 bg-cinema-surface border border-white/10 rounded-lg text-sm text-cinema-muted hover:text-white hover:border-white/20 transition-all"
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <h3 className="text-cinema-muted text-xs mb-4 uppercase tracking-wider">Топ фильмов</h3>
                <div className="space-y-3">
                  {[...MOVIES].sort((a, b) => b.rating - a.rating).slice(0, 4).map((movie, i) => (
                    <SearchRow key={movie.id} movie={movie} rank={i + 1} onPlay={() => openPlayer(movie)} />
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-cinema-muted text-sm mb-4">
                  Результаты для <span className="text-white">«{searchQuery}»</span>: {filteredMovies.length}
                </p>
                {filteredMovies.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredMovies.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        saved={savedMovies.includes(movie.id)}
                        onSave={() => toggleSave(movie.id)}
                        onPlay={() => openPlayer(movie)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-cinema-muted">
                    <Icon name="SearchX" size={40} className="mx-auto mb-3 opacity-30" />
                    <p>Ничего не найдено</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SAVED */}
        {page === "saved" && (
          <div className="pt-8">
            <h1 className="font-display text-3xl text-white mb-6">Сохранённое</h1>
            {savedList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {savedList.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    saved={true}
                    onSave={() => toggleSave(movie.id)}
                    onPlay={() => openPlayer(movie)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 text-cinema-muted">
                <Icon name="Bookmark" size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg mb-2">Список пуст</p>
                <p className="text-sm">Сохраняйте фильмы, чтобы смотреть позже</p>
                <button
                  onClick={() => setPage("catalog")}
                  className="mt-6 px-5 py-2.5 bg-cinema-gold text-black rounded-lg font-medium hover:bg-cinema-gold/90 transition-all text-sm"
                >
                  Перейти в каталог
                </button>
              </div>
            )}
          </div>
        )}

        {/* PROFILE */}
        {page === "profile" && (
          <div className="pt-8 max-w-2xl">
            <h1 className="font-display text-3xl text-white mb-8">Профиль</h1>

            <div className="bg-cinema-surface border border-white/8 rounded-2xl p-6 mb-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cinema-gold/60 to-cinema-gold/20 flex items-center justify-center text-xl font-display text-white flex-shrink-0">
                АК
              </div>
              <div className="flex-1">
                <h2 className="text-white font-medium text-lg">Алексей Куликов</h2>
                <p className="text-cinema-muted text-sm">a.kulikov@mail.ru</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-cinema-gold/15 text-cinema-gold text-xs rounded border border-cinema-gold/30">
                    Premium
                  </span>
                  <span className="text-cinema-muted text-xs">до 15 мая 2025</span>
                </div>
              </div>
              <button className="text-cinema-muted hover:text-white transition-colors">
                <Icon name="Settings" size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Просмотрено", value: historyList.length, icon: "Play" },
                { label: "Сохранено", value: savedList.length, icon: "Bookmark" },
                { label: "Подписка", value: "Premium", icon: "Crown" },
              ].map((s) => (
                <div key={s.label} className="bg-cinema-surface border border-white/8 rounded-xl p-4 text-center">
                  <Icon name={s.icon} size={18} className="mx-auto mb-2 text-cinema-gold" />
                  <div className="text-white font-medium">{s.value}</div>
                  <div className="text-cinema-muted text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-display text-xl text-white mb-4">История просмотров</h3>
              <div className="space-y-3">
                {historyList.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex items-center gap-4 bg-cinema-surface border border-white/8 rounded-xl p-3 hover:border-white/15 transition-all group"
                  >
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-14 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">{movie.title}</h4>
                      <p className="text-cinema-muted text-sm">{movie.year} · {movie.duration}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-cinema-gold rounded-full" style={{ width: "68%" }} />
                        </div>
                        <span className="text-cinema-muted text-xs">68%</span>
                      </div>
                    </div>
                    <button
                      onClick={() => openPlayer(movie)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-cinema-gold rounded-full flex-shrink-0"
                    >
                      <Icon name="Play" size={14} className="text-black" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function MovieCard({
  movie,
  saved,
  onSave,
  onPlay,
}: {
  movie: Movie;
  saved: boolean;
  onSave: () => void;
  onPlay: () => void;
}) {
  return (
    <div className="group relative rounded-xl overflow-hidden bg-cinema-surface border border-white/5 hover:border-white/15 transition-all duration-300">
      <div className="aspect-[2/3] overflow-hidden relative cursor-pointer" onClick={onPlay}>
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-cinema-gold flex items-center justify-center shadow-lg shadow-cinema-gold/30 scale-75 group-hover:scale-100 transition-transform duration-300">
            <Icon name="Play" size={20} className="text-black" />
          </div>
        </div>
      </div>

      <div className="absolute top-2 left-2 flex flex-col gap-1">
        {movie.new && (
          <span className="px-1.5 py-0.5 bg-cinema-gold text-black text-[10px] font-bold rounded uppercase tracking-wider">
            New
          </span>
        )}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onSave(); }}
        className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all ${
          saved
            ? "bg-cinema-gold text-black"
            : "bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-cinema-gold hover:text-black"
        }`}
      >
        <Icon name="Bookmark" size={13} />
      </button>

      <div className="p-3">
        <h3 className="text-white text-sm font-medium truncate mb-1">{movie.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-cinema-muted text-xs">{movie.year}</span>
          <div className="flex items-center gap-1">
            <Icon name="Star" size={11} className="text-cinema-gold fill-cinema-gold" />
            <span className="text-cinema-gold text-xs font-medium">{movie.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchRow({
  movie,
  rank,
  onPlay,
}: {
  movie: Movie;
  rank: number;
  onPlay: () => void;
}) {
  return (
    <div
      className="flex items-center gap-4 p-3 rounded-xl hover:bg-cinema-surface transition-all cursor-pointer group"
      onClick={onPlay}
    >
      <span className="text-cinema-muted text-sm w-5 text-center font-display">{rank}</span>
      <img src={movie.poster} alt={movie.title} className="w-10 h-14 object-cover rounded-md flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium text-sm truncate">{movie.title}</h4>
        <p className="text-cinema-muted text-xs">{movie.genre.join(", ")} · {movie.year}</p>
      </div>
      <div className="flex items-center gap-1 mr-2 flex-shrink-0">
        <Icon name="Star" size={12} className="text-cinema-gold fill-cinema-gold" />
        <span className="text-cinema-gold text-sm font-medium">{movie.rating}</span>
      </div>
      <Icon name="Play" size={16} className="text-cinema-muted group-hover:text-cinema-gold transition-colors flex-shrink-0" />
    </div>
  );
}
