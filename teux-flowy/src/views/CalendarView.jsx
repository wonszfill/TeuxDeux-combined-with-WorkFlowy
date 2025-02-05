import { CalendarCard } from "../Components/CalendarCard/CalendarCard";
import { format, addDays, previousDay } from "date-fns";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/fontawesome-free-solid";
import SlidingCalendar from "../Components/SlidingCalendar/SlidingCalendar";
import { PALLETE } from "../Colors/colors";

// Config values

const slidingWindowsSize = 5;
const baseOffset = 3;
const totalSize = slidingWindowsSize + baseOffset * 2;

const CalendarViewWrapper = styled.div`
    
`

const CalendarCarouselWrapper = styled.div`
    display: grid;
    grid-template-columns: 0.3fr 9fr 0.3fr;
    margin-top: 4rem;
`;

const CalendarSideContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const DaysViewport = styled.div`
    --baseOffset: ${baseOffset};
    --offset: 0;
    --totalOffset: calc(var(--offset) + var(--baseOffset));
    --totalSize: ${totalSize};
    --slidingWindowSize: ${slidingWindowsSize};
    box-sizing: border-box;
    width: 100%;
    border: none;
    margin: 5rem auto;
    overflow: hidden;
    border: 1px ${PALLETE.greyST} solid;
    border-top: none;
    border-bottom: none;
`;

const DaysContainer = styled.section`
    box-sizing: border-box;
    height: 100%;
    display: flex;
    transform: translateX(calc(-1 * 100% * var(--totalOffset) / var(--totalSize)));
    width: calc(100% * var(--totalSize) / var(--slidingWindowSize));
`;

const DayContainer = styled.section`
    flex-basis: calc(100% / var(--slidingWindowSize));
    border-right: 0.05rem ${PALLETE.greyST} solid;
    box-sizing: border-box;
`;

const StyledArrow = styled.button`
    border: none;
    opacity: 1;
    cursor: pointer;
    width: 100%;
    height: 100%;
    color: ${PALLETE.primary};
    background: transparent;
    &:hover {
        opacity: 0.8;
        background-color: ${PALLETE.secondaryST};
    }
`;

const StyledLeftArrow = styled(StyledArrow)``;

const StyledRightArrow = styled(StyledArrow)``;

const CalendarView = () => {
    const [activeDay, setActiveDay] = useState(new Date(new Date().setHours(0, 0, 0, 0)));
    const [targetOffset, setTargetOffset] = useState(0);

    const containerRef = useRef(null);
    const currentOffset = useRef(0);



    useEffect(() => {
        let id;
        const updateIncrementallyCarouselPositionAfterAnimationStart = () => {
            const currentCardsContainer = containerRef.current;

            currentOffset.current =
                currentOffset.current > targetOffset
                    ? Math.max(currentOffset.current - 0.06, targetOffset)
                    : Math.min(currentOffset.current + 0.06, targetOffset);

            if (currentCardsContainer) {
                currentCardsContainer.style.setProperty("--offset", currentOffset.current);
            }

            if (currentOffset.current === targetOffset) {
                setActiveDay((prevState) => addDays(prevState, targetOffset));
                setTargetOffset(0);
                currentOffset.current = 0;
                currentCardsContainer.style.setProperty("--offset", currentOffset.current);

                return;
            }
            id = requestAnimationFrame(updateIncrementallyCarouselPositionAfterAnimationStart);
        };

        updateIncrementallyCarouselPositionAfterAnimationStart();

        return () => {
            cancelAnimationFrame(id);
        };
    }, [targetOffset]);

    const carouselForward = () => {
        setTargetOffset((prevState) => prevState + 1);
    };

    const carouselBackward = () => {
        setTargetOffset((prevState) => prevState - 1);
    };

    const days = Array.from({ length: totalSize }, (_, i) => {
        return addDays(activeDay, i - 4);
    });

    return (
            <CalendarViewWrapper>
                <CalendarCarouselWrapper>
                    <CalendarSideContainer>
                        <StyledLeftArrow onClick={carouselBackward}>
                        <FontAwesomeIcon icon={faChevronLeft} size="3x" />
                    </StyledLeftArrow>
                    </CalendarSideContainer>

                    <DaysViewport ref={containerRef}>
                        <DaysContainer>
                            {days.map((day) => {
                                return (
                                    <DayContainer
                                        key={day.toString()}>
                                        <CalendarCard
                                            date={day}
                                            key={`${day.toString()}card`}/>
                                    </DayContainer>
                                );
                            })}
                        </DaysContainer>
                    </DaysViewport>
                    <CalendarSideContainer>
                        <StyledRightArrow onClick={carouselForward}>
                            <FontAwesomeIcon icon={faChevronRight} size="3x" />
                        </StyledRightArrow>
                    </CalendarSideContainer>
                </CalendarCarouselWrapper>
            </CalendarViewWrapper>
    );
};

export { CalendarView };
