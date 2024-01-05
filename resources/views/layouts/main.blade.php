<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-gray-50">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" href="favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
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

<body class="h-full">
    <div>
        <div x-data="{ isOpen: false }" class="relative z-50 lg:hidden" role="dialog" aria-modal="true">

            <div x-show="isOpen" @click="isOpen = false"
                x-transition:enter="transition-opacity ease-linear duration-300" x-transition:enter-start="opacity-0"
                x-transition:enter-end="opacity-100" x-transition:leave="transition-opacity ease-linear duration-300"
                x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0"
                class="fixed inset-0 bg-gray-900/80">
            </div>

            <div class="fixed inset-0 flex">

                <div x-show="isOpen" x-transition:enter="transition ease-in-out duration-300 transform"
                    x-transition:enter-start="-translate-x-full" x-transition:enter-end="translate-x-0"
                    x-transition:leave="transition ease-in-out duration-300 transform"
                    x-transition:leave-start="translate-x-0" x-transition:leave-end="-translate-x-full"
                    class="relative flex flex-1 w-full max-w-xs mr-16">

                    <div x-data="{ isOpen: false }">
                        <button @click="isOpen = !isOpen" x-transition:enter="ease-in-out duration-300"
                            x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100"
                            x-transition:leave="ease-in-out duration-300" x-transition:leave-start="opacity-100"
                            x-transition:leave-end="opacity-0"
                            class="absolute top-0 flex justify-center w-16 pt-5 left-full">
                        </button>
                    </div>
                    <div class="flex flex-col px-6 pb-2 overflow-y-auto bg-white grow gap-y-5">
                        <div class="flex items-center h-16 shrink-0">
                            <img class="w-auto h-8" src="{{ asset('storage/images/webkoth.png') }}" alt="Webkoth">
                        </div>
                        <nav class="flex flex-col flex-1">
                            <ul role="list" class="flex flex-col flex-1 gap-y-7">
                                <li>
                                    <ul role="list" class="-mx-2 space-y-1">
                                        <li>
                                            <a href="#"
                                                class="flex p-2 text-sm font-semibold leading-6 text-indigo-600 rounded-md bg-gray-50 group gap-x-3">
                                                <svg class="w-6 h-6 text-indigo-600 shrink-0" fill="none"
                                                    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                    aria-hidden="true">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                                </svg>
                                                Dashboard
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#"
                                                class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-indigo-600 hover:bg-gray-50 group gap-x-3">
                                                <svg class="w-6 h-6 text-gray-400 shrink-0 group-hover:text-indigo-600"
                                                    fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                    stroke="currentColor" aria-hidden="true">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                                </svg>
                                                Team
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#"
                                                class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-indigo-600 hover:bg-gray-50 group gap-x-3">
                                                <svg class="w-6 h-6 text-gray-400 shrink-0 group-hover:text-indigo-600"
                                                    fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                    stroke="currentColor" aria-hidden="true">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                                                </svg>
                                                Projects
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#"
                                                class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-indigo-600 hover:bg-gray-50 group gap-x-3">
                                                <svg class="w-6 h-6 text-gray-400 shrink-0 group-hover:text-indigo-600"
                                                    fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                    stroke="currentColor" aria-hidden="true">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                                </svg>
                                                Calendar
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#"
                                                class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-indigo-600 hover:bg-gray-50 group gap-x-3">
                                                <svg class="w-6 h-6 text-gray-400 shrink-0 group-hover:text-indigo-600"
                                                    fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                    stroke="currentColor" aria-hidden="true">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                                                </svg>
                                                Documents
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#"
                                                class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-indigo-600 hover:bg-gray-50 group gap-x-3">
                                                <svg class="w-6 h-6 text-gray-400 shrink-0 group-hover:text-indigo-600"
                                                    fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                    stroke="currentColor" aria-hidden="true">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                                                </svg>
                                                Reports
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <div class="text-xs font-semibold leading-6 text-gray-400">Your teams</div>
                                    <ul role="list" class="mt-2 -mx-2 space-y-1">
                                        <li>
                                            <!-- Current: "bg-gray-50 text-indigo-600", Default: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50" -->
                                            <a href="#"
                                                class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-indigo-600 hover:bg-gray-50 group gap-x-3">
                                                <span
                                                    class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600">H</span>
                                                <span class="truncate">Heroicons</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#"
                                                class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-indigo-600 hover:bg-gray-50 group gap-x-3">
                                                <span
                                                    class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600">T</span>
                                                <span class="truncate">Tailwind Labs</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#"
                                                class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-indigo-600 hover:bg-gray-50 group gap-x-3">
                                                <span
                                                    class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600">W</span>
                                                <span class="truncate">Workcation</span>
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <!-- Sidebar component, swap this element with another sidebar if you like -->
            <div class="flex flex-col px-6 overflow-y-auto bg-white border-r border-gray-200 grow gap-y-5">
                <div class="flex items-center h-16 shrink-0">
                    <img class="w-auto h-14" src="{{ asset('storage/images/webkoth.png') }}" alt="Webkoth">
                    <a href="#"
                        class="flex p-2 text-3xl font-bold leading-6 text-teal-600 rounded-md bg-gray-50 group gap-x-3">
                        WebkothUI
                    </a>
                </div>
                <nav class="flex flex-col flex-1">
                    <ul role="list" class="flex flex-col flex-1 gap-y-7">
                        <li>
                            <div class="py-2 mb-2 text-xs font-semibold text-gray-400">Components</div>
                            <ul role="list" class="-mx-2 space-y-1">
                                <li>
                                    <!-- Current: "bg-gray-50 text-indigo-600", Default: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50" -->
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-teal-600 rounded-md hover:text-teal-600 bg-gray-50 group gap-x-3">
                                        Accordion
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Alerts
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Badge
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Breadcrumb
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Buttons
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Button group
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Card
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Carousel
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Close button
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Collapse
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Dropdowns
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        List group
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Modal
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Navbar
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Nav & tabs
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Offcanvas
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Pagination
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Placeholders
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Popovers
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Progress
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Scrollspy
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Spinners
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Toasts
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-teal-600 hover:bg-gray-50 group gap-x-3">
                                        Tooltips
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <div class="text-xs font-semibold leading-6 text-gray-400">Your teams</div>
                            <ul role="list" class="mt-2 -mx-2 space-y-1">
                                <li>
                                    <!-- Current: "bg-gray-50 text-indigo-600", Default: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50" -->
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-indigo-600 hover:bg-gray-50 group gap-x-3">
                                        <span
                                            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600">H</span>
                                        <span class="truncate">Heroicons</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-indigo-600 hover:bg-gray-50 group gap-x-3">
                                        <span
                                            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600">T</span>
                                        <span class="truncate">Tailwind Labs</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#"
                                        class="flex p-2 text-sm font-semibold leading-6 text-gray-700 rounded-md hover:text-indigo-600 hover:bg-gray-50 group gap-x-3">
                                        <span
                                            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600">W</span>
                                        <span class="truncate">Workcation</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <div class="sticky top-0 z-40 flex items-center px-4 py-4 bg-white shadow-sm gap-x-6 sm:px-6 lg:hidden">
            <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden">
                <span class="sr-only">Open sidebar</span>
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                    aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
            <div class="flex-1 text-sm font-semibold leading-6 text-gray-900">Dashboard</div>
            <a href="#">
                <span class="sr-only">Your profile</span>
                <img class="w-8 h-8 rounded-full bg-gray-50"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="">
            </a>
        </div>
        <main class="py-10 lg:pl-72">
            <div class="px-4 sm:px-6 lg:px-8">
                <div x-data="componentPreview({})"
                    class="overflow-hidden bg-white divide-y ring-1 ring-gray-200 rounded-xl">
                    <header class="grid items-center gap-4 px-4 py-3 lg:grid-cols-2">
                        <aside class="flex items-center">
                            <h3 class="text-lg font-semibold tracking-tight font-brand">Primary</h3>
                        </aside>
                        <aside class="flex items-center lg:justify-self-end">
                            <div class="flex items-center space-x-3">
                                <nav
                                    class="inline-flex items-center justify-center p-1 space-x-1 overflow-hidden text-sm text-gray-500 bg-gray-100 rounded-xl">
                                    <button
                                        class="h-8 px-5 font-semibold transition bg-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-inset text-cyan-500"
                                        x-bind="tab('preview')" type="button">
                                        Preview
                                    </button>
                                    <button
                                        class="h-8 px-5 font-semibold transition rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-inset hover:text-gray-600 focus:text-cyan-500"
                                        x-bind="tab('code')" type="button">
                                        Code
                                    </button>
                                </nav>
                                <div class="h-3 border-l"></div>
                                <button
                                    class="flex items-center justify-center w-10 h-10 transition rounded-full text-cyan-500 hover:bg-gray-500/5 focus:bg-cyan-50 focus:outline-none"
                                    title="Copy code" x-on:click="copyCode()" type="button">
                                    <svg class="absolute w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="1.5"
                                            d="M6.5 15.25V15.25C5.5335 15.25 4.75 14.4665 4.75 13.5V6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H13.5C14.4665 4.75 15.25 5.5335 15.25 6.5V6.5">
                                        </path>
                                        <rect width="10.5" height="10.5" x="8.75" y="8.75" stroke="currentColor"
                                            stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                            rx="2"></rect>
                                    </svg>
                                </button>
                            </div>
                        </aside>
                    </header>
                    <div>
                        <div class="h-full bg-gray-50">
                            <div
                                class="grid grid-cols-1 gap-4 p-8 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
                                {{ $slot }}
                            </div>
                        </div>
                        <div class="overflow-scroll whitespace-nowrap" style="display: none;">
                            <pre x-ref="code" class="inline-block p-4 language-html">
                                <span class="token tag">
                                    <span class="token tag">
                                        <span class="token punctuation">&lt;</span>
                                            <span class="token namespace">x-app-ui:</span>:alert</span>
                                            <span class="token attr-name">icon</span>
                                            <span class="token attr-value">
                                                <span class="token punctuation attr-equals">=</span>
                                                <span class="token punctuation">"</span>iconic-information<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span>
                        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>x-slot</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>heading<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span>
                            New update available
                        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>x-slot</span><span class="token punctuation">&gt;</span></span>
                    
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore atque necessitatibus sequi.
                    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span><span class="token namespace">x-app-ui:</span>:alert</span><span class="token punctuation">&gt;</span></span>
                    </pre>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</body>

</html>
