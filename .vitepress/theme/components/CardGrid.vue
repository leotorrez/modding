<template>
  <div class="card-grid">
    <a v-for="item in items" :key="item.title" :href="item.link" class="card-item">
      <article class="card-box">
        <h2 class="card-title">{{ item.title }}</h2>
        <p class="card-details">{{ item.details }}</p>
      </article>
    </a>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.card-item {
  text-decoration: none !important;
  color: inherit;
  display: flex;
}

.card-box {
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 24px;
  height: 100%;
  transition: border-color 0.25s, background-color 0.25s;
}

.card-box:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-mute);
}

.card-title {
  margin: 0 0 12px 0;
  border-top: none;    /* This removes the unnecessary line */
  padding-top: 0;      /* This ensures no extra spacing is left behind */
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.card-details {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
</style>