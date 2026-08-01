import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VplayHeroButton } from './ui/VplayHeroButton';
import { VplaySecondaryButton } from './ui/VplaySecondaryButton';
import { playPopSound } from '../utils/sound';

interface HomeBannerSliderProps {
  onExploreDesignSystem: () => void;
  onWatchNow: () => void;
  onOpenFeedback?: () => void;
  reduceMotion?: boolean;
}

export const HomeBannerSlider: React.FC<HomeBannerSliderProps> = ({
  onExploreDesignSystem,
  onWatchNow,
  onOpenFeedback,
  reduceMotion = false,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 2;

  const handlePrev = () => {
    playPopSound();
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    playPopSound();
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const slideMotionProps = reduceMotion
    ? {
        initial: { opacity: 1, x: 0 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 1, x: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
        transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] },
      };

  return (
    <div className="bg-black/50 border-2 border-[#141414] p-4 sm:p-6 shadow-xl flex flex-col gap-4 relative overflow-hidden min-h-[300px] justify-between">
      {/* SLIDE CONTENT AREA WITH ANIMATION */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-between py-1 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          {currentSlide === 0 ? (
            <motion.div
              key="slide-0"
              {...slideMotionProps}
              className="space-y-4 w-full"
            >
              {/* TITLE & SUBTITLE WITH IMAGE BELOW SUBTITLE */}
              <div className="space-y-2 text-left max-w-3xl mx-auto">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-wide font-jura text-center sm:text-left drop-shadow-md">
                  WELCOME TO A DESIGN PREVIEW
                </h1>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed text-center sm:text-left drop-shadow">
                  Bạn đang được trải nghiệm hệ thống giao diện mới của Vplay, lấy cảm hứng từ Minecraft Ore UI, chúng tôi rất muốn nghe ý kiến của bạn. Hãy nhớ rằng là web nói chung và giao diện nói riêng vẫn đang trong quá trình phát triển, vì vậy một số tính năng có thể bị thiếu hoặc bạn sẽ gặp phải khá nhiều lỗi. Ore UI hứa hẹn sẽ đem đến cho bạn một trải nghiệm Vplay đẹp mắt, trực quan và mượt mà nhất.
                </p>
                <div className="pt-2 flex justify-center">
                  <img
                    src="https://static.wikia.nocookie.net/ep-deo/images/b/b4/New_ui_introduction-f34cf248120a1da988fc.png/revision/latest?cb=20260801154934"
                    alt="New UI Introduction"
                    referrerPolicy="no-referrer"
                    className="w-full max-w-2xl md:max-w-3xl h-auto object-contain shadow-lg [image-rendering:pixelated] [image-rendering:-webkit-optimize-contrast]"
                  />
                </div>
              </div>

              {/* ACTION BUTTONS WITH LEFT AND RIGHT ARROWS AT BOTH ENDS */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
                {/* Left Arrow Button */}
                <VplaySecondaryButton
                  fullWidth={false}
                  size="compact"
                  onClick={handlePrev}
                  aria-label="Previous Banner"
                  title="Trang trước"
                  className="!w-11 !h-11 !px-0 flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5 text-[#1c1d1f]" />
                </VplaySecondaryButton>

                <div className="w-48 sm:w-56">
                  <VplayHeroButton fullWidth onClick={onExploreDesignSystem}>
                    KHÁM PHÁ ORE UI
                  </VplayHeroButton>
                </div>
                <div className="w-48 sm:w-56">
                  <VplaySecondaryButton
                    fullWidth
                    onClick={() => {
                      playPopSound();
                      if (onOpenFeedback) onOpenFeedback();
                      else alert("Thank you for your feedback!");
                    }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <img
                        src="https://static.wikia.nocookie.net/ep-deo/images/5/5a/External-link-b22bbbc33f4f1f41e010vcvcv.png/revision/latest?cb=20260728071637"
                        alt="External link"
                        referrerPolicy="no-referrer"
                        className="w-3.5 h-3.5 object-contain"
                      />
                      <span>Give Feedback</span>
                    </span>
                  </VplaySecondaryButton>
                </div>

                {/* Right Arrow Button */}
                <VplaySecondaryButton
                  fullWidth={false}
                  size="compact"
                  onClick={handleNext}
                  aria-label="Next Banner"
                  title="Trang sau"
                  className="!w-11 !h-11 !px-0 flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5 text-[#1c1d1f]" />
                </VplaySecondaryButton>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="slide-1"
              {...slideMotionProps}
              className="space-y-4 w-full"
            >
              {/* TITLE & SUBTITLE WITH IMAGE BELOW SUBTITLE */}
              <div className="space-y-2 text-left max-w-3xl mx-auto">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-wide font-jura text-center sm:text-left drop-shadow-md">
                  Vì một Việt Nam khỏe mạnh
                </h1>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed text-center sm:text-left drop-shadow">
                  VTV6 là kênh truyền hình chuyên biệt về thể thao của Đài Truyền hình Việt Nam. Nội dung chính của kênh bao gồm các bản tin, chuyên mục và chương trình tường thuật về thể thao trong nước và quốc tế do Trung tâm Truyền hình Thể thao sản xuất chính, với mục tiêu thúc đẩy phong trào thể thao quần chúng, thể thao học đường, thể thao chuyên nghiệp phát triển tại Việt Nam cũng như hướng đến rèn luyện, nâng cao sức khỏe cộng đồng và xây dựng con người phát triển toàn diện.
                </p>
                <div className="pt-2 flex justify-center">
                  <img
                    src="https://static.wikia.nocookie.net/logos/images/b/b0/VTV6_ident_29.05-07.06.2026_b%E1%BA%A3n_3.png/revision/latest/scale-to-width-down/1000?cb=20260603150528&path-prefix=vi"
                    alt="Vì một Việt Nam khỏe mạnh"
                    referrerPolicy="no-referrer"
                    className="w-full max-w-2xl md:max-w-3xl h-auto object-contain shadow-lg [image-rendering:pixelated] [image-rendering:-webkit-optimize-contrast]"
                  />
                </div>
              </div>

              {/* ACTION BUTTONS WITH LEFT AND RIGHT ARROWS AT BOTH ENDS */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
                {/* Left Arrow Button */}
                <VplaySecondaryButton
                  fullWidth={false}
                  size="compact"
                  onClick={handlePrev}
                  aria-label="Previous Banner"
                  title="Trang trước"
                  className="!w-11 !h-11 !px-0 flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5 text-[#1c1d1f]" />
                </VplaySecondaryButton>

                <div className="w-48 sm:w-56">
                  <VplayHeroButton fullWidth onClick={onWatchNow}>
                    Watch now
                  </VplayHeroButton>
                </div>
                <div className="w-48 sm:w-56">
                  <VplaySecondaryButton
                    fullWidth
                    onClick={() => {
                      playPopSound();
                      window.open('https://vi.wikipedia.org/wiki/VTV6', '_blank');
                    }}
                  >
                    Learn more
                  </VplaySecondaryButton>
                </div>

                {/* Right Arrow Button */}
                <VplaySecondaryButton
                  fullWidth={false}
                  size="compact"
                  onClick={handleNext}
                  aria-label="Next Banner"
                  title="Trang sau"
                  className="!w-11 !h-11 !px-0 flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5 text-[#1c1d1f]" />
                </VplaySecondaryButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM DOT INDICATORS */}
      <div className="flex items-center justify-center gap-2 z-10 pt-1">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              playPopSound();
              setCurrentSlide(idx);
            }}
            className={`h-2 transition-all duration-150 cursor-pointer ${
              currentSlide === idx
                ? 'w-6 bg-[#89dc69] border border-[#141414]'
                : 'w-2 bg-[#52565a] hover:bg-[#888c91]'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
