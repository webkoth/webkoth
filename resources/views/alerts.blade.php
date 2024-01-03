<x-main-layout>
  
      <x-alert type="primary" :$message />
      <x-alert type="secondary" :$message/>
      <x-alert type="success" :$message />
      <x-alert type="info" :$message />
      <x-alert type="warning" :$message :description="'Some description value'"/>
      <x-alert type="danger" :$message/>
      <x-alert type="light" :$message />
      <x-alert type="dark" :$message :$description/>
</x-main-layout>
