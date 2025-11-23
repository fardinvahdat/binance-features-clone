<template>
  <div class="grid grid-cols-2 gap-4">
    <div v-for="item in infoItems" :key="item.label" class="space-y-1">
      <div class="text-xs text-text-secondary">{{ item.label }}</div>
      <div class="text-text-primary text-sm">{{ item.value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const infoItems = [
  { label: 'Rank', value: '#1' },
  { label: 'Market Cap', value: '$1.2T' },
  { label: 'Circulating Supply', value: '19.5M BTC' },
  { label: 'Total Supply', value: '21M BTC' },
  { label: 'Max Supply', value: '21M BTC' },
  { label: 'All-Time High', value: '$69,045' },
]
</script>
