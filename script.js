const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    { 
        threshold: 0.1, 
        rootMargin: '0px 0px -40px 0px' 
    }
);

document.querySelectorAll('.fade-up').forEach((el, i) => {
    // Adiciona um pequeno atraso cascata para elementos próximos
    el.style.transitionDelay = `${(i % 5) * 80}ms`;
    observer.observe(el);
});