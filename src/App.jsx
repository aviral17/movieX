import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { fetchDataFromApi } from "./utils/api";

import { useSelector, useDispatch } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";

import { Header, Footer } from "./components";
import { Home, Details, SearchResult, Explore, PageNotFound } from "./pages";

import Loader from "./components/loader/Loader";

// NOTE that, console.log() API calling and printing 2 times because of React.strictmode in index.jsx/main.jsx for security purposes
// Link ----> https://redux-toolkit.js.org/tutorials/quick-start#use-redux-state-and-actions-in-react-components

// For getting Full image url link, we need base_url + ..... -------> https://developers.themoviedb.org/3/configuration/get-api-configuration
// When we get fetch result from /configuration, we also need to define size in url link, and so we must use "original" instead of some random given size, "original" is last element of that object

// For Genres, we have two different APIs for TVshows and Movies, so we gonna handle their Promises via Promise.all(), Link ------> https://developers.themoviedb.org/3/genres/get-movie-list

// We can simply use <img /> tag if Image loading takes time with <Img /> lazyloading

function App() {
  const dispatch = useDispatch();
  const url = useSelector((state) => state?.home?.url);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApiConfig = () => {
    setIsLoading(true);
    fetchDataFromApi("/configuration").then((res) => {
      // console.log("Res = ", res);

      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      };

      dispatch(getApiConfiguration(url)); // (secure_base_url + 'original') * 3 times for 3 variables
    });
  };

  useEffect(() => {
    fetchApiConfig();
    genresCall();
  }, []);

  const genresCall = async () => {
    // setIsLoading(true);
    let promises = [];
    let endPoints = ["tv", "movie"];
    let allGenres = {};

    endPoints.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`));
    });

    const data = await Promise.all(promises); // this will resolve and return both 'tv' and 'movie' promises together
    // console.log("genres data from Promise", data);
    // As data has genres property so directly using it as {genres}
    data.map(({ genres }) => {
      return genres.map((item) => (allGenres[item.id] = item));
    });

    dispatch(getGenres(allGenres));
    // console.log("allGenres = ", allGenres); // id: {id: , name: }
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:mediaType/:id" element={<Details />} />
        <Route path="/search/:query" element={<SearchResult />} />
        <Route path="/explore/:mediaType" element={<Explore />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

// const [page, setPage] = useState(10);
// const [movies, setMovies] = useState([]);

// useEffect(() => {
//   fetchDataFromApi("/movie/popular", { page }).then((res) => {
//     setMovies((prevMovies) => [...prevMovies, ...res.results]);
//   });
// }, [page]);

// console.log("Movies = ", movies);
