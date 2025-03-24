document.addEventListener('DOMContentLoaded', () => {
    // Initialize all carousels
    const carousels = document.querySelectorAll('.carousel-container');
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.next-button');
        const prevButton = carousel.querySelector('.prev-button');
        
        let currentIndex = 0;
        let slidesToShow = 4;
        let slideWidth = 0;
        
        // Function to update slides to show based on window width
        const updateSlidesToShow = () => {
            if (window.innerWidth >= 1200) {
                slidesToShow = 4;
            } else if (window.innerWidth >= 992) {
                slidesToShow = 3;
            } else if (window.innerWidth >= 576) {
                slidesToShow = 2;
            } else {
                slidesToShow = 1;
            }
            
            // Update slide width
            slideWidth = carousel.offsetWidth / slidesToShow;
            
            // Update slides width and position
            slides.forEach((slide, index) => {
                slide.style.width = `${slideWidth}px`;
                slide.style.left = `${index * slideWidth}px`;
            });
            
            // Update track position
            updateTrackPosition();
        };
        
        // Function to update track position
        const updateTrackPosition = () => {
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        };
        
        // Event listeners for buttons
        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - slidesToShow) {
                currentIndex++;
                updateTrackPosition();
            } else {
                // Loop back to start
                currentIndex = 0;
                updateTrackPosition();
            }
        });
        
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateTrackPosition();
            } else {
                // Loop to end
                currentIndex = slides.length - slidesToShow;
                updateTrackPosition();
            }
        });
        
        // Touch events for mobile swipe
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        });
        
        track.addEventListener('touchmove', e => {
            touchEndX = e.touches[0].clientX;
        });
        
        track.addEventListener('touchend', () => {
            const swipeDistance = touchStartX - touchEndX;
            if (Math.abs(swipeDistance) > 50) {
                if (swipeDistance > 0 && currentIndex < slides.length - slidesToShow) {
                    currentIndex++;
                } else if (swipeDistance < 0 && currentIndex > 0) {
                    currentIndex--;
                }
                updateTrackPosition();
            }
        });
        
        // Initialize carousel
        updateSlidesToShow();
        
        // Update on window resize
        window.addEventListener('resize', () => {
            updateSlidesToShow();
        });
    });
}); 