import { onMounted, onUnmounted } from 'vue'

export const useScrollReveal = () => {
  let observer: IntersectionObserver | null = null

  // Observe any .io elements not yet revealed — safe to call after dynamic renders.
  const reobserve = () => {
    if (!observer) {
      document.querySelectorAll('.io').forEach(el => el.classList.add('io--in'))
      return
    }
    document.querySelectorAll('.io:not(.io--in)').forEach(el => observer!.observe(el))
  }

  onMounted(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.io').forEach(el => el.classList.add('io--in'))
      return
    }
    observer = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('io--in'); observer!.unobserve(en.target) }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    reobserve()
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  return { reobserve }
}
