'use client';
import React from 'react';
import '../../assets/styles/hero-slider.css';
import Image from 'next/image';
import { trackEvent } from 'utils/mixpanel';

const HeroBannerSlider = () => {
  const handleCollectionBannerClick = (url: string) => {
    trackEvent('Header Collection Clicked', { BannerUrl: url });
  };
  return (
    <div className=" h-auto  max-h-[460px] w-full rounded-md">
      <Image
        onClick={(e: React.MouseEvent<HTMLImageElement>) => {
          e.preventDefault();
          handleCollectionBannerClick(
            'https://foxtale.in/cdn/shop/files/Foxtale_bestsellers_banners-04.jpg?v=1715687265'
          );
        }}
        priority={false}
        height={475}
        blurDataURL={`data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8PEBESExMWFhUVFxYXFxcWFRcVGBcXFxUXGBcWFxUYHSggGBolHRUVITEhJSkrLi4uGB8zODMtNygtLisBCgoKDg0OGhAQGy0lICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAMIBAwMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAABwQFBgECBAP/xAA9EAACAQMDAgQEAwYEBwAAAAABAgMABBEFEiExQVEGEyJhcQcygZGhFRYjM0JicoKSk7Gy0+Hw8QcjU4LC0uL/xAAaAQACAwEBAAAAAAAAAAAAAAABAwACBAUG/8QAMBEAAgIBAwIDBgUDBAMAAAAAAQIAAxEEEiExQVEGEyJhcYGR0QcyobHR4fAUI9Hh8RYjYpL/2gAMAwEAAhEDEQA/AJjRG4AOpL5UrqnO1OvGuH5SlWZek6WRaZSQFK6mz2ufUpVmp3bjrG2zTd5dFZ2Mx6VrDZc5b2wpM2UVjLG0p2Nvlj8aM1U6QhMlKlToCMlKlOgI1iQaxqNxDy2z5ftcVpMLibMWzy1dSjZilA9caLbqLslcZWctFvJbKtJCVB4Gksq3LZj0StKMyVymtwrsjKWpIC1WzGtaozJVzVax1F5UbUlIm02nvjup5FTp4gF41LmWW24GisXzBUlLjYFx8orIS%2FAlXt%2FI1PUekpafC6eQmPMk7VoUFfcMn0JrjlPVGw%2BhVmQ2LJ9IXy1eY9NvGUVclRg1Kblj8R6U6MlMlOgaMkqpUqAlSpUqAf%2BWiUVoU4qVKlQBrK1T7zOqKllTUp2F%2B8KzEwTq1T6Vm1G4qVKgJUKlSoA%2F9k=`}
        width={770}
        objectFit="cover"
        className="hidden h-auto w-full rounded-md md:block"
        src={`https://foxtale.in/cdn/shop/files/Foxtale_bestsellers_banners-04.jpg?v=1715687265`}
        alt="foxtale"
        quality={90}
        placeholder="blur"
      />
      <Image
        onClick={(e: React.MouseEvent<HTMLImageElement>) => {
          e.preventDefault();
          handleCollectionBannerClick(
            'https://foxtale.in/cdn/shop/files/Foxtale_bestsellers_banners-03.jpg?v=1715687265'
          );
        }}
        priority={false}
        height={140}
        blurDataURL={`data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8PEBESExMWFhUVFxYXFxcWFRcVGBcXFxUXGBcWFxUYHSggGBolHRUVITEhJSkrLi4uGB8zODMtNygtLisBCgoKDg0OGhAQGy0lICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAMIBAwMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAABwQFBgECBAP/xAA9EAACAQMDAgQEAwYEBwAAAAABAgMABBEFEiExQVEGEyJhcQcygZGhFRYjM0JicoKSk7Gy0+Hw8QcjU4LC0uL/xAAaAQACAwEBAAAAAAAAAAAAAAABAwACBAUG/8QAMBEAAgIBAwIDBgUDBAMAAAAAAQIAAxEEEiExQVEGEyJhcYGR0QcyobHR4fAUI9Hh8RYjYpL/2gAMAwEAAhEDEQA/AJjRG4AOpL5UrqnO1OvGuH5SlWZek6WRaZSQFK6mz2ufUpVmp3bjrG2zTd5dFZ2Mx6VrDZc5b2wpM2UVjLG0p2Nvlj8aM1U6QhMlKlToCMlKlOgI1iQaxqNxDy2z5ftcVpMLibMWzy1dSjZilA9caLbqLslcZWctFvJbKtJCVB4Gksq3LZj0StKMyVymtwrsjKWpIC1WzGtaozJVzVax1F5UbUlIm02nvjup5FTp4gF41LmWW24GisXzBUlLjYFx8orIS%2FAlXt%2FI1PUekpafC6eQmPMk7VoUFfcMn0JrjlPVGw%2BhVmQ2LJ9IXy1eY9NvGUVclRg1Kblj8R6U6MlMlOgaMkqpUqAlSpUqAf%2BWiUVoU4qVKlQBrK1T7zOqKllTUp2F%2B8KzEwTq1T6Vm1G4qVKgJUKlSoA%2F9k=`}
        width={220}
        objectFit="cover"
        className="block h-full w-full rounded-md md:hidden"
        src={`https://foxtale.in/cdn/shop/files/Foxtale_bestsellers_banners-03.jpg?v=1715687265`}
        alt="Foxtale"
        quality={90}
        placeholder="blur"
      />
    </div>
  );
};

export default HeroBannerSlider;
