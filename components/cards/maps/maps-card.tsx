"use client";

import { CardWrapper } from "@/components/cards/maps/card-wrapper";
import Map, {
  Marker,
  Source,
  Layer,
  LayerProps,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  GeoJSONSourceRaw,
  Popup,
} from "react-map-gl";
import Pin from "./pin";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { User } from "@prisma/client";

interface MapsCardProps {
  data: User[];
  center: { latitude: number; longitude: number };
}
export const MapsCard: React.FC<MapsCardProps> = ({ data, center }) => {
  const containerStyle = {
    width: "100%",
    height: "50vh",
  };
  const [popupInfo, setPopupInfo] = useState<User | null>(null);
  const mapRef = useRef<any>(null); 
  const pins = useMemo(() => {
    return data.map((user) => (
      <Marker
        key={`marker-${user.id}`}
        latitude={user.latitude || 16.411991}
        longitude={user.longitude || 120.594736}
        anchor="bottom"
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          setPopupInfo(user);
        }}
      >
        <Pin />
      </Marker>
    ));
  }, [data]);
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [center.longitude, center.latitude],
        zoom: 16,
        speed: 1.2, // Make the flying animation slower
        curve: 1, // Change the speed curve of the flyTo animation
        easing(t:any) {
          return t;
        },
      });
    }
  }, [center]);
  
  return (
    <CardWrapper headerLabel="Bfp">
      <div className="flex justify-between items-center py-4">
        <h1 className="font-bold text-2xl">Maps</h1>
      </div>
      <div className="h-2/3 w-full">
        <Map
          mapLib={import("mapbox-gl")}
          initialViewState={{
            latitude: center.latitude,
            longitude: center.longitude,
            zoom: 16,
          }}
          style={containerStyle}
          mapStyle="mapbox://styles/mapbox/standard"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAP_BOX_KEY}
        >
          <GeolocateControl position="top-right" />
          <FullscreenControl position="top-right" />
          <NavigationControl position="top-right" />
          <ScaleControl />
          {pins}
          {popupInfo && (
            <Popup
              anchor="top"
              longitude={Number(popupInfo.longitude)}
              latitude={Number(popupInfo.latitude)}
              onClose={() => setPopupInfo(null)}
            >
              <div>{popupInfo.name}</div>
            </Popup>
          )}
         
        </Map>
      </div>
    </CardWrapper>
  );
};
