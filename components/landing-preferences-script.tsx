// Предпочтения посетителя, которые должны примениться до первой отрисовки:
// палитра (warm/classic) и моноширинный шрифт (jetbrains/geist). Оба живут
// классами на <html>; тумблеры в шапке меняют класс и пишут в localStorage.
const SCRIPT = `
(function() {
  try {
    var html = document.documentElement;
    var palette = localStorage.getItem('palette');
    if (palette === 'classic') html.classList.add('palette-classic');
    var mono = localStorage.getItem('mono');
    if (mono === 'geist') html.classList.add('mono-geist');
  } catch (e) {}
})();
`;

export function LandingPreferencesScript() {
  return (
    <script
      // No-flash: runs before paint. Inline + sync.
      dangerouslySetInnerHTML={{ __html: SCRIPT }}
    />
  );
}
