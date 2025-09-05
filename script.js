/*
==================================================================
NG MEDUSA OPTİK - Gelişmiş Özel Script Dosyası
Versiyon: Versiyon 5 (eklediklerim: SEO & Animasyon)
Tasarımcı: Yusuf Duhan Şahin
Tarih: 2025
==================================================================

İÇİNDEKİLER:
1.  GENEL AYARLAR VE YARDIMCI FONKSİYONLAR
    1.1. 'use strict'
    1.2. Throttling Fonksiyonu (Performans için)

2.  ANA UYGULAMA BAŞLANGICI (DOMContentLoaded)
    2.1. Element Seçicileri (Selectors)

3.  BAŞLATMA (INITIALIZATION) FONKSİYONLARI
    3.1. YENİ! createSchema(): SEO için JSON-LD Schema oluşturur.
    3.2. YENİ! initParticles(): Hero alanındaki canlı parçacık animasyonunu başlatır.
    3.3. initLoader(): Yükleme ekranını yönetir.
    3.4. initHeaderScroll(): Sayfa kaydırıldığında header'ı yönetir.
    3.5. initMobileMenu(): Mobil menü açma/kapama işlevselliği.
    3.6. populateGallery(): Koleksiyon galerisini dinamik olarak doldurur.
    3.7. initFaqAccordion(): S.S.S. akordeon menüsünü yönetir.
    3.8. initBackToTopButton(): Sayfa başına dön butonunu yönetir.
    3.9. initAOS(): AOS (Animate on Scroll) kütüphanesini başlatır.
    3.10. initSmoothScroll(): Navigasyon linklerine yumuşak kaydırma ekler.

4.  ANA ÇAĞRI (MAIN EXECUTION)
    4.1. Tüm başlatma fonksiyonlarının çağrılması.

==================================================================
*/


// =================================================================
// 1. GENEL AYARLAR VE YARDIMCI FONKSİYONLAR
// =================================================================

'use strict';

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};


// =================================================================
// 2. ANA UYGULAMA BAŞLANGICI
// =================================================================

