import { useEffect, useState } from "react";
import {
    discoverCatProfiles,
    getMyCatProfiles,
    type CatProfileResponse,
} from "../api/catProfilesApi";
import {
    createCatSwipe,
    type CatSwipeDecision,
} from "../api/catSwipesApi";

export function useDiscoverCats() {
    const [myCats, setMyCats] = useState<CatProfileResponse[]>([]);
    const [cats, setCats] = useState<CatProfileResponse[]>([]);
    const [selectedSwiperCatId, setSelectedSwiperCatId] = useState<number | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingDiscover, setIsLoadingDiscover] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [swipingCatId, setSwipingCatId] = useState<number | null>(null);
    const [matchMessage, setMatchMessage] = useState<string | null>(null);

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
                return;
            }

            try {
                setIsLoadingDiscover(true);
                setErrorMessage(null);
                setMatchMessage(null);

                const discoverableCats = await discoverCatProfiles(selectedSwiperCatId);

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

        try {
            setSwipingCatId(targetCatProfileId);
            setErrorMessage(null);
            setMatchMessage(null);

            const swipeResponse = await createCatSwipe({
                swiperCatProfileId: selectedSwiperCatId,
                targetCatProfileId,
                decision,
            });

            setCats((currentCats) =>
                currentCats.filter((cat) => cat.id !== targetCatProfileId)
            );

            if (swipeResponse.matched) {
                setMatchMessage("It's a match! 😻");
            }
        } catch (error) {
            console.error("Failed to swipe cat profile:", error);
            setErrorMessage("Could not save your swipe.");
        } finally {
            setSwipingCatId(null);
        }
    }

    return {
        myCats,
        cats,
        selectedSwiperCatId,
        setSelectedSwiperCatId,
        isLoading,
        isLoadingDiscover,
        errorMessage,
        swipingCatId,
        matchMessage,
        handleSwipe,
    };
}