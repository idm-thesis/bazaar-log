export default function loadEraStyles(era: string) {
    const existingLink = document.querySelector("#winbox-era-styles");

    if (existingLink) {
        existingLink.remove();
    }
    const link = document.createElement("link");
    link.id = "winbox-era-styles";
    link.rel = "stylesheet";
    link.href = `/styles/winbox-${era}.css`;

    document.head.appendChild(link);
}