import { onMounted, onUnmounted } from 'vue'

export const useScrollReveal = () => {
  let observer: IntersectionObserver | null = null

  const setupObserver = () => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.io').forEach(el => el.classList.add('io--in'))
      return
    }
    observer = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('io--in'); observer!.unobserve(en.target) }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    document.querySelectorAll('.io:not(.io--in)').forEach(el => observer!.observe(el))
  }

  onMounted(() => {
    setupObserver()
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  return { setupObserver }
}
