
import { Swiper, SwiperSlide } from "swiper/react"
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from "swiper/modules"

// Image data array
const images = [
  "https://assets-in.bmscdn.com/promotions/cms/creatives/1735281620954_boaweb.jpg",
  "https://assets-in.bmscdn.com/promotions/cms/creatives/1726036566435_playcardnewweb.jpg",
  "https://assets-in.bmscdn.com/promotions/cms/creatives/1735281620954_boaweb.jpg",
  "https://assets-in.bmscdn.com/promotions/cms/creatives/1726036566435_playcardnewweb.jpg",
]

export function CarouselSize() {
  return (
    <div className="w-full p-4 max-w-full mx-auto">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        pagination={{ clickable: true }}
        centeredSlides={true} 
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 }, 
          1024: { slidesPerView: 2 },
        }}
        className="w-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="p-1">
              <img
                src={image}
                alt={`Carousel Image ${index + 1}`}
                className="w-full h-48 lg:h-80 object-fill rounded-lg"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
