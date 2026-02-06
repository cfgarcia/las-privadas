"use client"

import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

import CarouselCard from './CarouselCard'

interface ArtistCarouselProps {
    artists: {
        id: string
        name: string
        description: string
        imageUrl: string | null
        hoverVideoUrl?: string | null
    }[]
    initialSlide?: number
}

export default function ArtistCarousel({ artists, initialSlide = 1 }: ArtistCarouselProps) {
    return (
        <div className="w-full pb-10 pt-0 relative -mt-16">
            <style jsx global>{`
                .swiper-pagination-bullet {
                    background: #D4AF37 !important;
                    opacity: 0.5;
                }
                .swiper-pagination-bullet-active {
                    opacity: 1;
                    background: #D4AF37 !important;
                }
                .swiper-button-next, .swiper-button-prev {
                    color: #D4AF37 !important;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                }
                .swiper-slide-shadow-left,
                .swiper-slide-shadow-right,
                .swiper-slide-shadow-top,
                .swiper-slide-shadow-bottom,
                .swiper-slide-shadow-coverflow {
                    pointer-events: none !important;
                }
            `}</style>

            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                initialSlide={initialSlide}
                slideToClickedSlide={true}
                preventClicks={false}
                preventClicksPropagation={false}
                onClick={(swiper) => {
                    // Check if a slide was actually clicked
                    if (swiper.clickedIndex !== undefined && swiper.clickedIndex !== null) {
                        const artist = artists[swiper.clickedIndex]
                        if (artist) {
                            // Programmatic navigation
                            window.location.href = `/artist/${artist.id}`
                        }
                    }
                }}
                coverflowEffect={{
                    rotate: 0, // No rotation on mobile for smoother feel
                    stretch: 0,
                    depth: 50, // Less depth
                    modifier: 1,
                    slideShadows: false, // Disable shadows on mobile for performance
                }}
                pagination={{ clickable: true }}
                modules={[EffectCoverflow, Pagination]}
                className="mySwiper w-full max-w-6xl lg:max-w-none !py-24 !px-4"
                breakpoints={{
                    640: {
                        slidesPerView: 'auto',
                        coverflowEffect: {
                            rotate: 20,
                            depth: 80,
                            slideShadows: true,
                        }
                    },
                    1024: {
                        slidesPerView: 'auto',
                        coverflowEffect: {
                            rotate: 30,
                            depth: 100,
                            slideShadows: true,
                        }
                    },
                }}
            >
                {artists.map((artist) => (
                    <SwiperSlide key={artist.id} className="!w-[300px] sm:!w-[350px]">
                        {({ isActive }) => (
                            <CarouselCard artist={artist} isActive={isActive} />
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>

        </div>
    )
}
