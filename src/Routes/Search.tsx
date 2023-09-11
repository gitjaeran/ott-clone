import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router";
import { searchMovies, searchTv } from "../api";
import { makeImagePath } from "../utils";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";

const Wrap = styled.div`
  margin-top: 80px;
  padding: 0px 30px;
`;

const CategoryWrap = styled.div`
  display: flex;
  width: 100%;
  padding-top: 20px;
`;

const SliderName = styled.div`
  font-size: 25px;
  padding: 0px 30px;
`;

const SliderPrevBtn = styled.div`
  width: 40px;
  height: 40px;
  margin-right: 20px;
  cursor: pointer;
`;

const SliderNextBtn = styled(SliderPrevBtn)``;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(8, 1fr);
  position: absolute;
  width: 100%;
  padding: 0px 30px;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${props => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  width: 200px;
  height: 300px;
  font-size: 66px;
  cursor: pointer;

  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${props => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const offset = 8;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data: movieData, isLoading: isLoadingMovie } = useQuery(
    ["movies"],
    () => searchMovies(keyword || "")
  );
  const { data: tvData, isLoading: isLoadingTv } = useQuery(["tv"], () =>
    searchTv(keyword || "")
  );

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving(prev => !prev);

  const clickPrevBtn = () => {
    if (movieData | tvData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = movieData | (tvData.results.length - 1);
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex(prev => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const clickNextBtn = () => {
    if (movieData | tvData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = movieData | (tvData.results.length - 1);
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex(prev => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  return (
    <>
      <Wrap>
        {isLoadingMovie || isLoadingTv ? (
          <p>Loading...</p>
        ) : (
          <>
            <CategoryWrap>
              <SliderName>MOVIE</SliderName>
              <div
                style={{
                  display: "flex",
                }}
              >
                <SliderPrevBtn onClick={clickPrevBtn}>
                  <RxChevronLeft size={30} />
                </SliderPrevBtn>
                <SliderNextBtn onClick={clickNextBtn}>
                  <RxChevronRight size={30} />
                </SliderNextBtn>
              </div>
            </CategoryWrap>

            <AnimatePresence initial={false}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {movieData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map(
                    (movie: {
                      id: number;
                      title: string;
                      poster_path: string;
                    }) => (
                      <Box
                        layoutId={movie.id + ""}
                        key={movie.id}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVariants}
                        transition={{ type: "tween" }}
                        bgPhoto={makeImagePath(movie.poster_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    )
                  )}
              </Row>
            </AnimatePresence>

            <div style={{ paddingTop: "380px" }}></div>

            <CategoryWrap>
              <SliderName>TV</SliderName>
              <div
                style={{
                  display: "flex",
                }}
              >
                <SliderPrevBtn onClick={clickPrevBtn}>
                  <RxChevronLeft size={30} />
                </SliderPrevBtn>
                <SliderNextBtn onClick={clickNextBtn}>
                  <RxChevronRight size={30} />
                </SliderNextBtn>
              </div>
            </CategoryWrap>

            <AnimatePresence initial={false}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {tvData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map(
                    (tv: { id: number; name: string; poster_path: string }) => (
                      <Box
                        layoutId={tv.id + ""}
                        key={tv.id}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVariants}
                        transition={{ type: "tween" }}
                        bgPhoto={makeImagePath(tv.poster_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{tv.name}</h4>
                        </Info>
                      </Box>
                    )
                  )}
              </Row>
            </AnimatePresence>
          </>
        )}
      </Wrap>
    </>
  );
}

export default Search;
