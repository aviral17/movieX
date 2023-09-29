import React, { useState } from "react";
import { ContentWrapper } from "../../../components";
import SwitchTabs from "../../../components/switchTabs/SwitchTabs";
import Carousel from "../../../components/carousel/Carousel";
import useFetch from "../../../hooks/useFetch";

// For more info on Endpoints, check  ------> https://developers.themoviedb.org/3/movies/get-popular-movies
// For more info on Endpoints, check  ------> https://developers.themoviedb.org/3/tv/get-popular-tv-shows

// We are using item.media_type(media_type key in trending object) for Trending.jsx but using endpoint for Popular.jsx in Carousel.jsx as Popular dont have media_type key

const Popular = () => {
  const [endpoint, setEndpoint] = useState("movie"); // for `time_window`  endpoint
  const { data, loading } = useFetch(`/${endpoint}/popular`); // tv and movie endpoints are similar
  // console.log("Data  inside Popular = ", data);

  // Note: this function only taking tab and not index as per SwitchTabs, as this dont required index
  const onTabChange = (tab) => {
    setEndpoint(tab === "Movies" ? "movie" : "tv");
  };

  // console.log("Endpoint inside Popular = ", endpoint);
  return (
    <div className="carouselSection">
      <ContentWrapper>
        <span className="carouselTitle">What's Popular</span>
        {/* To make switchtabs dynamic, to show like, daily,weekly,monthly,yearly,alltime all these 3,4,5 fields */}
        <SwitchTabs data={["Movies", "TV Shows"]} onTabChange={onTabChange} />
      </ContentWrapper>
      <Carousel data={data?.results} loading={loading} endpoint={endpoint} />
    </div>
  );
};

export default Popular;
