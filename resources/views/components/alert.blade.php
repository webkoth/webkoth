@php
    $color = match ($type) {
        'primary' => 'blue',
        'secondary' => 'gray',
        'success' => 'green',
        'info' => 'cyan',
        'danger' => 'red',
        'warning' => 'yellow',
        'light' => 'white',
        'dark' => 'slate',
        default => 'blue', // Используем 'blue' как значение по умолчанию
    };

    $color = ($color === 'white') ? 'gray' : $color;
@endphp

<div {{ $attributes->merge(['class' => "p-4 border-l-4 border-{$color}-400 bg-{$color}-50"]) }}>
    <div class="flex">
        <div class="flex-shrink-0">
            <x-heroicon-c-exclamation-triangle class="w-5 h-5 text-{{ $color }}-400"/>
        </div>
        <div class="ml-3">
            <p class="text-sm text-{{ $color }}-700">
                {{ $message }}
                @isset($description)
                    <a href="#" class="font-medium text-{{ $color }}-700 underline hover:text-{{ $color }}-600">
                        {{ $description }}
                    </a>
                @endisset    
            </p>
        </div>
    </div>
</div>