document.addEventListener('DOMContentLoaded', () => {

    const selectors = {
        loaderWrapper: document.getElementById('loader-wrapper'),
        mainHeader: document.getElementById('main-header'),
        mobileMenuButton: document.getElementById('mobile-menu-button'),
        mobileMenu: document.getElementById('mobile-menu'),
        galleryContainer: document.getElementById('gallery-container'),
        backToTopButton: document.getElementById('back-to-top'),
        navLinks: document.querySelectorAll('.nav-link, .mobile-nav-link'),
        faqContainer: document.getElementById('faq-container'),
        particlesCanvas: document.getElementById('particles-canvas'),
        // YENİ: Modal (pop-up) elementleri
        tipsModal: document.getElementById('tips-modal'),
        modalCloseButton: document.getElementById('modal-close-button'),
        modalImage: document.getElementById('modal-image'),
        modalTitle: document.getElementById('modal-title'),
        modalText: document.getElementById('modal-text'),
        blogCards: document.querySelectorAll('.blog-card'),
    };


    // =================================================================
    // 3. BAŞLATMA (INITIALIZATION) FONKSİYONLARI
    // =================================================================

    /**
     * 3.1. YENİ! SEO için JSON-LD Schema oluşturur ve sayfaya ekler.
     * Bu, Google'ın işletme bilgilerini daha iyi anlamasını sağlar.
     */
    const createSchema = () => {
        const schema = {
            "@context": "https://schema.org",
            "@type": "Optician",
            "name": "NG MEDUSA OPTİK & GÖZLÜKÇÜ",
            "image": "https://ngmedusaoptic.com/logo.jpg", // Tam URL'yi buraya girin
            "@id": "",
            "url": "https://ngmedusaoptic.com", // Web sitesi URL'si
            "telephone": "+905435849063",
            "priceRange": "₺₺",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Cedit Mahallesi Devlet Hastanesi Sokak No:20/B",
                "addressLocality": "İzmit",
                "addressRegion": "Kocaeli",
                "postalCode": "41300",
                "addressCountry": "TR"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": 40.7261189,
                "longitude": 29.9118593
            },
            "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                ],
                "opens": "08:30",
                "closes": "19:00"
            },
            "sameAs": "https://www.instagram.com/ngmedusaoptician/"
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
    };
    
    /**
     * 3.2. YENİ! Parçacık Animasyonu
     * Hero alanındaki canvas üzerinde hareket eden parçacıklar oluşturur.
     */
    const initParticles = () => {
        const canvas = selectors.particlesCanvas;
        if (!canvas) {
            console.warn('Parçacık animasyonu için canvas elementi bulunamadı.');
            return;
        }

        const ctx = canvas.getContext('2d');
        let particlesArray;

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        const createParticles = () => {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = 'rgba(201, 171, 129, 0.5)';
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        };

        const connectParticles = () => {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2);
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(201, 171, 129, ${opacityValue})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            particlesArray.forEach(p => p.update());
            connectParticles();
        };

        window.addEventListener('resize', throttle(() => {
            setCanvasSize();
            createParticles();
        }, 200));

        createParticles();
        animate();
    };

    /**
     * 3.3. Yükleme Ekranı (Preloader) Yönetimi
     */
    const initLoader = () => {
        if (!selectors.loaderWrapper) return;
        window.addEventListener('load', () => {
            selectors.loaderWrapper.style.opacity = '0';
            setTimeout(() => { selectors.loaderWrapper.style.display = 'none'; }, 800);
        });
    };

    /**
     * 3.4. Header'ın Kaydırma Davranışı
     */
    const initHeaderScroll = () => {
        if (!selectors.mainHeader) return;
        const handleScroll = () => {
            selectors.mainHeader.classList.toggle('header-scrolled', window.scrollY > 50);
        };
        window.addEventListener('scroll', throttle(handleScroll, 100));
    };

    /**
     * 3.5. Mobil Menü Açma/Kapama İşlevselliği
     */
    const initMobileMenu = () => {
        if (!selectors.mobileMenuButton || !selectors.mobileMenu) return;
        const icon = selectors.mobileMenuButton.querySelector('i');
        const mobileLinks = selectors.mobileMenu.querySelectorAll('a');
        const toggleMenu = () => {
            selectors.mobileMenu.classList.toggle('hidden');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        };
        selectors.mobileMenuButton.addEventListener('click', toggleMenu);
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (!selectors.mobileMenu.classList.contains('hidden')) toggleMenu();
            });
        });
    };

    /**
     * 3.6. Koleksiyon Galerisini Dinamik Olarak Doldurma
     */
    const populateGallery = () => {
        if (!selectors.galleryContainer) return;
        const glassesData = [
            { title: "Klasik Zarafet" }, { title: "Modern Çizgiler" },
            { title: "İkonik Tasarım" }, { title: "Minimalist Şıklık" },
            { title: "Vintage Ruhu" }, { title: "Cesur ve Farklı" },
            { title: "Profesyonel Görünüm" }, { title: "Günlük Konfor" },
        ];
        let galleryHTML = '';
        glassesData.forEach((glass, index) => {
            let imageIndex = (index % 48) + 1;
            if (imageIndex === 47) imageIndex = 48; // 47. resim yoksa 48'i kullan
            const imageUrl = `img/img (${imageIndex}).jpg`;
            const animationDelay = (index % 4) * 100;
            
            // YENİ: HTML yapısı Lightbox için 'a' etiketi ile güncellendi
            galleryHTML += `
                <a href="${imageUrl}" 
                   data-fancybox="gallery" 
                   data-caption="${glass.title}" 
                   class="gallery-item" 
                   data-aos="fade-up" 
                   data-aos-delay="${animationDelay}">
                    
                    <img src="${imageUrl}" alt="${glass.title}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x750/e0dace/6c2d2c?text=Stil';">
                    
                    <div class="overlay">
                        <h4 class="overlay-title text-xl font-bold font-serif text-white">${glass.title}</h4>
                        <span class="details-button rounded-full">İncele</span>
                    </div>
                </a>`;
        });
        selectors.galleryContainer.innerHTML = galleryHTML;

        // YENİ: Fancybox'ı başlat
        Fancybox.bind("[data-fancybox]", {
            // İsteğe bağlı ayarlar buraya eklenebilir
        });
    };

    /**
     * 3.7. S.S.S. Akordeon Menü İşlevselliği
     */
    const initFaqAccordion = () => {
        if (!selectors.faqContainer) return;
        const questions = selectors.faqContainer.querySelectorAll('.faq-question');
        questions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const isOpen = faqItem.classList.contains('open');
                selectors.faqContainer.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('open');
                });
                if (!isOpen) {
                    faqItem.classList.add('open');
                }
            });
        });
    };

    /**
     * 3.8. Sayfa Başına Dön Butonu
     */
    const initBackToTopButton = () => {
        if (!selectors.backToTopButton) return;
        const handleScroll = () => {
            selectors.backToTopButton.classList.toggle('show', window.scrollY > 400);
        };
        const scrollToTop = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        window.addEventListener('scroll', throttle(handleScroll, 200));
        selectors.backToTopButton.addEventListener('click', scrollToTop);
    };

    /**
     * 3.9. AOS (Animate On Scroll) Kütüphanesini Başlatma
     */
    const initAOS = () => {
        if (typeof AOS === 'undefined') return;
        AOS.init({
            duration: 900, offset: 120, once: true,
            easing: 'ease-out-cubic', disable: 'phone',
        });
    };

    /**
     * 3.10. Yumuşak Kaydırma (Smooth Scroll)
     */
    const initSmoothScroll = () => {
        if (!selectors.navLinks) return;
        selectors.navLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    event.preventDefault();
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    };

    /**
     * 3.11. YENİ! İpuçları Kartları için Modal (Pop-up) İşlevselliği
     */

    const initTipsModal = () => {
        if (!selectors.tipsModal || !selectors.blogCards) return;

        const openModal = (card) => {
            const title = card.dataset.title;
            const content = card.dataset.content;
            const image = card.dataset.image;

            selectors.modalTitle.textContent = title;
            selectors.modalText.innerHTML = content;
            selectors.modalImage.src = image;

            selectors.tipsModal.classList.add('active');
        };

        const closeModal = () => {
            selectors.tipsModal.classList.remove('active');
        };

        selectors.blogCards.forEach(card => {
            card.addEventListener('click', () => openModal(card));
        });

        selectors.modalCloseButton.addEventListener('click', closeModal);
        selectors.tipsModal.addEventListener('click', (event) => {
            if (event.target === selectors.tipsModal) {
                closeModal();
            }
        });
    };

    // =================================================================
    // 4. ANA ÇAĞRI (MAIN EXECUTION)
    // =================================================================
    try {
        createSchema();
        initParticles();
        initLoader();
        initHeaderScroll();
        initMobileMenu();
        populateGallery();
        initFaqAccordion();
        initBackToTopButton();
        initAOS();
        initSmoothScroll();
        initTipsModal(); // YENİ
    } catch (error) {
        console.error("Script başlatılırken bir hata oluştu:", error);
    }
});

