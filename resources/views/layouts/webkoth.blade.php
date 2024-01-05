<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-gray-50">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" href="favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
    <link rel="manifest" href="/site.webmanifest">
    <meta name="twitter:site" content="@webkoth" inertia>
    <meta name="twitter:title" content="TALL Stack Components - Webkoth UI" inertia>
    <meta name="twitter:description" content="Beautiful UI components and templates by the creators of Webkoth UI."
        inertia>
    <meta name="twitter:image" content="https://tailwindui.com/img/og-default.png" inertia>
    <meta name="twitter:creator" content="@tailwindcss" inertia>
    <meta property="og:url" content="https://www.webkoth.com/" inertia>
    <meta property="og:type" content="article" inertia>
    <meta property="og:title" content="TALL UI Components - Webkoth UI" inertia>
    <meta property="og:description" content="Beautiful UI components and templates by the creators of Tailwind CSS."
        inertia>
    <meta property="og:image" content="https://tailwindui.com/img/og-default.png" inertia>
    <meta property="description" content="Beautiful UI components and templates by the creators of Webkoth UI." inertia>
    <title>{{ config('app.name', 'Webkoth') }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js', 'resources/css/components.css', 'resources/css/styles.css', 'resources/js/components.js'])
</head>

<body class="bg-white">
    <div class="container mx-auto">
        <header class="inset-x-0 top-0 z-50">
            <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div class="flex lg:flex-1">
                    <a href="#" class="-m-1.5 p-1.5">
                        <svg width="200" height="83" viewBox="0 0 207 86" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <circle cx="36.6588" cy="43.2314" r="34.1588" stroke="#1ABC9C" stroke-width="5" />
                            <circle cx="18.3294" cy="73.7804" r="9.7196" fill="#34495E" stroke="#34495E"
                                stroke-width="5" />
                            <circle cx="54.9882" cy="12.6824" r="9.7196" fill="#1ABC9C" stroke="#1ABC9C"
                                stroke-width="5" />
                            <path
                                d="M52.4882 43.2314C52.4882 51.9737 45.4011 59.0608 36.6588 59.0608C27.9165 59.0608 20.8294 51.9737 20.8294 43.2314C20.8294 34.489 27.9165 27.402 36.6588 27.402C45.4011 27.402 52.4882 34.489 52.4882 43.2314Z"
                                fill="#1ABC9C" stroke="#34495E" stroke-width="5" />
                            <path
                                d="M89.0805 53.2113L84.7105 37.9386H88.2378L90.7659 48.5504H90.8927L93.6817 37.9386H96.702L99.4836 48.5728H99.6178L102.146 37.9386H105.673L101.303 53.2113H98.1562L95.2478 43.2259H95.1285L92.2275 53.2113H89.0805ZM111.331 53.435C110.153 53.435 109.139 53.1964 108.289 52.7191C107.444 52.2369 106.792 51.5558 106.335 50.6758C105.878 49.7908 105.649 48.7443 105.649 47.5362C105.649 46.358 105.878 45.3239 106.335 44.434C106.792 43.544 107.436 42.8505 108.267 42.3533C109.102 41.8562 110.081 41.6076 111.205 41.6076C111.96 41.6076 112.664 41.7294 113.315 41.973C113.971 42.2117 114.543 42.5721 115.03 43.0543C115.523 43.5366 115.905 44.1431 116.179 44.8739C116.452 45.5998 116.589 46.4499 116.589 47.4244V48.2969H106.917V46.3281H113.599C113.599 45.8707 113.499 45.4656 113.3 45.1126C113.101 44.7596 112.825 44.4837 112.472 44.2848C112.124 44.081 111.719 43.9791 111.257 43.9791C110.775 43.9791 110.347 44.0909 109.974 44.3146C109.606 44.5334 109.318 44.8292 109.109 45.2021C108.9 45.57 108.793 45.9801 108.789 46.4325V48.3043C108.789 48.8711 108.893 49.3608 109.102 49.7734C109.316 50.1861 109.616 50.5043 110.004 50.728C110.392 50.9517 110.852 51.0636 111.384 51.0636C111.737 51.0636 112.06 51.0139 112.353 50.9144C112.646 50.815 112.898 50.6658 113.106 50.467C113.315 50.2681 113.474 50.0245 113.584 49.7362L116.522 49.9301C116.373 50.636 116.067 51.2525 115.605 51.7795C115.147 52.3015 114.556 52.7092 113.83 53.0025C113.109 53.2908 112.276 53.435 111.331 53.435ZM118.722 53.2113V37.9386H121.899V43.6808H121.996C122.135 43.3725 122.336 43.0593 122.6 42.7411C122.868 42.418 123.216 42.1495 123.644 41.9357C124.076 41.717 124.613 41.6076 125.254 41.6076C126.09 41.6076 126.86 41.8264 127.566 42.2639C128.272 42.6964 128.836 43.3502 129.259 44.2252C129.682 45.0952 129.893 46.1864 129.893 47.4989C129.893 48.7766 129.687 49.8555 129.274 50.7355C128.866 51.6105 128.309 52.2742 127.604 52.7266C126.903 53.174 126.117 53.3977 125.247 53.3977C124.63 53.3977 124.106 53.2958 123.673 53.092C123.246 52.8882 122.895 52.6321 122.622 52.3239C122.349 52.0107 122.14 51.695 121.996 51.3768H121.854V53.2113H118.722ZM121.831 47.484C121.831 48.1651 121.926 48.7592 122.115 49.2663C122.304 49.7734 122.577 50.1687 122.935 50.4521C123.293 50.7305 123.728 50.8697 124.24 50.8697C124.757 50.8697 125.195 50.728 125.553 50.4446C125.911 50.1563 126.182 49.7585 126.366 49.2514C126.555 48.7394 126.649 48.1502 126.649 47.484C126.649 46.8228 126.557 46.2411 126.373 45.739C126.189 45.2369 125.918 44.8441 125.56 44.5607C125.202 44.2774 124.762 44.1357 124.24 44.1357C123.723 44.1357 123.286 44.2724 122.928 44.5458C122.575 44.8193 122.304 45.207 122.115 45.7092C121.926 46.2113 121.831 46.8029 121.831 47.484ZM134.891 49.9151L134.899 46.1044H135.361L139.03 41.7568H142.677L137.747 47.5139H136.994L134.891 49.9151ZM132.013 53.2113V37.9386H135.19V53.2113H132.013ZM139.172 53.2113L135.801 48.2223L137.919 45.9776L142.893 53.2113H139.172ZM148.939 53.435C147.781 53.435 146.779 53.1889 145.934 52.6967C145.094 52.1996 144.445 51.5085 143.987 50.6236C143.53 49.7337 143.301 48.7021 143.301 47.5288C143.301 46.3455 143.53 45.3114 143.987 44.4265C144.445 43.5366 145.094 42.8455 145.934 42.3533C146.779 41.8562 147.781 41.6076 148.939 41.6076C150.097 41.6076 151.097 41.8562 151.937 42.3533C152.782 42.8455 153.433 43.5366 153.891 44.4265C154.348 45.3114 154.577 46.3455 154.577 47.5288C154.577 48.7021 154.348 49.7337 153.891 50.6236C153.433 51.5085 152.782 52.1996 151.937 52.6967C151.097 53.1889 150.097 53.435 148.939 53.435ZM148.954 50.9741C149.481 50.9741 149.921 50.8249 150.274 50.5266C150.627 50.2234 150.893 49.8107 151.072 49.2887C151.256 48.7667 151.348 48.1726 151.348 47.5064C151.348 46.8402 151.256 46.2461 151.072 45.7241C150.893 45.2021 150.627 44.7894 150.274 44.4862C149.921 44.1829 149.481 44.0313 148.954 44.0313C148.422 44.0313 147.975 44.1829 147.612 44.4862C147.254 44.7894 146.983 45.2021 146.799 45.7241C146.62 46.2461 146.53 46.8402 146.53 47.5064C146.53 48.1726 146.62 48.7667 146.799 49.2887C146.983 49.8107 147.254 50.2234 147.612 50.5266C147.975 50.8249 148.422 50.9741 148.954 50.9741ZM162.735 41.7568V44.1431H155.837V41.7568H162.735ZM157.403 39.0124H160.58V49.6914C160.58 49.9847 160.625 50.2134 160.714 50.3775C160.804 50.5366 160.928 50.6484 161.087 50.7131C161.251 50.7777 161.44 50.81 161.654 50.81C161.803 50.81 161.952 50.7976 162.101 50.7727C162.251 50.7429 162.365 50.7205 162.444 50.7056L162.944 53.0696C162.785 53.1193 162.561 53.1765 162.273 53.2411C161.985 53.3107 161.634 53.353 161.221 53.3679C160.456 53.3977 159.785 53.2958 159.208 53.0622C158.636 52.8285 158.191 52.4656 157.873 51.9734C157.555 51.4812 157.398 50.8597 157.403 50.109V39.0124ZM168.228 46.5891V53.2113H165.051V37.9386H168.138V43.7777H168.272C168.531 43.1016 168.949 42.5721 169.525 42.1893C170.102 41.8015 170.825 41.6076 171.695 41.6076C172.491 41.6076 173.184 41.7816 173.776 42.1296C174.373 42.4727 174.835 42.9673 175.163 43.6136C175.496 44.255 175.66 45.0231 175.655 45.918V53.2113H172.478V46.4847C172.483 45.7788 172.304 45.2294 171.941 44.8367C171.583 44.4439 171.081 44.2475 170.435 44.2475C170.002 44.2475 169.62 44.3395 169.287 44.5234C168.958 44.7074 168.7 44.9759 168.511 45.3288C168.327 45.6769 168.233 46.097 168.228 46.5891ZM192.509 37.9386H195.738V47.8569C195.738 48.9705 195.472 49.945 194.94 50.7802C194.413 51.6154 193.675 52.2667 192.725 52.734C191.776 53.1964 190.669 53.4276 189.407 53.4276C188.139 53.4276 187.03 53.1964 186.081 52.734C185.131 52.2667 184.393 51.6154 183.866 50.7802C183.339 49.945 183.075 48.9705 183.075 47.8569V37.9386H186.304V47.581C186.304 48.1627 186.431 48.6797 186.685 49.1321C186.943 49.5845 187.306 49.94 187.773 50.1985C188.241 50.457 188.785 50.5863 189.407 50.5863C190.033 50.5863 190.577 50.457 191.04 50.1985C191.507 49.94 191.868 49.5845 192.121 49.1321C192.38 48.6797 192.509 48.1627 192.509 47.581V37.9386ZM201.624 37.9386V53.2113H198.395V37.9386H201.624Z"
                                fill="#34495E" />
                        </svg>
                    </a>
                </div>
                <div class="flex lg:hidden">
                    <button type="button"
                        class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
                        <span class="sr-only">Open main menu</span>
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                            aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
                <div class="flex justify-start lg:flex lg:gap-x-12 lg:justify-end">
                    <a href="#" class="text-sm font-semibold leading-6 text-wk-gray">Product</a>
                    <a href="#" class="text-sm font-semibold leading-6 text-wk-gray">Features</a>
                    <a href="#" class="text-sm font-semibold leading-6 text-wk-gray">Marketplace</a>
                    <a href="#" class="text-sm font-semibold leading-6 text-wk-gray">Company</a>
                </div>
                <div class="hidden lg:flex lg:flex-1 lg:justify-end">
                    <a href="#" class="text-sm font-semibold leading-6 text-gray-900">Log in <span
                            aria-hidden="true">&rarr;</span></a>
                </div>
            </nav>
            <!-- Mobile menu, show/hide based on menu open state. -->
            <div class="lg:hidden" role="dialog" aria-modal="true">
                <!-- Background backdrop, show/hide based on slide-over state. -->
                <div class="fixed inset-0 z-50"></div>
                <div
                    class="fixed inset-y-0 right-0 z-50 w-full px-6 py-6 overflow-y-auto bg-white sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div class="flex items-center justify-between">
                        <a href="#" class="-m-1.5 p-1.5">
                            <span class="sr-only">Your Company</span>
                            <img class="w-auto h-8"
                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="">
                        </a>
                        <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700">
                            <span class="sr-only">Close menu</span>
                            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div class="flow-root mt-6">
                        <div class="-my-6 divide-y divide-gray-500/10">
                            <div class="py-6 space-y-2">
                                <a href="#"
                                    class="block px-3 py-2 -mx-3 text-base font-semibold leading-7 text-gray-900 rounded-lg hover:bg-gray-50">Product</a>
                                <a href="#"
                                    class="block px-3 py-2 -mx-3 text-base font-semibold leading-7 text-gray-900 rounded-lg hover:bg-gray-50">Features</a>
                                <a href="#"
                                    class="block px-3 py-2 -mx-3 text-base font-semibold leading-7 text-gray-900 rounded-lg hover:bg-gray-50">Marketplace</a>
                                <a href="#"
                                    class="block px-3 py-2 -mx-3 text-base font-semibold leading-7 text-gray-900 rounded-lg hover:bg-gray-50">Company</a>
                            </div>
                            <div class="py-6">
                                <a href="#"
                                    class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Log
                                    in</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>



        <div class="relative isolate pt-14">
            <svg class="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                aria-hidden="true">
                <defs>
                    <pattern id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527" width="200" height="200" x="50%" y="-1"
                        patternUnits="userSpaceOnUse">
                        <path d="M100 200V.5M.5 .5H200" fill="none" />
                    </pattern>
                </defs>
                <svg x="50%" y="-1" class="overflow-visible fill-gray-50">
                    <path
                        d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                        stroke-width="0" />
                </svg>
                <rect width="100%" height="100%" stroke-width="0"
                    fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
            </svg>
            <div class="px-6 py-12 max-w-7xl sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:py-12">
                <div class="lg:mx-0 lg:flex-auto">
                    <h1 class="mt-10 text-4xl font-bold tracking-tight text-wk-gray sm:text-6xl">
                        <span class="text-wk-green">WEBKOTH UI:</span>
                        Готовые
                        TALL компоненты для современных веб-интерфейсов
                    </h1>
                    <p class="mt-6 text-lg leading-8 text-wk-gray">Откройте мир готовых компонентов для вашего
                        веб-проекта с WEBKOTH UI. На основе TALL стека, наши компоненты позволяют вам легко создавать
                        современные и отзывчивые интерфейсы. Используйте элементы Atomic Design для удобства и гибкости
                        в разработке. От атомов до страниц — ваш путь к стильному веб-дизайну начинается здесь.</p>
                    <div class="flex mt-5">
                        <div class="grid w-full grid-cols-2 gap-y-10 sm:gap-y-0 sm:grid-cols-4">
                            <a href="https://tailwindcss.com" target="_blank"
                                class="relative flex flex-col items-center justify-center w-full h-16 font-bold text-center transition-all duration-300 ease-out hover:-rotate-3 group hover:scale-105"
                                x-data="{ isHovered: false }" @mouseover="isHovered = true"
                                @mouseleave="isHovered = false">
                                <div class="flex items-center justify-center w-full h-12 mb-2">
                                    <svg class="w-auto h-full" viewBox="0 0 200 120" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M100 0C73.333 0 56.667 13.333 50 40c10-13.333 21.667-18.333 35-15 7.607 1.9 13.044 7.422 19.063 13.53C113.867 48.48 125.215 60 150 60c26.667 0 43.333-13.333 50-40-10 13.333-21.667 18.333-35 15-7.607-1.9-13.044-7.422-19.063-13.53C136.133 11.52 124.785 0 100 0ZM50 60C23.333 60 6.667 73.333 0 100c10-13.333 21.667-18.333 35-15 7.607 1.904 13.044 7.422 19.063 13.53C63.867 108.48 75.215 120 100 120c26.667 0 43.333-13.333 50-40-10 13.333-21.667 18.333-35 15-7.607-1.9-13.044-7.422-19.063-13.53C86.133 71.52 74.785 60 50 60Z"
                                            fill="#38BDF8" class=""></path>
                                    </svg>
                                </div>
                                <p class="transition-all duration-300 ease-out scale-0 group-hover:scale-100 text-wk-gray"
                                    x-show="isHovered" x-transition:enter="transition ease-out duration-300"
                                    x-transition:enter-start="opacity-0 scale-90"
                                    x-transition:enter-end="opacity-100 scale-100"
                                    x-transition:leave="transition ease-in duration-300"
                                    x-transition:leave-start="opacity-100 scale-100"
                                    x-transition:leave-end="opacity-0 scale-90">
                                    Tailwind CSS</p>
                            </a>
                            <a href="https://alpinejs.dev" target="_blank"
                                class="flex flex-col items-center justify-center w-full h-16 font-bold text-center transition-all duration-300 ease-out hover:-rotate-3 group hover:scale-105"
                                x-data="{ isHovered: false }" @mouseover="isHovered = true"
                                @mouseleave="isHovered = false">
                                <div class="flex items-center justify-center w-full h-10 mb-2">
                                    <svg class="w-auto h-full" viewBox="0 0 200 92" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M155.556 0 200 44.25l-44.444 44.249-44.445-44.25L155.556 0Z"
                                            fill="#77C1D2" class=""></path>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="m44.444 0 92.139 91.735H47.694L0 44.249 44.444 0Z" fill="#2D3441"
                                            class=""></path>
                                    </svg>
                                </div>
                                <p class="transition-all duration-300 ease-out scale-0 group-hover:scale-100 text-wk-gray"
                                    x-show="isHovered" x-transition:enter="transition ease-out duration-300"
                                    x-transition:enter-start="opacity-0 scale-90"
                                    x-transition:enter-end="opacity-100 scale-100"
                                    x-transition:leave="transition ease-in duration-300"
                                    x-transition:leave-start="opacity-100 scale-100"
                                    x-transition:leave-end="opacity-0 scale-90">AlpineJS
                                </p>
                            </a>
                            <a href="https://laravel.com" target="_blank"
                                class="flex flex-col items-center justify-center w-full h-16 font-bold text-center transition-all duration-300 ease-out hover:-rotate-3 group hover:scale-105"
                                x-data="{ isHovered: false }" @mouseover="isHovered = true"
                                @mouseleave="isHovered = false">
                                <div class="flex items-center justify-center w-full h-16 mb-2">
                                    <svg class="w-auto h-full" viewBox="0 0 200 206" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M199.887 46.582c.074.275.112.558.113.842v44.198a3.226 3.226 0 0 1-1.619 2.796l-37.093 21.358v42.333a3.231 3.231 0 0 1-1.611 2.796l-77.428 44.576c-.177.101-.37.166-.564.234-.072.024-.14.069-.217.089a3.254 3.254 0 0 1-1.652 0c-.088-.024-.169-.073-.253-.105-.178-.065-.363-.121-.532-.218L1.619 160.905A3.23 3.23 0 0 1 0 158.109V25.514c0-.29.04-.572.113-.845.024-.093.08-.178.113-.27.06-.17.116-.343.205-.5.06-.105.149-.19.222-.286.092-.129.177-.262.285-.374.093-.093.214-.162.319-.242.117-.097.221-.202.354-.278h.004L40.323.43a3.23 3.23 0 0 1 3.222 0l38.708 22.288h.008c.13.08.238.181.355.274.104.08.221.153.314.242.113.116.193.25.29.378.068.097.161.181.217.286.093.161.145.33.21.5.032.092.088.177.113.274.074.274.112.557.112.842v82.817l32.256-18.575V47.42c0-.282.04-.568.112-.838.029-.096.081-.18.113-.274.065-.169.121-.342.21-.5.06-.104.149-.188.217-.285.097-.129.177-.262.29-.375.093-.092.21-.16.314-.241.121-.097.226-.202.355-.278h.004l38.712-22.289a3.224 3.224 0 0 1 3.222 0l38.708 22.289c.137.08.241.18.362.274.101.08.218.153.31.241.113.117.194.25.29.379.073.097.162.181.218.286.093.157.145.33.209.5.037.092.089.177.113.273Zm-6.34 43.175V53.003l-13.545 7.8-18.714 10.775v36.754l32.263-18.575h-.004Zm-38.707 66.487v-36.778l-18.408 10.514-52.564 30.002v37.125l70.972-40.863ZM6.453 31.094v125.15l70.963 40.859v-37.117l-37.073-20.983-.012-.008-.016-.008c-.125-.073-.23-.177-.346-.266-.101-.081-.218-.145-.306-.234l-.009-.012c-.104-.1-.177-.225-.265-.338-.081-.109-.178-.202-.242-.314l-.004-.012c-.073-.121-.117-.266-.17-.403-.052-.121-.12-.234-.152-.363v-.004c-.04-.153-.049-.314-.065-.471-.016-.121-.048-.242-.048-.363V49.668l-18.71-10.78-13.545-7.79v-.004ZM41.938 6.948 9.687 25.515 41.93 44.08l32.247-18.57L41.93 6.948h.008ZM58.71 122.817l18.71-10.771V31.094l-13.546 7.798L45.16 49.668v80.952l13.55-7.803Zm99.356-93.959-32.247 18.566 32.247 18.567 32.243-18.57-32.243-18.563Zm-3.226 42.72-18.714-10.776-13.546-7.799v36.754l18.71 10.772 13.55 7.803V71.578Zm-74.202 82.825 47.299-27.006 23.644-13.494-32.223-18.554-37.1 21.361-33.815 19.469 32.195 18.224Z"
                                            fill="#FF2D20"></path>
                                    </svg>
                                </div>
                                <p class="transition-all duration-300 ease-out scale-0 group-hover:scale-100 text-wk-gray"
                                    x-show="isHovered" x-transition:enter="transition ease-out duration-300"
                                    x-transition:enter-start="opacity-0 scale-90"
                                    x-transition:enter-end="opacity-100 scale-100"
                                    x-transition:leave="transition ease-in duration-300"
                                    x-transition:leave-start="opacity-100 scale-100"
                                    x-transition:leave-end="opacity-0 scale-90">Laravel
                                </p>
                            </a>
                            <a href="https://livewire.laravel.com/" target="_blank"
                                class="flex flex-col items-center justify-center w-full h-16 font-bold text-center transition-all duration-300 ease-out hover:-rotate-3 group hover:scale-105"
                                x-data="{ isHovered: false }" @mouseover="isHovered = true"
                                @mouseleave="isHovered = false">
                                <div class="flex items-center justify-center w-full h-16 mb-2">
                                    <svg class="w-auto h-full" viewBox="0 0 200 228" height="228" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M189.821 151.122c-3.708 5.607-6.525 12.514-14.065 12.514-12.688 0-13.374-19.565-26.069-19.565-12.695 0-12.009 19.565-24.698 19.565-12.688 0-13.374-19.565-26.07-19.565-12.695 0-12.009 19.565-24.697 19.565-12.688 0-13.374-19.565-26.07-19.565-12.695 0-12.009 19.565-24.697 19.565-3.988 0-6.79-1.932-9.152-4.582C5.223 143.253 0 124.737 0 104.941 0 46.984 44.772 0 100 0s100 46.984 100 104.941c0 16.571-3.66 32.246-10.179 46.181Z"
                                            fill="#FB70A9"></path>
                                        <mask id="a" style="mask-type:alpha" maskUnits="userSpaceOnUse"
                                            x="31" y="122" width="133" height="106">
                                            <path
                                                d="M60.065 140.762v43.467c0 7.8-6.323 14.123-14.123 14.123-7.8 0-14.124-6.323-14.124-14.123v-52.474c2.636-4.838 5.647-9.028 11.076-9.028 8.838 0 11.926 11.102 17.17 18.035Zm53.355 2.265v68.735c0 8.667-7.026 15.693-15.693 15.693-8.666 0-15.692-7.026-15.692-15.693v-77.795c2.955-5.698 6-11.24 12.245-11.24 9.885 0 12.577 13.891 19.14 20.3Zm50.216-1.262v49.9c0 7.801-6.323 14.124-14.123 14.124-7.8 0-14.123-6.323-14.123-14.124v-61.332c2.459-4.209 5.387-7.606 10.275-7.606 9.278 0 12.219 12.236 17.971 19.038Z"
                                                fill="#fff"></path>
                                        </mask>
                                        <g mask="url(#a)">
                                            <path
                                                d="M60.065 140.762v43.467c0 7.8-6.323 14.123-14.123 14.123-7.8 0-14.124-6.323-14.124-14.123v-52.474c2.636-4.838 5.647-9.028 11.076-9.028 8.838 0 11.926 11.102 17.17 18.035Zm53.355 2.265v68.735c0 8.667-7.026 15.693-15.693 15.693-8.666 0-15.692-7.026-15.692-15.693v-77.795c2.955-5.698 6-11.24 12.245-11.24 9.885 0 12.577 13.891 19.14 20.3Zm50.216-1.262v49.9c0 7.801-6.323 14.124-14.123 14.124-7.8 0-14.123-6.323-14.123-14.124v-61.332c2.459-4.209 5.387-7.606 10.275-7.606 9.278 0 12.219 12.236 17.971 19.038Z"
                                                fill="#4E56A6" class=""></path>
                                        </g>
                                        <mask id="b" style="mask-type:alpha" maskUnits="userSpaceOnUse"
                                            x="31" y="97" width="133" height="73">
                                            <path
                                                d="M60.065 154.084c-2.505-3.068-5.471-5.344-9.76-5.344-10.185 0-12.054 12.835-18.487 18.622v-55.365c0-7.8 6.323-14.123 14.124-14.123 7.8 0 14.123 6.323 14.123 14.123v42.087Zm53.355.99c-2.672-3.555-5.795-6.334-10.535-6.334-11.33 0-12.37 15.887-20.85 20.28v-24.485c0-8.667 7.026-15.693 15.692-15.693 8.667 0 15.693 7.026 15.693 15.693v10.539Zm50.216-2.748c-2.174-2.14-4.752-3.586-8.17-3.586-10.977 0-12.295 14.909-20.076 19.835v-49.696c0-7.8 6.323-14.124 14.123-14.124 7.8 0 14.123 6.324 14.123 14.124v33.447Z"
                                                fill="#fff"></path>
                                        </mask>
                                        <g mask="url(#b)">
                                            <path
                                                d="M60.065 154.084c-2.505-3.068-5.471-5.344-9.76-5.344-10.185 0-12.054 12.835-18.487 18.622v-55.365c0-7.8 6.323-14.123 14.124-14.123 7.8 0 14.123 6.323 14.123 14.123v42.087Zm53.355.99c-2.672-3.555-5.795-6.334-10.535-6.334-11.33 0-12.37 15.887-20.85 20.28v-24.485c0-8.667 7.026-15.693 15.692-15.693 8.667 0 15.693 7.026 15.693 15.693v10.539Zm50.216-2.748c-2.174-2.14-4.752-3.586-8.17-3.586-10.977 0-12.295 14.909-20.076 19.835v-49.696c0-7.8 6.323-14.124 14.123-14.124 7.8 0 14.123 6.324 14.123 14.124v33.447Z"
                                                fill="#000" fill-opacity=".299"></path>
                                        </g>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M189.821 151.122c-3.708 5.607-6.525 12.514-14.065 12.514-12.688 0-13.374-19.565-26.069-19.565-12.695 0-12.009 19.565-24.698 19.565-12.688 0-13.374-19.565-26.07-19.565-12.695 0-12.009 19.565-24.697 19.565-12.688 0-13.374-19.565-26.07-19.565-12.695 0-12.009 19.565-24.697 19.565-3.988 0-6.79-1.932-9.152-4.582C5.223 143.253 0 124.737 0 104.941 0 46.984 44.772 0 100 0s100 46.984 100 104.941c0 16.571-3.66 32.246-10.179 46.181Z"
                                            fill="#FB70A9" class=""></path>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M168.182 161.546c26.205-38.985 26.883-82.227 2.031-129.728C188.634 50.69 200 76.587 200 105.162c0 16.509-3.794 32.124-10.55 46.007-3.844 5.586-6.764 12.467-14.579 12.467-2.674 0-4.834-.806-6.689-2.09Z"
                                            fill="#E24CA6"></path>
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M94.639 131.119c34.775 0 49.417-20.174 49.417-48.824s-22.125-55.022-49.417-55.022c-27.293 0-49.417 26.372-49.417 55.022s14.642 48.824 49.417 48.824Z"
                                            fill="#fff"></path>
                                        <path
                                            d="M81.352 83.916c10.234 0 18.531-9.158 18.531-20.454 0-11.297-8.296-20.455-18.531-20.455S62.82 52.165 62.82 63.462c0 11.296 8.297 20.454 18.532 20.454Z"
                                            fill="#030776"></path>
                                        <path
                                            d="M78.263 68.182c5.118 0 9.266-4.227 9.266-9.44 0-5.215-4.148-9.441-9.266-9.441-5.117 0-9.266 4.226-9.266 9.44 0 5.214 4.149 9.44 9.266 9.44Z"
                                            fill="#fff"></path>
                                    </svg>
                                </div>
                                <p class="transition-all duration-300 ease-out scale-0 group-hover:scale-100 text-wk-gray"
                                    x-show="isHovered" x-transition:enter="transition ease-out duration-300"
                                    x-transition:enter-start="opacity-0 scale-90"
                                    x-transition:enter-end="opacity-100 scale-100"
                                    x-transition:leave="transition ease-in duration-300"
                                    x-transition:leave-start="opacity-100 scale-100"
                                    x-transition:leave-end="opacity-0 scale-90">Livewire
                                </p>
                            </a>
                        </div>
                    </div>
                    <div class="flex items-center mt-10 gap-x-6">
                        <a href="#"
                            class="rounded-md bg-wk-green px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Get
                            started</a>
                        <a href="#" class="text-sm font-semibold leading-6 text-gray-900">Learn more <span
                                aria-hidden="true">→</span></a>
                    </div>
                </div>
                <div class="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
                    <svg viewBox="0 0 366 729" role="img"
                        class="mx-auto w-[22.875rem] max-w-full drop-shadow-xl">
                        <title>App screenshot</title>
                        <defs>
                            <clipPath id="2ade4387-9c63-4fc4-b754-10e687a0d332">
                                <rect width="316" height="684" rx="36" />
                            </clipPath>
                        </defs>
                        <path fill="#4B5563"
                            d="M363.315 64.213C363.315 22.99 341.312 1 300.092 1H66.751C25.53 1 3.528 22.99 3.528 64.213v44.68l-.857.143A2 2 0 0 0 1 111.009v24.611a2 2 0 0 0 1.671 1.973l.95.158a2.26 2.26 0 0 1-.093.236v26.173c.212.1.398.296.541.643l-1.398.233A2 2 0 0 0 1 167.009v47.611a2 2 0 0 0 1.671 1.973l1.368.228c-.139.319-.314.533-.511.653v16.637c.221.104.414.313.56.689l-1.417.236A2 2 0 0 0 1 237.009v47.611a2 2 0 0 0 1.671 1.973l1.347.225c-.135.294-.302.493-.49.607v377.681c0 41.213 22 63.208 63.223 63.208h95.074c.947-.504 2.717-.843 4.745-.843l.141.001h.194l.086-.001 33.704.005c1.849.043 3.442.37 4.323.838h95.074c41.222 0 63.223-21.999 63.223-63.212v-394.63c-.259-.275-.48-.796-.63-1.47l-.011-.133 1.655-.276A2 2 0 0 0 366 266.62v-77.611a2 2 0 0 0-1.671-1.973l-1.712-.285c.148-.839.396-1.491.698-1.811V64.213Z" />
                        <path fill="#343E4E"
                            d="M16 59c0-23.748 19.252-43 43-43h246c23.748 0 43 19.252 43 43v615c0 23.196-18.804 42-42 42H58c-23.196 0-42-18.804-42-42V59Z" />
                        <foreignObject width="316" height="684" transform="translate(24 24)"
                            clip-path="url(#2ade4387-9c63-4fc4-b754-10e687a0d332)">
                            <img src="https://tailwindui.com/img/component-images/mobile-app-screenshot.png"
                                alt="" />
                        </foreignObject>
                    </svg>
                </div>
            </div>
        </div>
    </div>

</body>

</html>
