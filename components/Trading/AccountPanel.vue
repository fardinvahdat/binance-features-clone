<template>
  <div class="bg-bg-panel border border-border-color p-4 space-y-3">
    <h3 class="text-text-primary font-semibold">Account</h3>
    
    <div class="space-y-2">
      <div>
        <div class="text-xs text-text-secondary mb-1">Margin Ratio</div>
        <div class="flex items-center gap-2">
          <span class="text-text-primary">Margin Ratio</span>
          <span class="text-binance-green text-sm">0.00%</span>
        </div>
      </div>

      <div>
        <div class="text-xs text-text-secondary">Maintenance Margin</div>
        <div class="text-text-primary text-sm">0.0000 USDT</div>
      </div>

      <div>
        <div class="text-xs text-text-secondary">Margin Balance</div>
        <div class="text-text-primary text-sm">0.0000 USDT</div>
      </div>
    </div>

    <div class="flex gap-2 pt-2">
      <button class="flex-1 py-2 bg-bg-hover text-text-primary text-sm rounded hover:bg-border-color transition-colors">
        Transfer
      </button>
      <button class="flex-1 py-2 bg-bg-hover text-text-primary text-sm rounded hover:bg-border-color transition-colors">
        Borrow
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
