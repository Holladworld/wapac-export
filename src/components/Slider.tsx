import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Slide = {
  id: string;
  title?: string;
  description?: string;
  media_type: 'image' | 'video';
  media_url: string;
  order_index: number;
  is_active: boolean;
};

export default function Slider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const autoplayRef = useRef<number | null>(null); // ← FIXED: number instead of NodeJS.Timeout
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('slider_slides')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;

      // Add placeholder slides if none exist
      if (!data || data.length === 0) {
        setSlides([
          {
            id: '1',
            media_type: 'image',
            media_url: 'https://images.pexels.com/photos/9877234/pexels-photo-9877234.jpeg?auto=compress&cs=tinysrgb&w=1200',
            title: 'Export-Grade Charcoal',
            description: 'Premium quality from Nigeria',
            order_index: 0,
            is_active: true,
          },
          {
            id: '2',
            media_type: 'image',
            media_url: 'https://images.pexels.com/photos/10617802/pexels-photo-10617802.jpeg?auto=compress&cs=tinysrgb&w=1200',
            title: 'Global Export Partners',
            description: 'Trusted by 40+ countries',
            order_index: 1,
            is_active: true,
          },
          {
            id: '3',
            media_type: 'image',
            media_url: 'https://images.pexels.com/photos/220993/pexels-photo-220993.jpeg?auto=compress&cs=tinysrgb&w=1200',
            title: 'SGS Certified Quality',
            description: 'Every batch independently verified',
            order_index: 2,
            is_active: true,
          },
        ]);
      } else {
        setSlides(data);
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalSlides = slides.length;
  const extendedSlides = [...slides, ...slides, ...slides];

  useEffect(() => {
    if (!isPaused && slides.length > 0) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }, 4000);
    }
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [isPaused, slides.length, totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(((index % totalSlides) + totalSlides) % totalSlides);
  };

  const goToPrev = () => {
    goToSlide(currentIndex - 1);
  };

  const goToNext = () => {
    goToSlide(currentIndex + 1);
  };

  const getSlideStyle = (offset: number) => {
    if (offset === 0) {
      return {
        transform: 'scale(1) translateX(0)',
        opacity: 1,
        zIndex: 10,
        filter: 'blur(0px) brightness(1)',
      };
    } else if (offset === -1 || offset === 1) {
      return {
        transform: `scale(0.85) translateX(${offset * 55}%)`,
        opacity: 0.6,
        zIndex: 5,
        filter: 'blur(2px) brightness(0.5)',
      };
    } else {
      return {
        transform: `scale(0.7) translateX(${offset * 80}%)`,
        opacity: 0.2,
        zIndex: 1,
        filter: 'blur(4px) brightness(0.3)',
      };
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-pulse" style={{ color: 'var(--tcf-secondary-text)' }}>Loading slides...</div>
      </div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--tcf-bg)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-[11px] tracking-[0.25em] uppercase font-medium" style={{ color: 'var(--tcf-accent)' }}>
            {slides[0]?.title || 'See Us in Operation'}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-3" style={{ color: 'var(--tcf-text)' }}>
            {slides[0]?.description || 'Wapac in Action'}
          </h2>
        </div>

        <div
          className="relative overflow-hidden mx-auto"
          style={{ maxWidth: '900px', height: '480px' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {extendedSlides.map((slide, idx) => {
              const relativeIndex = idx - (currentIndex + totalSlides);
              const style = getSlideStyle(relativeIndex);
              const isVisible = Math.abs(relativeIndex) <= 2;

              if (!isVisible) return null;

              return (
                <div
                  key={`${slide.id}-${idx}`}
                  className="absolute transition-all duration-700 ease-in-out rounded-xl overflow-hidden shadow-2xl"
                  style={{
                    width: '70%',
                    height: '80%',
                    ...style,
                  }}
                >
                  {slide.media_type === 'video' ? (
                    <video
                      ref={(el) => { videoRefs.current[idx] = el; }}
                      src={slide.media_url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      loop
                      autoPlay={relativeIndex === 0}
                    />
                  ) : (
                    <img
                      src={slide.media_url}
                      alt={slide.title || 'Slider image'}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {relativeIndex === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                      <h3 className="text-white text-xl font-bold">{slide.title}</h3>
                      {slide.description && (
                        <p className="text-white/80 text-sm">{slide.description}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Pause/Play Button */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="absolute bottom-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
            aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className="w-2.5 h-2.5 rounded-full transition-all"
                style={{
                  backgroundColor: idx === currentIndex % totalSlides ? 'var(--tcf-accent)' : 'rgba(255,255,255,0.5)',
                  width: idx === currentIndex % totalSlides ? '24px' : '10px',
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}