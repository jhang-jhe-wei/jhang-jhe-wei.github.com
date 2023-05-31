export default function InstagramLogo ({ mode }: { mode: string }) {
  return (
  <svg width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={ mode == 'dark' ? 'invert dark:invert-0' : 'dark:invert' }>
    <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="black"/>
    <path d="M16 7.75121C18.6785 7.75121 19.0103 7.75121 20.077 7.79862C21.0489 7.84603 21.594 8.01195 21.9496 8.15417C22.4237 8.3438 22.7555 8.55714 23.1111 8.91269C23.4666 9.26825 23.68 9.6001 23.8696 10.0742C24.0118 10.4297 24.1778 10.9512 24.2252 11.9468C24.2726 13.0134 24.2726 13.3216 24.2726 16.0238C24.2726 18.726 24.2726 19.0342 24.2252 20.1008C24.1778 21.0727 24.0118 21.6179 23.8696 21.9734C23.68 22.4475 23.4666 22.7794 23.1111 23.1349C22.7555 23.4905 22.4237 23.7038 21.9496 23.8934C21.594 24.0357 21.0726 24.2016 20.077 24.249C19.0103 24.2964 18.7022 24.2964 16 24.2964C13.3215 24.2964 12.9896 24.2964 11.9229 24.249C10.9511 24.2016 10.4059 24.0357 10.0503 23.8934C9.57627 23.7038 9.24442 23.4905 8.88887 23.1349C8.53331 22.7794 8.31998 22.4475 8.13035 21.9734C7.98813 21.6179 7.8222 21.0964 7.77479 20.1008C7.72738 19.0342 7.72738 18.726 7.72738 16.0238C7.72738 13.3216 7.72738 13.0134 7.77479 11.9468C7.8222 10.9749 7.98813 10.4297 8.13035 10.0742C8.31998 9.6001 8.53331 9.26825 8.88887 8.91269C9.24442 8.55714 9.57627 8.3438 10.0503 8.15417C10.4059 8.01195 10.9274 7.84603 11.9229 7.79862C12.9896 7.75121 13.3215 7.75121 16 7.75121ZM16 5.92603C13.2741 5.92603 12.9185 5.92603 11.8518 5.99714C10.7852 6.04454 10.0503 6.21047 9.41035 6.47121C8.74664 6.73195 8.17776 7.0638 7.63257 7.63269C7.06368 8.20158 6.73183 8.74677 6.47109 9.41047C6.21035 10.0505 6.04442 10.7853 5.99701 11.852C5.9259 12.9186 5.9259 13.2742 5.9259 16.0001C5.9259 18.726 5.9259 19.0816 5.99701 20.1482C6.04442 21.2149 6.21035 21.9497 6.47109 22.5897C6.73183 23.2534 7.06368 23.8223 7.63257 24.3675C8.20146 24.9364 8.74664 25.2682 9.41035 25.529C10.0503 25.7897 10.7852 25.9557 11.8518 26.0031C12.9185 26.0505 13.2741 26.0742 16 26.0742C18.7259 26.0742 19.0815 26.0742 20.1481 26.0031C21.2148 25.9557 21.9496 25.7897 22.5896 25.529C23.2533 25.2682 23.8222 24.9364 24.3674 24.3675C24.9363 23.7986 25.2681 23.2534 25.5289 22.5897C25.7896 21.9497 25.9555 21.2149 26.0029 20.1482C26.0503 19.0816 26.074 18.726 26.074 16.0001C26.074 13.2742 26.074 12.9186 26.0029 11.852C25.9555 10.7853 25.7896 10.0505 25.5289 9.41047C25.2681 8.74677 24.9363 8.17788 24.3674 7.63269C23.7985 7.0638 23.2533 6.73195 22.5896 6.47121C21.9496 6.21047 21.2148 6.04454 20.1481 5.99714C19.0815 5.92603 18.7259 5.92603 16 5.92603Z" fill="white"/>
    <path d="M15.9999 10.8328C13.1318 10.8328 10.8325 13.1557 10.8325 16.0002C10.8325 18.8446 13.1555 21.1676 15.9999 21.1676C18.8681 21.1676 21.1673 18.8446 21.1673 16.0002C21.1673 13.1557 18.8681 10.8328 15.9999 10.8328ZM15.9999 19.3661C14.151 19.3661 12.634 17.8728 12.634 16.0002C12.634 14.1276 14.1273 12.6342 15.9999 12.6342C17.8725 12.6342 19.3659 14.1276 19.3659 16.0002C19.3659 17.8728 17.8488 19.3661 15.9999 19.3661Z" fill="white"/>
    <path d="M21.3808 11.8282C22.0484 11.8282 22.5897 11.2869 22.5897 10.6193C22.5897 9.95164 22.0484 9.4104 21.3808 9.4104C20.7131 9.4104 20.1719 9.95164 20.1719 10.6193C20.1719 11.2869 20.7131 11.8282 21.3808 11.8282Z" fill="white"/>
  </svg>
  )
}
