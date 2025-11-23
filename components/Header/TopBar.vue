<template>
  <div class="bg-bg-panel border-b border-border-color">
    <!-- Top Navigation -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-border-color">
      <div class="flex items-center gap-6">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <div class="text-binance-yellow text-xl">⬥</div>
          <span class="text-text-primary font-semibold">BINANCE</span>
          <span class="text-text-secondary text-sm">FUTURES</span>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex items-center gap-4 text-sm">
          <button class="text-text-primary hover:text-binance-yellow flex items-center gap-1">
            Futures
            <ChevronDown :size="14" />
          </button>
          <button class="text-text-secondary hover:text-text-primary flex items-center gap-1">
            Options
            <ChevronDown :size="14" />
          </button>
          <button class="text-text-secondary hover:text-text-primary flex items-center gap-1">
            Trading Bots
            <ChevronDown :size="14" />
          </button>
          <button class="text-text-secondary hover:text-text-primary">Copy Trading</button>
          <button class="text-text-secondary hover:text-text-primary">Smart Money</button>
          <button class="text-text-secondary hover:text-text-primary flex items-center gap-1">
            Campaigns
            <ChevronDown :size="14" />
          </button>
          <button class="text-text-secondary hover:text-text-primary flex items-center gap-1">
            Data
            <ChevronDown :size="14" />
          </button>
          <button class="text-text-secondary hover:text-text-primary flex items-center gap-1">
            More
            <ChevronDown :size="14" />
          </button>
        </nav>
      </div>

      <div class="flex items-center gap-3">
        <button class="px-4 py-1.5 text-sm text-text-primary hover:bg-bg-hover rounded">
          Log In
        </button>
        <button class="px-4 py-1.5 text-sm bg-binance-yellow text-bg-primary font-semibold rounded hover:opacity-90">
          Sign Up
        </button>
        <div class="flex items-center gap-2 text-text-secondary">
          <Globe :size="18" />
          <Calculator :size="18" />
          <Bell :size="18" />
          <Moon :size="18" />
        </div>
      </div>
    </div>

    <!-- Notice Bar -->
    <div class="bg-[#3d2c1b] px-4 py-2 flex items-center justify-between text-xs">
      <div class="flex items-center gap-2">
        <Info :size="14" class="text-binance-yellow" />
        <span class="text-text-primary">Please note: Derivative trading is not available for Dutch residents.</span>
      </div>
      <button class="text-text-secondary hover:text-text-primary">
        <X :size="14" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown, Globe, Calculator, Bell, Moon, Info, X } from 'lucide-vue-next'
</script>
