export default function SiteFooter({ wordmark }: { wordmark: string }) {
  return (
    <footer>
      <a className="wordmark" href="#home">{wordmark}</a>
      <p>Original art & photography</p>
      <p>© 2026</p>
    </footer>
  );
}

