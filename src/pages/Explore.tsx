import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import useAxios from "axios-hooks";
import { useWindowSize } from "rooks";
import { useTheme, useMediaQuery } from "@mui/material";
import "leaflet/dist/leaflet.css";

import { State, constants } from "misc";

export const Explore = () => {
  const navigate = useNavigate();
  const [{ data: states }] = useAxios<State[]>({
    url: "/states",
    baseURL: constants.BASE_URL,
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { innerHeight } = useWindowSize();
  const [geoJsonData, setGeoJsonData] = useState<any[]>([]);

  useEffect(() => {
    const fetchGeoJsonData = async () => {
      const responses: AxiosResponse<any>[] = await Promise.all(
        constants.COUNTRY_CODES.map((geoJsonBorder) =>
          axios.get(`${constants.BASE_URL}/boundaries/${geoJsonBorder}.geojson`)
        )
      );
      const geoJsonData = responses.map((response) => response.data);
      setGeoJsonData(geoJsonData);
    };

    fetchGeoJsonData();
  }, []);

  return (
    <>
      {states && innerHeight && (
        <MapContainer
          style={{ height: isMobile ? innerHeight - 56 : innerHeight }}
          center={[0.255436, 6.602781]}
          zoom={4}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {geoJsonData.map((geoJson, index) => (
            <GeoJSON
              data={geoJson}
              eventHandlers={{
                click: () => navigate(`/province/${index + 1}`),
              }}
              style={(feature) => ({
                fillColor: states?.find((state) =>
                  state.provinces.includes(index + 1)
                )?.color,
                fillOpacity: 1,
                color: "white",
                weight: 1,
                opacity: 1,
              })}
              key={index}
            />
          ))}
        </MapContainer>
      )}
    </>
  );
};
