import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { getOnTheAirTv, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";

const Wrapper = styled.div`
  background: black;
  padding-top: 220px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CategoryWrap = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  top: -100px;
`;

const SliderPrevBtn = styled.div`
  width: 40px;
  height: 40px;
  margin-right: 20px;
  cursor: pointer;
`;

const SliderNextBtn = styled(SliderPrevBtn)``;

const Slider = styled.div`
  position: relative;
  top: -100px;
  display: flex;
`;

const SliderName = styled.div`
  font-size: 25px;
  padding: 0px 30px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  padding: 0px 30px;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${props => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 35vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${props => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${props => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const OverviewWrap = styled.div`
  display: flex;
  justify-content: space-evenly;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 30px;
  margin: 0 auto;
`;

const OverviewContents = styled.div`
  max-width: 350px;

  div {
    padding-bottom: 30px;
  }
`;

const BigOverview = styled.p`
  color: ${props => props.theme.white.lighter};
`;

const PosterImg = styled.div`
  width: 20vmin;
  height: 30vmin;
  border-radius: 8px;
  background-size: cover;
  background-position: center center;
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

const offset = 6;

function OnTheAirTv() {
  const navigate = useNavigate();
  const tvMatch: PathMatch<string> | null = useMatch("/tv/:tvId");

  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["ontheairTv"],
    getOnTheAirTv,
    { retry: false }
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving(prev => !prev);
  const onBoxClicked = (tvId: number) => {
    navigate(`/tv/${tvId}`);
  };
  const onOverlayClick = () => navigate("/tv");
  const clickedTv =
    tvMatch?.params.tvId &&
    data?.results.find(tv => tv.id + "" === tvMatch.params.tvId);

  const clickPrevBtn = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalTvs = data.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setIndex(prev => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const clickNextBtn = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalTvs = data.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setIndex(prev => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  return (
    <>
      <Wrapper>
        {isLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          <>
            <CategoryWrap>
              <SliderName>ON THE AIR</SliderName>
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

            <Slider>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={index}
                >
                  {data?.results
                    .slice(1)
                    .slice(offset * index, offset * index + offset)
                    .map(tv => (
                      <Box
                        layoutId={tv.id + ""}
                        key={tv.id}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVariants}
                        onClick={() => onBoxClicked(tv.id)}
                        transition={{ type: "tween" }}
                        bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{tv.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
            <AnimatePresence>
              {tvMatch ? (
                <>
                  <Overlay
                    onClick={onOverlayClick}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                  <BigMovie
                    style={{
                      top: scrollY.get() + 100,
                      backgroundColor: "gray",
                    }}
                    layoutId={tvMatch.params.tvId}
                  >
                    {clickedTv && (
                      <>
                        <BigCover
                          style={{
                            backgroundImage: `linear-gradient(to top, black, transparent),
                            url(${makeImagePath(
                              clickedTv.backdrop_path,
                              "w500"
                            )})`,
                          }}
                        />
                        <BigTitle>{clickedTv.title}</BigTitle>

                        <OverviewWrap>
                          <PosterImg
                            style={{
                              backgroundImage: `url(${makeImagePath(
                                clickedTv.poster_path
                              )})`,
                            }}
                          ></PosterImg>
                          <OverviewContents>
                            <div>Release: {clickedTv.release_date}</div>
                            <BigOverview>{clickedTv.overview}</BigOverview>
                          </OverviewContents>
                        </OverviewWrap>
                      </>
                    )}
                  </BigMovie>
                </>
              ) : null}
            </AnimatePresence>
          </>
        )}
      </Wrapper>
    </>
  );
}

export default OnTheAirTv;
