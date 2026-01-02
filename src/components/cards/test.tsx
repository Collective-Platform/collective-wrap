import WorldMap from "@/components/ui/world-map";

export function WorldMapDemo() {
  return (
    <div className=" py-40 dark:bg-black bg-white w-full">
      <WorldMap
        dots={[
          {
            start: { lat: 3.139, lng: 101.6869 }, // KL
            end: { lat: 3.0738, lng: 101.5183 }, // Shah Alam
          },
          {
            start: { lat: 3.139, lng: 101.6869 }, // KL
            end: { lat: 5.4141, lng: 100.3288 }, // Penang
          },
          {
            start: { lat: 3.139, lng: 101.6869 }, // KL
            end: { lat: 6.121, lng: 100.369 }, // Alor Setar
          },
          {
            start: { lat: 3.139, lng: 101.6869 }, // KL
            end: { lat: 2.1896, lng: 102.2501 }, // Malacca
          },
          {
            start: { lat: 3.139, lng: 101.6869 }, // KL
            end: { lat: 1.4927, lng: 103.7414 }, // Johor Bahru
          },
          {
            start: { lat: 3.139, lng: 101.6869 }, // KL
            end: { lat: 5.8405, lng: 118.1179 }, // Sandakan
          },
          {
            start: { lat: 3.139, lng: 101.6869 }, // KL
            end: { lat: -6.2088, lng: 106.8456 }, // Jakarta
          },
          {
            start: { lat: 3.139, lng: 101.6869 }, // KL
            end: { lat: 14.5995, lng: 120.9842 }, // Manila
          },
          {
            start: { lat: 3.139, lng: 101.6869 }, // KL
            end: { lat: 11.5564, lng: 104.9282 }, // Phnom Penh
          },
          {
            start: { lat: 3.139, lng: 101.6869 }, // KL
            end: { lat: 23.6978, lng: 120.9605 }, // Taiwan
          },
          {
            start: { lat: 3.139, lng: 101.6869 }, // KL
            end: { lat: 26.2124, lng: 127.6809 }, // Okinawa
          },
          {
            start: { lat: 3.139, lng: 101.6869 }, // KL
            end: { lat: 18.5204, lng: 73.8567 }, // Pune
          },
        ]}
      />
    </div>
  );
}
