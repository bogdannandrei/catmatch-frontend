import { useEffect, useState } from "react";
import {
    discoverCatProfiles,
    getMyCatProfiles,
    type CatProfileResponse,
} from "../api/catProfilesApi";
import {
    createCatSwipe,
    type CatSwipeDecision,
    undoCatSwipe,
} from "../api/catSwipesApi";

const DISCOVER_LIMIT = 20;
const REFILL_THRESHOLD = 5;

type LastSwipe = {
    swiperCatProfileId: number;
    targetCat: CatProfileResponse;
    decision: CatSwipeDecision;
};

export function useDiscoverCats() {
    const [myCats, setMyCats] = useState<CatProfileResponse[]>([]);
    const [cats, setCats] = useState<CatProfileResponse[]>([]);
    const [selectedSwiperCatId, setSelectedSwiperCatId] = useState<number | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingDiscover, setIsLoadingDiscover] = useState(false);
    const [isRefilling, setIsRefilling] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [swipingCatId, setSwipingCatId] = useState<number | null>(null);
    const [matchMessage, setMatchMessage] = useState<string | null>(null);
    const [matchedCat, setMatchedCat] = useState<CatProfileResponse | null>(null);
    const [lastSwipe, setLastSwipe] = useState<LastSwipe | null>(null);
    const [isUndoing, setIsUndoing] = useState(false);

    useEffect(() => {
        async function loadMyCats() {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const myCatProfiles = await getMyCatProfiles();

                setMyCats(myCatProfiles);

                if (myCatProfiles.length > 0) {
                    setSelectedSwiperCatId(myCatProfiles[0].id);
                }
            } catch (error) {
                console.error("Failed to load my cats:", error);
                setErrorMessage("Could not load your cats.");
            } finally {
                setIsLoading(false);
            }
        }

        loadMyCats();
    }, []);

    useEffect(() => {
        async function loadDiscoverCats() {
            if (!selectedSwiperCatId) {
                setCats([]);
                setLastSwipe(null);
                return;
            }

            try {
                setIsLoadingDiscover(true);
                setErrorMessage(null);
                setMatchMessage(null);
                setMatchedCat(null);
                setLastSwipe(null);

                const discoverableCats = await discoverCatProfiles(
                    selectedSwiperCatId,
                    DISCOVER_LIMIT
                );

                setCats(discoverableCats);
            } catch (error) {
                console.error("Failed to load discover cats:", error);
                setErrorMessage("Could not load discover cats.");
            } finally {
                setIsLoadingDiscover(false);
            }
        }

        loadDiscoverCats();
    }, [selectedSwiperCatId]);

    async function handleSwipe(targetCatProfileId: number, decision: CatSwipeDecision) {
        if (!selectedSwiperCatId) {
            setErrorMessage("Select one of your cats before swiping.");
            return;
        }

        const swipedCat = cats.find((cat) => cat.id === targetCatProfileId);

        try {
            setSwipingCatId(targetCatProfileId);
            setErrorMessage(null);
            setMatchMessage(null);

            const swipeResponse = await createCatSwipe({
                swiperCatProfileId: selectedSwiperCatId,
                targetCatProfileId,
                decision,
            });

            if (swipedCat) {
                setLastSwipe({
                    swiperCatProfileId: selectedSwiperCatId,
                    targetCat: swipedCat,
                    decision,
                });
            }

            const remainingCats = cats.filter((cat) => cat.id !== targetCatProfileId);

            setCats(remainingCats);

            if (swipeResponse.matched && swipedCat) {
                setMatchedCat(swipedCat);
            }

            if (remainingCats.length <= REFILL_THRESHOLD) {
                await refillDiscoverCats(selectedSwiperCatId, remainingCats);
            }
        } catch (error) {
            console.error("Failed to swipe cat profile:", error);
            setErrorMessage("Could not save your swipe.");
        } finally {
            setSwipingCatId(null);
        }
    }

    function handleCloseMatchAnimation() {
        setMatchedCat(null);
    }

    async function handleUndoLastSwipe() {
        if (!lastSwipe) {
            return;
        }

        try {
            setIsUndoing(true);
            setErrorMessage(null);
            setMatchMessage(null);

            await undoCatSwipe(
                lastSwipe.swiperCatProfileId,
                lastSwipe.targetCat.id
            );

            setCats((currentCats) => [
                lastSwipe.targetCat,
                ...currentCats.filter((cat) => cat.id !== lastSwipe.targetCat.id),
            ]);

            setLastSwipe(null);
        } catch (error) {
            console.error("Failed to undo swipe:", error);
            setErrorMessage("Could not undo last swipe.");
        } finally {
            setIsUndoing(false);
        }
    }

    async function refillDiscoverCats(
        swiperCatProfileId: number,
        currentCats: CatProfileResponse[]
    ) {
        try {
            setIsRefilling(true);

            const newCats = await discoverCatProfiles(
                swiperCatProfileId,
                DISCOVER_LIMIT
            );

            setCats((latestCats) => mergeUniqueCats(latestCats, newCats, currentCats));
        } catch (error) {
            console.error("Failed to refill discover cats:", error);
        } finally {
            setIsRefilling(false);
        }
    }

    return {
        myCats,
        cats,
        selectedSwiperCatId,
        setSelectedSwiperCatId,
        isLoading,
        isLoadingDiscover,
        isRefilling,
        errorMessage,
        swipingCatId,
        matchMessage,
        lastSwipe,
        isUndoing,
        handleSwipe,
        handleUndoLastSwipe,
        matchedCat,
        handleCloseMatchAnimation,
    };
}

function mergeUniqueCats(
    latestCats: CatProfileResponse[],
    newCats: CatProfileResponse[],
    fallbackCurrentCats: CatProfileResponse[]
): CatProfileResponse[] {
    const baseCats = latestCats.length > 0 ? latestCats : fallbackCurrentCats;
    const existingIds = new Set(baseCats.map((cat) => cat.id));

    const uniqueNewCats = newCats.filter((cat) => !existingIds.has(cat.id));

    return [...baseCats, ...uniqueNewCats];
}