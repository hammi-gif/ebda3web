/* --------------------------------------------------
   Ebda3 Web - JavaScript Functions
   Author: Antigravity AI
-------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Header Scroll Effect ---
    const header = document.querySelector(".main-header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // --- 2. Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const closeMenuBtn = document.getElementById("closeMenuBtn");
    const mobileNavOverlay = document.getElementById("mobileNavOverlay");
    const mobileLinks = document.querySelectorAll(".mobile-links a");
    const mobileCta = document.querySelector(".mobile-cta");

    const openMenu = () => {
        mobileNavOverlay.classList.add("open");
        document.body.style.overflow = "hidden"; // Prevent scrolling behind overlay
    };

    const closeMenu = () => {
        mobileNavOverlay.classList.remove("open");
        document.body.style.overflow = ""; // Re-enable scrolling
    };

    mobileMenuBtn.addEventListener("click", openMenu);
    closeMenuBtn.addEventListener("click", closeMenu);
    
    // Close mobile menu when clicking a link or CTA
    mobileLinks.forEach(link => {
        link.addEventListener("click", closeMenu);
    });
    mobileCta.addEventListener("click", closeMenu);

    // Close mobile menu when clicking outside of the content area
    mobileNavOverlay.addEventListener("click", (e) => {
        if (e.target === mobileNavOverlay) {
            closeMenu();
        }
    });


    // --- 3. Portfolio Filters ---
    const filterBtns = document.querySelectorAll(".filter-btn");
    const portfolioItems = document.querySelectorAll(".portfolio-item");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active class from all buttons and add to clicked one
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            portfolioItems.forEach(item => {
                const category = item.getAttribute("data-category");
                
                if (filterValue === "all" || category === filterValue) {
                    item.style.display = "block";
                    // Add micro-animation fade-in
                    item.style.opacity = "0";
                    setTimeout(() => {
                        item.style.opacity = "1";
                        item.style.transform = "scale(1)";
                    }, 50);
                } else {
                    item.style.display = "none";
                }
            });
        });
    });


    // --- 4. Active Nav Link on Scroll ---
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    const scrollActive = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute("id");
            
            // Check if scroll position is inside section boundaries
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    };

    window.addEventListener("scroll", scrollActive);


    // --- 5. Animated Stats Counter ---
    const statsSection = document.querySelector(".hero-stats");
    const statNums = document.querySelectorAll(".stat-num");
    let counted = false;

    const countUp = () => {
        statNums.forEach(num => {
            const target = parseInt(num.getAttribute("data-val"));
            const duration = 2000; // 2 seconds duration
            const increment = target / (duration / 16); // ~60fps
            let current = 0;

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    num.innerText = Math.floor(current);
                    requestAnimationFrame(updateCount);
                } else {
                    num.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Use Intersection Observer for stats animation trigger
    if (statsSection && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counted) {
                    countUp();
                    counted = true;
                    statsObserver.unobserve(statsSection);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    } else {
        // Fallback if IntersectionObserver is not supported
        setTimeout(countUp, 500);
    }


    // --- 6. Form Validation & Interactive Submission ---
    const contactForm = document.getElementById("projectContactForm");
    const formStatus = document.getElementById("formStatus");
    const submitBtn = document.getElementById("submitFormBtn");

    // Inputs
    const nameInput = document.getElementById("userName");
    const emailInput = document.getElementById("userEmail");
    const phoneInput = document.getElementById("userPhone");
    const projectTypeSelect = document.getElementById("projectType");
    const messageInput = document.getElementById("userMessage");

    // Validators
    const validateName = () => {
        const value = nameInput.value.trim();
        if (value.length < 3) {
            nameInput.closest(".form-group").classList.add("invalid");
            return false;
        }
        nameInput.closest(".form-group").classList.remove("invalid");
        return true;
    };

    const validateEmail = () => {
        const value = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            emailInput.closest(".form-group").classList.add("invalid");
            return false;
        }
        emailInput.closest(".form-group").classList.remove("invalid");
        return true;
    };

    const validatePhone = () => {
        const value = phoneInput.value.trim();
        // Saudi Arabia formats: starts with 05 followed by 8 numbers (total 10 digits), or general 9-10 digits
        const phoneRegex = /^(05|5)\d{8}$/;
        if (!phoneRegex.test(value)) {
            phoneInput.closest(".form-group").classList.add("invalid");
            return false;
        }
        phoneInput.closest(".form-group").classList.remove("invalid");
        return true;
    };

    const validateProjectType = () => {
        const value = projectTypeSelect.value;
        if (!value) {
            projectTypeSelect.closest(".form-group").classList.add("invalid");
            return false;
        }
        projectTypeSelect.closest(".form-group").classList.remove("invalid");
        return true;
    };

    const validateMessage = () => {
        const value = messageInput.value.trim();
        if (value.length < 10) {
            messageInput.closest(".form-group").classList.add("invalid");
            return false;
        }
        messageInput.closest(".form-group").classList.remove("invalid");
        return true;
    };

    // Real-time validation on input changes
    nameInput.addEventListener("input", validateName);
    emailInput.addEventListener("input", validateEmail);
    phoneInput.addEventListener("input", validatePhone);
    projectTypeSelect.addEventListener("change", validateProjectType);
    messageInput.addEventListener("input", validateMessage);

    // Form Submit Event
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Run all validations
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isProjectTypeValid = validateProjectType();
        const isMessageValid = validateMessage();

        const isFormValid = isNameValid && isEmailValid && isPhoneValid && isProjectTypeValid && isMessageValid;

        if (isFormValid) {
            // Show loading state
            submitBtn.disabled = true;
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span>جاري إرسال طلبك...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            
            formStatus.className = "form-status";
            formStatus.style.display = "none";

            // Simulate form submission to server (AJAX)
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                
                // Show success status
                formStatus.innerHTML = `شكراً لتواصلك معنا! تم إرسال تفاصيل مشروعك بنجاح. سنتواصل معك في أقرب وقت.`;
                formStatus.className = "form-status success";
                
                // Reset Form
                contactForm.reset();
                
                // Clear any leftover validation styles
                document.querySelectorAll(".form-group").forEach(group => {
                    group.classList.remove("invalid");
                });

                // Clear success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = "none";
                }, 6000);

            }, 2000); // 2 seconds simulated delay
        } else {
            // Show general error status
            formStatus.innerHTML = `الرجاء تصحيح الأخطاء في الحقول الموضحة أعلاه والمحاولة مرة أخرى.`;
            formStatus.className = "form-status error";
        }
    });

    // --- 7. Reveal Sections on Scroll (Micro-animations) ---
    const revealElements = document.querySelectorAll(".service-card, .portfolio-item, .feature-item, .experience-card, .contact-info, .contact-form-card");

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;

        revealElements.forEach(el => {
            // Initial styling for transition in CSS can be supplemented here
            if (!el.classList.contains("revealed")) {
                el.style.opacity = "0";
                el.style.transform = "translateY(25px)";
                el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
                el.classList.add("reveal-init");
            }

            const elementTop = el.getBoundingClientRect().top;

            if (elementTop < triggerBottom) {
                el.classList.add("revealed");
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
            }
        });
    };

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Trigger initially for elements already in view
});
